"use client";

import { ProfileImageUploader } from "@/components/features/user/profile-image-uploader";
import { useGetMe } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/public/page-header";
import { ProfileCompletenessCard } from "@/components/features/student-profile/profile-completeness-card";
import { StudentInterestsSkillsSection } from "@/components/features/student-profile/student-interests-skills-section";
import { Mail, ShieldCheck } from "lucide-react";

export default function StudentProfilePage() {
  const { data: userData, isLoading } = useGetMe();
  const user = userData?.data?.user || userData?.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Profile"
        description="Manage your personal details, research interests, skills, and check overall readiness."
      />

      {/* Completeness Card */}
      <ProfileCompletenessCard />

      {/* Basic Account Info & Photo */}
      <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs">
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Personal Information
        </h3>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {isLoading ? (
            <Skeleton className="size-20 rounded-full" />
          ) : (
            <ProfileImageUploader
              currentImageUrl={user?.imageUrl}
              fallbackInitial={user?.name?.[0]?.toUpperCase() ?? "?"}
            />
          )}

          <div className="space-y-1">
            <h4 className="text-base font-medium text-foreground">
              {user?.name ?? "Student"}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail className="size-3.5" />
              <span>{user?.email}</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="size-3.5" />
              <span>Verified Student Account</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interests & Skills Editor */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Academic Fit & Matching Keywords
        </h3>
        <StudentInterestsSkillsSection />
      </div>
    </div>
  );
}
