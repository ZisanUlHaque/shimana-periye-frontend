"use client";

import { ICalendarEvent } from "@/types/calendar.type";
import { CALENDAR_EVENT_TYPE_META } from "./calendar-event-meta";
import { cn } from "@/lib/utils";
import { formatEventTime } from "./calendar-date-utils";
import {
  Video,
  ExternalLink,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarEventItemProps {
  event: ICalendarEvent;
  isPast?: boolean;
}

export function CalendarEventItem({ event, isPast }: CalendarEventItemProps) {
  const meta = CALENDAR_EVENT_TYPE_META[event.type];
  const Icon = meta?.icon || CalendarIcon;

  // Extract meet link if present in description
  let meetingLink: string | null = null;
  if (event.description) {
    const match = event.description.match(/https?:\/\/[^\s,]+/);
    if (match) {
      meetingLink = match[0];
    }
  }

  // Clean description by removing raw meeting URL so it doesn't clutter card text
  const cleanDescription = event.description
    ? event.description
        .replace(/Meeting Link:\s*https?:\/\/[^\s,]+/i, "")
        .replace(/https?:\/\/[^\s,]+/g, "")
        .trim()
    : null;

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:border-border hover:shadow-md min-h-[220px]",
        isPast && "opacity-60 bg-muted/15"
      )}
      style={{ borderTopColor: event.color, borderTopWidth: 4 }}
    >
      {/* ── Top Header Section ── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-xl font-bold shadow-2xs"
            style={{ backgroundColor: `${event.color}1A`, color: event.color }}
          >
            <Icon className="size-5" />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <span
              className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${
                meta?.badgeColor ?? "bg-muted text-muted-foreground"
              }`}
            >
              {meta?.label ?? event.type}
            </span>

            {event.status && (
              <span className="rounded-md bg-muted/70 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                {event.status}
              </span>
            )}
          </div>
        </div>

        {/* ── Title & Description ── */}
        <div className="mt-1">
          <h4 className="text-sm font-bold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {event.title}
          </h4>

          {cleanDescription && (
            <p className="mt-1.5 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
              {cleanDescription}
            </p>
          )}
        </div>
      </div>

      {/* ── Bottom Footer Section (Time & Action) ── */}
      <div className="mt-4 pt-3 border-t border-border/60 flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Clock className="size-3.5 text-primary/80" />
            {formatEventTime(event.start, event.allDay)}
          </span>

          {isPast ? (
            <span className="text-[10px] font-semibold text-muted-foreground">
              Past
            </span>
          ) : (
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          )}
        </div>

        {meetingLink && (
          <a
            href={meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-1"
          >
            <Button
              size="sm"
              className="w-full gap-1.5 text-xs h-8.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
            >
              <Video className="size-3.5" />
              <span>Join Google Meet</span>
              <ExternalLink className="size-3" />
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}
