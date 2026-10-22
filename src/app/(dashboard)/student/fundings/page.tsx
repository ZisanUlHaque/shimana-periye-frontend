import { PageHeader } from "@/components/layout/public/page-header";
import { Button } from "@/components/ui/button";

export default function FundingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        title="Scholarships & Funding"
        description="Track scholarship or fellowship opportunities."
        action={<Button size="sm">Add Funding</Button>}
      />
      {/* TODO: CRUD /api/v1/fundings */}
      {/* TODO: PATCH /api/v1/fundings/:id/status */}
    </div>
  );
}