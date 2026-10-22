import { PageHeader } from "@/components/layout/public/page-header";
import { Button } from "@/components/ui/button";

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        title="Document Review"
        description={`Document ID: ${id}`}
        action={<Button size="sm">Run AI Feedback</Button>}
      />
      {/* TODO: GET /api/v1/documents/:id */}
      {/* TODO: POST /api/v1/documents/:id/ai-feedback */}
      {/* TODO: POST /api/v1/documents/:id/versions */}
      {/* TODO: PATCH /api/v1/documents/:id */}
      {/* TODO: DELETE /api/v1/documents/:id */}
    </div>
  );
}