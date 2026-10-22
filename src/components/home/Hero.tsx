"use client";



import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import { useEffect, useMemo, useState, type MouseEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  ChevronDown,
  Globe,
  GraduationCap,
  Plane,
  Sparkles,
  Users,
} from "lucide-react";
import {
  geoDistance,
  geoGraticule10,
  geoInterpolate,
  geoOrthographic,
  geoPath,
} from "d3-geo";
import { feature, mesh } from "topojson-client";
import worldTopo from "world-atlas/countries-110m.json";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];



const topo = worldTopo as any;
const LAND = feature(topo, topo.objects.land) as any;
const COUNTRIES: { id?: string | number }[] = (
  feature(topo, topo.objects.countries) as any
).features;
const BORDERS = mesh(topo, topo.objects.countries, (a: any, b: any) => a !== b) as any;
/* eslint-enable @typescript-eslint/no-explicit-any */
const GRATICULE = geoGraticule10();

const countryById = (iso: string) =>
  COUNTRIES.find((c) => String(c.id).padStart(3, "0") === iso);



const VIEW = 400;
const CX = 200;
const CY = 200;
const R = 172;

const DESTINATIONS = [
  { key: "us", label: "USA", iso: "840", lon: -98, lat: 39 },
  { key: "uk", label: "United Kingdom", iso: "826", lon: -2, lat: 54 },
  { key: "ca", label: "Canada", iso: "124", lon: -106, lat: 56 },
  { key: "de", label: "Germany", iso: "276", lon: 10, lat: 51 },
  { key: "tr", label: "Turkey", iso: "792", lon: 35, lat: 39 },
  { key: "dk", label: "Denmark", iso: "208", lon: 10, lat: 56 },
  { key: "au", label: "Australia", iso: "036", lon: 134, lat: -25 },
  { key: "my", label: "Malaysia", iso: "458", lon: 108, lat: 4 },
  { key: "jp", label: "Japan", iso: "392", lon: 138, lat: 36 },
  { key: "kr", label: "South Korea", iso: "410", lon: 128, lat: 36 },
];

const ORIGIN = { label: "Bangladesh", iso: "050", lon: 90.4, lat: 23.8 };

const LEG_MS = 5200;
const ARC_STEPS = 64;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const CAMERA_TARGETS = DESTINATIONS.map((d) => {
  const [lon, lat] = geoInterpolate([ORIGIN.lon, ORIGIN.lat], [d.lon, d.lat])(0.5);
  return [lon, Math.max(0, Math.min(50, lat))] as [number, number];
});

function useGlobe(legCount: number) {
  const [view, setView] = useState({
    lon: CAMERA_TARGETS[0][0],
    lat: CAMERA_TARGETS[0][1],
    legIndex: 0,
    legProgress: 0,
  });

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    let last = start;
    let lastPaint = 0;
    let lon = CAMERA_TARGETS[0][0];
    let lat = CAMERA_TARGETS[0][1];

    const tick = (now: number) => {
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;

      const elapsed = Math.max(0, now - start);
      const legIndex = Math.floor(elapsed / LEG_MS) % legCount;
      const legProgress = (elapsed % LEG_MS) / LEG_MS;

      const [tLon, tLat] = CAMERA_TARGETS[legIndex];
      const k = 1 - Math.exp(-dt * 2.2);
      lon += (((tLon - lon + 540) % 360) - 180) * k;
      lat += (tLat - lat) * k;

      if (now - lastPaint >= 30) {
        lastPaint = now;
        setView({ lon, lat, legIndex, legProgress });
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [legCount]);

  return view;
}

/* A proper top-down airliner silhouette (nose up) */
const PLANE_PATH =
  "M32 1.5C34.2 1.5 35.2 4.6 35.2 9V23.5L60 38V44.5L35.2 36.5V50L42.5 55.2V60.5L32 57.6L21.5 60.5V55.2L28.8 50V36.5L4 44.5V38L28.8 23.5V9C28.8 4.6 29.8 1.5 32 1.5Z";

function buildPath(pts: { x: number; y: number; vis: boolean }[]) {
  let d = "";
  let pen = false;
  for (const p of pts) {
    if (!p.vis) {
      pen = false;
      continue;
    }
    d += `${pen ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
    pen = true;
  }
  return d;
}

function Pill({
  x,
  y,
  text,
  variant,
  opacity = 1,
}: {
  x: number;
  y: number;
  text: string;
  variant: "origin" | "dest";
  opacity?: number;
}) {
  const w = text.length * 5.9 + 20;
  const dest = variant === "dest";
  return (
    <g transform={`translate(${x} ${y - 20})`} opacity={opacity}>
      <rect
        x={-w / 2}
        y={-10}
        width={w}
        height={20}
        rx={10}
        fill={dest ? "#ffffff" : "#10b981"}
        stroke={dest ? "rgba(255,255,255,0.8)" : "rgba(167,243,208,0.9)"}
        filter="url(#globe-shadow)"
      />
      <text
        x={0}
        y={3.6}
        textAnchor="middle"
        fontSize={10}
        fontWeight={600}
        fill={dest ? "#0f172a" : "#ffffff"}
        style={{ letterSpacing: "0.01em" }}
      >
        {text}
      </text>
    </g>
  );
}


const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.15 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE },
  },
};



function GlobeMap() {
  const view = useGlobe(DESTINATIONS.length);
  const { lon, lat, legIndex, legProgress } = view;
  const dest = DESTINATIONS[legIndex];

  const projection = useMemo(
    () =>
      geoOrthographic()
        .scale(R)
        .translate([CX, CY])
        .rotate([-lon, -lat])
        .clipAngle(90)
        .precision(0.4),
    [lon, lat],
  );

  const paths = useMemo(() => {
    const gen = geoPath(projection);
    const destCountry = countryById(dest.iso);
    const originCountry = countryById(ORIGIN.iso);
    return {
      land: gen(LAND) ?? "",
      borders: gen(BORDERS) ?? "",
      graticule: gen(GRATICULE) ?? "",
      dest: destCountry ? (gen(destCountry as never) ?? "") : "",
      origin: originCountry ? (gen(originCountry as never) ?? "") : "",
    };
  }, [projection, dest.iso]);

  const interp = useMemo(
    () => geoInterpolate([ORIGIN.lon, ORIGIN.lat], [dest.lon, dest.lat]),
    [dest.lon, dest.lat],
  );

  const center: [number, number] = [lon, lat];
  const isVisible = (ll: [number, number]) => geoDistance(ll, center) < Math.PI / 2 - 0.03;

  const place = (ll: [number, number], lift = 0) => {
    const p = projection(ll) ?? [CX, CY];
    return {
      x: CX + (p[0] - CX) * (1 + lift),
      y: CY + (p[1] - CY) * (1 + lift),
      gx: p[0],
      gy: p[1],
      vis: isVisible(ll),
    };
  };

  const samples = useMemo(
    () =>
      Array.from({ length: ARC_STEPS + 1 }, (_, i) => {
        const t = i / ARC_STEPS;
        return { t, ...place(interp(t) as [number, number], Math.sin(Math.PI * t) * 0.12) };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projection, interp],
  );

  const travelT = easeInOut(clamp01((legProgress - 0.05) / 0.88));
  const fade =
    legProgress < 0.05
      ? legProgress / 0.05
      : legProgress > 0.95
        ? (1 - legProgress) / 0.05
        : 1;

  const planeLL = interp(travelT) as [number, number];
  const planePos = place(planeLL, Math.sin(Math.PI * travelT) * 0.12);
  const aheadT = Math.min(1, travelT + 0.012);
  const behindT = Math.max(0, aheadT - 0.024);
  const a = place(interp(behindT) as [number, number], Math.sin(Math.PI * behindT) * 0.12);
  const b = place(interp(aheadT) as [number, number], Math.sin(Math.PI * aheadT) * 0.12);
  const heading = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI + 90;
  const planeScale = 0.36 + Math.sin(Math.PI * travelT) * 0.1;

  const flown = samples.filter((s) => s.t <= travelT);
  const flownPts = [...flown, { t: travelT, ...planePos }];
  const flownD = buildPath(flownPts);
  const plannedD = buildPath(samples);

  /* Fading contrail along the last stretch of the route */
  const tail = flownPts.slice(-26);

  const origin = place([ORIGIN.lon, ORIGIN.lat]);
  const destPin = place([dest.lon, dest.lat]);

  return (
    <div>
      <div className="relative mx-auto aspect-square w-full max-w-[380px]">
        <div
          aria-hidden
          className="absolute inset-[-4%] rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.28),transparent_68%)] blur-2xl"
        />

        <svg
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          className="absolute inset-0 h-full w-full overflow-visible"
          role="img"
          aria-label="Interactive globe showing study destinations from Bangladesh"
        >
          <defs>
            <radialGradient id="globe-ocean" cx="36%" cy="30%" r="85%">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="55%" stopColor="#0b1b4d" />
              <stop offset="100%" stopColor="#030816" />
            </radialGradient>
            <linearGradient id="globe-land" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.8" />
            </linearGradient>
            <radialGradient id="globe-shade" cx="35%" cy="30%" r="80%">
              <stop offset="55%" stopColor="#000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
            </radialGradient>
            <radialGradient id="globe-atmos" cx="50%" cy="50%" r="50%">
              <stop offset="88%" stopColor="#7dd3fc" stopOpacity="0" />
              <stop offset="96%" stopColor="#7dd3fc" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="globe-rim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="globe-route" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6ee7b7" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            <clipPath id="globe-clip">
              <circle cx={CX} cy={CY} r={R} />
            </clipPath>
            <filter id="globe-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.45" />
            </filter>
            <filter id="globe-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>

          {/* Atmosphere */}
          <circle cx={CX} cy={CY} r={R + 16} fill="url(#globe-atmos)" />

          {/* Ocean */}
          <circle cx={CX} cy={CY} r={R} fill="url(#globe-ocean)" />

          <g clipPath="url(#globe-clip)">
            <path d={paths.graticule} fill="none" stroke="#ffffff" strokeOpacity={0.07} strokeWidth={0.5} />
            <path d={paths.land} fill="url(#globe-land)" fillOpacity={0.55} />
            <path d={paths.borders} fill="none" stroke="#0b1b4d" strokeOpacity={0.45} strokeWidth={0.45} />
            <path d={paths.origin} fill="#34d399" fillOpacity={0.75} stroke="#a7f3d0" strokeWidth={0.7} />
            <path d={paths.dest} fill="#ffffff" fillOpacity={0.9} stroke="#ffffff" strokeWidth={0.8} />
            <circle cx={CX} cy={CY} r={R} fill="url(#globe-shade)" />
            <ellipse cx={CX - 52} cy={CY - 70} rx={86} ry={52} fill="#ffffff" opacity={0.05} transform={`rotate(-28 ${CX - 52} ${CY - 70})`} />
          </g>

          <circle cx={CX} cy={CY} r={R} fill="none" stroke="url(#globe-rim)" strokeWidth={1} />

          {/* Planned route */}
          <path d={plannedD} fill="none" stroke="#ffffff" strokeOpacity={0.28 * fade} strokeWidth={1} strokeDasharray="2 4" strokeLinecap="round" />

          {/* Flown route */}
          <path d={flownD} fill="none" stroke="url(#globe-route)" strokeWidth={1.8} strokeLinecap="round" opacity={fade} />

          {/* Contrail */}
          {tail.slice(1).map((p, i) => {
            const prev = tail[i];
            if (!p.vis || !prev.vis) return null;
            const k = (i + 1) / tail.length;
            return (
              <line
                key={i}
                x1={prev.x}
                y1={prev.y}
                x2={p.x}
                y2={p.y}
                stroke="#ffffff"
                strokeWidth={1 + k * 2.6}
                strokeLinecap="round"
                strokeOpacity={k * 0.55 * fade}
                filter="url(#globe-glow)"
              />
            );
          })}

          {/* Other destinations */}
          {DESTINATIONS.map((d) => {
            if (d.key === dest.key) return null;
            const p = place([d.lon, d.lat]);
            if (!p.vis) return null;
            return <circle key={d.key} cx={p.gx} cy={p.gy} r={2} fill="#ffffff" opacity={0.55} />;
          })}

          {/* Origin pin */}
          {origin.vis && (
            <g>
              <circle cx={origin.gx} cy={origin.gy} r={4} fill="none" stroke="#6ee7b7" strokeWidth={1.2}>
                <animate attributeName="r" values="4;13" dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0" dur="2.2s" repeatCount="indefinite" />
              </circle>
              <circle cx={origin.gx} cy={origin.gy} r={3.6} fill="#10b981" stroke="#ffffff" strokeWidth={1.4} />
            </g>
          )}

          {/* Active destination pin */}
          {destPin.vis && (
            <g opacity={fade}>
              <circle cx={destPin.gx} cy={destPin.gy} r={4} fill="none" stroke="#ffffff" strokeWidth={1.2}>
                <animate attributeName="r" values="4;14" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <circle cx={destPin.gx} cy={destPin.gy} r={3.6} fill="#3b82f6" stroke="#ffffff" strokeWidth={1.4} />
            </g>
          )}

          {/* Ground shadow of the plane */}
          {planePos.vis && (
            <g
              transform={`translate(${planePos.gx + 2} ${planePos.gy + 5}) rotate(${heading}) scale(${planeScale * 0.8}) translate(-32 -32)`}
              opacity={0.28 * fade}
            >
              <path d={PLANE_PATH} fill="#000" />
            </g>
          )}

          {/* Labels */}
          {origin.vis && <Pill x={origin.gx} y={origin.gy} text={ORIGIN.label} variant="origin" />}
          {destPin.vis && <Pill x={destPin.gx} y={destPin.gy} text={dest.label} variant="dest" opacity={fade} />}

          {/* The plane */}
          {planePos.vis && (
            <g opacity={fade}>
              <circle cx={planePos.x} cy={planePos.y} r={11} fill="#ffffff" opacity={0.18} filter="url(#globe-glow)" />
              <g
                transform={`translate(${planePos.x} ${planePos.y}) rotate(${heading}) scale(${planeScale}) translate(-32 -32)`}
                filter="url(#globe-shadow)"
              >
                <path d={PLANE_PATH} fill="#ffffff" />
                <path d="M32 6V50" stroke="#cbd5e1" strokeWidth={1.4} strokeLinecap="round" />
                <path d="M29 25L7 39M35 25L57 39" stroke="#e2e8f0" strokeWidth={1} strokeLinecap="round" />
              </g>
            </g>
          )}
        </svg>
      </div>


    </div>
  );
}



function PremiumCard() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 140, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 140, damping: 18 });
  const gx = useTransform(mx, [-0.5, 0.5], [0, 100]);
  const gy = useTransform(my, [-0.5, 0.5], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, rgba(255,255,255,0.16), transparent 70%)`;

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
      transition={{ duration: 1, delay: 0.3, ease: EASE }}
      className="w-full max-w-md justify-self-center lg:max-w-none"
      style={{ perspective: 1400 }}
    >
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-8 rounded-[48px] bg-blue-950/30 blur-3xl"
        />

        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="group relative overflow-hidden rounded-[32px] border border-white/35 bg-white/[0.12] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_20px_50px_-20px_rgba(2,6,23,0.5)] backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/[0.18] sm:p-6"
        >
          {/* Ambient light */}
          <div aria-hidden className="pointer-events-none absolute -top-24 -right-20 size-64 rounded-full bg-sky-300/50 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 size-56 rounded-full bg-white/50 blur-3xl" />
          <motion.div aria-hidden style={{ background: glare }} className="pointer-events-none absolute inset-0" />
          <div aria-hidden className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[0.10] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-md">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-emerald-300" />
                </span>
                Live global routes
              </span>
              <h2 className="mt-4 text-2xl font-semibold leading-[1.1] tracking-tight text-white [text-shadow:0_2px_16px_rgba(2,6,23,0.55)] sm:text-[28px]">
                Your gateway to
                <br />
                <span className="font-serif italic text-white">
                  global education.
                </span>
              </h2>
              <p className="mt-2 max-w-xs text-xs leading-relaxed text-white/85 [text-shadow:0_1px_10px_rgba(2,6,23,0.55)] sm:text-sm">
                Explore destinations, funding, and mentors, all in one place.
              </p>
            </div>
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/25 bg-white/[0.10] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-lg">
              <GraduationCap className="size-5" />
            </div>
          </div>

          <div className="relative">
            <GlobeMap />
          </div>

          <div className="relative mt-5 flex items-center justify-between border-t border-white/15 pt-4">
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/80 [text-shadow:0_1px_8px_rgba(2,6,23,0.5)]">
              Explore your possibilities
            </span>
            <Link
              href="/register"
              className="group/btn inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900 shadow-[0_8px_30px_-8px_rgba(255,255,255,0.6)] transition-all hover:-translate-y-0.5"
            >
              Get started
              <ArrowUpRight className="size-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}



const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const HIGHLIGHTS = [
  { icon: Globe, label: `${DESTINATIONS.length} destinations` },
  { icon: Award, label: "Scholarship guidance" },
  { icon: Users, label: "Expert mentors" },
];

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-slate-950">
      <Image
        src="/hero.jpeg"
        alt="Students building their future through global university education"
        fill
        priority
        sizes="100vw"
        className="scale-105 object-cover object-center"
      />

      {/* Depth: directional shade, vignette, colour wash, grain */}
      {/* Light overlays only where text sits, so the photo stays vivid */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-slate-950/55 via-slate-950/10 to-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-950/50 to-transparent" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,rgba(59,130,246,0.12),transparent_55%)]" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_65%,rgba(2,6,23,0.35)_100%)]" />
      {/* Slow drifting light sheen */}
      <motion.div
        aria-hidden
        initial={{ x: "-60%" }}
        animate={{ x: "160%" }}
        transition={{ duration: 14, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
        className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{ backgroundImage: NOISE }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 pt-32 sm:px-8 lg:px-12">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/[0.12] py-1.5 pl-2 pr-4 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_30px_-10px_rgba(2,6,23,0.5)] backdrop-blur-2xl"
            >
              <span className="flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-sky-300 to-blue-500 text-white">
                <Plane className="size-3.5" />
              </span>
              Your future starts here
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-7 text-5xl font-light leading-[0.95] tracking-[-0.055em] text-white [text-shadow:0_6px_40px_rgba(0,0,0,0.55)] sm:text-6xl md:text-7xl xl:text-[92px]"
            >
              DREAM
              <br />
              <span className="bg-gradient-to-r from-white via-sky-100 to-blue-300 bg-clip-text font-serif italic text-transparent [text-shadow:none]">
                BEYOND
              </span>
              <br />
              BORDERS.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-7 max-w-md text-base leading-relaxed text-white/85 [text-shadow:0_2px_14px_rgba(0,0,0,0.5)] sm:text-lg"
            >
              Discover world-class universities, unlock scholarships, and connect
              with mentors who help turn your study abroad dreams into reality.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
            >
              <Link
                href="/register"
                className="group relative inline-flex h-13 items-center justify-center gap-3 overflow-hidden rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-neutral-900 shadow-[0_14px_44px_-10px_rgba(255,255,255,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_56px_-10px_rgba(255,255,255,0.7)]"
              >
                <span
                  aria-hidden
                  className="absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-sky-200/60 to-transparent transition-all duration-700 group-hover:left-[150%]"
                />
                <span className="relative">Start Your Journey</span>
                <span className="relative flex size-6 items-center justify-center rounded-full bg-neutral-900 text-white">
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>

              <Link
                href="/universities"
                className="group inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/[0.12] px-7 py-3.5 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-2xl transition-all duration-300 hover:border-white/60 hover:bg-white/[0.22]"
              >
                Explore Universities
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.ul
              variants={fadeUp}
              className="mt-10 flex flex-wrap items-stretch justify-center rounded-3xl border border-white/25 bg-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_20px_50px_-20px_rgba(2,6,23,0.5)] backdrop-blur-2xl lg:justify-start"
            >
              {HIGHLIGHTS.map(({ icon: Icon, label }, i) => (
                <li
                  key={label}
                  className={`flex items-center gap-2.5 px-5 py-3 text-sm font-medium text-white ${
                    i > 0 ? "border-l border-white/15" : ""
                  }`}
                >
                  <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-white/30 to-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
                    <Icon className="size-4 text-white" />
                  </span>
                  {label}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          <PremiumCard />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-14 hidden items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-white/70 sm:flex"
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