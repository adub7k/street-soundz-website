import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useShopGallery, type ShopPhoto } from "@/lib/shopGallery";
import { galleryFilters } from "@/content/gallery";
import { trackGalleryFilter, trackGalleryOpen } from "@/lib/analytics";
import { Section, SectionHead } from "./Section";

/**
 * The portfolio. Photos come from ShopFlow → Settings → Work Gallery. CSS
 * columns keep each phone shot in the framing it was taken with.
 *
 * Returns null while empty (the shop is new) unless `emptyState` is passed —
 * only the /gallery page shows one.
 */
export function GalleryGrid({
  limit,
  showFilters = true,
  tag,
  emptyState = false,
}: {
  limit?: number;
  showFilters?: boolean;
  tag?: string;
  emptyState?: boolean;
}) {
  const { photos, loading } = useShopGallery();
  const [filter, setFilter] = useState<string>(tag ?? "all");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const list = filter === "all" ? photos : photos.filter((p) => p.tag === filter);
    return limit ? list.slice(0, limit) : list;
  }, [photos, filter, limit]);

  const availableFilters = useMemo(
    () => galleryFilters.filter((f) => f.key === "all" || photos.some((p) => p.tag === f.key)),
    [photos],
  );

  const close = useCallback(() => setLightbox(null), []);
  const move = useCallback(
    (dir: 1 | -1) =>
      setLightbox((i) => (i === null ? i : (i + dir + filtered.length) % filtered.length)),
    [filtered.length],
  );

  if (loading) return null;

  if (!photos.length || (tag && !filtered.length)) {
    if (!emptyState) return null;
    return (
      <div className="mt-10 rounded-lg border border-border bg-surface/50 p-8 text-center">
        <p className="font-display text-lg font-semibold">Photos are on their way.</p>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          We're a new shop and we'd rather show you real installs than stock pictures. Check back
          soon — or ask us and we'll send photos of a job like yours.
        </p>
        <Link to="/quote" className="btn btn-ghost mt-6">
          Get a quote instead
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <>
      {showFilters && availableFilters.length > 2 && (
        <div
          className="mt-8 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filter work by service"
        >
          {availableFilters.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setFilter(f.key);
                  trackGalleryFilter(f.key);
                }}
                className={`rounded-full border px-4 py-2 text-sm transition-colors duration-200 ${
                  active
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-line-strong text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      )}

      <div key={filter} className="page-enter mt-8 gap-4 sm:columns-2 lg:columns-3">
        {filtered.map((p, i) => (
          <Tile
            key={p.id}
            photo={p}
            onOpen={() => {
              setLightbox(i);
              trackGalleryOpen(p.caption || "untitled");
            }}
          />
        ))}
      </div>

      {lightbox !== null && filtered[lightbox] && (
        <Lightbox
          photo={filtered[lightbox]}
          index={lightbox}
          total={filtered.length}
          onClose={close}
          onMove={move}
        />
      )}
    </>
  );
}

/**
 * A whole "our work" section that only exists once there are photos. Used
 * on the homepage, about page and service pages so a new shop never shows
 * an empty heading.
 */
export function WorkSection({
  eyebrow,
  title,
  body,
  tag,
  limit = 6,
  tone = "base",
  cta = true,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  tag?: string;
  limit?: number;
  tone?: "base" | "raised";
  cta?: boolean;
}) {
  const { photos, loading } = useShopGallery();
  const relevant = tag ? photos.filter((p) => p.tag === tag) : photos;
  if (loading || !relevant.length) return null;
  return (
    <Section tone={tone} className="cv-auto">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead eyebrow={eyebrow} title={title} body={body} className="max-w-xl" />
          {cta && (
            <Link to="/gallery" className="btn btn-ghost shrink-0">
              See more of our work
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
        <GalleryGrid limit={limit} showFilters={false} tag={tag} />
      </div>
    </Section>
  );
}

function Tile({ photo: p, onOpen }: { photo: ShopPhoto; onOpen: () => void }) {
  const [ratio, setRatio] = useState<string>("3/4");

  return (
    <button
      onClick={onOpen}
      aria-label={p.caption ? `View: ${p.caption}` : "View photo"}
      className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-md border border-border text-left transition-colors duration-200 hover:border-line-strong"
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: ratio }}>
        <img
          src={p.url}
          alt={p.alt}
          loading="lazy"
          decoding="async"
          onLoad={(e) => {
            const el = e.currentTarget;
            if (el.naturalWidth && el.naturalHeight)
              setRatio(`${el.naturalWidth}/${el.naturalHeight}`);
          }}
          className="h-full w-full object-cover transition-[transform,filter] duration-500 ease-out group-hover:scale-[1.02] group-hover:brightness-110"
        />
        {p.caption && (
          <>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/85 to-transparent" />
            <span className="pointer-events-none absolute bottom-3 left-3.5 right-3.5 font-display text-xs font-semibold text-white drop-shadow transition-transform duration-300 ease-out group-hover:-translate-y-0.5">
              {p.caption}
            </span>
          </>
        )}
      </div>
    </button>
  );
}

function Lightbox({
  photo,
  index,
  total,
  onClose,
  onMove,
}: {
  photo: ShopPhoto;
  index: number;
  total: number;
  onClose: () => void;
  onMove: (dir: 1 | -1) => void;
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    restoreRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => setEntered(true));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key === "ArrowRight") return onMove(1);
      if (e.key === "ArrowLeft") return onMove(-1);
      if (e.key !== "Tab") return;
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>("button");
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
      restoreRef.current?.focus?.();
    };
  }, [onClose, onMove]);

  return (
    <div
      ref={dialogRef}
      className={`fixed inset-0 z-[60] flex flex-col bg-black/95 transition-opacity duration-200 ${
        entered ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={photo.caption || "Photo"}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onTouchStart={(e) => {
        const t = e.touches[0];
        touch.current = { x: t.clientX, y: t.clientY };
      }}
      onTouchEnd={(e) => {
        const start = touch.current;
        if (!start) return;
        const t = e.changedTouches[0];
        const dx = t.clientX - start.x;
        const dy = t.clientY - start.y;
        touch.current = null;
        if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
        onMove(dx < 0 ? 1 : -1);
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 text-sm text-white/70">
        <span aria-live="polite">
          {index + 1} / {total}
        </span>
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close"
          className="grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4">
        <button
          onClick={() => onMove(-1)}
          aria-label="Previous photo"
          className="absolute left-2 z-10 hidden h-12 w-12 place-items-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 sm:grid"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <img
          key={photo.id}
          src={photo.url}
          alt={photo.alt}
          className={`max-h-full max-w-full rounded-md object-contain transition-[opacity,transform] duration-300 ease-out ${
            entered ? "scale-100 opacity-100" : "scale-[0.98] opacity-0"
          }`}
        />
        <button
          onClick={() => onMove(1)}
          aria-label="Next photo"
          className="absolute right-2 z-10 hidden h-12 w-12 place-items-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 sm:grid"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <p className="px-4 pb-6 text-center font-display text-xs text-white/90">
        {photo.caption}
        <span className="mt-1 block text-xs text-white/50 sm:hidden">Swipe to browse</span>
      </p>
    </div>
  );
}
