import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  FileDown,
  FileSignature,
  FileText,
  Info,
  Layers,
  Search,
  Sparkles,
  XCircle,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GuideDocumentViewer } from "@/components/features/preparation-guides/guide-document-viewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import guidesData from "@/data/preparation-guides.json";

interface Props {
  params: Promise<{ id: string }>;
}

interface StructureItem {
  paragraph: string;
  purpose: string;
  example: string;
}

interface ComparisonItem {
  type: string;
  focus: string;
  coreQuestions: string[];
}

interface SectionItem {
  title: string;
  details: string;
}

interface GuideItem {
  title: string;
  description: string;
}

interface StepItem {
  stepNumber: string;
  title: string;
  instruction: string;
  examples?: string[];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const guide = guidesData.find((g) => g.id === id);

  if (!guide) {
    return { title: "Guide Not Found | PUB GradPath" };
  }

  return {
    title: `${guide.title} | PUB GradPath Preparation Guides`,
    description: guide.summary,
  };
}

const ACCENT_STYLES: Record<
  string,
  { badge: string; iconBg: string; border: string; lightBg: string }
> = {
  emerald: {
    badge:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    iconBg: "bg-emerald-500 text-white shadow-emerald-500/30",
    border: "border-emerald-500/30",
    lightBg: "bg-emerald-500/5",
  },
  blue: {
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    iconBg: "bg-blue-500 text-white shadow-blue-500/30",
    border: "border-blue-500/30",
    lightBg: "bg-blue-500/5",
  },
  purple: {
    badge:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    iconBg: "bg-purple-500 text-white shadow-purple-500/30",
    border: "border-purple-500/30",
    lightBg: "bg-purple-500/5",
  },
  amber: {
    badge:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    iconBg: "bg-amber-500 text-white shadow-amber-500/30",
    border: "border-amber-500/30",
    lightBg: "bg-amber-500/5",
  },
  cyan: {
    badge: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    iconBg: "bg-cyan-500 text-white shadow-cyan-500/30",
    border: "border-cyan-500/30",
    lightBg: "bg-cyan-500/5",
  },
};

export default async function GuideDetailPage({ params }: Props) {
  const { id } = await params;
  const guide = guidesData.find((g) => g.id === id);

  if (!guide) {
    notFound();
  }

  const currentIndex = guidesData.findIndex((g) => g.id === id);
  const prevGuide = currentIndex > 0 ? guidesData[currentIndex - 1] : null;
  const nextGuide =
    currentIndex < guidesData.length - 1 ? guidesData[currentIndex + 1] : null;

  const accent = ACCENT_STYLES[guide.accentColor] ?? ACCENT_STYLES.blue;

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

  const Icon = getIcon(guide.icon);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        {/* ── Breadcrumb & Back Link ── */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/preparation-guides"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to All Preparation Guides</span>
          </Link>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="size-3" />
            <Link href="/preparation-guides" className="hover:text-foreground">
              Guides
            </Link>
            <ChevronRight className="size-3" />
            <span className="text-foreground font-medium truncate max-w-[200px]">
              {guide.category}
            </span>
          </div>
        </div>

        {/* ── Hero Banner ── */}
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/95 to-primary/5 p-6 shadow-xs sm:p-10">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-md border px-2.5 py-0.5 text-xs font-semibold ${accent.badge}`}
              >
                {guide.category}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5">
                <Clock className="size-3" />
                {guide.readTime}
              </span>
              {guide.pdfUrl && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 flex items-center gap-1">
                  <FileDown className="size-3" />
                  PDF Included
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div
                className={`flex size-14 shrink-0 items-center justify-center rounded-2xl shadow-lg ${accent.iconBg}`}
              >
                <Icon className="size-7" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl text-foreground">
                  {guide.title}
                </h1>
                <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
                  {guide.summary}
                </p>
              </div>
            </div>

            {/* Quick Action Toolbar */}
            {guide.pdfUrl && (
              <div className="pt-3 border-t border-border/50 flex flex-wrap items-center gap-3">
                <a
                  href={guide.pdfUrl}
                  download={guide.pdfName || "document.pdf"}
                >
                  <Button
                    size="sm"
                    className="gap-2 rounded-xl h-10 px-4 text-xs font-bold bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:shadow-primary/30"
                  >
                    <Download className="size-3.5" />
                    <span>Download Official PDF ({guide.pdfName})</span>
                  </Button>
                </a>
                <a
                  href={guide.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 rounded-xl h-10 px-4 text-xs font-semibold hover:border-primary/50"
                  >
                    <ExternalLink className="size-3.5" />
                    <span>Open in New Tab</span>
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ── Official Attached Document Viewer (PDF Reader & Visual Sheets) ── */}
        <GuideDocumentViewer
          pdfUrl={guide.pdfUrl}
          pdfName={guide.pdfName}
          images={guide.images}
          title={guide.title}
        />

        {/* ── Definition & Core Purpose ── */}
        {guide.definition && (
          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 shadow-xs flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
              <Info className="size-4" />
              <span>Core Definition & Objective</span>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed font-medium">
              {guide.definition}
            </p>
            {guide.objective && (
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-2 border-t border-primary/15">
                <strong>Strategic Objective:</strong> {guide.objective}
              </p>
            )}
          </div>
        )}

        {/* ── Formatting Specifications ── */}
        {guide.formatting && (
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs">
            <h2 className="text-base sm:text-lg font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <CheckCircle2 className="size-5 text-emerald-500" />
              Official Formatting & Technical Requirements
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              {Object.entries(guide.formatting).map(([key, val]) => (
                <div
                  key={key}
                  className="rounded-2xl bg-muted/40 p-4 border border-border/50"
                >
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                  <span className="font-semibold text-foreground text-xs sm:text-sm leading-snug">
                    {String(val)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Practical Strategy Tips ── */}
        {guide.practicalTips && guide.practicalTips.length > 0 && (
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs">
            <h2 className="text-base sm:text-lg font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="size-5 text-amber-500" />
              Practical Execution Tips
            </h2>

            <ul className="space-y-3 text-xs sm:text-sm text-foreground/90">
              {guide.practicalTips.map((tip: string) => (
                <li
                  key={tip}
                  className="flex items-start gap-3 leading-relaxed"
                >
                  <CheckCircle2 className="size-4.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── LOR Structural Paragraph Architecture (with Full Real Examples) ── */}
        {guide.structure && (
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs">
            <div className="border-b border-border/60 pb-3 mb-5">
              <h2 className="text-base sm:text-lg font-bold text-foreground uppercase tracking-wider">
                Standard Recommendation Letter Architecture (5 Paragraphs)
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Complete paragraph-by-paragraph breakdown with approved academic
                phrasing.
              </p>
            </div>

            <div className="space-y-5">
              {(guide.structure as StructureItem[]).map((item) => (
                <div
                  key={item.paragraph}
                  className="rounded-2xl border border-border/60 bg-muted/20 p-5 space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-border/40 pb-2">
                    <span className="text-xs sm:text-sm font-bold text-primary">
                      {item.paragraph}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-medium">
                      {item.purpose}
                    </span>
                  </div>

                  <div className="rounded-xl bg-background/90 p-4 text-xs sm:text-sm italic text-foreground/90 border border-border/40 font-serif leading-relaxed">
                    "{item.example}"
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Motivation Letter vs SOP Comparison ── */}
        {guide.comparison && (
          <div className="grid md:grid-cols-2 gap-6">
            {(guide.comparison as ComparisonItem[]).map((comp) => (
              <div
                key={comp.type}
                className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">
                    {comp.type}
                  </span>
                  <p className="text-sm font-semibold text-foreground mb-4 leading-relaxed">
                    {comp.focus}
                  </p>

                  <div className="space-y-2.5 border-t border-border/60 pt-4 text-xs">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Core Questions Answered:
                    </span>
                    <ul className="space-y-2 text-muted-foreground">
                      {comp.coreQuestions.map((q: string) => (
                        <li key={q} className="flex items-start gap-2">
                          <span className="text-primary font-bold mt-0.5">
                            •
                          </span>
                          <span className="text-foreground/90 leading-relaxed font-medium">
                            {q}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Academic CV 13-Section Architecture ── */}
        {guide.sections && (
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs">
            <div className="border-b border-border/60 pb-3 mb-5">
              <h2 className="text-base sm:text-lg font-bold text-foreground uppercase tracking-wider">
                Academic CV Core Architecture (13 Sections)
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Every section required on an international curriculum vitae for
                fresh graduates and early-career researchers.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {(guide.sections as SectionItem[]).map((sec) => (
                <div
                  key={sec.title}
                  className="rounded-2xl bg-muted/30 p-4 border border-border/50 text-xs flex flex-col justify-between"
                >
                  <div>
                    <span className="font-bold text-foreground text-sm block mb-1">
                      {sec.title}
                    </span>
                    <p className="text-muted-foreground leading-relaxed text-xs">
                      {sec.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SOP Do's & Don'ts ── */}
        {guide.dos && guide.donts && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-6 sm:p-7">
              <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-4 flex items-center gap-2">
                <CheckCircle2 className="size-5" />
                Essential Do's (Inclusions)
              </h2>
              <div className="space-y-4">
                {(guide.dos as GuideItem[]).map((d) => (
                  <div key={d.title} className="text-xs">
                    <span className="font-bold text-foreground text-sm block">
                      {d.title}
                    </span>
                    <p className="text-muted-foreground mt-1 leading-relaxed text-xs">
                      {d.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-rose-500/30 bg-rose-500/5 p-6 sm:p-7">
              <h2 className="text-sm font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-4 flex items-center gap-2">
                <XCircle className="size-5" />
                Critical Don'ts (Avoid At All Costs)
              </h2>
              <div className="space-y-4">
                {(guide.donts as GuideItem[]).map((d) => (
                  <div key={d.title} className="text-xs">
                    <span className="font-bold text-foreground text-sm block">
                      {d.title}
                    </span>
                    <p className="text-muted-foreground mt-1 leading-relaxed text-xs">
                      {d.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Google Scholar Professor Matching Steps ── */}
        {guide.steps && (
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs">
            <div className="border-b border-border/60 pb-3 mb-5">
              <h2 className="text-base sm:text-lg font-bold text-foreground uppercase tracking-wider">
                5-Step Tactical Google Scholar Professor Matching
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Discover prospective graduate supervisors, active research
                trajectories, and laboratory funding.
              </p>
            </div>

            <div className="space-y-4">
              {(guide.steps as StepItem[]).map((st) => (
                <div
                  key={st.stepNumber}
                  className="rounded-2xl border border-border/60 bg-muted/20 p-4 sm:p-5 text-xs flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="rounded-md bg-primary text-primary-foreground text-xs font-bold px-2.5 py-0.5">
                      {st.stepNumber}
                    </span>
                    <span className="font-bold text-sm text-foreground">
                      {st.title}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-1">
                    {st.instruction}
                  </p>

                  {st.examples && (
                    <div className="flex flex-wrap gap-2 pt-1 pl-1">
                      {st.examples.map((ex: string) => (
                        <Badge
                          key={ex}
                          variant="secondary"
                          className="text-xs py-1"
                        >
                          {ex}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Important Author / Mentor Note ── */}
        {guide.authorNote && (
          <div className="rounded-2xl border border-border/80 bg-muted/40 p-5 text-xs sm:text-sm text-foreground/90 italic leading-relaxed">
            <strong>Mentor Advisory Note:</strong> {guide.authorNote}
          </div>
        )}

        {/* ── Bottom Prev / Next Navigation ── */}
        <div className="border-t border-border/60 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {prevGuide ? (
            <Link
              href={`/preparation-guides/${prevGuide.id}`}
              className="group flex flex-col items-start gap-1 p-3 rounded-2xl hover:bg-muted/40 transition-colors"
            >
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                <ArrowLeft className="size-3 group-hover:-translate-x-1 transition-transform" />
                Previous Guide
              </span>
              <span className="text-xs sm:text-sm font-bold text-foreground">
                {prevGuide.title}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextGuide ? (
            <Link
              href={`/preparation-guides/${nextGuide.id}`}
              className="group flex flex-col items-end gap-1 p-3 rounded-2xl hover:bg-muted/40 transition-colors sm:text-right"
            >
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                Next Guide
                <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="text-xs sm:text-sm font-bold text-foreground">
                {nextGuide.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>

        {/* ── Final Call to Action ── */}
        <div className="rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card/95 to-primary/10 p-8 text-center flex flex-col items-center gap-4 shadow-xs">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Sparkles className="size-6" />
          </div>
          <h3 className="text-xl font-bold text-foreground sm:text-2xl">
            Put This Guide Into Practice
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg leading-relaxed">
            Upload your document drafts in Document Studio for instant AI
            feedback, and connect with faculty mentors for 1-on-1 review.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/register">
              <Button className="h-10 px-5 rounded-xl text-xs font-bold shadow-md shadow-primary/25">
                Get Started Free
                <ArrowRight className="size-3.5 ml-1.5" />
              </Button>
            </Link>
            <Link href="/scholarships">
              <Button
                variant="outline"
                className="h-10 px-5 rounded-xl text-xs font-semibold"
              >
                Find Scholarships
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
