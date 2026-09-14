import { Star, ExternalLink } from "lucide-react";
import { site, has } from "@/config/site";
import { reviews as googleReviews } from "@/content/reviews";
import { useShopReviews } from "@/lib/shopGallery";
import { Reveal } from "./Reveal";
import { Section, SectionHead } from "./Section";

type Card = { id: string; name: string; quote: string; rating: number; source: string };

/**
 * Real reviews only — Google ones typed into content/reviews.ts, plus any
 * the shop has collected and featured in ShopFlow (fetched live). Renders
 * nothing at all when there are none: a new shop with an empty "what
 * customers say" box looks worse than a shop with no box.
 */
function useCards(): Card[] {
  const live = useShopReviews();
  const g: Card[] = googleReviews.map((r) => ({
    id: r.id,
    name: r.name,
    quote: r.quote,
    rating: r.rating,
    source: "Google",
  }));
  const s: Card[] = live.map((r) => ({
    id: r.id,
    name: r.name,
    quote: r.comment,
    rating: r.rating,
    source: r.service ? `${r.service} customer` : "Customer",
  }));
  return [...g, ...s];
}

export function Reviews({ limit }: { limit?: number }) {
  const cards = useCards();
  const shown = limit ? cards.slice(0, limit) : cards;
  if (!shown.length) return null;

  return (
    <div className="mt-10 grid gap-5 md:grid-cols-3">
      {shown.map((r, i) => (
        <Reveal
          key={r.id}
          delay={i * 60}
          className="flex flex-col rounded-lg border border-border bg-surface/50 p-6"
        >
          <div className="flex gap-0.5" aria-label={`${r.rating} out of 5 stars`}>
            {Array.from({ length: r.rating }).map((_, j) => (
              <Star key={j} className="h-4 w-4 fill-accent text-accent" />
            ))}
          </div>
          <blockquote className="mt-4 flex-1 text-[1.0625rem] leading-relaxed">
            “{r.quote}”
          </blockquote>
          <footer className="mt-5 border-t border-border pt-4 text-sm">
            <cite className="font-medium not-italic">{r.name}</cite>
            <span className="block text-xs text-muted-foreground">via {r.source}</span>
          </footer>
        </Reveal>
      ))}
    </div>
  );
}

export function ReviewsCta({ className = "" }: { className?: string }) {
  if (!has.reviewLink) return null;
  return (
    <a
      href={site.reviews.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-sm font-medium text-accent underline-offset-4 hover:underline ${className}`}
    >
      {has.reviews
        ? `Read all ${site.reviews.count} reviews on Google`
        : "Leave a review on Google"}
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}

/** A whole section that disappears until there's at least one review. */
export function ReviewsSection({
  title = "What customers say.",
  tone = "raised",
  limit,
}: {
  title?: string;
  tone?: "base" | "raised";
  limit?: number;
}) {
  const cards = useCards();
  if (!cards.length) return null;
  const eyebrow = has.reviews
    ? `${site.reviews.rating.toFixed(1)} on Google · ${site.reviews.count} reviews`
    : "Reviews";
  return (
    <Section tone={tone} className="cv-auto">
      <div className="container-x">
        <SectionHead eyebrow={eyebrow} title={title} align="center" />
        <Reviews limit={limit} />
        <div className="mt-8 text-center">
          <ReviewsCta />
        </div>
      </div>
    </Section>
  );
}
