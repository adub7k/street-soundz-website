/**
 * Analytics event layer.
 *
 * Every ID is environment-driven so this repo carries NO account IDs of its
 * own (the Evo template had its client's GA4/Ads tags hard-coded — copying a
 * template must never copy another business's analytics):
 *
 *   VITE_GA4_ID                  G-XXXXXXX     → GA4 loads, events fire
 *   VITE_GOOGLE_ADS_ID           AW-XXXXXXXX   → Ads remarketing config
 *   VITE_GOOGLE_ADS_LEAD_LABEL   AW-XXX/abc    → lead-form conversion
 *   VITE_META_PIXEL_ID           1234567890    → Meta Pixel + Lead events
 *
 * Unset = off. Every helper here is best-effort and a no-op when the tag isn't
 * available — during SSR, before the script loads, or when a blocker strips
 * it. Analytics must NEVER throw into the lead-capture flow: a broken tracker
 * may not cost the shop a lead.
 */

export const GA4_ID = (import.meta.env.VITE_GA4_ID as string | undefined) ?? "";
export const GOOGLE_ADS_ID = (import.meta.env.VITE_GOOGLE_ADS_ID as string | undefined) ?? "";
export const GOOGLE_ADS_LEAD_LABEL =
  (import.meta.env.VITE_GOOGLE_ADS_LEAD_LABEL as string | undefined) ?? "";
export const META_PIXEL_ID = (import.meta.env.VITE_META_PIXEL_ID as string | undefined) ?? "";

type Gtag = (
  command: "event" | "config" | "js",
  target: string,
  params?: Record<string, unknown>,
) => void;

type Fbq = (command: string, event: string, params?: Record<string, unknown>) => void;

function gtagEvent(event: string, params: Record<string, unknown> = {}): void {
  try {
    if (typeof window === "undefined") return;
    const gtag = (window as unknown as { gtag?: Gtag }).gtag;
    if (typeof gtag === "function") gtag("event", event, params);
  } catch {
    /* never let analytics break the page */
  }
}

function fbqEvent(event: string, params: Record<string, unknown> = {}): void {
  try {
    if (typeof window === "undefined") return;
    const fbq = (window as unknown as { fbq?: Fbq }).fbq;
    if (typeof fbq === "function") fbq("track", event, params);
  } catch {
    /* no-op */
  }
}

/* --------------------------------------------------------------- intent -- */

export function trackQuoteClick(location: string, service?: string): void {
  gtagEvent("quote_cta_click", { location, service: service ?? "unspecified" });
}

export function trackPhoneClick(location: string): void {
  gtagEvent("phone_click", { location });
  fbqEvent("Contact", { method: "phone" });
}

export function trackContactClick(method: "email" | "directions" | "map"): void {
  gtagEvent("contact_click", { method });
}

/* ----------------------------------------------------------------- form -- */

export function trackQuoteStart(service: string): void {
  gtagEvent("quote_start", { service });
  fbqEvent("InitiateCheckout", { content_category: service });
}

export function trackQuoteStep(stepIndex: number, stepName: string, service: string): void {
  gtagEvent("quote_step", { step_index: stepIndex, step_name: stepName, service });
}

/**
 * A visitor became a lead — contact details captured and sent to ShopFlow.
 * Fires once per phone number, at the moment contact details validate, so it
 * mirrors ShopFlow's lead count even if the visitor bails afterwards.
 */
export function trackLeadCaptured(service: string, params: Record<string, unknown> = {}): void {
  gtagEvent("generate_lead", { service, currency: "USD", value: 1, ...params });
  fbqEvent("Lead", { content_category: service, ...params });
}

/** Google Ads conversion for the quote form — only when a label is configured. */
export function trackQuoteAdsConversion(): void {
  if (!GOOGLE_ADS_LEAD_LABEL) return;
  gtagEvent("conversion", { send_to: GOOGLE_ADS_LEAD_LABEL });
}

export function trackQuoteComplete(service: string): void {
  gtagEvent("quote_complete", { service });
}

export function trackQuoteError(reason: string): void {
  gtagEvent("quote_error", { reason });
}

/* -------------------------------------------------------------- content -- */

export function trackGalleryFilter(filter: string): void {
  gtagEvent("gallery_filter", { filter });
}

export function trackGalleryOpen(caption: string): void {
  gtagEvent("gallery_open", { caption });
}

export function trackGuideRead(slug: string): void {
  gtagEvent("guide_read", { slug });
}
