import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2, Phone, AlertTriangle } from "lucide-react";
import { site, has } from "@/config/site";
import type { ServiceContent } from "@/content/services";
import {
  captureAttribution,
  isValidEmail,
  isValidPhone,
  submitLead,
  uploadPhotos,
} from "@/lib/leads";
import {
  trackLeadCaptured,
  trackQuoteAdsConversion,
  trackQuoteComplete,
  trackQuoteError,
  trackQuoteStart,
  trackQuoteStep,
} from "@/lib/analytics";
import { PhotoStep, Field, ChipGroup, Input } from "./QuoteForm";

/**
 * Site-visit quoting for lighting and home theater.
 *
 * A vehicle quote needs three facts (year, make, model). A property quote
 * needs the things that actually drive the job — the space, what's there
 * already, what the owner wants to see — so the visit is a design session,
 * not a discovery call. Sends `skipRequiredCustomFields` because the tenant's
 * vehicle fields can't apply to a living room.
 */

const STEPS = ["Project", "Goals", "The space", "Photos", "Contact"] as const;
const MAX_PHOTOS = 4;

type Data = {
  propertyType: string;
  goals: string[];
  size: string;
  existing: string;
  details: string;
  photos: File[];
  name: string;
  phone: string;
  email: string;
  propertyAddress: string;
  honeypot: string;
};

const initial: Data = {
  propertyType: "",
  goals: [],
  size: "",
  existing: "",
  details: "",
  photos: [],
  name: "",
  phone: "",
  email: "",
  propertyAddress: "",
  honeypot: "",
};

export function PropertyQuoteForm({ service }: { service: ServiceContent }) {
  const lead = service.lead!;
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);
  const headingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    captureAttribution();
  }, []);

  const set = <K extends keyof Data>(k: K, v: Data[K]) => {
    if (!started.current) {
      started.current = true;
      trackQuoteStart(service.serviceName);
    }
    setData((d) => ({ ...d, [k]: v }));
    if (k in errors) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const toggleGoal = (v: string) =>
    set("goals", data.goals.includes(v) ? data.goals.filter((x) => x !== v) : [...data.goals, v]);

  const canAdvance = () => {
    if (step === 0) return !!data.propertyType;
    if (step === 1) return data.goals.length > 0;
    if (step === 2) return !!data.existing;
    if (step === 3) return true;
    if (step === 4) return !!(data.name && data.phone && data.email);
    return true;
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 4) {
      if (data.name.trim().length < 2) e.name = "Please enter your name";
      if (!isValidPhone(data.phone)) e.phone = "Enter a valid 10-digit phone number";
      if (!isValidEmail(data.email)) e.email = "Enter a valid email address";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goTo = (n: number) => {
    setStep(n);
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const next = () => {
    if (!canAdvance() || !validate()) return;
    trackQuoteStep(step, STEPS[step], service.serviceName);
    goTo(step + 1);
  };

  const submit = async () => {
    if (!canAdvance() || !validate() || sending) return;
    setSending(true);
    setError(null);
    trackLeadCaptured(service.serviceName);
    trackQuoteAdsConversion();

    const photoUrls = data.photos.length ? await uploadPhotos(data.photos, MAX_PHOTOS) : [];

    const res = await submitLead({
      name: data.name,
      phone: data.phone,
      email: data.email,
      service: service.serviceName,
      serviceTag: service.leadValue,
      goal: data.goals.join(", "),
      timeline: "",
      notes: data.details,
      extraLines: [
        `— ${service.serviceName.toUpperCase()} SITE VISIT REQUEST —`,
        `Project: ${data.propertyType}`,
        data.size && `Space: ${data.size}`,
        data.existing && `Existing: ${data.existing}`,
        data.propertyAddress && `Property address: ${data.propertyAddress}`,
      ].filter(Boolean) as string[],
      vehicle: { year: "", make: "", model: "", type: "" },
      skipRequiredCustomFields: true,
      photoUrls,
      honeypot: data.honeypot,
    });

    setSending(false);
    if (res.ok) {
      setSent(true);
      trackQuoteComplete(service.serviceName);
    } else {
      trackQuoteError(res.error || "unknown");
      setError(
        res.error && res.error !== "network"
          ? res.error
          : "We couldn't send that just then. Try again in a moment, or give us a call.",
      );
    }
  };

  if (sent) {
    return (
      <div
        className="panel p-6 text-center sm:p-10"
        role="status"
        aria-live="polite"
        data-quote-state="success"
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent">
          <Check className="h-7 w-7 text-accent-foreground" strokeWidth={2.5} />
        </div>
        <h3 className="mt-6 font-display text-2xl">Thanks, {data.name.trim().split(" ")[0]}.</h3>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          We've got the details on your {data.propertyType.toLowerCase()} project. We'll call to set
          up the visit and put a fixed number in writing after that.
        </p>
        {has.phone && (
          <a
            href={site.business.phoneHref}
            className="tap-target mt-5 gap-2 text-accent underline underline-offset-4"
          >
            <Phone className="h-4 w-4" />
            {site.business.phone}
          </a>
        )}
      </div>
    );
  }

  const lastStep = step === STEPS.length - 1;

  return (
    <div className="panel p-5 sm:p-8">
      <div className="mb-7">
        <div className="flex items-center justify-between text-xs">
          <span className="font-display text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-accent">
            Step {step + 1} of {STEPS.length}
          </span>
          <span className="text-muted-foreground">{STEPS[step]}</span>
        </div>
        <div
          className="mt-2.5 h-1 overflow-hidden rounded-full bg-surface-2"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-label="Quote progress"
        >
          <div
            className="h-full bg-accent transition-[width] duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div key={step} ref={headingRef} tabIndex={-1} className="step-enter outline-none">
        {step === 0 && (
          <Field legend={lead.selectLabel}>
            <ChipGroup
              name="propertyType"
              options={lead.selectOptions}
              value={data.propertyType}
              onChange={(v) => set("propertyType", v)}
            />
          </Field>
        )}

        {step === 1 && (
          <Field legend="What are you after?">
            <p className="-mt-2 mb-4 text-sm text-muted-foreground">
              Pick everything that applies.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {lead.goalOptions.map((o) => {
                const active = data.goals.includes(o);
                return (
                  <label
                    key={o}
                    className={`cursor-pointer rounded-full border px-4 py-2.5 text-[0.9375rem] transition-colors ${
                      active
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-line-strong hover:bg-surface-2"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggleGoal(o)}
                      className="sr-only"
                    />
                    {o}
                  </label>
                );
              })}
            </div>
          </Field>
        )}

        {step === 2 && (
          <div className="space-y-7">
            <Field legend={lead.sizeLabel}>
              <p className="-mt-2 mb-4 text-sm text-muted-foreground">{lead.sizeHint}</p>
              <input
                value={data.size}
                onChange={(e) => set("size", e.target.value)}
                placeholder={lead.sizePlaceholder}
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-[0.9375rem] placeholder:text-faint-foreground focus:border-accent focus:outline-none"
              />
            </Field>
            <Field legend={lead.existingLabel}>
              <ChipGroup
                name="existing"
                options={lead.existingOptions}
                value={data.existing}
                onChange={(v) => set("existing", v)}
              />
            </Field>
          </div>
        )}

        {step === 3 && (
          <PhotoStep
            photos={data.photos}
            onChange={(p) => set("photos", p)}
            notes={data.details}
            onNotes={(v) => set("details", v)}
            hint={lead.photoHint}
            notesPlaceholder="A deadline, a budget you're working to, hours we should work around…"
          />
        )}

        {step === 4 && (
          <div className="space-y-7">
            <Field legend="Where should we send the quote?">
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  idPrefix="p"
                  label="Your name"
                  value={data.name}
                  onChange={(v) => set("name", v)}
                  error={errors.name}
                  autoComplete="name"
                />
                <Input
                  idPrefix="p"
                  label="Phone"
                  value={data.phone}
                  onChange={(v) => set("phone", v)}
                  error={errors.phone}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                />
                <Input
                  idPrefix="p"
                  label="Email"
                  value={data.email}
                  onChange={(v) => set("email", v)}
                  error={errors.email}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                />
                <Input
                  idPrefix="p"
                  label="Property address"
                  value={data.propertyAddress}
                  onChange={(v) => set("propertyAddress", v)}
                  hint="So we can plan the visit. Optional, but it speeds things up."
                />
              </div>
            </Field>

            <div aria-hidden className="absolute h-0 w-0 overflow-hidden opacity-0">
              <label htmlFor="p-website">Website</label>
              <input
                id="p-website"
                tabIndex={-1}
                autoComplete="off"
                value={data.honeypot}
                onChange={(e) => setData((d) => ({ ...d, honeypot: e.target.value }))}
              />
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              We use your details to arrange the visit and follow up about it. Nothing else.
            </p>
          </div>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-2.5 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <div>
            <p>{error}</p>
            {has.phone && (
              <a
                href={site.business.phoneHref}
                className="mt-2 inline-flex items-center gap-1.5 font-medium text-accent"
              >
                <Phone className="h-3.5 w-3.5" />
                {site.business.phone}
              </a>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between gap-3">
        {step > 0 ? (
          <button onClick={() => goTo(step - 1)} className="btn btn-ghost" type="button">
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        ) : (
          <span />
        )}

        {!lastStep ? (
          <button onClick={next} disabled={!canAdvance()} className="btn btn-primary" type="button">
            {step === 3 && data.photos.length === 0 ? "Skip" : "Continue"}
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={!canAdvance() || sending}
            className="btn btn-primary btn-lg"
            type="button"
          >
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                {lead.submitLabel}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
