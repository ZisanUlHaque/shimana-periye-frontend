import { ApplicationList } from "@/components/features/application/application-list";
import { PageHeader } from "@/components/layout/public/page-header";

export default function ApplicationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My Applications"
        description="Track and manage all your active applications."
      />
      <ApplicationList />
    </div>
  );
}