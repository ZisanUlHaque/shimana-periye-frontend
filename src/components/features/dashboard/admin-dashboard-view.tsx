"use client";

import {
  AlertTriangle,
  ArrowUpRight,
  Building,
  Building2,
  CheckCircle2,
  Compass,
  FlaskConical,
  GraduationCap,
  Layers,
  ListChecks,
  Mail,
  Plus,
  Search,
  Shield,
  Sparkles,
  TrendingUp,
  UserCheck,
  UserCog,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { OpportunityDialog } from "@/components/features/opportunity/opportunity-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useGetMe } from "@/hooks/auth.hook";
import { useAdminDashboard } from "@/hooks/dashboard.hook";
import { useApproveMentor } from "@/hooks/mentor-profile.hook";
import {
  type IMentorProfile,
  MentorVerificationStatus,
} from "@/types/mentor-profile.type";
import type { IUser } from "@/types/user.type";

export function AdminDashboardView() {
  const { data, isLoading } = useAdminDashboard();
  const { data: meRes } = useGetMe();
  const dashboard = data?.data;
  const currentAdmin = meRes?.data?.user || meRes?.data;
  const approveMutation = useApproveMentor();

  const [userSearch, setUserSearch] = useState("");

  // Rejection modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<IMentorProfile | null>(
    null,
  );
  const [rejectionReason, setRejectionReason] = useState("");

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
        <Skeleton className="h-48 rounded-3xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["skel-kpi-1", "skel-kpi-2", "skel-kpi-3", "skel-kpi-4"].map((k) => (
            <Skeleton key={k} className="h-32 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 rounded-2xl lg:col-span-2" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Safe data extraction
  const activeUsers =
    dashboard?.users?.active ?? dashboard?.totalActiveUsers ?? 0;
  const opportunities =
    dashboard?.opportunities?.total ?? dashboard?.totalOpportunities ?? 0;
  const applications =
    dashboard?.applications?.total ?? dashboard?.totalApplications ?? 0;
  const pendingMentors: IMentorProfile[] =
    dashboard?.mentors?.pendingList ?? dashboard?.pendingMentors ?? [];
  const recentUsers = (dashboard?.recentUsers ?? []) as IUser[];
  const roleBreakdown: Record<string, number> =
    dashboard?.users?.byRole ?? dashboard?.usersByRole ?? {};

  const handleApprove = (mentor: IMentorProfile) => {
    approveMutation.mutate({
      mentorProfileId: mentor.id,
      verificationStatus: MentorVerificationStatus.APPROVED,
    });
  };

  const openRejectDialog = (mentor: IMentorProfile) => {
    setSelectedMentor(mentor);
    setRejectionReason("");
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!selectedMentor || !rejectionReason.trim()) return;
    approveMutation.mutate(
      {
        mentorProfileId: selectedMentor.id,
        verificationStatus: MentorVerificationStatus.REJECTED,
        rejectionReason: rejectionReason.trim(),
      },
      {
        onSuccess: () => {
          setRejectModalOpen(false);
          setSelectedMentor(null);
        },
      },
    );
  };

  const filteredUsers = recentUsers.filter((u: IUser) => {
    const q = userSearch.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full animate-in fade-in-50 duration-300">
      {/* ── 1. Executive Hero Header ── */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/95 to-primary/5 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Shield className="size-3.5" />
                Executive Command Center
              </span>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                All Systems Operational
              </span>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                · {todayStr}
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight sm:text-3xl text-foreground">
              Welcome back, {currentAdmin?.name || "Administrator"}
            </h1>

            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              Global governance portal for scholar opportunities, mentor
              credential verification, and user access moderation.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <OpportunityDialog
              trigger={
                <Button
                  size="sm"
                  className="text-xs gap-1.5 rounded-xl h-9 bg-primary shadow-xs font-semibold"
                >
                  <Plus className="size-4" />
                  New Opportunity
                </Button>
              }
            />
            <Link href="/admin/users">
              <Button
                size="sm"
                variant="outline"
                className="text-xs gap-1.5 rounded-xl h-9 font-medium"
              >
                <Users className="size-3.5 text-primary" />
                User Management
              </Button>
            </Link>
            <Link href="/admin/mentors">
              <Button
                size="sm"
                variant="outline"
                className="text-xs gap-1.5 rounded-xl h-9 font-medium"
              >
                <UserCheck className="size-3.5 text-primary" />
                Mentor Approvals
                {pendingMentors.length > 0 && (
                  <span className="ml-1 size-2 rounded-full bg-amber-500 animate-pulse" />
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* ── 2. Top Executive KPI Metric Strip ── */}
        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border/60 pt-6 lg:grid-cols-4">
          {/* Card 1: Total Users */}
          <Link
            href="/admin/users"
            className="group flex flex-col justify-between rounded-2xl bg-card border border-border/60 p-4 shadow-2xs hover:border-primary/40 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Total Accounts
              </span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                <Users className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-foreground">
                {activeUsers}
              </span>
              <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
                  <TrendingUp className="size-3 mr-0.5" />
                  Active
                </span>
                <span>platform members</span>
              </p>
            </div>
          </Link>

          {/* Card 2: Catalog Opportunities */}
          <Link
            href="/admin/opportunities"
            className="group flex flex-col justify-between rounded-2xl bg-card border border-border/60 p-4 shadow-2xs hover:border-blue-500/40 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Opportunities
              </span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 group-hover:scale-105 transition-transform">
                <GraduationCap className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                {opportunities}
              </span>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Curated scholarships & programs
              </p>
            </div>
          </Link>

          {/* Card 3: Applications */}
          <div className="flex flex-col justify-between rounded-2xl bg-card border border-border/60 p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                Applications
              </span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
                <Building2 className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-purple-600 dark:text-purple-400">
                {applications}
              </span>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Scholarly submissions tracked
              </p>
            </div>
          </div>

          {/* Card 4: Pending Mentors */}
          <Link
            href="/admin/mentors"
            className="group flex flex-col justify-between rounded-2xl bg-card border border-border/60 p-4 shadow-2xs hover:border-amber-500/40 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Mentor Queue
              </span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 group-hover:scale-105 transition-transform">
                <UserCheck className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                  {pendingMentors.length}
                </span>
                {pendingMentors.length > 0 && (
                  <Badge className="bg-amber-500 text-white text-[10px] px-1.5 py-0 h-4 font-bold">
                    Action Required
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {pendingMentors.length > 0
                  ? "Pending verification"
                  : "Queue all cleared"}
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* ── 3. Main Dashboard Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Verification Queue & Recent Accounts */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Pending Mentor Verification Section */}
          <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/60 pb-4">
              <div>
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <UserCheck className="size-4 text-primary" />
                  Mentor Verification Queue
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Inspect candidate credentials and approve mentorship
                  privileges.
                </p>
              </div>
              <Link href="/admin/mentors">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs gap-1 text-primary hover:text-primary"
                >
                  View All Mentors
                  <ArrowUpRight className="size-3.5" />
                </Button>
              </Link>
            </div>

            {pendingMentors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 mb-2">
                  <CheckCircle2 className="size-6" />
                </div>
                <h3 className="text-sm font-bold text-foreground">
                  Verification Queue Clear
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mt-0.5">
                  All mentor submissions have been reviewed. New applications
                  will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {pendingMentors.slice(0, 3).map((item: IMentorProfile) => {
                  const userName = item.user?.name ?? "Applicant";
                  const userEmail = item.user?.email ?? "";
                  const institution =
                    item.institution ?? "Institution not specified";
                  const designation =
                    item.designation ?? "Designation not specified";
                  const expertise = item.expertise ?? [];

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 py-4 first:pt-1 last:pb-1"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <Avatar className="size-10 border border-border/70 shrink-0">
                            <AvatarImage
                              src={item.user?.imageUrl ?? undefined}
                            />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                              {userName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-xs text-foreground truncate">
                                {userName}
                              </span>
                              <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px] px-2 py-0">
                                Pending
                              </Badge>
                            </div>
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Mail className="size-3 shrink-0" />
                              {userEmail}
                            </span>
                            <div className="text-[11px] text-foreground/80 mt-1 flex items-center gap-2 flex-wrap">
                              <span className="flex items-center gap-1 font-medium">
                                <Building className="size-3 text-primary shrink-0" />
                                {institution}
                              </span>
                              <span>·</span>
                              <span>{designation}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <Button
                            size="sm"
                            className="gap-1.5 text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold"
                            disabled={approveMutation.isPending}
                            onClick={() => handleApprove(item)}
                          >
                            <CheckCircle2 className="size-3.5" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 text-xs h-8 text-destructive border-destructive/30 hover:bg-destructive/10 rounded-lg"
                            disabled={approveMutation.isPending}
                            onClick={() => openRejectDialog(item)}
                          >
                            <XCircle className="size-3.5" />
                            Reject
                          </Button>
                        </div>
                      </div>

                      {expertise.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {expertise.slice(0, 4).map((tag: string) => (
                            <span
                              key={tag}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Registrations Table Card */}
          <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
              <div>
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Users className="size-4 text-primary" />
                  Recent Registrations & Access Status
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Platform users registered across all access tiers.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative min-w-[200px]">
                  <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="h-8 pl-8 text-xs bg-background"
                  />
                </div>
                <Link href="/admin/users">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 rounded-lg"
                  >
                    Manage All
                  </Button>
                </Link>
              </div>
            </div>

            <div className="divide-y divide-border/60">
              {filteredUsers.length === 0 ? (
                <div className="py-10 text-center text-xs text-muted-foreground">
                  No matching user records found.
                </div>
              ) : (
                filteredUsers.slice(0, 6).map((user: IUser) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between py-3 text-xs hover:bg-muted/30 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="size-9 rounded-full border border-border/70 shrink-0">
                        <AvatarImage src={user.imageUrl ?? undefined} />
                        <AvatarFallback className="text-[11px] font-bold bg-primary/10 text-primary">
                          {user.name?.slice(0, 2).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <span className="font-semibold text-foreground text-xs block truncate">
                          {user.name}
                        </span>
                        <span className="text-muted-foreground text-[11px] truncate block">
                          {user.email}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold px-2 py-0 ${
                          user.role === "ADMIN"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                            : user.role === "MENTOR"
                              ? "border-purple-500/30 bg-purple-500/10 text-purple-600"
                              : "border-blue-500/30 bg-blue-500/10 text-blue-600"
                        }`}
                      >
                        {user.role}
                      </Badge>
                      <Badge
                        className={`text-[10px] font-bold px-2 py-0 ${
                          user.status === "ACTIVE" || !user.status
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : "bg-destructive/10 text-destructive border border-destructive/20"
                        }`}
                      >
                        {user.status ?? "ACTIVE"}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Catalog Matrix & System Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Catalog & Directory Hub */}
          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Compass className="size-3.5 text-primary" />
              Catalog & Resource Matrix
            </h3>

            <div className="grid grid-cols-1 gap-2 pt-1">
              <Link
                href="/admin/opportunities"
                className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:border-primary/40 hover:bg-muted/40 transition-all text-xs font-medium"
              >
                <span className="flex items-center gap-2 text-foreground">
                  <GraduationCap className="size-4 text-primary" />
                  Opportunities Catalog
                </span>
                <span className="font-bold text-foreground">
                  {opportunities}
                </span>
              </Link>

              <Link
                href="/admin/requirements"
                className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:border-primary/40 hover:bg-muted/40 transition-all text-xs font-medium"
              >
                <span className="flex items-center gap-2 text-foreground">
                  <ListChecks className="size-4 text-emerald-500" />
                  Requirements Matrix
                </span>
                <span className="text-muted-foreground">→</span>
              </Link>

              <Link
                href="/admin/universities"
                className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:border-primary/40 hover:bg-muted/40 transition-all text-xs font-medium"
              >
                <span className="flex items-center gap-2 text-foreground">
                  <Building2 className="size-4 text-blue-500" />
                  Universities Directory
                </span>
                <span className="text-muted-foreground">→</span>
              </Link>

              <Link
                href="/admin/professors"
                className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:border-primary/40 hover:bg-muted/40 transition-all text-xs font-medium"
              >
                <span className="flex items-center gap-2 text-foreground">
                  <Sparkles className="size-4 text-purple-500" />
                  Professors & Faculty
                </span>
                <span className="text-muted-foreground">→</span>
              </Link>

              <Link
                href="/admin/labs"
                className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:border-primary/40 hover:bg-muted/40 transition-all text-xs font-medium"
              >
                <span className="flex items-center gap-2 text-foreground">
                  <FlaskConical className="size-4 text-amber-500" />
                  Research Laboratories
                </span>
                <span className="text-muted-foreground">→</span>
              </Link>
            </div>
          </div>

          {/* Role Distribution Stats */}
          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Layers className="size-3.5 text-primary" />
              Role Distribution
            </h3>

            <div className="space-y-2.5 pt-1">
              {Object.entries(roleBreakdown).map(([role, count]) => (
                <div
                  key={role}
                  className="flex items-center justify-between rounded-xl bg-muted/40 p-2.5 text-xs border border-border/40"
                >
                  <span className="font-semibold text-foreground">{role}</span>
                  <Badge
                    variant="secondary"
                    className="font-mono font-bold text-xs"
                  >
                    {String(count)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Identity Shortcut */}
          <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-card to-muted/40 p-5 shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="size-10 border border-primary/20 shrink-0">
                <AvatarImage src={currentAdmin?.imageUrl ?? undefined} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  {currentAdmin?.name?.[0]?.toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <span className="text-xs font-bold text-foreground block truncate">
                  {currentAdmin?.name || "Root Admin"}
                </span>
                <span className="text-[11px] text-muted-foreground block truncate">
                  {currentAdmin?.email}
                </span>
              </div>
            </div>

            <Link href="/admin/profile">
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs gap-1 rounded-lg"
              >
                <UserCog className="size-3.5" />
                Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── 4. Reject Reason Dialog ── */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-5" />
              Reject Mentor Application
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Provide a reason for rejecting{" "}
              <strong>{selectedMentor?.user?.name}</strong>&apos;s application.
              This feedback helps applicants improve.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <Textarea
              rows={4}
              placeholder="e.g. Current credentials or affiliation could not be verified..."
              className="text-xs"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setRejectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="text-xs"
              disabled={!rejectionReason.trim() || approveMutation.isPending}
              onClick={handleConfirmReject}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
