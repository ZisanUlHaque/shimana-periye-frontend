"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Gavel, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field";
import { useRecordDecision } from "@/hooks/application.hook";
import { Decision } from "@/types/application.type";
import { ApplicationValidation, RecordDecisionFormValues } from "@/validation";

const DECISION_OPTIONS: { value: Decision; label: string }[] = [
  { value: "ACCEPTED", label: "Accepted" },
  { value: "REJECTED", label: "Rejected" },
  { value: "WAITLISTED", label: "Waitlisted" },
];

interface RecordDecisionDialogProps {
  applicationId: string;
  trigger?: React.ReactNode;
}

export function RecordDecisionDialog({ applicationId, trigger }: RecordDecisionDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate: recordDecision, isPending } = useRecordDecision(applicationId);

  const form = useForm({
    defaultValues: {
      decision: "ACCEPTED",
      offerResponseDeadline: "",
    } as RecordDecisionFormValues,
    validators: {
      onSubmit: ApplicationValidation.RecordDecisionZodSchema,
    },
    onSubmit: ({ value }) => {
      recordDecision(
        {
          decision: value.decision,
          offerResponseDeadline: value.offerResponseDeadline || undefined,
        },
        { onSuccess: () => setOpen(false) }
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button variant="outline" className="gap-1.5">
              <Gavel className="size-4" />
              Record Decision
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Decision</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4"
          noValidate
        >
          <form.Field name="decision">
            {(field) => (
              <div className="grid gap-1.5">
                <Label htmlFor="decision">Decision</Label>
                <select
                  id="decision"
                  value={field.state.value as string}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value as Decision)}
                  disabled={isPending}
                  className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  {DECISION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </form.Field>

          <form.Subscribe selector={(state) => state.values.decision}>
            {(decision) =>
              decision === "ACCEPTED" && (
                <form.Field name="offerResponseDeadline">
                  {(field) => {
                    const hasError =
                      field.state.meta.isTouched && field.state.meta.errors.length > 0;
                    return (
                      <div className="grid gap-1.5">
                        <Label htmlFor="offerResponseDeadline">Offer Response Deadline</Label>
                        <Input
                          id="offerResponseDeadline"
                          type="date"
                          value={(field.state.value as string) ?? ""}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={isPending}
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
              )
            }
          </form.Subscribe>

          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
            {([canSubmit, isFormSubmitting]) => (
              <Button type="submit" disabled={!canSubmit || isPending} className="w-full">
                {(isPending || isFormSubmitting) && <Loader2 className="size-4 animate-spin" />}
                Save Decision
              </Button>
            )}
          </form.Subscribe>
        </form>
      </DialogContent>
    </Dialog>
  );
}