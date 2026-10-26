"use client";

import {
  AlertCircle,
  Award,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck,
  FileText,
  GraduationCap,
  Layers,
  ListChecks,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { RequirementDialog } from "@/components/features/requirement/requirement-dialog";
import { PageHeader } from "@/components/layout/public/page-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useOpportunities } from "@/hooks/opportunity.hook";
import {
  useDeleteRequirement,
  useRequirements,
} from "@/hooks/requirement.hook";
import { useDebounce } from "@/hooks/use-debounce";
import type { IOpportunity, OpportunityType } from "@/types/opportunity.type";
import type { IRequirement, RequirementType } from "@/types/requirement.type";

const TYPE_LABELS: Record<OpportunityType, string> = {
  PROGRAMME: "Programme",
  PROFESSOR_OPENING: "Prof Opening",
  LAB_POSITION: "Lab Position",
  FUNDING: "Scholarship / Funding",
};

export default function AdminRequirementsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<
    string | null
  >(null);

  const debouncedSearch = useDebounce(searchTerm, 350);

  const { data: oppsRes, isLoading: isOppsLoading } = useOpportunities({
    limit: 100,
  });

  const opportunities: IOpportunity[] = oppsRes?.data ?? [];

  // Filter opportunities
  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesType = selectedType === "ALL" || opp.type === selectedType;
    if (!matchesType) return false;

    if (!debouncedSearch) return true;
    const q = debouncedSearch.toLowerCase();
    const titleMatch = opp.title.toLowerCase().includes(q);
    const fieldMatch = opp.fieldOfStudy?.toLowerCase().includes(q);
    const uniMatch = opp.university?.name.toLowerCase().includes(q);

    return titleMatch || fieldMatch || uniMatch;
  });

  // Effective selected opportunity
  const activeOpportunity =
    opportunities.find((o) => o.id === selectedOpportunityId) ||
    filteredOpportunities[0] ||
    null;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full animate-in fade-in-50 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <PageHeader
            title="Requirements & Eligibility Matrix"
            description="Configure GPA minimums, standardized test cutoffs (IELTS, TOEFL, GRE), and degree benchmarks for opportunities."
          />
        </div>
        <Link href="/admin/opportunities">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs rounded-xl h-9"
          >
            <Compass className="size-3.5 text-primary" />
            Catalog Overview
          </Button>
        </Link>
      </div>

      {/* Two-Column Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Opportunity Selector */}
        <div className="lg:col-span-5 flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">
                Select Opportunity
              </h3>
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {filteredOpportunities.length} of {opportunities.length}
            </span>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by title, university, field..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 text-xs bg-background"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {(["ALL", "FUNDING", "PROGRAMME", "LAB_POSITION"] as const).map(
                (t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedType(t)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      selectedType === t
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {t === "ALL"
                      ? "All"
                      : TYPE_LABELS[t as OpportunityType] || t}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Opportunity List */}
          <div className="flex flex-col gap-2 max-h-[620px] overflow-y-auto pr-1">
            {isOppsLoading ? (
              <div className="flex flex-col gap-2 py-2">
                {[
                  "skel-o-1",
                  "skel-o-2",
                  "skel-o-3",
                  "skel-o-4",
                  "skel-o-5",
                ].map((k) => (
                  <Skeleton key={k} className="h-20 rounded-xl" />
                ))}
              </div>
            ) : filteredOpportunities.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
                <AlertCircle className="size-6 text-muted-foreground/60" />
                <span>No opportunities match your search query.</span>
              </div>
            ) : (
              filteredOpportunities.map((opp) => {
                const isSelected = activeOpportunity?.id === opp.id;

                return (
                  <button
                    key={opp.id}
                    type="button"
                    onClick={() => setSelectedOpportunityId(opp.id)}
                    className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all duration-150 ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/20"
                        : "border-border/60 bg-card hover:bg-muted/40 hover:border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-xs text-foreground line-clamp-1 leading-snug">
                        {opp.title}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[9px] px-1.5 py-0 shrink-0 font-medium ${
                          isSelected
                            ? "border-primary/40 bg-primary/10 text-primary font-bold"
                            : ""
                        }`}
                      >
                        {TYPE_LABELS[opp.type] || opp.type}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Building2 className="size-3 shrink-0 text-muted-foreground/80" />
                      <span className="truncate">
                        {opp.university?.name ?? "Global"}
                      </span>
                      <span>·</span>
                      <span className="truncate text-foreground/80 font-medium">
                        {opp.fieldOfStudy}
                      </span>
                    </div>

                    {opp.deadline && (
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground/75 mt-0.5">
                        <Clock className="size-2.5" />
                        <span>
                          Deadline:{" "}
                          {new Date(opp.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Requirements Editor */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {activeOpportunity ? (
            <OpportunityRequirementsDetail opportunity={activeOpportunity} />
          ) : (
            <div className="rounded-2xl border border-dashed border-border/80 bg-card p-12 text-center flex flex-col items-center justify-center gap-3">
              <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <ListChecks className="size-6" />
              </div>
              <h3 className="text-sm font-bold text-foreground">
                No opportunity selected
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                Select an opportunity from the list on the left to configure or
                inspect its eligibility requirements.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Detail Pane for Selected Opportunity Requirements ──
function OpportunityRequirementsDetail({
  opportunity,
}: {
  opportunity: IOpportunity;
}) {
  const { data, isLoading } = useRequirements(opportunity.id);
  const requirements: IRequirement[] = data?.data ?? [];
  const { mutate: deleteReq, isPending: isDeleting } = useDeleteRequirement(
    opportunity.id,
  );

  const getRequirementIcon = (type: RequirementType) => {
    switch (type) {
      case "MIN_GPA":
        return Award;
      case "TEST_IELTS":
      case "TEST_TOEFL":
      case "TEST_GRE":
      case "TEST_GMAT":
        return FileCheck;
      case "DEGREE_LEVEL":
        return GraduationCap;
      case "WORK_EXPERIENCE":
        return Briefcase;
      case "PUBLICATION_COUNT":
        return FileText;
      default:
        return CheckCircle2;
    }
  };

  const formatRequirementType = (type: RequirementType) => {
    switch (type) {
      case "MIN_GPA":
        return "Minimum GPA Benchmark";
      case "TEST_IELTS":
        return "IELTS Language Cutoff";
      case "TEST_TOEFL":
        return "TOEFL Language Cutoff";
      case "TEST_GRE":
        return "GRE Standardized Score";
      case "TEST_GMAT":
        return "GMAT Exam Cutoff";
      case "DEGREE_LEVEL":
        return "Degree Prerequisite";
      case "WORK_EXPERIENCE":
        return "Work / Professional Experience";
      case "PUBLICATION_COUNT":
        return "Research Publications";
      case "DOCUMENT_REQUIRED":
        return "Mandatory Document";
      default:
        return "General Eligibility Requirement";
    }
  };

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm flex flex-col gap-6">
      {/* Opportunity Overview Banner */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border/60 pb-5">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[11px] font-semibold">
              {TYPE_LABELS[opportunity.type] || opportunity.type}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Building2 className="size-3" />
              {opportunity.university?.name ?? "—"}
            </span>
          </div>

          <h2 className="text-lg font-bold text-foreground leading-snug mt-1">
            {opportunity.title}
          </h2>

          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
            <span className="font-medium text-foreground">
              {opportunity.fieldOfStudy}
            </span>
            {opportunity.deadline && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="size-3 text-muted-foreground" />
                  Deadline:{" "}
                  {new Date(opportunity.deadline).toLocaleDateString()}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Add Requirement Dialog Button */}
        <div className="shrink-0">
          <RequirementDialog
            opportunityId={opportunity.id}
            trigger={
              <Button
                size="sm"
                className="gap-1.5 text-xs rounded-xl h-9 bg-primary shadow-xs"
              >
                <Plus className="size-4" />
                Add Requirement
              </Button>
            }
          />
        </div>
      </div>

      {/* Requirements List */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListChecks className="size-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">
              Configured Eligibility Criteria ({requirements.length})
            </h3>
          </div>
          <span className="text-xs text-muted-foreground">
            {requirements.length === 0
              ? "None configured"
              : `${requirements.length} rules active`}
          </span>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-2.5">
            {["skel-r-1", "skel-r-2", "skel-r-3"].map((k) => (
              <Skeleton key={k} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : requirements.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 p-8 text-center flex flex-col items-center justify-center gap-3">
            <div className="size-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <ListChecks className="size-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">
                No eligibility requirements specified yet
              </p>
              <p className="text-[11px] text-muted-foreground max-w-sm mt-0.5">
                Students will see this opportunity as having no special score or
                degree prerequisites. Add criteria to help scholars verify their
                eligibility.
              </p>
            </div>
            <RequirementDialog
              opportunityId={opportunity.id}
              trigger={
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs rounded-lg mt-1"
                >
                  <Plus className="size-3.5" />
                  Define Criteria Now
                </Button>
              }
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {requirements.map((req) => {
              const Icon = getRequirementIcon(req.type);

              return (
                <div
                  key={req.id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 hover:border-primary/40 hover:bg-card transition-all duration-150"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                      <Icon className="size-4" />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-foreground">
                          {formatRequirementType(req.type)}
                        </span>
                        {req.minValue !== null &&
                          req.minValue !== undefined && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] font-mono px-2 py-0 bg-primary/10 text-primary border border-primary/20"
                            >
                              Min: {req.minValue}
                            </Badge>
                          )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {req.detail}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                    {/* Edit Requirement */}
                    <RequirementDialog
                      opportunityId={opportunity.id}
                      requirement={req}
                      trigger={
                        <Button
                          variant="ghost"
                          size="sm"
                          className="size-8 p-0 text-muted-foreground hover:text-foreground rounded-lg"
                          title="Edit requirement"
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                      }
                    />

                    {/* Delete Requirement with Alert */}
                    <AlertDialog>
                      <AlertDialogTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="sm"
                            className="size-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                            title="Delete requirement"
                            disabled={isDeleting}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        }
                      />
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-destructive flex items-center gap-2">
                            Delete requirement?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove this &ldquo;
                            {formatRequirementType(req.type)}&rdquo; rule? This
                            criterion will no longer be considered during
                            candidate eligibility matching.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteReq(req.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Yes, Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
