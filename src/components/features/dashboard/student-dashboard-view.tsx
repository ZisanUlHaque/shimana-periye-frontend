"use client";

import { useStudentDashboard } from "@/hooks/dashboard.hook";
import { useGetMe } from "@/hooks/auth.hook";
import { useGetMyOutreachLogs } from "@/hooks/outreach-log.hook";
import { useOpportunities } from "@/hooks/opportunity.hook";
import { useMyShortlist } from "@/hooks/shortlist.hook";
import {
  Compass,
  Mail,
  Send,
  MessageSquareCheck,
  FolderKanban,
  Trophy,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Building2,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function StudentDashboardView() {
  const { data: userRes } = useGetMe();
  const user = userRes?.data?.user || userRes?.data;
  const studentProfile = user?.studentProfile;

  const { data: dashRes, isLoading: isDashLoading } = useStudentDashboard();
  const dashboard = dashRes?.data;

  const { data: outreachRes } = useGetMyOutreachLogs();
  const outreachLogs = outreachRes?.data ?? [];

  const { data: oppsRes } = useOpportunities();
  const opportunities = oppsRes?.data ?? [];

  const { data: shortlistedItems = [] } = useMyShortlist();

  if (isDashLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-44 rounded-3xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-72 rounded-2xl lg:col-span-2" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    );
  }

  const counts = dashboard?.counts ?? {
    shortlistedOpportunities: shortlistedItems.length,
    applications: 0,
    pendingTasks: 0,
    documentsInReview: 0,
    documentsApproved: 0,
    unreadReminders: 0,
  };

  const readinessScore = dashboard?.readiness?.overallScore ?? 0;
  const upcomingReminders = Array.isArray(dashboard?.upcomingReminders)
    ? dashboard.upcomingReminders
    : [];
  const recentReminders = Array.isArray(dashboard?.recentReminders)
    ? dashboard.recentReminders
    : [];

  // Outreach metrics
  const totalOutreach = outreachLogs.length;
  const repliedOutreach = outreachLogs.filter((o: any) => o.status === "REPLIED").length;
  const pendingOutreach = outreachLogs.filter((o: any) => o.status === "SENT" || o.status === "PENDING" || o.status === "SUBMITTED").length;

  // Pipeline counts
  const appsByStatus: Record<string, number> = (dashboard?.applicationsByStatus ?? {}) as any;
  const submittedCount =
    (appsByStatus["SUBMITTED"] ?? 0) +
    (appsByStatus["INTERVIEW"] ?? 0);
  const decisionCount = appsByStatus["DECISION"] ?? 0;

  return (
    <div className="flex flex-col gap-6">
      {/* ── 1. ProfReach Hero Banner / Profile Strip ── */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/95 to-primary/5 p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="size-16 rounded-2xl ring-2 ring-primary/20 shadow-sm">
              <AvatarImage src={user?.imageUrl ?? undefined} />
              <AvatarFallback className="rounded-2xl bg-primary/10 text-primary font-bold text-lg">
                {(user?.name ?? "S").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Welcome, {user?.name || "Scholar"}
                </h2>
                <Badge
                  variant="outline"
                  className="gap-1 border-primary/30 bg-primary/10 text-primary text-[11px]"
                >
                  <Sparkles className="size-3" />
                  Applicant Portal
                </Badge>
              </div>

              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                Track faculty cold-emailing, manage lab matches, and automate graduate admissions.
              </p>

              {/* Research Interests Tags */}
              {studentProfile?.interests && studentProfile.interests.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-medium text-muted-foreground/80">
                    Focus:
                  </span>
                  {studentProfile.interests.slice(0, 4).map((interest: string, i: number) => (
                    <span
                      key={i}
                      className="rounded-full border border-border/60 bg-muted/40 px-2.5 py-0.5 text-[11px] font-medium text-foreground"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Readiness Pill */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card/80 px-4 py-2.5 shadow-2xs backdrop-blur-xs">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-extrabold text-sm">
                {readinessScore}%
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  Readiness
                </span>
                <Link
                  href="/student/readiness"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  View Checklist →
                </Link>
              </div>
            </div>

            <Link href="/student/opportunities">
              <Button size="sm" className="gap-2 text-xs shadow-xs">
                <Compass className="size-3.5" />
                Find Professors & Labs
              </Button>
            </Link>

            <Link href="/student/outreach">
              <Button size="sm" variant="outline" className="gap-2 text-xs">
                <Mail className="size-3.5 text-primary" />
                Log Outreach
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. ProfReach Outreach & Admissions Pipeline Funnel ── */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Academic Outreach & Application Funnel
            </h3>
            <p className="text-xs text-muted-foreground">
              Stages from professor shortlisting to offers & assistantships
            </p>
          </div>
          <Link
            href="/student/outreach"
            className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
          >
            Manage Outreach Logs
            <ChevronRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 pt-2">
          {/* Stage 1: Shortlisted */}
          <div className="flex flex-col justify-between rounded-xl border border-border/60 bg-muted/20 p-3.5 transition-all hover:border-primary/40">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-medium">1. Shortlisted</span>
              <Compass className="size-3.5 text-primary" />
            </div>
            <div className="mt-2 text-2xl font-black text-foreground">
              {counts.shortlistedOpportunities}
            </div>
            <span className="text-[10px] text-muted-foreground/80 mt-1">
              Target labs & openings
            </span>
          </div>

          {/* Stage 2: Outreach Sent */}
          <div className="flex flex-col justify-between rounded-xl border border-border/60 bg-muted/20 p-3.5 transition-all hover:border-blue-500/40">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-medium">2. Cold Emails</span>
              <Send className="size-3.5 text-blue-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-foreground">
              {totalOutreach}
            </div>
            <span className="text-[10px] text-muted-foreground/80 mt-1">
              {pendingOutreach} awaiting reply
            </span>
          </div>

          {/* Stage 3: Positive Replies */}
          <div className="flex flex-col justify-between rounded-xl border border-border/60 bg-muted/20 p-3.5 transition-all hover:border-green-500/40">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-medium">3. Professor Replies</span>
              <MessageSquareCheck className="size-3.5 text-green-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-green-600">
              {repliedOutreach}
            </div>
            <span className="text-[10px] text-muted-foreground/80 mt-1">
              Positive responses
            </span>
          </div>

          {/* Stage 4: Formal Applications */}
          <div className="flex flex-col justify-between rounded-xl border border-border/60 bg-muted/20 p-3.5 transition-all hover:border-violet-500/40">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-medium">4. Submitted</span>
              <FolderKanban className="size-3.5 text-violet-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-foreground">
              {submittedCount}
            </div>
            <span className="text-[10px] text-muted-foreground/80 mt-1">
              Applications filed
            </span>
          </div>

          {/* Stage 5: Offers & Decisions */}
          <div className="col-span-2 sm:col-span-1 flex flex-col justify-between rounded-xl border border-border/60 bg-primary/5 p-3.5 transition-all hover:border-primary/50">
            <div className="flex items-center justify-between text-primary font-medium">
              <span className="text-[11px]">5. Decisions</span>
              <Trophy className="size-3.5 text-primary" />
            </div>
            <div className="mt-2 text-2xl font-black text-primary">
              {decisionCount}
            </div>
            <span className="text-[10px] text-primary/80 mt-1">
              Offers & funding
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. Main Split Grid: Recommended Professor Matches + Cold Outreach Hub ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Matched Professors & Opportunities Spotlight */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">
                Top Matched Opportunities & Labs
              </h3>
              <p className="text-xs text-muted-foreground">
                Ranked by research alignment with your interests, skills, and academic profile
              </p>
            </div>
            <Link href="/student/opportunities">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                Explore all ({opportunities.length})
                <ArrowUpRight className="size-3.5" />
              </Button>
            </Link>
          </div>

          {opportunities.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
              No opportunities loaded in catalog yet.
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {opportunities.slice(0, 4).map((opp: any) => (
                <div
                  key={opp.id}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between transition-colors hover:bg-muted/10 rounded-xl px-2"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <GraduationCap className="size-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-foreground line-clamp-1">
                          {opp.title}
                        </h4>
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {opp.type.toLowerCase().replace(/_/g, " ")}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground mt-0.5">
                        {opp.university?.name ?? "University"} · {opp.fieldOfStudy}
                      </p>

                      {opp.professor && (
                        <span className="text-[11px] text-primary/90 mt-1 inline-flex items-center gap-1 font-medium">
                          Faculty: {opp.professor.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <Link href={`/student/opportunities/${opp.id}`}>
                      <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                        View Match
                        <ArrowRight className="size-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Hub Navigation Cards */}
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-border/60 pt-4">
            <Link href="/student/mentor-booking">
              <div className="flex flex-col gap-1 rounded-xl border border-border/60 bg-muted/20 p-3 hover:border-primary/50 transition-colors">
                <Video className="size-4 text-primary" />
                <span className="text-xs font-semibold text-foreground mt-1">
                  1-on-1 Mentors
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Book essay & lab advice
                </span>
              </div>
            </Link>

            <Link href="/student/interview-practice">
              <div className="flex flex-col gap-1 rounded-xl border border-border/60 bg-muted/20 p-3 hover:border-primary/50 transition-colors">
                <Sparkles className="size-4 text-violet-500" />
                <span className="text-xs font-semibold text-foreground mt-1">
                  AI Mock Interview
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Practice questions
                </span>
              </div>
            </Link>

            <Link href="/student/fundings">
              <div className="flex flex-col gap-1 rounded-xl border border-border/60 bg-muted/20 p-3 hover:border-primary/50 transition-colors">
                <Trophy className="size-4 text-amber-500" />
                <span className="text-xs font-semibold text-foreground mt-1">
                  Scholarships
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Track awards & stipends
                </span>
              </div>
            </Link>

            <Link href="/student/documents">
              <div className="flex flex-col gap-1 rounded-xl border border-border/60 bg-muted/20 p-3 hover:border-primary/50 transition-colors">
                <FileCheck2 className="size-4 text-blue-500" />
                <span className="text-xs font-semibold text-foreground mt-1">
                  Document Hub
                </span>
                <span className="text-[11px] text-muted-foreground">
                  CV, SOP & AI Scoring
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Right Col: Recent Outreach Activity & Deadlines */}
        <div className="flex flex-col gap-6">
          {/* Outreach Activity Tracker */}
          <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-primary" />
                <h4 className="text-sm font-bold text-foreground">
                  Recent Cold Outreach
                </h4>
              </div>
              <Link
                href="/student/outreach"
                className="text-xs font-medium text-primary hover:underline"
              >
                View all
              </Link>
            </div>

            {outreachLogs.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
                No faculty outreach logs yet.
                <div className="mt-2">
                  <Link href="/student/outreach">
                    <Button size="xs" variant="outline">
                      Log First Contact
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {outreachLogs.slice(0, 4).map((log: any) => (
                  <div
                    key={log.id}
                    className="flex flex-col justify-between rounded-xl border border-border/60 bg-muted/20 p-3 text-xs"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <h5 className="font-semibold text-foreground line-clamp-1">
                          {log.professor?.name || "Professor"}
                        </h5>
                        <p className="text-[11px] text-muted-foreground">
                          {log.university?.name || "University"}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] uppercase font-bold ${
                          log.status === "REPLIED"
                            ? "border-green-500/30 bg-green-500/10 text-green-600"
                            : "border-border bg-muted/40 text-muted-foreground"
                        }`}
                      >
                        {log.status}
                      </Badge>
                    </div>

                    <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-1.5 text-[10px] text-muted-foreground">
                      <span>Sent: {new Date(log.contactedDate).toLocaleDateString()}</span>
                      {log.replyDate && (
                        <span className="text-green-600 font-medium">
                          Replied: {new Date(log.replyDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Deadlines / Calendar Widget */}
          <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-primary" />
                <h4 className="text-sm font-bold text-foreground">
                  Upcoming Deadlines
                </h4>
              </div>
              <Link
                href="/student/calendar"
                className="text-xs font-medium text-primary hover:underline"
              >
                Calendar
              </Link>
            </div>

            {upcomingReminders.length === 0 && recentReminders.length === 0 ? (
              <p className="py-4 text-center text-xs text-muted-foreground">
                No immediate deadline alerts.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {[...upcomingReminders, ...recentReminders].slice(0, 3).map((r) => (
                  <div
                    key={r.id}
                    className="flex flex-col rounded-xl border border-border/60 bg-muted/20 p-2.5 text-xs"
                  >
                    <span className="font-semibold text-foreground line-clamp-1">
                      {r.title}
                    </span>
                    <span className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                      {r.message}
                    </span>
                    <span className="text-[10px] text-muted-foreground/80 mt-1">
                      Date: {new Date(r.scheduledFor).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
