"use client";

import { ListState } from "@/components/shared/list-state";
import { ICalendarEvent } from "@/types/calendar.type";
import { CalendarDays } from "lucide-react";
import { dateKey, formatEventDateLabel } from "./calendar-date-utils";
import { CalendarEventItem } from "./calendar-event-item";

interface CalendarEventListProps {
  isLoading: boolean;
  isError: boolean;
  events: ICalendarEvent[];
}

export function CalendarEventList({ isLoading, isError, events }: CalendarEventListProps) {
  return (
    <ListState
      isLoading={isLoading}
      isError={isError}
      items={events}
      skeletonCount={4}
      skeletonClassName="h-16"
      emptyIcon={CalendarDays}
      emptyTitle="No upcoming events"
      emptyDescription="Deadlines, tasks, interviews and test dates will show up here."
      errorMessage="Failed to load your calendar."
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
          <div className="space-y-6">
            {Array.from(groups.entries()).map(([key, groupEvents]) => (
              <div key={key}>
                <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                  {formatEventDateLabel(groupEvents[0].start)}
                </h3>
                <div className="space-y-2">
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