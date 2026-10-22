"use client";

import { useEffect, useRef, useState } from "react";
import {
  Heart,
  ShieldCheck,
  Globe2,
  Compass,
  Users,
  GraduationCap,
  Award,
  Plane,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* 1. LIVE HERO MOCKUP CARD                                            */
/* ------------------------------------------------------------------ */

const tickerMessages = [
  { emoji: "🎓", text: "Fatima just got accepted to University of Toronto" },
  { emoji: "✈️", text: "Rakib's visa for Germany just got approved" },
  { emoji: "💰", text: "Maria matched with a $12,000 scholarship" },
  { emoji: "📄", text: "Omar's SOP was reviewed by a mentor in 2 hours" },
  { emoji: "🏫", text: "Tania shortlisted 6 universities in Japan" },
];

export function LiveHeroCard() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((p) => (p + 1) % tickerMessages.length);
    }, 2800);
    return () => clearInterval(t);
  }, []);

  const current = tickerMessages[index];

  return (
    <div className="relative mx-auto w-full max-w-sm">
      {/* orbit rings */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-200/60 [animation-duration:18s] animate-spin" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-sky-200/70 [animation-duration:26s] animate-spin [animation-direction:reverse]" />

      {/* floating chip 1 */}
      <div className="absolute -left-6 top-4 z-20 hidden animate-bounce rounded-2xl border border-slate-100 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg sm:flex items-center gap-1.5 [animation-duration:3s]">
        🇨🇦 Canada Offer Letter
      </div>
      {/* floating chip 2 */}
      <div className="absolute -right-4 bottom-10 z-20 hidden animate-bounce rounded-2xl border border-slate-100 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg sm:flex items-center gap-1.5 [animation-duration:3.4s] [animation-delay:0.6s]">
        🇬🇧 UK Visa Approved
      </div>

      {/* main glass card */}
      <div className="relative z-10 rotate-2 rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-2xl shadow-emerald-900/10 backdrop-blur-xl transition-transform duration-500 hover:rotate-0">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            LIVE RIGHT NOW
          </span>
          <Plane className="h-4 w-4 text-slate-300" />
        </div>

        <div
          key={index}
          className="mt-6 min-h-[64px] animate-in fade-in slide-in-from-bottom-2 duration-500"
        >
          <p className="text-2xl">{current.emoji}</p>
          <p className="mt-2 text-sm font-medium leading-snug text-slate-700">
            {current.text}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex -space-x-2">
            {["bg-emerald-400", "bg-sky-400", "bg-amber-400", "bg-rose-400"].map(
              (c, i) => (
                <div
                  key={i}
                  className={`h-7 w-7 rounded-full ${c} border-2 border-white`}
                />
              ),
            )}
          </div>
          <p className="text-[11px] font-semibold text-slate-400">
            2,481 students online
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. ANIMATED COUNT-UP STATS                                          */
/* ------------------------------------------------------------------ */

const statsData = [
  { icon: Users, value: 10000, suffix: "+", label: "Students guided" },
  { icon: GraduationCap, value: 500, suffix: "+", label: "Partner universities" },
  { icon: Globe2, value: 50, suffix: "+", label: "Countries supported" },
  { icon: Award, value: 120, suffix: "+", label: "Verified mentors" },
];

function CounterCard({
  icon: Icon,
  value,
  suffix,
  label,
  start,
  delay,
}: {
  icon: typeof Users;
  value: number;
  suffix: string;
  label: string;
  start: boolean;
  delay: number;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!start) return;
    const timeout = setTimeout(() => {
      const duration = 1500;
      const startTime = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(eased * value));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timeout);
  }, [start, value, delay]);

  return (
    <div className="group rounded-3xl border border-slate-100 bg-gradient-to-br from-white to-sky-50/60 p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-100">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 text-emerald-600 transition-transform group-hover:scale-110">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-3xl font-bold text-transparent">
        {display.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}

export function AnimatedStats() {
  const [start, setStart] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statsData.map((s, i) => (
        <CounterCard key={s.label} {...s} start={start} delay={i * 150} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. INTERACTIVE VALUES EXPERIENCE                                     */
/* ------------------------------------------------------------------ */

const values = [
  {
    icon: Heart,
    title: "Student-first, always",
    body: "Every feature starts from a real pain we faced — missed deadlines, opaque consultants, scattered tabs.",
  },
  {
    icon: ShieldCheck,
    title: "Honest guidance",
    body: "No fake guarantees. Mentors are verified students who actually studied where they say they did.",
  },
  {
    icon: Globe2,
    title: "Global, not generic",
    body: "UK, Canada, Germany, Japan — country-specific roadmaps, not one PDF for everyone.",
  },
  {
    icon: Compass,
    title: "Clarity over noise",
    body: "One dashboard. One next step. We cut the maze down to a path you can actually walk.",
  },
];

const AUTOPLAY_MS = 4000;

export function ValuesExperience() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [barReady, setBarReady] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setActive((p) => (p + 1) % values.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused]);

  // progress bar restart trick: reset width to 0 then next tick to 100
  useEffect(() => {
    setBarReady(false);
    const raf = requestAnimationFrame(() => setBarReady(true));
    return () => cancelAnimationFrame(raf);
  }, [active, paused]);

  const ActiveIcon = values[active].icon;

  return (
    <div
      className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* left: tab list */}
      <div className="space-y-2">
        {values.map((v, i) => {
          const Icon = v.icon;
          const isActive = i === active;
          return (
            <button
              key={v.title}
              onClick={() => setActive(i)}
              className={`relative w-full overflow-hidden rounded-2xl border px-5 py-4 text-left transition-all ${
                isActive
                  ? "border-emerald-200 bg-white shadow-md shadow-emerald-100"
                  : "border-transparent bg-slate-50 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    isActive
                      ? "bg-gradient-to-br from-emerald-500 to-sky-500 text-white"
                      : "bg-white text-slate-400"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <span
                  className={`text-sm font-bold ${
                    isActive ? "text-slate-900" : "text-slate-500"
                  }`}
                >
                  {v.title}
                </span>
              </div>

              {isActive && (
                <div className="absolute bottom-0 left-0 h-0.5 w-full bg-slate-100">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-sky-500 transition-[width] ease-linear"
                    style={{
                      width: barReady ? "100%" : "0%",
                      transitionDuration: paused ? "0ms" : `${AUTOPLAY_MS}ms`,
                    }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* right: active detail panel */}
      <div
        key={active}
        className="relative overflow-hidden rounded-[1.8rem] border border-slate-100 bg-gradient-to-br from-white via-sky-50/40 to-emerald-50/40 p-8 shadow-sm animate-in fade-in slide-in-from-right-4 duration-500 sm:p-10"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage:
              "radial-gradient(ellipse at top right, black, transparent 70%)",
          }}
        />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-500 text-white shadow-lg shadow-emerald-200">
          <ActiveIcon className="h-7 w-7" />
        </div>
        <h3 className="relative mt-6 text-2xl font-bold text-slate-900">
          {values[active].title}
        </h3>
        <p className="relative mt-3 max-w-md text-slate-600">
          {values[active].body}
        </p>
        <p className="relative mt-8 text-6xl font-black text-slate-900/5">
          0{active + 1}
        </p>
      </div>
    </div>
  );
}