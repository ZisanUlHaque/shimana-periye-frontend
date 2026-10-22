import { PageHeader } from "@/components/layout/public/page-header";
import { Button } from "@/components/ui/button";

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        title="Opportunity Details"
        description={`Opportunity ID: ${id}`}
        action={<Button size="sm">Add to Shortlist</Button>}
      />
      {/* TODO: GET /api/v1/opportunities/:id */}
      {/* TODO: GET /api/v1/opportunities/:opportunityId/requirements */}
      {/* TODO: GET /api/v1/matching/:opportunityId */}
      {/* TODO: POST /api/v1/matching/:opportunityId/recompute */}
      {/* TODO: POST /api/v1/matching/:opportunityId/ai-explain */}
      {/* TODO: POST /api/v1/shortlist */}
    </div>
  );
}