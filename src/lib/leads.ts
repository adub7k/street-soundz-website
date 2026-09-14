// Lead capture client for the ShopFlow public API.
// Endpoints (server: shopflow-platform routes/public.js):
//   POST /api/public/:slug/lead          — create/update lead (deduped by phone)
//   POST /api/public/:slug/upload        — photo upload (data URL → hosted URL)
import { publicApi } from "@/config/shopflow";

/* ---------------- validation ---------------- */

export const phoneDigits = (v: string) => v.replace(/\D/g, "");
export const isValidPhone = (v: string) => {
  const d = phoneDigits(v);
  return d.length === 10 || (d.length === 11 && d.startsWith("1"));
};
export const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const isValidYear = (v: string) => {
  const n = Number(v);
  return /^\d{4}$/.test(v.trim()) && n >= 1950 && n <= new Date().getFullYear() + 2;
};

/* ---------------- ad attribution ----------------
 * First-touch utm_* params are captured once per session so a visitor who
 * browses around before submitting still credits the ad click. */

const UTM_KEY = "sf_attribution";

type Attribution = {
  utm: Record<string, string>;
  referrer: string;
  landing?: string;
  click?: Record<string, string>;
};

/**
 * Ad platforms append their own click ID whether or not the campaign was built
 * with UTMs. A click ID stands in as the source when no utm_source was passed,
 * so an ad lead is still labelled facebook / google in ShopFlow. An explicit
 * utm_source always wins.
 */
const CLICK_IDS: { param: string; source: string; medium: string }[] = [
  { param: "fbclid", source: "facebook", medium: "paid-social" },
  { param: "gclid", source: "google", medium: "cpc" },
];

export function captureAttribution() {
  try {
    if (sessionStorage.getItem(UTM_KEY)) return;
    const p = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const k of ["source", "medium", "campaign", "term", "content"]) {
      const v = p.get(`utm_${k}`);
      if (v) utm[k] = v;
    }

    const click: Record<string, string> = {};
    for (const c of CLICK_IDS) {
      const v = p.get(c.param);
      if (!v) continue;
      click[c.param] = v;
      if (!utm.source) {
        utm.source = c.source;
        if (!utm.medium) utm.medium = c.medium;
      }
    }

    const payload: Attribution = {
      utm,
      referrer: document.referrer || "",
      landing: window.location.pathname,
      click,
    };
    sessionStorage.setItem(UTM_KEY, JSON.stringify(payload));
  } catch {
    /* sessionStorage unavailable (private mode) — attribution is best-effort */
  }
}

function getAttribution(): Attribution {
  try {
    const raw = sessionStorage.getItem(UTM_KEY);
    if (raw) return JSON.parse(raw) as Attribution;
  } catch {
    /* fall through */
  }
  return { utm: {}, referrer: typeof document !== "undefined" ? document.referrer : "" };
}

/* ---------------- API calls ---------------- */

export type LeadInput = {
  name: string;
  phone: string;
  email: string;
  /** Human-readable label, written into the notes for the owner to read. */
  service: string;
  /**
   * The exact option string configured in ShopFlow → Settings → lead form
   * options. The server DROPS any `services` label it doesn't recognise, so
   * this has to match the tenant's list character for character or the lead
   * arrives in the CRM with no service on it. See LAUNCH.md.
   */
  serviceTag?: string;
  goal: string;
  timeline: string;
  notes: string;
  vehicle: { year: string; make: string; model: string; color?: string; type: string };
  /** Extra structured lines for property leads, written above the note. */
  extraLines?: string[];
  /**
   * Bypass the shop's required custom fields (vehicle year/make/model). The
   * server enforces those on every lead, which is right for a car but
   * impossible for a living room — so property leads opt out.
   */
  skipRequiredCustomFields?: boolean;
  photoUrls?: string[];
  honeypot?: string;
};

export async function submitLead(input: LeadInput): Promise<{ ok: boolean; error?: string }> {
  const { utm, referrer, click, landing } = getAttribution();
  const clickIds = Object.entries(click ?? {})
    .map(([k, v]) => `${k}=${v}`)
    .join(" ");

  const noteLines = [
    `Service: ${input.service}`,
    input.vehicle.type && `Vehicle type: ${input.vehicle.type}`,
    ...(input.extraLines ?? []),
    input.goal && `Goal: ${input.goal}`,
    input.timeline && `Timeline: ${input.timeline}`,
    input.photoUrls?.length && `Photos: ${input.photoUrls.join(" ")}`,
    input.notes && `Customer note: ${input.notes}`,
    landing && landing !== "/" && `Landing page: ${landing}`,
    clickIds && `Ad click: ${clickIds}`,
  ].filter(Boolean);

  try {
    const res = await fetch(publicApi("/lead"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: input.name.trim(),
        phone: input.phone.trim(),
        email: input.email.trim(),
        notes: noteLines.join("\n"),
        services: [input.serviceTag || input.service],
        customFields: {
          vehicleYear: input.vehicle.year.trim(),
          vehicleMake: input.vehicle.make.trim(),
          vehicleModel: input.vehicle.model.trim(),
          vehicleColor: (input.vehicle.color ?? "").trim(),
        },
        utm,
        referrer,
        ...(input.skipRequiredCustomFields ? { skipRequiredCustomFields: true } : {}),
        website: input.honeypot || "",
      }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || body.ok === false) {
      return { ok: false, error: body.error || `Request failed (${res.status})` };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "network" };
  }
}

/* ---------------- photo upload ---------------- */

async function downscale(file: File, maxDim = 1600, quality = 0.8): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", quality);
}

/** Uploads up to `max` photos; failures are non-fatal. */
export async function uploadPhotos(files: File[], max = 3): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files.slice(0, max)) {
    try {
      const image = await downscale(file);
      const res = await fetch(publicApi("/upload"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.ok && body.url) urls.push(body.url);
    } catch {
      /* skip this photo */
    }
  }
  return urls;
}
