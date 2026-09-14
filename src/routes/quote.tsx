import { createFileRoute } from "@tanstack/react-router";
import { Phone, Clock, MapPin, ShieldCheck, Home } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { QuoteForm } from "@/components/site/QuoteForm";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ReviewsSection } from "@/components/site/Reviews";
import { Reveal } from "@/components/site/Reveal";
import { site, has, CITY_STATE } from "@/config/site";
import { seo, breadcrumbLd } from "@/lib/seo";
import { trackPhoneClick } from "@/lib/analytics";

const PATH = "/quote";
const TITLE = `Get a Free Quote | Street Soundz NM — ${CITY_STATE}`;
const DESC =
  "Tell us the vehicle or the property and what you need — car audio, security, lighting or home theater. We'll come back with one flat price. No pressure, no obligation.";
const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Get a Quote", path: PATH },
];

const assurances = [
  { icon: ShieldCheck, text: "No obligation — a quote is a quote" },
  { icon: Clock, text: "Usually answered the same day" },
  { icon: Home, text: "Lighting and home theater include a free site visit" },
];

export const Route = createFileRoute("/quote")({
  head: () => {
    const meta = seo({ title: TITLE, description: DESC, path: PATH });
    return {
      ...meta,
      scripts: [{ type: "application/ld+json", children: breadcrumbLd(CRUMBS) }],
    };
  },
  component: Quote,
});

function Quote() {
  return (
    <SiteLayout>
      <section className="pt-[4.5rem]">
        <div className="container-x pb-16 pt-8 sm:pt-12">
          <Breadcrumbs trail={CRUMBS} />

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
            <div className="animate-rise">
              <p className="eyebrow">Free quote</p>
              <h1 className="mt-4 text-[clamp(1.9rem,4.4vw,3rem)]">
                Tell us what you're after. We'll tell you what it costs.
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                Five short steps, about a minute. You'll get a straight recommendation and one flat
                number — including when the cheaper option is the right one.
              </p>

              <ul className="mt-8 space-y-3.5">
                {assurances.map((a) => (
                  <li key={a.text} className="flex items-start gap-3">
                    <a.icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span className="text-muted-foreground">{a.text}</span>
                  </li>
                ))}
              </ul>

              {(has.phone || has.hours || has.address) && (
                <div className="mt-9 rounded-lg border border-border bg-surface/50 p-6">
                  {has.phone && (
                    <>
                      <p className="font-display text-sm font-semibold">
                        Would rather just talk to someone?
                      </p>
                      <a
                        href={site.business.phoneHref}
                        onClick={() => trackPhoneClick("quote-page")}
                        className="tap-target mt-2 gap-2 font-display text-lg font-bold text-accent"
                      >
                        <Phone className="h-5 w-5" />
                        {site.business.phone}
                      </a>
                    </>
                  )}
                  {has.hours && (
                    <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                      <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                      {site.business.hours.map((h) => `${h.day}: ${h.value}`).join(" · ")}
                    </p>
                  )}
                  <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    {has.address ? site.business.address : site.serviceArea.primary}
                  </p>
                </div>
              )}
            </div>

            <Reveal delay={60}>
              <QuoteForm />
            </Reveal>
          </div>
        </div>
      </section>

      <ReviewsSection />
    </SiteLayout>
  );
}
