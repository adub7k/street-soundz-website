import { createFileRoute } from "@tanstack/react-router";
import { Car, Home } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Section, SectionHead } from "@/components/site/Section";
import { Photo } from "@/components/site/Photo";
import { Logo } from "@/components/site/Logo";
import { WorkSection } from "@/components/site/GalleryGrid";
import { ReviewsSection } from "@/components/site/Reviews";
import { FinalCTA } from "@/components/site/FinalCTA";
import { Reveal } from "@/components/site/Reveal";

import { site, CITY_STATE } from "@/config/site";
import { whyUs } from "@/content/home";
import { vehicleServices, propertyServices } from "@/content/services";
import { useSiteTeam } from "@/lib/shopGallery";
import { seo, breadcrumbLd } from "@/lib/seo";

const PATH = "/about";
const TITLE = `About Street Soundz NM — Car Audio, Security, Lighting & Home Theater in ${CITY_STATE}`;
const DESC = `Street Soundz NM is a ${CITY_STATE} 12-volt and low-voltage installer: car audio and vehicle security, plus lighting and home theater for homes and businesses. How we work, and what you can hold us to.`;
const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "About", path: PATH },
];

export const Route = createFileRoute("/about")({
  head: () => {
    const meta = seo({ title: TITLE, description: DESC, path: PATH });
    return {
      ...meta,
      scripts: [{ type: "application/ld+json", children: breadcrumbLd(CRUMBS) }],
    };
  },
  component: About,
});

function About() {
  const team = useSiteTeam();

  return (
    <SiteLayout>
      <section className="pt-[4.5rem]">
        <div className="container-x pb-12 pt-8 sm:pt-12">
          <Breadcrumbs trail={CRUMBS} />

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <div className="animate-rise">
              <p className="eyebrow">About the shop</p>
              <h1 className="mt-4">One craft. Two places it lives.</h1>
              <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted-foreground">
                <p>
                  {site.business.name} is a {CITY_STATE} shop built on low-voltage work done
                  properly. In the car, that's audio and security. In a house or a business, it's
                  lighting and home theater. The tools change; the discipline — clean runs, solid
                  terminations, nothing visible — doesn't.
                </p>
                <p>
                  We're new, and we'd rather say so than pretend otherwise. What we can promise on
                  day one is the standard of the work, a straight recommendation, and one number in
                  writing before anything starts.
                </p>
              </div>
            </div>

            <div
              className="framed flex items-center justify-center bg-surface p-10"
              style={{ aspectRatio: "4/3" }}
            >
              <Logo
                heightClass="h-auto"
                className="w-full max-w-sm drop-shadow-[0_20px_40px_rgba(0,0,0,0.55)]"
                priority
              />
              <div className="framed-rule" />
            </div>
          </div>
        </div>
      </section>

      <Section tone="raised" tight>
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            {[
              { icon: Car, label: "In the car", items: vehicleServices },
              { icon: Home, label: "At your home or business", items: propertyServices },
            ].map((g) => (
              <Reveal key={g.label}>
                <p className="eyebrow flex items-center gap-2">
                  <g.icon className="h-3.5 w-3.5" />
                  {g.label}
                </p>
                <ul className="mt-4 border-t border-border">
                  {g.items.map((s) => (
                    <li key={s.slug} className="border-b border-border py-4">
                      <span className="font-display text-sm font-semibold">{s.serviceName}</span>
                      <span className="mt-0.5 block text-sm text-muted-foreground">
                        {s.cardBlurb}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Real team, straight from ShopFlow. Renders nothing if unset. */}
      {team.length > 0 && (
        <Section>
          <div className="container-x">
            <SectionHead eyebrow="The crew" title="Who'll actually be doing the work." />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((m, i) => (
                <Reveal key={m.id} delay={i * 60}>
                  {m.photo && (
                    <Photo
                      src={m.photo}
                      alt={`${m.name}, ${m.title} at ${site.business.name}`}
                      ratio="4/3"
                    />
                  )}
                  <h3 className="mt-4 font-display text-lg font-semibold">{m.name}</h3>
                  {m.title && <p className="mt-0.5 text-sm text-accent">{m.title}</p>}
                  {m.bio && <p className="mt-2 leading-relaxed text-muted-foreground">{m.bio}</p>}
                </Reveal>
              ))}
            </div>
          </div>
        </Section>
      )}

      <Section>
        <div className="container-x">
          <SectionHead eyebrow="How we work" title="What you can hold us to." />
          <div className="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
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

      <WorkSection eyebrow="In the shop" title="What a week here looks like." tone="raised" />

      <ReviewsSection tone="base" />

      <FinalCTA
        heading="Let's talk about what you're after."
        body="Send us the details and we'll get you a price first. No pressure either way."
        location="about-final"
      />
    </SiteLayout>
  );
}
