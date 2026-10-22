import { PageHeader } from "@/components/layout/public/page-header";
import { Button } from "@/components/ui/button";

export default function OutreachPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        title="Professor Outreach"
        description="Log cold emails to prospective professors."
        action={<Button size="sm">Log Outreach</Button>}
      />
      {/* TODO: CRUD /api/v1/outreach-logs */}
      {/* TODO: PATCH /api/v1/outreach-logs/:id/status */}
    </div>
  );
}