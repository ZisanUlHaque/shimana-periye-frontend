"use client";

import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import type { ITestRecord, TestType } from "@/types/test-record.type";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field";
import {
  type TestRecordFormValues,
  TestRecordZodSchema,
  scoreRangeByTestType,
} from "@/validation/test-record.validation";

const TEST_TYPES: { value: TestType; label: string; placeholder: string }[] = [
  { value: "IELTS", label: "IELTS (0 - 9.0)", placeholder: "e.g. 7.5" },
  { value: "TOEFL", label: "TOEFL (0 - 120)", placeholder: "e.g. 105" },
  { value: "GRE", label: "GRE (260 - 340)", placeholder: "e.g. 320" },
  { value: "GMAT", label: "GMAT (200 - 800)", placeholder: "e.g. 710" },
  { value: "OTHER", label: "Other Standardized Test", placeholder: "Score" },
];

interface TestRecordFormProps {
  defaultValues?: Partial<ITestRecord>;
  onSubmit: (values: TestRecordFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function TestRecordForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel = "Save Test Record",
}: TestRecordFormProps) {
  const isEdit = Boolean(defaultValues?.id);

  const form = useForm({
    defaultValues: {
      testType: defaultValues?.testType ?? "IELTS",
      overallScore: defaultValues?.score?.overall ?? undefined,
      plannedDate: defaultValues?.plannedDate
        ? new Date(defaultValues.plannedDate).toISOString().split("T")[0]
        : "",
      actualDate: defaultValues?.actualDate
        ? new Date(defaultValues.actualDate).toISOString().split("T")[0]
        : "",
    } as TestRecordFormValues,
    validators: {
      onSubmit: TestRecordZodSchema,
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
      {/* Test Type */}
      <form.Field name="testType">
        {(field) => {
          const hasError =
            field.state.meta.isTouched && field.state.meta.errors.length > 0;
          return (
            <div className="grid gap-1.5">
              <Label htmlFor="testType">Test Type *</Label>
              <select
                id="testType"
                disabled={isEdit || isSubmitting}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(e.target.value as TestType)
                }
              >
                {TEST_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
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

      {/* Overall Score with dynamic helper range */}
      <form.Subscribe selector={(state) => state.values.testType}>
        {(selectedType) => {
          const currentRange =
            scoreRangeByTestType[selectedType] ?? scoreRangeByTestType.OTHER;

          return (
            <form.Field name="overallScore">
              {(field) => {
                const hasError =
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0;
                return (
                  <div className="grid gap-1.5">
                    <Label htmlFor="overallScore">
                      Overall Score ({currentRange.min} - {currentRange.max})
                    </Label>
                    <Input
                      id="overallScore"
                      type="number"
                      step="any"
                      placeholder={`Enter score (${currentRange.min} - ${currentRange.max})`}
                      value={(field.state.value as number | undefined) ?? ""}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value)
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
          );
        }}
      </form.Subscribe>

      {/* Actual and Planned Dates */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <form.Field name="actualDate">
          {(field) => {
            const hasError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <div className="grid gap-1.5">
                <Label htmlFor="actualDate">Test Date (if completed)</Label>
                <Input
                  id="actualDate"
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

        <form.Field name="plannedDate">
          {(field) => {
            const hasError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <div className="grid gap-1.5">
                <Label htmlFor="plannedDate">Planned Date (if upcoming)</Label>
                <Input
                  id="plannedDate"
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
