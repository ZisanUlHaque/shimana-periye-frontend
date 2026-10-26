"use client";

import {
  AlertTriangle,
  Briefcase,
  Building,
  CheckCircle2,
  Clock,
  GraduationCap,
  Loader2,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/public/page-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAllMentors, useApproveMentor } from "@/hooks/mentor-profile.hook";
import { useDebounce } from "@/hooks/use-debounce";
import {
  type IMentorProfile,
  MentorVerificationStatus,
} from "@/types/mentor-profile.type";

export default function AdminMentorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const debouncedSearch = useDebounce(searchTerm, 400);

  const { data: mentorsRes, isLoading } = useAllMentors();
  const approveMutation = useApproveMentor();

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedMentorForReject, setSelectedMentorForReject] =
    useState<IMentorProfile | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const mentors: IMentorProfile[] = mentorsRes?.data ?? [];

  // Filter mentors client-side
  const filteredMentors = mentors.filter((m) => {
    const matchesStatus =
      statusFilter === "ALL" || m.verificationStatus === statusFilter;

    if (!matchesStatus) return false;

    if (!debouncedSearch) return true;
    const q = debouncedSearch.toLowerCase();
    const nameMatch = m.user?.name?.toLowerCase().includes(q);
    const emailMatch = m.user?.email?.toLowerCase().includes(q);
    const instMatch = m.institution?.toLowerCase().includes(q);
    const desigMatch = m.designation?.toLowerCase().includes(q);
    const expMatch = m.expertise?.some((e) => e.toLowerCase().includes(q));

    return nameMatch || emailMatch || instMatch || desigMatch || expMatch;
  });

  const pendingCount = mentors.filter(
    (m) => m.verificationStatus === MentorVerificationStatus.PENDING,
  ).length;
  const approvedCount = mentors.filter(
    (m) => m.verificationStatus === MentorVerificationStatus.APPROVED,
  ).length;
  const rejectedCount = mentors.filter(
    (m) => m.verificationStatus === MentorVerificationStatus.REJECTED,
  ).length;

  const handleApprove = (mentor: IMentorProfile) => {
    approveMutation.mutate({
      mentorProfileId: mentor.id,
      verificationStatus: MentorVerificationStatus.APPROVED,
    });
  };

  const handleOpenReject = (mentor: IMentorProfile) => {
    setSelectedMentorForReject(mentor);
    setRejectionReason("");
    setRejectDialogOpen(true);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentorForReject) return;

    approveMutation.mutate(
      {
        mentorProfileId: selectedMentorForReject.id,
        verificationStatus: MentorVerificationStatus.REJECTED,
        rejectionReason: rejectionReason.trim() || undefined,
      },
      {
        onSuccess: () => {
          setRejectDialogOpen(false);
          setSelectedMentorForReject(null);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto animate-in fade-in-50 duration-300">
      <PageHeader
        title="Mentor Applications & Verification"
        description="Review academic credentials, institutional affiliations, and approve or reject mentor privileges."
      />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Pending Review
            </p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
              {pendingCount}
            </p>
          </div>
          <div className="flex size-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="size-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Approved Mentors
            </p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {approvedCount}
            </p>
          </div>
          <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Rejected
            </p>
            <p className="text-2xl font-bold text-destructive mt-1">
              {rejectedCount}
            </p>
          </div>
          <div className="flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <XCircle className="size-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Applicants
            </p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {mentors.length}
            </p>
          </div>
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <GraduationCap className="size-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card border border-border/70 p-3.5 rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search mentors by name, email, institution, or expertise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10 border-border/60 bg-background"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map(
            (status) => (
              <Button
                key={status}
                type="button"
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className="h-9 text-xs rounded-xl"
              >
                {status === "ALL" ? "All Mentors" : status}
                {status === "PENDING" && pendingCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                    {pendingCount}
                  </span>
                )}
              </Button>
            ),
          )}
        </div>
      </div>

      {/* Mentor Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["skel-m-1", "skel-m-2", "skel-m-3", "skel-m-4"].map((skelKey) => (
            <Skeleton key={skelKey} className="h-56 rounded-2xl" />
          ))}
        </div>
      ) : filteredMentors.length === 0 ? (
        <div className="rounded-2xl border border-border/70 bg-card p-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <GraduationCap className="size-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            No mentor applications found
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            There are no mentors matching the selected filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredMentors.map((mentor) => {
            const isPending =
              mentor.verificationStatus === MentorVerificationStatus.PENDING;
            const isApproved =
              mentor.verificationStatus === MentorVerificationStatus.APPROVED;
            const isRejected =
              mentor.verificationStatus === MentorVerificationStatus.REJECTED;

            return (
              <div
                key={mentor.id}
                className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm flex flex-col justify-between gap-4 hover:border-primary/40 transition-all duration-200"
              >
                <div>
                  {/* Top Row: User Avatar, Name, and Status Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="size-12 border border-border/70 shrink-0">
                        <AvatarImage src={mentor.user?.imageUrl ?? undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                          {mentor.user?.name?.[0]?.toUpperCase() || "M"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-foreground truncate">
                          {mentor.user?.name || "Mentor Candidate"}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                          <Mail className="size-3 shrink-0" />
                          {mentor.user?.email}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {isPending && (
                      <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 gap-1 px-2.5 py-1 font-semibold text-[11px] shrink-0">
                        <Clock className="size-3" />
                        PENDING
                      </Badge>
                    )}
                    {isApproved && (
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 gap-1 px-2.5 py-1 font-semibold text-[11px] shrink-0">
                        <CheckCircle2 className="size-3" />
                        APPROVED
                      </Badge>
                    )}
                    {isRejected && (
                      <Badge className="bg-destructive/15 text-destructive border-destructive/30 gap-1 px-2.5 py-1 font-semibold text-[11px] shrink-0">
                        <XCircle className="size-3" />
                        REJECTED
                      </Badge>
                    )}
                  </div>

                  {/* Institutional & Contact Info */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border/50">
                    <div className="flex items-center gap-2 truncate">
                      <Building className="size-3.5 text-primary shrink-0" />
                      <span className="truncate font-medium text-foreground">
                        {mentor.institution || "Institution not specified"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <Briefcase className="size-3.5 text-primary shrink-0" />
                      <span className="truncate">
                        {mentor.designation || "Designation not specified"}
                      </span>
                    </div>
                    {mentor.contactNumber && (
                      <div className="flex items-center gap-2 truncate sm:col-span-2">
                        <Phone className="size-3.5 text-muted-foreground shrink-0" />
                        <span>{mentor.contactNumber}</span>
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  {mentor.bio && (
                    <div className="mt-3 text-xs text-muted-foreground line-clamp-3 italic">
                      &ldquo;{mentor.bio}&rdquo;
                    </div>
                  )}

                  {/* Expertise Tags */}
                  {mentor.expertise && mentor.expertise.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {mentor.expertise.map((exp) => (
                        <span
                          key={exp}
                          className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-semibold border border-primary/20"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Rejection Notice if rejected */}
                  {isRejected && mentor.rejectionReason && (
                    <div className="mt-3 p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                      <span className="font-semibold block">
                        Reason for Rejection:
                      </span>
                      <p className="mt-0.5">{mentor.rejectionReason}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-2">
                  {/* Approve Action */}
                  {!isApproved && (
                    <AlertDialog>
                      <AlertDialogTrigger
                        render={
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 gap-1.5 rounded-lg px-3"
                            disabled={approveMutation.isPending}
                          >
                            <CheckCircle2 className="size-3.5" />
                            Approve Application
                          </Button>
                        }
                      />
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2 text-emerald-600">
                            <ShieldCheck className="size-5" />
                            Approve {mentor.user?.name || "Mentor"}?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will verify the mentor&apos;s credentials and
                            grant them access to host consultation slots, review
                            student applications, and offer SOP guidance.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleApprove(mentor)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Yes, Approve Mentor
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}

                  {/* Reject / Revoke Action */}
                  {!isRejected && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenReject(mentor)}
                      className="text-destructive border-destructive/40 hover:bg-destructive/10 text-xs h-8 gap-1.5 rounded-lg"
                      disabled={approveMutation.isPending}
                    >
                      <XCircle className="size-3.5" />
                      {isApproved ? "Revoke Approval" : "Reject Application"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Application Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-5" />
              Reject Application for{" "}
              {selectedMentorForReject?.user?.name || "Mentor"}
            </DialogTitle>
            <DialogDescription>
              Provide an optional explanation of why this mentor application was
              rejected. This feedback helps applicants improve their
              credentials.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleConfirmReject}
            className="flex flex-col gap-4 mt-2"
          >
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="rejection-reason"
                className="text-xs font-semibold"
              >
                Rejection Reason (Optional)
              </Label>
              <Textarea
                id="rejection-reason"
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Incomplete institutional verification or missing research publication portfolio."
                className="text-xs"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRejectDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                size="sm"
                disabled={approveMutation.isPending}
                className="gap-1.5"
              >
                {approveMutation.isPending && (
                  <Loader2 className="size-3.5 animate-spin" />
                )}
                Confirm Rejection
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
