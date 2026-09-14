import { createFileRoute } from "@tanstack/react-router";
import { Home, Store, TreePine, Footprints, Building2, UtensilsCrossed } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { ServiceHero } from "@/components/site/ServiceHero";
import { Section, SectionHead } from "@/components/site/Section";
import {
  CostGrid,
  BenefitGrid,
  OptionsList,
  TruthTable,
  IncludedList,
} from "@/components/site/ServiceSections";
import { WorkSection } from "@/components/site/GalleryGrid";
import { QuoteBlock } from "@/components/site/QuoteBlock";
import { PricingSection } from "@/components/site/PricingTable";
import { ProcessList } from "@/components/site/ProcessList";
import { ReviewsSection } from "@/components/site/Reviews";
import { FaqList } from "@/components/site/FaqList";
import { RelatedServices } from "@/components/site/RelatedServices";
import { FinalCTA } from "@/components/site/FinalCTA";
import { Reveal } from "@/components/site/Reveal";

import { site } from "@/config/site";
import { serviceBySlug } from "@/content/services";
import { seo, faqLd, serviceLd, breadcrumbLd } from "@/lib/seo";

const s = serviceBySlug("lighting")!;
const PATH = "/lighting";
const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Lighting", path: PATH },
];

const spaces = [
  {
    icon: Home,
    label: "Front yards & entries",
    note: "The first thing a guest — or a buyer — sees after dark.",
  },
  {
    icon: TreePine,
    label: "Trees & feature walls",
    note: "Uplit trees and grazed stone are what make a yard look designed.",
  },
  {
    icon: Footprints,
    label: "Paths, steps & drives",
    note: "Safe footing without the runway look.",
  },
  {
    icon: Store,
    label: "Storefronts & signage",
    note: "Visible to evening traffic instead of dark at six.",
  },
  {
    icon: UtensilsCrossed,
    label: "Restaurant patios",
    note: "Warm enough to sit under, bright enough to read a menu.",
  },
  {
    icon: Building2,
    label: "Offices & lots",
    note: "Fixtures rated for the duty, on a schedule that matches your hours.",
  },
];

export const Route = createFileRoute("/lighting")({
  head: () => {
    const meta = seo({ title: s.metaTitle, description: s.metaDescription, path: PATH });
    return {
      ...meta,
      scripts: [
        {
          type: "application/ld+json",
          children: serviceLd(s.serviceName, s.metaDescription, PATH),
        },
        { type: "application/ld+json", children: faqLd(s.faqs) },
        { type: "application/ld+json", children: breadcrumbLd(CRUMBS) },
      ],
    };
  },
  component: Lighting,
});

function Lighting() {
  return (
    <SiteLayout>
      <ServiceHero
        eyebrow={s.eyebrow}
        headline={s.headline}
        sub={s.sub}
        slot="service_lighting"
        serviceName={s.serviceName}
        breadcrumbs={CRUMBS}
        ctaLabel="Book a Free Site Walk"
      />

      {/* Who this is for, first — a visitor needs to recognise their own
          property before they'll read anything else. */}
      <Section tone="raised">
        <div className="container-x">
          <SectionHead
            eyebrow="Who we do this for"
            title="Homes and businesses, designed the same way."
            body={`We design on site and install across ${site.serviceArea.primary}${site.serviceArea.nearby.length ? ` — ${site.serviceArea.nearby.join(", ")}` : ""}.`}
          />
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {spaces.map((sp, i) => (
              <Reveal key={sp.label} delay={i * 40} className="flex gap-4">
                <sp.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <h3 className="font-display text-base font-semibold">{sp.label}</h3>
                  <p className="mt-1 leading-relaxed text-muted-foreground">{sp.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="container-x">
          <SectionHead eyebrow="The problem" title={s.problem.title} body={s.problem.body} />
          <CostGrid costs={s.problem.costs} />
        </div>
      </Section>

      {s.options && (
        <Section tone="raised">
          <div className="container-x">
            <SectionHead eyebrow="Layers" title={s.options.title} body={s.options.intro} />
            <OptionsList items={s.options.items} />
          </div>
        </Section>
      )}

      <Section>
        <div className="container-x">
          <SectionHead eyebrow="Done properly" title="What changes after it goes in." />
          <BenefitGrid benefits={s.benefits} />
        </div>
      </Section>

      {s.truths && (
        <Section tone="raised">
          <div className="container-x">
            <SectionHead eyebrow="Straight answers" title="What lighting will and won't do." />
            <TruthTable truths={s.truths} />
          </div>
        </Section>
      )}

      <WorkSection
        eyebrow="Lighting we've installed"
        title="Properties after dark."
        tag="lighting"
      />

      <PricingSection
        slug={s.slug}
        serviceName={s.serviceName}
        title="Where lighting starts."
        body="Starting prices for common packages. The real number comes from the site walk, and it's fixed once it's written."
        note="Fixture count, run lengths and the transformer required drive the price. Trenching through hardscape and long runs to detached structures are quoted on the walk."
        flatLabel="flat rate"
      />

      <Section tone="raised">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHead eyebrow="Included" title="What every job covers." />
            <IncludedList items={s.included} />
          </div>
          <div>
            <SectionHead eyebrow="The process" title="From first call to night aim." />
            <ProcessList steps={s.process} />
          </div>
        </div>
      </Section>

      <QuoteBlock
        eyebrow="Free site walk"
        heading={s.quote.heading}
        sub={s.quote.sub}
        serviceSlug={s.slug}
        points={[
          "We come out and sketch it, ideally at dusk",
          "One fixed number in writing",
          "Aimed at night, controls handed over",
        ]}
      />

      <ReviewsSection />

      <Section className="cv-auto">
        <div className="container-x grid gap-10 lg:grid-cols-[22rem_1fr] lg:gap-16">
          <SectionHead eyebrow="Lighting FAQ" title="What property owners ask." />
          <FaqList faqs={s.faqs} />
        </div>
      </Section>

      <RelatedServices slugs={s.related} guidesFor={s.slug} />
      <FinalCTA
        heading="Want to see the place after dark?"
        body="Tell us the property and what you want lit. We'll walk it with you and put a fixed number in writing."
        location="lighting-final"
        service={s.serviceName}
      />
    </SiteLayout>
  );
}
