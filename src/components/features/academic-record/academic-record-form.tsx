"use client";

import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import type { z } from "zod";
import type { IAcademicRecord } from "@/types/academic-record.type";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field";
import { AcademicRecordZodSchema } from "@/validation";

type FormValues = z.infer<typeof AcademicRecordZodSchema>;

interface AcademicRecordFormProps {
  defaultValues?: Partial<IAcademicRecord>;
  onSubmit: (values: FormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function AcademicRecordForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel = "Save",
}: AcademicRecordFormProps) {
  const form = useForm({
    defaultValues: {
      degree: defaultValues?.degree ?? "",
      institution: defaultValues?.institution ?? "",
      fieldOfStudy: defaultValues?.fieldOfStudy ?? "",
      gpa: defaultValues?.gpa ?? undefined,
      startYear: defaultValues?.startYear ?? undefined,
      endYear: defaultValues?.endYear ?? undefined,
    } as FormValues,
    validators: {
      onSubmit: AcademicRecordZodSchema,
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
      {/* Degree */}
      <form.Field name="degree">
        {(field) => {
          const hasError =
            field.state.meta.isTouched && field.state.meta.errors.length > 0;
          return (
            <div className="grid gap-1.5">
              <Label htmlFor="degree">Degree</Label>
              <Input
                id="degree"
                placeholder="e.g. Bachelor of Science"
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

      {/* Institution */}
      <form.Field name="institution">
        {(field) => {
          const hasError =
            field.state.meta.isTouched && field.state.meta.errors.length > 0;
          return (
            <div className="grid gap-1.5">
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                placeholder="e.g. University of Dhaka"
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

      {/* Field of Study */}
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

      {/* GPA / Start Year / End Year */}
      <div className="grid grid-cols-3 gap-3">
        <form.Field name="gpa">
          {(field) => {
            const hasError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <div className="grid gap-1.5">
                <Label htmlFor="gpa">GPA</Label>
                <Input
                  id="gpa"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={(field.state.value as number | undefined) ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(
                      e.target.value === "" ? undefined : Number(e.target.value)
                    )
                  }
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

        <form.Field name="startYear">
          {(field) => {
            const hasError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <div className="grid gap-1.5">
                <Label htmlFor="startYear">Start Year</Label>
                <Input
                  id="startYear"
                  type="number"
                  placeholder="2019"
                  value={(field.state.value as number | undefined) ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(
                      e.target.value === "" ? undefined : Number(e.target.value)
                    )
                  }
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

        <form.Field name="endYear">
          {(field) => {
            const hasError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <div className="grid gap-1.5">
                <Label htmlFor="endYear">End Year</Label>
                <Input
                  id="endYear"
                  type="number"
                  placeholder="2023"
                  value={(field.state.value as number | undefined) ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(
                      e.target.value === "" ? undefined : Number(e.target.value)
                    )
                  }
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