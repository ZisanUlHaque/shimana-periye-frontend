"use client";

import { Search, GraduationCap, Globe, Award, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Image with Higher Education theme */}
<div
  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: "url('/hero.jpeg')",
  }}
/>

      {/* Cinematic Gradient Overlays */}

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-4 pt-32 pb-20 sm:px-6 lg:px-8 text-center">
        {/* Floating Tag Badges for Desktop */}
        <div className="absolute top-36 left-[8%] hidden lg:block animate-pulse">
          <div className="relative flex flex-col items-center">
            <div className="h-2 w-2 rounded-full bg-blue-400 shadow-lg ring-4 ring-blue-400/30" />
            <div className="h-5 w-px bg-white/40" />
            <div className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-md">
              🎓 Global Universities
            </div>
          </div>
        </div>

        <div className="absolute top-28 right-[32%] hidden lg:block animate-pulse">
          <div className="relative flex flex-col items-center">
            <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg ring-4 ring-emerald-400/30" />
            <div className="h-5 w-px bg-white/40" />
            <div className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-md">
              💰 Full Scholarships
            </div>
          </div>
        </div>

        <div className="absolute top-44 right-[6%] hidden lg:block animate-pulse">
          <div className="relative flex flex-col items-center">
            <div className="h-2 w-2 rounded-full bg-violet-400 shadow-lg ring-4 ring-violet-400/30" />
            <div className="h-5 w-px bg-white/40" />
            <div className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-md">
              🤝 1-on-1 Mentorship
            </div>
          </div>
        </div>

        {/* Welcome Pill */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-md sm:mb-6 sm:px-5 sm:py-2 sm:text-sm">
          <span>✨</span>
          <span>Welcome to ShimanaPeriye</span>
        </div>

        {/* Main Heading */}
        <h1 className="max-w-4xl text-3xl font-extrabold tracking-tight text-white drop-shadow-2xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
          Cross Borders. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-300 via-white to-blue-200 bg-clip-text text-transparent">
            Build Your Global Future.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 max-w-2xl text-sm text-slate-200 drop-shadow-md sm:mt-6 sm:text-base lg:text-lg leading-relaxed">
          Your all-in-one higher study platform. Discover worldwide universities, track scholarship deadlines, and prepare applications with verified mentor guidance.
        </p>

        {/* Call to Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link href="/register" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto h-12 rounded-2xl px-8 font-semibold shadow-lg shadow-primary/30"
            >
              Start Free Assessment <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
          <Link href="/universities" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-12 rounded-2xl border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:text-white px-8 font-semibold"
            >
              Explore Universities
            </Button>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4 border-t border-white/15 pt-8 w-full max-w-3xl">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">500+</div>
            <div className="text-xs text-slate-300 mt-1">Partner Universities</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">$12M+</div>
            <div className="text-xs text-slate-300 mt-1">Scholarships Tracked</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">98%</div>
            <div className="text-xs text-slate-300 mt-1">Visa Success Rate</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">250+</div>
            <div className="text-xs text-slate-300 mt-1">Verified Mentors</div>
          </div>
        </div>
      </div>
    </section>
  );
}
