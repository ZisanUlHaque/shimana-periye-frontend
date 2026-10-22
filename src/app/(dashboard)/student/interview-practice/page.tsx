import { PageHeader } from "@/components/layout/public/page-header";

export default function InterviewPracticeListPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        title="Interview Practice"
        description="Pick an application to start a mock interview."
      />
      {/* TODO: list applications → link to /student/interview-practice/[applicationId] */}
    </div>
  );
}