"use client";

import { useEffect, useState, type ElementType } from "react";
import {
  MapPin,
  GraduationCap,
  DollarSign,
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface CountryData {
  code: string;
  flag: string;
  name: string;
  tagline: string;
  gradient: string;
  stats: { tuition: string; visaSuccess: string; livingCost: string; intake: string };
  universities: string[];
  courses: string[];
}

const countries: CountryData[] = [
  {
    code: "uk",
    flag: "🇬🇧",
    name: "United Kingdom",
    tagline: "Home to some of the world's oldest and most prestigious universities.",
    gradient: "from-indigo-600 via-blue-600 to-sky-500",
    stats: { tuition: "£12k–£38k/yr", visaSuccess: "91%", livingCost: "£1,100/mo", intake: "Sep & Jan" },
    universities: ["Oxford", "Imperial College", "Manchester", "Edinburgh"],
    courses: ["Business", "Engineering", "Law", "Data Science"],
  },
  {
    code: "ca",
    flag: "🇨🇦",
    name: "Canada",
    tagline: "Affordable tuition with a clear path to permanent residency.",
    gradient: "from-red-500 via-rose-500 to-orange-400",
    stats: { tuition: "CAD 15k–35k/yr", visaSuccess: "88%", livingCost: "CAD 1,200/mo", intake: "Sep & Jan" },
    universities: ["Toronto", "UBC", "McGill", "Waterloo"],
    courses: ["Computer Science", "Nursing", "Business", "AI & ML"],
  },
  {
    code: "au",
    flag: "🇦🇺",
    name: "Australia",
    tagline: "High quality of life with strong post-study work opportunities.",
    gradient: "from-emerald-500 via-teal-500 to-cyan-400",
    stats: { tuition: "AUD 20k–45k/yr", visaSuccess: "85%", livingCost: "AUD 1,400/mo", intake: "Feb & Jul" },
    universities: ["Melbourne", "ANU", "Sydney", "UNSW"],
    courses: ["Medicine", "Environmental Science", "IT", "Business"],
  },
  {
    code: "de",
    flag: "🇩🇪",
    name: "Germany",
    tagline: "Tuition-free public universities with world-class engineering.",
    gradient: "from-amber-500 via-yellow-500 to-red-500",
    stats: { tuition: "€0–€3k/yr", visaSuccess: "90%", livingCost: "€900/mo", intake: "Oct & Apr" },
    universities: ["TU Munich", "Heidelberg", "RWTH Aachen", "Humboldt"],
    courses: ["Mechanical Eng.", "Automotive", "Physics", "Computer Science"],
  },
  {
    code: "us",
    flag: "🇺🇸",
    name: "United States",
    tagline: "The largest and most diverse higher-education system in the world.",
    gradient: "from-blue-600 via-indigo-600 to-violet-500",
    stats: { tuition: "$25k–$55k/yr", visaSuccess: "76%", livingCost: "$1,500/mo", intake: "Aug & Jan" },
    universities: ["MIT", "Stanford", "NYU", "UCLA"],
    courses: ["Computer Science", "MBA", "Data Science", "Design"],
  },
  {
    code: "jp",
    flag: "🇯🇵",
    name: "Japan",
    tagline: "Cutting-edge research culture with generous government scholarships.",
    gradient: "from-rose-500 via-pink-500 to-red-400",
    stats: { tuition: "¥535k–¥1.2M/yr", visaSuccess: "93%", livingCost: "¥110k/mo", intake: "Apr & Oct" },
    universities: ["Tokyo", "Kyoto", "Osaka", "Tohoku"],
    courses: ["Robotics", "Electronics", "Business", "Design"],
  },
];

const CYCLE_MS = 4500;

export default function CountriesSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const country = countries[active];

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % countries.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [paused, active]);

  const select = (idx: number) => {
    setActive(idx);
    setPaused(true);
  };

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-white to-sky-50/50 py-16 sm:py-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse at center, black, transparent 70%)",
        }}
      />

      <div className="pointer-events-none absolute -left-10 top-24 flex flex-col gap-6 text-4xl opacity-20 sm:text-5xl">
        {countries.map((c, i) => (
          <span
            key={c.code}
            className="country-float"
            style={{ animationDelay: `${i * 0.4}s` }}
          >
            {c.flag}
          </span>
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-semibold text-emerald-700">
            <MapPin className="h-3.5 w-3.5" /> 50+ COUNTRIES SUPPORTED
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Explore your future,
            <span className="bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
              {" "}
              country by country.
            </span>
          </h2>
          <p className="mt-3 text-slate-600">
            Destinations rotate live — tap one to lock in, or hover to pause.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="flex gap-3 overflow-x-auto pb-2 lg:col-span-4 lg:flex-col lg:overflow-visible lg:pb-0">
            {countries.map((c, idx) => {
              const isActive = idx === active;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => select(idx)}
                  className={`group relative flex min-w-[220px] shrink-0 items-center gap-4 overflow-hidden rounded-2xl border p-4 text-left transition-all lg:min-w-0 ${
                    isActive
                      ? "border-emerald-300 bg-white shadow-lg shadow-emerald-100"
                      : "border-transparent bg-white/50 hover:bg-white hover:shadow-md"
                  }`}
                >
                  <span
                    className={`text-3xl transition-transform duration-500 ${
                      isActive ? "scale-110" : "group-hover:scale-105"
                    }`}
                  >
                    {c.flag}
                  </span>
                  <div className="flex-1">
                    <p
                      className={`font-semibold ${
                        isActive ? "text-slate-900" : "text-slate-600"
                      }`}
                    >
                      {c.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {c.universities.length}+ featured universities
                    </p>
                  </div>
                  <ArrowRight
                    className={`h-4 w-4 shrink-0 transition-all ${
                      isActive
                        ? "translate-x-0 text-emerald-500"
                        : "-translate-x-1 text-slate-300 group-hover:translate-x-0 group-hover:text-slate-400"
                    }`}
                  />
                  {isActive && !paused && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-emerald-500 to-sky-500 country-progress" />
                  )}
                </button>
              );
            })}
          </div>

          <div key={country.code} className="country-panel lg:col-span-8">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/40 bg-white shadow-xl shadow-slate-200/50">
              <div
                className={`relative overflow-hidden bg-gradient-to-br ${country.gradient} px-8 py-9 sm:px-10`}
              >
                <div className="country-kenburns pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/15" />
                <div className="pointer-events-none absolute -bottom-12 left-1/3 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                <span className="pointer-events-none absolute -right-4 -bottom-6 select-none text-[7.5rem] font-black leading-none text-white/10">
                  {country.code.toUpperCase()}
                </span>

                <div className="relative flex items-center gap-4">
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-5xl shadow-inner ring-1 ring-white/30 backdrop-blur-sm">
                    {country.flag}
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
                      Now exploring
                    </p>
                    <h3 className="text-2xl font-bold text-white sm:text-3xl">
                      {country.name}
                    </h3>
                    <p className="mt-1 max-w-md text-sm text-white/80">
                      {country.tagline}
                    </p>
                  </div>
                </div>

                <div className="absolute right-6 top-6 rotate-12 rounded-md border-2 border-white/50 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white/80">
                  {country.code} · admit
                </div>
              </div>

              <div className="p-7 sm:p-9">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <StatTile icon={DollarSign} label="Tuition" value={country.stats.tuition} delay={0} />
                  <StatTile icon={ShieldCheck} label="Visa Success" value={country.stats.visaSuccess} delay={70} />
                  <StatTile icon={MapPin} label="Living Cost" value={country.stats.livingCost} delay={140} />
                  <StatTile icon={Clock} label="Intake" value={country.stats.intake} delay={210} />
                </div>

                <div className="mt-7">
                  <p className="mb-3 text-sm font-semibold text-slate-500">
                    Top universities
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {country.universities.map((u) => (
                      <span
                        key={u}
                        className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700"
                      >
                        <GraduationCap className="h-3.5 w-3.5 text-emerald-500" /> {u}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="mb-3 text-sm font-semibold text-slate-500">
                    Popular courses
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {country.courses.map((c) => (
                      <span
                        key={c}
                        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> {c}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:shadow-xl hover:shadow-emerald-300 sm:w-auto"
                >
                  View full {country.name} guide <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes country-progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .country-progress {
          animation: country-progress ${CYCLE_MS}ms linear forwards;
        }
        @keyframes country-panel-in {
          from { opacity: 0; transform: translateX(28px) scale(0.98); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        .country-panel {
          animation: country-panel-in 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes country-tile-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .country-tile {
          animation: country-tile-in 0.4s ease-out both;
        }
        @keyframes country-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .country-float {
          animation: country-float 4s ease-in-out infinite;
        }
        @keyframes country-kenburns {
          from { transform: scale(1) translate(0, 0); }
          to { transform: scale(1.25) translate(-12px, 8px); }
        }
        .country-kenburns {
          animation: country-kenburns 4.5s ease-out forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .country-progress,
          .country-panel,
          .country-tile,
          .country-float,
          .country-kenburns {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  delay,
}: {
  icon: ElementType;
  label: string;
  value: string;
  delay: number;
}) {
  return (
    <div
      className="country-tile rounded-2xl bg-slate-50 p-4"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Icon className="h-4 w-4 text-emerald-500" />
      <p className="mt-2 text-sm font-bold text-slate-900 sm:text-base">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}