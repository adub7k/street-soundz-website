import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { site, has } from "@/config/site";
import { trackPhoneClick, trackQuoteClick } from "@/lib/analytics";

/**
 * Sticky call / quote bar for phones. Hidden on the first screen, hidden
 * while the quote form itself is on screen, hidden on /quote. SiteLayout
 * reserves matching bottom padding so it can never cover content.
 */
export function MobileCTA({ visible }: { visible: boolean }) {
  const [formInView, setFormInView] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    setFormInView(false);
    const target = document.getElementById("quote");
    if (!target) return;
    const io = new IntersectionObserver(([e]) => setFormInView(e.isIntersecting), {
      threshold: 0,
    });
    io.observe(target);
    return () => io.disconnect();
  }, [pathname]);

  if (pathname === "/quote") return null;

  const shown = visible && !formInView;

  return (
    <div
      aria-hidden={!shown}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-sm transition-transform duration-300 ease-out lg:hidden ${
        shown ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex gap-2 px-4 py-2.5">
        {has.phone && (
          <a
            href={site.business.phoneHref}
            onClick={() => trackPhoneClick("sticky-bar")}
            tabIndex={shown ? undefined : -1}
            className="btn btn-ghost flex-1"
          >
            <Phone className="h-4 w-4" />
            Call
          </a>
        )}
        <Link
          to="/quote"
          onClick={() => trackQuoteClick("sticky-bar")}
          tabIndex={shown ? undefined : -1}
          className="btn btn-primary flex-[1.4]"
        >
          Get My Free Quote
        </Link>
      </div>
    </div>
  );
}
