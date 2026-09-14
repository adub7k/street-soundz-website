import { Check } from "lucide-react";
import { QuoteForm } from "./QuoteForm";
import { Reveal } from "./Reveal";

/**
 * The quote section embedded partway down every service page, so a visitor
 * who's convinced doesn't have to scroll back up. The form starts with the
 * service locked in — vehicle steps for car work, the site-visit flow for
 * property work.
 */
export function QuoteBlock({
  eyebrow = "Free quote",
  heading,
  sub,
  serviceSlug,
  points = [
    "A flat price, not a range",
    "Usually answered the same day",
    "No obligation, no pressure",
  ],
}: {
  eyebrow?: string;
  heading: string;
  sub: string;
  serviceSlug: string;
  points?: string[];
}) {
  return (
    <section id="quote" className="scroll-mt-24 border-y border-border bg-surface/40">
      <div className="container-x section-y">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="mt-3">{heading}</h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted-foreground">{sub}</p>
            <ul className="mt-7 space-y-3">
              {points.map((p) => (
                <li key={p} className="flex gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2.5} />
                  <span className="text-muted-foreground">{p}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={80}>
            <QuoteForm defaultService={serviceSlug} compact />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
