import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import { site, CITY_STATE } from "@/config/site";
import { images } from "@/config/images";
import { useWideSiteImage } from "@/lib/shopGallery";
import { trackQuoteClick } from "@/lib/analytics";
import { Motif } from "./Motif";
import { Logo } from "./Logo";

/**
 * Homepage hero.
 *
 * There's no shop photography yet, so the band is a designed sound field
 * with the owner's logo as the visual. When a landscape hero photo is set in
 * ShopFlow it takes over and the logo drops into the copy column.
 */
export function Hero() {
  const heroSrc = useWideSiteImage(images.hero.key);

  return (
    <section className="relative isolate flex min-h-[40rem] items-end overflow-hidden pt-[4.5rem] lg:min-h-[86vh]">
      <div className="absolute inset-0 -z-10">
        {heroSrc ? (
          <img
            src={heroSrc}
            alt={images.hero.alt}
            width={1600}
            height={900}
            fetchPriority="high"
            decoding="sync"
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <Motif kind="hero" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/40 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background/80 to-transparent" />
      </div>

      <div className="container-x relative w-full pb-14 pt-16 sm:pb-20 lg:pb-24">
        <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="max-w-2xl">
            <p className="eyebrow hero-step-1 flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              {CITY_STATE}
            </p>

            <h1 className="hero-step-1 mt-4">
              Sound and light,
              <span className="text-accent"> wired the right way.</span>
            </h1>

            <p className="hero-step-2 mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Car audio and vehicle security. Lighting and home theater for houses and businesses.
              Same clean, low-voltage craft in all of it — nothing cut, nothing visible, everything
              tuned before you see it.
            </p>

            <p className="hero-step-2 mt-5 font-display text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-chrome/90">
              Audio <span className="text-accent">·</span> Lighting{" "}
              <span className="text-accent">·</span> Security <span className="text-accent">·</span>{" "}
              Home Theater
            </p>

            <div className="hero-step-3 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/quote"
                onClick={() => trackQuoteClick("hero")}
                className="btn btn-primary btn-lg"
              >
                Get My Free Quote
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#services" className="btn btn-ghost btn-lg">
                See what we do
              </a>
            </div>

            <div className="hero-step-4 mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <span>Free quotes, one flat number</span>
              <span className="hidden h-3 w-px bg-border sm:block" />
              <span>Factory wiring stays intact</span>
              <span className="hidden h-3 w-px bg-border sm:block" />
              <span>{site.business.shortName} NM</span>
            </div>
          </div>

          {/* The logo IS the hero visual until there's a real photo. */}
          <div className="hero-step-2 hidden justify-end lg:flex">
            <Logo
              heightClass="h-auto"
              className="w-full max-w-[26rem] drop-shadow-[0_24px_48px_rgba(0,0,0,0.6)]"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
