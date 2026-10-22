import { PageHeader } from "@/components/layout/public/page-header";
import { Button } from "@/components/ui/button";

export default async function InterviewPracticePage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        title="Mock Interview"
        description={`AI-generated questions for application ${applicationId}`}
        action={<Button size="sm">Generate Questions</Button>}
      />
      {/* TODO: POST /api/v1/interview-practice/:applicationId/generate */}
      {/* TODO: POST /api/v1/interview-practice/:applicationId/evaluate */}
    </div>
  );
}