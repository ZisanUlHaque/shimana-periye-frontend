"use client";

import { useForm } from "@tanstack/react-form";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUniversities } from "@/hooks/university.hook";
import type { ILab } from "@/types/lab.type";
import { type LabFormValues, LabValidation } from "@/validation/lab.validation";

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
      imageUrl: defaultValues?.imageUrl ?? "",
    } as LabFormValues,
    validators: {
      onSubmit: LabValidation.CreateLabZodSchema,
    },
    onSubmit: ({ value }) => {
      onSubmit({
        ...value,
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
                {universities.map((u) => (
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

      {/* Image URL */}
      <form.Field name="imageUrl">
        {(field) => (
          <div className="grid gap-1.5">
            <Label htmlFor="imageUrl">Lab Image URL (optional)</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="imageUrl"
                placeholder="https://.../lab-photo.jpg"
                value={field.state.value ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={isSubmitting}
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
          </div>
        )}
      </form.Field>

      {/* Focus Areas */}
      <form.Field name="focusAreas">
        {(field) => (
          <div className="grid gap-1.5">
            <Label htmlFor="focusAreas">Focus Areas (comma separated)</Label>
            <Input
              id="focusAreas"
              placeholder="e.g. Robotics, Machine Learning, Computer Vision"
              value={field.state.value?.join(", ") ?? ""}
              onBlur={field.handleBlur}
              onChange={(e) =>
                field.handleChange(
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                )
              }
              disabled={isSubmitting}
            />
          </div>
        )}
      </form.Field>

      <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
