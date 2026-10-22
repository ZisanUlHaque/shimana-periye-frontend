"use client";

import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field";
import type { IApplicationTask } from "@/types/application-task.type";
import {
  ApplicationTaskValidation,
  type ApplicationTaskFormValues,
} from "@/validation";

interface ApplicationTaskFormProps {
  defaultValues?: Partial<IApplicationTask>;
  availableTasks?: IApplicationTask[];
  onSubmit: (values: ApplicationTaskFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

function toDateInputValue(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export function ApplicationTaskForm({
  defaultValues,
  availableTasks = [],
  onSubmit,
  isSubmitting,
  submitLabel = "Save",
}: ApplicationTaskFormProps) {
  const form = useForm({
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      deadline: toDateInputValue(defaultValues?.deadline),
      dependsOnId: defaultValues?.dependsOnId ?? "",
    } as ApplicationTaskFormValues,
    validators: {
      onSubmit: ApplicationTaskValidation.CreateApplicationTaskZodSchema,
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
      <form.Field name="title">
        {(field) => {
          const hasError =
            field.state.meta.isTouched && field.state.meta.errors.length > 0;
          return (
            <div className="grid gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g. Submit SOP draft"
                value={field.state.value as string}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={isSubmitting}
              />
              {hasError && (
                <FieldError className="text-xs">
                  {field.state.meta.errors.map((e) => e?.message || String(e)).join(", ")}
                </FieldError>
              )}
            </div>
          );
        }}
      </form.Field>

      <form.Field name="description">
        {(field) => (
          <div className="grid gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add any notes about this task…"
              value={(field.state.value as string) ?? ""}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              disabled={isSubmitting}
              rows={3}
            />
          </div>
        )}
      </form.Field>

      <div className="grid grid-cols-2 gap-3">
        <form.Field name="deadline">
          {(field) => (
            <div className="grid gap-1.5">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={(field.state.value as string) ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          )}
        </form.Field>

        <form.Field name="dependsOnId">
          {(field) => (
            <div className="grid gap-1.5">
              <Label htmlFor="dependsOnId">Depends on</Label>
              <select
                id="dependsOnId"
                value={(field.state.value as string) ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={isSubmitting}
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <option value="">None</option>
                {availableTasks
                  .filter((t) => t.id !== defaultValues?.id)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </form.Field>
      </div>

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
        {([canSubmit, isFormSubmitting]) => (
          <Button type="submit" disabled={!canSubmit || isSubmitting} className="mt-2 w-full">
            {(isSubmitting || isFormSubmitting) && <Loader2 className="size-4 animate-spin" />}
            {submitLabel}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}