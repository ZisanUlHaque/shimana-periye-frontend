"use client";

import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Star,
  GraduationCap,
  MapPin,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
  Video,
} from "lucide-react";

interface Mentor {
  id: number;
  name: string;
  role: string;
  university: string;
  location: string;
  flag: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  sessionsCount: number;
  tags: string[];
}

const mentors: Mentor[] = [
  {
    id: 1,
    name: "Ayesha Rahman",
    role: "MSc in Data Science",
    university: "University of Toronto",
    location: "Canada",
    flag: "🇨🇦",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    rating: 4.9,
    reviewsCount: 38,
    sessionsCount: 52,
    tags: ["Full Scholarship", "SOP Review"],
  },
  {
    id: 2,
    name: "Nafis Ahmed",
    role: "PhD in Computer Science",
    university: "Univ. of Manchester",
    location: "United Kingdom",
    flag: "🇬🇧",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    rating: 5.0,
    reviewsCount: 45,
    sessionsCount: 68,
    tags: ["Chevening Scholar", "Visa Guide"],
  },
  {
    id: 3,
    name: "Tania Sultana",
    role: "MSc in Automotive Eng.",
    university: "TU Munich",
    location: "Germany",
    flag: "🇩🇪",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
    rating: 4.9,
    reviewsCount: 29,
    sessionsCount: 41,
    tags: ["DAAD Scholar", "Zero Tuition"],
  },
  {
    id: 4,
    name: "Tanvir Alam",
    role: "MSc in Artificial Intelligence",
    university: "University of Melbourne",
    location: "Australia",
    flag: "🇦🇺",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    rating: 4.8,
    reviewsCount: 31,
    sessionsCount: 49,
    tags: ["Australia Awards", "PR Path"],
  },
  {
    id: 5,
    name: "Sarah Jenkins",
    role: "MBA Scholar",
    university: "Harvard University",
    location: "United States",
    flag: "🇺🇸",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
    rating: 5.0,
    reviewsCount: 62,
    sessionsCount: 94,
    tags: ["Full Fellowship", "Essay Review"],
  },
];

export default function MentorCardsSection() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeCardId, setActiveCardId] = useState<number>(2); // Default highlighted card like SS1

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = 320;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-sky-50/20 to-white py-24 sm:py-32">
      <div className="relative mx-auto max-w-7xl px-6">
        
        {/* Main 2-Column Layout matching SS1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Heading + Subtext + Arrow Controls */}
          <div className="lg:col-span-4 space-y-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-semibold text-emerald-800">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> VERIFIED MENTORS
            </span>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl leading-tight">
              Learn from mentors who’ve
              <span className="block bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
                walked your path.
              </span>
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              Get 1-on-1 advice, SOP review, and visa preparation from real Bangladeshi scholars studying at world-renowned universities.
            </p>

            {/* Nav Arrow Buttons (SS1 Style) */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => scroll("left")}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:bg-emerald-500 hover:text-white hover:border-emerald-500 hover:shadow-md active:scale-95"
                aria-label="Previous mentor"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:bg-emerald-500 hover:text-white hover:border-emerald-500 hover:shadow-md active:scale-95"
                aria-label="Next mentor"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Right Column: Horizontal Scrollable Cards Carousel (SS1 Style) */}
          <div className="lg:col-span-8 overflow-hidden">
            <div
              ref={sliderRef}
              className="flex gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth scrollbar-none snap-x"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {mentors.map((mentor) => {
                const isActive = activeCardId === mentor.id;

                return (
                  <div
                    key={mentor.id}
                    onClick={() => setActiveCardId(mentor.id)}
                    className={`group relative flex-none w-[280px] sm:w-[300px] snap-start rounded-3xl p-5 cursor-pointer transition-all duration-300 ${
                      isActive
                        ? "bg-slate-900 text-white shadow-2xl shadow-slate-900/30 ring-2 ring-emerald-400 scale-[1.02]"
                        : "bg-white text-slate-900 border border-slate-200/80 shadow-sm hover:border-emerald-300 hover:shadow-xl"
                    }`}
                  >
                    {/* Top Image Box with Play/Connect Icon Overlay */}
                    <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-slate-100">
                      <img
                        src={mentor.avatar}
                        alt={mentor.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Flag Badge */}
                      <span className="absolute top-3 left-3 text-2xl drop-shadow">
                        {mentor.flag}
                      </span>

                      {/* Video/Session Overlay Icon */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-emerald-600 shadow-lg backdrop-blur-sm">
                          <Video className="h-5 w-5 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-bold text-base ${isActive ? "text-white" : "text-slate-900"}`}>
                          {mentor.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span>{mentor.rating}</span>
                        </div>
                      </div>

                      <p className={`text-xs flex items-center gap-1.5 ${isActive ? "text-emerald-300" : "text-emerald-600 font-medium"}`}>
                        <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{mentor.role}</span>
                      </p>

                      <p className={`text-xs flex items-center gap-1.5 ${isActive ? "text-slate-400" : "text-slate-500"}`}>
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{mentor.university}</span>
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {mentor.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${
                              isActive
                                ? "bg-white/10 text-emerald-300"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            }`}
                          >
                            <CheckCircle2 className="h-3 w-3" /> {tag}
                          </span>
                        ))}
                      </div>

                      {/* Action Button */}
                      <div className="pt-3">
                        <button
                          className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-all ${
                            isActive
                              ? "bg-gradient-to-r from-emerald-400 to-sky-400 text-slate-950 font-bold shadow-md"
                              : "bg-slate-900 text-white hover:bg-emerald-600"
                          }`}
                        >
                          <MessageSquare className="h-3.5 w-3.5" /> Book Session
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}