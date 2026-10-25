import { FundingList } from "@/components/features/funding/funding-list";
import { PageHeader } from "@/components/layout/public/page-header";

export default function FundingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <PageHeader
        title="Scholarships & Funding"
        description="Track your scholarships, fellowships, assistantships, and financial packages."
      />
      <FundingList />
    </div>
  );
}
