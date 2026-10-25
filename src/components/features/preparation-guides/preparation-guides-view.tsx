"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileDown,
  FileSignature,
  FileText,
  Layers,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import guidesData from "@/data/preparation-guides.json";

const CATEGORY_TABS = [
  { id: "all", label: "All Masterclasses" },
  { id: "lor", label: "Letter of Recommendation (LOR)" },
  { id: "essays", label: "SOP & Motivation Letters" },
  { id: "cv", label: "Academic CV" },
  { id: "professors", label: "Professor Discovery" },
];

const ACCENT_STYLES: Record<
  string,
  {
    badge: string;
    iconBg: string;
    glow: string;
    borderHover: string;
    gradient: string;
  }
> = {
  emerald: {
    badge:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    iconBg: "bg-emerald-500 text-white shadow-emerald-500/30",
    glow: "group-hover:shadow-emerald-500/10",
    borderHover: "hover:border-emerald-500/40",
    gradient: "from-emerald-500/20 via-transparent to-transparent",
  },
  blue: {
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    iconBg: "bg-blue-500 text-white shadow-blue-500/30",
    glow: "group-hover:shadow-blue-500/10",
    borderHover: "hover:border-blue-500/40",
    gradient: "from-blue-500/20 via-transparent to-transparent",
  },
  purple: {
    badge:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    iconBg: "bg-purple-500 text-white shadow-purple-500/30",
    glow: "group-hover:shadow-purple-500/10",
    borderHover: "hover:border-purple-500/40",
    gradient: "from-purple-500/20 via-transparent to-transparent",
  },
  amber: {
    badge:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    iconBg: "bg-amber-500 text-white shadow-amber-500/30",
    glow: "group-hover:shadow-amber-500/10",
    borderHover: "hover:border-amber-500/40",
    gradient: "from-amber-500/20 via-transparent to-transparent",
  },
  cyan: {
    badge: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    iconBg: "bg-cyan-500 text-white shadow-cyan-500/30",
    glow: "group-hover:shadow-cyan-500/10",
    borderHover: "hover:border-cyan-500/40",
    gradient: "from-cyan-500/20 via-transparent to-transparent",
  },
};

export function PreparationGuidesView() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGuides = guidesData.filter((guide) => {
    const matchesCategory =
      activeCategory === "all" || guide.categoryKey === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "FileSignature":
        return FileSignature;
      case "Layers":
        return Layers;
      case "FileText":
        return FileText;
      case "Award":
        return Award;
      case "Search":
        return Search;
      default:
        return BookOpen;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* ── Filter & Search Toolbar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`relative rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBadge"
                    className="absolute inset-0 bg-primary rounded-xl shadow-xs"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides & templates..."
            className="w-full rounded-xl border border-border/80 bg-background pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/70 focus:outline-hidden focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* ── Guides Card Grid with Framer Motion ── */}
      <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredGuides.map((guide, index) => {
            const Icon = getIcon(guide.icon);
            const accent =
              ACCENT_STYLES[guide.accentColor] ?? ACCENT_STYLES.blue;

            return (
              <motion.div
                key={guide.id}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.96 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card shadow-xs hover:shadow-2xl ${accent.glow} ${accent.borderHover} transition-all duration-300`}
              >
                {/* ── Card Header Media Strip ── */}
                <div className="relative h-44 w-full overflow-hidden bg-muted/40">
                  {guide.coverImage ? (
                    <div className="relative h-full w-full">
                      <Image
                        src={guide.coverImage}
                        alt={guide.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-black/20" />
                    </div>
                  ) : (
                    <div
                      className={`h-full w-full bg-gradient-to-br ${accent.gradient} flex items-center justify-center`}
                    >
                      <Icon className="size-16 opacity-20 text-foreground" />
                    </div>
                  )}

                  {/* Top Floating Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                    <span
                      className={`rounded-full border backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold shadow-xs ${accent.badge} bg-background/85`}
                    >
                      {guide.category}
                    </span>

                    <span className="flex items-center gap-1 rounded-full border border-border/60 bg-background/85 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-muted-foreground shadow-xs">
                      <Clock className="size-3" />
                      {guide.readTime}
                    </span>
                  </div>

                  {/* Icon Avatar Floating at Bottom Edge */}
                  <div className="absolute -bottom-3 left-5 z-10 flex size-11 items-center justify-center rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <div
                      className={`flex size-full items-center justify-center rounded-2xl ${accent.iconBg}`}
                    >
                      <Icon className="size-5" />
                    </div>
                  </div>

                  {/* PDF Download Indicator Pill */}
                  {guide.pdfUrl && (
                    <div className="absolute bottom-2 right-3 z-10 flex items-center gap-1 rounded-md bg-foreground/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-background shadow-xs">
                      <FileDown className="size-3 text-emerald-400" />
                      <span>PDF Template</span>
                    </div>
                  )}
                </div>

                {/* ── Card Content Body ── */}
                <div className="flex flex-col flex-1 p-6 pt-5">
                  <Link
                    href={`/preparation-guides/${guide.id}`}
                    className="group-hover:text-primary transition-colors"
                  >
                    <h3 className="text-base font-bold text-foreground leading-snug line-clamp-2">
                      {guide.title}
                    </h3>
                  </Link>

                  <p className="mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed flex-1">
                    {guide.summary}
                  </p>

                  {/* Document & Sample Evidence Row */}
                  <div className="mt-4 pt-3 border-t border-border/50 flex flex-wrap items-center gap-2">
                    {guide.images && guide.images.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                        <Eye className="size-3" />
                        {guide.images.length} verified layout
                        {guide.images.length > 1 ? "s" : ""}
                      </span>
                    )}

                    {guide.formatting && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="size-3 text-emerald-500" />
                        PDF Standard
                      </span>
                    )}
                  </div>
                </div>

                {/* ── Card Bottom Dual Actions ── */}
                <div className="px-6 pb-6 pt-1 flex items-center gap-2">
                  <Link
                    href={`/preparation-guides/${guide.id}`}
                    className="flex-1"
                  >
                    <Button
                      size="sm"
                      className="w-full gap-1.5 rounded-xl h-9 text-xs font-bold bg-primary text-primary-foreground shadow-xs hover:shadow-md transition-all group-hover:gap-2"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="size-3.5 transition-transform" />
                    </Button>
                  </Link>

                  {guide.pdfUrl && (
                    <a
                      href={guide.pdfUrl}
                      download={guide.pdfName || "document.pdf"}
                      title="Download Official Sample PDF Template"
                      className="shrink-0"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-9 px-3 rounded-xl gap-1.5 text-xs font-semibold hover:border-primary/50 hover:bg-primary/5"
                      >
                        <Download className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="hidden sm:inline">PDF</span>
                      </Button>
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredGuides.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border/80 p-12 text-center flex flex-col items-center gap-3">
          <BookOpen className="size-10 text-muted-foreground/60" />
          <h3 className="text-base font-bold text-foreground">
            No preparation guides matched your criteria
          </h3>
          <p className="text-xs text-muted-foreground">
            Try adjusting your search terms or select "All Masterclasses".
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setActiveCategory("all");
              setSearchQuery("");
            }}
            className="mt-2 rounded-xl text-xs"
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
