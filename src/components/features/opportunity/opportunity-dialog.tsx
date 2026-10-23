"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/shared/form-dialog";
import { OpportunityForm } from "./opportunity-form";
import { useCreateOpportunity, useUpdateOpportunity } from "@/hooks/opportunity.hook";
import type { IOpportunity } from "@/types/opportunity.type";
import type { OpportunityFormValues } from "@/validation";

interface OpportunityDialogProps {
  opportunity?: IOpportunity;
  trigger?: React.ReactNode;
}

export function OpportunityDialog({ opportunity, trigger }: OpportunityDialogProps) {
  const isEdit = Boolean(opportunity);
  const { mutate: createOpportunity, isPending: isCreating } = useCreateOpportunity();
  const { mutate: updateOpportunity, isPending: isUpdating } = useUpdateOpportunity();
  const isSubmitting = isCreating || isUpdating;

  return (
    <FormDialog
      title={isEdit ? "Edit Opportunity" : "Add Opportunity"}
      trigger={
        trigger ?? (
          <Button className="gap-1.5">
            <Plus className="size-4" />
            Add Opportunity
          </Button>
        )
      }
    >
      {(close) => (
        <OpportunityForm
          defaultValues={opportunity}
          isSubmitting={isSubmitting}
          submitLabel={isEdit ? "Save Changes" : "Create Opportunity"}
          onSubmit={(values: OpportunityFormValues) => {
            const payload = {
              ...values,
              professorId: values.professorId || undefined,
              labId: values.labId || undefined,
              deadline: values.deadline || undefined,
            };
            if (isEdit && opportunity) {
              updateOpportunity({ id: opportunity.id, payload }, { onSuccess: close });
            } else {
              createOpportunity(payload, { onSuccess: close });
            }
          }}
        />
      )}
    </FormDialog>
  );
}