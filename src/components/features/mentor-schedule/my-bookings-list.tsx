"use client";

import {
  Building2,
  Calendar,
  CalendarPlus,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  ExternalLink,
  ListChecks,
  Video,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { useMyBookings } from "@/hooks/mentor-schedule.hook";
import type { IBooking } from "@/types/mentor-schedule.type";

function formatTimeRange(start: Date, end: Date): string {
  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  return `${formatTime(start)} – ${formatTime(end)}`;
}

function calculateDurationMinutes(start: Date, end: Date): number {
  return Math.max(
    1,
    Math.round((end.getTime() - start.getTime()) / (60 * 1000)),
  );
}

function getRelativeTimeDescription(
  start: Date,
  end: Date,
  now: Date,
): { label: string; tone: "live" | "urgent" | "normal" | "past" } {
  if (now.getTime() > end.getTime()) {
    const passedMinutes = Math.round(
      (now.getTime() - end.getTime()) / (60 * 1000),
    );
    if (passedMinutes < 60) {
      return { label: `Ended ${passedMinutes}m ago`, tone: "past" };
    }
    const passedHours = Math.round(passedMinutes / 60);
    if (passedHours < 24) {
      return { label: `Ended ${passedHours}h ago`, tone: "past" };
    }
    return {
      label: `Ended ${Math.round(passedHours / 24)}d ago`,
      tone: "past",
    };
  }

  if (now.getTime() >= start.getTime() && now.getTime() <= end.getTime()) {
    const remaining = Math.round((end.getTime() - now.getTime()) / (60 * 1000));
    return {
      label: `Live · ${remaining}m remaining`,
      tone: "live",
    };
  }

  const diffMs = start.getTime() - now.getTime();
  const diffMinutes = Math.round(diffMs / (60 * 1000));
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);

  if (diffMinutes <= 15) {
    return { label: `Starts in ${diffMinutes} mins`, tone: "urgent" };
  }
  if (diffMinutes < 60) {
    return { label: `Starts in ${diffMinutes}m`, tone: "normal" };
  }
  if (diffHours < 24) {
    return {
      label: `Starts in ${diffHours} hr${diffHours > 1 ? "s" : ""}`,
      tone: "normal",
    };
  }
  if (diffDays === 1) {
    return { label: "Starts Tomorrow", tone: "normal" };
  }
  return { label: `In ${diffDays} days`, tone: "normal" };
}

function buildGoogleCalendarUrl(
  title: string,
  start: Date,
  end: Date,
  details: string,
  location: string,
): string {
  const formatGCalDate = (d: Date) =>
    d.toISOString().replace(/-|:|\.\d\d\d/g, "");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title,
  )}&dates=${formatGCalDate(start)}/${formatGCalDate(end)}&details=${encodeURIComponent(
    details,
  )}&location=${encodeURIComponent(location)}`;
}

export function MyBookingsList() {
  const { data, isLoading } = useMyBookings();
  const bookings: IBooking[] = data?.data ?? [];

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openTipsId, setOpenTipsId] = useState<string | null>(null);

  const handleCopyLink = async (bookingId: string, link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(bookingId);
      toast.add({
        title: "Link Copied!",
        description: "Google Meet link copied to clipboard.",
        type: "success",
      });
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      toast.add({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        type: "error",
      });
    }
  };

  const toggleTips = (bookingId: string) => {
    setOpenTipsId((prev) => (prev === bookingId ? null : bookingId));
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-muted/20 p-12 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3 shadow-2xs">
          <Calendar className="size-7" />
        </div>
        <h4 className="text-base font-bold text-foreground">
          No Booked Mentor Sessions Yet
        </h4>
        <p className="mt-1 text-xs text-muted-foreground max-w-md leading-relaxed">
          Browse verified graduate and alumni mentors from the directory above
          to schedule your free 1-on-1 interview practice or application review.
        </p>
      </div>
    );
  }

  const now = new Date();

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {bookings.map((b: IBooking) => {
        const rawStart = b.startDateTime || b.schedule?.startDateTime;
        const rawEnd = b.endDateTime || b.schedule?.endDateTime;
        const meetingLink = b.meetingLink || b.schedule?.meetingLink;
        const mentor = (b.mentor || b.schedule?.mentor) as IBooking["mentor"];

        const initialStart = rawStart ? new Date(rawStart) : null;
        const initialEnd = rawEnd
          ? new Date(rawEnd)
          : initialStart
            ? new Date(initialStart.getTime() + 30 * 60 * 1000)
            : null;

        // Calculate student's allocated slot time (protecting against raw multi-hour mentor windows)
        let slotDuration =
          b.slotDurationMinutes ||
          (initialStart && initialEnd
            ? calculateDurationMinutes(initialStart, initialEnd)
            : 30);

        let start = initialStart;
        let end = initialEnd;

        // If duration exceeds 60 mins and represents the mentor's total schedule block, derive student slot
        if (slotDuration > 60 && initialStart && initialEnd) {
          const totalSlots =
            b.schedule?.totalSlots ||
            Math.max(Math.round(slotDuration / 30), 1);
          const perSlotMin = Math.max(
            Math.floor(slotDuration / totalSlots),
            30,
          );
          const slotIdx = (b.slotNumber || 1) - 1;

          start = new Date(
            initialStart.getTime() + slotIdx * perSlotMin * 60 * 1000,
          );
          end = new Date(start.getTime() + perSlotMin * 60 * 1000);
          slotDuration = perSlotMin;
        }

        const hasEnded = Boolean(end && now.getTime() > end.getTime());
        const isLive = Boolean(
          start &&
            end &&
            !hasEnded &&
            now.getTime() >= start.getTime() - 15 * 60 * 1000 &&
            now.getTime() <= end.getTime(),
        );

        const durationMinutes = slotDuration;

        const dateStr = start
          ? start.toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Scheduled Session";

        const timeRangeStr =
          start && end ? formatTimeRange(start, end) : "Time to be confirmed";

        const relativeInfo =
          start && end
            ? getRelativeTimeDescription(start, end, now)
            : { label: "Upcoming", tone: "normal" as const };

        const mentorName = mentor?.name || "Verified Academic Mentor";
        const mentorEmail = mentor?.email || "";
        const mentorInstitution =
          mentor?.mentorProfile?.institution || mentor?.institution;
        const mentorDesignation =
          mentor?.mentorProfile?.designation || mentor?.designation;

        const sessionTitle =
          b.topic || "1-on-1 Academic Mentorship Consultation";

        const gCalUrl =
          start && end && meetingLink
            ? buildGoogleCalendarUrl(
                `Mentorship: ${mentorName} & Student Session`,
                start,
                end,
                `1-on-1 Mentorship consultation with ${mentorName} on PUB GradPath.\nTopic: ${sessionTitle}\nMeeting Link: ${meetingLink}`,
                meetingLink,
              )
            : null;

        const isTipsOpen = openTipsId === b.id;

        return (
          <div
            key={b.id}
            className={`group relative flex flex-col justify-between rounded-3xl border p-5 sm:p-6 shadow-xs transition-all duration-300 hover:shadow-lg ${
              isLive
                ? "border-emerald-500/60 bg-gradient-to-br from-card via-emerald-500/5 to-emerald-500/10 ring-2 ring-emerald-500/30"
                : hasEnded
                  ? "border-border/60 bg-card/60 opacity-80"
                  : "border-border/80 bg-card hover:border-primary/50"
            }`}
          >
            {/* Top Row: Mentor identity & Status Badge */}
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative shrink-0">
                    <Avatar className="size-12 border-2 border-border shadow-xs">
                      <AvatarImage src={mentor?.imageUrl ?? undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary font-black text-sm">
                        {mentorName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isLive && (
                      <span className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 border-card bg-emerald-500 animate-ping" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-bold text-sm text-foreground truncate">
                        {mentorName}
                      </h4>
                      <Badge className="bg-primary/10 text-primary text-[10px] px-1.5 py-0 border-primary/25 font-semibold">
                        Mentor
                      </Badge>
                    </div>

                    {mentorInstitution ? (
                      <p className="text-xs text-muted-foreground truncate mt-0.5 flex items-center gap-1.5">
                        <Building2 className="size-3.5 text-primary shrink-0" />
                        <span className="truncate font-medium">
                          {mentorInstitution}
                        </span>
                        {mentorDesignation && (
                          <span className="text-[11px] text-muted-foreground/75 truncate">
                            · {mentorDesignation}
                          </span>
                        )}
                      </p>
                    ) : mentorEmail ? (
                      <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                        {mentorEmail}
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Session Status Pill */}
                {isLive ? (
                  <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 gap-1.5 px-3 py-1 text-xs font-black shadow-xs shrink-0 animate-pulse">
                    <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                    LIVE NOW
                  </Badge>
                ) : hasEnded ? (
                  <Badge
                    variant="outline"
                    className="bg-muted text-muted-foreground gap-1.5 px-2.5 py-1 text-[11px] font-semibold shrink-0"
                  >
                    <CheckCircle2 className="size-3.5 text-emerald-500" />
                    COMPLETED
                  </Badge>
                ) : relativeInfo.tone === "urgent" ? (
                  <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 gap-1.5 px-2.5 py-1 text-[11px] font-bold shrink-0 animate-pulse">
                    <Clock className="size-3.5" />
                    {relativeInfo.label}
                  </Badge>
                ) : (
                  <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 text-[11px] px-2.5 py-1 font-semibold shrink-0">
                    UPCOMING
                  </Badge>
                )}
              </div>

              {/* ── Prominent Premium Time & Schedule Display Block ── */}
              <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-primary/[0.03] to-background p-4 shadow-2xs">
                <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2.5 mb-2.5">
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="size-3.5 text-primary" />
                    My Reserved Slot {b.slotNumber ? `(#${b.slotNumber})` : ""}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-md bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                      {durationMinutes} Min Session
                    </span>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                        relativeInfo.tone === "live"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold"
                          : relativeInfo.tone === "urgent"
                            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold"
                            : relativeInfo.tone === "past"
                              ? "bg-muted text-muted-foreground"
                              : "bg-muted/80 text-foreground"
                      }`}
                    >
                      {relativeInfo.label}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5">
                  {/* Detailed Time Range (e.g. 4:00 PM – 4:30 PM) */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                      {timeRangeStr}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-medium">
                      (BST / Asia:Dhaka)
                    </span>
                  </div>

                  {/* Day and Date */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <Calendar className="size-3.5 text-primary shrink-0" />
                    <span>{dateStr}</span>
                  </div>
                </div>

                {/* Session Topic & Student Notes */}
                <div className="mt-3 pt-2.5 border-t border-border/40 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-foreground truncate">
                      {sessionTitle}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0 uppercase tracking-wide">
                      1-on-1 Consultation
                    </span>
                  </div>

                  {b.notes && (
                    <p className="text-[11px] text-muted-foreground/90 italic bg-card/60 p-2 rounded-xl border border-border/40">
                      &ldquo;{b.notes}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              {/* Interactive Preparation Checklist Accordion */}
              {!hasEnded && (
                <div className="rounded-2xl border border-border/60 bg-muted/20 overflow-hidden transition-all duration-200">
                  <button
                    type="button"
                    onClick={() => toggleTips(b.id)}
                    className="w-full flex items-center justify-between p-3 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <ListChecks className="size-3.5 text-primary" />
                      <span>Pre-Session Checklist & Preparation Guide</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-primary font-bold">
                        {isTipsOpen ? "Hide" : "Show"}
                      </span>
                      <ChevronDown
                        className={`size-3.5 transition-transform duration-200 ${
                          isTipsOpen ? "rotate-180 text-primary" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {isTipsOpen && (
                    <div className="px-3.5 pb-3.5 pt-1 text-xs text-muted-foreground flex flex-col gap-2 border-t border-border/40 animate-in fade-in-50 duration-200">
                      <div className="flex items-start gap-2 text-[11px]">
                        <span className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <span>
                          Have your statement of purpose (SOP) draft, CV, and
                          target university list open and ready to share.
                        </span>
                      </div>
                      <div className="flex items-start gap-2 text-[11px]">
                        <span className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <span>
                          Join 3–5 minutes early to test your audio, microphone,
                          and camera equipment.
                        </span>
                      </div>
                      <div className="flex items-start gap-2 text-[11px]">
                        <span className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <span>
                          Prepare 2–3 concise questions regarding professor
                          outreach, funding, or interview expectations.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Interactive Action Controls Footer ── */}
            <div className="mt-5 pt-4 border-t border-border/60 flex flex-col gap-3">
              {hasEnded ? (
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    Session Concluded · Time Passed
                  </span>
                  {meetingLink && (
                    <a
                      href={meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Revisit Call Room</span>
                      <ExternalLink className="size-3" />
                    </a>
                  )}
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  {/* Primary Join Call Button */}
                  {meetingLink ? (
                    <a
                      href={meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:flex-1"
                    >
                      <Button
                        size="sm"
                        className={`w-full gap-2 text-xs h-10 font-bold transition-all duration-200 ${
                          isLive
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md animate-pulse"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                        }`}
                      >
                        <Video className="size-4 shrink-0" />
                        <span>
                          {isLive
                            ? "Join Google Meet (Live Now)"
                            : "Join Google Meet"}
                        </span>
                        <ExternalLink className="size-3.5 ml-auto opacity-80" />
                      </Button>
                    </a>
                  ) : (
                    <Button
                      size="sm"
                      disabled
                      className="w-full sm:flex-1 text-xs h-10 font-semibold"
                    >
                      Meeting link will appear before session
                    </Button>
                  )}

                  {/* Secondary Quick Action: Copy Link */}
                  {meetingLink && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyLink(b.id, meetingLink)}
                      className="w-full sm:w-auto h-10 px-3 text-xs font-medium border-border/80 hover:bg-muted gap-1.5 shrink-0"
                      title="Copy meeting link"
                    >
                      {copiedId === b.id ? (
                        <>
                          <Check className="size-3.5 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            Copied
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5 text-muted-foreground" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </Button>
                  )}

                  {/* Secondary Quick Action: Sync to Google Calendar */}
                  {gCalUrl && (
                    <a
                      href={gCalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto shrink-0"
                    >
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto h-10 px-3 text-xs font-medium border-border/80 hover:bg-muted gap-1.5"
                        title="Add session to Google Calendar"
                      >
                        <CalendarPlus className="size-3.5 text-primary" />
                        <span className="hidden sm:inline">Add to Cal</span>
                        <span className="sm:hidden">Add to Calendar</span>
                      </Button>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
