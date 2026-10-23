"use client";

import { Compass } from "lucide-react";
import { useGetAllOpportunities } from "@/hooks/opportunity.hook";
import { OpportunityCard } from "./opportunity-card";
import { OpportunityDialog } from "./opportunity-dialog";
import type { IOpportunityFilters } from "@/types/opportunity.type";
import { ListState } from "@/components/shared/list-state.tsxlist-state";

interface OpportunityListProps {
  filters?: IOpportunityFilters;
  isAdmin?: boolean;
}

export function OpportunityList({ filters, isAdmin = false }: OpportunityListProps) {
  const { data, isLoading, isError } = useGetAllOpportunities(filters);
  const opportunities = data?.data ?? [];

  return (
    <ListState
      isLoading={isLoading}
      isError={isError}
      items={opportunities}
      emptyIcon={Compass}
      emptyTitle="No opportunities found"
      emptyDescription={
        isAdmin ? "Create your first opportunity to get started." : "Try adjusting your filters or check back later."
      }
      emptyAction={isAdmin ? <OpportunityDialog /> : undefined}
      errorMessage="Failed to load opportunities. Please try again."
    >
      {(items) => (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} isAdmin={isAdmin} />
          ))}
        </div>
      )}
    </ListState>
  );
}