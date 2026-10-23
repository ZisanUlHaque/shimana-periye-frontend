"use client";

import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import type { ILab } from "@/types/lab.type";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field";
import { type LabFormValues, LabValidation } from "@/validation/lab.validation";
import { useUniversities } from "@/hooks/university.hook";

interface LabFormProps {
  defaultValues?: Partial<ILab>;
  onSubmit: (values: LabFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function LabForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel = "Save Lab",
}: LabFormProps) {
  const { data: universitiesData, isLoading: isUniversitiesLoading } =
    useUniversities({ limit: 100 });
  const universities = universitiesData?.data ?? [];

  const form = useForm({
    defaultValues: {
      name: defaultValues?.name ?? "",
      universityId: defaultValues?.universityId ?? "",
      focusAreas: defaultValues?.focusAreas ?? [],
    } as LabFormValues,
    validators: {
      onSubmit: LabValidation.CreateLabZodSchema,
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
              <Label htmlFor="name">Lab Name *</Label>
              <Input
                id="name"
                placeholder="e.g. Center for Intelligent Systems"
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

      {/* University */}
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
