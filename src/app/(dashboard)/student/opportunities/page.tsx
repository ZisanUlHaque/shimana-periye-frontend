import { PageHeader } from "@/components/layout/public/page-header";

export default function OpportunitiesPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        title="Browse Opportunities"
        description="Search opportunities by type, country, or funding."
      />
      {/* TODO: GET /api/v1/opportunities */}
    </div>
  );
}