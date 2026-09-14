import { Link } from "@tanstack/react-router";
import { ArrowRight, Car, Home } from "lucide-react";
import { vehicleServices, propertyServices, type ServiceContent } from "@/content/services";
import { images } from "@/config/images";
import { useSiteImage } from "@/lib/shopGallery";
import { usePricing, startingAt } from "@/lib/pricing";
import { StartingAt } from "./PricingTable";
import { SlotImage } from "./Motif";
import { Reveal } from "./Reveal";

/**
 * Two pairs. Vehicle work and property work are different customers with
 * different questions, so they're grouped, not mixed into one row of four.
 */
export function ServiceGrid() {
  const pricing = usePricing();

  return (
    <div className="mt-12 space-y-12">
      <Group icon={Car} label="In the car" items={vehicleServices} pricing={pricing} />
      <Group
        icon={Home}
        label="At your home or business"
        items={propertyServices}
        pricing={pricing}
      />
    </div>
  );
}

function Group({
  icon: Icon,
  label,
  items,
  pricing,
}: {
  icon: typeof Car;
  label: string;
  items: ServiceContent[];
  pricing: ReturnType<typeof usePricing>;
}) {
  return (
    <div>
      <Reveal className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-accent" />
        <span className="eyebrow">{label}</span>
        <span className="h-px flex-1 bg-border" />
      </Reveal>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {items.map((s, i) => (
          <Reveal key={s.slug} delay={i * 60}>
            <ServiceCard service={s} from={startingAt(pricing, s.slug)} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function ServiceCard({ service: s, from }: { service: ServiceContent; from: number | null }) {
  const slot = images.service[s.imageSlot];
  const src = useSiteImage(slot.key);

  return (
    <Link
      to={s.route}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface/50 transition-colors hover:border-accent/50"
    >
      <SlotImage
        src={src}
        alt={slot.alt}
        motif={slot.motif}
        ratio="16/9"
        className="rounded-none"
      />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-xl">{s.serviceName}</h3>
          <StartingAt amount={from} />
        </div>
        <p className="mt-2.5 leading-relaxed text-muted-foreground">{s.cardBlurb}</p>
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          {s.cardBenefits.map((b) => (
            <li key={b} className="before:mr-2 before:text-accent before:content-['—']">
              {b}
            </li>
          ))}
        </ul>
        <span className="mt-5 inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-accent">
          See {s.serviceName.toLowerCase()}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
