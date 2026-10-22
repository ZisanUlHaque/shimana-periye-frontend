import { PageHeader } from "@/components/layout/public/page-header";
import { Button } from "@/components/ui/button";

export default function ExperiencesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Experience"
        description="Work, lab, or research experience."
        action={<Button size="sm">Add Experience</Button>}
      />
      {/* TODO: CRUD /api/v1/experiences */}
    </div>
  );
}