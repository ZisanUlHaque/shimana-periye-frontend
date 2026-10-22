import { PageHeader } from "@/components/layout/public/page-header";
import { Button } from "@/components/ui/button";

export default function TestRecordsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Test Scores"
        description="IELTS, TOEFL, GRE, GMAT records."
        action={<Button size="sm">Add Test Score</Button>}
      />
      {/* TODO: CRUD /api/v1/test-records */}
    </div>
  );
}