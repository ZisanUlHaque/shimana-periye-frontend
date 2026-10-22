import { PageHeader } from "@/components/layout/public/page-header";

export default function CompareShortlistPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        title="Compare Opportunities"
        description="Side-by-side: fit, fees, living costs, deadlines."
      />
      {/* TODO: GET /api/v1/shortlist/compare */}
    </div>
  );
}