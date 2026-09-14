import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Hero } from "@/components/site/Hero";
import { TrustBar } from "@/components/site/TrustBar";
import { Section, SectionHead } from "@/components/site/Section";
import { ServiceGrid } from "@/components/site/ServiceGrid";
import { WorkSection } from "@/components/site/GalleryGrid";
import { ProcessList } from "@/components/site/ProcessList";
import { ReviewsSection } from "@/components/site/Reviews";
import { FaqList } from "@/components/site/FaqList";
import { FinalCTA } from "@/components/site/FinalCTA";
import { Reveal } from "@/components/site/Reveal";

import { CITY_STATE } from "@/config/site";
import { whyUs, homeFaqs, homeProcess } from "@/content/home";
import { seo, faqLd } from "@/lib/seo";

const TITLE = `Car Audio, Security, Lighting & Home Theater in ${CITY_STATE} | Street Soundz NM`;
const DESC = `Car audio and vehicle security. Lighting and home theater for homes and businesses. Installed properly in ${CITY_STATE} — clean wiring, one flat price, free quote.`;

export const Route = createFileRoute("/")({
  head: () => {
    const s = seo({ title: TITLE, description: DESC, path: "/" });
    return {
      ...s,
      links: [
        ...s.links,
        // The logo is the hero's LCP image on desktop.
        {
          rel: "preload",
          as: "image",
          href: "/img/street-soundz-logo-700.webp",
          fetchPriority: "high",
        },
      ],
      scripts: [{ type: "application/ld+json", children: faqLd(homeFaqs) }],
    };
  },
  component: Home,
});

function Home() {
  return (
    <SiteLayout>
      <Hero />
      <TrustBar />

      <Section id="services">
        <div className="container-x">
          <SectionHead
            eyebrow="What we do"
            title="Four services. One standard of install."
            body="Two for the car, two for the property. The tools are different; the wiring discipline behind them isn't."
          />
          <ServiceGrid />
        </div>
      </Section>

      <Section tone="raised">
        <div className="container-x">
          <SectionHead
            eyebrow="How we work"
            title="What you can hold us to."
            body="No claims here we can't back up on day one. If something matters to you that isn't on this list, ask — you'll get a straight answer."
          />
          <div className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {whyUs.map((w, i) => (
              <Reveal key={w.title} delay={i * 40}>
                <div className="h-px w-10 bg-accent" />
                <h3 className="mt-4 font-display text-base font-semibold">{w.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{w.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Only exists once the shop has uploaded photos. */}
      <WorkSection
        eyebrow="Real work"
        title="Installs that have actually left the shop."
        body="Every photo here is our own work. No stock photography, no other shop's portfolio."
      />

      <Section className="cv-auto">
        <div className="container-x">
          <SectionHead
            eyebrow="How it works"
            title="From first message to the walk-through."
            body="No mystery pricing and no surprises at the end. Here's the whole thing."
          />
          <ProcessList steps={homeProcess} />
        </div>
      </Section>

      <ReviewsSection />

      <Section className="cv-auto">
        <div className="container-x grid gap-10 lg:grid-cols-[22rem_1fr] lg:gap-16">
          <SectionHead
            eyebrow="Questions"
            title="The things people ask before they book."
            body="Can't see yours? Ask us — we'd rather answer it than have you guess."
          />
          <div>
            <FaqList faqs={homeFaqs} />
            <p className="mt-6 text-sm text-muted-foreground">
              Longer answers in our{" "}
              <Link to="/guides" className="text-accent underline underline-offset-4">
                guides
              </Link>
              .
            </p>
          </div>
        </div>
      </Section>

      <FinalCTA />
    </SiteLayout>
  );
}
