import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Phone, ChevronDown, ArrowRight } from "lucide-react";
import { site, has } from "@/config/site";
import { vehicleServices, propertyServices } from "@/content/services";
import { trackPhoneClick, trackQuoteClick } from "@/lib/analytics";
import { Logo } from "./Logo";

const groups = [
  { label: "In the car", items: vehicleServices },
  { label: "At your property", items: propertyServices },
];
const primaryLinks = [
  { href: "/gallery", label: "Our Work" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Nav({ scrolled }: { scrolled: boolean }) {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServices, setMobileServices] = useState(true);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      setServicesOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openMenu = () => {
    clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const closeMenu = () => {
    closeTimer.current = setTimeout(() => setServicesOpen(false), 120);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ease-out ${
          scrolled || open
            ? "border-border bg-background/95 shadow-[0_1px_0_0_rgba(255,255,255,0.03)] backdrop-blur-sm"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="container-x">
          <div
            className={`flex items-center justify-between gap-4 transition-[height] duration-300 ease-out ${
              scrolled ? "h-[3.75rem]" : "h-[4.5rem]"
            }`}
          >
            <Link
              to="/"
              className="flex min-w-0 items-center"
              aria-label={`${site.business.name} — home`}
            >
              <Logo heightClass={scrolled ? "h-9 sm:h-10" : "h-10 sm:h-12"} priority />
            </Link>

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
              <div className="relative" onMouseEnter={openMenu} onMouseLeave={closeMenu}>
                <button
                  className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setServicesOpen((v) => !v)}
                  aria-expanded={servicesOpen}
                  aria-haspopup="true"
                >
                  Services
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`absolute left-0 top-full pt-2 transition-[opacity,transform] duration-200 ease-out ${
                    servicesOpen
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-1 opacity-0"
                  }`}
                >
                  <div className="panel grid w-[30rem] grid-cols-2 gap-1 p-2 shadow-[var(--shadow-lift)]">
                    {groups.map((g) => (
                      <div key={g.label} className="p-1">
                        <p className="eyebrow px-2 pb-1.5 pt-1">{g.label}</p>
                        {g.items.map((s) => (
                          <Link
                            key={s.slug}
                            to={s.route}
                            onClick={() => setServicesOpen(false)}
                            className="block rounded-md px-2 py-2 transition-colors hover:bg-surface-2"
                          >
                            <span className="block text-sm font-medium text-foreground">
                              {s.serviceName}
                            </span>
                            <span className="block text-xs leading-snug text-muted-foreground">
                              {s.cardBenefits.slice(0, 2).join(" · ")}
                            </span>
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {primaryLinks.map((l) => (
                <Link
                  key={l.href}
                  to={l.href}
                  className="nav-link rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  activeProps={{
                    className: "nav-link is-active rounded-md px-3 py-2 text-sm text-foreground",
                  }}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              {has.phone && (
                <a
                  href={site.business.phoneHref}
                  onClick={() => trackPhoneClick("nav")}
                  className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground xl:flex"
                >
                  <Phone className="h-4 w-4" />
                  {site.business.phone}
                </a>
              )}
              <Link
                to="/quote"
                onClick={() => trackQuoteClick("nav")}
                className="btn btn-primary text-sm"
              >
                Get My Free Quote
              </Link>
            </div>

            <button
              onClick={() => setOpen((v) => !v)}
              className="-mr-2 grid h-11 w-11 place-items-center rounded-md text-foreground lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Rendered OUTSIDE <header>: backdrop-filter would make the header the
          containing block for this fixed sheet. Always mounted so closing
          animates; inert while shut. */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-x-0 bottom-0 z-50 overflow-y-auto overscroll-contain border-t border-border bg-background transition-[opacity,transform] duration-250 ease-out lg:hidden ${
          scrolled ? "top-[3.75rem]" : "top-[4.5rem]"
        } ${open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}`}
      >
        <nav className="container-x flex flex-col py-5" aria-label="Mobile">
          <button
            onClick={() => setMobileServices((v) => !v)}
            className="flex items-center justify-between py-3.5 text-left font-display text-base font-semibold"
            aria-expanded={mobileServices}
            aria-controls="mobile-services"
          >
            Services
            <ChevronDown
              className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                mobileServices ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            id="mobile-services"
            className={`grid transition-[grid-template-rows] duration-250 ease-out ${
              mobileServices ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <div className="mb-2 ml-1 flex flex-col border-l border-border pl-4">
                {groups.map((g) => (
                  <div key={g.label} className="pb-2">
                    <p className="eyebrow pb-1 pt-2">{g.label}</p>
                    {g.items.map((s) => (
                      <Link
                        key={s.slug}
                        to={s.route}
                        onClick={() => setOpen(false)}
                        className="block py-2.5 text-[0.9375rem] text-muted-foreground"
                      >
                        {s.serviceName}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {primaryLinks.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              onClick={() => setOpen(false)}
              className="border-t border-border py-3.5 font-display text-base font-semibold"
            >
              {l.label}
            </Link>
          ))}

          <Link
            to="/quote"
            onClick={() => {
              trackQuoteClick("mobile-menu");
              setOpen(false);
            }}
            className="btn btn-primary btn-lg mt-6"
          >
            Get My Free Quote
            <ArrowRight className="h-4 w-4" />
          </Link>
          {has.phone && (
            <a
              href={site.business.phoneHref}
              onClick={() => trackPhoneClick("mobile-menu")}
              className="btn btn-ghost mt-3"
            >
              <Phone className="h-4 w-4" />
              {site.business.phone}
            </a>
          )}
          <p className="mt-6 pb-8 text-sm text-muted-foreground">
            {site.business.name} · {site.serviceArea.primary}
            {has.hours && (
              <>
                <br />
                {site.business.hours[0].day}: {site.business.hours[0].value}
              </>
            )}
          </p>
        </nav>
      </div>
    </>
  );
}
