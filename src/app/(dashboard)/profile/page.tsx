"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetMe } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileRedirectPage() {
  const router = useRouter();
  const { data: userData, isLoading } = useGetMe();
  const user = userData?.data?.user || userData?.data;

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/login");
        return;
      }
      const role = user.role?.toUpperCase();
      if (role === "STUDENT") {
        router.replace("/student/profile");
      } else if (role === "MENTOR") {
        router.replace("/mentor/profile");
      } else {
        router.replace("/admin/profile");
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex h-96 w-full items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-4 w-48" />
        <p className="text-xs text-muted-foreground">Redirecting to your profile...</p>
      </div>
    </div>
  );
}
