"use client";

import { useAvailableSchedules } from "@/hooks/mentor-schedule.hook";
import {
  Calendar,
  Clock,
  Video,
  User,
  CalendarCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookSlotDialog } from "./book-slot-dialog";
import type { IMentorSchedule } from "@/types/mentor-schedule.type";

export function MentorAvailableSlots() {
  const { data, isLoading } = useAvailableSchedules();
  const schedules: IMentorSchedule[] = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-44 rounded-2xl" />
        <Skeleton className="h-44 rounded-2xl" />
        <Skeleton className="h-44 rounded-2xl" />
      </div>
    );
  }

  const unbookedSchedules = schedules.filter((s) => !s.isBooked);

  if (unbookedSchedules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Calendar className="size-6" />
        </div>
        <h4 className="mt-4 text-sm font-semibold text-foreground">
          No open mentorship slots right now
        </h4>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm">
          Mentors regularly post new 1-on-1 availability slots. Please check back
          or request a slot from your assigned mentor.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {unbookedSchedules.map((schedule) => {
        const start = new Date(schedule.startDateTime);
        const end = new Date(schedule.endDateTime);

        const dateStr = start.toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
        const timeRangeStr = `${start.toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "2-digit",
        })} – ${end.toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "2-digit",
        })}`;

        return (
          <div
            key={schedule.id}
            className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-shadow hover:shadow-md"
          >
            <div>
              {/* Mentor Identity */}
              <div className="flex items-center gap-3">
                <Avatar className="size-10 rounded-xl">
                  <AvatarImage src={schedule.mentor?.imageUrl ?? undefined} />
                  <AvatarFallback className="rounded-xl font-bold text-xs">
                    {(schedule.mentor?.name ?? "M").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {schedule.mentor?.name ?? "Mentor"}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {schedule.mentor?.email}
                  </span>
                </div>
              </div>

              {/* Slot Timing */}
              <div className="mt-4 flex flex-col gap-2 rounded-xl bg-muted/40 p-3.5 text-xs">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <Calendar className="size-3.5 text-primary" />
                  <span>{dateStr}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-3.5" />
                  <span>{timeRangeStr}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Video className="size-3.5 text-blue-500" />
                  <span>Online Video Session (Free)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2">
              <BookSlotDialog
                schedule={schedule}
                trigger={
                  <Button size="sm" className="w-full gap-1.5 text-xs">
                    <CalendarCheck className="size-3.5" />
                    Book This Slot
                  </Button>
                }
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
