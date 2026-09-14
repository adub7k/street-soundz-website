// ShopFlow integration — the site is static and can live on any host;
// it talks to the ShopFlow platform over its public per-shop API.
// Override per deployment via env (set at build time):
//   VITE_SHOPFLOW_API_URL   e.g. https://shopflowio.up.railway.app
//   VITE_SHOPFLOW_SHOP_SLUG the tenant slug created for Street Soundz
export const shopflow = {
  apiBase:
    (import.meta.env.VITE_SHOPFLOW_API_URL as string | undefined) ??
    "https://shopflowio.up.railway.app",
  // TODO(LAUNCH): must match the slug of the ShopFlow tenant exactly, or the
  // lead form posts into the void and the gallery stays empty.
  shopSlug: (import.meta.env.VITE_SHOPFLOW_SHOP_SLUG as string | undefined) ?? "street-soundz",
};

export const publicApi = (path: string) =>
  `${shopflow.apiBase}/api/public/${shopflow.shopSlug}${path}`;
