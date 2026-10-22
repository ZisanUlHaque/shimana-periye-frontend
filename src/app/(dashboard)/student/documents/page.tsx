import { PageHeader } from "@/components/layout/public/page-header";
import { Button } from "@/components/ui/button";

export default function DocumentsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        title="Document Studio"
        description="SOPs, CVs & Research Statements with version history."
        action={<Button size="sm">Upload Document</Button>}
      />
      {/* TODO: GET /api/v1/documents */}
      {/* TODO: POST /api/v1/documents */}
    </div>
  );
}