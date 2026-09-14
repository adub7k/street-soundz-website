/**
 * Live pricing, straight from ShopFlow → Settings → Services.
 *
 * Prices are NEVER hardcoded in this repo. The owner sets them once in
 * ShopFlow (where they already drive booking and deposits) and the website
 * reads the same numbers, so the site can't drift out of sync with what the
 * shop actually charges.
 *
 * If the API is unreachable, or a service has no priced entries, every pricing
 * block renders nothing and the page falls back to its quote messaging. A
 * missing price is fine; a wrong one is not.
 */

import { useEffect, useState } from "react";
import { getInfo } from "@/lib/shopGallery";

export type SizePrice = { key: string; label: string; amount: number };

export type PriceRow = {
  id: string;
  name: string;
  /** Per-vehicle-size pricing, when the service is priced by size. */
  sizes: SizePrice[] | null;
  /** Single price when the service isn't size-dependent. */
  flat: number | null;
  duration: number | null;
};

export type AddOn = { id: string; name: string; price: number };

export type Pricing = {
  sizes: { key: string; label: string }[];
  rows: Record<string, PriceRow[]>;
  addons: Record<string, AddOn[]>;
  deposit: { enabled: boolean; amount: number; message: string } | null;
};

/**
 * ShopFlow has no car-audio industry profile yet, so the tenant's service
 * categories are whatever the owner types. Two ways a service lands on a
 * page: a recognised category, or — failing that — its NAME. Anything that
 * matches neither is simply not shown (better a missing price than one under
 * the wrong heading). LAUNCH.md tells the owner how to name things.
 */
const CATEGORY_TO_SLUG: Record<string, string> = {
  audio: "car-audio",
  "car-audio": "car-audio",
  stereo: "car-audio",
  sound: "car-audio",
  security: "vehicle-security",
  alarm: "vehicle-security",
  "remote-start": "vehicle-security",
  remotestart: "vehicle-security",
  gps: "vehicle-security",
  lighting: "lighting",
  lights: "lighting",
  landscape: "lighting",
  theater: "home-theater",
  theatre: "home-theater",
  "home-theater": "home-theater",
  hometheater: "home-theater",
  av: "home-theater",
  "home-audio": "home-theater",
};

const NAME_MATCHERS: [RegExp, string][] = [
  [/alarm|remote start|remote-start|tracker|gps|immobil|security/i, "vehicle-security"],
  [
    /theater|theatre|projector|surround|tv mount|soundbar|home audio|in-ceiling|multi-?room|whole-?home/i,
    "home-theater",
  ],
  [
    /landscape|path light|step light|lighting|uplight|fa[cç]ade|storefront|signage|sign light|led/i,
    "lighting",
  ],
  [
    /audio|speaker|amp|sub|woofer|head unit|stereo|carplay|deadening|tune|dsp|receiver/i,
    "car-audio",
  ],
];

function slugFor(category: string, name: string): string | null {
  const byCat = CATEGORY_TO_SLUG[category.toLowerCase().replace(/\s+/g, "-")];
  if (byCat) return byCat;
  const byName = NAME_MATCHERS.find(([re]) => re.test(name));
  return byName ? byName[1] : null;
}

let pricingPromise: Promise<Pricing | null> | null = null;

export function fetchPricing(): Promise<Pricing | null> {
  if (!pricingPromise) {
    // Shares the single /info fetch with the gallery, team and reviews.
    pricingPromise = getInfo()
      .then((info) => (info ? normalize(info) : null))
      .catch(() => null);
  }
  return pricingPromise;
}

/** Tidy ASCII separators for display only — the words stay as typed. */
const tidyName = (n: string) => n.replace(/\s+-{1,2}\s+/g, " — ").trim();

function normalize(info: Record<string, unknown>): Pricing {
  const sizes = Array.isArray(info.vehicleSizes)
    ? (info.vehicleSizes as { key: string; label: string }[])
    : [];
  const services = Array.isArray(info.services) ? (info.services as Record<string, unknown>[]) : [];
  const addonList = Array.isArray(info.addons) ? (info.addons as Record<string, unknown>[]) : [];

  const rows: Record<string, PriceRow[]> = {};
  for (const s of services) {
    const name = String(s.name ?? "");
    const slug = slugFor(String(s.category ?? ""), name);
    if (!slug) continue;
    const sizePricing = s.sizePricing as Record<string, number> | null | undefined;
    const priced =
      sizePricing && typeof sizePricing === "object"
        ? sizes
            .map((sz) => ({ key: sz.key, label: sz.label, amount: Number(sizePricing[sz.key]) }))
            .filter((p) => Number.isFinite(p.amount) && p.amount > 0)
        : [];

    const base = Number(s.price);
    if (!priced.length && !(Number.isFinite(base) && base > 0)) continue;

    (rows[slug] ??= []).push({
      id: String(s.id),
      name: tidyName(name),
      sizes: priced.length ? priced : null,
      flat: priced.length ? null : base,
      duration: Number.isFinite(Number(s.duration)) ? Number(s.duration) : null,
    });
  }

  // Size-priced (whole-vehicle) rows first, then flat ones; cheapest first
  // within each group, so a cheap add-on line never leads the table.
  for (const list of Object.values(rows)) {
    list.sort((a, b) => {
      const aPartial = a.sizes ? 0 : 1;
      const bPartial = b.sizes ? 0 : 1;
      if (aPartial !== bPartial) return aPartial - bPartial;
      return lowestOf(a) - lowestOf(b);
    });
  }

  const addons: Record<string, AddOn[]> = {};
  for (const a of addonList) {
    const name = String(a.name ?? "");
    const price = Number(a.price);
    if (!name || !Number.isFinite(price) || price <= 0) continue;
    const slug = slugFor(String(a.category ?? ""), name);
    if (!slug) continue;
    (addons[slug] ??= []).push({ id: String(a.id ?? name), name: tidyName(name), price });
  }

  const dep = info.deposit as { enabled?: boolean; amount?: number; message?: string } | undefined;

  return {
    sizes: sizes.map((sz) => ({ key: sz.key, label: sz.label })),
    rows,
    addons,
    deposit:
      dep && dep.enabled && Number(dep.amount) > 0
        ? { enabled: true, amount: Number(dep.amount), message: String(dep.message ?? "") }
        : null,
  };
}

export function lowestOf(row: PriceRow): number {
  if (row.flat != null) return row.flat;
  return Math.min(...(row.sizes ?? []).map((s) => s.amount));
}

/**
 * "from $X" for the homepage cards. Prefers whole-vehicle (size-priced) rows
 * when they exist so a cheap add-on line can't set the expectation.
 */
export function startingAt(pricing: Pricing | null, slug: string): number | null {
  const list = pricing?.rows[slug];
  if (!list?.length) return null;
  const full = list.filter((r) => r.sizes);
  const source = full.length ? full : list;
  return Math.min(...source.map(lowestOf));
}

export const money = (n: number) => `$${n.toLocaleString("en-US")}`;

export function usePricing(): Pricing | null {
  const [pricing, setPricing] = useState<Pricing | null>(null);
  useEffect(() => {
    let alive = true;
    fetchPricing().then((p) => alive && setPricing(p));
    return () => {
      alive = false;
    };
  }, []);
  return pricing;
}
