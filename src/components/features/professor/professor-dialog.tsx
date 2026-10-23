"use client";

import { useState } from "react";
import { GraduationCap, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProfessorForm } from "./professor-form";
import {
  useCreateProfessor,
  useUpdateProfessor,
} from "@/hooks/professor.hook";
import type { IProfessor } from "@/types/professor.type";
import type { ProfessorFormValues } from "@/validation/professor.validation";

interface ProfessorDialogProps {
  professor?: IProfessor;
  trigger?: React.ReactNode;
}

export function ProfessorDialog({ professor, trigger }: ProfessorDialogProps) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(professor);

  const { mutate: createProf, isPending: isCreating } = useCreateProfessor();
  const { mutate: updateProf, isPending: isUpdating } = useUpdateProfessor();

  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = (values: ProfessorFormValues) => {
    if (isEdit && professor) {
      updateProf(
        {
          id: professor.id,
          payload: {
            name: values.name,
            email: values.email || undefined,
            labId: values.labId || null,
            researchAreas: values.researchAreas,
          },
        },
        { onSuccess: () => setOpen(false) },
      );
    } else {
      createProf(
        {
          name: values.name,
          email: values.email || undefined,
          universityId: values.universityId,
          labId: values.labId || undefined,
          researchAreas: values.researchAreas,
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
              Add Professor
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <GraduationCap className="size-5" />
          </div>
          <DialogTitle className="mt-2">
            {isEdit ? "Edit Professor" : "Add Professor"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update professor and advisor profile details."
              : "Register a professor to link opportunities and labs."}
          </DialogDescription>
        </DialogHeader>

        <ProfessorForm
          defaultValues={professor}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel={isEdit ? "Update Professor" : "Add Professor"}
        />
      </DialogContent>
    </Dialog>
  );
}
