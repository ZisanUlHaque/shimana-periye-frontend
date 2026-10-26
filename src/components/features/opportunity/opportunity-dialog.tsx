"use client";

import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { FormDialog } from "@/components/shared/form-dialog";
import { Button } from "@/components/ui/button";
import {
  useCreateOpportunity,
  useUpdateOpportunity,
} from "@/hooks/opportunity.hook";
import type {
  ICreateOpportunityPayload,
  IOpportunity,
  IUpdateOpportunityPayload,
} from "@/types/opportunity.type";
import type { OpportunityFormValues } from "@/validation";
import { OpportunityForm } from "./opportunity-form";

interface OpportunityDialogProps {
  opportunity?: IOpportunity;
  trigger?: React.ReactNode;
}

export function OpportunityDialog({
  opportunity,
  trigger,
}: OpportunityDialogProps) {
  const [open, setOpen] = useState(false);
  const isEdit = !!opportunity;

  const createMutation = useCreateOpportunity();
  const updateMutation = useUpdateOpportunity(opportunity?.id ?? "");

  const handleSubmit = (values: OpportunityFormValues) => {
    if (isEdit) {
      const payload: IUpdateOpportunityPayload = {
        ...values,
        professorId: values.professorId?.trim()
          ? values.professorId.trim()
          : null,
        labId: values.labId?.trim() ? values.labId.trim() : null,
        deadline: values.deadline?.trim() ? values.deadline.trim() : null,
      } as IUpdateOpportunityPayload;
      updateMutation.mutate(payload, { onSuccess: () => setOpen(false) });
    } else {
      const payload: ICreateOpportunityPayload = {
        ...values,
        professorId: values.professorId?.trim()
          ? values.professorId.trim()
          : undefined,
        labId: values.labId?.trim() ? values.labId.trim() : undefined,
        deadline: values.deadline?.trim() ? values.deadline.trim() : undefined,
      } as ICreateOpportunityPayload;
      createMutation.mutate(payload, { onSuccess: () => setOpen(false) });
    }
  };

  const mutation = isEdit ? updateMutation : createMutation;

  const defaultTrigger = isEdit ? (
    <Button size="icon" variant="ghost">
      <Pencil className="size-4" />
    </Button>
  ) : (
    <Button>
      <Plus className="size-4" />
      New Opportunity
    </Button>
  );

  return (
    <FormDialog
      open={open}
      onOpenChange={setOpen}
      title={isEdit ? "Edit Opportunity" : "Create Opportunity"}
      trigger={trigger ?? defaultTrigger}
      className="sm:max-w-xl"
    >
      <OpportunityForm
        defaultValues={opportunity}
        onSubmit={handleSubmit}
        isSubmitting={mutation.isPending}
        submitLabel={isEdit ? "Save Changes" : "Create Opportunity"}
      />
    </FormDialog>
  );
}
