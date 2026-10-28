"use client";

import Link from "next/link";
import {
  FileText,
  ExternalLink,
  Sparkles,
  Trash2,
  Download,
  Calendar,
  Building2,
  Clock,
  CheckCircle2,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import type { IDocument } from "@/types/document.type";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useDeleteDocument } from "@/hooks/document.hook";
import { useState } from "react";

const REVIEW_STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string; dotClass: string }
> = {
  DRAFT: {
    label: "Draft",
    badgeClass: "bg-muted text-muted-foreground border-border",
    dotClass: "bg-muted-foreground",
  },
  IN_REVIEW: {
    label: "Under Review",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    dotClass: "bg-blue-500",
  },
  SUBMITTED: {
    label: "Under Review",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    dotClass: "bg-blue-500",
  },
  CHANGES_REQUESTED: {
    label: "Changes Requested",
    badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    dotClass: "bg-purple-500",
  },
  REVIEWED: {
    label: "Feedback Ready",
    badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    dotClass: "bg-purple-500",
  },
  APPROVED: {
    label: "Approved",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    dotClass: "bg-emerald-500",
  },
};

const TYPE_ICONS: Record<string, string> = {
  SOP: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  CV: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  RESEARCH_PROPOSAL: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  TRANSCRIPT: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  RECOMMENDATION_LETTER: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  OTHER: "bg-primary/10 text-primary",
};

export function DocumentCard({ document }: { document: IDocument }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: deleteDoc, isPending } = useDeleteDocument();

  const versions = document.versions ?? [];
  const latestVersion = versions[0] ?? versions[versions.length - 1];
  const versionCount = versions.length > 0 ? versions.length : 1;

  const backendBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

  const downloadUrl = `${backendBaseUrl}/documents/${document.id}/download${
    latestVersion?.id ? `?versionId=${latestVersion.id}` : ""
  }`;

  const statusStyle =
    REVIEW_STATUS_CONFIG[latestVersion?.reviewStatus ?? "DRAFT"] ??
    REVIEW_STATUS_CONFIG.DRAFT;

  const iconClass =
    TYPE_ICONS[document.type] ?? "bg-primary/10 text-primary";

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:border-border hover:shadow-md">
      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={`flex size-11 shrink-0 items-center justify-center rounded-xl font-bold ${iconClass}`}
            >
              <FileText className="size-5" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-foreground">
                {document.type.replace(/_/g, " ")}
              </h3>
              <p className="truncate text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                {document.application?.opportunity?.title ? (
                  <>
                    <Building2 className="size-3 shrink-0" />
                    <span className="truncate">
                      {document.application.opportunity.title}
                    </span>
                  </>
                ) : (
                  "General Academic Portfolio"
                )}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <AlertDialogTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Document</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to permanently delete this document and all its revision history?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      deleteDoc(document.id, {
                        onSuccess: () => setDeleteOpen(false),
                      })
                    }
                    disabled={isPending}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isPending ? "Deleting..." : "Delete Permanently"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Middle Stats Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${statusStyle.badgeClass}`}
          >
            <span className={`size-1.5 rounded-full ${statusStyle.dotClass}`} />
            {statusStyle.label}
          </span>

          <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            Version {latestVersion?.versionNo ?? 1} ({versionCount} total)
          </span>

          {latestVersion?.uploadedAt && (
            <span className="text-[11px] text-muted-foreground ml-auto flex items-center gap-1">
              <Calendar className="size-3" />
              {new Date(latestVersion.uploadedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border/60 pt-3">
        <a
          href={downloadUrl}
          target="_blank"
          rel="noreferrer noopener"
          download
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <Download className="size-3.5" />
            <span>Download</span>
          </Button>
        </a>

        <Link href={`/student/documents/${document.id}`}>
          <Button
            size="sm"
            className="h-8 gap-1.5 text-xs bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
          >
            <Sparkles className="size-3 text-amber-300" />
            <span>Studio & AI Critique</span>
            <ArrowRight className="size-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
