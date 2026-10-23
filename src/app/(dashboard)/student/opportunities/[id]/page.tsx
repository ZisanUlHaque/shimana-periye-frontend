import { OpportunityDetail } from "@/components/features/opportunity/opportunity-detail";
import { PageHeader } from "@/components/layout/public/page-header";

interface OpportunityDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OpportunityDetailPage({ params }: OpportunityDetailPageProps) {
  const { id } = await params;
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Opportunity Details" description="Review details and start your application." />
      <OpportunityDetail opportunityId={id} />
    </div>
  );
}