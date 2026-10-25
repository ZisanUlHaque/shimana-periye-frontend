import { Suspense } from "react";
import { MentorApplicationDetail } from "@/components/features/application/mentor-application-detail";
import { PageHeader } from "@/components/layout/public/page-header";

export const dynamic = "force-dynamic";

interface MentorApplicationDetailPageProps {
  params: Promise<{ id: string }>;
}

async function MentorApplicationContent({
  params,
}: MentorApplicationDetailPageProps) {
  const { id } = await params;
  return <MentorApplicationDetail applicationId={id} />;
}

export default function MentorApplicationDetailPage({
  params,
}: MentorApplicationDetailPageProps) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Mentee's Application"
        description="View their progress and status."
      />
      <Suspense
        fallback={<div className="h-48 animate-pulse rounded-2xl bg-muted/60" />}
      >
        <MentorApplicationContent params={params} />
      </Suspense>
    </div>
  );
}
