"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  Circle,
  Clock3,
  FileText,
  Flag,
  GraduationCap,
  Sparkles,
} from "lucide-react";

interface Step {
  id: string;
  label: string;
  hint: string;
  done: boolean;
  tone: "done" | "live" | "wait";
}

const INITIAL: Step[] = [
  {
    id: "shortlist",
    label: "Shortlist universities",
    hint: "5 selected · 2 reach · 2 match · 1 safety",
    done: true,
    tone: "done",
  },
  {
    id: "english",
    label: "IELTS / GRE preparation",
    hint: "Target 7.5 · last mock 7.0",
    done: true,
    tone: "done",
  },
  {
    id: "docs",
    label: "SOP & LOR drafts",
    hint: "In review with mentor Ayesha R.",
    done: false,
    tone: "live",
  },
  {
    id: "apply",
    label: "Submit application packets",
    hint: "Univ. of Toronto · opens in 18 days",
    done: false,
    tone: "wait",
  },
];

const TOASTS = [
  { flag: "🇨🇦", text: "Ayesha reviewed your SOP — 2 notes left" },
  { flag: "🎓", text: "New match: Chevening closes in 11 days" },
  { flag: "🇬🇧", text: "Manchester slot opened — 3 applicants ahead" },
  { flag: "🔔", text: "Document “bank statement” still missing" },
];

const DEADLINE = Date.now() + 18 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000 + 42 * 60 * 1000;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function useCountdown(target: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return { d, h, m, s };
}

export default function ApplicationCommandCenter() {
  const [steps, setSteps] = useState(INITIAL);
  const [toastIdx, setToastIdx] = useState(0);
  const [pulse, setPulse] = useState(true);
  const count = useCountdown(DEADLINE);

  const progress = useMemo(() => {
    const done = steps.filter((s) => s.done).length;
    return Math.round((done / steps.length) * 100);
  }, [steps]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setToastIdx((i) => (i + 1) % TOASTS.length);
      setPulse((p) => !p);
    }, 3200);
    return () => window.clearInterval(id);
  }, []);

  const toggle = (id: string) => {
    setSteps((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              done: !s.done,
              tone: !s.done ? "done" : s.id === "docs" ? "live" : "wait",
            }
          : s,
      ),
    );
  };

  const toast = TOASTS[toastIdx];

  return (
    <section className="relative overflow-hidden bg-slate-950">
      <svg
        className="relative block h-10 w-full sm:h-14"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0,0 L1440,0 L1440,28 C1080,80 360,0 0,52 Z"
          className="fill-white"
        />
      </svg>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="pointer-events-none absolute -left-24 top-32 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-6 sm:pb-24 sm:pt-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" />
              ALL-IN-ONE DASHBOARD · LIVE
            </span>

            <h2 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Your study-abroad
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
                command center.
              </span>
            </h2>

            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-slate-400">
              Spreadsheets can&apos;t countdown. This can. One live board for
              shortlists, documents, mentors and every deadline that actually
              matters.
            </p>

            <div className="mt-8 grid max-w-md grid-cols-3 gap-3">
              {[
                { k: "18d", v: "next close" },
                { k: `${progress}%`, v: "roadmap" },
                { k: "3", v: "mentors up" },
              ].map((s) => (
                <div
                  key={s.v}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 text-center"
                >
                  <p className="font-mono text-lg font-bold text-white">{s.k}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500">
                    {s.v}
                  </p>
                </div>
              ))}
            </div>

            <ul className="mt-8 space-y-3">
              {[
                "Checklist that knows what’s still missing",
                "Deadlines that tick in real time — not a calendar screenshot",
                "Mentor review sitting on the same card as the file",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-slate-300"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="/roadmaps"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/40 transition-transform hover:scale-[1.02]"
            >
              Open a live demo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Card sits left of the radar so rings always peek on the right */}
          <div className="relative">
            <div className="pointer-events-none absolute left-[58%] top-1/2 z-0 h-[280px] w-[280px] -translate-y-1/2 sm:h-[340px] sm:w-[340px] lg:h-[380px] lg:w-[380px]">
              <div className="absolute inset-0 rounded-full border border-emerald-400/25" />
              <div className="absolute inset-8 rounded-full border border-emerald-400/20" />
              <div className="absolute inset-16 rounded-full border border-sky-400/20" />
              <div className="absolute inset-[4.5rem] rounded-full border border-emerald-400/10" />
              <div className="acc-sweep absolute inset-0 rounded-full" />
            </div>

            <div className="relative z-10 mr-10 sm:mr-16 lg:mr-20">
              <div
                key={toast.text}
                className="acc-toast pointer-events-none absolute -top-5 right-3 z-20 hidden items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/90 px-3 py-2 text-xs text-white shadow-xl backdrop-blur sm:flex"
              >
                <span>{toast.flag}</span>
                <span className="max-w-[220px] truncate">{toast.text}</span>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${pulse ? "bg-emerald-400" : "bg-sky-400"}`}
                />
              </div>

              <div className="relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#0b1220] shadow-2xl shadow-emerald-950/50">
                <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  <span className="ml-3 flex-1 truncate rounded-full bg-white/5 px-3 py-1 font-mono text-[10px] text-slate-500">
                    mission.gradpath / fall-2026
                  </span>
                  <span className="hidden items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 sm:inline-flex">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>
                    ON TRACK
                  </span>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Target semester
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-white">
                        Fall 2026 · Master&apos;s prep
                      </h3>
                    </div>
                    <GraduationCap className="h-5 w-5 text-sky-400" />
                  </div>

                  <div className="mt-5">
                    <div className="mb-1.5 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Overall progress</span>
                      <span className="font-semibold text-emerald-400">
                        {progress}% complete
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <ul className="relative mt-5 space-y-2">
                    <span className="absolute bottom-3 left-[18px] top-3 w-px bg-white/10" />
                    {steps.map((step) => (
                      <li key={step.id}>
                        <button
                          type="button"
                          onClick={() => toggle(step.id)}
                          className={`relative flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-all ${
                            step.done
                              ? "border-emerald-400/20 bg-emerald-400/5"
                              : step.tone === "live"
                                ? "border-sky-400/30 bg-sky-400/5"
                                : "border-white/5 bg-white/[0.03] hover:border-white/15"
                          }`}
                        >
                          {step.done ? (
                            <CheckCircle2 className="relative z-10 h-5 w-5 shrink-0 text-emerald-400" />
                          ) : step.tone === "live" ? (
                            <span className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center">
                              <span className="absolute h-5 w-5 animate-ping rounded-full bg-sky-400/30" />
                              <FileText className="h-4 w-4 text-sky-400" />
                            </span>
                          ) : (
                            <Circle className="relative z-10 h-5 w-5 shrink-0 text-slate-600" />
                          )}
                          <span className="min-w-0 flex-1">
                            <span
                              className={`block text-sm font-semibold ${
                                step.done
                                  ? "text-emerald-200 line-through decoration-emerald-700"
                                  : "text-white"
                              }`}
                            >
                              {step.label}
                            </span>
                            <span className="block truncate text-[11px] text-slate-500">
                              {step.hint}
                            </span>
                          </span>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              step.done
                                ? "bg-emerald-400/15 text-emerald-300"
                                : step.tone === "live"
                                  ? "bg-sky-400/15 text-sky-300"
                                  : "bg-white/5 text-slate-500"
                            }`}
                          >
                            {step.done
                              ? "Done"
                              : step.tone === "live"
                                ? "In review"
                                : "Pending"}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex items-center gap-3 rounded-2xl border border-amber-400/20 bg-gradient-to-r from-amber-400/10 to-orange-400/5 p-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
                      <Clock3 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium text-slate-400">
                        Univ. of Toronto · application closes
                      </p>
                      <p className="mt-0.5 font-mono text-sm font-bold tracking-wider text-white">
                        {count.d}d {pad(count.h)}h {pad(count.m)}m {pad(count.s)}s
                      </p>
                    </div>
                    <Flag className="h-4 w-4 shrink-0 text-amber-300" />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-white/5 px-5 py-2.5 font-mono text-[10px] text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    SYS.NOMINAL
                  </span>
                  <span>3 mentors online</span>
                  <span className="inline-flex items-center gap-1">
                    <Bell className="h-3 w-3" /> last sync 4s ago
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes acc-sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .acc-sweep {
          background: conic-gradient(from 0deg, transparent 0 75%, rgba(16, 185, 129, 0.22) 100%);
          animation: acc-sweep 9s linear infinite;
        }
        @keyframes acc-toast-in {
          from { opacity: 0; transform: translateY(-8px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .acc-toast {
          animation: acc-toast-in 0.35s ease-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .acc-sweep, .acc-toast { animation: none !important; }
        }
      `}</style>
    </section>
  );
}