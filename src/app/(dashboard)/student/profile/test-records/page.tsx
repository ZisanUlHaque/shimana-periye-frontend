import { TestRecordDialog } from "@/components/features/test-record/test-record-dialog";
import { TestRecordList } from "@/components/features/test-record/test-record-list";
import { PageHeader } from "@/components/layout/public/page-header";

export default function TestRecordsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Test Scores"
        description="IELTS, TOEFL, GRE, GMAT records."
        action={<TestRecordDialog />}
      />
      <TestRecordList />
    </div>
  );
}
