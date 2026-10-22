import Link from "next/link";
import { ArrowRight, Sparkles, Lightbulb, Rocket, TrendingUp, Users } from "lucide-react";
import {
  LiveHeroCard,
  AnimatedStats,
  ValuesExperience,
} from "./AboutInteractive";

export const metadata = {
  title: "About Us | ShimanaPeriye",
  description:
    "The student-built platform helping thousands navigate universities, scholarships, visas and mentors — without the consultancy chaos.",
};

const timeline = [
  {
    icon: Lightbulb,
    tag: "THE SPARK",
    text: "A handful of admits compared notes and realised everyone was stuck on the same problems.",
  },
  {
    icon: Rocket,
    tag: "THE BUILD",
    text: "Roadmaps, mentor matching and deadline tracking — designed with students, not for a sales deck.",
  },
  {
    icon: TrendingUp,
    tag: "NOW",
    text: "Thousands of journeys on one platform, across 50+ countries. And we're just getting started.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-white pt-28 sm:pt-36">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            maskImage:
              "radial-gradient(ellipse at center, black, transparent 70%)",
          }}
        />
        <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-32 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 pb-24 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-semibold text-emerald-700">
              <Sparkles className="h-3.5 w-3.5" /> THE STORY
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Built by students who got tired of
              <span className="bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
                {" "}
                the maze.
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-slate-600">
              ShimanaPeriye started as a shared spreadsheet and a group chat.
              Today it&apos;s the all-in-one companion for universities,
              scholarships, mentors and visas — so no one has to figure it out
              alone.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-200"
              >
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Talk to us
              </Link>
            </div>
          </div>

          <LiveHeroCard />
        </div>
      </section>

      {/* ---------------- STATS ---------------- */}
      <section className="relative mx-auto max-w-6xl px-6 pb-24">
        <AnimatedStats />
      </section>

      {/* ---------------- TIMELINE ---------------- */}
      <section className="bg-gradient-to-b from-white to-emerald-50/40 py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Why we exist
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Studying abroad is hard.
              <br className="hidden sm:block" /> Finding clear help
              shouldn&apos;t be.
            </h2>
          </div>

          <div className="relative mt-16">
            <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-emerald-300 via-sky-300 to-transparent sm:left-1/2 sm:-translate-x-1/2" />

            <div className="space-y-10">
              {timeline.map((item, i) => {
                const Icon = item.icon;
                const isEven = i % 2 === 0;
                return (
                  <div
                    key={item.tag}
                    className={`relative flex flex-col gap-4 sm:flex-row sm:items-center ${
                      isEven ? "" : "sm:flex-row-reverse"
                    }`}
                  >
                    <div className="absolute left-6 z-10 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-emerald-500 to-sky-500 text-white shadow-lg sm:left-1/2">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="w-full pl-16 sm:w-1/2 sm:pl-0">
                      <div
                        className={`rounded-3xl border border-white bg-white/80 p-6 shadow-sm backdrop-blur transition-all hover:-translate-y-1 hover:shadow-lg ${
                          isEven ? "sm:mr-10" : "sm:ml-10"
                        }`}
                      >
                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                          0{i + 1} · {item.tag}
                        </p>
                        <p className="mt-2 text-sm text-slate-600">
                          {item.text}
                        </p>
                      </div>
                    </div>
                    <div className="hidden sm:block sm:w-1/2" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- VALUES (interactive) ---------------- */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              What we refuse to compromise on
            </h2>
            <p className="mt-3 text-slate-600">
              Four principles that shape every screen you see.
            </p>
          </div>
          <div className="mt-14">
            <ValuesExperience />
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="pb-28">
        <div className="mx-auto max-w-4xl px-6">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 px-8 py-14 text-center sm:px-16">
            <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-sky-400/10 blur-3xl" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/20 [animation-duration:10s] animate-ping" />

            <Users className="relative mx-auto h-8 w-8 text-emerald-400" />
            <h2 className="relative mt-4 text-3xl font-bold text-white sm:text-4xl">
              Your next chapter can start today.
            </h2>
            <p className="relative mx-auto mt-3 max-w-md text-sm text-slate-300">
              Create a roadmap, talk to a mentor, or just explore destinations
              — free to start.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-900/40"
              >
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 font-semibold text-white hover:bg-white/10"
              >
                Talk to us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}