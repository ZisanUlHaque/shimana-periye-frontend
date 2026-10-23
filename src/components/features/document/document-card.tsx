"use client";

import Link from "next/link";
import { FileText, ExternalLink, Sparkles, Trash2 } from "lucide-react";
import type { IDocument } from "@/types/document.type";
import { Button } from "@/components/ui/button";
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

const REVIEW_STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  SUBMITTED: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  REVIEWED: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  APPROVED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

export function DocumentCard({ document }: { document: IDocument }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: deleteDoc, isPending } = useDeleteDocument();

  const latestVersion =
    document.versions?.[document.versions.length - 1] ?? document.versions?.[0];
  const versionCount = document.versions?.length ?? 1;

  return (
    <div className="group relative flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:border-border hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileText className="size-5" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-foreground">
              {document.type.replace(/_/g, " ")}
            </h3>
            <p className="truncate text-xs text-muted-foreground mt-0.5">
              {document.application?.opportunity?.title ?? "General Document"} · Version {latestVersion?.versionNo ?? 1}
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
                  className="size-7 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Document</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this document and all its versions?
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
                  {isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-3">
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
            REVIEW_STATUS_STYLES[latestVersion?.reviewStatus ?? "DRAFT"]
          }`}
        >
          {latestVersion?.reviewStatus ?? "DRAFT"}
        </span>

        <div className="flex items-center gap-2">
          {latestVersion?.fileUrl && (
            <a
              href={latestVersion.fileUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <span>View</span>
              <ExternalLink className="size-3" />
            </a>
          )}
          <Link
            href={`/student/documents/${document.id}`}
            className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/20"
          >
            <Sparkles className="size-3" />
            <span>AI Review ({versionCount}v)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
