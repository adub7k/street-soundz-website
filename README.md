# Street Soundz NM — website

Marketing + lead-gen site for Street Soundz NM (car audio, vehicle security,
lighting, home theater). Built from the Evo Solutions template; talks to the
ShopFlow platform for leads, photos, pricing, team and reviews.

- **Stack:** TanStack Start (React 19, SSR) + Tailwind v4, deployed to Railway.
- **Content** lives in `src/content/*.ts` and `src/config/site.ts` — no CMS.
- **Design system** is `src/styles.css`: black / chrome / gold from the logo,
  Unbounded for display type, Inter for body.
- **No stock photography.** Image slots render designed motifs
  (`src/components/site/Motif.tsx`) until the owner uploads real photos in
  ShopFlow → Settings → Website Photos / Work Gallery.
- **Honesty rules:** nothing unverified is published. See `LAUNCH.md` for the
  fields to fill and the claims deliberately held back.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # NITRO_PRESET=node-server for Railway
npm run lint
```

Env (build time): `VITE_SHOPFLOW_API_URL`, `VITE_SHOPFLOW_SHOP_SLUG`,
`VITE_SITE_URL`, optional `VITE_GA4_ID` / `VITE_GOOGLE_ADS_ID` /
`VITE_GOOGLE_ADS_LEAD_LABEL` / `VITE_META_PIXEL_ID`.
