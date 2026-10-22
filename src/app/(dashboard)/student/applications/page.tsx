import { PageHeader } from "@/components/layout/public/page-header";
import { Button } from "@/components/ui/button";

export default function ApplicationsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        title="My Applications"
        description="Track all your applications and current stages."
        action={<Button size="sm">New Application</Button>}
      />
      {/* TODO: GET /api/v1/applications */}
      {/* TODO: POST /api/v1/applications */}
    </div>
  );
}