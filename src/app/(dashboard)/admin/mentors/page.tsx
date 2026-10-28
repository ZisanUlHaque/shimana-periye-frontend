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
  Eye,
  FileText,
  Download,
  ExternalLink,
  Sparkles,
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
  const [dossierOpen, setDossierOpen] = useState(false);
  const [dossierMentor, setDossierMentor] = useState<IMentorProfile | null>(null);
  const [downloadingResume, setDownloadingResume] = useState(false);

  const handleDownloadResume = async (url: string, candidateName: string) => {
    try {
      setDownloadingResume(true);
      const res = await fetch(url);
      if (!res.ok) throw new Error("Network response was not ok");
      const blob = await res.blob();
      const cleanName = `${candidateName.replace(/[^a-zA-Z0-9_-]/g, "_")}_Resume.pdf`;
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = cleanName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(url, "_blank");
    } finally {
      setDownloadingResume(false);
    }
  };

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
                <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setDossierMentor(mentor);
                      setDossierOpen(true);
                    }}
                    className="text-xs h-8 gap-1.5 rounded-lg border-primary/30 text-primary hover:bg-primary/10"
                  >
                    <Eye className="size-3.5" />
                    Review Profile & Resume
                  </Button>

                  <div className="flex items-center gap-2">
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
                              Approve
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
                        {isApproved ? "Revoke" : "Reject"}
                      </Button>
                    )}
                  </div>
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

      {/* ── Mentor Full Profile & Resume Dossier Modal ── */}
      <Dialog open={dossierOpen} onOpenChange={setDossierOpen}>
        <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] flex flex-col p-6 overflow-hidden">
          <DialogHeader className="border-b border-border/60 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  <GraduationCap className="size-5 text-primary" />
                  Mentor Candidate Dossier
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Verify academic credentials, institutional affiliations, and review attached CV before granting mentorship privileges.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {dossierMentor && (
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-5 py-3">
              {/* Top Profile Summary Strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-muted/30 border border-border/60">
                <div className="flex items-center gap-3.5">
                  <Avatar className="size-14 border border-border/80 shadow-xs">
                    <AvatarImage src={dossierMentor.user?.imageUrl ?? undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-base">
                      {dossierMentor.user?.name?.[0]?.toUpperCase() || "M"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      {dossierMentor.user?.name}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <Mail className="size-3.5 text-muted-foreground" />
                      {dossierMentor.user?.email}
                    </p>
                    {dossierMentor.contactNumber && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <Phone className="size-3.5 text-muted-foreground" />
                        {dossierMentor.contactNumber}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2">
                  <Badge
                    variant="outline"
                    className={`font-semibold text-xs px-2.5 py-1 ${
                      dossierMentor.verificationStatus === "APPROVED"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                        : dossierMentor.verificationStatus === "REJECTED"
                        ? "bg-destructive/10 text-destructive border-destructive/30"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/30"
                    }`}
                  >
                    {dossierMentor.verificationStatus}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">
                    Applied: {new Date(dossierMentor.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Institution and Designation Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-border/60 bg-card">
                  <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wide">
                    <Building className="size-3.5 text-primary" />
                    Affiliated Institution / University
                  </span>
                  <p className="font-bold text-foreground mt-1 text-sm">
                    {dossierMentor.institution || "Not specified by applicant"}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-border/60 bg-card">
                  <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wide">
                    <Briefcase className="size-3.5 text-primary" />
                    Current Academic / Professional Role
                  </span>
                  <p className="font-bold text-foreground mt-1 text-sm">
                    {dossierMentor.designation || "Not specified by applicant"}
                  </p>
                </div>
              </div>

              {/* Mentorship Expertise Tags */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-primary" />
                  Areas of Advising Expertise
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {dossierMentor.expertise && dossierMentor.expertise.length > 0 ? (
                    dossierMentor.expertise.map((exp) => (
                      <span
                        key={exp}
                        className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium border border-primary/20"
                      >
                        {exp}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground italic">
                      No specific expertise categories marked.
                    </span>
                  )}
                </div>
              </div>

              {/* Mentorship Statement & Bio */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <FileText className="size-3.5 text-primary" />
                  Candidate Background & Statement
                </span>
                <div className="rounded-xl border border-border/60 bg-muted/20 p-4 text-xs text-foreground/90 leading-relaxed italic whitespace-pre-wrap">
                  {dossierMentor.bio || "No mentorship statement provided."}
                </div>
              </div>

              {/* Uploaded Resume / CV Section */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <FileText className="size-3.5 text-primary" />
                  Academic CV / Resume Document
                </span>

                {dossierMentor.resumeUrl ? (
                  <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-primary/20 pb-3">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary font-bold">
                          PDF
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {dossierMentor.user?.name}&apos;s Official Resume
                          </p>
                          <span className="text-[10px] text-muted-foreground">
                            Hosted on Cloudinary Document Storage
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={dossierMentor.resumeUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          <Button size="sm" variant="outline" className="h-8 text-xs gap-1">
                            <ExternalLink className="size-3.5" />
                            Open in New Tab
                          </Button>
                        </a>
                        <Button
                          size="sm"
                          disabled={downloadingResume}
                          onClick={() =>
                            handleDownloadResume(
                              dossierMentor.resumeUrl!,
                              dossierMentor.user?.name || "Mentor_Candidate",
                            )
                          }
                          className="h-8 text-xs gap-1"
                        >
                          <Download className="size-3.5" />
                          {downloadingResume ? "Downloading..." : "Download"}
                        </Button>
                      </div>
                    </div>

                    {/* Inline Document Preview Frame */}
                    <div className="w-full h-80 rounded-xl overflow-hidden border border-border/60 bg-background/80">
                      <iframe
                        src={dossierMentor.resumeUrl}
                        title="Candidate Resume Preview"
                        className="w-full h-full border-0"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-6 text-center text-xs text-muted-foreground">
                    <FileText className="size-6 text-muted-foreground/60 mx-auto mb-1.5" />
                    <span>No separate resume file was uploaded with this application.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Modal Footer with Direct Decision Actions */}
          {dossierMentor && (
            <DialogFooter className="border-t border-border/60 pt-3 flex sm:items-center justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDossierOpen(false)}
              >
                Close Dossier
              </Button>

              <div className="flex items-center gap-2">
                {dossierMentor.verificationStatus !== "REJECTED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setDossierOpen(false);
                      handleOpenReject(dossierMentor);
                    }}
                    className="text-destructive border-destructive/40 hover:bg-destructive/10 text-xs h-9 gap-1.5"
                    disabled={approveMutation.isPending}
                  >
                    <XCircle className="size-3.5" />
                    Reject Application
                  </Button>
                )}

                {dossierMentor.verificationStatus !== "APPROVED" && (
                  <Button
                    size="sm"
                    onClick={() => {
                      handleApprove(dossierMentor);
                      setDossierOpen(false);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9 gap-1.5"
                    disabled={approveMutation.isPending}
                  >
                    <CheckCircle2 className="size-3.5" />
                    Approve & Issue Credentials
                  </Button>
                )}
              </div>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
