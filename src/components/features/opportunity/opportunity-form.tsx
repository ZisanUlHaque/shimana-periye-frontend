"use client";

import { useForm } from "@tanstack/react-form";
import { ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUniversities } from "@/hooks/university.hook";
import type { IOpportunity, OpportunityType } from "@/types/opportunity.type";
import {
  type OpportunityFormValues,
  OpportunityValidation,
} from "@/validation";

const TYPE_OPTIONS: { value: OpportunityType; label: string }[] = [
  { value: "PROGRAMME", label: "Programme" },
  { value: "PROFESSOR_OPENING", label: "Professor Opening" },
  { value: "LAB_POSITION", label: "Lab Position" },
  { value: "FUNDING", label: "Funding / Scholarship" },
];

function toDateInputValue(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

interface OpportunityFormProps {
  defaultValues?: Partial<IOpportunity>;
  onSubmit: (values: OpportunityFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function OpportunityForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel = "Save",
}: OpportunityFormProps) {
  const { data: universitiesData, isLoading: isUniversitiesLoading } =
    useUniversities({
      limit: 100,
    });

  const form = useForm({
    defaultValues: {
      type: defaultValues?.type ?? "PROGRAMME",
      title: defaultValues?.title ?? "",
      universityId: defaultValues?.universityId ?? "",
      professorId: defaultValues?.professorId ?? "",
      labId: defaultValues?.labId ?? "",
      fieldOfStudy: defaultValues?.fieldOfStudy ?? "",
      deadline: toDateInputValue(defaultValues?.deadline),
      source: defaultValues?.source ?? "",
      lastCheckedAt:
        toDateInputValue(defaultValues?.lastCheckedAt) ||
        toDateInputValue(new Date().toISOString()),
      imageUrl: defaultValues?.imageUrl ?? "",
    } as OpportunityFormValues,
    validators: {
      onSubmit: OpportunityValidation.CreateOpportunityZodSchema,
    },
    onSubmit: ({ value }) => {
      const sanitized: OpportunityFormValues = {
        ...value,
        professorId: value.professorId?.trim()
          ? value.professorId.trim()
          : undefined,
        labId: value.labId?.trim() ? value.labId.trim() : undefined,
        deadline: value.deadline?.trim() ? value.deadline.trim() : undefined,
        imageUrl: value.imageUrl?.trim() ? value.imageUrl.trim() : undefined,
      };
      onSubmit(sanitized);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-4 w-full max-w-full"
      noValidate
    >
      <div className="grid grid-cols-2 gap-3">
        <form.Field name="type">
          {(field) => (
            <div className="grid gap-1.5">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                value={field.state.value as string}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(e.target.value as OpportunityType)
                }
                disabled={isSubmitting}
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-hidden focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                {TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </form.Field>

        <form.Field name="fieldOfStudy">
          {(field) => {
            const hasError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <div className="grid gap-1.5">
                <Label htmlFor="fieldOfStudy">Field of Study</Label>
                <Input
                  id="fieldOfStudy"
                  placeholder="e.g. Computer Science"
                  value={field.state.value as string}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isSubmitting}
                />
                {hasError && (
                  <FieldError className="text-xs">
                    {field.state.meta.errors
                      .map((e) => e?.message || String(e))
                      .join(", ")}
                  </FieldError>
                )}
              </div>
            );
          }}
        </form.Field>
      </div>

      <form.Field name="title">
        {(field) => {
          const hasError =
            field.state.meta.isTouched && field.state.meta.errors.length > 0;
          return (
            <div className="grid gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g. Full PhD Research Fellowship in AI"
                value={field.state.value as string}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={isSubmitting}
              />
              {hasError && (
                <FieldError className="text-xs">
                  {field.state.meta.errors
                    .map((e) => e?.message || String(e))
                    .join(", ")}
                </FieldError>
              )}
            </div>
          );
        }}
      </form.Field>

      {/* Image URL with live preview */}
      <form.Field name="imageUrl">
        {(field) => (
          <div className="grid gap-1.5">
            <Label htmlFor="imageUrl">Banner / Logo Image URL (optional)</Label>
            <div className="flex gap-2 items-center w-full min-w-0">
              <Input
                id="imageUrl"
                placeholder="https://.../scholarship-banner.jpg"
                value={(field.state.value as string) ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={isSubmitting}
                className="flex-1 min-w-0"
              />
              {field.state.value ? (
                <div className="size-9 shrink-0 rounded-lg border overflow-hidden bg-muted flex items-center justify-center relative">
                  <Image
                    src={field.state.value as string}
                    alt="Preview"
                    width={36}
                    height={36}
                    unoptimized
                    className="size-full object-cover"
                  />
                </div>
              ) : (
                <div className="size-9 shrink-0 rounded-lg border border-dashed flex items-center justify-center text-muted-foreground/60">
                  <ImageIcon className="size-4" />
                </div>
              )}
            </div>
          </div>
        )}
      </form.Field>

      <form.Field name="universityId">
        {(field) => {
          const hasError =
            field.state.meta.isTouched && field.state.meta.errors.length > 0;
          return (
            <div className="grid gap-1.5">
              <Label htmlFor="universityId">University</Label>
              <select
                id="universityId"
                value={field.state.value as string}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={isSubmitting || isUniversitiesLoading}
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-hidden focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <option value="">Select a university</option>
                {universitiesData?.data?.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.country})
                  </option>
                ))}
              </select>
              {hasError && (
                <FieldError className="text-xs">
                  {field.state.meta.errors
                    .map((e) => e?.message || String(e))
                    .join(", ")}
                </FieldError>
              )}
            </div>
          );
        }}
      </form.Field>

      <div className="grid grid-cols-2 gap-3">
        <form.Field name="professorId">
          {(field) => (
            <div className="grid gap-1.5">
              <Label htmlFor="professorId">Professor ID (optional)</Label>
              <Input
                id="professorId"
                placeholder="UUID"
                value={(field.state.value as string) ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          )}
        </form.Field>

        <form.Field name="labId">
          {(field) => (
            <div className="grid gap-1.5">
              <Label htmlFor="labId">Lab ID (optional)</Label>
              <Input
                id="labId"
                placeholder="UUID"
                value={(field.state.value as string) ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          )}
        </form.Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <form.Field name="deadline">
          {(field) => (
            <div className="grid gap-1.5">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={(field.state.value as string) ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          )}
        </form.Field>

        <form.Field name="lastCheckedAt">
          {(field) => {
            const hasError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <div className="grid gap-1.5">
                <Label htmlFor="lastCheckedAt">Last Checked At</Label>
                <Input
                  id="lastCheckedAt"
                  type="date"
                  value={field.state.value as string}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isSubmitting}
                />
                {hasError && (
                  <FieldError className="text-xs">
                    {field.state.meta.errors
                      .map((e) => e?.message || String(e))
                      .join(", ")}
                  </FieldError>
                )}
              </div>
            );
          }}
        </form.Field>
      </div>

      <form.Field name="source">
        {(field) => {
          const hasError =
            field.state.meta.isTouched && field.state.meta.errors.length > 0;
          return (
            <div className="grid gap-1.5">
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                placeholder="e.g. https://university.edu/admissions"
                value={field.state.value as string}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={isSubmitting}
              />
              {hasError && (
                <FieldError className="text-xs">
                  {field.state.meta.errors
                    .map((e) => e?.message || String(e))
                    .join(", ")}
                </FieldError>
              )}
            </div>
          );
        }}
      </form.Field>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting] as const}
      >
        {([canSubmit, isFormSubmitting]) => (
          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="mt-2 w-full"
          >
            {(isSubmitting || isFormSubmitting) && (
              <Loader2 className="size-4 animate-spin" />
            )}
            {submitLabel}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
