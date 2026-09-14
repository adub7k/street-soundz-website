import { Link } from "@tanstack/react-router";
import { ArrowRight, Info } from "lucide-react";
import { usePricing, money, lowestOf } from "@/lib/pricing";
import { Reveal } from "./Reveal";
import { Section, SectionHead } from "./Section";
import { trackQuoteClick } from "@/lib/analytics";

/**
 * Published pricing for one service, read live from ShopFlow.
 *
 * Renders nothing at all when the API is unreachable or the service has no
 * priced entries — the page keeps its quote CTA either way. For a new shop
 * that hasn't set prices yet, that means no pricing section exists; it
 * appears the moment a priced service is saved in ShopFlow.
 */
export function PricingTable({
  slug,
  serviceName,
  note,
  flatLabel = "all vehicles",
}: {
  slug: string;
  serviceName: string;
  note?: string;
  /** What a size-independent price applies to: "all vehicles" / "flat rate". */
  flatLabel?: string;
}) {
  const pricing = usePricing();
  const rows = pricing?.rows[slug];
  if (!rows?.length) return null;

  const addons = pricing?.addons[slug] ?? [];
  const sizeCols = (pricing?.sizes ?? []).filter((sz) =>
    rows.some((r) => r.sizes?.some((s) => s.key === sz.key)),
  );
  const anySized = sizeCols.length > 0;

  return (
    <Reveal>
      {/* Phones: stacked cards. sm+: a table. */}
      <div className="space-y-3 sm:hidden">
        {rows.map((r) => (
          <div key={r.id} className="rounded-lg border border-border bg-surface/40 p-4">
            <h3 className="font-display text-base font-semibold">{r.name}</h3>
            {r.sizes ? (
              <dl className="mt-3 space-y-1.5">
                {r.sizes.map((sz) => (
                  <div key={sz.key} className="flex items-baseline justify-between gap-4">
                    <dt className="text-sm text-muted-foreground">{sz.label}</dt>
                    <dd className="font-display text-lg font-semibold tabular-nums">
                      {money(sz.amount)}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <div className="mt-2 flex items-baseline justify-between gap-4">
                <span className="text-sm text-muted-foreground">{flatLabel}</span>
                <span className="font-display text-lg font-semibold tabular-nums">
                  {money(r.flat ?? lowestOf(r))}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-lg border border-border sm:block">
        <table className="w-full min-w-[30rem] border-collapse text-left">
          <caption className="sr-only">{serviceName} pricing</caption>
          <thead>
            <tr className="bg-surface">
              <th
                scope="col"
                className="px-5 py-3.5 font-display text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
              >
                Service
              </th>
              {anySized ? (
                sizeCols.map((c) => (
                  <th
                    key={c.key}
                    scope="col"
                    className="px-5 py-3.5 text-right font-display text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                  >
                    {c.label}
                  </th>
                ))
              ) : (
                <th
                  scope="col"
                  className="px-5 py-3.5 text-right font-display text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                >
                  Price
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr key={r.id}>
                <th scope="row" className="px-5 py-4 align-middle font-medium">
                  {r.name}
                </th>
                {r.sizes ? (
                  sizeCols.map((c) => {
                    const s = r.sizes?.find((x) => x.key === c.key);
                    return (
                      <td
                        key={c.key}
                        className="px-5 py-4 text-right font-display text-lg font-semibold tabular-nums"
                      >
                        {s ? (
                          money(s.amount)
                        ) : (
                          <span className="text-sm font-normal text-muted-foreground">ask</span>
                        )}
                      </td>
                    );
                  })
                ) : (
                  <td
                    colSpan={Math.max(sizeCols.length, 1)}
                    className="px-5 py-4 text-right font-display text-lg font-semibold tabular-nums"
                  >
                    {money(r.flat ?? lowestOf(r))}
                    {anySized && (
                      <span className="ml-2 align-middle text-xs font-normal text-muted-foreground">
                        {flatLabel}
                      </span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {addons.length > 0 && (
        <div className="mt-6">
          <h3 className="font-display text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Add-ons
          </h3>
          <ul className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {addons.map((a) => (
              <li
                key={a.id}
                className="flex items-baseline justify-between gap-4 border-b border-border py-2.5"
              >
                <span className="text-muted-foreground">{a.name}</span>
                <span className="font-display font-semibold tabular-nums">+{money(a.price)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-4 rounded-lg border border-border bg-surface/50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            {note ??
              "Starting prices for a typical job. Anything unusual — we'll tell you before we start, not after."}
            {pricing?.deposit && (
              <>
                {" "}
                A {money(pricing.deposit.amount)} deposit secures your booking and comes off the
                total.
              </>
            )}
          </p>
        </div>
        <Link
          to="/quote"
          onClick={() => trackQuoteClick("pricing-table", serviceName)}
          className="btn btn-ghost shrink-0"
        >
          Confirm my price
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Reveal>
  );
}

/**
 * A whole pricing section that only exists once the tenant has priced
 * services for this page. Keeps the route files clean.
 */
export function PricingSection({
  slug,
  serviceName,
  title,
  body,
  note,
  flatLabel,
  tone = "base",
}: {
  slug: string;
  serviceName: string;
  title: string;
  body: string;
  note?: string;
  flatLabel?: string;
  tone?: "base" | "raised";
}) {
  const pricing = usePricing();
  if (!pricing?.rows[slug]?.length) return null;
  return (
    <Section tone={tone}>
      <div className="container-x">
        <SectionHead eyebrow="Pricing" title={title} body={body} />
        <div className="mt-10">
          <PricingTable slug={slug} serviceName={serviceName} note={note} flatLabel={flatLabel} />
        </div>
      </div>
    </Section>
  );
}

/** "from $425" for the homepage service cards. Renders nothing without data. */
export function StartingAt({ amount }: { amount: number | null }) {
  if (amount == null) return null;
  return (
    <span className="whitespace-nowrap text-sm text-muted-foreground">
      from <span className="font-display font-semibold text-foreground">{money(amount)}</span>
    </span>
  );
}
