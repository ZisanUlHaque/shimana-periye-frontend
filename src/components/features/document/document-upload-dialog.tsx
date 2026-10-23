"use client";

import { useState } from "react";
import { FileUp, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DocumentUploadForm } from "./document-upload-form";
import { useCreateDocument } from "@/hooks/document.hook";
import type { DocumentType } from "@/types/document.type";

export function DocumentUploadDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { mutate: uploadDoc, isPending } = useCreateDocument();

  const handleUpload = (data: {
    type: DocumentType;
    applicationId?: string;
    file: File;
  }) => {
    uploadDoc(data, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button size="sm" className="gap-1.5">
              <Plus className="size-4" />
              Upload Document
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileUp className="size-5" />
          </div>
          <DialogTitle className="mt-2">Upload Application Document</DialogTitle>
          <DialogDescription>
            Upload your SOP, CV, or Research Statement to get mentor feedback and AI scoring.
          </DialogDescription>
        </DialogHeader>

        <DocumentUploadForm onSubmit={handleUpload} isSubmitting={isPending} />
      </DialogContent>
    </Dialog>
  );
}
