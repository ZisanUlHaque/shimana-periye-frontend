"use client";

import { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Upload,
} from "lucide-react";
import { useGetMyDocuments } from "@/hooks/document.hook";
import type { IDocument } from "@/types/document.type";
import { DocumentCard } from "./document-card";
import { DocumentUploadDialog } from "./document-upload-dialog";
import { ListState } from "@/components/shared/list-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FILTER_TABS = [
  { id: "ALL", label: "All Documents" },
  { id: "SOP", label: "Statement of Purpose" },
  { id: "CV", label: "CV / Resume" },
  { id: "RESEARCH_PROPOSAL", label: "Research Proposal" },
  { id: "RECOMMENDATION_LETTER", label: "Recommendation Letters" },
];

export function DocumentList() {
  const { data, isLoading, isError } = useGetMyDocuments();
  const documents: IDocument[] = data?.data ?? [];

  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Aggregate Metrics
  const totalCount = documents.length;
  const inReviewCount = documents.filter((d) => {
    const latest = d.versions?.[0] ?? d.versions?.[d.versions.length - 1];
    return latest?.reviewStatus === "SUBMITTED";
  }).length;
  const approvedCount = documents.filter((d) => {
    const latest = d.versions?.[0] ?? d.versions?.[d.versions.length - 1];
    return latest?.reviewStatus === "APPROVED";
  }).length;
  const draftCount = documents.filter((d) => {
    const latest = d.versions?.[0] ?? d.versions?.[d.versions.length - 1];
    return latest?.reviewStatus === "DRAFT" || !latest?.reviewStatus;
  }).length;

  const filteredDocuments = documents.filter((doc) => {
    const matchesTab = activeTab === "ALL" || doc.type === activeTab;
    const oppTitle = doc.application?.opportunity?.title ?? "";
    const matchesSearch =
      doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      oppTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* 4-Metric Studio Strip */}
      <div className="grid gap-3.5 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Documents</span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Layers className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {totalCount}
          </div>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">
            Across all target universities
          </span>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">In Review</span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Clock className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {inReviewCount}
          </div>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">
            Awaiting mentor evaluation
          </span>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Mentor Approved</span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {approvedCount}
          </div>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">
            Submission-ready standard
          </span>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Drafts & In-Progress</span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Sparkles className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {draftCount}
          </div>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">
            Ready for AI critique
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search documents or opportunities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 text-xs bg-card"
          />
        </div>
      </div>

      {/* Document Grid */}
      <ListState
        isLoading={isLoading}
        isError={isError}
        items={filteredDocuments}
        emptyIcon={FileText}
        emptyTitle={
          searchQuery || activeTab !== "ALL"
            ? "No matching documents"
            : "No documents in your studio yet"
        }
        emptyDescription={
          searchQuery || activeTab !== "ALL"
            ? "Try resetting your search query or switching categories."
            : "Upload your Statement of Purpose (SOP), CV, or Research Statement to receive mentor reviews and instant AI evaluations."
        }
        emptyAction={<DocumentUploadDialog />}
        errorMessage="Failed to load documents. Please try again."
      >
        {(items) => (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        )}
      </ListState>
    </div>
  );
}
