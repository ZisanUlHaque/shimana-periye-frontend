"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { IOpportunityFilters, OpportunityType } from "@/types/opportunity.type";

const TYPE_OPTIONS: { value: OpportunityType | ""; label: string }[] = [
  { value: "", label: "All Types" },
  { value: "PROGRAMME", label: "Programme" },
  { value: "PROFESSOR_OPENING", label: "Professor Opening" },
  { value: "LAB_POSITION", label: "Lab Position" },
  { value: "FUNDING", label: "Funding" },
];

interface OpportunityFilterBarProps {
  filters: IOpportunityFilters;
  onChange: (filters: IOpportunityFilters) => void;
}

export function OpportunityFilterBar({ filters, onChange }: OpportunityFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/70 bg-card p-3">
      <div className="relative min-w-[220px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search opportunities…"
          value={filters.searchTerm ?? ""}
          onChange={(e) => onChange({ ...filters, searchTerm: e.target.value || undefined })}
          className="pl-9"
        />
      </div>

      <select
        value={filters.type ?? ""}
        onChange={(e) =>
          onChange({ ...filters, type: (e.target.value || undefined) as OpportunityType | undefined })
        }
        className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        {TYPE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <Input
        placeholder="Field of study"
        value={filters.fieldOfStudy ?? ""}
        onChange={(e) => onChange({ ...filters, fieldOfStudy: e.target.value || undefined })}
        className="w-[180px]"
      />

      <Input
        placeholder="Country"
        value={filters.country ?? ""}
        onChange={(e) => onChange({ ...filters, country: e.target.value || undefined })}
        className="w-[150px]"
      />
    </div>
  );
}