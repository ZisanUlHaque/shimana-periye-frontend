import { ProfessorBrowser } from "@/components/features/professor/professor-browser";
import { PageHeader } from "@/components/layout/public/page-header";
import { ProfessorDialog } from "@/components/features/professor/professor-dialog";

export default function AdminProfessorsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        title="Professors"
        description="Manage professor records, affiliations, and research areas."
        action={<ProfessorDialog />}
      />
      <ProfessorBrowser isAdmin />
    </div>
  );
}
