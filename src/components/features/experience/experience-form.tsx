"use client";

import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import type { IExperience } from "@/types/experience.type";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field";
import {
  type ExperienceFormValues,
  ExperienceZodSchema,
} from "@/validation/experience.validation";

interface ExperienceFormProps {
  defaultValues?: Partial<IExperience>;
  onSubmit: (values: ExperienceFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function ExperienceForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel = "Save Experience",
}: ExperienceFormProps) {
  const form = useForm({
    defaultValues: {
      role: defaultValues?.role ?? "",
      organization: defaultValues?.organization ?? "",
      startDate: defaultValues?.startDate
        ? new Date(defaultValues.startDate).toISOString().split("T")[0]
        : "",
      endDate: defaultValues?.endDate
        ? new Date(defaultValues.endDate).toISOString().split("T")[0]
        : "",
      description: defaultValues?.description ?? "",
    } as ExperienceFormValues,
    validators: {
      onSubmit: ExperienceZodSchema,
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
      {/* Role */}
      <form.Field name="role">
        {(field) => {
          const hasError =
            field.state.meta.isTouched && field.state.meta.errors.length > 0;
          return (
            <div className="grid gap-1.5">
              <Label htmlFor="role">Role / Position *</Label>
              <Input
                id="role"
                placeholder="e.g. Research Assistant / Software Engineer"
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

      {/* Organization */}
      <form.Field name="organization">
        {(field) => {
          const hasError =
            field.state.meta.isTouched && field.state.meta.errors.length > 0;
          return (
            <div className="grid gap-1.5">
              <Label htmlFor="organization">Organization / Lab *</Label>
              <Input
                id="organization"
                placeholder="e.g. AI Research Lab, BUET"
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

      {/* Start Date and End Date */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <form.Field name="startDate">
          {(field) => {
            const hasError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <div className="grid gap-1.5">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
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

        <form.Field name="endDate">
          {(field) => {
            const hasError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <div className="grid gap-1.5">
                <Label htmlFor="endDate">End Date (or blank for present)</Label>
                <Input
                  id="endDate"
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

      {/* Description */}
      <form.Field name="description">
        {(field) => {
          const hasError =
            field.state.meta.isTouched && field.state.meta.errors.length > 0;
          return (
            <div className="grid gap-1.5">
              <Label htmlFor="description">Description & Contributions</Label>
              <Textarea
                id="description"
                placeholder="Key projects, methodologies used, or impact..."
                rows={3}
                value={(field.state.value as string) ?? ""}
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
