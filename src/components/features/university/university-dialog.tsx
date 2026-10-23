"use client";

import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/shared/form-dialog";
import { UniversityForm } from "./university-form";
import {
  useCreateUniversity,
  useUpdateUniversity,
} from "@/hooks/university.hook";
import type { IUniversity } from "@/types/university.type";

interface UniversityDialogProps {
  university?: IUniversity;
  trigger?: React.ReactNode;
}

export function UniversityDialog({ university, trigger }: UniversityDialogProps) {
  const isEdit = !!university;
  const createMutation = useCreateUniversity();
  const updateMutation = useUpdateUniversity(university?.id ?? "");

  const mutation = isEdit ? updateMutation : createMutation;

  return (
    <FormDialog
      trigger={
        trigger ?? (
          <Button size={isEdit ? "icon" : "default"} variant={isEdit ? "ghost" : "default"} className="gap-1.5">
            {isEdit ? <Pencil className="size-4" /> : <Plus className="size-4" />}
            {!isEdit && "Add University"}
          </Button>
        )
      }
      title={isEdit ? "Edit University" : "Add University"}
      description={
        isEdit
          ? "Update university details."
          : "Add a new university to the reference list."
      }
    >
      {(close) => (
        <UniversityForm
          defaultValues={
            university
              ? {
                  name: university.name,
                  country: university.country,
                  website: university.website ?? undefined,
                }
              : undefined
          }
          isSubmitting={mutation.isPending}
          submitLabel={isEdit ? "Update" : "Create"}
          onSubmit={(values) => {
            mutation.mutate(values, { onSuccess: () => close() });
          }}
        />
      )}
    </FormDialog>
  );
}
