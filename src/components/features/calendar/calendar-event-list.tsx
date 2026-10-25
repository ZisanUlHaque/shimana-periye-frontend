"use client";

import { ListState } from "@/components/shared/list-state";
import { ICalendarEvent } from "@/types/calendar.type";
import { CalendarDays, Calendar as CalendarIcon } from "lucide-react";
import { dateKey, formatEventDateLabel } from "./calendar-date-utils";
import { CalendarEventItem } from "./calendar-event-item";
import { Badge } from "@/components/ui/badge";

interface CalendarEventListProps {
  isLoading: boolean;
  isError: boolean;
  events: ICalendarEvent[];
}

export function CalendarEventList({
  isLoading,
  isError,
  events,
}: CalendarEventListProps) {
  return (
    <ListState
      isLoading={isLoading}
      isError={isError}
      items={events}
      skeletonCount={6}
      skeletonClassName="h-56 rounded-2xl"
      emptyIcon={CalendarDays}
      emptyTitle="No upcoming events"
      emptyDescription="Deadlines, tasks, interviews, and test dates will appear here as soon as they are scheduled."
      errorMessage="Failed to load your calendar schedule. Please try refreshing."
    >
      {(items) => {
        const sorted = [...items].sort(
          (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
        );

        const groups = new Map<string, ICalendarEvent[]>();
        for (const event of sorted) {
          const key = dateKey(event.start);
          if (!groups.has(key)) groups.set(key, []);
          groups.get(key)!.push(event);
        }

        const now = new Date();

        return (
          <div className="flex flex-col gap-8">
            {Array.from(groups.entries()).map(([key, groupEvents]) => (
              <div key={key} className="flex flex-col gap-3">
                <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                  <CalendarIcon className="size-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">
                    {formatEventDateLabel(groupEvents[0].start)}
                  </h3>
                  <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-4.5 font-medium">
                    {groupEvents.length} {groupEvents.length === 1 ? "Event" : "Events"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {groupEvents.map((event) => (
                    <CalendarEventItem
                      key={event.id}
                      event={event}
                      isPast={new Date(event.start) < now}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      }}
    </ListState>
  );
}
