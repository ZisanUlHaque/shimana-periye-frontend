"use client";

import { CalendarCheck, Clock, ShieldCheck, Users } from "lucide-react";
import { useState } from "react";
import { StudentMentorDirectory } from "@/components/features/mentor/student-mentor-directory";
import { MentorAvailableSlots } from "@/components/features/mentor-schedule/mentor-available-slots";
import { MyBookingsList } from "@/components/features/mentor-schedule/my-bookings-list";
import { Badge } from "@/components/ui/badge";
import { useAllMentors } from "@/hooks/mentor-profile.hook";
import {
  useAvailableSchedules,
  useMyBookings,
} from "@/hooks/mentor-schedule.hook";
import type { IMentorProfile } from "@/types/mentor-profile.type";
import type { IBooking, IMentorSchedule } from "@/types/mentor-schedule.type";

export default function MentorBookingPage() {
  const [activeTab, setActiveTab] = useState<
    "directory" | "slots" | "bookings"
  >("directory");
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);

  const { data: mentorsRes } = useAllMentors();
  const { data: schedulesRes } = useAvailableSchedules();
  const { data: bookingsRes } = useMyBookings();

  const mentors: IMentorProfile[] = mentorsRes?.data ?? [];
  const schedules: IMentorSchedule[] = schedulesRes?.data ?? [];
  const bookings: IBooking[] = bookingsRes?.data ?? [];

  const openSlotsCount = schedules.filter((s) => !s.isBooked).length;
  const approvedMentors = mentors.filter(
    (m) => m.verificationStatus !== "REJECTED",
  );

  const mentorOptions = approvedMentors.map((m) => ({
    id: m.userId || m.id,
    name: `${m.user?.name || "Mentor"} (${m.institution || "University"})`,
  }));

  const handleSelectMentorFromDirectory = (mentorId: string) => {
    setSelectedMentorId(mentorId);
    setActiveTab("slots");
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full animate-in fade-in-50 duration-300">
      {/* ── 1. Hero Header ── */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/95 to-primary/5 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <ShieldCheck className="size-3.5" />
                Verified Academic Mentors
              </span>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                100% Free · 1-on-1 Guidance
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight sm:text-3xl text-foreground">
              1-on-1 Mentorship & Interview Guidance
            </h1>

            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              Connect directly with verified PhD scholars, university alumni,
              and researchers from leading global institutions to review your
              statements, mock interviews, and application strategy.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 shrink-0">
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-card border border-border/70 shadow-2xs text-center min-w-[90px]">
              <span className="text-xl font-black text-foreground">
                {approvedMentors.length}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase mt-0.5">
                Mentors
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-card border border-border/70 shadow-2xs text-center min-w-[90px]">
              <span className="text-xl font-black text-primary">
                {openSlotsCount}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase mt-0.5">
                Open Slots
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-card border border-border/70 shadow-2xs text-center min-w-[90px]">
              <span className="text-xl font-black text-foreground">
                {bookings.length}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase mt-0.5">
                My Bookings
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Interactive Navigation Tabs ── */}
      <div className="flex border-b border-border/60 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("directory")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3.5 text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "directory"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="size-4" />
          <span>Explore Mentors Directory</span>
          <Badge
            variant="secondary"
            className="ml-1 text-[10px] px-1.5 py-0 bg-primary/10 text-primary"
          >
            {approvedMentors.length}
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("slots")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3.5 text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "slots"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <CalendarCheck className="size-4" />
          <span>Available 1-on-1 Slots</span>
          {openSlotsCount > 0 && (
            <Badge className="ml-1 text-[10px] px-1.5 py-0 bg-emerald-600 text-white font-bold">
              {openSlotsCount}
            </Badge>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("bookings")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3.5 text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "bookings"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Clock className="size-4" />
          <span>My Booked Sessions</span>
          {bookings.length > 0 && (
            <Badge
              variant="outline"
              className="ml-1 text-[10px] px-1.5 py-0 font-medium"
            >
              {bookings.length}
            </Badge>
          )}
        </button>
      </div>

      {/* ── 3. Tab Content ── */}
      {activeTab === "directory" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-bold text-foreground">
              Choose an Academic Mentor
            </h3>
            <p className="text-xs text-muted-foreground">
              Filter by university affiliation, research expertise, or
              application specialty. Click &ldquo;Choose Mentor & View
              Slots&rdquo; to reserve a dedicated consultation.
            </p>
          </div>
          <StudentMentorDirectory
            onSelectMentorSlots={handleSelectMentorFromDirectory}
          />
        </div>
      )}

      {activeTab === "slots" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-bold text-foreground">
              Reserve a 1-on-1 Mentorship Slot
            </h3>
            <p className="text-xs text-muted-foreground">
              Select an open time slot that fits your schedule. A Google Meet
              link will be automatically generated and synced with your
              calendar.
            </p>
          </div>
          <MentorAvailableSlots
            selectedMentorId={selectedMentorId}
            onSelectMentor={setSelectedMentorId}
            mentorOptions={mentorOptions}
          />
        </div>
      )}

      {activeTab === "bookings" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-bold text-foreground">
              My Mentorship Sessions
            </h3>
            <p className="text-xs text-muted-foreground">
              Track your scheduled consultations, live sessions in progress, and
              completed past interviews.
            </p>
          </div>
          <MyBookingsList />
        </div>
      )}
    </div>
  );
}
