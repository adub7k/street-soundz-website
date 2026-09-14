import { images } from "@/config/images";
import { site } from "@/config/site";
import { useSiteImage } from "@/lib/shopGallery";

/**
 * The wordmark. Bundled from the owner's own logo file (transparent PNG →
 * WebP, trimmed); the ShopFlow `logo` slot overrides it at runtime if a newer
 * file is uploaded there. The logo is wide (≈2.3:1), so it's sized by height
 * and the width follows.
 */
export function Logo({
  className = "",
  heightClass = "h-10",
  priority = false,
}: {
  className?: string;
  heightClass?: string;
  priority?: boolean;
}) {
  const override = useSiteImage(images.logo.key);
  const src = override || "/img/street-soundz-logo-700.webp";
  return (
    <img
      src={src}
      srcSet={
        override
          ? undefined
          : "/img/street-soundz-logo-700.webp 700w, /img/street-soundz-logo-1400.webp 1400w"
      }
      sizes={override ? undefined : "(min-width: 1024px) 320px, 220px"}
      alt={site.business.name}
      width={700}
      height={308}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={`${heightClass} w-auto object-contain ${className}`}
    />
  );
}
