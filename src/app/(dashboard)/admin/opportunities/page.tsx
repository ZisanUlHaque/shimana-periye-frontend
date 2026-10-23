import { OpportunityBrowser } from "@/components/features/opportunity/opportunity-browser";
import { OpportunityDialog } from "@/components/features/opportunity/opportunity-dialog";
import { PageHeader } from "@/components/layout/public/page-header";

export default function AdminOpportunitiesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Manage Opportunities"
        description="Create and maintain opportunity listings."
        action={<OpportunityDialog />}
      />
      <OpportunityBrowser isAdmin />
    </div>
  );
}