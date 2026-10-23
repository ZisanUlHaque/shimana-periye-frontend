"use client";

import { GraduationCap } from "lucide-react";
import { useProfessors } from "@/hooks/professor.hook";
import type { IProfessor, IProfessorFilters } from "@/types/professor.type";
import { ProfessorCard } from "./professor-card";
import { ProfessorDialog } from "./professor-dialog";
import { ListState } from "@/components/shared/list-state";

interface ProfessorListProps {
  filters?: IProfessorFilters;
  isAdmin?: boolean;
}

export function ProfessorList({
  filters,
  isAdmin = false,
}: ProfessorListProps) {
  const { data, isLoading, isError } = useProfessors(filters);
  const professors: IProfessor[] = data?.data ?? [];

  return (
    <ListState
      isLoading={isLoading}
      isError={isError}
      items={professors}
      emptyIcon={GraduationCap}
      emptyTitle="No professors found"
      emptyDescription={
        isAdmin
          ? "Add professor profiles to link opportunities and openings."
          : "No professors match your criteria."
      }
      emptyAction={isAdmin ? <ProfessorDialog /> : undefined}
      errorMessage="Failed to load professors. Please try again."
    >
      {(items) => (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((prof) => (
            <ProfessorCard key={prof.id} professor={prof} isAdmin={isAdmin} />
          ))}
        </div>
      )}
    </ListState>
  );
}
