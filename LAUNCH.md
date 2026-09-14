# Street Soundz NM — launch checklist

Everything on this list is either a fact the site needs before it goes live, or
a claim it is deliberately NOT making until the owner confirms it. The site is
built so that an EMPTY value hides the element — no placeholder phone numbers
or fake hours ever reach the page. Fill these in `src/config/site.ts` unless a
different file is named.

## 1. Facts required before launch (site.ts)

| Field | Where it shows | Status |
| --- | --- | --- |
| `PHONE` | Nav, sticky mobile bar, every CTA, forms' error fallback, schema | **EMPTY — no call buttons render** |
| `EMAIL` | Footer, contact page, schema | empty — hidden |
| `business.address` + `addressParts.street/zip` + `mapsQuery` | Footer, contact map, FinalCTA, schema | empty — service area shown instead of a map |
| `addressParts.city` | Every eyebrow, meta title, schema, copy | **assumed "Albuquerque" — confirm** |
| `business.hours` + `hoursSchema` | Footer, contact, quote page, schema | empty — hidden |
| `serviceArea.primary` / `nearby` | Footer, lighting page, contact | assumed Albuquerque metro; `nearby` empty |
| `social.*` | Footer icons | empty — hidden |
| `VITE_SITE_URL` (Railway env) | Canonicals, OG URLs, sitemap | placeholder `https://www.streetsoundz.com` |

## 2. Google Business Profile

- `site.reviews.count/rating/verifiedOn/profileUrl` are all zero/empty. The
  business is new. Nothing rating-related renders (no stars, no aggregateRating
  markup, no "read our reviews"). When there are real reviews, read the numbers
  off the live profile, set them here with the date, and paste the real quotes
  into `src/content/reviews.ts`. Never add a review that isn't on the profile.
- Reviews collected inside ShopFlow (Settings → featured) show up on the site
  automatically. They are never emitted as structured data.

## 3. ShopFlow tenant (owner does none of this — you do)

1. Create the tenant. There is no car-audio industry profile in
   `shopflow-platform/server/industries.js` yet; the closest fits are `detail`
   or `tint` (vehicle year/make/model custom fields, lead capture, quotes,
   vehicle sizes). Adding a `caraudio` profile block is a 20-line change and
   would give the right vocabulary ("Installer", "Bay") — recommended.
2. Set `VITE_SHOPFLOW_SHOP_SLUG` in Railway to the tenant slug. The default in
   `src/config/shopflow.ts` is `street-soundz`. A wrong slug = every lead lost.
3. **Lead form options** (Settings → lead form options) must contain these four
   strings EXACTLY, or the server drops the service tag from every lead:
   `Car Audio`, `Vehicle Security`, `Lighting`, `Home Theater`
   (these are `leadValue` in `src/content/services.ts`).
4. Property leads (lighting, home theater) send `skipRequiredCustomFields` so
   the vehicle fields don't block them. Vehicle leads send year/make/model;
   colour is optional (the server never requires it).
5. **Pricing** appears on the site automatically once services are priced in
   Settings → Services. A service lands on a page by category (`audio`,
   `security`, `lighting`, `theater` and their aliases in `src/lib/pricing.ts`)
   or, failing that, by name ("Speaker upgrade", "Remote start", "Landscape
   lighting package"…). Unmatched = not shown. Until anything is priced, no
   pricing section exists anywhere — that's intentional.
6. **Photos**: Settings → Work Gallery. The gallery, the homepage "real work"
   band and every service-page gallery are hidden until the first upload. A
   caption files the photo under a service (see `src/content/gallery.ts`).
7. **Website Photos** slots. The platform's slots are still the Evo names; the
   site maps them: `service_tint` → Car Audio tile, `service_ceramic` →
   Vehicle Security, `service_ppf` → Lighting, `service_detail` → Home
   Theater, `hero` → homepage hero (landscape only), `logo` → header logo.
   Until the platform gets its own audio slot names, tell the owner which is
   which — or rename them in `src/config/images.ts` when the platform changes.
   The section in ShopFlow is gated to `industry === 'detail' || 'tint'`.
8. **Meet the Team**: Settings → Meet the Team populates /about.

## 4. Claims held back (site.ts → `unverified`)

None of these render anywhere. Each one needs the owner's word, in writing.

| Claim | Where it would go once confirmed |
| --- | --- |
| Equipment brands installed | A `BrandLine` on each service page (the Evo site has the component) |
| Any labour / equipment warranty | `trustSignals` (already drafted, `verified: false`) + a FAQ |
| MECP or other certification | `trustSignals` |
| "Owner-installed" / who does the work | `trustSignals` (drafted, `verified: false`), About page |
| Mobile / at-home vehicle installs | Car audio + security process steps, FAQ |
| Years in business | Never — the business is new |

## 5. The four trust-bar commitments

These render today because they are promises about HOW the shop works, not
statistics about its past. The owner must agree to stand behind them:

- Free quotes — one flat number, in writing
- Factory wiring stays intact — nothing cut
- Cars · Homes · Business — same crew, same standard
- Tuned & tested before you ever see it

## 6. Analytics (all optional, all env-driven, nothing hard-coded)

| Env var | Effect |
| --- | --- |
| `VITE_GA4_ID` | GA4 loads; quote/phone/gallery events fire |
| `VITE_GOOGLE_ADS_ID` | Ads remarketing config |
| `VITE_GOOGLE_ADS_LEAD_LABEL` | Quote-form conversion (`AW-xxx/yyy`) |
| `VITE_META_PIXEL_ID` | Meta Pixel + Lead / InitiateCheckout / Contact events |

## 7. Deploy (Railway — LIVE)

- Service `street-soundz-website` in the **The ShopFlow** Railway project
  (same project as Evo-Solutions and the platform), deployed from
  github.com/adub7k/street-soundz-website `main`. Every push redeploys.
- Public URL until a domain is bought:
  https://street-soundz-website-production.up.railway.app
- Env set on the service (2026-09-14): `VITE_SHOPFLOW_API_URL`,
  `VITE_SHOPFLOW_SHOP_SLUG=street-soundz-nm` (the slug the admin "create shop"
  endpoint will generate from the name "Street Soundz NM" — if the tenant ends
  up with a different slug, change this and redeploy), `VITE_SITE_URL`
  (placeholder railway.app URL — set to the real domain when it exists),
  `NITRO_PRESET=node-server`. Analytics IDs not set. All are baked in at
  BUILD time — a variable change triggers a rebuild automatically.
- Custom domain: `railway domain <domain>` on this service, then point the
  registrar at it (apex → www redirect like Evo).
- Gotchas inherited from Evo: no bun lockfiles, `.npmrc` has `force=true`,
  don't use `npm ci` in the build command, `engines.node >= 22`.
- Domain: apex → www redirect at the registrar; Railway serves www.

## 8. Logo

The owner's logo (transparent PNG + on-black JPEG) is bundled in `public/img`.
Regenerate favicons and the share card if it changes:
`scripts/brand-assets.mjs` (see the header comment for how to run it).
The favicon is a typographic "SS" in the brand gold because the wordmark is
unreadable at 16px — swap it if the owner supplies a square mark.
