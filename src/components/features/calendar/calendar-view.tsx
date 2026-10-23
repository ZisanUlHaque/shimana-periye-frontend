"use client";

import { useMemo, useState } from "react";
import { useCalendarEvents } from "@/hooks/calendar.hook";
import { CalendarEventType } from "@/types/calendar.type";
import { ExportIcsButton } from "./export-ics-button";
import { CalendarEventList } from "./calendar-event-list";
import { CalendarTypeFilter } from "./calendar-type-filter.tsxcalendar-type-filter";

export function CalendarView() {
  const [typeFilter, setTypeFilter] = useState<CalendarEventType | "ALL">("ALL");
  const { data: events, isLoading, isError } = useCalendarEvents();

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    if (typeFilter === "ALL") return events;
    return events.filter((event) => event.type === typeFilter);
  }, [events, typeFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <CalendarTypeFilter value={typeFilter} onChange={setTypeFilter} />
        <ExportIcsButton />
      </div>

      <CalendarEventList
        isLoading={isLoading}
        isError={isError}
        events={filteredEvents}
      />
    </div>
  );
}