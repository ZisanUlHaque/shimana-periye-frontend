"use client";

import { useForm } from "@tanstack/react-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ICreateUniversityPayload } from "@/types/university.type";
import { UniversityValidation } from "@/validation";

interface UniversityFormProps {
  defaultValues?: Partial<ICreateUniversityPayload>;
  onSubmit: (values: ICreateUniversityPayload) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function UniversityForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel = "Save",
}: UniversityFormProps) {
  const form = useForm({
    defaultValues: {
      name: defaultValues?.name ?? "",
      country: defaultValues?.country ?? "",
      website: defaultValues?.website ?? "",
    },
    validators: {
      onSubmit: UniversityValidation.CreateUniversityZodSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        ...value,
        website: value.website || undefined,
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
      className="space-y-4"
    >
      <form.Field name="name">
        {(field) => (
          <Field>
            <FieldLabel htmlFor={field.name}>University Name</FieldLabel>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="e.g. Stanford University"
            />
            <FieldError errors={field.state.meta.errors} />
          </Field>
        )}
      </form.Field>

      <form.Field name="country">
        {(field) => (
          <Field>
            <FieldLabel htmlFor={field.name}>Country</FieldLabel>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="e.g. United States"
            />
            <FieldError errors={field.state.meta.errors} />
          </Field>
        )}
      </form.Field>

      <form.Field name="website">
        {(field) => (
          <Field>
            <FieldLabel htmlFor={field.name}>Website (optional)</FieldLabel>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="https://..."
            />
            <FieldError errors={field.state.meta.errors} />
          </Field>
        )}
      </form.Field>

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, formIsSubmitting]) => (
          <Button
            type="submit"
            disabled={!canSubmit || formIsSubmitting || isSubmitting}
            className="w-full"
          >
            {isSubmitting || formIsSubmitting ? "Saving..." : submitLabel}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}