import { PageHeader } from "@/components/layout/public/page-header";

export default async function CostEstimatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        title="Cost Estimate"
        description={`Net cost breakdown for application ${id}`}
      />
      {/* TODO: GET /api/v1/cost-estimates/:applicationId */}
      {/* TODO: PUT /api/v1/cost-estimates/:applicationId */}
    </div>
  );
}