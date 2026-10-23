"use client";

import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useAddToShortlist,
  useIsOpportunityShortlisted,
  useRemoveFromShortlist,
} from "@/hooks/shortlist.hook";
import { cn } from "@/lib/utils";

interface ShortlistButtonProps {
  opportunityId: string;
  variant?: "icon" | "full";
}

export function ShortlistButton({ opportunityId, variant = "full" }: ShortlistButtonProps) {
  const { isShortlisted, shortlistId, isLoading } = useIsOpportunityShortlisted(opportunityId);
  const { mutate: addMutate, isPending: isAdding } = useAddToShortlist();
  const { mutate: removeMutate, isPending: isRemoving } = useRemoveFromShortlist();

  const isPending = isAdding || isRemoving || isLoading;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isShortlisted && shortlistId) {
      removeMutate(shortlistId);
    } else {
      addMutate({ opportunityId });
    }
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={cn(
          "flex size-8 items-center justify-center rounded-full border transition-colors",
          isShortlisted
            ? "border-primary/30 bg-primary/10 text-primary"
            : "border-border/60 bg-background text-muted-foreground hover:text-foreground"
        )}
      >
        {isPending ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : isShortlisted ? (
          <BookmarkCheck className="size-4" />
        ) : (
          <Bookmark className="size-4" />
        )}
      </button>
    );
  }

  return (
    <Button
      variant={isShortlisted ? "secondary" : "outline"}
      className="gap-1.5"
      disabled={isPending}
      onClick={handleClick}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : isShortlisted ? (
        <BookmarkCheck className="size-4" />
      ) : (
        <Bookmark className="size-4" />
      )}
      {isShortlisted ? "Shortlisted" : "Add to Shortlist"}
    </Button>
  );
}