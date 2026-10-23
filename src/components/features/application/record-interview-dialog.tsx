"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { CalendarClock, Loader2 } from "lucide-react";
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
import { useRecordInterview } from "@/hooks/application.hook";
import { ApplicationValidation, type RecordInterviewFormValues } from "@/validation";

interface RecordInterviewDialogProps {
  applicationId: string;
  defaultDate?: string | null;
  trigger?: React.ReactNode;
}

export function RecordInterviewDialog({
  applicationId,
  defaultDate,
  trigger,
}: RecordInterviewDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate: recordInterview, isPending } = useRecordInterview(applicationId);

  const form = useForm({
    defaultValues: {
      interviewDate: defaultDate ? defaultDate.slice(0, 10) : "",
    } as RecordInterviewFormValues,
    validators: {
      onSubmit: ApplicationValidation.RecordInterviewZodSchema,
    },
    onSubmit: ({ value }) => {
      recordInterview(value, { onSuccess: () => setOpen(false) });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button variant="outline" className="gap-1.5">
              <CalendarClock className="size-4" />
              Record Interview
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Interview Date</DialogTitle>
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
          <form.Field name="interviewDate">
            {(field) => {
              const hasError =
                field.state.meta.isTouched && field.state.meta.errors.length > 0;
              return (
                <div className="grid gap-1.5">
                  <Label htmlFor="interviewDate">Interview Date</Label>
                  <Input
                    id="interviewDate"
                    type="date"
                    value={field.state.value as string}
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

          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
            {([canSubmit, isFormSubmitting]) => (
              <Button type="submit" disabled={!canSubmit || isPending} className="w-full">
                {(isPending || isFormSubmitting) && <Loader2 className="size-4 animate-spin" />}
                Save
              </Button>
            )}
          </form.Subscribe>
        </form>
      </DialogContent>
    </Dialog>
  );
}