import { Suspense } from "react";
import { ApplicationDetail } from "@/components/features/application/application-detail";
import { PageHeader } from "@/components/layout/public/page-header";

export const dynamic = "force-dynamic";

interface ApplicationDetailPageProps {
  params: Promise<{ id: string }>;
}

async function ApplicationDetailContent({
  params,
}: ApplicationDetailPageProps) {
  const { id } = await params;
  return <ApplicationDetail applicationId={id} />;
}

export default function ApplicationDetailPage({
  params,
}: ApplicationDetailPageProps) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Application Details"
        description="Manage status, interview, and decision."
      />
      <Suspense
        fallback={<div className="h-48 animate-pulse rounded-2xl bg-muted/60" />}
      >
        <ApplicationDetailContent params={params} />
      </Suspense>
    </div>
  );
}
