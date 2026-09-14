import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { services } from "./content/services";
import { guides } from "./content/guides";
import { site } from "./config/site";

const SITE = site.url;

/**
 * Permanent redirects. Empty for a brand-new site — add entries here if a
 * URL is ever renamed, so ad destinations and indexed pages don't 404.
 */
const REDIRECTS: Record<string, string> = {};

function redirectResponse(pathname: string): Response | null {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const target = REDIRECTS[clean];
  if (!target) return null;
  return new Response(null, { status: 301, headers: { location: target } });
}

/**
 * Sitemap and robots are generated here so they always reflect the real
 * route list. Service pages are the money keywords.
 */
function buildSitemap(): string {
  const entries: { path: string; priority: string; changefreq: string }[] = [
    { path: "/", priority: "1.0", changefreq: "weekly" },
    ...services.map((s) => ({ path: s.route, priority: "0.9", changefreq: "monthly" })),
    { path: "/quote", priority: "0.8", changefreq: "monthly" },
    { path: "/gallery", priority: "0.7", changefreq: "weekly" },
    { path: "/about", priority: "0.6", changefreq: "monthly" },
    { path: "/contact", priority: "0.6", changefreq: "monthly" },
    { path: "/guides", priority: "0.6", changefreq: "weekly" },
    ...guides.map((g) => ({ path: `/guides/${g.slug}`, priority: "0.5", changefreq: "yearly" })),
  ];

  const urls = entries
    .map(
      (e) =>
        `  <url><loc>${SITE}${e.path}</loc><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const ROBOTS = `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;

function staticFileResponse(pathname: string): Response | null {
  if (pathname === "/sitemap.xml") {
    return new Response(buildSitemap(), {
      headers: {
        "content-type": "application/xml; charset=utf-8",
        "cache-control": "public, max-age=3600",
      },
    });
  }
  if (pathname === "/robots.txt") {
    return new Response(ROBOTS, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "public, max-age=3600",
      },
    });
  }
  return null;
}

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const { pathname } = new URL(request.url);
      const redirect = redirectResponse(pathname);
      if (redirect) return redirect;
      const staticFile = staticFileResponse(pathname);
      if (staticFile) return staticFile;
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
