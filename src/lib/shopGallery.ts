/**
 * Live content from ShopFlow.
 *
 * The owner manages photos, team, reviews and the header logo in ShopFlow →
 * Settings; they appear here without a deploy. Everything is fetched from one
 * /info response, shared across the page.
 *
 * There are no bundled photos in this project. Where nothing has been
 * uploaded, components render a designed motif (Motif.tsx) — never stock.
 */

import { useEffect, useState } from "react";
import { publicApi, shopflow } from "@/config/shopflow";
import { tagFromCaption } from "@/content/gallery";
import type { GalleryTag } from "@/content/services";

export type ShopPhoto = {
  id: string;
  url: string;
  caption: string;
  alt: string;
  tag: GalleryTag | null;
};
export type TeamMember = { id: string; name: string; title: string; bio: string; photo: string };
export type ShopReview = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  service: string;
  createdAt: string;
};

/** Uploads are served as /uploads/:shopId/:file from the platform host. */
const resolveUrl = (u: string) => (u.startsWith("http") ? u : shopflow.apiBase + u);

let infoPromise: Promise<Record<string, unknown> | null> | null = null;

export function getInfo(): Promise<Record<string, unknown> | null> {
  if (!infoPromise) {
    infoPromise = fetch(publicApi("/info"))
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .catch(() => null); // callers keep their fallback
  }
  return infoPromise;
}

/* ------------------------------------------------------------- gallery -- */

export async function fetchShopGallery(): Promise<ShopPhoto[]> {
  const info = await getInfo();
  if (!info) return [];
  const items = Array.isArray(info.gallery) ? info.gallery : [];
  return items
    .filter((g: { url?: string }) => typeof g?.url === "string" && g.url)
    .map((g: { id?: string; url: string; caption?: string }) => {
      const caption = String(g.caption ?? "").trim();
      return {
        id: String(g.id ?? g.url),
        url: resolveUrl(g.url),
        caption,
        alt: caption || "Work completed by Street Soundz NM",
        tag: caption ? tagFromCaption(caption) : null,
      };
    });
}

export function useShopGallery(): { photos: ShopPhoto[]; loading: boolean } {
  const [photos, setPhotos] = useState<ShopPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    fetchShopGallery().then((p) => {
      if (!alive) return;
      setPhotos(p);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);
  return { photos, loading };
}

/* -------------------------------------------------------- site images -- */

export async function fetchSiteImages(): Promise<Record<string, string>> {
  const info = await getInfo();
  const raw =
    info && typeof info.siteImages === "object" && info.siteImages
      ? (info.siteImages as Record<string, unknown>)
      : {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v === "string" && v) out[k] = resolveUrl(v);
  }
  return out;
}

/**
 * An owner-overridable image slot. Returns "" until (and unless) the owner has
 * set that slot in ShopFlow — the caller renders its motif in the meantime.
 */
export function useSiteImage(slot: string): string {
  const [src, setSrc] = useState("");
  useEffect(() => {
    let alive = true;
    fetchSiteImages().then((imgs) => {
      if (alive && imgs[slot]) setSrc(imgs[slot]);
    });
    return () => {
      alive = false;
    };
  }, [slot]);
  return src;
}

/**
 * Like `useSiteImage`, but only accepts the upload when it is wide enough for
 * a full-bleed band. A square or portrait upload gets centre-cropped into the
 * hero and loses its subject, so we keep the motif until a landscape photo is
 * uploaded. The probe runs at idle, low priority, so it never competes with
 * the first paint.
 */
export function useWideSiteImage(slot: string, minRatio = 1.4): string {
  const [src, setSrc] = useState("");

  useEffect(() => {
    let alive = true;
    let idle: number | undefined;

    fetchSiteImages().then((imgs) => {
      const candidate = imgs[slot];
      if (!alive || !candidate) return;

      const probe = () => {
        if (!alive) return;
        const img = new Image();
        img.decoding = "async";
        (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = "low";
        img.onload = () => {
          if (!alive) return;
          if (img.naturalWidth / img.naturalHeight >= minRatio) setSrc(candidate);
        };
        img.src = candidate;
      };

      const ric = (
        window as unknown as { requestIdleCallback?: (cb: () => void, o?: object) => number }
      ).requestIdleCallback;
      idle = ric ? ric(probe, { timeout: 3000 }) : window.setTimeout(probe, 1200);
    });

    return () => {
      alive = false;
      if (idle !== undefined) window.clearTimeout(idle);
    };
  }, [slot, minRatio]);

  return src;
}

/* ---------------------------------------------------------------- team -- */

export async function fetchSiteTeam(): Promise<TeamMember[]> {
  const info = await getInfo();
  const raw = info && Array.isArray(info.siteTeam) ? info.siteTeam : [];
  return raw
    .filter((m: { name?: string }) => m && typeof m.name === "string" && m.name.trim())
    .map((m: { id?: string; name: string; title?: string; bio?: string; photo?: string }) => ({
      id: String(m.id ?? m.name),
      name: String(m.name),
      title: String(m.title ?? ""),
      bio: String(m.bio ?? ""),
      photo: m.photo ? resolveUrl(String(m.photo)) : "",
    }));
}

export function useSiteTeam(): TeamMember[] {
  const [team, setTeam] = useState<TeamMember[]>([]);
  useEffect(() => {
    let alive = true;
    fetchSiteTeam().then((t) => alive && setTeam(t));
    return () => {
      alive = false;
    };
  }, []);
  return team;
}

/* ------------------------------------------------------------- reviews -- */

/**
 * Reviews the shop has collected and marked "featured" in ShopFlow. Shown
 * as social proof; never emitted as structured data (see content/reviews.ts).
 */
export async function fetchShopReviews(): Promise<ShopReview[]> {
  const info = await getInfo();
  const raw = info && Array.isArray(info.featuredReviews) ? info.featuredReviews : [];
  return raw
    .filter((r: { comment?: string; rating?: number }) => r && r.comment && Number(r.rating) > 0)
    .map(
      (
        r: { name?: string; rating: number; comment: string; service?: string; createdAt?: string },
        i: number,
      ) => ({
        id: `${r.createdAt ?? i}-${i}`,
        name: String(r.name ?? "Customer"),
        rating: Math.max(1, Math.min(5, Math.round(Number(r.rating)))),
        comment: String(r.comment),
        service: String(r.service ?? ""),
        createdAt: String(r.createdAt ?? ""),
      }),
    );
}

export function useShopReviews(): ShopReview[] {
  const [reviews, setReviews] = useState<ShopReview[]>([]);
  useEffect(() => {
    let alive = true;
    fetchShopReviews().then((r) => alive && setReviews(r));
    return () => {
      alive = false;
    };
  }, []);
  return reviews;
}
