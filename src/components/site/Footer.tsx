import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Youtube } from "lucide-react";
import { site, has } from "@/config/site";
import { services } from "@/content/services";
import { guides } from "@/content/guides";
import { trackContactClick, trackPhoneClick } from "@/lib/analytics";
import { Logo } from "./Logo";

const directionsUrl = site.business.mapsQuery
  ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.business.mapsQuery)}`
  : "";

const socials = [
  { href: site.social.instagram, label: "Instagram", Icon: Instagram },
  { href: site.social.facebook, label: "Facebook", Icon: Facebook },
  { href: site.social.youtube, label: "YouTube", Icon: Youtube },
].filter((s) => s.href);

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface/30">
      <div className="container-x py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* NAP block — keep identical to the Google Business Profile. */}
          <div>
            <Logo heightClass="h-14" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Car audio, vehicle security, lighting and home theater in {site.serviceArea.primary}.{" "}
              {site.business.tagline}
            </p>

            <address className="mt-5 space-y-2.5 text-sm not-italic">
              {has.address && (
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackContactClick("directions")}
                  className="flex items-start gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>
                    {site.business.addressParts.street}
                    <br />
                    {site.business.addressParts.city}, {site.business.addressParts.state}{" "}
                    {site.business.addressParts.zip}
                  </span>
                </a>
              )}
              {!has.address && (
                <p className="flex items-start gap-2.5 text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{site.serviceArea.primary}</span>
                </p>
              )}
              {has.phone && (
                <a
                  href={site.business.phoneHref}
                  onClick={() => trackPhoneClick("footer")}
                  className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Phone className="h-4 w-4 shrink-0 text-accent" />
                  {site.business.phone}
                </a>
              )}
              {has.email && (
                <a
                  href={site.business.emailHref}
                  onClick={() => trackContactClick("email")}
                  className="flex items-center gap-2.5 break-all text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="h-4 w-4 shrink-0 text-accent" />
                  {site.business.email}
                </a>
              )}
              {has.hours && (
                <div className="flex items-start gap-2.5 text-muted-foreground">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>
                    {site.business.hours.map((h) => (
                      <span key={h.day} className="block">
                        {h.day}: {h.value}
                      </span>
                    ))}
                  </span>
                </div>
              )}
            </address>

            {socials.length > 0 && (
              <div className="mt-5 flex gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    <s.Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <FooterCol title="Services">
            {services.map((s) => (
              <FooterLink key={s.slug} to={s.route}>
                {s.serviceName}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Company">
            <FooterLink to="/gallery">Our Work</FooterLink>
            <FooterLink to="/about">About</FooterLink>
            <FooterLink to="/contact">Contact</FooterLink>
            <FooterLink to="/quote">Get a Quote</FooterLink>
          </FooterCol>

          <FooterCol title="Guides">
            {guides.slice(0, 5).map((g) => (
              <FooterLink key={g.slug} to={`/guides/${g.slug}`}>
                {g.navTitle}
              </FooterLink>
            ))}
            <FooterLink to="/guides">All guides</FooterLink>
          </FooterCol>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.business.name}.
          </p>
          <p>
            Serving {site.serviceArea.primary}
            {site.serviceArea.nearby.length ? ` and ${site.serviceArea.nearby.join(", ")}` : ""}.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-foreground">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        to={to}
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        {children}
      </Link>
    </li>
  );
}
