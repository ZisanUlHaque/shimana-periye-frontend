import { PageHeader } from "@/components/layout/public/page-header";

export default function ReadinessPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        title="Readiness Score"
        description="Composite score across 5 readiness axes."
      />
      {/* TODO: GET /api/v1/readiness/me */}
    </div>
  );
}