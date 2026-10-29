"use client";

import { BookOpen, ExternalLink, Hash, Link2, Pencil, Trash2 } from "lucide-react";
import type { IPublication } from "@/types/publication.type";
import { PublicationDialog } from "./publication-dialog";
import { DeletePublicationDialog } from "./delete-publication-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PublicationCardProps {
  publication: IPublication;
}

export function PublicationCard({ publication }: PublicationCardProps) {
  const cleanDoi = publication.doi?.replace(/^https?:\/\/(dx\.)?doi\.org\//, "").trim();
  const doiUrl = cleanDoi
    ? publication.doi?.startsWith("http")
      ? publication.doi
      : `https://doi.org/${cleanDoi}`
    : null;

  return (
    <div className="group relative flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:border-border hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BookOpen className="size-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground line-clamp-2">
              {publication.title}
            </h3>
            <p className="truncate text-xs text-muted-foreground mt-0.5">
              {publication.venue ?? "Independent Publication"}
              {publication.year && ` • ${publication.year}`}
            </p>

            {publication.paperId && (
              <div className="mt-1.5 flex items-center gap-1.5">
                <Badge
                  variant="secondary"
                  className="text-[10px] font-mono px-2 py-0.5 bg-muted/60 text-muted-foreground border border-border/50"
                >
                  <Hash className="size-2.5 mr-0.5 opacity-70" />
                  ID: {publication.paperId}
                </Badge>
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <PublicationDialog
            publication={publication}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="size-7 text-muted-foreground hover:text-foreground"
              >
                <Pencil className="size-3.5" />
              </Button>
            }
          />
          <DeletePublicationDialog
            id={publication.id}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="size-7 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </Button>
            }
          />
        </div>
      </div>

      {/* Footer Links (DOI & Paper Link) */}
      {(doiUrl || publication.link) && (
        <div className="flex flex-wrap items-center gap-3 border-t border-border/60 pt-3 text-xs">
          {doiUrl && (
            <a
              href={doiUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 text-primary hover:underline font-mono text-[11px]"
            >
              <Link2 className="size-3 shrink-0" />
              <span>DOI: {cleanDoi}</span>
              <ExternalLink className="size-2.5 shrink-0 opacity-70" />
            </a>
          )}

          {publication.link && publication.link !== doiUrl && (
            <a
              href={publication.link}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground hover:underline"
            >
              <span className="truncate max-w-[240px]">
                {publication.link.replace(/^https?:\/\//, "")}
              </span>
              <ExternalLink className="size-3 shrink-0" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
