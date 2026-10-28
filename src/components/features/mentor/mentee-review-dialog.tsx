"use client";

import { useState } from "react";
import {
  useGetDocumentsForMentor,
  useUpdateVersionReviewStatus,
  useCreateDocumentComment,
} from "@/hooks/document.hook";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Eye,
  Download,
  ExternalLink,
  MessageSquare,
  Send,
  Loader2,
  Clock,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { toast } from "@/components/ui/toast";

const REVIEW_STATUS_OPTIONS = [
  { value: "DRAFT", label: "Awaiting Review", badgeClass: "bg-muted text-muted-foreground" },
  {
    value: "IN_REVIEW",
    label: "Under Review",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    value: "CHANGES_REQUESTED",
    label: "Changes Requested",
    badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  {
    value: "APPROVED",
    label: "Mentor Approved",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
];

interface MenteeReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: {
    studentProfileId: string;
    studentUserId?: string;
    name: string;
    email: string;
    imageUrl?: string | null;
    applicationCount?: number;
    submittedApplicationCount?: number;
    documentsAwaitingReview?: number;
  } | null;
}

export function MenteeReviewDialog({
  open,
  onOpenChange,
  student,
}: MenteeReviewDialogProps) {
  const { data: docsRes, isLoading } = useGetDocumentsForMentor(
    student?.studentProfileId
  );
  const documents: any[] = docsRes?.data ?? [];

  const updateStatusMutation = useUpdateVersionReviewStatus();
  const createCommentMutation = useCreateDocumentComment();

  // Comment input state per version ID
  const [commentText, setCommentText] = useState<{ [versionId: string]: string }>({});
  // In-app preview modal state
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

  const handlePostComment = (versionId: string) => {
    const text = (commentText[versionId] || "").trim();
    if (!text) {
      toast.add({
        title: "Comment required",
        description: "Please type your review notes before posting.",
        type: "warning",
      });
      return;
    }

    createCommentMutation.mutate(
      { documentVersionId: versionId, comment: text },
      {
        onSuccess: () => {
          setCommentText((prev) => ({ ...prev, [versionId]: "" }));
        },
      }
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] flex flex-col p-6 overflow-hidden">
          <DialogHeader className="border-b border-border/60 pb-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="size-11 border border-border/70 shadow-xs">
                  <AvatarImage src={student?.imageUrl ?? undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                    {student?.name?.slice(0, 2).toUpperCase() || "ST"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-base font-bold text-foreground">
                    Review {student?.name}&apos;s Document Drafts
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                    {student?.email} • Inspect statements, assign review decisions, and provide direct feedback.
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Body: Scrollable Document List */}
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 py-2">
            {isLoading ? (
              <div className="flex flex-col gap-3 py-6">
                <Skeleton className="h-28 rounded-2xl" />
                <Skeleton className="h-28 rounded-2xl" />
              </div>
            ) : documents.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border/70 rounded-2xl bg-card">
                <FileText className="size-10 text-muted-foreground/60 mb-2" />
                <h4 className="text-sm font-semibold text-foreground">
                  No Documents Uploaded Yet
                </h4>
                <p className="text-xs text-muted-foreground max-w-sm mt-1">
                  {student?.name} has not uploaded any Statements of Purpose, CVs, or research drafts to review yet.
                </p>
              </div>
            ) : (
              documents.map((doc: any) => {
                const latestVer = doc.versions?.[0] || null;
                const currentStatus = latestVer?.reviewStatus ?? "DRAFT";
                const isStatusUpdating = updateStatusMutation.isPending;

                return (
                  <div
                    key={doc.id}
                    className="flex flex-col gap-3.5 rounded-2xl border border-border/70 bg-card p-4.5 shadow-xs hover:border-primary/40 transition-all"
                  >
                    {/* Top Row: Type, Version, and Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs">
                          v{latestVer?.versionNo ?? 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">
                              {doc.type.replace(/_/g, " ")}
                            </h4>
                            <Badge
                              variant="outline"
                              className={`text-[10px] px-1.5 py-0 font-medium ${
                                currentStatus === "APPROVED"
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                  : currentStatus === "CHANGES_REQUESTED" || currentStatus === "REVIEWED"
                                  ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                                  : currentStatus === "IN_REVIEW" || currentStatus === "SUBMITTED"
                                  ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                  : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                              }`}
                            >
                              {currentStatus}
                            </Badge>
                          </div>
                          <span className="text-[11px] text-muted-foreground mt-0.5 block">
                            Uploaded on{" "}
                            {latestVer?.uploadedAt
                              ? new Date(latestVer.uploadedAt).toLocaleString()
                              : "Recently"}
                          </span>
                        </div>
                      </div>

                      {/* Review Status Selector & Document Tools */}
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenPreview(doc, latestVer)}
                          className="h-8 text-xs gap-1 px-2.5 text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="size-3.5" />
                          Preview
                        </Button>

                        <a
                          href={getDownloadUrl(doc.id, latestVer)}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          <Button variant="outline" size="sm" className="h-8 text-xs gap-1 px-2.5">
                            <Download className="size-3.5" />
                            Download
                          </Button>
                        </a>

                        {latestVer && (
                          <div className="flex items-center gap-1.5 pl-1 border-l border-border/50">
                            <span className="text-[10px] text-muted-foreground font-semibold uppercase">
                              Status:
                            </span>
                            <select
                              value={currentStatus}
                              disabled={isStatusUpdating}
                              onChange={(e) =>
                                updateStatusMutation.mutate({
                                  versionId: latestVer.id,
                                  reviewStatus: e.target.value,
                                })
                              }
                              className="h-8 rounded-lg border border-input bg-card px-2.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                            >
                              {REVIEW_STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Feedback Comments History */}
                    {latestVer?.comments && latestVer.comments.length > 0 && (
                      <div className="flex flex-col gap-2 rounded-xl bg-muted/40 p-3 text-xs border border-border/50">
                        <div className="flex items-center gap-1.5 font-semibold text-foreground text-[11px]">
                          <MessageSquare className="size-3.5 text-primary" />
                          <span>Mentor Feedback Thread ({latestVer.comments.length})</span>
                        </div>

                        <div className="flex flex-col gap-1.5 pl-1">
                          {latestVer.comments.map((c: any) => (
                            <div
                              key={c.id}
                              className="rounded-lg bg-background p-2.5 text-xs border border-border/50 shadow-xs"
                            >
                              <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                                <span className="font-bold text-primary">
                                  {c.mentor?.name ?? "Academic Mentor"}
                                </span>
                                <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-foreground italic">&ldquo;{c.comment}&rdquo;</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* New Feedback Comment Box */}
                    {latestVer && (
                      <div className="mt-1 flex flex-col gap-2 rounded-xl border border-dashed border-border/70 p-3 bg-muted/20">
                        <label
                          htmlFor={`comment-${latestVer.id}`}
                          className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5"
                        >
                          <Sparkles className="size-3 text-primary" />
                          Leave Feedback Notes for Student on Version {latestVer.versionNo}:
                        </label>
                        <Textarea
                          id={`comment-${latestVer.id}`}
                          rows={2}
                          value={commentText[latestVer.id] || ""}
                          onChange={(e) =>
                            setCommentText((prev) => ({
                              ...prev,
                              [latestVer.id]: e.target.value,
                            }))
                          }
                          placeholder="e.g. Excellent introduction. Strengthen paragraph 3 by elaborating on your research publications and experimental methodologies..."
                          className="text-xs bg-background resize-none"
                        />
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            onClick={() => handlePostComment(latestVer.id)}
                            disabled={createCommentMutation.isPending}
                            className="h-8 text-xs gap-1.5 rounded-lg px-3 bg-primary text-primary-foreground shadow-xs"
                          >
                            {createCommentMutation.isPending ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Send className="size-3.5" />
                            )}
                            Post Feedback
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* In-App Document Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl w-[95vw] h-[88vh] flex flex-col p-4">
          <DialogHeader className="flex flex-row items-center justify-between border-b border-border/60 pb-3">
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                {previewTitle}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Mentee Document Review & Feedback Inspection
              </DialogDescription>
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
                Loading document preview...
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
