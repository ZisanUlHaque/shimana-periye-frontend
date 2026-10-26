"use client";

import { Calendar, CalendarCheck, Clock, Filter, Video } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAvailableSchedules } from "@/hooks/mentor-schedule.hook";
import type { IMentorSchedule } from "@/types/mentor-schedule.type";
import { BookSlotDialog } from "./book-slot-dialog";

interface MentorAvailableSlotsProps {
  selectedMentorId?: string | null;
  onSelectMentor?: (mentorId: string | null) => void;
  mentorOptions?: { id: string; name: string }[];
}

export function MentorAvailableSlots({
  selectedMentorId,
  onSelectMentor,
  mentorOptions = [],
}: MentorAvailableSlotsProps) {
  const { data, isLoading } = useAvailableSchedules();
  const schedules: IMentorSchedule[] = data?.data ?? [];

  const [localMentorFilter, setLocalMentorFilter] = useState<string>(
    selectedMentorId || "ALL",
  );

  const activeMentorId =
    selectedMentorId ||
    (localMentorFilter !== "ALL" ? localMentorFilter : null);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {["skel-s-1", "skel-s-2", "skel-s-3"].map((k) => (
          <Skeleton key={k} className="h-48 rounded-2xl" />
        ))}
      </div>
    );
  }

  // Filter out booked schedules and past dates
  const now = new Date();
  const openSchedules = schedules.filter((s) => {
    if (s.isBooked) return false;
    const start = new Date(s.startDateTime);
    if (start.getTime() < now.getTime()) return false;
    if (activeMentorId && s.mentorId !== activeMentorId) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Mentor Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card border border-border/70 p-3 rounded-2xl shadow-2xs">
        <div className="flex items-center gap-2">
          <Filter className="size-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">
            Filter by Mentor:
          </span>
          <select
            value={activeMentorId || "ALL"}
            onChange={(e) => {
              const val = e.target.value;
              setLocalMentorFilter(val);
              if (onSelectMentor) {
                onSelectMentor(val === "ALL" ? null : val);
              }
            }}
            className="text-xs bg-background border border-border/70 rounded-lg px-2.5 py-1 text-foreground focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="ALL">
              All Mentors ({schedules.filter((s) => !s.isBooked).length} slots)
            </option>
            {mentorOptions.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-muted-foreground">
          Showing <strong>{openSchedules.length}</strong> available 1-on-1 slots
        </span>
      </div>

      {/* Slots Grid */}
      {openSchedules.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 p-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
            <Calendar className="size-6" />
          </div>
          <h4 className="text-sm font-bold text-foreground">
            {activeMentorId
              ? "No open slots found for this mentor"
              : "No upcoming mentorship slots right now"}
          </h4>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm">
            {activeMentorId
              ? "This mentor has not published any open slots yet or all slots have been booked. You can choose another mentor or check back soon."
              : "Mentors regularly post new 1-on-1 availability slots. Please check back or explore our verified mentors directory."}
          </p>
          {activeMentorId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setLocalMentorFilter("ALL");
                if (onSelectMentor) onSelectMentor(null);
              }}
              className="mt-4 text-xs h-8"
            >
              Clear Mentor Filter
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {openSchedules.map((schedule) => {
            const start = new Date(schedule.startDateTime);
            const end = new Date(schedule.endDateTime);

            const dateStr = start.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            const timeRangeStr = `${start.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })} – ${end.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })}`;

            const mentorName = schedule.mentor?.name ?? "Verified Mentor";

            return (
              <div
                key={schedule.id}
                className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:border-primary/40 hover:shadow-md"
              >
                <div>
                  {/* Mentor Header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="size-11 border border-border/70 shrink-0">
                        <AvatarImage
                          src={schedule.mentor?.imageUrl ?? undefined}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                          {mentorName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-foreground truncate">
                          {mentorName}
                        </h4>
                        <span className="text-[11px] text-muted-foreground truncate block">
                          {schedule.mentor?.email}
                        </span>
                      </div>
                    </div>

                    <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[10px] px-2 py-0.5 shrink-0 font-semibold">
                      100% Free
                    </Badge>
                  </div>

                  {/* Slot Timing */}
                  <div className="mt-4 flex flex-col gap-2 rounded-xl bg-muted/40 p-3 text-xs border border-border/50">
                    <div className="flex items-center justify-between gap-1 text-foreground font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-primary" />
                        {dateStr}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                      <Clock className="size-3.5 text-primary/80" />
                      <span>{timeRangeStr}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                      <Video className="size-3.5 text-emerald-500" />
                      <span>Google Meet 1-on-1 Consultation</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2">
                  <BookSlotDialog
                    schedule={schedule}
                    trigger={
                      <Button
                        size="sm"
                        className="w-full gap-2 text-xs h-9 font-semibold bg-primary shadow-xs"
                      >
                        <CalendarCheck className="size-3.5" />
                        Book This Session
                      </Button>
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
