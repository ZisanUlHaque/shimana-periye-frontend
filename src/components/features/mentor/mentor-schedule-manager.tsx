"use client";

import { useState } from "react";
import {
  useMyMentorSchedules,
  useCreateMentorSchedule,
  useDeleteMentorSchedule,
} from "@/hooks/mentor-schedule.hook";
import { PageHeader } from "@/components/layout/public/page-header";
import {
  Calendar,
  Clock,
  Video,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";

export function MentorScheduleManager() {
  const { data: scheduleRes, isLoading } = useMyMentorSchedules();
  const createMutation = useCreateMentorSchedule();
  const deleteMutation = useDeleteMentorSchedule();

  const schedules = scheduleRes?.data ?? [];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("10:45");
  const [meetingLink, setMeetingLink] = useState("");

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !startTime || !endTime || !meetingLink.trim()) {
      toast.add({
        title: "Required fields missing",
        description: "Please specify date, start time, end time, and a meeting link.",
        type: "error",
      });
      return;
    }

    let link = meetingLink.trim();
    if (!/^https?:\/\//i.test(link)) {
      link = `https://${link}`;
    }

    const startDateTime = new Date(`${date}T${startTime}:00`).toISOString();
    const endDateTime = new Date(`${date}T${endTime}:00`).toISOString();

    if (new Date(endDateTime) <= new Date(startDateTime)) {
      toast.add({
        title: "Invalid time range",
        description: "End time must be strictly after start time.",
        type: "error",
      });
      return;
    }

    createMutation.mutate(
      {
        startDateTime,
        endDateTime,
        meetingLink: link,
      },
      {
        onSuccess: () => {
          setDialogOpen(false);
          setDate("");
          setMeetingLink("");
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this availability slot?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-4 sm:p-6">
        <PageHeader
          title="Mentorship Calendar & Slots"
          description="Manage your 1-on-1 consultation availability and view student bookings."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
        </div>
      </div>
    );
  }

  const totalBookedCount = schedules.reduce(
    (sum, s) => sum + (s.bookings?.length ?? (s.isBooked ? 1 : 0)),
    0
  );
  const totalAvailableCount = schedules.reduce(
    (sum, s) => sum + (s.availableSlots ?? (s.isBooked ? 0 : 1)),
    0
  );
  const totalSlotsCapacity = schedules.reduce(
    (sum, s) => sum + (s.totalSlots ?? 1),
    0
  );

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Mentorship Calendar & Slots"
          description="Publish consultation time slots for student SOP review, CV overhaul, and mock interviews."
        />
        <Button
          onClick={() => setDialogOpen(true)}
          className="gap-2 text-xs font-semibold shrink-0"
        >
          <Plus className="size-4" />
          Add Availability Slot
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
          <span className="text-xs font-medium text-muted-foreground">Total Slots Capacity</span>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {totalSlotsCapacity}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              across {schedules.length} {schedules.length === 1 ? "window" : "windows"}
            </span>
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
          <span className="text-xs font-medium text-muted-foreground">Confirmed Student Bookings</span>
          <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {totalBookedCount}
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
          <span className="text-xs font-medium text-muted-foreground">Open Slots Available</span>
          <p className="mt-1 text-2xl font-bold text-primary">
            {totalAvailableCount}
          </p>
        </div>
      </div>

      {/* Slots Section */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">
            Your Mentorship Slots
          </h3>
          <Badge variant="outline">{schedules.length} Time Windows</Badge>
        </div>

        {schedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
              <Calendar className="size-6" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">No Slots Scheduled Yet</h4>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              Add your available times so your assigned students can schedule 1-on-1 admissions advising sessions.
            </p>
            <Button
              onClick={() => setDialogOpen(true)}
              variant="outline"
              size="sm"
              className="mt-4 gap-1.5 text-xs"
            >
              <Plus className="size-3.5" />
              Create First Slot
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {schedules.map((slot) => {
              const start = new Date(slot.startDateTime);
              const end = new Date(slot.endDateTime);
              const isPast = end < new Date();
              const bookings = slot.bookings || [];
              const hasBookings = bookings.length > 0;
              const isFullyBooked = (slot.availableSlots ?? 1) === 0;

              return (
                <div
                  key={slot.id}
                  className={`flex flex-col justify-between rounded-2xl border p-4 shadow-xs transition-colors ${
                    isFullyBooked
                      ? "border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/10"
                      : hasBookings
                      ? "border-amber-500/40 bg-amber-500/5 dark:bg-amber-950/10"
                      : "border-border/70 bg-card"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          isFullyBooked
                            ? "default"
                            : hasBookings
                            ? "secondary"
                            : isPast
                            ? "secondary"
                            : "outline"
                        }
                        className={`text-[10px] ${
                          isFullyBooked
                            ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                            : hasBookings
                            ? "bg-amber-600 hover:bg-amber-600 text-white"
                            : ""
                        }`}
                      >
                        {isFullyBooked
                          ? `Fully Booked (${bookings.length} students)`
                          : hasBookings
                          ? `Partially Booked (${bookings.length}/${slot.totalSlots || 1})`
                          : isPast
                          ? "Past Window"
                          : `Open for Booking (${slot.availableSlots ?? 1} left)`}
                      </Badge>

                      {!hasBookings && (
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          className="size-6 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(slot.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                        <Calendar className="size-3.5 text-primary" />
                        {start.toLocaleDateString(undefined, {
                          timeZone: "Asia/Dhaka",
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-1">
                        <Clock className="size-3.5" />
                        {start.toLocaleTimeString([], {
                          timeZone: "Asia/Dhaka",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}{" "}
                        –{" "}
                        {end.toLocaleTimeString([], {
                          timeZone: "Asia/Dhaka",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}{" "}
                        (BST)
                      </div>
                    </div>

                    {/* Booked Students List */}
                    {hasBookings && (
                      <div className="space-y-2 mt-3 pt-3 border-t border-border/60">
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-foreground">
                          <Users className="size-3 text-primary" />
                          Booked Students ({bookings.length}):
                        </span>

                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {bookings.map((b) => (
                            <div
                              key={b.id}
                              className="rounded-xl border border-border/80 bg-background/90 p-2.5 text-xs space-y-1.5 shadow-2xs"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <Avatar className="size-6 rounded-lg ring-1 ring-primary/20">
                                    <AvatarImage src={b.student?.imageUrl ?? undefined} />
                                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                                      {(b.student?.name || "S").slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="min-w-0">
                                    <p className="font-semibold text-foreground text-xs truncate">
                                      {b.student?.name || "Student"}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground truncate">
                                      {b.student?.email}
                                    </p>
                                  </div>
                                </div>
                                <Badge variant="secondary" className="text-[9px] font-bold px-1.5 py-0 shrink-0">
                                  Slot #{b.slotNumber || 1}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                                <Clock className="size-3" />
                                {b.formattedTimeBD?.replace(/â€“|–/g, "-") || (b.startDateTime && b.endDateTime
                                  ? `${new Date(b.startDateTime).toLocaleTimeString([], {
                                      timeZone: "Asia/Dhaka",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    })} - ${new Date(b.endDateTime).toLocaleTimeString([], {
                                      timeZone: "Asia/Dhaka",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    })} (BST)`
                                  : "Allocated Slot")}
                              </div>

                              {b.notes && (
                                <p className="text-[10px] text-muted-foreground bg-muted/40 p-1.5 rounded-lg italic">
                                  "{b.notes}"
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                    <a
                      href={slot.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      <Video className="size-3.5" />
                      Join Google Meet
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Slot Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="size-5 text-primary" />
              Publish Consultation Slot
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define a time window when you are available to meet with students.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSlot} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Date</Label>
              <Input
                type="date"
                required
                className="text-xs"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Start Time</Label>
                <Input
                  type="time"
                  required
                  className="text-xs"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">End Time</Label>
                <Input
                  type="time"
                  required
                  className="text-xs"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Meeting URL (Google Meet / Zoom)</Label>
              <Input
                type="url"
                required
                placeholder="https://meet.google.com/xyz-abcd-efg"
                className="text-xs"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Creating..." : "Publish Slot"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
