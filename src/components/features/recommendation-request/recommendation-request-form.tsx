"use client";

import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import type { IRecommendationRequest } from "@/types/recommendation-request.type";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field";
import {
  type RecommendationRequestFormValues,
  RecommendationRequestValidation,
} from "@/validation/recommendation-request.validation";
import { useGetMyApplications } from "@/hooks/application.hook";

interface RecommendationRequestFormProps {
  defaultValues?: Partial<IRecommendationRequest>;
  onSubmit: (values: RecommendationRequestFormValues) => void;
  isSubmitting?: boolean;
}

export function RecommendationRequestForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: RecommendationRequestFormProps) {
  const { data: appsData } = useGetMyApplications();
  const applications = appsData?.data ?? [];

  const form = useForm({
    defaultValues: {
      professorName: defaultValues?.professorName ?? "",
      professorEmail: defaultValues?.professorEmail ?? "",
      applicationId: defaultValues?.applicationId ?? "",
      followUpAt: defaultValues?.followUpAt
        ? new Date(defaultValues.followUpAt).toISOString().split("T")[0]
        : "",
    } as RecommendationRequestFormValues,
    validators: {
      onSubmit:
        RecommendationRequestValidation.CreateRecommendationRequestZodSchema,
    },
    onSubmit: ({ value }) => {
      onSubmit({
        professorName: value.professorName.trim(),
        professorEmail: value.professorEmail?.trim() || undefined,
        applicationId: value.applicationId?.trim() || undefined,
        followUpAt: value.followUpAt?.trim() || undefined,
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
      <form.Field name="professorName">
        {(field) => {
          const hasError =
            field.state.meta.isTouched && field.state.meta.errors.length > 0;
          return (
            <div className="grid gap-1.5">
              <Label htmlFor="profName">Professor / Referee Name *</Label>
              <Input
                id="profName"
                placeholder="e.g. Prof. Alan Turing"
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

      <form.Field name="professorEmail">
        {(field) => (
          <div className="grid gap-1.5">
            <Label htmlFor="profEmail">Professor Email</Label>
            <Input
              id="profEmail"
              type="email"
              placeholder="referee@university.edu"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        )}
      </form.Field>

      <form.Field name="applicationId">
        {(field) => (
          <div className="grid gap-1.5">
            <Label htmlFor="appId">Link to Application (Optional)</Label>
            <select
              id="appId"
              disabled={isSubmitting}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            >
              <option value="">General Recommendation</option>
              {applications.map((app: any) => (
                <option key={app.id} value={app.id}>
                  {app.opportunity?.title ?? "Application"}
                </option>
              ))}
            </select>
          </div>
        )}
      </form.Field>

      <form.Field name="followUpAt">
        {(field) => (
          <div className="grid gap-1.5">
            <Label htmlFor="followUpAt">Follow-up Reminder Date</Label>
            <Input
              id="followUpAt"
              type="date"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
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
            Save Recommendation Request
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
