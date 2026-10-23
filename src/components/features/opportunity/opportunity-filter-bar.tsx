"use client";

import { Input } from "@/components/ui/input";
import type { IOpportunityFilters, OpportunityType } from "@/types/opportunity.type";
import { useUniversities } from "@/hooks/university.hook";

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
  const { data: universitiesData } = useUniversities({ limit: 100 });

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        placeholder="Search by title or field of study..."
        value={filters.searchTerm ?? ""}
        onChange={(e) => onChange({ ...filters, searchTerm: e.target.value || undefined })}
        className="max-w-xs"
      />

      <select
        value={filters.type ?? ""}
        onChange={(e) => onChange({ ...filters, type: (e.target.value || undefined) as OpportunityType | undefined })}
        className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none"
      >
        {TYPE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={filters.universityId ?? ""}
        onChange={(e) => onChange({ ...filters, universityId: e.target.value || undefined })}
        className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none"
      >
        <option value="">All Universities</option>
        {universitiesData?.data.map((uni) => (
          <option key={uni.id} value={uni.id}>
            {uni.name}
          </option>
        ))}
      </select>

      <Input
        type="date"
        value={filters.deadlineFrom ?? ""}
        onChange={(e) => onChange({ ...filters, deadlineFrom: e.target.value || undefined })}
        className="w-auto"
        title="Deadline from"
      />
      <Input
        type="date"
        value={filters.deadlineTo ?? ""}
        onChange={(e) => onChange({ ...filters, deadlineTo: e.target.value || undefined })}
        className="w-auto"
        title="Deadline to"
      />
    </div>
  );
}