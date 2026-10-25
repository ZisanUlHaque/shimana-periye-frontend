import { StudentDashboardView } from "@/components/features/dashboard/student-dashboard-view";
import { PageHeader } from "@/components/layout/public/page-header";

export default function StudentDashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <PageHeader
        title="Welcome back 👋"
        description="Here's an overview of your application journey, deadlines, and readiness."
      />
      <StudentDashboardView />
    </div>
  );
}
