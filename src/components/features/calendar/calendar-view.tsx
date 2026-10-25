"use client";

import { useMemo, useState } from "react";
import { useCalendarEvents } from "@/hooks/calendar.hook";
import { CalendarEventType } from "@/types/calendar.type";
import { ExportIcsButton } from "./export-ics-button";
import { CalendarEventList } from "./calendar-event-list";
import { CalendarTypeFilter } from "./calendar-type-filter";
import {
  CalendarDays,
  Clock,
  Video,
  Flag,
  ListChecks,
  Sparkles,
} from "lucide-react";

export function CalendarView() {
  const [typeFilter, setTypeFilter] = useState<CalendarEventType | "ALL">("ALL");
  const { data: events = [], isLoading, isError } = useCalendarEvents();

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    if (typeFilter === "ALL") return events;
    return events.filter((event) => event.type === typeFilter);
  }, [events, typeFilter]);

  // Aggregate metrics
  const totalEvents = events?.length ?? 0;
  const deadlinesCount =
    events?.filter(
      (e) =>
        e.type === "APPLICATION_DEADLINE" ||
        e.type === "OFFER_DEADLINE" ||
        e.type === "TEST_DATE"
    ).length ?? 0;
  const interviewCount =
    events?.filter(
      (e) => e.type === "MOCK_INTERVIEW" || e.type === "INTERVIEW"
    ).length ?? 0;
  const tasksCount =
    events?.filter(
      (e) =>
        e.type === "TASK" ||
        e.type === "OUTREACH_FOLLOWUP" ||
        e.type === "RECOMMENDATION_DEADLINE"
    ).length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      {/* ── 4-Card Summary Strip ── */}
      <div className="grid gap-3.5 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Milestones
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CalendarDays className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-foreground">
            {totalEvents}
          </div>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">
            Across active application cycle
          </span>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Deadlines & Tests
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
              <Flag className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-foreground">
            {deadlinesCount}
          </div>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">
            University & exam dates
          </span>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Mock & Interviews
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Video className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-foreground">
            {interviewCount}
          </div>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">
            Scheduled 1-on-1 sessions
          </span>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tasks & Follow-ups
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <ListChecks className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-foreground">
            {tasksCount}
          </div>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">
            Action items & LOR follow-ups
          </span>
        </div>
      </div>

      {/* ── Filter Tabs & Multi-Way Export Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <CalendarTypeFilter value={typeFilter} onChange={setTypeFilter} />
        <ExportIcsButton events={events} />
      </div>

      {/* ── Event List ── */}
      <CalendarEventList
        isLoading={isLoading}
        isError={isError}
        events={filteredEvents}
      />
    </div>
  );
}
