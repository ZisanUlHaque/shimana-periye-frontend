"use client";

import { useState } from "react";
import { useAdminDashboard } from "@/hooks/dashboard.hook";
import { useApproveMentor } from "@/hooks/mentor-profile.hook";
import { StatCard } from "@/components/shared/stat-card";
import {
  Users,
  GraduationCap,
  Building2,
  UserCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ExternalLink,
  Shield,
  FileText,
  Mail,
  Building,
  Briefcase,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Layers,
  BookOpen,
  Award,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function AdminDashboardView() {
  const { data, isLoading } = useAdminDashboard();
  const dashboard = data?.data;
  const approveMutation = useApproveMentor();

  const [activeTab, setActiveTab] = useState<"mentors" | "users" | "catalog">("mentors");
  const [userSearch, setUserSearch] = useState("");

  // Rejection modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <Skeleton className="h-44 rounded-3xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  // Safe data extraction
  const activeUsers = dashboard?.users?.active ?? dashboard?.totalActiveUsers ?? 0;
  const opportunities = dashboard?.opportunities?.total ?? dashboard?.totalOpportunities ?? 0;
  const applications = dashboard?.applications?.total ?? dashboard?.totalApplications ?? 0;
  const pendingMentors =
    dashboard?.mentors?.pendingList ?? dashboard?.pendingMentors ?? [];
  const recentUsers = dashboard?.recentUsers ?? [];
  const roleBreakdown = dashboard?.users?.byRole ?? dashboard?.usersByRole ?? {};

  const handleApprove = (mentor: any) => {
    approveMutation.mutate({
      mentorProfileId: mentor.id,
      verificationStatus: "APPROVED" as any,
    });
  };

  const openRejectDialog = (mentor: any) => {
    setSelectedMentor(mentor);
    setRejectionReason("");
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!selectedMentor || !rejectionReason.trim()) return;
    approveMutation.mutate(
      {
        mentorProfileId: selectedMentor.id,
        verificationStatus: "REJECTED" as any,
        rejectionReason: rejectionReason.trim(),
      },
      {
        onSuccess: () => {
          setRejectModalOpen(false);
          setSelectedMentor(null);
        },
      }
    );
  };

  const filteredUsers = recentUsers.filter((u: any) => {
    const q = userSearch.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
      {/* ── 1. Executive Hero Header ── */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/95 to-primary/5 p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                <Shield className="size-3.5" />
                Administrative Command Center
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                System Operational
              </span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
              Platform Governance & Verification
            </h1>

            <p className="text-xs text-muted-foreground max-w-xl">
              Oversee scholar registrations, authenticate academic mentor credentials, and maintain the global opportunity catalog.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link href="/admin/opportunities">
              <Button size="sm" variant="outline" className="text-xs gap-1.5 rounded-xl h-9">
                <GraduationCap className="size-3.5" />
                Manage Opportunities
              </Button>
            </Link>
            <Link href="/apply-mentor" target="_blank">
              <Button size="sm" className="text-xs gap-1.5 rounded-xl h-9 bg-primary shadow-xs">
                <ExternalLink className="size-3.5" />
                Public Mentor Application
              </Button>
            </Link>
          </div>
        </div>

        {/* ── 2. Top Executive KPI Metric Strip ── */}
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border/60 pt-6 sm:grid-cols-4">
          <div className="flex flex-col rounded-2xl bg-muted/40 p-4 border border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Total Users
              </span>
              <Users className="size-4 text-primary" />
            </div>
            <span className="mt-2 text-2xl font-black text-foreground">
              {activeUsers}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              Active platform members
            </span>
          </div>

          <div className="flex flex-col rounded-2xl bg-blue-500/5 p-4 border border-blue-500/20">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Catalog Size
              </span>
              <GraduationCap className="size-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="mt-2 text-2xl font-black text-blue-600 dark:text-blue-400">
              {opportunities}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              Curated scholarship programs
            </span>
          </div>

          <div className="flex flex-col rounded-2xl bg-violet-500/5 p-4 border border-violet-500/20">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                Applications
              </span>
              <Building2 className="size-4 text-violet-600 dark:text-violet-400" />
            </div>
            <span className="mt-2 text-2xl font-black text-violet-600 dark:text-violet-400">
              {applications}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              Student submissions tracked
            </span>
          </div>

          <div className="flex flex-col rounded-2xl bg-amber-500/5 p-4 border border-amber-500/20">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Pending Mentors
              </span>
              <UserCheck className="size-4 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400">
              {pendingMentors.length}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              {pendingMentors.length > 0 ? "Requires admin review" : "Queue all cleared"}
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. Interactive Management Tabs ── */}
      <div className="flex border-b border-border/60">
        <button
          type="button"
          onClick={() => setActiveTab("mentors")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3.5 text-xs font-semibold transition-all ${
            activeTab === "mentors"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <UserCheck className="size-4" />
          <span>Mentor Verification Queue</span>
          {pendingMentors.length > 0 && (
            <Badge variant="default" className="ml-1 text-[10px] px-2 py-0.5 h-4.5 bg-amber-600">
              {pendingMentors.length}
            </Badge>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3.5 text-xs font-semibold transition-all ${
            activeTab === "users"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="size-4" />
          <span>User Registry & Roles</span>
          <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0 h-4">
            {recentUsers.length}
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("catalog")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3.5 text-xs font-semibold transition-all ${
            activeTab === "catalog"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Building2 className="size-4" />
          <span>Catalog & System Directory</span>
        </button>
      </div>

      {/* ── 4. Tab 1: Mentor Verification Queue ── */}
      {activeTab === "mentors" && (
        <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/60 pb-4">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Mentor Application Approvals
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Examine credentials, institutional affiliations, and research specializations before granting mentor privileges.
              </p>
            </div>
            <Badge variant="outline" className="text-xs w-fit">
              {pendingMentors.length} Awaiting Decision
            </Badge>
          </div>

          {pendingMentors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 mb-3">
                <CheckCircle2 className="size-7" />
              </div>
              <h3 className="text-sm font-bold text-foreground">
                All Applications Reviewed
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mt-1">
                There are no pending mentor applications awaiting verification at this time. All submissions have been processed.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {pendingMentors.map((item: any) => {
                const userName = item.user?.name ?? "Applicant";
                const userEmail = item.user?.email ?? "";
                const institution = item.institution ?? "Not specified";
                const designation = item.designation ?? "Not specified";
                const contactNumber = item.contactNumber;
                const bio = item.bio;
                const expertise = item.expertise ?? [];

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 py-5 transition-colors hover:bg-muted/10 rounded-xl px-3"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex items-start gap-3.5">
                        <Avatar className="size-12 rounded-xl ring-2 ring-primary/20 shrink-0">
                          <AvatarImage src={item.user?.imageUrl ?? undefined} />
                          <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold text-sm">
                            {userName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-bold text-foreground">
                              {userName}
                            </h3>
                            <span className="rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 text-[10px] font-semibold">
                              Pending Verification
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Mail className="size-3 text-muted-foreground" />
                              {userEmail}
                            </span>
                            {institution && (
                              <span className="flex items-center gap-1.5">
                                <Building className="size-3 text-muted-foreground" />
                                {institution}
                              </span>
                            )}
                            {designation && (
                              <span className="flex items-center gap-1.5">
                                <Briefcase className="size-3 text-muted-foreground" />
                                {designation}
                              </span>
                            )}
                          </div>

                          {contactNumber && (
                            <div className="text-[11px] text-muted-foreground">
                              Contact Phone: {contactNumber}
                            </div>
                          )}

                          {bio && (
                            <div className="mt-2 text-xs text-foreground/90 bg-muted/40 p-3 rounded-xl border border-border/40 max-w-2xl leading-relaxed italic">
                              "{bio}"
                            </div>
                          )}

                          {expertise.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                              <span className="text-[10px] text-muted-foreground font-semibold uppercase">
                                Expertise:
                              </span>
                              {expertise.map((tag: string) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-[10px] px-2 py-0.5 font-medium"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end lg:self-start">
                        <Button
                          size="sm"
                          className="gap-1.5 text-xs h-9 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                          disabled={approveMutation.isPending}
                          onClick={() => handleApprove(item)}
                        >
                          <CheckCircle2 className="size-3.5" />
                          Approve Mentor
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 text-xs h-9 text-destructive hover:bg-destructive/10"
                          disabled={approveMutation.isPending}
                          onClick={() => openRejectDialog(item)}
                        >
                          <XCircle className="size-3.5" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── 5. Tab 2: User Registry & Roles ── */}
      {activeTab === "users" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
              <div>
                <h2 className="text-base font-bold text-foreground">
                  User Accounts Directory
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Platform users registered across all access tiers.
                </p>
              </div>

              <div className="relative min-w-[220px]">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Filter users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="h-8 pl-8 text-xs bg-muted/40"
                />
              </div>
            </div>

            <div className="divide-y divide-border/60">
              {filteredUsers.length === 0 ? (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  No matching user records found.
                </div>
              ) : (
                filteredUsers.map((user: any) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between py-3.5 text-xs hover:bg-muted/10 px-2 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8 rounded-lg ring-1 ring-border">
                        <AvatarImage src={user.imageUrl ?? undefined} />
                        <AvatarFallback className="rounded-lg text-[11px] font-bold">
                          {user.name?.slice(0, 2).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-bold text-foreground block">
                          {user.name}
                        </span>
                        <span className="text-muted-foreground text-[11px]">
                          {user.email}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-md border border-border/70 bg-muted/50 px-2 py-0.5 text-[10px] font-semibold text-foreground">
                        {user.role}
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          user.status === "ACTIVE" || !user.status
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {user.status ?? "ACTIVE"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Role Breakdown Stats */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-xs">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Layers className="size-4 text-primary" />
                Role Distribution
              </h2>
              <div className="space-y-3 pt-1">
                {Object.entries(roleBreakdown).map(([role, count]) => (
                  <div
                    key={role}
                    className="flex items-center justify-between rounded-xl bg-muted/40 p-3 text-xs border border-border/40"
                  >
                    <span className="font-semibold text-foreground">{role}</span>
                    <span className="font-black text-primary text-sm">
                      {String(count)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs flex flex-col gap-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Activity className="size-4 text-primary" />
                Security & Platform Policy
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Mentor roles require manual review of credentials and institutional verification. Student profiles are activated instantly upon email verification.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. Tab 3: Catalog & System Directory ── */}
      {activeTab === "catalog" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/opportunities"
            className="group rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3 group-hover:scale-105 transition-transform">
              <GraduationCap className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Opportunities Catalog</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Publish and maintain international graduate programs, fellowships, and lab positions.
            </p>
          </Link>

          <Link
            href="/admin/universities"
            className="group rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div className="inline-flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 mb-3 group-hover:scale-105 transition-transform">
              <Building2 className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Universities Registry</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Maintain institutional profiles, countries, and world ranking tiers.
            </p>
          </Link>

          <Link
            href="/admin/professors"
            className="group rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div className="inline-flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 mb-3 group-hover:scale-105 transition-transform">
              <Sparkles className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Faculty Directory</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Curate professor listings, active laboratory connections, and research topics.
            </p>
          </Link>

          <Link
            href="/admin/labs"
            className="group rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div className="inline-flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 mb-3 group-hover:scale-105 transition-transform">
              <FileText className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Research Laboratories</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Update lab websites, open research directions, and Principal Investigator assignments.
            </p>
          </Link>
        </div>
      )}

      {/* ── 7. Reject Reason Dialog ── */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-5" />
              Reject Mentor Application
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Please provide a constructive reason for rejecting{" "}
              <strong>{selectedMentor?.user?.name}</strong>'s application. This explanation will
              be included in their notification email.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <Textarea
              rows={4}
              placeholder="e.g. Current credentials or affiliation could not be verified, or please provide an official university institutional email..."
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
