/**
 * Street Soundz — business facts.
 *
 * RULE FOR THIS FILE: everything here is published to a live commercial site.
 * A claim goes in only when it is verifiable. Anything the owner still has to
 * confirm lives in `unverified` below, is NOT rendered by any component, and
 * is tracked in LAUNCH.md. Inventing warranties, certifications, brands,
 * review counts or years-in-business is an FTC problem and a Google
 * structured-data penalty — not a copywriting shortcut.
 *
 * Every field marked TODO must be filled in before the site goes live. The
 * components are written so an EMPTY value hides the element (no phone → no
 * call buttons, no address → no map) rather than printing a placeholder.
 */

export type ServiceKey = "audio" | "security" | "lighting" | "theater";

/** Site origin. Set VITE_SITE_URL in Railway once the real domain is known. */
const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, "") ||
  "https://www.streetsoundz.com"; // TODO(LAUNCH): confirm the real domain

const PHONE: string = ""; // TODO(LAUNCH): "(505) 555-0100" — empty hides every call button
const EMAIL: string = ""; // TODO(LAUNCH): empty hides the email links

export const site = {
  business: {
    name: "Street Soundz NM",
    /** Short form for prose and the footer wordmark. */
    shortName: "Street Soundz",
    /** One line under the wordmark and in the footer. */
    tagline: "Sound, security and light. Wired clean.",
    phone: PHONE,
    phoneHref: PHONE ? `tel:+1${PHONE.replace(/\D/g, "")}` : "",
    email: EMAIL,
    emailHref: EMAIL ? `mailto:${EMAIL}` : "",
    /**
     * TODO(LAUNCH): shop address, if there is a shop. A mobile-only or
     * by-appointment business leaves `address` empty and the site shows the
     * service area instead of a map.
     */
    address: "",
    addressParts: {
      street: "",
      city: "Albuquerque", // TODO(LAUNCH): confirm city
      state: "NM", // confirmed by the logo ("Street Soundz NM")
      zip: "",
      country: "US",
    },
    /** Used for the map embed + directions link. Empty = no map. */
    mapsQuery: "",
    /**
     * TODO(LAUNCH): real hours. Empty array hides the hours block everywhere.
     * `open: false` renders the line muted (e.g. "Sunday: Closed").
     */
    hours: [] as { day: string; value: string; open: boolean }[],
    /** Machine-readable hours for LocalBusiness schema. Empty = omitted. */
    hoursSchema: [] as { days: string[]; opens: string; closes: string }[],
  },

  /** Canonical origin — used for canonical tags, OG URLs and the sitemap. */
  url: SITE_URL,

  /**
   * Google Business Profile.
   *
   * A brand-new business has no reviews yet, so `count` starts at 0 and NOTHING
   * rating-related renders: no stars in the hero, no aggregateRating markup,
   * no "read our reviews" link. Read the numbers off the live profile and
   * update them here (with the date) once there are real reviews — see
   * LAUNCH.md. Reviews collected through ShopFlow are shown live from the API
   * and never feed schema markup.
   */
  reviews: {
    rating: 0,
    count: 0,
    verifiedOn: "",
    /** The "write a review" link from the Google Business Profile. */
    profileUrl: "",
  },

  /**
   * Where the shop actually works. Vehicle work is booked in; lighting and
   * home theater are installed at the customer's property. Only list places
   * the owner has confirmed they'll travel to — fabricated service areas are
   * the classic local-SEO spam signal.
   */
  serviceArea: {
    primary: "Albuquerque, New Mexico", // TODO(LAUNCH): confirm
    nearby: [] as string[], // TODO(LAUNCH): e.g. ["Rio Rancho", "Los Lunas"]
    note: "Vehicle work is booked in. Lighting and home theater are designed and installed on site at your home or business.",
  },

  social: {
    /** Only links the owner has confirmed appear in the footer; empty = hidden. */
    instagram: "",
    facebook: "",
    tiktok: "",
    youtube: "",
  },

  /**
   * ============================ NOT PUBLISHED ============================
   * Nothing here is rendered anywhere. Each item is listed in LAUNCH.md with
   * the exact place it will slot into once the owner confirms it.
   */
  unverified: {
    /** Equipment brands installed (audio, security, lighting, AV). */
    brands: null,
    /** Any labour or equipment warranty the shop offers. */
    warranty: null,
    /** Installer certifications (e.g. MECP) — only publish with the cert. */
    certifications: null,
    /** The business is new — never claim years in business. */
    yearsInBusiness: null,
    /** Mobile / at-home vehicle installs — not confirmed. */
    mobileService: null,
    /** Whether the owner does the installs personally. */
    ownerInstalls: null,
  },
};

/** Convenience booleans so components don't repeat the empty checks. */
export const has = {
  phone: Boolean(site.business.phone),
  email: Boolean(site.business.email),
  address: Boolean(site.business.address),
  hours: site.business.hours.length > 0,
  reviews: site.reviews.count > 0 && site.reviews.rating > 0,
  reviewLink: Boolean(site.reviews.profileUrl),
};

/**
 * Trust-bar items. These are COMMITMENTS the shop makes about how it works,
 * not statistics about its past — a brand-new business has no "500 installs"
 * to point at, and won't pretend to. `verified` gates rendering — anything
 * the owner hasn't signed off on never paints.
 */
export type TrustSignal = {
  id: string;
  value: string;
  label: string;
  verified: boolean;
};

export const trustSignals: TrustSignal[] = [
  { id: "quote", value: "Free quotes", label: "One flat number, in writing", verified: true },
  { id: "wiring", value: "Factory wiring", label: "Stays intact — nothing cut", verified: true },
  {
    id: "scope",
    value: "Cars · Homes · Business",
    label: "Same crew, same standard",
    verified: true,
  },
  { id: "tuned", value: "Tuned & tested", label: "Before you ever see it", verified: true },
  // --- held back pending confirmation (see LAUNCH.md) ---
  { id: "owner", value: "Owner-installed", label: "You deal with the installer", verified: false },
  { id: "warranty", value: "Warranty", label: "On labour and equipment", verified: false },
];

export const publishedTrustSignals = trustSignals.filter((t) => t.verified);

/** Short location strings for eyebrows and copy. */
export const CITY = site.business.addressParts.city;
export const STATE = site.business.addressParts.state;
export const CITY_STATE = `${CITY}, ${STATE}`;

export type Site = typeof site;
