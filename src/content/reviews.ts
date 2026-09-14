/**
 * Customer reviews from the Google Business Profile.
 *
 * EMPTY ON PURPOSE. Street Soundz is a new business with no public reviews
 * yet. Nothing rating-related renders until there are real ones here AND
 * site.reviews.count is set — see LAUNCH.md.
 *
 * DO NOT ADD A REVIEW HERE THAT ISN'T ON THE PROFILE. Review markup is
 * emitted from site.reviews; invented entries are a Google manual action and
 * an FTC endorsement-guide violation.
 *
 * Reviews the shop collects through ShopFlow (featured in Settings) are
 * fetched live and shown alongside these — see lib/shopGallery.ts. They never
 * feed structured data, because SSR can't vouch for them.
 */

export type Review = {
  id: string;
  name: string;
  quote: string;
  rating: 5 | 4 | 3 | 2 | 1;
  /** Only set when the reviewer actually names the service. */
  service?: string;
  source: "Google";
};

export const reviews: Review[] = [];
