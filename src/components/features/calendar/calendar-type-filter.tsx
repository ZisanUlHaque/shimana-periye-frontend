"use client";

import { CalendarEventType } from "@/types/calendar.type";
import { CALENDAR_EVENT_TYPE_META } from "./calendar-event-meta";

interface CalendarTypeFilterProps {
  value: CalendarEventType | "ALL";
  onChange: (value: CalendarEventType | "ALL") => void;
}

export function CalendarTypeFilter({ value, onChange }: CalendarTypeFilterProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
      <button
        type="button"
        onClick={() => onChange("ALL")}
        className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
          value === "ALL"
            ? "bg-primary text-primary-foreground shadow-xs"
            : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
      >
        All Deadlines & Events
      </button>

      {Object.entries(CALENDAR_EVENT_TYPE_META).map(([key, meta]) => {
        const Icon = meta.icon;
        const isSelected = value === key;

        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key as CalendarEventType)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              isSelected
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className="size-3.5" />
            <span>{meta.label}</span>
          </button>
        );
      })}
    </div>
  );
}
