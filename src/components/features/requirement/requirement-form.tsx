"use client";

import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import type { IRequirement, RequirementType } from "@/types/requirement.type";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field";
import {
  type RequirementFormValues,
  RequirementValidation,
} from "@/validation/requirement.validation";

const REQUIREMENT_TYPES: { value: RequirementType; label: string }[] = [
  { value: "MIN_GPA", label: "Minimum GPA" },
  { value: "DEGREE_LEVEL", label: "Target Degree Level" },
  { value: "FIELD_OF_STUDY", label: "Field of Study" },
  { value: "TEST_IELTS", label: "IELTS Minimum Score" },
  { value: "TEST_TOEFL", label: "TOEFL Minimum Score" },
  { value: "TEST_GRE", label: "GRE Minimum Score" },
  { value: "TEST_GMAT", label: "GMAT Minimum Score" },
  { value: "WORK_EXPERIENCE", label: "Work Experience (Years)" },
  { value: "PUBLICATION_COUNT", label: "Required Publications" },
  { value: "DOCUMENT_REQUIRED", label: "Document Requirement" },
  { value: "OTHER", label: "Other Requirement" },
];

interface RequirementFormProps {
  defaultValues?: Partial<IRequirement>;
  onSubmit: (values: RequirementFormValues) => void;
  isSubmitting?: boolean;
}

export function RequirementForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: RequirementFormProps) {
  const form = useForm({
    defaultValues: {
      type: defaultValues?.type ?? "MIN_GPA",
      detail: defaultValues?.detail ?? "",
      minValue: defaultValues?.minValue ?? undefined,
    } as RequirementFormValues,
    validators: {
      onSubmit: RequirementValidation.CreateRequirementZodSchema,
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
      <form.Field name="type">
        {(field) => (
          <div className="grid gap-1.5">
            <Label htmlFor="reqType">Requirement Type *</Label>
            <select
              id="reqType"
              disabled={isSubmitting}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) =>
                field.handleChange(e.target.value as RequirementType)
              }
            >
              {REQUIREMENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </form.Field>

      <form.Field name="detail">
        {(field) => {
          const hasError =
            field.state.meta.isTouched && field.state.meta.errors.length > 0;
          return (
            <div className="grid gap-1.5">
              <Label htmlFor="detail">Requirement Detail *</Label>
              <Input
                id="detail"
                placeholder="e.g. Must have at least 3.5 CGPA in Computer Science"
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

      <form.Field name="minValue">
        {(field) => (
          <div className="grid gap-1.5">
            <Label htmlFor="minValue">Minimum Numeric Threshold (Optional)</Label>
            <Input
              id="minValue"
              type="number"
              step="any"
              placeholder="e.g. 3.5 or 100"
              value={(field.state.value as number | undefined) ?? ""}
              onBlur={field.handleBlur}
              onChange={(e) =>
                field.handleChange(
                  e.target.value === "" ? undefined : Number(e.target.value),
                )
              }
              disabled={isSubmitting}
            />
          </div>
        )}
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
            Save Requirement
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
