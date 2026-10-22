import { AcademicRecordDialog } from "@/components/features/academic-record/academic-record-dialog";
import { AcademicRecordList } from "@/components/features/academic-record/academic-record-list";
import { PageHeader } from "@/components/layout/public/page-header";

export default function AcademicRecordsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Academic Records"
        description="Your undergraduate/graduate degree history."
        action={<AcademicRecordDialog />}
      />
      <AcademicRecordList />
    </div>
  );
}