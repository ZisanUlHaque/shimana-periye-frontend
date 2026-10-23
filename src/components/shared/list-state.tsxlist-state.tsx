"use client";

import type { LucideIcon } from "lucide-react";

interface ListStateProps<T> {
  isLoading: boolean;
  isError: boolean;
  items: T[];
  skeletonCount?: number;
  skeletonClassName?: string;
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
  emptyAction?: React.ReactNode;
  errorMessage?: string;
  children: (items: T[]) => React.ReactNode;
}

export function ListState<T>({
  isLoading,
  isError,
  items,
  skeletonCount = 3,
  skeletonClassName = "h-24",
  emptyIcon: Icon,
  emptyTitle,
  emptyDescription,
  emptyAction,
  errorMessage = "Failed to load. Please try again.",
  children,
}: ListStateProps<T>) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div key={i} className={`animate-pulse rounded-2xl bg-muted/60 ${skeletonClassName}`} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
        {errorMessage}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/70 py-14 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="size-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{emptyTitle}</p>
          <p className="text-xs text-muted-foreground">{emptyDescription}</p>
        </div>
        {emptyAction}
      </div>
    );
  }

  return <>{children(items)}</>;
}