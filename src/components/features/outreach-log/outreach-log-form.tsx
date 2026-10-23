"use client";

import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import type { IOutreachLog } from "@/types/outreach-log.type";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  type OutreachLogFormValues,
  OutreachLogValidation,
} from "@/validation/outreach-log.validation";
import { useProfessors } from "@/hooks/professor.hook";
import { useOpportunities } from "@/hooks/opportunity.hook";

interface OutreachLogFormProps {
  defaultValues?: Partial<IOutreachLog>;
  onSubmit: (values: OutreachLogFormValues) => void;
  isSubmitting?: boolean;
}

export function OutreachLogForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: OutreachLogFormProps) {
  const { data: profsData } = useProfessors();
  const professors = profsData?.data ?? [];

  const { data: oppsData } = useOpportunities();
  const opportunities = oppsData?.data ?? [];

  const form = useForm({
    defaultValues: {
      professorId: defaultValues?.professorId ?? "",
      opportunityId: defaultValues?.opportunityId ?? "",
      emailSentAt: defaultValues?.emailSentAt
        ? new Date(defaultValues.emailSentAt).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      followUpAt: defaultValues?.followUpAt
        ? new Date(defaultValues.followUpAt).toISOString().split("T")[0]
        : "",
      notes: defaultValues?.notes ?? "",
    } as OutreachLogFormValues,
    validators: {
      onSubmit: OutreachLogValidation.CreateOutreachLogZodSchema,
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
      <form.Field name="professorId">
        {(field) => (
          <div className="grid gap-1.5">
            <Label htmlFor="profId">Contacted Professor (Optional)</Label>
            <select
              id="profId"
              disabled={isSubmitting}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            >
              <option value="">Select professor</option>
              {professors.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.university?.name ?? "University"})
                </option>
              ))}
            </select>
          </div>
        )}
      </form.Field>

      <form.Field name="opportunityId">
        {(field) => (
          <div className="grid gap-1.5">
            <Label htmlFor="oppId">Target Opportunity (Optional)</Label>
            <select
              id="oppId"
              disabled={isSubmitting}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            >
              <option value="">Select opportunity</option>
              {opportunities.map((o: any) => (
                <option key={o.id} value={o.id}>
                  {o.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </form.Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <form.Field name="emailSentAt">
          {(field) => (
            <div className="grid gap-1.5">
              <Label htmlFor="emailSentAt">Sent Date</Label>
              <Input
                id="emailSentAt"
                type="date"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          )}
        </form.Field>

        <form.Field name="followUpAt">
          {(field) => (
            <div className="grid gap-1.5">
              <Label htmlFor="followUpAt">Follow-up Due Date</Label>
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
      </div>

      <form.Field name="notes">
        {(field) => (
          <div className="grid gap-1.5">
            <Label htmlFor="notes">Email Notes & Discussion Points</Label>
            <Textarea
              id="notes"
              placeholder="e.g. Inquired about open PhD research assistantships in Distributed Systems..."
              rows={3}
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
            Log Outreach
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
