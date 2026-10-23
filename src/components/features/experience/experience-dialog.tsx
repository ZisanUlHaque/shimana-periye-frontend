"use client";

import { useState } from "react";
import { Briefcase, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExperienceForm } from "./experience-form";
import {
  useCreateExperience,
  useUpdateExperience,
} from "@/hooks/experience.hook";
import type { IExperience } from "@/types/experience.type";
import type { ExperienceFormValues } from "@/validation/experience.validation";

interface ExperienceDialogProps {
  experience?: IExperience;
  trigger?: React.ReactNode;
}

export function ExperienceDialog({ experience, trigger }: ExperienceDialogProps) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(experience);

  const { mutate: createExp, isPending: isCreating } = useCreateExperience();
  const { mutate: updateExp, isPending: isUpdating } = useUpdateExperience();

  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = (values: ExperienceFormValues) => {
    const payload = {
      role: values.role,
      organization: values.organization,
      startDate: values.startDate || undefined,
      endDate: values.endDate || undefined,
      description: values.description || undefined,
    };

    if (isEdit && experience) {
      updateExp(
        { id: experience.id, payload },
        { onSuccess: () => setOpen(false) },
      );
    } else {
      createExp(payload, { onSuccess: () => setOpen(false) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button size="sm" className="gap-1.5">
              <Plus className="size-4" />
              Add Experience
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Briefcase className="size-5" />
          </div>
          <DialogTitle className="mt-2">
            {isEdit ? "Edit Experience" : "Add Experience"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update your professional or research experience."
              : "Add your work, lab, or research positions."}
          </DialogDescription>
        </DialogHeader>

        <ExperienceForm
          defaultValues={experience}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel={isEdit ? "Update Experience" : "Add Experience"}
        />
      </DialogContent>
    </Dialog>
  );
}
