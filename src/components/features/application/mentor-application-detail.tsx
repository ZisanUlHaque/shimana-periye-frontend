"use client";

import { useState } from "react";
import {
  Calendar,
  Building2,
  FileText,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  User,
} from "lucide-react";
import { ApplicationStatusBadge, DecisionBadge } from "./application-status-badge";
import { MentorApplicationTaskList } from "@/components/features/application-task/mentor-application-task-list";
import { useGetApplicationForMentor } from "@/hooks";
import {
  useGetDocumentsForMentor,
  useUpdateVersionReviewStatus,
} from "@/hooks/document.hook";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const REVIEW_STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft", class: "bg-muted text-muted-foreground" },
  {
    value: "IN_REVIEW",
    label: "Under Review",
    class: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    value: "CHANGES_REQUESTED",
    label: "Changes Requested",
    class: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  {
    value: "APPROVED",
    label: "Approved",
    class: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
];

export function MentorApplicationDetail({ applicationId }: { applicationId: string }) {
  const { data, isLoading, isError } = useGetApplicationForMentor(applicationId);
  const application = data?.data;

  const { data: docsRes, isLoading: isDocsLoading } = useGetDocumentsForMentor(
    application?.studentProfileId,
    application?.id
  );
  const documents: any[] = docsRes?.data ?? [];

  const updateStatusMutation = useUpdateVersionReviewStatus();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const backendBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

  const getDownloadUrl = (docId: string, ver: any) => {
    if (!ver) return "#";
    return `${backendBaseUrl}/documents/${docId}/download?versionId=${ver.id}`;
  };

  const getViewUrl = (docId: string, ver: any) => {
    if (!ver) return "#";
    if (ver.directViewUrl) return ver.directViewUrl;
    return `${backendBaseUrl}/documents/${docId}/download?versionId=${ver.id}&view=true`;
  };

  const handleOpenPreview = (doc: any, ver: any) => {
    const url = getViewUrl(doc.id, ver);
    setPreviewUrl(url);
    setPreviewTitle(`${doc.type.replace(/_/g, " ")} (v${ver.versionNo})`);
    setPreviewOpen(true);
  };

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-2xl bg-muted/60" />;
  }

  if (isError || !application) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
        Failed to load this application.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── 1. Application Hero Banner ── */}
      <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Building2 className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground">
                  {application.opportunity?.title ?? "Untitled Opportunity"}
                </h2>
                <Badge variant="outline" className="text-[10px]">
                  {application.opportunity?.fieldOfStudy ?? "Graduate Program"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {application.opportunity?.university?.name ?? "Target University"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ApplicationStatusBadge status={application.status} />
            {application.decision && <DecisionBadge decision={application.decision} />}
          </div>
        </div>

        {application.interviewDate && (
          <div className="mt-4 flex gap-4 border-t border-border/60 pt-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
              <Calendar className="size-3.5 text-primary" />
              Admissions Interview:{" "}
              {new Date(application.interviewDate).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        )}
      </div>

      {/* ── 2. Mentee Documents Studio & Evaluation ── */}
      <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              Student Application Documents ({documents.length})
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Review mentee's SOP, CV, and research statement drafts. Set approval status.
            </p>
          </div>
        </div>

        {isDocsLoading ? (
          <div className="h-24 animate-pulse rounded-xl bg-muted/40" />
        ) : documents.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground border border-dashed rounded-xl p-6">
            No specific documents linked to this opportunity yet. The student can upload documents from their Document Studio.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {documents.map((doc) => {
              const latestVer = doc.versions?.[0] ?? doc.versions?.[doc.versions.length - 1];
              const currentStatus = latestVer?.reviewStatus ?? "DRAFT";

              return (
                <div
                  key={doc.id}
                  className="rounded-xl border border-border/60 bg-muted/20 p-4 flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-foreground uppercase tracking-wide">
                        {doc.type.replace(/_/g, " ")}
                      </span>
                      <span className="text-[10px] bg-muted px-2 py-0.5 rounded-md font-medium text-muted-foreground">
                        v{latestVer?.versionNo ?? 1}
                      </span>
                    </div>

                    <span className="text-[11px] text-muted-foreground mt-1 block">
                      Uploaded on{" "}
                      {latestVer?.uploadedAt
                        ? new Date(latestVer.uploadedAt).toLocaleDateString()
                        : "Recently"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-3">
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenPreview(doc, latestVer)}
                        className="h-7 text-xs gap-1 px-2 text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="size-3" />
                        Preview
                      </Button>
                      <a
                        href={getDownloadUrl(doc.id, latestVer)}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                        <Button variant="outline" size="sm" className="h-7 text-xs gap-1 px-2">
                          <Download className="size-3" />
                          Download
                        </Button>
                      </a>
                    </div>

                    {/* Change Review Status Selector */}
                    {latestVer && (
                      <select
                        value={currentStatus}
                        disabled={updateStatusMutation.isPending}
                        onChange={(e) =>
                          updateStatusMutation.mutate({
                            versionId: latestVer.id,
                            reviewStatus: e.target.value,
                          })
                        }
                        className="h-7 rounded-md border border-input bg-card px-2 text-[11px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        {REVIEW_STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 3. Application Checklist ── */}
      <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs">
        <h3 className="mb-3 text-sm font-bold text-foreground">Application Checklist Tasks</h3>
        <MentorApplicationTaskList applicationId={application.id} />
      </div>

      {/* ── 4. In-App Document Preview Modal ── */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl w-[95vw] h-[88vh] flex flex-col p-4">
          <DialogHeader className="flex flex-row items-center justify-between border-b border-border/60 pb-3">
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                {previewTitle}
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Mentee Document Review & Feedback Inspection
              </p>
            </div>
            <div className="flex items-center gap-2 pr-6">
              <a href={previewUrl} target="_blank" rel="noreferrer noopener">
                <Button size="sm" variant="outline" className="text-xs gap-1 h-8">
                  <ExternalLink className="size-3.5" />
                  Open in New Tab
                </Button>
              </a>
              <a href={previewUrl} download>
                <Button size="sm" className="text-xs gap-1 h-8">
                  <Download className="size-3.5" />
                  Download
                </Button>
              </a>
            </div>
          </DialogHeader>

          <div className="flex-1 w-full h-full min-h-[400px] bg-muted/20 rounded-xl overflow-hidden mt-2 border border-border/50">
            {previewUrl ? (
              <iframe
                src={previewUrl}
                title="Document Preview"
                className="w-full h-full border-0"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                Document preview not available.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
