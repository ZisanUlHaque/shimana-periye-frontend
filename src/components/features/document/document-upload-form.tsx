"use client";

import { useState } from "react";
import { Loader2, Upload, AlertCircle, FileCheck } from "lucide-react";
import type { DocumentType } from "@/types/document.type";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useGetMyApplications } from "@/hooks/application.hook";

const DOC_TYPES: { value: DocumentType; label: string }[] = [
  { value: "SOP", label: "Statement of Purpose (SOP)" },
  { value: "CV", label: "Curriculum Vitae (CV) / Resume" },
  { value: "RESEARCH_STATEMENT", label: "Research Statement" },
  { value: "OTHER", label: "Academic Transcript / Other Document" },
];

interface DocumentUploadFormProps {
  onSubmit: (data: { type: DocumentType; applicationId?: string; file: File }) => void;
  isSubmitting?: boolean;
}

export function DocumentUploadForm({
  onSubmit,
  isSubmitting,
}: DocumentUploadFormProps) {
  const [type, setType] = useState<DocumentType>("SOP");
  const [applicationId, setApplicationId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const { data: appsData } = useGetMyApplications();
  const applications = appsData?.data ?? [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setFileError("Please select a document file (.pdf, .doc, .docx).");
      return;
    }

    setFileError(null);
    onSubmit({
      type,
      ...(applicationId ? { applicationId } : {}),
      file: selectedFile,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Document Type */}
      <div className="grid gap-1.5">
        <Label htmlFor="docType" className="text-xs font-semibold">
          Document Category <span className="text-destructive">*</span>
        </Label>
        <select
          id="docType"
          disabled={isSubmitting}
          className="flex h-10 w-full rounded-xl border border-input bg-card px-3 text-xs shadow-xs transition-colors focus:border-primary focus:outline-hidden disabled:opacity-50"
          value={type}
          onChange={(e) => setType(e.target.value as DocumentType)}
        >
          {DOC_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Target Application (Optional) */}
      <div className="grid gap-1.5">
        <Label htmlFor="applicationId" className="text-xs font-semibold">
          Link to Program Application (Optional)
        </Label>
        <select
          id="applicationId"
          disabled={isSubmitting}
          className="flex h-10 w-full rounded-xl border border-input bg-card px-3 text-xs shadow-xs transition-colors focus:border-primary focus:outline-hidden disabled:opacity-50"
          value={applicationId}
          onChange={(e) => setApplicationId(e.target.value)}
        >
          <option value="">General Document (Vault / Unassigned)</option>
          {applications.map((app: any) => (
            <option key={app.id} value={app.id}>
              {app.opportunity?.title ?? "Application"}
            </option>
          ))}
        </select>
      </div>

      {/* File Upload Picker */}
      <div className="grid gap-1.5">
        <Label htmlFor="fileInput" className="text-xs font-semibold">
          Upload File (PDF or Word DOCX) <span className="text-destructive">*</span>
        </Label>
        <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/80 bg-muted/20 p-5 text-center transition-colors hover:border-primary/50">
          <input
            id="fileInput"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setSelectedFile(file);
              if (file) setFileError(null);
            }}
            disabled={isSubmitting}
            className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
          />

          {selectedFile ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <FileCheck className="size-5" />
              <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)</span>
            </div>
          ) : (
            <>
              <Upload className="size-6 text-muted-foreground mb-1.5" />
              <p className="text-xs font-semibold text-foreground">
                Click to browse or drag file here
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                PDF, DOC, DOCX up to 10MB
              </p>
            </>
          )}
        </div>

        {fileError && (
          <p className="flex items-center gap-1 text-xs text-destructive mt-1">
            <AlertCircle className="size-3.5" />
            {fileError}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 w-full gap-2 rounded-xl text-xs font-bold"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Uploading to Cloudinary...
          </>
        ) : (
          <>
            <Upload className="size-4" />
            Upload Document
          </>
        )}
      </Button>
    </form>
  );
}
