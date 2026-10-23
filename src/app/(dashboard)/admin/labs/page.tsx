import { LabBrowser } from "@/components/features/lab/lab-browser";
import { PageHeader } from "@/components/layout/public/page-header";
import { LabDialog } from "@/components/features/lab/lab-dialog";

export default function AdminLabsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        title="Laboratories"
        description="Manage research laboratories and institutions."
        action={<LabDialog />}
      />
      <LabBrowser isAdmin />
    </div>
  );
}
