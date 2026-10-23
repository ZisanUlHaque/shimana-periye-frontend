"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import { UniversityCard } from "./university-card";
import { useUniversities } from "@/hooks/university.hook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListState } from "@/components/shared/list-state";

interface UniversityListProps {
  isAdmin?: boolean;
}

export function UniversityList({ isAdmin }: UniversityListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading, isError } = useUniversities({
    searchTerm: searchTerm || undefined,
    page,
    limit,
  });

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search universities..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setPage(1);
        }}
        className="max-w-sm"
      />

      <ListState
        isLoading={isLoading}
        isError={isError}
        items={data?.data ?? []}
        skeletonCount={6}
        skeletonClassName="h-24"
        emptyIcon={Building2}
        emptyTitle="No universities found"
        emptyDescription="Try adjusting your search or add a new university."
        errorMessage="Failed to load universities."
      >
        {(items) => (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((university) => (
              <UniversityCard key={university.id} university={university} isAdmin={isAdmin} />
            ))}
          </div>
        )}
      </ListState>

      {data && data.meta.totalPages > 1 ? (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {data.meta.page} of {data.meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= data.meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      ) : null}
    </div>
  );
}