import { RecommendationRequestDialog } from "@/components/features/recommendation-request/recommendation-request-dialog";
import { RecommendationRequestList } from "@/components/features/recommendation-request/recommendation-request-list";
import { PageHeader } from "@/components/layout/public/page-header";

export default function RecommendationsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        title="Letters of Recommendation"
        description="Track recommendation letter requests, follow-up dates, and submission statuses."
        action={<RecommendationRequestDialog />}
      />
      <RecommendationRequestList />
    </div>
  );
}
