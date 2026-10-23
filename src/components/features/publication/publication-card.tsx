"use client";

import { BookOpen, ExternalLink, Pencil, Trash2 } from "lucide-react";
import type { IPublication } from "@/types/publication.type";
import { PublicationDialog } from "./publication-dialog";
import { DeletePublicationDialog } from "./delete-publication-dialog";
import { Button } from "@/components/ui/button";

interface PublicationCardProps {
  publication: IPublication;
}

export function PublicationCard({ publication }: PublicationCardProps) {
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

      {publication.link && (
        <div className="flex items-center gap-1.5 border-t border-border/60 pt-3 text-xs">
          <a
            href={publication.link}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <span className="truncate max-w-[320px]">
              {publication.link.replace(/^https?:\/\//, "")}
            </span>
            <ExternalLink className="size-3 shrink-0" />
          </a>
        </div>
      )}
    </div>
  );
}
