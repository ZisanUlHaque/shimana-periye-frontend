"use client";

import { useState } from "react";
import {
  useApplyAsMentor,
  useVerifyMentorEmail,
  useMentorApplicationStatus,
} from "@/hooks/mentor-profile.hook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Mail,
  ShieldCheck,
  Building,
  Briefcase,
  Phone,
  Send,
  FileText,
  Upload,
  FileCheck,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import Link from "next/link";

const POPULAR_EXPERTISE = [
  "PhD Admissions",
  "Master's / MS",
  "SOP & Personal Statement",
  "Professor Cold Outreach",
  "Scholarship Applications",
  "Computer Science & AI",
  "Biomedical Engineering",
  "GRE / TOEFL Prep",
  "Visa & Embassy Interview",
];

export function ApplyMentorForm() {
  const [activeTab, setActiveTab] = useState<"apply" | "status">("apply");
  const [step, setStep] = useState<"form" | "otp" | "success">("form");

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [designation, setDesignation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [bio, setBio] = useState("");
  const [expertise, setExpertise] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // OTP state
  const [otp, setOtp] = useState("");

  // Status check state
  const [statusEmail, setStatusEmail] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  const applyMutation = useApplyAsMentor();
  const verifyMutation = useVerifyMentorEmail();
  const statusQuery = useMentorApplicationStatus(searchEmail);

  const toggleTag = (tag: string) => {
    if (expertise.includes(tag)) {
      setExpertise(expertise.filter((t) => t !== tag));
    } else {
      if (expertise.length >= 10) {
        toast.add({
          title: "Limit reached",
          description: "You can select up to 10 expertise tags.",
          type: "warning",
        });
        return;
      }
      setExpertise([...expertise, tag]);
    }
  };

  const addCustomTag = () => {
    const trimmed = customTag.trim();
    if (!trimmed) return;
    if (!expertise.includes(trimmed)) {
      if (expertise.length >= 10) return;
      setExpertise([...expertise, trimmed]);
    }
    setCustomTag("");
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.add({
        title: "Required fields missing",
        description: "Please enter your name and email.",
        type: "error",
      });
      return;
    }

    applyMutation.mutate(
      {
        name,
        email,
        institution: institution || undefined,
        designation: designation || undefined,
        contactNumber: contactNumber || undefined,
        bio: bio || undefined,
        expertise: expertise.length > 0 ? expertise : undefined,
        file: resumeFile,
      },
      {
        onSuccess: () => {
          toast.add({
            title: "Application Initiated!",
            description: "We've sent a 6-digit verification code to your email.",
            type: "success",
          });
          setStep("otp");
        },
      }
    );
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.add({
        title: "Invalid OTP",
        description: "Please enter the 6-digit OTP code sent to your email.",
        type: "error",
      });
      return;
    }

    verifyMutation.mutate(
      { email, otp },
      {
        onSuccess: () => {
          toast.add({
            title: "Email Verified Successfully!",
            description: "Your application is submitted for admin review.",
            type: "success",
          });
          setStep("success");
        },
      }
    );
  };

  const handleCheckStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusEmail.trim() || !statusEmail.includes("@")) {
      toast.add({
        title: "Invalid email",
        description: "Please provide a valid email address.",
        type: "error",
      });
      return;
    }
    setSearchEmail(statusEmail.trim());
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Tabs */}
      <div className="mb-8 flex justify-center">
        <div className="inline-flex rounded-xl bg-muted/60 p-1 border border-border/60">
          <button
            type="button"
            onClick={() => setActiveTab("apply")}
            className={`rounded-lg px-6 py-2 text-xs font-semibold transition-all ${
              activeTab === "apply"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Apply to Become a Mentor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("status")}
            className={`rounded-lg px-6 py-2 text-xs font-semibold transition-all ${
              activeTab === "status"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Check Application Status
          </button>
        </div>
      </div>

      {activeTab === "status" ? (
        <Card className="border border-border/80 bg-card/95 shadow-md backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold text-foreground">
              Track Your Mentor Application
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Enter the email address you used when submitting your mentorship application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleCheckStatus} className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="your.email@university.edu"
                  className="pl-10 text-xs"
                  value={statusEmail}
                  onChange={(e) => setStatusEmail(e.target.value)}
                />
              </div>
              <Button type="submit" size="sm" className="px-5 text-xs">
                Check Status
              </Button>
            </form>

            {statusQuery.isFetching && (
              <div className="py-8 text-center text-xs text-muted-foreground">
                Checking application records...
              </div>
            )}

            {statusQuery.isError && (
              <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-xs text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                <span>
                  No mentor application record found for this email, or an error occurred.
                </span>
              </div>
            )}

            {statusQuery.data?.data && (
              <div className="rounded-2xl border border-border/60 bg-muted/30 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Email Verification:
                  </span>
                  <Badge
                    variant={
                      statusQuery.data.data.emailVerified ? "default" : "secondary"
                    }
                  >
                    {statusQuery.data.data.emailVerified ? "Verified" : "Pending OTP"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Review Status:
                  </span>
                  <Badge
                    variant={
                      statusQuery.data.data.verificationStatus === "APPROVED"
                        ? "default"
                        : statusQuery.data.data.verificationStatus === "REJECTED"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {statusQuery.data.data.verificationStatus}
                  </Badge>
                </div>

                {statusQuery.data.data.verificationStatus === "REJECTED" &&
                  statusQuery.data.data.rejectionReason && (
                    <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                      <strong>Feedback from reviewer:</strong>{" "}
                      {statusQuery.data.data.rejectionReason}
                    </div>
                  )}

                {statusQuery.data.data.verificationStatus === "APPROVED" && (
                  <div className="rounded-xl border border-primary/30 bg-primary/10 p-3 text-xs text-primary flex items-center justify-between">
                    <span>
                      Your application has been approved! Check your email for login credentials.
                    </span>
                    <Link href="/login">
                      <Button size="sm" className="h-7 text-xs">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ) : step === "form" ? (
        <Card className="border border-border/80 bg-card/95 shadow-md backdrop-blur-sm">
          <CardHeader>
            <div className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
              <GraduationCap className="size-5" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Join as an Academic Mentor
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Guide the next generation of scholars towards funded Masters, PhDs, and research
              fellowships abroad. Share your firsthand expertise.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleApply} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    required
                    placeholder="e.g. Dr. Sabrina Rahman"
                    className="text-xs"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    required
                    type="email"
                    placeholder="e.g. s.rahman@alumni.stanford.edu"
                    className="text-xs"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <Building className="size-3.5 text-muted-foreground" />
                    Current Institution / University
                  </Label>
                  <Input
                    placeholder="e.g. Stanford University / Google Research"
                    className="text-xs"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <Briefcase className="size-3.5 text-muted-foreground" />
                    Current Designation / Role
                  </Label>
                  <Input
                    placeholder="e.g. PhD Candidate / Postdoctoral Fellow"
                    className="text-xs"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <Phone className="size-3.5 text-muted-foreground" />
                  Contact Number (WhatsApp preferred)
                </Label>
                <Input
                  placeholder="+880 1700 000000"
                  className="text-xs"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                />
              </div>

              {/* Areas of Expertise */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-primary" />
                  Areas of Mentorship & Specialization
                </Label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_EXPERTISE.map((tag) => {
                    const isSelected = expertise.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground font-semibold"
                            : "border-border/70 bg-muted/40 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {tag}
                      </button>
                    );
                  })}
                </div>

                {/* Custom tag input */}
                <div className="flex gap-2 pt-2">
                  <Input
                    placeholder="Add custom topic (e.g. Fulbright, DAAD)..."
                    className="text-xs"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={addCustomTag}
                  >
                    Add
                  </Button>
                </div>

                {expertise.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {expertise.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary"
                      >
                        {t}
                        <button
                          type="button"
                          onClick={() => toggleTag(t)}
                          className="hover:text-primary-foreground"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Mentorship Statement & Academic Background
                </Label>
                <Textarea
                  rows={4}
                  placeholder="Share a brief overview of your academic journey, funded offers received, and what kind of support you can offer applicants..."
                  className="text-xs"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              {/* Academic CV / Resume Upload */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="size-3.5 text-primary" />
                    Academic CV / Resume (PDF / Word)
                  </span>
                  <span className="text-[11px] text-muted-foreground font-normal">Max 10MB</span>
                </Label>

                <div className="flex flex-col gap-2">
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-border/80 hover:border-primary/60 bg-muted/20 hover:bg-muted/40 rounded-xl p-4 cursor-pointer transition-all">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 10 * 1024 * 1024) {
                            toast.add({
                              title: "File too large",
                              description: "Resume must be under 10MB.",
                              type: "error",
                            });
                            return;
                          }
                          setResumeFile(file);
                        }
                      }}
                    />
                    <div className="flex flex-col items-center gap-1.5 text-center">
                      <Upload className="size-6 text-primary" />
                      <span className="text-xs font-semibold text-foreground">
                        {resumeFile ? resumeFile.name : "Click to select or drag and drop your CV / Resume"}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {resumeFile
                          ? `${(resumeFile.size / (1024 * 1024)).toFixed(2)} MB • Click to replace file`
                          : "Supports PDF and Word formats (.pdf, .doc, .docx)"}
                      </span>
                    </div>
                  </label>

                  {resumeFile && (
                    <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg px-3 py-1.5 text-xs">
                      <span className="flex items-center gap-2 text-primary font-medium truncate">
                        <FileCheck className="size-4 shrink-0" />
                        {resumeFile.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setResumeFile(null)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full gap-2 text-xs font-semibold"
                disabled={applyMutation.isPending}
              >
                <Send className="size-3.5" />
                {applyMutation.isPending
                  ? "Submitting Application..."
                  : "Submit Application & Receive OTP"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : step === "otp" ? (
        <Card className="border border-border/80 bg-card/95 shadow-md backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2">
              <Mail className="size-6" />
            </div>
            <CardTitle className="text-xl font-bold text-foreground">
              Verify Your Email Address
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              We just sent a 6-digit confirmation code to{" "}
              <strong className="text-foreground">{email}</strong>. Please enter it below to
              confirm your mentorship request.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-center block">
                  6-Digit OTP Code
                </Label>
                <Input
                  required
                  maxLength={6}
                  placeholder="123456"
                  className="text-center font-mono text-lg tracking-widest"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.trim())}
                />
              </div>

              <Button
                type="submit"
                className="w-full text-xs font-semibold gap-2"
                disabled={verifyMutation.isPending}
              >
                <ShieldCheck className="size-4" />
                {verifyMutation.isPending
                  ? "Verifying..."
                  : "Verify Email & Complete Submission"}
              </Button>

              <div className="flex justify-between items-center pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="text-muted-foreground hover:text-foreground underline"
                >
                  ← Edit application details
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="text-primary hover:underline font-medium"
                >
                  Resend OTP Code
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-border/80 bg-card/95 shadow-md backdrop-blur-sm text-center">
          <CardHeader>
            <div className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 mb-2">
              <CheckCircle2 className="size-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Application Under Review!
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground max-w-md mx-auto">
              Your email has been verified and your profile is now in our admin verification queue.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-2xl border border-border/60 bg-muted/30 p-5 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Clock className="size-4 text-primary" />
                What happens next?
              </div>
              <p className="text-muted-foreground leading-relaxed">
                1. Our admin team will verify your credentials and university affiliation.
                <br />
                2. Upon approval, you will automatically receive an onboarding email containing your
                temporary password and mentor dashboard access link.
                <br />
                3. You can also re-check your review status on this page using your email at any time.
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <Link href="/">
                <Button variant="outline" size="sm" className="text-xs">
                  Back to Home
                </Button>
              </Link>
              <Button
                size="sm"
                className="text-xs"
                onClick={() => {
                  setActiveTab("status");
                  setStatusEmail(email);
                  setSearchEmail(email);
                }}
              >
                Track Status
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
