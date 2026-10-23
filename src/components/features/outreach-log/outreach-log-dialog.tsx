"use client";

import { useState } from "react";
import { Plus, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OutreachLogForm } from "./outreach-log-form";
import {
  useCreateOutreachLog,
  useUpdateOutreachLog,
} from "@/hooks/outreach-log.hook";
import type { IOutreachLog } from "@/types/outreach-log.type";
import type { OutreachLogFormValues } from "@/validation/outreach-log.validation";

interface OutreachLogDialogProps {
  log?: IOutreachLog;
  trigger?: React.ReactNode;
}

export function OutreachLogDialog({ log, trigger }: OutreachLogDialogProps) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(log);

  const { mutate: createLog, isPending: isCreating } = useCreateOutreachLog();
  const { mutate: updateLog, isPending: isUpdating } = useUpdateOutreachLog();

  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = (values: OutreachLogFormValues) => {
    if (isEdit && log) {
      updateLog(
        {
          id: log.id,
          payload: {
            emailSentAt: values.emailSentAt || null,
            followUpAt: values.followUpAt || null,
            notes: values.notes,
          },
        },
        { onSuccess: () => setOpen(false) },
      );
    } else {
      createLog(
        {
          professorId: values.professorId || undefined,
          opportunityId: values.opportunityId || undefined,
          emailSentAt: values.emailSentAt || undefined,
          followUpAt: values.followUpAt || undefined,
          notes: values.notes,
        },
        { onSuccess: () => setOpen(false) },
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button size="sm" className="gap-1.5">
              <Plus className="size-4" />
              Log Outreach
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Mail className="size-5" />
          </div>
          <DialogTitle className="mt-2">
            {isEdit ? "Edit Outreach Log" : "Log Professor Outreach"}
          </DialogTitle>
          <DialogDescription>
            Record cold emails, inquiries sent to professors, and scheduled follow-up dates.
          </DialogDescription>
        </DialogHeader>

        <OutreachLogForm
          defaultValues={log}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
