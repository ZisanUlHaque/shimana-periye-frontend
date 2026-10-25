"use client";

import { useMyBookings } from "@/hooks/mentor-schedule.hook";
import {
  Calendar,
  Clock,
  Video,
  ExternalLink,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { IBooking } from "@/types/mentor-schedule.type";

export function MyBookingsList() {
  const { data, isLoading } = useMyBookings();
  const bookings: IBooking[] = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
        You have no active or completed mentor bookings yet.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {bookings.map((b) => {
        const schedule = b.schedule;
        const start = schedule ? new Date(schedule.startDateTime) : null;
        const end = schedule ? new Date(schedule.endDateTime) : null;

        const dateStr = start
          ? start.toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })
          : "Scheduled";

        const timeRangeStr =
          start && end
            ? `${start.toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
              })} – ${end.toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
              })}`
            : "";

        return (
          <div
            key={b.id}
            className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-5 shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={`text-[11px] ${
                    b.status === "CONFIRMED"
                      ? "border-green-500/30 bg-green-500/10 text-green-600"
                      : "border-border bg-muted/40 text-muted-foreground"
                  }`}
                >
                  {b.status}
                </Badge>
                <span className="text-[11px] text-muted-foreground">
                  {dateStr}
                </span>
              </div>

              <h4 className="mt-2 text-sm font-semibold text-foreground">
                {b.topic || "1-on-1 Mentorship Guidance Session"}
              </h4>

              <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3.5 text-primary" />
                  <span>{timeRangeStr}</span>
                </div>
                {b.application && (
                  <div className="flex items-center gap-1.5">
                    <Building2 className="size-3.5" />
                    <span>{b.application.opportunity?.title}</span>
                  </div>
                )}
                {b.notes && (
                  <p className="mt-1 text-xs italic text-muted-foreground/90 line-clamp-2">
                    "{b.notes}"
                  </p>
                )}
              </div>
            </div>

            {schedule?.meetingLink && (
              <div className="mt-4 border-t border-border/60 pt-3">
                <a
                  href={schedule.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full"
                >
                  <Button size="sm" variant="outline" className="w-full gap-1.5 text-xs">
                    <Video className="size-3.5 text-primary" />
                    Join Video Call
                    <ExternalLink className="size-3 ml-auto opacity-60" />
                  </Button>
                </a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
