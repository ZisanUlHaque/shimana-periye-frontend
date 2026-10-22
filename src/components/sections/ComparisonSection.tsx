"use client";

import { useState } from "react";
import {
  Search,
  ClipboardList,
  Award,
  Users,
  ShieldCheck,
  DollarSign,
  XCircle,
  CheckCircle2,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

interface ComparisonRow {
  icon: LucideIcon;
  title: string;
  without: string;
  withUs: string;
}

const rows: ComparisonRow[] = [
  {
    icon: Search,
    title: "University research",
    without: "Weeks of scattered Google searches and outdated blog posts",
    withUs: "A curated shortlist generated for your exact profile in minutes",
  },
  {
    icon: ClipboardList,
    title: "Application tracking",
    without: "Spreadsheets, sticky notes, and missed deadlines",
    withUs: "One live dashboard tracking every deadline automatically",
  },
  {
    icon: Award,
    title: "Scholarship discovery",
    without: "Stumbling onto scholarships by luck, if at all",
    withUs: "AI-matched scholarships delivered straight to your inbox",
  },
  {
    icon: Users,
    title: "Expert guidance",
    without: "Paying hundreds for generic, one-size-fits-all consultants",
    withUs: "Verified mentors who've lived your exact journey, on demand",
  },
  {
    icon: ShieldCheck,
    title: "Visa preparation",
    without: "Confusing forms with no second opinion",
    withUs: "A step-by-step roadmap plus real mentor review",
  },
  {
    icon: DollarSign,
    title: "Total cost",
    without: "$500–$2,000+ in consultancy fees",
    withUs: "Free to start — pay only for the guidance you need",
  },
];

function CompareCard({ row }: { row: ComparisonRow }) {
  const Icon = row.icon;
  return (
    <article className="w-[340px] shrink-0 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg sm:w-[400px]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <Icon className="h-5 w-5" />
        </div>
        <p className="font-semibold text-slate-900">{row.title}</p>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-2xl bg-red-50/70 p-3">
        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
        <p className="text-sm text-slate-500">{row.without}</p>
      </div>

      <div className="mt-2 flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
        <p className="text-sm font-medium text-emerald-800">{row.withUs}</p>
      </div>
    </article>
  );
}

function MarqueeRow({
  items,
  reverse,
  duration,
  paused,
}: {
  items: ComparisonRow[];
  reverse?: boolean;
  duration: number;
  paused: boolean;
}) {
  const loop = [...items, ...items];
  return (
    <div
      className="flex w-max gap-4"
      style={{
        animation: `${reverse ? "cmp-marquee-reverse" : "cmp-marquee"} ${duration}s linear infinite`,
        animationPlayState: paused ? "paused" : "running",
      }}
    >
      {loop.map((row, i) => (
        <CompareCard key={`${row.title}-${i}`} row={row} />
      ))}
    </div>
  );
}

export default function ComparisonSection() {
  const [paused, setPaused] = useState(false);
  const rowA = rows.slice(0, 3);
  const rowB = rows.slice(3);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-emerald-50/30 to-white pt-10 pb-16 sm:pt-12 sm:pb-20">
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white">
          WHY CHOOSE US
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          The old way vs.
          <span className="bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
            {" "}
            the ShimanaPeriye way.
          </span>
        </h2>
        <p className="mt-3 text-slate-600">
          Studying abroad is complicated enough. Here&apos;s exactly how much
          easier it gets.
        </p>
      </div>

      <div
        className="relative mt-10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        }}
      >
        <div className="overflow-hidden">
          <MarqueeRow items={rowA} duration={22} paused={paused} />
        </div>
        <div className="mt-4 overflow-hidden">
          <MarqueeRow items={rowB} reverse duration={26} paused={paused} />
        </div>
      </div>

      <div className="mt-10 flex justify-center px-6">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 px-8 py-3.5 font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:shadow-xl hover:shadow-emerald-300"
        >
          Start your journey the smart way <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <style>{`
        @keyframes cmp-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes cmp-marquee-reverse {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="cmp-marquee"] {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}