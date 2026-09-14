/**
 * Image slots.
 *
 * Street Soundz is a new business with no portfolio yet, so — unlike the Evo
 * template — there are NO bundled photos. Every slot renders a designed
 * motif (see components/site/Motif.tsx) until the owner uploads a real photo
 * in ShopFlow → Settings → Website Photos, at which point the photo takes over
 * with no deploy. No stock photography, ever: a stock photo of someone else's
 * install is a lie about the work.
 *
 * Slot keys must match what the ShopFlow platform accepts (SITE_SLOTS in
 * client/js/pages/settings.js). The platform currently ships `hero`,
 * `service_tint`, `service_ceramic`, `service_ppf`, `service_detail`,
 * `service_commercial` and `logo`. Until dedicated audio/security/lighting/
 * theater slots are added there, the four service slots below are MAPPED onto
 * the existing keys so the owner can upload today — see LAUNCH.md.
 */

export type MotifKind = "audio" | "security" | "lighting" | "theater" | "hero";

type Slot = {
  /** ShopFlow siteImages key this slot reads. */
  key: string;
  motif: MotifKind;
  alt: string;
};

export const images = {
  hero: {
    key: "hero",
    motif: "hero",
    alt: "Street Soundz — car audio, vehicle security, lighting and home theater",
  } satisfies Slot,
  share: "/img/street-soundz-share.jpg",
  /**
   * Brand mark. The owner's real logo is arriving separately — drop it in as
   * /public/img/street-soundz-mark-{256,512}.png (square, transparent PNG) and
   * re-run `npm run icons` to regenerate the favicons and share card. Until
   * then these are a neutral typographic placeholder. The ShopFlow `logo`
   * slot overrides the header mark at runtime as well.
   */
  logo: {
    key: "logo",
    mark: "/img/street-soundz-mark-256.png",
    mark512: "/img/street-soundz-mark-512.png",
  },
  service: {
    // Platform key → site meaning. Renamed here only; the upload UI in ShopFlow
    // still shows the old labels until the platform gets its own audio slots.
    service_audio: {
      key: "service_tint",
      motif: "audio",
      alt: "Car audio install by Street Soundz",
    },
    service_security: {
      key: "service_ceramic",
      motif: "security",
      alt: "Vehicle security and remote start install by Street Soundz",
    },
    service_lighting: {
      key: "service_ppf",
      motif: "lighting",
      alt: "Landscape and architectural lighting installed by Street Soundz",
    },
    service_theater: {
      key: "service_detail",
      motif: "theater",
      alt: "Home theater installed by Street Soundz",
    },
  } satisfies Record<string, Slot>,
} as const;

export type ServiceImageSlot = keyof typeof images.service;
