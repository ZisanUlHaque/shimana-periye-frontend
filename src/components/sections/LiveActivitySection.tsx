"use client";

import { useEffect, useState, type ElementType } from "react";
import {
  Users,
  GraduationCap,
  Award,
  BookOpen,
  Globe2,
  Sparkles,
  Clock,
  CheckCircle2,
} from "lucide-react";

const ROW_A = [
  { name: "Stanford", serif: true },
  { name: "Chicago", prefix: "The University of", serif: true },
  { name: "Duke", suffix: "UNIVERSITY", serif: true },
  { name: "TEXAS", prefix: "The University of", serif: false },
  { name: "Oxford", serif: true },
  { name: "Imperial", serif: true },
  { name: "MIT", serif: false, tracking: "tracking-[0.35em]" },
  { name: "Toronto", serif: true },
  { name: "Melbourne", serif: true },
  { name: "NUS", serif: false, tracking: "tracking-[0.28em]" },
];

const ROW_B = [
  { name: "TU Munich", serif: false },
  { name: "McGill", serif: true },
  { name: "UCL", serif: false, tracking: "tracking-[0.28em]" },
  { name: "Edinburgh", serif: true },
  { name: "Waterloo", serif: true },
  { name: "ANU", serif: false, tracking: "tracking-[0.28em]" },
  { name: "Tokyo", serif: true },
  { name: "UNSW", serif: false, tracking: "tracking-[0.25em]" },
  { name: "Manchester", serif: true },
  { name: "Heidelberg", serif: true },
];

interface Wordmark {
  name: string;
  prefix?: string;
  suffix?: string;
  serif?: boolean;
  tracking?: string;
}

function WordmarkItem({ uni }: { uni: Wordmark }) {
  return (
    <div className="flex h-11 shrink-0 items-center justify-center px-7 sm:h-12 sm:px-10">
      <div
        className={`flex flex-col items-center leading-none text-white/40 transition-colors duration-300 hover:text-white ${
          uni.serif ? "font-serif" : "font-sans"
        }`}
      >
        {uni.prefix && (
          <span className="mb-0.5 text-[8px] font-medium uppercase tracking-[0.2em]">
            {uni.prefix}
          </span>
        )}
        <span
          className={`text-[17px] font-semibold sm:text-[19px] ${uni.tracking ?? "tracking-tight"}`}
        >
          {uni.name}
        </span>
        {uni.suffix && (
          <span className="mt-0.5 text-[8px] font-medium uppercase tracking-[0.26em]">
            {uni.suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function UniRow({
  items,
  reverse,
  duration,
}: {
  items: Wordmark[];
  reverse?: boolean;
  duration: number;
}) {
  const loop = [...items, ...items];
  return (
    <div
      className="flex w-max items-center"
      style={{
        animation: `${reverse ? "live-uni-rev" : "live-uni"} ${duration}s linear infinite`,
      }}
    >
      {loop.map((uni, i) => (
        <WordmarkItem key={`${uni.name}-${i}`} uni={uni} />
      ))}
    </div>
  );
}

interface ActivityItem {
  name: string;
  flag: string;
  action: string;
  target: string;
  time: string;
  icon: ElementType;
  color: string;
}

const activityFeed: ActivityItem[] = [
  { name: "Rakibul H.", flag: "🇧🇩", action: "got accepted into", target: "University of Toronto", time: "Just now", icon: GraduationCap, color: "text-emerald-400" },
  { name: "Fatima A.", flag: "🇵🇰", action: "won a scholarship from", target: "DAAD Germany", time: "1 min ago", icon: Award, color: "text-amber-400" },
  { name: "Daniyal K.", flag: "🇮🇳", action: "booked a session with mentor", target: "Ayesha Rahman", time: "2 min ago", icon: Users, color: "text-sky-400" },
  { name: "Maria S.", flag: "🇳🇬", action: "submitted an application to", target: "TU Munich", time: "3 min ago", icon: BookOpen, color: "text-violet-400" },
  { name: "Tanvir I.", flag: "🇧🇩", action: "completed a roadmap step for", target: "UK Student Visa", time: "4 min ago", icon: CheckCircle2, color: "text-emerald-400" },
  { name: "Elena R.", flag: "🇵🇭", action: "got accepted into", target: "University of Melbourne", time: "5 min ago", icon: GraduationCap, color: "text-emerald-400" },
  { name: "Omar F.", flag: "🇪🇬", action: "won a scholarship from", target: "Chevening UK", time: "6 min ago", icon: Award, color: "text-amber-400" },
  { name: "Lina W.", flag: "🇻🇳", action: "booked a session with mentor", target: "Nafis Ahmed", time: "7 min ago", icon: Users, color: "text-sky-400" },
];

function useCountUp(end: number, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const stepTime = Math.max(Math.floor(duration / end), 10);
    const increment = Math.ceil(end / (duration / stepTime));
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [end, duration]);
  return count;
}

function StatCard({
  icon: Icon,
  value,
  label,
  live,
}: {
  icon: ElementType;
  value: string;
  label: string;
  live?: boolean;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.06]">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/20 to-sky-400/20 text-emerald-400">
          <Icon className="h-5 w-5" />
        </div>
        {live && (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            LIVE
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-bold text-white sm:text-3xl">{value}</p>
      <p className="mt-1 text-sm text-slate-400">{label}</p>
    </div>
  );
}

export default function LiveActivitySection() {
  const [onlineNow, setOnlineNow] = useState(2847);
  const applications = useCountUp(1284);
  const mentorSessions = useCountUp(392);
  const countriesActive = useCountUp(47);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineNow((prev) => Math.max(2000, prev + Math.floor(Math.random() * 7) - 3));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const loopedFeed = [...activityFeed, ...activityFeed];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-sky-500/15 blur-3xl" />

      <div className="relative px-6 pt-12 text-center sm:pt-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300/80">
          Students we guide get into
        </p>
        <p className="mt-1.5 text-sm text-slate-400">
          <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text font-bold text-transparent">
            500+ partner universities
          </span>{" "}
          across 50 countries
        </p>
      </div>

      <div
        className="live-uni-track relative mt-6"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="overflow-hidden">
          <UniRow items={ROW_A} duration={38} />
        </div>
        <div className="mt-0.5 overflow-hidden">
          <UniRow items={ROW_B} reverse duration={44} />
        </div>
      </div>

      <div className="relative mx-auto mt-10 h-px max-w-xs bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-10 sm:pb-24 sm:pt-12">
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-xs font-semibold tracking-wide text-emerald-300">
              LIVE RIGHT NOW
            </span>
          </div>
        </div>

        <h2 className="mt-5 text-center text-3xl font-bold tracking-tight text-white sm:text-5xl">
          Thousands of journeys.
          <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
            {" "}
            One happening right now.
          </span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-slate-400">
          Real students, real universities, real progress — updating in real time
          across PUB GradPath.
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-5 lg:gap-10">
          <div className="lg:col-span-3">
            <div className="relative h-[400px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-14 bg-gradient-to-b from-slate-950 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-14 bg-gradient-to-t from-slate-950 to-transparent" />

              <div className="animate-live-feed flex flex-col gap-3 p-5">
                {loopedFeed.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.04] p-4"
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 ${item.color}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="min-w-0 text-sm text-slate-300">
                        <span className="font-semibold text-white">
                          {item.flag} {item.name}
                        </span>{" "}
                        {item.action}{" "}
                        <span className="font-semibold text-white">{item.target}</span>
                      </p>
                      <span className="ml-auto flex shrink-0 items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3 w-3" /> {item.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:col-span-2">
            <StatCard icon={Users} value={onlineNow.toLocaleString()} label="Students online now" live />
            <StatCard icon={BookOpen} value={applications.toLocaleString() + "+"} label="Applications submitted today" />
            <StatCard icon={Sparkles} value={mentorSessions.toLocaleString() + "+"} label="Mentor sessions this week" />
            <StatCard icon={Globe2} value={countriesActive.toLocaleString()} label="Countries active right now" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes live-uni {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes live-uni-rev {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        @keyframes live-feed {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
        .live-uni-track:hover > div > div {
          animation-play-state: paused;
        }
        .animate-live-feed {
          animation: live-feed 22s linear infinite;
        }
        .animate-live-feed:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .live-uni-track > div > div,
          .animate-live-feed {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}