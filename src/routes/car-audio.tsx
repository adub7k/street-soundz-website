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

const s = serviceBySlug("car-audio")!;
const PATH = "/car-audio";
const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Car Audio", path: PATH },
];

/** The signal chain, so a buyer can see where their money goes. */
const chain = [
  { part: "Source", note: "Your factory radio or a new head unit. Where the music starts." },
  { part: "Processing", note: "A DSP that flattens the factory EQ and time-aligns every speaker." },
  {
    part: "Amplification",
    note: "Clean power with headroom. The reason it stays composed when it's loud.",
  },
  {
    part: "Speakers",
    note: "Better cones and real tweeters in the factory spots. The biggest step for the money.",
  },
  { part: "Subwoofer", note: "The bottom two octaves. Sealed for tight, ported for loud." },
  { part: "Deadening", note: "Doors and trunk. Stops the buzz, makes the bass feel solid." },
];

export const Route = createFileRoute("/car-audio")({
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
  component: CarAudio,
});

function CarAudio() {
  return (
    <SiteLayout>
      <ServiceHero
        eyebrow={s.eyebrow}
        headline={s.headline}
        sub={s.sub}
        slot="service_audio"
        serviceName={s.serviceName}
        breadcrumbs={CRUMBS}
      />

      <Section tone="raised">
        <div className="container-x">
          <SectionHead eyebrow="The problem" title={s.problem.title} body={s.problem.body} />
          <CostGrid costs={s.problem.costs} />
        </div>
      </Section>

      {/* Signal chain — specific to this page. */}
      <Section>
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <SectionHead
              eyebrow="Where the money goes"
              title="Six links in the chain."
              body="A system is only as good as its weakest link, and it's rarely the one people expect. This is the order we look at a car in — and the order we'd upgrade it."
            />
            <Reveal delay={60}>
              <ol className="border-t border-border">
                {chain.map((c, i) => (
                  <li
                    key={c.part}
                    className="grid grid-cols-[2rem_1fr] gap-4 border-b border-border py-4"
                  >
                    <span className="font-display text-sm font-bold tabular-nums text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="font-display text-sm font-semibold">{c.part}</span>
                      <span className="mt-0.5 block text-sm text-muted-foreground">{c.note}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </Section>

      {s.options && (
        <Section tone="raised">
          <div className="container-x">
            <SectionHead eyebrow="Options" title={s.options.title} body={s.options.intro} />
            <OptionsList items={s.options.items} />
          </div>
        </Section>
      )}

      <Section>
        <div className="container-x">
          <SectionHead eyebrow="What changes" title="What you'll actually hear." />
          <BenefitGrid benefits={s.benefits} />
        </div>
      </Section>

      {s.truths && (
        <Section tone="raised">
          <div className="container-x">
            <SectionHead
              eyebrow="Straight answers"
              title="What a system will and won't do."
              body="Worth knowing before you spend the money — including the parts most shops leave out."
            />
            <TruthTable truths={s.truths} />
          </div>
        </Section>
      )}

      <WorkSection eyebrow="Audio installs" title="Systems we've built." tag="audio" />

      <PricingSection
        slug={s.slug}
        serviceName={s.serviceName}
        title="What audio work costs here."
        body="Starting prices from our booking system — the same numbers we quote in person. Custom systems are quoted after we've seen the car."
        note="Prices are for a typical vehicle with factory wiring in good shape. Removing a previous install, or a vehicle that needs a specific integration module, can move the number — we'll tell you before we start."
      />

      <QuoteBlock heading={s.quote.heading} sub={s.quote.sub} serviceSlug={s.slug} />

      <Section>
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHead eyebrow="Included" title="What's in every audio job." />
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
          <SectionHead eyebrow="Car audio FAQ" title="Questions we get every week." />
          <FaqList faqs={s.faqs} />
        </div>
      </Section>

      <RelatedServices slugs={s.related} guidesFor={s.slug} />
      <FinalCTA
        heading="Ready to hear what your car can do?"
        body="Send us the year, make and model and how you listen. We'll come back with options and a flat price."
        location="car-audio-final"
        service={s.serviceName}
      />
    </SiteLayout>
  );
}
