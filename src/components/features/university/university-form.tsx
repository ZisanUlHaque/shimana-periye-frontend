"use client";

import { useForm } from "@tanstack/react-form";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
      imageUrl: defaultValues?.imageUrl ?? "",
    },
    validators: {
      onSubmit: UniversityValidation.CreateUniversityZodSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        ...value,
        website: value.website || undefined,
        imageUrl: value.imageUrl || undefined,
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

      <form.Field name="imageUrl">
        {(field) => (
          <Field>
            <FieldLabel htmlFor={field.name}>
              University Image / Logo URL (optional)
            </FieldLabel>
            <div className="flex gap-2 items-center">
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="https://.../university-campus.jpg"
              />
              {field.state.value ? (
                <div className="size-9 shrink-0 rounded-lg border overflow-hidden bg-muted flex items-center justify-center relative">
                  <Image
                    src={field.state.value}
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
            <FieldError errors={field.state.meta.errors} />
          </Field>
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
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
