import { OpportunityBrowser } from "@/components/features/opportunity/opportunity-browser";
import { PageHeader } from "@/components/layout/public/page-header";

export default function StudentOpportunitiesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Opportunities"
        description="Browse programmes, professor openings, lab positions, and funding."
      />
      <OpportunityBrowser />
    </div>
  );
}