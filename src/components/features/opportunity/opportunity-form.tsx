"use client";

import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field";
import type { IOpportunity, OpportunityType } from "@/types/opportunity.type";
import { OpportunityValidation, type OpportunityFormValues } from "@/validation";
import { useUniversities } from "@/hooks/university.hook";

const TYPE_OPTIONS: { value: OpportunityType; label: string }[] = [
  { value: "PROGRAMME", label: "Programme" },
  { value: "PROFESSOR_OPENING", label: "Professor Opening" },
  { value: "LAB_POSITION", label: "Lab Position" },
  { value: "FUNDING", label: "Funding" },
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
  // Lifted to top level — must not be called inside form.Field render props
  const { data: universitiesData, isLoading: isUniversitiesLoading } = useUniversities({
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
      toDateInputValue(defaultValues?.lastCheckedAt) || toDateInputValue(new Date().toISOString()),
  } as OpportunityFormValues,
  validators: {
    onSubmit: OpportunityValidation.CreateOpportunityZodSchema,
  },
  onSubmit: ({ value }) => {
    const sanitized: OpportunityFormValues = {
      ...value,
      professorId: value.professorId?.trim() ? value.professorId.trim() : undefined,
      labId: value.labId?.trim() ? value.labId.trim() : undefined,
      deadline: value.deadline?.trim() ? value.deadline.trim() : undefined,
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
      className="flex flex-col gap-4"
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
                onChange={(e) => field.handleChange(e.target.value as OpportunityType)}
                disabled={isSubmitting}
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
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
            const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
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
                    {field.state.meta.errors.map((e) => e?.message || String(e)).join(", ")}
                  </FieldError>
                )}
              </div>
            );
          }}
        </form.Field>
      </div>

      <form.Field name="title">
        {(field) => {
          const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
          return (
            <div className="grid gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g. PhD in Machine Learning"
                value={field.state.value as string}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={isSubmitting}
              />
              {hasError && (
                <FieldError className="text-xs">
                  {field.state.meta.errors.map((e) => e?.message || String(e)).join(", ")}
                </FieldError>
              )}
            </div>
          );
        }}
      </form.Field>

      <form.Field name="universityId">
        {(field) => {
          const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
          return (
            <div className="grid gap-1.5">
              <Label htmlFor="universityId">University</Label>
              <select
                id="universityId"
                value={field.state.value as string}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={isSubmitting || isUniversitiesLoading}
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <option value="">
                  {isUniversitiesLoading ? "Loading universities..." : "Select a university"}
                </option>
                {universitiesData?.data.map((uni) => (
                  <option key={uni.id} value={uni.id}>
                    {uni.name} ({uni.country})
                  </option>
                ))}
              </select>
              {hasError && (
                <FieldError className="text-xs">
                  {field.state.meta.errors.map((e) => e?.message || String(e)).join(", ")}
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
            const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
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
                    {field.state.meta.errors.map((e) => e?.message || String(e)).join(", ")}
                  </FieldError>
                )}
              </div>
            );
          }}
        </form.Field>
      </div>

      <form.Field name="source">
        {(field) => {
          const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
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
                  {field.state.meta.errors.map((e) => e?.message || String(e)).join(", ")}
                </FieldError>
              )}
            </div>
          );
        }}
      </form.Field>

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
        {([canSubmit, isFormSubmitting]) => (
          <Button type="submit" disabled={!canSubmit || isSubmitting} className="mt-2 w-full">
            {(isSubmitting || isFormSubmitting) && <Loader2 className="size-4 animate-spin" />}
            {submitLabel}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}