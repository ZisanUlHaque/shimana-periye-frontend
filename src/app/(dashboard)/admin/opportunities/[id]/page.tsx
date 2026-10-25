import { Suspense } from "react";
import { AdminOpportunityDetail } from "@/components/features/opportunity/admin-opportunity-detail";
import { PageHeader } from "@/components/layout/public/page-header";

export const dynamic = "force-dynamic";

interface AdminOpportunityDetailPageProps {
  params: Promise<{ id: string }>;
}

async function AdminOpportunityContent({
  params,
}: AdminOpportunityDetailPageProps) {
  const { id } = await params;
  return <AdminOpportunityDetail opportunityId={id} />;
}

export default function AdminOpportunityDetailPage({
  params,
}: AdminOpportunityDetailPageProps) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Opportunity Details"
        description="Edit details and view deadline history."
      />
      <Suspense
        fallback={<div className="h-48 animate-pulse rounded-2xl bg-muted/60" />}
      >
        <AdminOpportunityContent params={params} />
      </Suspense>
    </div>
  );
}
