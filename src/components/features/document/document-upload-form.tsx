"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Loader2, Upload } from "lucide-react";
import type { DocumentType } from "@/types/document.type";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field";
import { useGetMyApplications } from "@/hooks/application.hook";

const DOC_TYPES: { value: DocumentType; label: string }[] = [
  { value: "SOP", label: "Statement of Purpose (SOP)" },
  { value: "CV", label: "Curriculum Vitae (CV) / Resume" },
  { value: "RESEARCH_STATEMENT", label: "Research Statement" },
  { value: "TRANSCRIPT", label: "Academic Transcript" },
  { value: "OTHER", label: "Other Supporting Document" },
];

interface DocumentUploadFormProps {
  onSubmit: (data: { type: DocumentType; applicationId?: string; file: File }) => void;
  isSubmitting?: boolean;
}

export function DocumentUploadForm({
  onSubmit,
  isSubmitting,
}: DocumentUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const { data: appsData } = useGetMyApplications();
  const applications = appsData?.data ?? [];

  const form = useForm({
    defaultValues: {
      type: "SOP" as DocumentType,
      applicationId: "",
    },
    onSubmit: ({ value }) => {
      if (!selectedFile) {
        setFileError("Please select a file to upload (PDF, DOCX).");
        return;
      }
      const trimmedAppId = value.applicationId?.trim();
      onSubmit({
        type: value.type,
        ...(trimmedAppId ? { applicationId: trimmedAppId } : {}),
        file: selectedFile,
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-4"
      noValidate
    >
      {/* Document Type */}
      <form.Field name="type">
        {(field) => (
          <div className="grid gap-1.5">
            <Label htmlFor="docType">Document Type *</Label>
            <select
              id="docType"
              disabled={isSubmitting}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value as DocumentType)}
            >
              {DOC_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </form.Field>

      {/* Target Application (Optional) */}
      <form.Field name="applicationId">
        {(field) => (
          <div className="grid gap-1.5">
            <Label htmlFor="applicationId">Link to Application (Optional)</Label>
            <select
              id="applicationId"
              disabled={isSubmitting}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            >
              <option value="">General Document (Not linked)</option>
              {applications.map((app: any) => (
                <option key={app.id} value={app.id}>
                  {app.opportunity?.title ?? "Application"}
                </option>
              ))}
            </select>
          </div>
        )}
      </form.Field>

      {/* File Upload Picker */}
      <div className="grid gap-1.5">
        <Label htmlFor="fileInput">Document File (PDF, DOCX) *</Label>
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
          className="flex w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs shadow-xs file:mr-3 file:border-0 file:bg-transparent file:text-xs file:font-medium hover:file:cursor-pointer"
        />
        {fileError && <FieldError className="text-xs">{fileError}</FieldError>}
      </div>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting] as const}
      >
        {([canSubmit, isFormSubmitting]) => (
          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="mt-2 w-full gap-2"
          >
            {(isSubmitting || isFormSubmitting) ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}
            Upload Document
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
