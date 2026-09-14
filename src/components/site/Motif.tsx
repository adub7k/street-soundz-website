import type { MotifKind } from "@/config/images";

/**
 * Designed stand-ins for photography.
 *
 * A brand-new shop has no portfolio, and a stock photo of someone else's
 * install is a lie about the work. So every image slot renders one of these
 * until the owner uploads a real photo in ShopFlow. They're built from the
 * brand: near-black ground, a fine dot grid, and the gold accent doing what
 * each service does — a waveform for audio, a radar sweep for security, light
 * cones for lighting, a glowing screen for home theater.
 *
 * Motion is transform/opacity only, disabled under prefers-reduced-motion,
 * and deterministic (seeded) so server and client render the same markup.
 */

/** Deterministic pseudo-random so SSR and hydration agree. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function Bars({
  count,
  seed,
  animate,
  minH = 0.08,
  maxH = 0.9,
  className = "",
}: {
  count: number;
  seed: number;
  animate: boolean;
  minH?: number;
  maxH?: number;
  className?: string;
}) {
  const rnd = seeded(seed);
  const gap = 100 / count;
  const bars = Array.from({ length: count }, (_, i) => {
    // Bell-shaped envelope so the waveform swells in the middle.
    const env = Math.sin((i / (count - 1)) * Math.PI);
    const h = minH + (maxH - minH) * (0.35 * env + 0.65 * rnd() * env + 0.1 * rnd());
    // Rounded so the SSR string and the client's float stringify identically
    // — otherwise React reports a hydration mismatch on every bar.
    const r3 = (n: number) => Math.round(n * 1000) / 1000;
    return {
      x: r3(i * gap + gap * 0.25),
      w: r3(gap * 0.5),
      h: r3(h),
      dur: 2.4 + rnd() * 2.2,
      delay: rnd() * 2,
    };
  });
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`absolute inset-0 h-full w-full ${className}`}
      aria-hidden
    >
      {bars.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={Math.round((50 - (b.h * 100) / 2) * 1000) / 1000}
          width={b.w}
          height={Math.round(b.h * 100 * 1000) / 1000}
          rx={Math.round((b.w / 2) * 1000) / 1000}
          fill="url(#ss-gold)"
          className={animate ? "ss-bar" : ""}
          style={
            animate
              ? ({
                  "--bar-dur": `${b.dur.toFixed(2)}s`,
                  "--bar-delay": `${b.delay.toFixed(2)}s`,
                  "--bar-peak": (1.15 + (i % 3) * 0.12).toFixed(2),
                } as React.CSSProperties)
              : undefined
          }
        />
      ))}
    </svg>
  );
}

function GoldDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <defs>
        <linearGradient id="ss-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="oklch(0.9 0.11 88)" />
          <stop offset="0.5" stopColor="oklch(0.8 0.13 82)" />
          <stop offset="1" stopColor="oklch(0.62 0.12 75)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ------------------------------------------------------------- variants -- */

function Audio({ animate }: { animate: boolean }) {
  return (
    <div className="absolute inset-0 dotgrid">
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-accent/25" />
      <div className="absolute inset-[12%_8%]">
        <Bars count={36} seed={7} animate={animate} />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,transparent_40%,var(--background)_100%)]" />
    </div>
  );
}

function Security({ animate }: { animate: boolean }) {
  return (
    <div className="absolute inset-0 dotgrid">
      <div className="absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2">
        <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
          {[28, 48, 68, 88].map((r) => (
            <circle
              key={r}
              cx="100"
              cy="100"
              r={r}
              fill="none"
              stroke="oklch(0.8 0.13 82)"
              strokeOpacity={0.55 - r / 220}
              strokeWidth="0.5"
            />
          ))}
          <line x1="100" y1="10" x2="100" y2="190" stroke="oklch(1 0 0 / 0.08)" strokeWidth="0.4" />
          <line x1="10" y1="100" x2="190" y2="100" stroke="oklch(1 0 0 / 0.08)" strokeWidth="0.4" />
          <circle cx="100" cy="100" r="3" fill="url(#ss-gold)" />
          <circle cx="132" cy="74" r="1.8" fill="oklch(0.8 0.13 82)" />
          <circle cx="66" cy="120" r="1.4" fill="oklch(0.8 0.13 82)" fillOpacity="0.7" />
        </svg>
        <div
          className={`absolute inset-0 rounded-full ${animate ? "ss-sweep" : ""}`}
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, oklch(0.8 0.13 82 / 0.28) 70deg, transparent 72deg)",
            maskImage: "radial-gradient(circle, black 44%, transparent 45%)",
            WebkitMaskImage: "radial-gradient(circle, black 44%, transparent 45%)",
          }}
        />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(55%_55%_at_50%_50%,transparent_30%,var(--background)_100%)]" />
    </div>
  );
}

function Lighting({ animate }: { animate: boolean }) {
  return (
    <div className="absolute inset-0 dotgrid">
      <svg
        viewBox="0 0 160 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="ss-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="oklch(0.88 0.12 88)" stopOpacity="0.55" />
            <stop offset="1" stopColor="oklch(0.8 0.13 82)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[
          { x: 30, w: 26 },
          { x: 80, w: 34 },
          { x: 130, w: 26 },
        ].map((b, i) => (
          <g
            key={i}
            className={animate ? "ss-pulse" : ""}
            style={{ animationDelay: `${i * 0.9}s` }}
          >
            <polygon
              points={`${b.x - 2},0 ${b.x + 2},0 ${b.x + b.w},100 ${b.x - b.w},100`}
              fill="url(#ss-beam)"
            />
            <rect x={b.x - 3} y="0" width="6" height="2.5" rx="1" fill="url(#ss-gold)" />
          </g>
        ))}
        <rect x="0" y="86" width="160" height="14" fill="oklch(0 0 0 / 0.35)" />
        <line
          x1="0"
          y1="86"
          x2="160"
          y2="86"
          stroke="oklch(0.8 0.13 82 / 0.35)"
          strokeWidth="0.4"
        />
      </svg>
    </div>
  );
}

function Theater({ animate }: { animate: boolean }) {
  return (
    <div className="absolute inset-0 dotgrid">
      {/* Screen + light spill */}
      <div
        className={`absolute left-1/2 top-[38%] aspect-[2.39/1] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-[3px] ${
          animate ? "ss-pulse" : ""
        }`}
        style={{
          background:
            "linear-gradient(135deg, oklch(0.9 0.11 88 / 0.9), oklch(0.8 0.13 82 / 0.75) 45%, oklch(0.62 0.12 75 / 0.85))",
          boxShadow: "0 0 80px 10px oklch(0.8 0.13 82 / 0.28), 0 0 0 1px oklch(1 0 0 / 0.12)",
        }}
      />
      {/* Speakers around the seating position */}
      {[
        "left-[14%] top-[30%]",
        "right-[14%] top-[30%]",
        "left-[10%] bottom-[16%]",
        "right-[10%] bottom-[16%]",
        "left-1/2 top-[64%] -translate-x-1/2",
      ].map((pos) => (
        <span key={pos} className={`absolute h-1.5 w-1.5 rounded-full bg-accent/80 ${pos}`} />
      ))}
      {/* Floor line */}
      <div className="absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-t from-black/45 to-transparent" />
    </div>
  );
}

function HeroField({ animate }: { animate: boolean }) {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 dotgrid opacity-70" />
      {/* Big waveform across the band, darker at the edges. */}
      <div className="absolute inset-y-[18%] inset-x-0 opacity-[0.55]">
        <Bars count={120} seed={42} animate={animate} minH={0.03} maxH={0.7} />
      </div>
      {/* Gold glow low-left, where the copy sits. */}
      <div className="absolute -bottom-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,oklch(0.8_0.13_82_/_0.18),transparent_60%)]" />
      <div className="absolute inset-x-0 top-1/2 h-px bg-accent/20" />
    </div>
  );
}

/* ---------------------------------------------------------------- export -- */

/**
 * Renders inside a positioned parent (the caller sets size / aspect-ratio).
 * `animate` defaults on; pass false for lists of many tiles.
 */
export function Motif({
  kind,
  animate = true,
  className = "",
}: {
  kind: MotifKind;
  animate?: boolean;
  className?: string;
}) {
  return (
    <div className={`absolute inset-0 overflow-hidden bg-surface ${className}`} aria-hidden>
      <GoldDefs />
      {kind === "audio" && <Audio animate={animate} />}
      {kind === "security" && <Security animate={animate} />}
      {kind === "lighting" && <Lighting animate={animate} />}
      {kind === "theater" && <Theater animate={animate} />}
      {kind === "hero" && <HeroField animate={animate} />}
    </div>
  );
}

/**
 * An image slot: the owner's photo when set, the motif otherwise. Reserves
 * its box via aspect-ratio so nothing moves when the photo arrives.
 */
export function SlotImage({
  src,
  alt,
  motif,
  ratio = "16/10",
  className = "",
  priority = false,
  animate = true,
}: {
  src: string;
  alt: string;
  motif: MotifKind;
  ratio?: string;
  className?: string;
  priority?: boolean;
  animate?: boolean;
}) {
  return (
    <div className={`framed ${className}`} style={{ aspectRatio: ratio }}>
      {src ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <Motif kind={motif} animate={animate} />
      )}
      <div className="framed-rule" />
    </div>
  );
}
