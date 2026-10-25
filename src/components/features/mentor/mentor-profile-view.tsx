"use client";

import { useState, useEffect } from "react";
import {
  useMyMentorProfile,
  useUpdateMyMentorProfile,
} from "@/hooks/mentor-profile.hook";
import { useGetMe } from "@/hooks/auth.hook";
import { PageHeader } from "@/components/layout/public/page-header";
import {
  User,
  Building,
  Briefcase,
  Mail,
  Phone,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  X,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/toast";

const COMMON_TAGS = [
  "PhD Admissions",
  "Master's / MS",
  "SOP Writing",
  "Professor Cold Email",
  "Scholarship Applications",
  "Computer Science",
  "GRE / TOEFL",
  "Visa Interview",
];

export function MentorProfileView() {
  const { data: profileRes, isLoading: isProfileLoading } = useMyMentorProfile();
  const { data: meRes } = useGetMe();
  const updateMutation = useUpdateMyMentorProfile();

  const user = meRes?.data?.user || meRes?.data;
  const profile = profileRes?.data;

  const [bio, setBio] = useState("");
  const [expertise, setExpertise] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");

  useEffect(() => {
    if (profile) {
      setBio(profile.bio ?? "");
      setExpertise(profile.expertise ?? []);
    }
  }, [profile]);

  const toggleTag = (tag: string) => {
    if (expertise.includes(tag)) {
      setExpertise(expertise.filter((t) => t !== tag));
    } else {
      if (expertise.length >= 12) {
        toast.add({
          title: "Limit reached",
          description: "You can select up to 12 expertise tags.",
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
      if (expertise.length >= 12) return;
      setExpertise([...expertise, trimmed]);
    }
    setCustomTag("");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      bio,
      expertise,
    });
  };

  if (isProfileLoading) {
    return (
      <div className="flex flex-col gap-6 p-4 sm:p-6">
        <PageHeader
          title="Mentor Profile & Credentials"
          description="Manage your public mentorship bio, areas of expertise, and academic credentials."
        />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  const name = user?.name || "Mentor";
  const email = user?.email || "";
  const institution = profile?.institution || "Academic Institution";
  const designation = profile?.designation || "Academic Mentor";
  const status = profile?.verificationStatus || "APPROVED";

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-4xl">
      <PageHeader
        title="Mentor Profile & Credentials"
        description="Update your advising bio, highlight specializations, and manage your public persona."
      />

      {/* Header Profile Card */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/95 to-primary/5 p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-16 rounded-2xl ring-2 ring-primary/20 shadow-sm">
              <AvatarImage src={user?.imageUrl ?? undefined} />
              <AvatarFallback className="rounded-2xl bg-primary/10 text-primary font-bold text-xl">
                {name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">{name}</h2>
                <Badge variant="default" className="text-[10px] gap-1">
                  <ShieldCheck className="size-3" />
                  {status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {designation} · {institution}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1.5">
                <span className="flex items-center gap-1">
                  <Mail className="size-3" />
                  {email}
                </span>
                {profile?.contactNumber && (
                  <span className="flex items-center gap-1">
                    <Phone className="size-3" />
                    {profile.contactNumber}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs space-y-5">
          <h3 className="text-base font-semibold text-foreground">
            Mentorship Statement & Guidance Bio
          </h3>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">About You & Advising Background</Label>
            <Textarea
              rows={5}
              placeholder="Detail your research journey, target programs you applied to, funded offers received, and what advice you offer to mentees..."
              className="text-xs"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <p className="text-[11px] text-muted-foreground">
              This statement will be visible to students exploring mentors on the platform.
            </p>
          </div>

          {/* Expertise Section */}
          <div className="space-y-3 pt-2">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-primary" />
              Specialization & Expertise Tags
            </Label>

            <div className="flex flex-wrap gap-2">
              {COMMON_TAGS.map((tag) => {
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

            <div className="flex gap-2 pt-2">
              <Input
                placeholder="Add custom topic (e.g. Erasmus Mundus, Robotics)..."
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
                Add Tag
              </Button>
            </div>

            {expertise.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {expertise.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
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
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="gap-2 text-xs font-semibold"
            disabled={updateMutation.isPending}
          >
            <Save className="size-3.5" />
            {updateMutation.isPending ? "Saving Changes..." : "Save Profile Details"}
          </Button>
        </div>
      </form>
    </div>
  );
}
