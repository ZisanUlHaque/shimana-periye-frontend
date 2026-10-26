"use client";

import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  ExternalLink,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ICalendarEvent } from "@/types/calendar.type";
import { formatEventTimeRange } from "./calendar-date-utils";
import { CALENDAR_EVENT_TYPE_META } from "./calendar-event-meta";

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

  // Calculate live and ended states based on timestamps
  const now = new Date();
  const startTime = new Date(event.start);
  const endTime = event.end
    ? new Date(event.end)
    : new Date(startTime.getTime() + 45 * 60 * 1000);

  const hasEnded = Boolean(isPast || now.getTime() > endTime.getTime());
  const isLive =
    !hasEnded &&
    now.getTime() >= startTime.getTime() - 15 * 60 * 1000 &&
    now.getTime() <= endTime.getTime();

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
        hasEnded && "opacity-65 bg-muted/15",
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

            {isLive ? (
              <span className="rounded-md border border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Now
              </span>
            ) : hasEnded ? (
              <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="size-3 text-emerald-500" />
                Completed
              </span>
            ) : event.status ? (
              <span className="rounded-md bg-muted/70 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                {event.status}
              </span>
            ) : null}
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
            {formatEventTimeRange(event.start, event.end, event.allDay)}
          </span>

          {hasEnded ? (
            <span className="text-[10px] font-semibold text-muted-foreground">
              Session Passed
            </span>
          ) : isLive ? (
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              In Progress
            </span>
          ) : (
            <span className="size-2 rounded-full bg-emerald-500" />
          )}
        </div>

        {/* Action button: depends on whether the session has ended */}
        {meetingLink &&
          (hasEnded ? (
            <div className="flex items-center justify-between rounded-xl bg-muted/40 border border-border/50 px-3 py-2 text-xs text-muted-foreground mt-1">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                Session Completed
              </span>
              <a
                href={meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-muted-foreground/80 hover:text-foreground underline flex items-center gap-1"
              >
                Revisit Link
                <ExternalLink className="size-2.5" />
              </a>
            </div>
          ) : (
            <a
              href={meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-1"
            >
              <Button
                size="sm"
                className={cn(
                  "w-full gap-1.5 text-xs h-8.5 text-white shadow-xs font-semibold",
                  isLive
                    ? "bg-emerald-600 hover:bg-emerald-700 animate-pulse"
                    : "bg-emerald-600 hover:bg-emerald-700",
                )}
              >
                <Video className="size-3.5" />
                <span>
                  {isLive ? "Join Google Meet Now (Live)" : "Join Google Meet"}
                </span>
                <ExternalLink className="size-3" />
              </Button>
            </a>
          ))}
      </div>
    </div>
  );
}
