import { ApplicationPicker } from "@/components/features/interview-practice/application-picker";
import { PageHeader } from "@/components/layout/public/page-header";

export default function InterviewPracticeListPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <PageHeader
        title="AI Mock Interview Practice"
        description="Select an application to practice tailored admissions questions, receive scoring, and get actionable feedback."
      />
      <ApplicationPicker />
    </div>
  );
}
