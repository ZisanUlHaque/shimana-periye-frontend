import { DocumentUploadDialog } from "@/components/features/document/document-upload-dialog";
import { DocumentList } from "@/components/features/document/document-list";
import { PageHeader } from "@/components/layout/public/page-header";

export default function DocumentsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        title="Document Studio"
        description="SOPs, CVs & Research Statements with version history and AI evaluation."
        action={<DocumentUploadDialog />}
      />
      <DocumentList />
    </div>
  );
}
