import { createFileRoute } from "@tanstack/react-router";

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

const s = serviceBySlug("home-theater")!;
const PATH = "/home-theater";
const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Home Theater", path: PATH },
];

/** The honest projector-vs-TV decision, up front. */
const decide = [
  {
    title: "Projector",
    when: "A room you can make dark. Controlled light, a big wall, seating set back.",
    not: "A living room with windows — daylight washes the image out and no projector fixes that.",
  },
  {
    title: "Big TV",
    when: "Any room with daylight. Sharper, brighter, on all afternoon without a second thought.",
    not: "A dedicated cinema room where you want the image to fill the wall.",
  },
];

export const Route = createFileRoute("/home-theater")({
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
  component: HomeTheater,
});

function HomeTheater() {
  return (
    <SiteLayout>
      <ServiceHero
        eyebrow={s.eyebrow}
        headline={s.headline}
        sub={s.sub}
        slot="service_theater"
        serviceName={s.serviceName}
        breadcrumbs={CRUMBS}
        ctaLabel="Book a Free Room Visit"
      />

      <Section tone="raised">
        <div className="container-x">
          <SectionHead eyebrow="The problem" title={s.problem.title} body={s.problem.body} />
          <CostGrid costs={s.problem.costs} />
        </div>
      </Section>

      {/* The one decision that shapes everything else. */}
      <Section>
        <div className="container-x">
          <SectionHead
            eyebrow="First decision"
            title="Projector or TV? Your room already knows."
            body="It's the first thing we look at on a visit, and it decides most of the rest. Here's the honest version."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {decide.map((d, i) => (
              <Reveal
                key={d.title}
                delay={i * 60}
                className="rounded-lg border border-border bg-surface/50 p-6 sm:p-7"
              >
                <h3 className="font-display text-xl">{d.title}</h3>
                <p className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-accent">
                  When it wins
                </p>
                <p className="mt-1 leading-relaxed text-muted-foreground">{d.when}</p>
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-faint-foreground">
                  When it doesn't
                </p>
                <p className="mt-1 leading-relaxed text-muted-foreground">{d.not}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {s.options && (
        <Section tone="raised">
          <div className="container-x">
            <SectionHead eyebrow="Room types" title={s.options.title} body={s.options.intro} />
            <OptionsList items={s.options.items} />
          </div>
        </Section>
      )}

      <Section>
        <div className="container-x">
          <SectionHead eyebrow="Done properly" title="What you'll actually notice." />
          <BenefitGrid benefits={s.benefits} />
        </div>
      </Section>

      {s.truths && (
        <Section tone="raised">
          <div className="container-x">
            <SectionHead eyebrow="Straight answers" title="What a theater will and won't do." />
            <TruthTable truths={s.truths} />
          </div>
        </Section>
      )}

      <WorkSection
        eyebrow="Rooms we've built"
        title="Recent theater and audio work."
        tag="theater"
      />

      <PricingSection
        slug={s.slug}
        serviceName={s.serviceName}
        title="Where a room starts."
        body="Starting prices for common packages. Everything else is quoted from the room visit as one fixed number."
        note="Equipment tier and how much wall we have to open drive the price. Pre-wire during a renovation is far cheaper than fishing cable afterwards."
        flatLabel="flat rate"
      />

      <Section tone="raised">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHead eyebrow="Included" title="What every room gets." />
            <IncludedList items={s.included} />
          </div>
          <div>
            <SectionHead eyebrow="The process" title="From first call to first movie." />
            <ProcessList steps={s.process} />
          </div>
        </div>
      </Section>

      <QuoteBlock
        eyebrow="Free room visit"
        heading={s.quote.heading}
        sub={s.quote.sub}
        serviceSlug={s.slug}
        points={[
          "We look at the room before we quote anything",
          "Gear at a couple of price points",
          "One remote when it's done",
        ]}
      />

      <ReviewsSection />

      <Section className="cv-auto">
        <div className="container-x grid gap-10 lg:grid-cols-[22rem_1fr] lg:gap-16">
          <SectionHead eyebrow="Home theater FAQ" title="What people ask." />
          <FaqList faqs={s.faqs} />
        </div>
      </Section>

      <RelatedServices slugs={s.related} guidesFor={s.slug} />
      <FinalCTA
        heading="Want the room to feel like a cinema?"
        body="Send a photo from where you sit and one of the wall. We'll tell you honestly what the room can be."
        location="theater-final"
        service={s.serviceName}
      />
    </SiteLayout>
  );
}
