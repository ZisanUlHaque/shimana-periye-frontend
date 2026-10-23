"use client";

import { useState } from "react";
import { OpportunityFilterBar } from "./opportunity-filter-bar";
import { OpportunityList } from "./opportunity-list";
import type { IOpportunityFilters } from "@/types/opportunity.type";

export function OpportunityBrowser({ isAdmin = false }: { isAdmin?: boolean }) {
  const [filters, setFilters] = useState<IOpportunityFilters>({});

  return (
    <div className="flex flex-col gap-4">
      <OpportunityFilterBar filters={filters} onChange={setFilters} />
      <OpportunityList filters={filters} isAdmin={isAdmin} />
    </div>
  );
}