import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/public/page-header";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        title="Application Details"
        description={`Application ID: ${id}`}
        action={
          <div className="flex gap-2">
            <Link href={`/student/applications/${id}/tasks`}>
              <Button size="sm" variant="outline">
                Tasks
              </Button>
            </Link>
            <Link href={`/student/applications/${id}/cost-estimate`}>
              <Button size="sm" variant="outline">
                Cost Estimate
              </Button>
            </Link>
          </div>
        }
      />
      {/* TODO: GET /api/v1/applications/:id */}
      {/* TODO: PATCH /api/v1/applications/:id/status */}
      {/* TODO: PATCH /api/v1/applications/:id/interview */}
      {/* TODO: PATCH /api/v1/applications/:id/decision */}
    </div>
  );
}