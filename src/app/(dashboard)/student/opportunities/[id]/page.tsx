import { Suspense } from "react";
import { OpportunityDetail } from "@/components/features/opportunity/opportunity-detail";
import { PageHeader } from "@/components/layout/public/page-header";

export const dynamic = "force-dynamic";

interface OpportunityDetailPageProps {
  params: Promise<{ id: string }>;
}

async function OpportunityContent({ params }: OpportunityDetailPageProps) {
  const { id } = await params;
  return <OpportunityDetail opportunityId={id} />;
}

export default function OpportunityDetailPage({
  params,
}: OpportunityDetailPageProps) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Opportunity Details"
        description="Review details and start your application."
      />
      <Suspense
        fallback={<div className="h-48 animate-pulse rounded-2xl bg-muted/60" />}
      >
        <OpportunityContent params={params} />
      </Suspense>
    </div>
  );
}
