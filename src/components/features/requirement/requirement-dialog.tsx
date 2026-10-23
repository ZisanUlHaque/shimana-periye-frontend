"use client";

import { useState } from "react";
import { Plus, ListChecks } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RequirementForm } from "./requirement-form";
import {
  useCreateRequirement,
  useUpdateRequirement,
} from "@/hooks/requirement.hook";
import type { IRequirement } from "@/types/requirement.type";
import type { RequirementFormValues } from "@/validation/requirement.validation";

interface RequirementDialogProps {
  opportunityId: string;
  requirement?: IRequirement;
  trigger?: React.ReactNode;
}

export function RequirementDialog({
  opportunityId,
  requirement,
  trigger,
}: RequirementDialogProps) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(requirement);

  const { mutate: createReq, isPending: isCreating } =
    useCreateRequirement(opportunityId);
  const { mutate: updateReq, isPending: isUpdating } =
    useUpdateRequirement(opportunityId);

  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = (values: RequirementFormValues) => {
    if (isEdit && requirement) {
      updateReq(
        {
          opportunityId,
          requirementId: requirement.id,
          payload: values,
        },
        { onSuccess: () => setOpen(false) },
      );
    } else {
      createReq(values, { onSuccess: () => setOpen(false) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button size="sm" className="gap-1.5">
              <Plus className="size-4" />
              Add Requirement
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ListChecks className="size-5" />
          </div>
          <DialogTitle className="mt-2">
            {isEdit ? "Edit Requirement" : "Add Requirement"}
          </DialogTitle>
          <DialogDescription>
            Specify eligibility criteria such as GPA, degree level, or minimum test scores.
          </DialogDescription>
        </DialogHeader>

        <RequirementForm
          defaultValues={requirement}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
