"use client";

import { FlaskConical } from "lucide-react";
import { ListState } from "@/components/shared/list-state";
import { useLabs } from "@/hooks/lab.hook";
import type { ILab, ILabFilters } from "@/types/lab.type";
import { LabCard } from "./lab-card";
import { LabDialog } from "./lab-dialog";

interface LabListProps {
  filters?: ILabFilters;
  isAdmin?: boolean;
}

export function LabList({ filters, isAdmin = false }: LabListProps) {
  const { data, isLoading, isError } = useLabs(filters);
  const labs: ILab[] = data?.data ?? [];

  return (
    <ListState
      isLoading={isLoading}
      isError={isError}
      items={labs}
      emptyIcon={FlaskConical}
      emptyTitle="No labs found"
      emptyDescription={
        isAdmin
          ? "Add research laboratories to connect with opportunities."
          : "No laboratories match your query."
      }
      emptyAction={isAdmin ? <LabDialog /> : undefined}
      errorMessage="Failed to load labs. Please try again."
    >
      {(items) => (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((lab) => (
            <LabCard key={lab.id} lab={lab} isAdmin={isAdmin} />
          ))}
        </div>
      )}
    </ListState>
  );
}
