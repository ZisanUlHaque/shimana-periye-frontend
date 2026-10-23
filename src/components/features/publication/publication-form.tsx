"use client";

import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import type { IPublication } from "@/types/publication.type";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field";
import {
  type PublicationFormValues,
  PublicationZodSchema,
} from "@/validation/publication.validation";

interface PublicationFormProps {
  defaultValues?: Partial<IPublication>;
  onSubmit: (values: PublicationFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function PublicationForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel = "Save Publication",
}: PublicationFormProps) {
  const form = useForm({
    defaultValues: {
      title: defaultValues?.title ?? "",
      venue: defaultValues?.venue ?? "",
      year: defaultValues?.year ?? undefined,
      link: defaultValues?.link ?? "",
    } as PublicationFormValues,
    validators: {
      onSubmit: PublicationZodSchema,
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
      {/* Title */}
      <form.Field name="title">
        {(field) => {
          const hasError =
            field.state.meta.isTouched && field.state.meta.errors.length > 0;
          return (
            <div className="grid gap-1.5">
              <Label htmlFor="title">Paper / Article Title *</Label>
              <Input
                id="title"
                placeholder="e.g. Deep Learning Approaches to Autonomous Navigation"
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

      {/* Venue */}
      <form.Field name="venue">
        {(field) => {
          const hasError =
            field.state.meta.isTouched && field.state.meta.errors.length > 0;
          return (
            <div className="grid gap-1.5">
              <Label htmlFor="venue">Venue / Journal / Conference</Label>
              <Input
                id="venue"
                placeholder="e.g. IEEE Transactions on Neural Networks, NeurIPS"
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

      {/* Year and Link */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <form.Field name="year">
          {(field) => {
            const hasError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <div className="grid gap-1.5">
                <Label htmlFor="year">Publication Year</Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="2024"
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

        <form.Field name="link">
          {(field) => {
            const hasError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <div className="grid gap-1.5">
                <Label htmlFor="link">DOI / Paper URL</Label>
                <Input
                  id="link"
                  type="url"
                  placeholder="https://doi.org/..."
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
