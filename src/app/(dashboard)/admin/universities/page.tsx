// app/(dashboard)/admin/universities/page.tsx
import { UniversityDialog } from "@/components/features/university/university-dialog";
import { UniversityList } from "@/components/features/university/university-list";
import { PageHeader } from "@/components/layout/public/page-header";

export default function AdminUniversitiesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Universities"
        description="Manage the university reference list used across opportunities."
        action={<UniversityDialog />}
      />
      <UniversityList isAdmin />
    </div>
  );
}