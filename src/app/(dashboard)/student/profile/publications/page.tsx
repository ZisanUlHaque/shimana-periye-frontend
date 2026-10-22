import { PageHeader } from "@/components/layout/public/page-header";
import { Button } from "@/components/ui/button";

export default function PublicationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Publications"
        description="Journal publications, DOI & citations."
        action={<Button size="sm">Add Publication</Button>}
      />
      {/* TODO: CRUD /api/v1/publications */}
    </div>
  );
}