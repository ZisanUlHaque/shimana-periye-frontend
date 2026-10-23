import { ExperienceDialog } from "@/components/features/experience/experience-dialog";
import { ExperienceList } from "@/components/features/experience/experience-list";
import { PageHeader } from "@/components/layout/public/page-header";

export default function ExperiencesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Experience"
        description="Work, lab, or research experience."
        action={<ExperienceDialog />}
      />
      <ExperienceList />
    </div>
  );
}
