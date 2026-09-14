import { FileCheck, Cable, Building2, SlidersHorizontal, Star, ShieldCheck } from "lucide-react";
import { site, has, publishedTrustSignals, CITY } from "@/config/site";

const ICONS: Record<string, typeof Star> = {
  quote: FileCheck,
  wiring: Cable,
  scope: Building2,
  tuned: SlidersHorizontal,
  owner: Star,
  warranty: ShieldCheck,
};

/**
 * Verified commitments only. `publishedTrustSignals` filters out anything
 * the owner hasn't confirmed, so an unverified warranty or certification
 * can't reach the page by accident.
 */
export function TrustBar() {
  return (
    <div className="border-y border-border bg-surface/40">
      <div className="container-x">
        <ul className="grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4 sm:divide-y-0">
          {publishedTrustSignals.map((t) => {
            const Icon = ICONS[t.id] ?? Star;
            return (
              <li key={t.id} className="flex items-center gap-3 px-4 py-5 first:pl-0 sm:px-6">
                <Icon className="h-4 w-4 shrink-0 text-accent" />
                <div className="min-w-0">
                  <div className="truncate font-display text-[0.8125rem] font-semibold">
                    {t.value}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">{t.label}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/** Compact inline version for service-page heroes. */
export function TrustLine({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground ${className}`}
    >
      {has.reviews ? (
        <>
          <span className="flex items-center gap-1.5">
            <span className="flex" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
              ))}
            </span>
            <span className="text-foreground">{site.reviews.rating.toFixed(1)}</span> on Google
          </span>
          <span className="hidden h-3 w-px bg-border sm:block" />
        </>
      ) : (
        <>
          <span>Free quotes</span>
          <span className="hidden h-3 w-px bg-border sm:block" />
        </>
      )}
      <span>{CITY} and surrounding</span>
      <span className="hidden h-3 w-px bg-border sm:block" />
      <span>Factory wiring stays intact</span>
    </div>
  );
}
