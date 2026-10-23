"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShortlistCard } from "./shortlist-card";
import { useMyShortlist } from "@/hooks/shortlist.hook";
import { ListState } from "@/components/shared/list-state.tsxlist-state";

const MAX_COMPARE = 5;
const MIN_COMPARE = 2;

export function ShortlistList() {
  const router = useRouter();
  const { data, isLoading, isError } = useMyShortlist();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (shortlistId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(shortlistId)) return prev.filter((x) => x !== shortlistId);
      if (prev.length >= MAX_COMPARE) return prev; // enforce backend max of 5
      return [...prev, shortlistId];
    });
  };

  const canCompare = selectedIds.length >= MIN_COMPARE && selectedIds.length <= MAX_COMPARE;

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 ? (
        <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5">
          <span className="text-sm font-medium text-foreground">
            {selectedIds.length} selected{" "}
            <span className="text-muted-foreground">(select {MIN_COMPARE}–{MAX_COMPARE} to compare)</span>
          </span>
          <Button
            size="sm"
            className="gap-1.5"
            disabled={!canCompare}
            onClick={() =>
              router.push(`/student/shortlist/compare?ids=${selectedIds.join(",")}`)
            }
          >
            <Scale className="size-3.5" />
            Compare
          </Button>
        </div>
      ) : null}

      <ListState
        isLoading={isLoading}
        isError={isError}
        items={data ?? []}
        skeletonCount={4}
        skeletonClassName="h-24"
        emptyIcon={Bookmark}
        emptyTitle="Your shortlist is empty"
        emptyDescription="Browse opportunities and shortlist the ones you're interested in."
        errorMessage="Failed to load your shortlist."
      >
        {(items) => (
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <ShortlistCard
                key={item.shortlistId}
                item={item}
                selected={selectedIds.includes(item.shortlistId)}
                onToggleSelect={toggleSelect}
              />
            ))}
          </div>
        )}
      </ListState>
    </div>
  );
}