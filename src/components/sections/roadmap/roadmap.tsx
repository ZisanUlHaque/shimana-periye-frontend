"use client";

/**
 * <Roadmap /> — a scroll-driven flight path.
 *
 * - The path is built from the real position of each milestone marker, so it
 *   adapts to any content height and re-flows on resize (desktop: alternating
 *   S-curve; mobile: a gently weaving line down the left edge).
 * - Scroll progress → plane position is a pure lookup into a pre-sampled path
 *   (no layout reads while scrolling). The plane, the revealed trail and the
 *   active milestone are all driven by the same progress value, so they can
 *   never drift apart.
 * - Plane/trail updates write straight to motion values and SVG attributes;
 *   React only re-renders when the active milestone changes.
 * - Honors `prefers-reduced-motion`: no spring smoothing, no entrance
 *   animations, no idle float. The plane still follows the scroll position.
 */

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  type Variants,
} from "motion/react";
import { MapPin } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { RoadmapMilestone, RoadmapProps } from "./types";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/* -------------------------------------------------------------------------- */
/*                                   Geometry                                  */
/* -------------------------------------------------------------------------- */

type Pt = { x: number; y: number };

type Geo = {
  n: number;
  len: number;
  xs: Float32Array;
  ys: Float32Array;
  ls: Float32Array;
  angle: Float32Array;
  bank: Float32Array;
  nodeYs: number[];
};

type Layout = { w: number; h: number; d: string };

const SAMPLES = 480;
const LEAD_IN = 72;
const MAX_TAIL = 140;

/** Smooth path through waypoints; every waypoint has a vertical tangent. */
function buildPath(points: Pt[]) {
  let d = `M${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const k = (b.y - a.y) * 0.5;
    d += ` C${a.x.toFixed(1)} ${(a.y + k).toFixed(1)} ${b.x.toFixed(1)} ${(b.y - k).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  }
  return d;
}

function sampleGeo(path: SVGPathElement, nodes: Pt[]): Geo {
  const len = path.getTotalLength();
  const n = SAMPLES;
  const xs = new Float32Array(n + 1);
  const ys = new Float32Array(n + 1);
  const ls = new Float32Array(n + 1);
  const angle = new Float32Array(n + 1);
  const bank = new Float32Array(n + 1);

  for (let i = 0; i <= n; i++) {
    const l = (len * i) / n;
    const p = path.getPointAtLength(l);
    xs[i] = p.x;
    ys[i] = p.y;
    ls[i] = l;
  }

  // 0° = nose up, clockwise positive. The path only ever travels downward, so
  // this stays within 90°–270° and never wraps.
  let prev = 180;
  for (let i = 0; i <= n; i++) {
    const a = Math.max(0, i - 4);
    const b = Math.min(n, i + 4);
    const dx = xs[b] - xs[a];
    const dy = ys[b] - ys[a];
    if (Math.abs(dx) + Math.abs(dy) > 0.001) {
      prev = 180 - (Math.atan2(dx, dy) * 180) / Math.PI;
    }
    angle[i] = prev;
  }
  for (let i = 0; i <= n; i++) {
    const turn = angle[Math.min(n, i + 10)] - angle[Math.max(0, i - 10)];
    bank[i] = Math.max(-28, Math.min(28, turn * 1.1));
  }

  return { n, len, xs, ys, ls, angle, bank, nodeYs: nodes.map((p) => p.y) };
}

/* -------------------------------------------------------------------------- */
/*                                   Airplane                                  */
/* -------------------------------------------------------------------------- */

/** Top-down airliner, nose up. `shadow` renders the same silhouette in black. */
function Airplane({ shadow = false, className }: { shadow?: boolean; className?: string }) {
  const f = (c: string) => (shadow ? "#000" : c);
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden>
      {!shadow && (
        <defs>
          <linearGradient id="rm-plane-body" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#cbd5e1" />
            <stop offset="0.35" stopColor="#ffffff" />
            <stop offset="0.65" stopColor="#f1f5f9" />
            <stop offset="1" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="rm-plane-wing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f8fafc" />
            <stop offset="1" stopColor="#b6c2d3" />
          </linearGradient>
        </defs>
      )}

      {/* Tailplane */}
      <path d="M46 79 L29 90 L29 94 L46 88.5 Z" fill={f("#dbe3ee")} />
      <path d="M54 79 L71 90 L71 94 L54 88.5 Z" fill={f("#dbe3ee")} />

      {/* Main wings */}
      <path d="M46 36 L5 61 L5 67.5 L46 57.5 Z" fill={shadow ? "#000" : "url(#rm-plane-wing)"} stroke={shadow ? undefined : "#94a3b8"} strokeWidth={0.7} strokeOpacity={0.9} />
      <path d="M54 36 L95 61 L95 67.5 L54 57.5 Z" fill={shadow ? "#000" : "url(#rm-plane-wing)"} stroke={shadow ? undefined : "#94a3b8"} strokeWidth={0.7} strokeOpacity={0.9} />
      {!shadow && (
        <>
          <path d="M46 38 L8 61" stroke="#ffffff" strokeOpacity={0.9} strokeWidth={0.8} />
          <path d="M54 38 L92 61" stroke="#ffffff" strokeOpacity={0.9} strokeWidth={0.8} />
        </>
      )}

      {/* Engines */}
      <ellipse cx={26} cy={50} rx={3.6} ry={8} fill={f("#cbd5e1")} stroke={f("#94a3b8")} strokeWidth={0.6} />
      <ellipse cx={74} cy={50} rx={3.6} ry={8} fill={f("#cbd5e1")} stroke={f("#94a3b8")} strokeWidth={0.6} />
      {!shadow && (
        <>
          <ellipse cx={26} cy={43} rx={2.7} ry={1.2} fill="#475569" />
          <ellipse cx={74} cy={43} rx={2.7} ry={1.2} fill="#475569" />
        </>
      )}

      {/* Fuselage */}
      <path
        d="M50 3 C54.2 3 56.2 11 56.2 22 L56.2 70 C56.2 80 54.2 90 50 97 C45.8 90 43.8 80 43.8 70 L43.8 22 C43.8 11 45.8 3 50 3 Z"
        fill={shadow ? "#000" : "url(#rm-plane-body)"}
        stroke={shadow ? undefined : "#94a3b8"}
        strokeWidth={0.7}
        strokeOpacity={0.9}
      />
      {!shadow && (
        <>
          {/* Cockpit */}
          <path d="M47.4 11.5 Q50 9.4 52.6 11.5 L52 15 Q50 13.8 48 15 Z" fill="#0f172a" />
          {/* Cabin windows */}
          <path d="M46.7 22 V68" stroke="#64748b" strokeOpacity={0.45} strokeWidth={1.3} strokeDasharray="1.3 2.1" />
          <path d="M53.3 22 V68" stroke="#64748b" strokeOpacity={0.45} strokeWidth={1.3} strokeDasharray="1.3 2.1" />
          {/* Livery stripe + fin */}
          <path d="M48.6 80 L51.4 80 L52.2 92 L47.8 92 Z" fill="#10b981" />
        </>
      )}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Motion                                    */
/* -------------------------------------------------------------------------- */

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 48, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: EASE,
      when: "beforeChildren",
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE },
  },
};

const VIEWPORT = { once: true, margin: "0px 0px -22% 0px" } as const;

// "start 0.62" = container top at 62% of the viewport. Cast because the typed
// edge union does not include numeric offsets, though they are supported.
const SCROLL_OFFSET = ["start 0.62", "end 0.5"] as unknown as ["start end", "end start"];

/* -------------------------------------------------------------------------- */
/*                                  Component                                  */
/* -------------------------------------------------------------------------- */

export function Roadmap({
  milestones,
  eyebrow = "Your roadmap",
  title = "From first idea to touchdown",
  description = "Seven clear steps take you from exploring options to landing at your dream university.",
  footer,
  onActiveChange,
  ariaLabel = "Roadmap",
  className,
}: RoadmapProps) {
  const reduce = useReducedMotion();
  const headingId = useId();
  const gradientId = useId();

  const containerRef = useRef<HTMLDivElement>(null);
  const anchorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const trackRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const revealRef = useRef<SVGPathElement>(null);
  const geoRef = useRef<Geo | null>(null);
  const nodesRef = useRef<Pt[]>([]);

  const [layout, setLayout] = useState<Layout | null>(null);
  const [active, setActive] = useState(-1);

  const planeX = useMotionValue(0);
  const planeY = useMotionValue(0);
  const planeRotate = useMotionValue(180);
  const planeBank = useMotionValue(0);

  /* ----------------------------- scroll progress ---------------------------- */

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: SCROLL_OFFSET,
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.5,
    restDelta: 0.0005,
  });
  const progress = reduce ? scrollYProgress : smooth;

  /** Pure lookup into the pre-sampled path: no DOM reads, no React renders. */
  const apply = useCallback(
    (p: number) => {
      const g = geoRef.current;
      if (!g) return;

      const t = Math.min(1, Math.max(0, p));
      const targetY = g.ys[0] + t * (g.ys[g.n] - g.ys[0]);

      let lo = 0;
      let hi = g.n;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (g.ys[mid] <= targetY) lo = mid;
        else hi = mid;
      }
      const span = g.ys[hi] - g.ys[lo];
      const f = span > 0 ? (targetY - g.ys[lo]) / span : 0;
      const at = (a: Float32Array) => a[lo] + (a[hi] - a[lo]) * f;

      planeX.set(at(g.xs));
      planeY.set(targetY);
      planeRotate.set(at(g.angle));
      planeBank.set(at(g.bank));

      const offset = String(g.len - at(g.ls));
      if (revealRef.current) revealRef.current.style.strokeDashoffset = offset;
      if (glowRef.current) glowRef.current.style.strokeDashoffset = offset;

      let idx = -1;
      for (let i = 0; i < g.nodeYs.length; i++) {
        if (targetY >= g.nodeYs[i] - 6) idx = i;
        else break;
      }
      setActive((prev) => (prev === idx ? prev : idx));
    },
    [planeX, planeY, planeRotate, planeBank],
  );

  useMotionValueEvent(progress, "change", apply);

  /* ------------------------------- measuring -------------------------------- */

  const measure = useCallback(() => {
    const c = containerRef.current;
    if (!c) return;
    const cr = c.getBoundingClientRect();
    if (cr.width === 0 || cr.height === 0) return;

    const nodes: Pt[] = [];
    for (const el of anchorRefs.current) {
      if (!el) continue;
      const r = el.getBoundingClientRect();
      nodes.push({ x: r.left + r.width / 2 - cr.left, y: r.top + r.height / 2 - cr.top });
    }
    if (nodes.length === 0) return;

    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const pts: Pt[] = [{ x: nodes[0].x, y: Math.max(0, nodes[0].y - LEAD_IN) }];
    nodes.forEach((node, i) => {
      if (!desktop && i > 0) {
        // Mobile: nodes share one x, so weave the line between them.
        const prev = nodes[i - 1];
        pts.push({
          x: prev.x + (i % 2 === 0 ? -1 : 1) * 12,
          y: (prev.y + node.y) / 2,
        });
      }
      pts.push(node);
    });
    const last = nodes[nodes.length - 1];
    pts.push({ x: last.x, y: Math.min(cr.height - 4, last.y + MAX_TAIL) });

    const d = buildPath(pts);
    nodesRef.current = nodes;
    setLayout((prev) =>
      prev && prev.d === d && prev.w === cr.width && prev.h === cr.height
        ? prev
        : { w: cr.width, h: cr.height, d },
    );
  }, []);

  useEffect(() => {
    measure();
    const c = containerRef.current;
    if (!c) return;

    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    const ro = new ResizeObserver(schedule);
    ro.observe(c);
    window.addEventListener("resize", schedule);
    document.fonts?.ready.then(schedule).catch(() => {});

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, [measure, milestones.length]);

  // Re-sample the path whenever its shape changes, then re-apply progress.
  useEffect(() => {
    if (!layout || !trackRef.current) return;
    const g = sampleGeo(trackRef.current, nodesRef.current);
    geoRef.current = g;
    for (const el of [revealRef.current, glowRef.current]) {
      if (!el) continue;
      el.style.strokeDasharray = String(g.len);
      el.style.strokeDashoffset = String(g.len);
    }
    apply(progress.get());
  }, [layout, apply, progress]);

  useEffect(() => {
    onActiveChange?.(active, milestones[active]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  /* --------------------------------- render --------------------------------- */

  return (
    <section
      aria-labelledby={title ? headingId : undefined}
      aria-label={title ? undefined : ariaLabel}
      className={cx(
        "relative isolate overflow-hidden px-5 py-24 text-foreground sm:px-8 md:py-32",
        className,
      )}
    >
      {/* Ambient light */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl dark:bg-emerald-500/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/2 -z-10 size-[520px] rounded-full bg-sky-400/10 blur-3xl dark:bg-sky-500/10"
      />

      {title !== null && (
        <header className="mx-auto max-w-2xl text-center">
          {eyebrow && (
            <motion.span
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700 backdrop-blur-xl dark:border-white/15 dark:bg-white/[0.06] dark:text-emerald-200"
            >
              <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_2px_rgba(16,185,129,0.45)] dark:bg-emerald-300 dark:shadow-[0_0_8px_2px_rgba(110,231,183,0.6)]" />
              {eyebrow}
            </motion.span>
          )}
          <motion.h2
            id={headingId}
            initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
            className="mt-6 text-4xl font-light leading-[1.05] tracking-[-0.04em] sm:text-5xl md:text-6xl"
          >
            <span className="bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
              {title}
            </span>
          </motion.h2>
          {description && (
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.12 }}
              className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              {description}
            </motion.p>
          )}
        </header>
      )}

      <div ref={containerRef} className="relative mx-auto mt-16 max-w-5xl md:mt-24">
        {/* Path + trail */}
        {layout && (
          <svg
            aria-hidden
            width={layout.w}
            height={layout.h}
            viewBox={`0 0 ${layout.w} ${layout.h}`}
            className="pointer-events-none absolute inset-0 overflow-visible [--rm-a:#10b981] [--rm-b:#0ea5e9] [--rm-c:#059669] dark:[--rm-a:#6ee7b7] dark:[--rm-b:#7dd3fc] dark:[--rm-c:#34d399]"
          >
            <defs>
              <linearGradient
                id={gradientId}
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="0"
                x2="0"
                y2={layout.h}
              >
                <stop offset="0" style={{ stopColor: "var(--rm-a)" }} />
                <stop offset="0.5" style={{ stopColor: "var(--rm-b)" }} />
                <stop offset="1" style={{ stopColor: "var(--rm-c)" }} />
              </linearGradient>
            </defs>
            {/* Dotted guide for the whole route */}
            <path
              ref={trackRef}
              d={layout.d}
              fill="none"
              stroke="currentColor"
              className="text-foreground/25"
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray="2 10"
            />
            {/* Soft glow of the completed section */}
            <path
              ref={glowRef}
              d={layout.d}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth={12}
              strokeLinecap="round"
              opacity={0.18}
              style={{ strokeDasharray: 1e6, strokeDashoffset: 1e6 }}
            />
            {/* Completed section */}
            <path
              ref={revealRef}
              d={layout.d}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth={2.5}
              strokeLinecap="round"
              style={{ strokeDasharray: 1e6, strokeDashoffset: 1e6 }}
            />
          </svg>
        )}

        {/* Milestones */}
        <ol aria-label={ariaLabel} className="relative z-10 list-none">
          {milestones.map((m, i) => (
            <MilestoneRow
              key={m.id}
              milestone={m}
              index={i}
              reached={i <= active}
              current={i === active}
              reduce={!!reduce}
              anchorRef={(el) => {
                anchorRefs.current[i] = el;
              }}
            />
          ))}
        </ol>

        {/* Plane */}
        {layout && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-20 will-change-transform"
            style={{ x: planeX, y: planeY, rotate: planeRotate }}
          >
            <div className="relative size-14 -translate-x-1/2 -translate-y-1/2 md:size-[76px]">
              {/* Vapour trail */}
              <div className="absolute left-1/2 top-[78%] h-20 w-[3px] -translate-x-1/2 bg-gradient-to-b from-emerald-400/60 to-transparent blur-[1.5px] dark:from-white/55" />
              {/* Ground shadow */}
              <Airplane
                shadow
                className="absolute inset-0 size-full translate-x-3 translate-y-5 opacity-40 blur-[3px] dark:opacity-30"
              />
              <motion.div
                style={{ rotateY: planeBank, transformPerspective: 420 }}
                animate={reduce ? undefined : { y: [0, -3, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="size-full"
              >
                <Airplane className="size-full drop-shadow-[0_6px_14px_rgba(15,23,42,0.4)]" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {footer && <div className="relative z-10 mx-auto mt-12 flex max-w-5xl justify-center">{footer}</div>}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Milestone row                               */
/* -------------------------------------------------------------------------- */

function MilestoneRow({
  milestone: m,
  index: i,
  reached,
  current,
  reduce,
  anchorRef,
}: {
  milestone: RoadmapMilestone;
  index: number;
  reached: boolean;
  current: boolean;
  reduce: boolean;
  anchorRef: (el: HTMLDivElement | null) => void;
}) {
  const leftNode = i % 2 === 0;
  const hidden = reduce ? false : "hidden";

  return (
    <li className="relative min-h-[150px] pb-12 md:h-[340px] md:min-h-0 md:pb-0">
      {/* Anchor: un-animated, so the path can measure it. Marker animates inside. */}
      <div
        ref={anchorRef}
        className={cx(
          "absolute left-[22px] top-7 size-0 md:top-1/2",
          leftNode ? "md:left-[15%]" : "md:left-[85%]",
        )}
      >
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VIEWPORT}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2"
        >
          <Marker icon={m.icon} step={i + 1} reached={reached} current={current && !reduce} />
        </motion.div>
      </div>

      {/* Card */}
      <div
        className={cx(
          "relative ml-[58px] md:absolute md:top-1/2 md:ml-0 md:w-[min(420px,44%)] md:-translate-y-1/2",
          leftNode ? "md:left-[36%]" : "md:right-[36%]",
        )}
      >
        <motion.article
          variants={cardVariants}
          initial={hidden}
          whileInView="visible"
          viewport={VIEWPORT}
          className="group"
        >
          <div
            data-reached={reached}
            className={cx(
              "relative overflow-hidden rounded-3xl border p-5 backdrop-blur-xl sm:p-6",
              "transition-[transform,border-color,background-color,box-shadow] duration-500 hover:-translate-y-1",
              reached
                ? "border-emerald-500/30 bg-card shadow-[0_30px_70px_-30px_rgba(16,185,129,0.4)] dark:border-emerald-300/30 dark:bg-white/[0.08] dark:shadow-[0_30px_70px_-30px_rgba(16,185,129,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]"
                : "border-border bg-card/80 shadow-[0_24px_60px_-34px_rgba(15,23,42,0.25)] dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_24px_60px_-34px_rgba(2,6,23,0.9),inset_0_1px_0_rgba(255,255,255,0.12)]",
            )}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent dark:via-white/50"
            />
            <div
              aria-hidden
              className={cx(
                "pointer-events-none absolute -right-16 -top-16 size-44 rounded-full blur-3xl transition-opacity duration-700",
                "bg-emerald-400/25",
                reached ? "opacity-100" : "opacity-0",
              )}
            />

            <motion.div variants={itemVariants} className="relative flex items-center justify-between gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-200/90">
                Step {String(i + 1).padStart(2, "0")}
              </span>
              {m.date && (
                <span className="rounded-full border border-border bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground dark:border-white/15 dark:bg-white/[0.06] dark:text-white/75">
                  {m.date}
                </span>
              )}
            </motion.div>

            <motion.h3
              variants={itemVariants}
              className="relative mt-3 text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-[22px]"
            >
              {m.title}
            </motion.h3>

            <motion.p variants={itemVariants} className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
              {m.description}
            </motion.p>

            {m.tags && m.tags.length > 0 && (
              <motion.ul variants={itemVariants} className="relative mt-4 flex flex-wrap gap-2">
                {m.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-border bg-muted/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground dark:border-white/10 dark:bg-white/[0.05] dark:text-white/70"
                  >
                    {t}
                  </li>
                ))}
              </motion.ul>
            )}
          </div>
        </motion.article>
      </div>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Marker                                   */
/* -------------------------------------------------------------------------- */

function Marker({
  icon,
  step,
  reached,
  current,
}: {
  icon: RoadmapMilestone["icon"];
  step: number;
  reached: boolean;
  current: boolean;
}) {
  return (
    <div className="relative">
      {current && (
        <span
          aria-hidden
          className="absolute inset-0 animate-ping rounded-full bg-emerald-300/30 [animation-duration:2.4s]"
        />
      )}
      <div
        className={cx(
          "relative flex size-11 items-center justify-center rounded-full border backdrop-blur-xl md:size-14",
          "transition-[background-color,border-color,box-shadow,color] duration-500",
          "[&_svg]:size-[18px] md:[&_svg]:size-5",
          reached
            ? "border-emerald-200/70 bg-gradient-to-br from-emerald-300 to-emerald-600 text-white shadow-[0_0_0_5px_rgba(16,185,129,0.18),0_10px_30px_-6px_rgba(16,185,129,0.7),inset_0_1px_0_rgba(255,255,255,0.5)]"
            : "border-border bg-card text-muted-foreground shadow-[0_10px_30px_-10px_rgba(15,23,42,0.3)] dark:border-white/20 dark:bg-slate-900/70 dark:text-white/60 dark:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.15)]",
        )}
      >
        {icon ?? <MapPin />}
      </div>
      <span
        className={cx(
          "absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full border text-[10px] font-bold tabular-nums transition-colors duration-500",
          reached
            ? "border-emerald-600/30 bg-white text-emerald-700 shadow-sm dark:border-white/70"
            : "border-border bg-background text-muted-foreground dark:border-white/20 dark:bg-slate-800 dark:text-white/60",
        )}
      >
        {step}
      </span>
    </div>
  );
}