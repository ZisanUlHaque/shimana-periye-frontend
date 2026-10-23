"use client";

import { CalendarEventType } from "@/types/calendar.type";
import { CALENDAR_EVENT_TYPE_META } from "./calendar-event-meta";

interface CalendarTypeFilterProps {
  value: CalendarEventType | "ALL";
  onChange: (value: CalendarEventType | "ALL") => void;
}

export function CalendarTypeFilter({ value, onChange }: CalendarTypeFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as CalendarEventType | "ALL")}
      className="h-9 rounded-md border border-input bg-background px-3 text-sm"
    >
      <option value="ALL">All types</option>
      {Object.entries(CALENDAR_EVENT_TYPE_META).map(([key, meta]) => (
        <option key={key} value={key}>
          {meta.label}
        </option>
      ))}
    </select>
  );
}