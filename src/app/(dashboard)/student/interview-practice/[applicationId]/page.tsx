import { Suspense } from "react";
import { InterviewSession } from "@/components/features/interview-practice/interview-session";
import { PageHeader } from "@/components/layout/public/page-header";

export const dynamic = "force-dynamic";

interface InterviewPracticePageProps {
  params: Promise<{ applicationId: string }>;
}

async function InterviewPracticeContent({
  params,
}: InterviewPracticePageProps) {
  const { applicationId } = await params;
  return <InterviewSession applicationId={applicationId} />;
}

export default function InterviewPracticePage({
  params,
}: InterviewPracticePageProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <PageHeader
        title="Mock Admissions Interview"
        description="Practice with questions generated directly from your target degree, professor openings, and field of study."
      />
      <Suspense
        fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted/60" />}
      >
        <InterviewPracticeContent params={params} />
      </Suspense>
    </div>
  );
}
