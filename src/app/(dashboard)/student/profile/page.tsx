"use client";

import { ProfileImageUploader } from "@/components/features/user/profile-image-uploader";
import { useGetMe } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/public/page-header";

export default function StudentProfilePage() {
  const { data: userData, isLoading } = useGetMe();
  const user = userData?.data?.user || userData?.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile Info"
        description="Manage your personal information and profile picture."
      />

      <div className="rounded-xl border border-border/60 bg-card p-5">
        {isLoading ? (
          <Skeleton className="h-20 w-20 rounded-full" />
        ) : (
          <ProfileImageUploader
            currentImageUrl={user?.imageUrl}
            fallbackInitial={user?.name?.[0]?.toUpperCase() ?? "?"}
          />
        )}
      </div>
    </div>
  );
}