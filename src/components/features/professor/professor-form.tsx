"use client";

import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import type { IProfessor } from "@/types/professor.type";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field";
import {
  type ProfessorFormValues,
  ProfessorValidation,
} from "@/validation/professor.validation";
import { useUniversities } from "@/hooks/university.hook";
import { useLabs } from "@/hooks/lab.hook";

interface ProfessorFormProps {
  defaultValues?: Partial<IProfessor>;
  onSubmit: (values: ProfessorFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function ProfessorForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel = "Save Professor",
}: ProfessorFormProps) {
  const { data: universitiesData, isLoading: isUniversitiesLoading } =
    useUniversities({ limit: 100 });
  const { data: labsData, isLoading: isLabsLoading } = useLabs();

  const universities = universitiesData?.data ?? [];
  const labs = labsData?.data ?? [];

  const form = useForm({
    defaultValues: {
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      universityId: defaultValues?.universityId ?? "",
      labId: defaultValues?.labId ?? "",
      researchAreas: defaultValues?.researchAreas ?? [],
    } as ProfessorFormValues,
    validators: {
      onSubmit: ProfessorValidation.CreateProfessorZodSchema,
    },
    onSubmit: ({ value }) => {
      onSubmit(value);
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
      {/* Name */}
      <form.Field name="name">
        {(field) => {
          const hasError =
            field.state.meta.isTouched && field.state.meta.errors.length > 0;
          return (
            <div className="grid gap-1.5">
              <Label htmlFor="name">Professor Name *</Label>
              <Input
                id="name"
                placeholder="e.g. Dr. Jane Doe"
                value={field.state.value}
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

      {/* Email */}
      <form.Field name="email">
        {(field) => {
          const hasError =
            field.state.meta.isTouched && field.state.meta.errors.length > 0;
          return (
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="professor@university.edu"
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

      {/* University Selection */}
      <form.Field name="universityId">
        {(field) => {
          const hasError =
            field.state.meta.isTouched && field.state.meta.errors.length > 0;
          return (
            <div className="grid gap-1.5">
              <Label htmlFor="universityId">Affiliated University *</Label>
              <select
                id="universityId"
                disabled={isSubmitting || isUniversitiesLoading}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              >
                <option value="">Select a university</option>
                {universities.map((u: any) => (
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

      {/* Lab Selection (Optional) */}
      <form.Field name="labId">
        {(field) => {
          return (
            <div className="grid gap-1.5">
              <Label htmlFor="labId">Affiliated Lab (Optional)</Label>
              <select
                id="labId"
                disabled={isSubmitting || isLabsLoading}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={(field.state.value as string) ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              >
                <option value="">None / Independent</option>
                {labs.map((l: any) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
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
