"use client";

import { useState } from "react";
import {
  useGetDocument,
  useGetAiFeedback,
  useAddNewDocumentVersion,
} from "@/hooks/document.hook";
import { PageHeader } from "@/components/layout/public/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  ExternalLink,
  Sparkles,
  Upload,
  MessageSquare,
  Loader2,
  Calendar,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  History,
  Building2,
  Maximize2,
} from "lucide-react";
import type { IDocumentVersion } from "@/types/document.type";

const STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string; icon: any }
> = {
  DRAFT: {
    label: "Draft",
    badgeClass: "bg-muted text-muted-foreground border-border",
    icon: Clock,
  },
  SUBMITTED: {
    label: "Awaiting Mentor Review",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    icon: Clock,
  },
  REVIEWED: {
    label: "Feedback Provided",
    badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    icon: MessageSquare,
  },
  APPROVED: {
    label: "Mentor Approved",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    icon: CheckCircle2,
  },
};

export function DocumentDetailView({ documentId }: { documentId: string }) {
  const { data, isLoading } = useGetDocument(documentId);
  const document = data?.data;

  const { mutate: runAi, isPending: isAiPending, data: aiResult } =
    useGetAiFeedback();
  const { mutate: addVersion, isPending: isVersionPending } =
    useAddNewDocumentVersion();

  const [aiFeedbackText, setAiFeedbackText] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [previewTitle, setPreviewTitle] = useState<string>("");

  const versions: any[] = document?.versions ?? [];
  const latestVersion = versions[0] ?? null;

  const backendBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

  const getDownloadUrl = (ver: any) => {
    if (!ver) return "#";
    if (ver.directDownloadUrl) return ver.directDownloadUrl;
    return `${backendBaseUrl}/documents/${documentId}/download?versionId=${ver.id}`;
  };

  const getViewUrl = (ver: any) => {
    if (!ver) return "#";
    if (ver.directViewUrl) return ver.directViewUrl;
    return `${backendBaseUrl}/documents/${documentId}/download?versionId=${ver.id}&view=true`;
  };

  const handleOpenPreview = (ver: any) => {
    const url = getViewUrl(ver);
    setPreviewUrl(url);
    setPreviewTitle(`${document?.type?.replace(/_/g, " ")} (v${ver.versionNo})`);
    setPreviewOpen(true);
  };

  const handleAiFeedback = () => {
    runAi(documentId, {
      onSuccess: (res: any) => {
        setAiFeedbackText(res?.data?.feedback ?? "AI evaluation complete.");
      },
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    addVersion({ documentId, file });
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-12 text-center">
        <AlertCircle className="size-12 text-destructive/80 mb-3" />
        <h3 className="text-lg font-semibold text-foreground">Document Not Found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          The requested document could not be located or may have been deleted.
        </p>
      </div>
    );
  }

  const statusConfig =
    STATUS_CONFIG[latestVersion?.reviewStatus ?? "DRAFT"] ?? STATUS_CONFIG.DRAFT;
  const StatusIcon = statusConfig.icon;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              <FileText className="size-3.5" />
              Document Studio
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${statusConfig.badgeClass}`}
            >
              <StatusIcon className="size-3" />
              {statusConfig.label}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {document.type.replace(/_/g, " ")}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
            {document.application?.opportunity?.title ? (
              <>
                <Building2 className="size-3.5" />
                Linked to {document.application.opportunity.title} (
                {document.application.opportunity.university?.name ?? "Target University"})
              </>
            ) : (
              "General Academic Portfolio Document"
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              disabled={isVersionPending}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isVersionPending}
              className="gap-1.5 text-xs h-9 pointer-events-none"
            >
              {isVersionPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Upload className="size-3.5" />
              )}
              Upload New Revision
            </Button>
          </label>

          <Button
            size="sm"
            onClick={handleAiFeedback}
            disabled={isAiPending}
            className="gap-1.5 text-xs h-9 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
          >
            {isAiPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Sparkles className="size-3.5 text-amber-300" />
            )}
            Run AI Evaluation
          </Button>
        </div>
      </div>

      {/* Main Grid: Active Version Hero & AI Panel */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Active Document Showcase & Viewer */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Active Version Card */}
          <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <FileText className="size-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-foreground">
                      Version {latestVersion?.versionNo ?? 1} (Latest Revision)
                    </h2>
                    <Badge variant="outline" className="text-[10px] font-semibold px-2 py-0">
                      Active
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <Calendar className="size-3 text-muted-foreground/80" />
                    Uploaded on{" "}
                    {latestVersion?.uploadedAt
                      ? new Date(latestVersion.uploadedAt).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "Recently"}
                  </p>
                </div>
              </div>

              {/* Action Buttons for Document */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenPreview(latestVersion)}
                  className="gap-1.5 text-xs h-9"
                >
                  <Eye className="size-3.5" />
                  View Preview
                </Button>
                {latestVersion?.fileUrl && (
                  <a
                    href={getDownloadUrl(latestVersion)}
                    target="_blank"
                    rel="noreferrer noopener"
                    download
                  >
                    <Button
                      size="sm"
                      className="gap-1.5 text-xs h-9 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
                    >
                      <Download className="size-3.5" />
                      Download File
                    </Button>
                  </a>
                )}
              </div>
            </div>

            {/* Quick Metadata Pill Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-xl bg-muted/40 p-3.5 border border-border/50 text-xs">
              <div>
                <span className="text-muted-foreground text-[11px] block">File Type</span>
                <span className="font-semibold text-foreground uppercase">
                  {latestVersion?.mimeType?.split("/")[1] ?? "PDF / DOC"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground text-[11px] block">Review State</span>
                <span className="font-semibold text-foreground">
                  {statusConfig.label}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground text-[11px] block">Total Revisions</span>
                <span className="font-semibold text-foreground">
                  {versions.length} Version{versions.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          {/* AI Feedback Banner */}
          {(aiFeedbackText || (aiResult as any)?.data) && (
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
                    <Sparkles className="size-4" />
                  </div>
                  <span>AI Academic Evaluation & Critique</span>
                </div>
                <Badge variant="outline" className="border-primary/30 text-primary text-[10px]">
                  GradPath AI Engine
                </Badge>
              </div>
              <div className="rounded-xl bg-background/80 p-4 border border-border/60 text-xs leading-relaxed text-foreground whitespace-pre-wrap font-sans">
                {aiFeedbackText || (aiResult as any)?.data?.feedback}
              </div>
            </div>
          )}

          {/* Version History List */}
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <History className="size-4 text-primary" />
                Revision History ({versions.length})
              </h3>
              <span className="text-xs text-muted-foreground">
                All uploaded revisions are preserved
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {versions.map((ver, idx) => {
                const verStatus =
                  STATUS_CONFIG[ver.reviewStatus ?? "DRAFT"] ?? STATUS_CONFIG.DRAFT;
                const isCurrent = idx === 0;

                return (
                  <div
                    key={ver.id}
                    className={`flex flex-col gap-3 rounded-2xl border p-4.5 transition-all ${
                      isCurrent
                        ? "border-primary/40 bg-card shadow-xs ring-1 ring-primary/20"
                        : "border-border/60 bg-card/60 hover:border-border"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-9 items-center justify-center rounded-xl font-bold text-xs ${
                            isCurrent
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          v{ver.versionNo}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-foreground">
                              Version {ver.versionNo}
                            </span>
                            {isCurrent && (
                              <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                                Current
                              </Badge>
                            )}
                            <span
                              className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${verStatus.badgeClass}`}
                            >
                              {verStatus.label}
                            </span>
                          </div>
                          <span className="text-[11px] text-muted-foreground mt-0.5 block">
                            Uploaded on {new Date(ver.uploadedAt).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenPreview(ver)}
                          className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="size-3" />
                          View
                        </Button>
                        <a
                          href={getDownloadUrl(ver)}
                          target="_blank"
                          rel="noreferrer noopener"
                          download
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs gap-1"
                          >
                            <Download className="size-3" />
                            Download
                          </Button>
                        </a>
                      </div>
                    </div>

                    {/* Mentor Comments Section */}
                    {ver.comments && ver.comments.length > 0 && (
                      <div className="mt-1 flex flex-col gap-2 rounded-xl bg-muted/40 p-3.5 border border-border/50">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                          <MessageSquare className="size-3.5 text-primary" />
                          <span>Mentor Feedback ({ver.comments.length})</span>
                        </div>
                        <div className="flex flex-col gap-2 pl-2">
                          {ver.comments.map((c: any) => (
                            <div
                              key={c.id}
                              className="rounded-lg bg-background/80 p-2.5 text-xs text-foreground border border-border/40"
                            >
                              <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                                <span className="font-semibold text-primary">
                                  {c.mentor?.name ?? "Academic Mentor"}
                                </span>
                                <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="italic text-foreground/90">"{c.comment}"</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Guidance & Document Quality Checklist */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs flex flex-col gap-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <FileCheck className="size-4 text-primary" />
              Document Best Practices
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Top global graduate admissions committees evaluate your application documents against rigorous academic standards:
            </p>

            <ul className="flex flex-col gap-3 text-xs text-foreground/90">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-500 mt-0.5" />
                <span>
                  <strong>Specific Alignment:</strong> Reference exact faculty, labs, and prospective graduate curriculum.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-500 mt-0.5" />
                <span>
                  <strong>Quantifiable Impact:</strong> Highlight published papers, GPA, metrics, and technical contributions in your CV.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-500 mt-0.5" />
                <span>
                  <strong>Iterative Review:</strong> Request mentor feedback on draft versions before final university submission.
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs flex flex-col gap-3">
            <h3 className="text-sm font-bold text-foreground">Need Urgent Document Review?</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Book a 1-on-1 mock interview or draft review session with an expert mentor who specializes in your target academic discipline.
            </p>
            <a href="/student/mentors">
              <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 mt-1">
                Browse Verified Mentors
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* PDF / Document In-App Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl w-[95vw] h-[88vh] flex flex-col p-4">
          <DialogHeader className="flex flex-row items-center justify-between border-b border-border/60 pb-3">
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                {previewTitle}
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                In-app document inspection & preview
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
