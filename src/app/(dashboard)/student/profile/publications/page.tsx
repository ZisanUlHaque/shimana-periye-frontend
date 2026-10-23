import { PublicationDialog } from "@/components/features/publication/publication-dialog";
import { PublicationList } from "@/components/features/publication/publication-list";
import { PageHeader } from "@/components/layout/public/page-header";

export default function PublicationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Publications"
        description="Journal publications, DOI & citations."
        action={<PublicationDialog />}
      />
      <PublicationList />
    </div>
  );
}
