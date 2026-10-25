import { MentorDashboardView } from "@/components/features/dashboard/mentor-dashboard-view";
import { PageHeader } from "@/components/layout/public/page-header";

export default function MentorDashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <PageHeader
        title="Mentor Dashboard 🎓"
        description="Monitor your assigned students, review incoming drafts, and manage guidance sessions."
      />
      <MentorDashboardView />
    </div>
  );
}
