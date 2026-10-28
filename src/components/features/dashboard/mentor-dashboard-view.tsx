"use client";

import { useState } from "react";
import { useMentorDashboard } from "@/hooks/dashboard.hook";
import { useMyMentorSchedules, useCreateMentorSchedule } from "@/hooks/mentor-schedule.hook";
import { MenteeReviewDialog } from "@/components/features/mentor/mentee-review-dialog";
import { StatCard } from "@/components/shared/stat-card";
import {
  Users,
  FileCheck,
  CalendarCheck,
  ArrowUpRight,
  Mail,
  FileText,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Video,
  Plus,
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";

export function MentorDashboardView() {
  const { data, isLoading } = useMentorDashboard();
  const dashboard = data?.data;

  const { data: scheduleRes } = useMyMentorSchedules();
  const schedules = scheduleRes?.data ?? [];
  const createSlotMutation = useCreateMentorSchedule();

  const [activeTab, setActiveTab] = useState<"mentees" | "sessions" | "quickSlot">("mentees");
  const [reviewingStudent, setReviewingStudent] = useState<any>(null);

  // Quick slot state
  const [quickDate, setQuickDate] = useState("");
  const [quickStartTime, setQuickStartTime] = useState("14:00");
  const [quickEndTime, setQuickEndTime] = useState("15:00");
  const [quickMeetingLink, setQuickMeetingLink] = useState("");

  const handleQuickSlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickDate || !quickStartTime || !quickEndTime || !quickMeetingLink.trim()) {
      toast.add({
        title: "Required fields missing",
        description: "Please specify date, start time, end time, and meeting URL.",
        type: "error",
      });
      return;
    }

    let link = quickMeetingLink.trim();
    if (!/^https?:\/\//i.test(link)) {
      link = `https://${link}`;
    }

    const startDateTime = new Date(`${quickDate}T${quickStartTime}:00`).toISOString();
    const endDateTime = new Date(`${quickDate}T${quickEndTime}:00`).toISOString();

    if (new Date(endDateTime) <= new Date(startDateTime)) {
      toast.add({
        title: "Invalid time range",
        description: "End time must be after start time.",
        type: "error",
      });
      return;
    }

    createSlotMutation.mutate(
      {
        startDateTime,
        endDateTime,
        meetingLink: link,
      },
      {
        onSuccess: () => {
          setQuickDate("");
          setQuickMeetingLink("");
          setActiveTab("sessions");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <Skeleton className="h-44 rounded-3xl" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    );
  }

  const totalStudents = dashboard?.totalStudents ?? 0;
  const totalAwaiting = dashboard?.totalDocumentsAwaitingReview ?? 0;
  const students = dashboard?.students ?? [];

  const bookedSessions = schedules.filter(
    (s) => (s.bookings && s.bookings.length > 0) || s.isBooked
  );
  const totalBookingsCount = schedules.reduce(
    (sum, s) => sum + (s.bookings?.length ?? (s.isBooked ? 1 : 0)),
    0
  );
  const totalOpenSlots = schedules.reduce(
    (sum, s) => sum + (s.availableSlots ?? (s.isBooked ? 0 : 1)),
    0
  );

  // Compute aggregate submission count
  const totalApplications = students.reduce(
    (sum: number, s: any) => sum + (s.applicationCount || 0),
    0
  );
  const submittedApplications = students.reduce(
    (sum: number, s: any) => sum + (s.submittedApplicationCount || 0),
    0
  );

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* ── 1. ProfReach-Inspired Hero Header Banner ── */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/95 to-primary/5 p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                <Sparkles className="size-3" />
                Advising Station & Faculty Guidance
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                Live Active
              </span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
              Mentorship Command Center
            </h1>

            <p className="text-xs text-muted-foreground max-w-xl">
              Track student admissions milestones, evaluate draft research statements, and conduct 1-on-1 strategy sessions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link href="/mentor/schedule">
              <Button size="sm" variant="outline" className="text-xs gap-1.5 rounded-xl">
                <Calendar className="size-3.5" />
                Full Calendar
              </Button>
            </Link>
            <Link href="/mentor/profile">
              <Button size="sm" variant="outline" className="text-xs gap-1.5 rounded-xl">
                <ShieldCheck className="size-3.5" />
                My Credentials
              </Button>
            </Link>
            <Button
              size="sm"
              onClick={() => setActiveTab("quickSlot")}
              className="text-xs gap-1.5 rounded-xl bg-primary shadow-md shadow-primary/20"
            >
              <Plus className="size-3.5" />
              Publish Open Slot
            </Button>
          </div>
        </div>

        {/* ── 2. ProfReach 4-Stage Mentorship Funnel Strip ── */}
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border/60 pt-6 sm:grid-cols-4">
          <div className="flex flex-col rounded-2xl bg-muted/40 p-3.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              1. Active Mentees
            </span>
            <span className="mt-1 text-2xl font-black text-foreground">
              {totalStudents}
            </span>
            <span className="text-[10px] text-muted-foreground">Assigned scholars</span>
          </div>

          <div className="flex flex-col rounded-2xl bg-amber-500/5 p-3.5 border border-amber-500/20">
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              2. Review Queue
            </span>
            <span className="mt-1 text-2xl font-black text-amber-600 dark:text-amber-400">
              {totalAwaiting}
            </span>
            <span className="text-[10px] text-muted-foreground">Drafts awaiting critique</span>
          </div>

          <div className="flex flex-col rounded-2xl bg-emerald-500/5 p-3.5 border border-emerald-500/20">
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              3. Booked Sessions
            </span>
            <span className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {totalBookingsCount}
            </span>
            <span className="text-[10px] text-muted-foreground">{totalOpenSlots} open slots left</span>
          </div>

          <div className="flex flex-col rounded-2xl bg-violet-500/5 p-3.5 border border-violet-500/20">
            <span className="text-[11px] font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
              4. Target Apps
            </span>
            <span className="mt-1 text-2xl font-black text-violet-600 dark:text-violet-400">
              {submittedApplications}/{totalApplications}
            </span>
            <span className="text-[10px] text-muted-foreground">Submitted applications</span>
          </div>
        </div>
      </div>

      {/* ── 3. High-Density Interactive Tabs (ProfReach Pattern) ── */}
      <div className="flex border-b border-border/60">
        <button
          type="button"
          onClick={() => setActiveTab("mentees")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all ${
            activeTab === "mentees"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="size-4" />
          <span>Assigned Mentees & Reviews</span>
          {totalAwaiting > 0 && (
            <Badge variant="default" className="ml-1 text-[10px] px-1.5 py-0 h-4 bg-amber-600">
              {totalAwaiting}
            </Badge>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("sessions")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all ${
            activeTab === "sessions"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calendar className="size-4" />
          <span>Consultation Schedule</span>
          {totalBookingsCount > 0 && (
            <Badge variant="default" className="ml-1 text-[10px] px-1.5 py-0 h-4 bg-emerald-600 hover:bg-emerald-600 text-white">
              {totalBookingsCount}
            </Badge>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("quickSlot")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all ${
            activeTab === "quickSlot"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Plus className="size-4" />
          <span>Quick Slot Publisher</span>
        </button>
      </div>

      {/* Tab 1: Mentees & Reviews */}
      {activeTab === "mentees" && (
        <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">
                Assigned Students Pipeline
              </h3>
              <p className="text-xs text-muted-foreground">
                Track each scholar's application submission milestones and document review queue.
              </p>
            </div>
            <Link href="/mentor/applications">
              <Button variant="ghost" size="sm" className="text-xs text-primary gap-1">
                View All Details <ArrowUpRight className="size-3.5" />
              </Button>
            </Link>
          </div>

          {students.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
                <Users className="size-6" />
              </div>
              <h4 className="text-sm font-semibold text-foreground">No Students Assigned Yet</h4>
              <p className="text-xs text-muted-foreground max-w-sm mt-1">
                When students are paired with you, their applications, SOP drafts, and interview prep status will be tracked here.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {students.map((student: any) => {
                const hasPendingDocs = student.documentsAwaitingReview > 0;
                return (
                  <div
                    key={student.studentProfileId}
                    className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all hover:border-primary/50 hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-12 rounded-2xl ring-2 ring-primary/10 shadow-xs">
                            <AvatarImage src={student.imageUrl ?? undefined} />
                            <AvatarFallback className="rounded-2xl font-bold bg-primary/10 text-primary">
                              {student.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="text-sm font-bold text-foreground">
                              {student.name}
                            </h4>
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Mail className="size-3" />
                              {student.email}
                            </span>
                          </div>
                        </div>

                        <Badge
                          variant={hasPendingDocs ? "default" : "secondary"}
                          className={`text-[10px] ${
                            hasPendingDocs ? "bg-amber-600 text-white" : ""
                          }`}
                        >
                          {hasPendingDocs
                            ? `${student.documentsAwaitingReview} to review`
                            : "Up to date"}
                        </Badge>
                      </div>

                      {/* Progress Metrics */}
                      <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-muted/40 p-3 text-xs">
                        <div>
                          <span className="text-[11px] text-muted-foreground">Applications</span>
                          <p className="font-bold text-foreground">
                            {student.submittedApplicationCount} / {student.applicationCount} submitted
                          </p>
                        </div>
                        <div>
                          <span className="text-[11px] text-muted-foreground">Assigned Date</span>
                          <p className="font-medium text-foreground">
                            {new Date(student.assignedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between gap-2">
                      <Button
                        size="sm"
                        onClick={() => setReviewingStudent(student)}
                        variant={hasPendingDocs ? "default" : "outline"}
                        className="w-full text-xs gap-1.5 rounded-xl font-semibold cursor-pointer"
                      >
                        <FileText className="size-3.5" />
                        {hasPendingDocs ? "Review Document Drafts" : "Inspect Progress"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Consultation Schedule */}
      {activeTab === "sessions" && (
        <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">
                Upcoming Consultation Sessions & Open Slots
              </h3>
              <p className="text-xs text-muted-foreground">
                Manage your bookable advising calendar for mock interviews and statement critiques.
              </p>
            </div>
            <Link href="/mentor/schedule">
              <Button size="sm" variant="outline" className="text-xs gap-1.5 rounded-xl">
                <Calendar className="size-3.5" />
                Manage All Slots
              </Button>
            </Link>
          </div>

          {schedules.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Calendar className="size-8 text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">
                No consultation slots published yet.
              </p>
              <Button
                size="sm"
                className="mt-3 text-xs"
                onClick={() => setActiveTab("quickSlot")}
              >
                Create Availability Slot
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {schedules.map((slot) => {
                const start = new Date(slot.startDateTime);
                const end = new Date(slot.endDateTime);
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
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={isFullyBooked ? "default" : hasBookings ? "secondary" : "outline"}
                          className={`text-[10px] ${
                            isFullyBooked
                              ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                              : hasBookings
                              ? "bg-amber-600 hover:bg-amber-600 text-white"
                              : ""
                          }`}
                        >
                          {isFullyBooked
                            ? `Fully Booked (${bookings.length})`
                            : hasBookings
                            ? `Partially Booked (${bookings.length}/${slot.totalSlots || 1})`
                            : `Open (${slot.availableSlots ?? 1} left)`}
                        </Badge>
                      </div>

                      <div>
                        <div className="text-xs font-bold text-foreground">
                          {start.toLocaleDateString(undefined, {
                            timeZone: "Asia/Dhaka",
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
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

                      {/* Booked Students in this slot */}
                      {hasBookings && (
                        <div className="space-y-2 mt-2 pt-2 border-t border-border/60">
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-foreground">
                            <Users className="size-3 text-primary" />
                            Booked Scholars ({bookings.length}):
                          </span>

                          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                            {bookings.map((b) => (
                              <div
                                key={b.id}
                                className="rounded-xl border border-border/70 bg-background/90 p-2 text-xs space-y-1"
                              >
                                <div className="flex items-center justify-between gap-1.5">
                                  <div className="min-w-0">
                                    <p className="font-bold text-foreground text-xs truncate">
                                      {b.student?.name || "Student"}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground truncate">
                                      {b.student?.email}
                                    </p>
                                  </div>
                                  <Badge variant="secondary" className="text-[9px] font-bold px-1.5 py-0 shrink-0">
                                    Slot #{b.slotNumber || 1}
                                  </Badge>
                                </div>

                                <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
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
                                    : "Allocated Window")}
                                </div>

                                {b.notes && (
                                  <p className="text-[10px] text-muted-foreground bg-muted/40 p-1 rounded italic truncate">
                                    "{b.notes}"
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-2 border-t border-border/50">
                      <a
                        href={slot.meetingLink}
                        target="_blank"
                        rel="noreferrer noopener"
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
      )}

      {/* Tab 3: Quick Slot Publisher */}
      {activeTab === "quickSlot" && (
        <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="size-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">
              Publish Instant Mentorship Slot
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mb-5">
            Add a consultation window for student SOP feedback, profile audit, or mock interview simulation.
          </p>

          <form onSubmit={handleQuickSlotSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Date</Label>
              <Input
                type="date"
                required
                className="text-xs h-10 rounded-xl"
                value={quickDate}
                onChange={(e) => setQuickDate(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Start Time</Label>
                <Input
                  type="time"
                  required
                  className="text-xs h-10 rounded-xl"
                  value={quickStartTime}
                  onChange={(e) => setQuickStartTime(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">End Time</Label>
                <Input
                  type="time"
                  required
                  className="text-xs h-10 rounded-xl"
                  value={quickEndTime}
                  onChange={(e) => setQuickEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Meeting URL (Google Meet / Zoom)</Label>
              <Input
                type="text"
                required
                placeholder="https://meet.google.com/abc-def-ghi"
                className="text-xs h-10 rounded-xl"
                value={quickMeetingLink}
                onChange={(e) => setQuickMeetingLink(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full text-xs font-bold rounded-xl gap-2 mt-2"
              disabled={createSlotMutation.isPending}
            >
              <Plus className="size-4" />
              {createSlotMutation.isPending ? "Publishing Slot..." : "Publish Slot to Students"}
            </Button>
          </form>
        </div>
      )}

      {/* ── Mentee Document Review & Feedback Studio Modal ── */}
      <MenteeReviewDialog
        open={Boolean(reviewingStudent)}
        onOpenChange={(open) => !open && setReviewingStudent(null)}
        student={reviewingStudent}
      />
    </div>
  );
}
