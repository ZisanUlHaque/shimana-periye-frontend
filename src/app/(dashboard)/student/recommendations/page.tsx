import { PageHeader } from "@/components/layout/public/page-header";
import { Button } from "@/components/ui/button";

export default function RecommendationsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        title="Recommendation Requests"
        description="Track recommendation letter requests."
        action={<Button size="sm">New Request</Button>}
      />
      {/* TODO: CRUD /api/v1/recommendation-requests */}
      {/* TODO: PATCH /api/v1/recommendation-requests/:id/status */}
    </div>
  );
}