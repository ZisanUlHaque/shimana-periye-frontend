import { ReadinessDashboard } from "@/components/features/readiness/readiness-dashboard";
import { PageHeader } from "@/components/layout/public/page-header";

export default function ReadinessPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <PageHeader
        title="Application Readiness"
        description="Comprehensive evaluation across 5 readiness pillars to evaluate your admission competitiveness."
      />
      <ReadinessDashboard />
    </div>
  );
}
