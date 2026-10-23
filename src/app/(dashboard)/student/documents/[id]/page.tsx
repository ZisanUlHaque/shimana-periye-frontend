"use client";

import { use } from "react";
import { useState } from "react";
import {
  useGetDocument,
  useGetAiFeedback,
  useAddNewDocumentVersion,
} from "@/hooks/document.hook";
import { PageHeader } from "@/components/layout/public/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  ExternalLink,
  Sparkles,
  Upload,
  MessageSquare,
  Loader2,
  Calendar,
} from "lucide-react";
import type { IDocumentVersion } from "@/types/document.type";

export default function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = useGetDocument(id);
  const document = data?.data;

  const { mutate: runAi, isPending: isAiPending, data: aiResult } =
    useGetAiFeedback();
  const { mutate: addVersion, isPending: isVersionPending } =
    useAddNewDocumentVersion();

  const [aiFeedbackText, setAiFeedbackText] = useState<string | null>(null);

  const versions: IDocumentVersion[] = document?.versions ?? [];
  const latestVersion = versions[versions.length - 1] ?? versions[0];

  const handleAiFeedback = () => {
    runAi(id, {
      onSuccess: (res: any) => {
        setAiFeedbackText(res?.data?.feedback ?? "Feedback generated.");
      },
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    addVersion({ documentId: id, file });
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <p className="text-sm text-destructive">Document not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        title={`${document.type.replace(/_/g, " ")} Details`}
        description={
          document.application?.opportunity?.title
            ? `Linked to: ${document.application.opportunity.title}`
            : "General Application Document"
        }
        action={
          <div className="flex items-center gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                disabled={isVersionPending}
              />
              <span className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-input bg-background px-3 text-xs font-medium shadow-xs hover:bg-accent hover:text-accent-foreground">
                {isVersionPending ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Upload className="size-3.5" />
                )}
                Upload New Version
              </span>
            </label>
            <Button
              size="sm"
              onClick={handleAiFeedback}
              disabled={isAiPending}
              className="gap-1.5"
            >
              {isAiPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Sparkles className="size-3.5" />
              )}
              Run AI Evaluation
            </Button>
          </div>
        }
      />

      {/* AI Feedback Banner / Result */}
      {(aiFeedbackText || (aiResult as any)?.data) && (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <Sparkles className="size-4" />
            <span>AI Document Evaluation</span>
          </div>
          <div className="mt-2 text-xs leading-relaxed text-foreground whitespace-pre-wrap">
            {aiFeedbackText || (aiResult as any)?.data?.feedback}
          </div>
        </div>
      )}

      {/* Latest Version Preview Box */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Current Version (v{latestVersion?.versionNo ?? 1})
              </h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="size-3" />
                Uploaded on{" "}
                {latestVersion?.uploadedAt
                  ? new Date(latestVersion.uploadedAt).toLocaleDateString()
                  : "Recently"}
              </p>
            </div>
          </div>
          {latestVersion?.fileUrl && (
            <a
              href={latestVersion.fileUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
            >
              <span>Download File</span>
              <ExternalLink className="size-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Version History & Comments */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-foreground">
          Version History ({versions.length})
        </h3>
        <div className="flex flex-col gap-3">
          {versions.map((ver) => (
            <div
              key={ver.id}
              className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">
                  Version {ver.versionNo}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {new Date(ver.uploadedAt).toLocaleString()}
                </span>
              </div>
              {ver.comments && ver.comments.length > 0 && (
                <div className="mt-2 flex flex-col gap-2 rounded-lg bg-muted/40 p-3">
                  <div className="flex items-center gap-1 text-xs font-medium text-foreground">
                    <MessageSquare className="size-3.5" />
                    <span>Mentor Comments ({ver.comments.length})</span>
                  </div>
                  {ver.comments.map((c) => (
                    <div key={c.id} className="text-xs text-muted-foreground pl-4">
                      "{c.comment}"
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
