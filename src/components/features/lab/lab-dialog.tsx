"use client";

import { FlaskConical, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateLab, useUpdateLab } from "@/hooks/lab.hook";
import type { ILab } from "@/types/lab.type";
import type { LabFormValues } from "@/validation/lab.validation";
import { LabForm } from "./lab-form";

interface LabDialogProps {
  lab?: ILab;
  trigger?: React.ReactNode;
}

export function LabDialog({ lab, trigger }: LabDialogProps) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(lab);

  const { mutate: createLabFn, isPending: isCreating } = useCreateLab();
  const { mutate: updateLabFn, isPending: isUpdating } = useUpdateLab();

  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = (values: LabFormValues) => {
    if (isEdit && lab) {
      updateLabFn(
        {
          id: lab.id,
          payload: {
            name: values.name,
            focusAreas: values.focusAreas,
          },
        },
        { onSuccess: () => setOpen(false) },
      );
    } else {
      createLabFn(
        {
          name: values.name,
          universityId: values.universityId,
          focusAreas: values.focusAreas,
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
              Add Lab
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FlaskConical className="size-5" />
          </div>
          <DialogTitle className="mt-2">
            {isEdit ? "Edit Research Lab" : "Add Research Lab"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update research facility or department details."
              : "Register a research laboratory or center."}
          </DialogDescription>
        </DialogHeader>

        <LabForm
          defaultValues={lab}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel={isEdit ? "Update Lab" : "Add Lab"}
        />
      </DialogContent>
    </Dialog>
  );
}
