import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { FinalCTA } from "@/components/site/FinalCTA";
import { services } from "@/content/services";
import { CITY_STATE } from "@/config/site";
import { seo, breadcrumbLd } from "@/lib/seo";

const PATH = "/gallery";
const TITLE = `Our Work — Car Audio, Security, Lighting & Home Theater | Street Soundz NM`;
const DESC = `Real installs from Street Soundz NM in ${CITY_STATE}. Car audio, vehicle security, lighting and home theater — our own work, no stock photography.`;
const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Our Work", path: PATH },
];

export const Route = createFileRoute("/gallery")({
  head: () => {
    const meta = seo({ title: TITLE, description: DESC, path: PATH });
    return {
      ...meta,
      scripts: [{ type: "application/ld+json", children: breadcrumbLd(CRUMBS) }],
    };
  },
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <SiteLayout>
      <section className="pt-[4.5rem]">
        <div className="container-x pb-6 pt-8 sm:pt-12">
          <Breadcrumbs trail={CRUMBS} />
          <div className="mt-8 max-w-2xl animate-rise">
            <p className="eyebrow">Our work</p>
            <h1 className="mt-4">Installs that have left the shop.</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Every photo here is our own work — customer vehicles, customer homes, our wiring.
              Nothing on this site is stock photography or another shop's portfolio.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-x">
          <GalleryGrid emptyState />
        </div>
      </section>

      <section className="border-t border-border bg-surface/40">
        <div className="container-x section-y-tight">
          <h2 className="font-display text-lg font-semibold">See something you want done?</h2>
          <ul className="mt-6 grid gap-x-10 sm:grid-cols-2">
            {services.map((s) => (
              <li key={s.slug} className="border-b border-border">
                <Link to={s.route} className="group flex items-center justify-between gap-4 py-4">
                  <span className="font-display text-sm font-semibold">{s.serviceName}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-accent transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FinalCTA
        heading="Want yours done like that?"
        body="Tell us the vehicle or the property and what you're after. We'll come back with a recommendation and a flat price."
        location="gallery-final"
      />
    </SiteLayout>
  );
}
