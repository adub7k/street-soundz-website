import { Link } from "@tanstack/react-router";
import { ArrowRight, Phone } from "lucide-react";
import { site, has } from "@/config/site";
import { images, type ServiceImageSlot } from "@/config/images";
import { useSiteImage } from "@/lib/shopGallery";
import { trackPhoneClick, trackQuoteClick } from "@/lib/analytics";
import { Breadcrumbs } from "./Breadcrumbs";
import { SlotImage } from "./Motif";
import { TrustLine } from "./TrustBar";

/**
 * Service-page hero. Split layout so the H1 and the CTA are both above the
 * fold on a phone — this is where paid traffic lands.
 */
export function ServiceHero({
  eyebrow,
  headline,
  sub,
  slot,
  serviceName,
  breadcrumbs,
  ctaLabel = "Get My Free Quote",
}: {
  eyebrow: string;
  headline: string;
  sub: string;
  slot: ServiceImageSlot;
  serviceName: string;
  breadcrumbs: { name: string; path: string }[];
  ctaLabel?: string;
}) {
  const def = images.service[slot];
  const src = useSiteImage(def.key);

  return (
    <section className="relative overflow-hidden pt-[4.5rem]">
      <div className="container-x pb-12 pt-8 sm:pb-16 sm:pt-12">
        <Breadcrumbs trail={breadcrumbs} />

        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="animate-rise">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-4">{headline}</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{sub}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/quote"
                onClick={() => trackQuoteClick("service-hero", serviceName)}
                className="btn btn-primary btn-lg"
              >
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              {has.phone && (
                <a
                  href={site.business.phoneHref}
                  onClick={() => trackPhoneClick("service-hero")}
                  className="btn btn-ghost btn-lg"
                >
                  <Phone className="h-4 w-4" />
                  {site.business.phone}
                </a>
              )}
            </div>

            <TrustLine className="mt-7" />
          </div>

          <SlotImage
            src={src}
            alt={def.alt}
            motif={def.motif}
            ratio="4/3"
            priority
            className="lg:aspect-[5/4]"
          />
        </div>
      </div>
    </section>
  );
}
