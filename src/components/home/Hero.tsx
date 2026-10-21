"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import type { MouseEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  GraduationCap,
  Plane,
  Sparkles,
} from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* -------------------------------------------------------------------------- */
/*                         Globe geometry (deterministic)                      */
/* -------------------------------------------------------------------------- */

const VIEW = 400;
const CX = 200;
const CY = 200;
const R = 168;
const CENTER_LAT = 15;
const CENTER_LON = 65;

const rad = (deg: number) => (deg * Math.PI) / 180;

function project(latDeg: number, lonDeg: number) {
  const lat = rad(latDeg);
  const lon = rad(lonDeg);
  const lat0 = rad(CENTER_LAT);
  const lon0 = rad(CENTER_LON);
  const cosC =
    Math.sin(lat0) * Math.sin(lat) +
    Math.cos(lat0) * Math.cos(lat) * Math.cos(lon - lon0);
  const x = Math.cos(lat) * Math.sin(lon - lon0);
  const y =
    Math.cos(lat0) * Math.sin(lat) -
    Math.sin(lat0) * Math.cos(lat) * Math.cos(lon - lon0);
  return {
    x: Number((CX + R * x).toFixed(1)),
    y: Number((CY - R * y).toFixed(1)),
    visible: cosC > 0,
    depth: cosC,
  };
}

const LAND = [
  { lat: 50, lon: -100, dLat: 22, dLon: 38 },
  { lat: 18, lon: -100, dLat: 9, dLon: 14 },
  { lat: -15, lon: -60, dLat: 26, dLon: 20 },
  { lat: 5, lon: 20, dLat: 30, dLon: 27 },
  { lat: 56, lon: 15, dLat: 12, dLon: 25 },
  { lat: 75, lon: 65, dLat: 22, dLon: 55 },
  { lat: 35, lon: 105, dLat: 10, dLon: 22 },
  { lat: 25, lon: 80, dLat: 10, dLon: 18 },
  { lat: -25, lon: 134, dLat: 9, dLon: 13 },
  { lat: -3, lon: 115, dLat: 6, dLon: 16 },
  { lat: 72, lon: -40, dLat: 10, dLon: 25 },
];

function isLand(lat: number, lon: number) {
  return LAND.some((c) => {
    const dLon = ((lon - c.lon + 540) % 360) - 180;
    const dLat = lat - c.lat;
    return (dLat / c.dLat) ** 2 + (dLon / c.dLon) ** 2 <= 1;
  });
}

const DOTS = (() => {
  const out: { x: number; y: number; o: number }[] = [];
  for (let lat = -78; lat <= 78; lat += 3) {
    const n = Math.max(1, Math.round(Math.cos(rad(lat)) * 110));
    for (let i = 0; i < n; i++) {
      const lon = -180 + (360 * i) / n;
      if (!isLand(lat, lon)) continue;
      const p = project(lat, lon);
      if (!p.visible) continue;
      out.push({ x: p.x, y: p.y, o: Number((0.25 + 0.65 * p.depth).toFixed(2)) });
    }
  }
  return out;
})();

const RAW_PINS = [
  { key: "start", label: "Your start", lat: 7, lon: 80, origin: true },
  { key: "tr", label: "Turkey", lat: 39, lon: 35, origin: false },
  { key: "dk", label: "Denmark", lat: 56, lon: 10, origin: false },
  { key: "in", label: "India", lat: 21, lon: 78, origin: false },
  { key: "au", label: "Australia", lat: -25, lon: 134, origin: false },
];

const PINS = RAW_PINS.map((p) => ({ ...p, ...project(p.lat, p.lon) }));

function arc(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = mx - CX;
  const dy = my - CY;
  const len = Math.hypot(dx, dy) || 1;
  const lift = 36;
  const qx = mx + (dx / len) * lift;
  const qy = my + (dy / len) * lift;
  return `M${a.x} ${a.y} Q${qx.toFixed(1)} ${qy.toFixed(1)} ${b.x} ${b.y}`;
}

const origin = PINS.find((p) => p.origin)!;
const ROUTES = PINS.filter((p) => !p.origin).map((p, i) => ({
  key: p.key,
  d: arc(origin, p),
  delay: 0.9 + i * 0.2,
}));

const pct = (v: number) => `${(v / VIEW) * 100}%`;

/* -------------------------------------------------------------------------- */
/*                                  Motion                                    */
/* -------------------------------------------------------------------------- */

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

/* -------------------------------------------------------------------------- */
/*                               Sub-components                               */
/* -------------------------------------------------------------------------- */

function GlobeMap() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[480px]">
      <svg
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden
      >
        <defs>
          <radialGradient id="hero-globe-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hero-route-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        <circle cx={CX} cy={CY} r={R + 14} fill="url(#hero-globe-glow)" />

        {DOTS.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={1.5} fill="#ffffff" opacity={d.o} />
        ))}

        {ROUTES.map((r) => (
          <motion.path
            key={r.key}
            d={r.d}
            fill="none"
            stroke="url(#hero-route-grad)"
            strokeWidth={1.8}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.8, delay: r.delay, ease: EASE }}
          />
        ))}
      </svg>

      {PINS.map((p, i) => (
        <motion.div
          key={p.key}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 + i * 0.15, duration: 0.5 }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: pct(p.x), top: pct(p.y) }}
        >
          <span className="relative flex size-3">
            {!p.origin && (
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-blue-400/70" />
            )}
            <span className="relative inline-flex size-3 rounded-full bg-gradient-to-br from-blue-300 to-blue-600 shadow-[0_0_0_4px_rgba(255,255,255,0.35)]" />
          </span>

          {!p.origin && (
            <span className="absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/60 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-900 shadow-md backdrop-blur-md">
              {p.label}
            </span>
          )}
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, x: 30, y: -20 }}
        animate={{ opacity: 1, x: [0, 14, 0], y: [0, -10, 0] }}
        transition={{
          opacity: { duration: 0.8, delay: 1.4 },
          x: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute right-[2%] top-[0%] flex size-12 items-center justify-center rounded-2xl border border-white/50 bg-gradient-to-br from-white/60 to-white/25 text-slate-900 shadow-xl backdrop-blur-md"
      >
        <Plane className="size-5 rotate-45" />
      </motion.div>
    </div>
  );
}

function PremiumCard() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), {
    stiffness: 150,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), {
    stiffness: 150,
    damping: 18,
  });
  const sheenX = useTransform(mx, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 70, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
      className="w-full max-w-lg justify-self-center lg:max-w-none"
      style={{ perspective: 1200 }}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative rounded-[34px] bg-gradient-to-br from-white/50 via-white/15 to-white/5 p-[1.5px] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.45)]"
      >
        <div className="relative overflow-hidden rounded-[32px] bg-white/10 p-5 backdrop-blur-2xl sm:p-7">
          {/* Inner glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-blue-300/30 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-16 size-56 rounded-full bg-white/20 blur-3xl"
          />

          {/* Sheen sweep */}
          <motion.div
            aria-hidden
            style={{ left: sheenX }}
            className="pointer-events-none absolute top-0 h-full w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent blur-md"
          />

          {/* Top highlight line */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"
          />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-white/25 px-3 py-1 text-[11px] font-semibold tracking-wide text-white backdrop-blur-md">
                <span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_6px_2px_rgba(110,231,183,0.6)]" />
                GLOBAL ROUTES
              </span>
              <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
                Your gateway to global education.
              </h2>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/85">
                Explore destinations, funding, and mentors, all in one place.
              </p>
            </div>
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/50 bg-gradient-to-br from-white/40 to-white/10 text-white shadow-inner backdrop-blur-lg">
              <GraduationCap className="size-5" />
            </div>
          </div>

          <div className="relative mt-6">
            <GlobeMap />
          </div>

          <div className="relative mt-5 flex items-center justify-between border-t border-white/25 pt-4">
            <span className="text-xs font-medium text-white/80">
              Explore your possibilities
            </span>
            <Link
              href="/register"
              className="group inline-flex items-center gap-1 text-sm font-semibold text-white transition-opacity hover:opacity-80"
            >
              Get started
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Hero                                      */
/* -------------------------------------------------------------------------- */

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[100svh] w-full items-center overflow-hidden">
      <Image
        src="/hero.jpeg"
        alt="Students building their future through global university education"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 pt-32 sm:px-8 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-xl"
            >
              <Sparkles className="size-4" />
              Your future starts here
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-7 text-5xl font-light leading-[0.95] tracking-[-0.055em] text-white drop-shadow-lg sm:text-6xl md:text-7xl xl:text-[88px]"
            >
              DREAM
              <br />
              <span className="font-serif italic">BEYOND</span>
              <br />
              BORDERS.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-7 max-w-md text-base leading-relaxed text-white drop-shadow-md sm:text-lg"
            >
              Discover world-class universities, unlock scholarships, and
              connect with mentors who help turn your study abroad dreams into
              reality.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
            >
              <Link
                href="/register"
                className="group inline-flex h-12 items-center justify-center gap-3 rounded-full bg-white px-7 text-sm font-semibold text-neutral-900 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                Start Your Journey
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <Link
                href="/universities"
                className="group inline-flex h-12 items-center gap-2 rounded-full border border-white/40 bg-white/15 px-6 text-sm font-medium text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/25"
              >
                Explore Universities
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          <PremiumCard />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-12 hidden items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-white/80 sm:flex"
        >
          <span>Scroll to explore</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="size-4" />
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}