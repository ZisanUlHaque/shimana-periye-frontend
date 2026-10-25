import { AdminDashboardView } from "@/components/features/dashboard/admin-dashboard-view";
import { PageHeader } from "@/components/layout/public/page-header";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <PageHeader
        title="Admin Control Center ⚡"
        description="Platform oversight, user management, mentor approvals, and system metrics."
      />
      <AdminDashboardView />
    </div>
  );
}
