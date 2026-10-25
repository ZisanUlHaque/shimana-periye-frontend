import { Metadata } from "next";
import { OpportunityBrowser } from "@/components/features/opportunity/opportunity-browser";
import { PageHeader } from "@/components/layout/public/page-header";
import { GraduationCap, Sparkles, Search, Compass, Award } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Find Scholarships & Research Positions | ShimanaPeriye",
  description:
    "Explore fully funded graduate scholarships, doctoral fellowships, research assistantships, and global lab positions.",
};

export default function PublicScholarshipsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/95 to-primary/5 p-6 shadow-xs sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                  <GraduationCap className="size-3.5" />
                  Global Scholarship Directory
                </span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  Updated Daily
                </span>
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                Find Scholarships & Graduate Funding
              </h1>

              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                Discover fully-funded Masters & PhD opportunities, research assistantships (RA), and prestigious international fellowships across the US, Canada, Europe, and Asia.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/preparation-guides">
                <Button variant="outline" size="sm" className="gap-1.5 rounded-xl h-10 text-xs">
                  <Compass className="size-3.5" />
                  View Preparation Guides
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="gap-1.5 rounded-xl h-10 text-xs bg-primary shadow-md shadow-primary/25">
                  <Sparkles className="size-3.5" />
                  Track Applications Free
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Opportunity Explorer & Filter Bar */}
        <OpportunityBrowser />
      </div>
    </div>
  );
}
