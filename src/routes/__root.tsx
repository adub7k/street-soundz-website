import {
  Outlet,
  Link,
  createRootRoute,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import { site, has, CITY_STATE } from "../config/site";
import { images } from "../config/images";
import { services } from "../content/services";
import { GA4_ID, GOOGLE_ADS_ID, META_PIXEL_ID } from "../lib/analytics";
import { shopflow } from "../config/shopflow";

/* ------------------------------------------------------------ analytics -- */

const gtagInit = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
${GA4_ID ? `gtag('config','${GA4_ID}');` : ""}
${GOOGLE_ADS_ID ? `gtag('config','${GOOGLE_ADS_ID}');` : ""}`;

const metaPixelInit = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;
n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`;

/* ------------------------------------------------------ structured data -- */

/**
 * One LocalBusiness node for the whole site, from verified data only.
 * aggregateRating is emitted ONLY when site.reviews carries real numbers.
 */
const localBusinessLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${site.url}/#business`,
  name: site.business.name,
  url: site.url,
  ...(has.phone ? { telephone: site.business.phone } : {}),
  ...(has.email ? { email: site.business.email } : {}),
  image: site.url + images.share,
  logo: site.url + images.logo.mark512,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    ...(site.business.addressParts.street
      ? { streetAddress: site.business.addressParts.street }
      : {}),
    addressLocality: site.business.addressParts.city,
    addressRegion: site.business.addressParts.state,
    ...(site.business.addressParts.zip ? { postalCode: site.business.addressParts.zip } : {}),
    addressCountry: site.business.addressParts.country,
  },
  areaServed: [site.serviceArea.primary, ...site.serviceArea.nearby].map((name) => ({
    "@type": "City",
    name,
  })),
  ...(site.business.hoursSchema.length
    ? {
        openingHoursSpecification: site.business.hoursSchema.map((h) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: h.days,
          opens: h.opens,
          closes: h.closes,
        })),
      }
    : {}),
  ...(has.reviews
    ? {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: site.reviews.rating.toFixed(1),
          reviewCount: String(site.reviews.count),
          bestRating: "5",
        },
      }
    : {}),
  makesOffer: services.map((s) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: s.serviceName },
  })),
});

const websiteLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.business.name,
  url: site.url,
});

/* ----------------------------------------------------------- boundaries -- */

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-20 text-center">
      <img
        src={images.logo.mark}
        alt=""
        width={56}
        height={56}
        className="h-14 w-14 rounded-xl object-contain"
      />
      <p className="eyebrow mt-6">Error 404</p>
      <h1 className="mt-3 text-[clamp(1.8rem,5vw,2.6rem)]">This page doesn't exist.</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        It may have moved, or the link may be wrong. Everything we do is one tap away.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-2.5">
        <Link to="/" className="btn btn-primary">
          Back to home
        </Link>
        <Link to="/quote" className="btn btn-ghost">
          Get a quote
        </Link>
      </div>

      <nav aria-label="Services" className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2">
        {services.map((s) => (
          <Link
            key={s.slug}
            to={s.route}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {s.serviceName}
          </Link>
        ))}
        <Link to="/gallery" className="text-sm text-muted-foreground hover:text-foreground">
          Our Work
        </Link>
      </nav>

      {has.phone && (
        <a
          href={site.business.phoneHref}
          className="mt-8 text-sm text-muted-foreground hover:text-foreground"
        >
          Or call {site.business.phone}
        </a>
      )}
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="max-w-md text-center">
        <h1 className="text-3xl">This page didn't load</h1>
        <p className="mt-3 text-muted-foreground">
          Something went wrong on our end. Try again
          {has.phone ? `, or call us on ${site.business.phone}` : ""}.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn btn-primary"
          >
            Try again
          </button>
          <a href="/" className="btn btn-ghost">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- route -- */

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#111216" },
      { name: "format-detection", content: "telephone=no" },
      {
        title: `${site.business.name} — Car Audio, Security, Lighting & Home Theater in ${CITY_STATE}`,
      },
      {
        name: "description",
        content: `Car audio, vehicle security, lighting and home theater installed properly in ${CITY_STATE}. Clean wiring, one flat price. Free quote.`,
      },
      { property: "og:image", content: site.url + images.share },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: site.url + images.share },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      ...(GA4_ID || GOOGLE_ADS_ID
        ? [
            {
              src: `https://www.googletagmanager.com/gtag/js?id=${GA4_ID || GOOGLE_ADS_ID}`,
              async: true,
            },
            { children: gtagInit },
          ]
        : []),
      ...(META_PIXEL_ID ? [{ children: metaPixelInit }] : []),
      { type: "application/ld+json", children: localBusinessLd },
      { type: "application/ld+json", children: websiteLd },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", href: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/favicon-48.png", type: "image/png", sizes: "48x48" },
      { rel: "icon", href: "/favicon-96.png", type: "image/png", sizes: "96x96" },
      { rel: "icon", href: "/favicon-192.png", type: "image/png", sizes: "192x192" },
      { rel: "icon", href: images.logo.mark512, type: "image/png", sizes: "512x512" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        // Unbounded 600/700 for display, Inter 400/500/600 for body and UI.
        href: "https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700&family=Inter:wght@400;500;600&display=swap",
      },
      // The shop's photos are served from the ShopFlow host.
      { rel: "preconnect", href: shopflow.apiBase },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-foreground"
        >
          Skip to content
        </a>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div key={pathname} className="page-enter">
      <Outlet />
    </div>
  );
}
