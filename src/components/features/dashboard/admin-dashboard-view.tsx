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
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

  // Rejection modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
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

  // Safe data extraction from backend
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

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              <Shield className="size-3.5" />
              Administrative Command Center
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1">
            Platform Operations & Approvals
          </h1>
          <p className="text-xs text-muted-foreground">
            Monitor real-time verification pipelines, user activity, and catalog records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/opportunities">
            <Button size="sm" variant="outline" className="text-xs gap-1.5">
              <GraduationCap className="size-3.5" />
              Manage Opportunities
            </Button>
          </Link>
          <Link href="/apply-mentor" target="_blank">
            <Button size="sm" className="text-xs gap-1.5">
              <ExternalLink className="size-3.5" />
              Public Mentor Form
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Platform Users"
          value={String(activeUsers)}
          icon={Users}
          accent="primary"
        />
        <StatCard
          label="Catalog Opportunities"
          value={String(opportunities)}
          icon={GraduationCap}
          accent="blue"
        />
        <StatCard
          label="Total Applications"
          value={String(applications)}
          icon={Building2}
          accent="violet"
        />
        <StatCard
          label="Pending Mentors"
          value={String(pendingMentors.length)}
          icon={UserCheck}
          accent={pendingMentors.length > 0 ? "amber" : "primary"}
        />
      </div>

      {/* Modern Tabs Navigation */}
      <div className="flex border-b border-border/60">
        <button
          type="button"
          onClick={() => setActiveTab("mentors")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all ${
            activeTab === "mentors"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <UserCheck className="size-4" />
          <span>Mentor Verification Queue</span>
          {pendingMentors.length > 0 && (
            <Badge variant="default" className="ml-1 text-[10px] px-1.5 py-0 h-4">
              {pendingMentors.length}
            </Badge>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all ${
            activeTab === "users"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="size-4" />
          <span>User Registrations</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("catalog")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all ${
            activeTab === "catalog"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Building2 className="size-4" />
          <span>Catalog & System Overview</span>
        </button>
      </div>

      {/* Tab 1: Mentor Verification Queue */}
      {activeTab === "mentors" && (
        <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Prospective Mentor Applicants
              </h3>
              <p className="text-xs text-muted-foreground">
                Review credential submissions, academic affiliation, and verify mentor accounts.
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              {pendingMentors.length} In Review
            </Badge>
          </div>

          {pendingMentors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 mb-3">
                <CheckCircle2 className="size-6" />
              </div>
              <h4 className="text-sm font-semibold text-foreground">
                All Mentor Applications Reviewed
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm mt-1">
                There are no pending mentor applications awaiting verification at this time.
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
                    className="flex flex-col gap-4 py-5 transition-colors hover:bg-muted/10 rounded-xl px-2"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-foreground">
                            {userName}
                          </h4>
                          <Badge variant="outline" className="text-[10px]">
                            Pending Verification
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="size-3 text-muted-foreground" />
                            {userEmail}
                          </span>
                          {institution && (
                            <span className="flex items-center gap-1">
                              <Building className="size-3 text-muted-foreground" />
                              {institution}
                            </span>
                          )}
                          {designation && (
                            <span className="flex items-center gap-1">
                              <Briefcase className="size-3 text-muted-foreground" />
                              {designation}
                            </span>
                          )}
                        </div>

                        {contactNumber && (
                          <div className="text-[11px] text-muted-foreground">
                            Contact: {contactNumber}
                          </div>
                        )}

                        {bio && (
                          <p className="mt-2 text-xs text-foreground/80 bg-muted/40 p-2.5 rounded-lg border border-border/40 max-w-2xl">
                            "{bio}"
                          </p>
                        )}

                        {expertise.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {expertise.map((tag: string) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-[10px] px-2 py-0.5"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                          disabled={approveMutation.isPending}
                          onClick={() => handleApprove(item)}
                        >
                          <CheckCircle2 className="size-3.5" />
                          Approve Mentor
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 text-xs text-destructive hover:bg-destructive/10"
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

      {/* Tab 2: User Registrations */}
      {activeTab === "users" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-xs">
            <h3 className="text-base font-semibold text-foreground">
              Recent Registrations
            </h3>
            <div className="divide-y divide-border/60">
              {recentUsers.map((user: any) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between py-3 text-xs"
                >
                  <div>
                    <span className="font-semibold text-foreground">{user.name}</span>
                    <span className="ml-2 text-muted-foreground">({user.email})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">
                      {user.role}
                    </Badge>
                    <Badge
                      variant={user.status === "ACTIVE" ? "default" : "secondary"}
                      className="text-[10px]"
                    >
                      {user.status ?? "ACTIVE"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-xs">
            <h3 className="text-base font-semibold text-foreground">
              User Role Distribution
            </h3>
            <div className="space-y-3 pt-2">
              {Object.entries(roleBreakdown).map(([role, count]) => (
                <div key={role} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">{role}</span>
                  <span className="font-bold text-foreground">{String(count)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Catalog & System Overview */}
      {activeTab === "catalog" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/opportunities"
            className="group rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3 group-hover:scale-105 transition-transform">
              <GraduationCap className="size-5" />
            </div>
            <h4 className="text-sm font-bold text-foreground">Opportunities Catalog</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Add scholarships, fellowships, and graduate research positions.
            </p>
          </Link>

          <Link
            href="/admin/universities"
            className="group rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div className="inline-flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 mb-3 group-hover:scale-105 transition-transform">
              <Building2 className="size-5" />
            </div>
            <h4 className="text-sm font-bold text-foreground">Universities Registry</h4>
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
            <h4 className="text-sm font-bold text-foreground">Faculty Directory</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Manage professors, lab connections, and research specializations.
            </p>
          </Link>

          <Link
            href="/admin/labs"
            className="group rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div className="inline-flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 mb-3 group-hover:scale-105 transition-transform">
              <FileText className="size-5" />
            </div>
            <h4 className="text-sm font-bold text-foreground">Research Labs</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Update lab websites, open research questions, and PI assignments.
            </p>
          </Link>
        </div>
      )}

      {/* Reject Reason Dialog */}
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
