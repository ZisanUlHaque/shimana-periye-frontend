"use client";

import { ICalendarEvent } from "@/types/calendar.type";
import { CALENDAR_EVENT_TYPE_META } from "./calendar-event-meta";
import { cn } from "@/lib/utils";
import { formatEventTime } from "./calendar-date-utils";

interface CalendarEventItemProps {
  event: ICalendarEvent;
  isPast?: boolean;
}

export function CalendarEventItem({ event, isPast }: CalendarEventItemProps) {
  const meta = CALENDAR_EVENT_TYPE_META[event.type];
  const Icon = meta?.icon;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-border/60 bg-card p-3",
        isPast && "opacity-60"
      )}
      style={{ borderLeftColor: event.color, borderLeftWidth: 3 }}
    >
      <div
        className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md"
        style={{ backgroundColor: `${event.color}1A`, color: event.color }}
      >
        {Icon ? <Icon className="size-4" /> : null}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-foreground">
            {event.title}
          </p>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatEventTime(event.start, event.allDay)}
          </span>
        </div>

        {event.description ? (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {event.description}
          </p>
        ) : null}

        <div className="mt-1.5 flex items-center gap-2">
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{ backgroundColor: `${event.color}1A`, color: event.color }}
          >
            {meta?.label ?? event.type}
          </span>
          {event.status ? (
            <span className="text-[11px] text-muted-foreground">
              {event.status}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}