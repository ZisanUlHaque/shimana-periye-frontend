"use client";

/**
 * "Old way vs PUB GradPath way" — an interactive before/after.
 *
 * - Six topics as tabs (vertical on desktop, a scrolling chip row on mobile).
 *   They auto-advance with a progress bar that pauses on hover, while you drag,
 *   and when the section is off-screen. Click any tab to jump.
 * - Each topic is a draggable before/after slider: the left side is the messy
 *   old way, the right side is a calm dashboard. Drag, click, tap, or use the
 *   arrow keys; the two statements below fade as the slider moves.
 * - Respects prefers-reduced-motion (no auto-advance, no floating, no hint).
 */

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { comparisonItems, type ComparisonItem } from "./comparison-data";
import { CleanVisual, MessyVisual } from "./comparison-visuals";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const AUTOPLAY_SECONDS = 8;
const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export default function ComparisonSection({
  items = comparisonItems,
  onCtaClick,
}: {
  items?: ComparisonItem[];
  onCtaClick?: () => void;
}) {
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [ariaPos, setAriaPos] = useState(50);

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hintRef = useRef<{ stop: () => void } | null>(null);

  const inView = useInView(sectionRef, { margin: "-15% 0px -15% 0px" });
  const item = items[active];

  /* ------------------------------ slider state ------------------------------ */

  const pos = useMotionValue(50); // 0 = all new, 100 = all old
  const springPos = useSpring(pos, { stiffness: 300, damping: 34, mass: 0.6 });
  const smooth = reduce ? pos : springPos;

  const clip = useTransform(smooth, (v) => `inset(0 0 0 ${v}%)`);
  const handleLeft = useTransform(smooth, (v) => `${v}%`);
  const oldLabelOpacity = useTransform(smooth, [0, 14], [0, 1]);
  const newLabelOpacity = useTransform(smooth, [86, 100], [1, 0]);
  const oldEmphasis = useTransform(smooth, [0, 100], [0.45, 1]);
  const newEmphasis = useTransform(smooth, [0, 100], [1, 0.45]);

  useMotionValueEvent(pos, "change", (v) => {
    const r = Math.round(v / 5) * 5;
    setAriaPos((prev) => (prev === r ? prev : r));
  });

  const stopHint = () => {
    hintRef.current?.stop();
    hintRef.current = null;
  };

  const moveTo = (target: number) => {
    stopHint();
    if (reduce) pos.set(target);
    else hintRef.current = animate(pos, target, { duration: 0.7, ease: EASE });
  };

  const setFromClientX = (clientX: number) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    pos.set(clamp(((clientX - r.left) / r.width) * 100, 0, 100));
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    stopHint();
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging) setFromClientX(e.clientX);
  };
  const endDrag = () => setDragging(false);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 20 : 5;
    if (e.key === "ArrowLeft") pos.set(clamp(pos.get() - step, 0, 100));
    else if (e.key === "ArrowRight") pos.set(clamp(pos.get() + step, 0, 100));
    else if (e.key === "Home") pos.set(0);
    else if (e.key === "End") pos.set(100);
    else return;
    stopHint();
    e.preventDefault();
  };

  /* A small "peek" whenever a topic appears, so people notice it is draggable. */
  useEffect(() => {
    if (reduce || !inView) return;
    stopHint();
    pos.set(50);
    hintRef.current = animate(pos, [50, 28, 72, 50], {
      duration: 2.2,
      ease: "easeInOut",
      delay: 0.5,
    });
    return stopHint;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, inView, reduce]);

  /* ---------------------------------- tabs ---------------------------------- */

  const next = useCallback(() => setActive((i) => (i + 1) % items.length), [items.length]);

  // Keep the active chip visible on the mobile scroller (never scrolls the page).
  useEffect(() => {
    const wrap = tabsRef.current;
    const btn = tabRefs.current[active];
    if (!wrap || !btn || wrap.scrollWidth <= wrap.clientWidth + 2) return;
    wrap.scrollTo({
      left: btn.offsetLeft - wrap.clientWidth / 2 + btn.clientWidth / 2,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [active, reduce]);

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = items.length - 1;
    let to = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") to = i === last ? 0 : i + 1;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") to = i === 0 ? last : i - 1;
    if (to < 0) return;
    e.preventDefault();
    setActive(to);
    tabRefs.current[to]?.focus();
  };

  const running = inView && !hovering && !dragging;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-white via-emerald-50/40 to-white py-16 sm:py-24"
    >
      {/* Soft background texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.06)_1px,transparent_0)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-10 h-72 w-[46rem] -translate-x-1/2 rounded-full bg-emerald-300/20 blur-3xl"
      />

      {/* Header */}
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.span
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold tracking-wide text-white shadow-lg shadow-slate-900/20"
        >
          <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.7)]" />
          WHY CHOOSE US
        </motion.span>
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
          className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl"
        >
          The old way vs.
          <span className="bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
            {" "}
            the PUB GradPath way.
          </span>
        </motion.h2>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.12 }}
          className="mx-auto mt-4 max-w-xl text-slate-600"
        >
          Studying abroad is complicated enough. Drag the slider and see exactly
          how much easier it gets.
        </motion.p>
      </div>

      {/* Interactive stage */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.9, ease: EASE }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className="relative mx-auto mt-12 grid max-w-6xl gap-5 px-5 sm:px-8 lg:grid-cols-[300px_1fr] lg:gap-8"
      >
        {/* Tabs */}
        <div
          ref={tabsRef}
          role="tablist"
          aria-label="Comparison topics"
          aria-orientation="vertical"
          className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          {items.map((it, i) => {
            const selected = i === active;
            return (
              <button
                key={it.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`cmp-tab-${it.id}`}
                aria-selected={selected}
                aria-controls="cmp-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={cx(
                  "group relative flex shrink-0 items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3 text-left transition-all duration-300 lg:w-full",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
                  selected
                    ? "border-emerald-200 bg-white shadow-[0_18px_40px_-20px_rgba(16,185,129,0.55)]"
                    : "border-transparent bg-white/50 hover:border-slate-200 hover:bg-white",
                )}
              >
                <span
                  className={cx(
                    "flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 [&_svg]:size-5",
                    selected
                      ? "bg-gradient-to-br from-emerald-400 to-sky-500 text-white shadow-md shadow-emerald-200"
                      : "bg-slate-100 text-slate-500 group-hover:bg-slate-200",
                  )}
                >
                  {it.icon}
                </span>
                <span className="min-w-0">
                  <span
                    className={cx(
                      "block whitespace-nowrap text-sm font-semibold lg:whitespace-normal",
                      selected ? "text-slate-900" : "text-slate-600",
                    )}
                  >
                    {it.title}
                  </span>
                  <span className="mt-0.5 hidden items-center gap-1 text-xs text-slate-400 lg:flex">
                    <span className="truncate">{it.metric.from}</span>
                    <ArrowRight className="size-3 shrink-0" />
                    <span className="truncate font-medium text-emerald-600">{it.metric.to}</span>
                  </span>
                </span>

                {/* Auto-advance progress; the animation's end moves to the next tab */}
                {selected && (
                  <span aria-hidden className="cmp-progress-track absolute inset-x-0 bottom-0 h-[3px] bg-slate-100">
                    <span
                      key={`${active}-${items.length}`}
                      onAnimationEnd={next}
                      className="cmp-progress block h-full origin-left bg-gradient-to-r from-emerald-500 to-sky-500"
                      style={{
                        animation: `cmp-progress ${AUTOPLAY_SECONDS}s linear forwards`,
                        animationPlayState: running ? "running" : "paused",
                      }}
                    />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Stage */}
        <div
          id="cmp-panel"
          role="tabpanel"
          aria-labelledby={`cmp-tab-${item.id}`}
          className="min-w-0 rounded-[2rem] border border-slate-200/80 bg-white/80 p-4 shadow-[0_40px_90px_-45px_rgba(15,23,42,0.4)] backdrop-blur sm:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <motion.h3
              key={item.id}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
            >
              {item.title}
            </motion.h3>
            <motion.div
              key={`${item.id}-metric`}
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold shadow-sm"
            >
              <span className="text-slate-400 line-through decoration-red-300">{item.metric.from}</span>
              <ArrowRight className="size-3.5 text-slate-400" />
              <span className="bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
                {item.metric.to}
              </span>
            </motion.div>
          </div>

          {/* Before / after slider */}
          <div
            ref={stageRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            style={{ touchAction: "pan-y" }}
            className={cx(
              "relative mt-5 h-[340px] select-none overflow-hidden rounded-3xl border border-slate-200 sm:h-[390px]",
              dragging ? "cursor-grabbing" : "cursor-ew-resize",
            )}
          >
            {/* Old way (base layer) */}
            <motion.div
              key={`old-${item.id}`}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <MessyVisual items={item.messy} reduce={reduce} />
            </motion.div>

            {/* New way (clipped by the handle) */}
            <motion.div style={{ clipPath: clip }} className="absolute inset-0">
              <motion.div
                key={`new-${item.id}`}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <CleanVisual rows={item.clean} reduce={reduce} />
              </motion.div>
            </motion.div>

            {/* Corner labels */}
            <motion.span
              style={{ opacity: oldLabelOpacity }}
              className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-red-500 shadow-sm backdrop-blur"
            >
              <XCircle className="size-3.5" />
              Old way
            </motion.span>
            <motion.span
              style={{ opacity: newLabelOpacity }}
              className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600 shadow-sm backdrop-blur"
            >
              <CheckCircle2 className="size-3.5" />
              PUB GradPath
            </motion.span>

            {/* Handle */}
            <motion.div style={{ left: handleLeft }} className="absolute inset-y-0 z-10 w-0">
              <div className="absolute inset-y-0 -left-px w-0.5 bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.08),0_0_18px_rgba(16,185,129,0.6)]" />
              <div
                role="slider"
                tabIndex={0}
                aria-label="Compare the old way with the PUB GradPath way"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={100 - ariaPos}
                aria-valuetext={`${100 - ariaPos}% PUB GradPath way shown`}
                onKeyDown={onKeyDown}
                className="absolute left-0 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-[0_12px_30px_-8px_rgba(15,23,42,0.45)] outline-none transition-transform focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 active:scale-95"
              >
                <ChevronLeft className="-mr-1 size-4" />
                <ChevronRight className="-ml-1 size-4" />
              </div>
            </motion.div>

            {/* Snap buttons */}
            <div
              onPointerDown={(e) => e.stopPropagation()}
              className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1 rounded-full border border-slate-200 bg-white/90 p-1 shadow-lg backdrop-blur"
            >
              <button
                type="button"
                onClick={() => moveTo(100)}
                className="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                Old way
              </button>
              <button
                type="button"
                onClick={() => moveTo(0)}
                className="rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-shadow hover:shadow-md"
              >
                New way
              </button>
            </div>
          </div>

          {/* Statements */}
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <motion.div
              style={{ opacity: oldEmphasis }}
              className="flex items-start gap-3 rounded-2xl bg-red-50/80 p-4"
            >
              <XCircle className="mt-0.5 size-5 shrink-0 text-red-400" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-red-400">Without us</p>
                <motion.p
                  key={`w-${item.id}`}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="mt-1 text-sm leading-relaxed text-slate-600"
                >
                  {item.without}
                </motion.p>
              </div>
            </motion.div>
            <motion.div
              style={{ opacity: newEmphasis }}
              className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
            >
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-500" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                  With PUB GradPath
                </p>
                <motion.p
                  key={`u-${item.id}`}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: EASE, delay: 0.05 }}
                  className="mt-1 text-sm font-medium leading-relaxed text-emerald-900"
                >
                  {item.withUs}
                </motion.p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative mt-12 flex justify-center px-6"
      >
        <button
          type="button"
          onClick={onCtaClick}
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 px-8 py-3.5 font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-300"
        >
          <span
            aria-hidden
            className="absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-all duration-700 group-hover:left-[150%]"
          />
          <span className="relative">Start your journey the smart way</span>
          <ArrowRight className="relative size-4 transition-transform group-hover:translate-x-1" />
        </button>
      </motion.div>

      <style>{`
        @keyframes cmp-progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cmp-progress-track { display: none; }
        }
      `}</style>
    </section>
  );
}
