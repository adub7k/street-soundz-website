import { createFileRoute } from "@tanstack/react-router";
import { KeyRound, Siren, Radar, Smartphone } from "lucide-react";

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

import { serviceBySlug } from "@/content/services";
import { seo, faqLd, serviceLd, breadcrumbLd } from "@/lib/seo";

const s = serviceBySlug("vehicle-security")!;
const PATH = "/vehicle-security";
const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Vehicle Security", path: PATH },
];

/** What a day with each of these actually looks like. */
const moments = [
  {
    icon: KeyRound,
    label: "7:10am, January",
    note: "Start it from the kitchen. Get into a warm car with clear glass.",
  },
  {
    icon: Siren,
    label: "Parking lot, lunchtime",
    note: "Someone leans on the truck. The remote in your pocket tells you before the siren finishes.",
  },
  {
    icon: Radar,
    label: "3am, wherever it went",
    note: "Movement alert on your phone. You're reading the police a street address.",
  },
  {
    icon: Smartphone,
    label: "Airport, 800 miles away",
    note: "Did I lock it? Check. Lock it. Done.",
  },
];

export const Route = createFileRoute("/vehicle-security")({
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
  component: Security,
});

function Security() {
  return (
    <SiteLayout>
      <ServiceHero
        eyebrow={s.eyebrow}
        headline={s.headline}
        sub={s.sub}
        slot="service_security"
        serviceName={s.serviceName}
        breadcrumbs={CRUMBS}
      />

      {/* Coverage options first — this buyer is deciding what to get. */}
      {s.options && (
        <Section tone="raised">
          <div className="container-x">
            <SectionHead eyebrow="What we install" title={s.options.title} body={s.options.intro} />
            <OptionsList items={s.options.items} />
          </div>
        </Section>
      )}

      <Section>
        <div className="container-x">
          <SectionHead eyebrow="A day with it" title="What it's actually like to have." />
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {moments.map((m, i) => (
              <Reveal key={m.label} delay={i * 50} className="flex gap-4">
                <m.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <h3 className="font-display text-base font-semibold">{m.label}</h3>
                  <p className="mt-1 leading-relaxed text-muted-foreground">{m.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="raised">
        <div className="container-x">
          <SectionHead eyebrow="The problem" title={s.problem.title} body={s.problem.body} />
          <CostGrid costs={s.problem.costs} />
        </div>
      </Section>

      <Section>
        <div className="container-x">
          <SectionHead eyebrow="Done properly" title="What separates a clean install." />
          <BenefitGrid benefits={s.benefits} />
        </div>
      </Section>

      {s.truths && (
        <Section tone="raised">
          <div className="container-x">
            <SectionHead
              eyebrow="Straight answers"
              title="What security will and won't do."
              body="No system makes a car unstealable. Here's what you're actually buying."
            />
            <TruthTable truths={s.truths} />
          </div>
        </Section>
      )}

      <WorkSection eyebrow="Security installs" title="Recent work." tag="security" />

      <PricingSection
        slug={s.slug}
        serviceName={s.serviceName}
        title="What security work costs here."
        body="Starting prices from our booking system. Some vehicles need a specific integration module, which we confirm before quoting."
        note="Compatibility is model-specific. GPS tracking and phone-app control carry a subscription, quoted separately and up front."
      />

      <QuoteBlock
        heading={s.quote.heading}
        sub={s.quote.sub}
        serviceSlug={s.slug}
        points={[
          "Compatibility checked for your exact model",
          "One flat price, subscription costs stated up front",
          "Every function tested with you",
        ]}
      />

      <Section>
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHead eyebrow="Included" title="What's in every security job." />
            <IncludedList items={s.included} />
          </div>
          <div>
            <SectionHead eyebrow="The process" title="How it goes." />
            <ProcessList steps={s.process} />
          </div>
        </div>
      </Section>

      <ReviewsSection />

      <Section className="cv-auto">
        <div className="container-x grid gap-10 lg:grid-cols-[22rem_1fr] lg:gap-16">
          <SectionHead eyebrow="Security FAQ" title="What people ask." />
          <FaqList faqs={s.faqs} />
        </div>
      </Section>

      <RelatedServices slugs={s.related} guidesFor={s.slug} />
      <FinalCTA
        heading="Parked outside tonight?"
        body="Tell us the vehicle and what worries you. We'll say what's worth it — and what isn't — for how it's parked."
        location="security-final"
        service={s.serviceName}
      />
    </SiteLayout>
  );
}
