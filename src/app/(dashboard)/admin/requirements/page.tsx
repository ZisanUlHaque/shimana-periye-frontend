import { PageHeader } from "@/components/layout/public/page-header";
import { OpportunityBrowser } from "@/components/features/opportunity/opportunity-browser";

export default function AdminRequirementsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        title="Requirements Management"
        description="Select an opportunity to view, add, or configure its eligibility criteria."
      />
      <OpportunityBrowser isAdmin />
    </div>
  );
}
