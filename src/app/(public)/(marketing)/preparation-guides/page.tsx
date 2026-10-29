import {
  BookOpen,
  Compass,
  FileCheck2,
  FileDown,
  FileSignature,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PreparationGuidesView } from "@/components/features/preparation-guides/preparation-guides-view";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Admissions Preparation Guides & Roadmaps | PUB GradPath",
  description:
    "Comprehensive academic preparation guides for Letters of Recommendation (LOR), Statement of Purpose (SOP), Motivation Letters, Academic CVs, and Google Scholar Professor Matching with downloadable PDF templates and verified layouts.",
};

const STATS = [
  {
    icon: BookOpen,
    label: "5 Masterclasses",
    desc: "LOR, SOP, CV & Outreach",
  },
  {
    icon: FileDown,
    label: "Official PDFs",
    desc: "Letterhead Ready Templates",
  },
  {
    icon: FileCheck2,
    label: "Admissions Standard",
    desc: "100% Academic Rigor",
  },
  {
    icon: Compass,
    label: "Free & Open Access",
    desc: "No Paywalls or Login Required",
  },
];

export default function PreparationGuidesPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
        {/* ── Premium Hero Section with Visual Graphic Banner ── */}
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/95 to-primary/10 p-6 sm:p-10 shadow-xs">
          {/* Subtle Ambient Background Gradients */}
          <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <Sparkles className="size-3.5" />
                  Academic Excellence Masterclasses
                </span>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  5 Downloadable PDF Templates
                </span>
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-foreground leading-[1.15]">
                Graduate Preparation Guides & Roadmaps
              </h1>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                Master the art of crafting persuasive Letters of Recommendation
                (LOR), distinguishing Motivation Letters from Statements of
                Purpose (SOP), structuring competitive Academic CVs, and
                scouting prospective research supervisors on Google Scholar.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/scholarships">
                  <Button
                    size="sm"
                    className="gap-2 rounded-xl h-11 px-5 text-xs font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all"
                  >
                    <GraduationCap className="size-4" />
                    Browse Scholarships
                  </Button>
                </Link>
                <a href="#masterclasses">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 rounded-xl h-11 px-5 text-xs font-semibold hover:border-primary/50"
                  >
                    <BookOpen className="size-4 text-primary" />
                    Explore Guides Below
                  </Button>
                </a>
              </div>
            </div>

            {/* Right Visual Image Banner */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border/80 bg-muted/40 shadow-xl group">
                <Image
                  src="/assets/guides/guide-hero.png"
                  alt="Academic Preparation Guides & Documents"
                  width={600}
                  height={350}
                  className="w-full h-auto object-cover max-h-[320px] transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent flex items-end p-4">
                  <div className="flex items-center gap-2 rounded-xl bg-card/90 backdrop-blur-md px-3 py-1.5 border border-border/80 shadow-md">
                    <FileSignature className="size-4 text-primary" />
                    <span className="text-xs font-bold text-foreground">
                      Verified Academic Samples & Blueprints
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-8 pt-6 border-t border-border/60 grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">
                      {stat.label}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {stat.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Interactive Masterclasses Section (Cards + Motion + Filter) ── */}
        <section id="masterclasses" className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                <BookOpen className="size-5 text-primary" />
                Featured Academic Masterclasses
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Click any guide to read in-depth paragraph-by-paragraph
                blueprints and view official document layouts.
              </p>
            </div>
          </div>

          <PreparationGuidesView />
        </section>

        {/* ── Bottom Call To Action Banner ── */}
        <div className="rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card/95 to-primary/10 p-8 text-center flex flex-col items-center gap-4 shadow-xs">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Sparkles className="size-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">
            Ready to Build Your Graduate Application Packet?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg leading-relaxed">
            Create your account to upload your SOP drafts, get instant AI
            evaluation feedback, track outreach logs to professors, and schedule
            1-on-1 mock interviews.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/register">
              <Button className="h-10 px-5 rounded-xl text-xs font-bold shadow-md shadow-primary/25">
                Get Started Free
              </Button>
            </Link>
            <Link href="/scholarships">
              <Button
                variant="outline"
                className="h-10 px-5 rounded-xl text-xs font-semibold"
              >
                Explore Open Scholarships
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
