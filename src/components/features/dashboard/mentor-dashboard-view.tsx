"use client";

import { useMentorDashboard } from "@/hooks/dashboard.hook";
import { StatCard } from "@/components/shared/stat-card";
import {
  Users,
  FileCheck,
  CalendarCheck,
  GraduationCap,
  ArrowUpRight,
  Mail,
  FileText,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function MentorDashboardView() {
  const { data, isLoading } = useMentorDashboard();
  const dashboard = data?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
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

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Top Banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
            <Sparkles className="size-3" />
            Mentor Guidance Station
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1">
            Mentorship & Review Hub
          </h1>
          <p className="text-xs text-muted-foreground">
            Track student application pipelines, review draft statements, and coordinate advising sessions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/mentor/schedule">
            <Button size="sm" variant="outline" className="text-xs gap-1.5">
              <Calendar className="size-3.5" />
              Manage Slots & Schedule
            </Button>
          </Link>
          <Link href="/mentor/applications">
            <Button size="sm" className="text-xs gap-1.5">
              <BookOpen className="size-3.5" />
              Application Reviews
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Assigned Mentees"
          value={String(totalStudents)}
          icon={Users}
          accent="primary"
        />
        <StatCard
          label="Documents Awaiting Review"
          value={String(totalAwaiting)}
          icon={FileCheck}
          accent={totalAwaiting > 0 ? "amber" : "primary"}
        />
        <StatCard
          label="Advising Availability"
          value="Configured"
          icon={CalendarCheck}
          accent="blue"
        />
      </div>

      {/* Mentees Table / List */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Assigned Students & Document Reviews
            </h3>
            <p className="text-xs text-muted-foreground">
              Monitor active mentees, review pending SOP drafts, and provide constructive feedback.
            </p>
          </div>
          <Badge variant="outline">{students.length} Mentees</Badge>
        </div>

        {students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
              <Users className="size-6" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">No Students Assigned Yet</h4>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              Once an administrator or student pairs with you for academic advising, their profile and document submissions will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {students.map((student: any) => (
              <div
                key={student.studentProfileId}
                className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between transition-colors hover:bg-muted/10 rounded-xl px-2"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="size-11 rounded-xl">
                    <AvatarImage src={student.imageUrl ?? undefined} />
                    <AvatarFallback className="rounded-xl font-bold bg-primary/10 text-primary">
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

                <div className="flex flex-wrap items-center gap-6 text-xs">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-muted-foreground">Applications</span>
                    <span className="font-semibold text-foreground">
                      {student.applicationCount} total ({student.submittedApplicationCount} submitted)
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[11px] text-muted-foreground">Pending Review</span>
                    <span
                      className={`font-semibold ${
                        student.documentsAwaitingReview > 0
                          ? "text-amber-600 font-bold"
                          : "text-foreground"
                      }`}
                    >
                      {student.documentsAwaitingReview} documents
                    </span>
                  </div>

                  <Link href={`/mentor/applications`}>
                    <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                      <FileText className="size-3.5" />
                      Review Profile & Docs
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mentorship Quick Actions & Resources */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="size-4 text-primary" />
            <h4 className="text-sm font-bold text-foreground">1-on-1 Consultation Calendar</h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Create custom bookable time slots for SOP critique, CV overhaul, and mock academic interviews. Students can instantly select open time windows.
          </p>
          <div className="mt-4">
            <Link href="/mentor/schedule">
              <Button size="sm" variant="secondary" className="text-xs gap-1.5">
                Manage Schedule Slots →
              </Button>
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="size-4 text-primary" />
            <h4 className="text-sm font-bold text-foreground">Statement of Purpose Rubric</h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Evaluate applicant SOP drafts based on research clarity, alignment with target faculty lab objectives, and quantified academic accomplishments.
          </p>
          <div className="mt-4">
            <Link href="/mentor/applications">
              <Button size="sm" variant="secondary" className="text-xs gap-1.5">
                Inspect Document Drafts →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
