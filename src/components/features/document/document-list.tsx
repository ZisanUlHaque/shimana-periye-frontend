"use client";

import { FileText } from "lucide-react";
import { useGetMyDocuments } from "@/hooks/document.hook";
import type { IDocument } from "@/types/document.type";
import { DocumentCard } from "./document-card";
import { DocumentUploadDialog } from "./document-upload-dialog";
import { ListState } from "@/components/shared/list-state";

export function DocumentList() {
  const { data, isLoading, isError } = useGetMyDocuments();
  const documents: IDocument[] = data?.data ?? [];

  return (
    <ListState
      isLoading={isLoading}
      isError={isError}
      items={documents}
      emptyIcon={FileText}
      emptyTitle="No documents uploaded yet"
      emptyDescription="Upload your SOP, CV, or Research Statement to receive mentor reviews and instant AI evaluations."
      emptyAction={<DocumentUploadDialog />}
      errorMessage="Failed to load documents. Please try again."
    >
      {(items) => (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      )}
    </ListState>
  );
}
