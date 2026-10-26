"use client";

import {
  Calendar,
  Check,
  CheckCircle2,
  Compass,
  Copy,
  GraduationCap,
  KeyRound,
  Loader2,
  Mail,
  Save,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ProfileImageUploader } from "@/components/features/user/profile-image-uploader";
import { PageHeader } from "@/components/layout/public/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { useGetMe } from "@/hooks/auth.hook";
import { useUpdateProfile } from "@/hooks/user.hook";

export default function AdminProfilePage() {
  const { data: meRes, isLoading } = useGetMe();
  const updateMutation = useUpdateProfile();

  const user = meRes?.data?.user || meRes?.data;

  const [name, setName] = useState("");
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  const handleCopyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopiedId(true);
      toast.add({ title: "Admin ID copied to clipboard", type: "success" });
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || trimmed.length < 2) {
      toast.add({
        title: "Invalid name",
        description: "Name must be at least 2 characters.",
        type: "error",
      });
      return;
    }

    updateMutation.mutate({ name: trimmed });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-6xl mx-auto">
        <PageHeader
          title="Admin Profile & Settings"
          description="Manage your system administrator credentials, avatar, and quick links."
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl lg:col-span-2" />
        </div>
      </div>
    );
  }

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Active Member";

  return (
    <div className="flex flex-col gap-8 p-4 sm:p-6 max-w-6xl mx-auto animate-in fade-in-50 duration-300">
      <PageHeader
        title="Admin Profile & Settings"
        description="Manage your system administrator credentials, public avatar, and platform access."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Admin Identity Card */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm flex flex-col items-center text-center">
            {/* Avatar Uploader */}
            <div className="mb-4">
              <ProfileImageUploader
                currentImageUrl={user?.imageUrl}
                fallbackInitial={user?.name?.[0]?.toUpperCase() || "A"}
              />
            </div>

            <h2 className="text-lg font-bold tracking-tight text-foreground">
              {user?.name || "Administrator"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {user?.email}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 gap-1.5 px-3 py-1 font-semibold">
                <ShieldCheck className="size-3.5" />
                ADMIN
              </Badge>
              <Badge
                variant="outline"
                className="gap-1.5 px-3 py-1 border-primary/30 text-primary font-medium"
              >
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                {user?.status || "ACTIVE"}
              </Badge>
            </div>

            <div className="w-full mt-6 pt-6 border-t border-border/60 flex flex-col gap-3 text-left text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-muted-foreground/80" />
                  Joined
                </span>
                <span className="font-medium text-foreground">{joinDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  Email Status
                </span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  {user?.emailVerified ? "Verified" : "Verified"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="size-3.5 text-muted-foreground/80" />
                  User ID
                </span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="font-mono text-[11px] text-foreground hover:text-primary transition-colors flex items-center gap-1"
                  title="Click to copy ID"
                >
                  {user?.id ? `${user.id.slice(0, 8)}...` : "—"}
                  {copiedId ? (
                    <Check className="size-3 text-emerald-500" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Management Shortcuts */}
          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Management Portals
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <Link
                href="/admin/users"
                className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:border-primary/40 hover:bg-muted/50 transition-all text-xs font-medium"
              >
                <span className="flex items-center gap-2 text-foreground">
                  <Users className="size-4 text-primary" />
                  Manage All Users
                </span>
                <span className="text-muted-foreground">→</span>
              </Link>
              <Link
                href="/admin/mentors"
                className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:border-primary/40 hover:bg-muted/50 transition-all text-xs font-medium"
              >
                <span className="flex items-center gap-2 text-foreground">
                  <GraduationCap className="size-4 text-primary" />
                  Mentor Applications
                </span>
                <span className="text-muted-foreground">→</span>
              </Link>
              <Link
                href="/admin/opportunities"
                className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:border-primary/40 hover:bg-muted/50 transition-all text-xs font-medium"
              >
                <span className="flex items-center gap-2 text-foreground">
                  <Compass className="size-4 text-primary" />
                  Opportunities Catalog
                </span>
                <span className="text-muted-foreground">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Account Details & Security */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Edit Profile Form */}
          <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
            <h3 className="text-base font-bold text-foreground">
              Profile Information
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Update your display name. Email address is tied to your root
              administrator role.
            </p>

            <form onSubmit={handleSave} className="mt-6 flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="admin-name" className="text-xs font-semibold">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="admin-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="pl-9 h-10"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="admin-email"
                    className="text-xs font-semibold"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="admin-email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="pl-9 h-10 bg-muted/60 cursor-not-allowed opacity-80"
                    />
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    Administrator email cannot be changed directly for security
                    reasons.
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={updateMutation.isPending || !name.trim()}
                  className="gap-2 px-6"
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Save className="size-4" />
                  )}
                  Save Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Security & Access Overview */}
          <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <KeyRound className="size-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  Security & Privileges
                </h4>
                <p className="text-xs text-muted-foreground">
                  Your administrator role grants full platform access and
                  moderation powers.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              <div className="p-3.5 rounded-xl border border-border/60 bg-muted/30">
                <span className="text-xs font-semibold text-foreground">
                  User Management
                </span>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Ability to activate, block, or delete any user or mentor
                  account.
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-border/60 bg-muted/30">
                <span className="text-xs font-semibold text-foreground">
                  Mentor Verification
                </span>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Review applicant credentials and approve or reject mentor
                  privileges.
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-border/60 bg-muted/30">
                <span className="text-xs font-semibold text-foreground">
                  Catalog Curating
                </span>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Publish, edit, and organize opportunities, labs, professors,
                  and universities.
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-border/60 bg-muted/30">
                <span className="text-xs font-semibold text-foreground">
                  Session Protection
                </span>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Signed HTTP-only cookie authentication with automatic refresh
                  token rotation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
