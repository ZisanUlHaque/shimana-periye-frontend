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
import { AcademicRecordForm } from "./academic-record-form";
import {
  useCreateAcademicRecord,
  useUpdateAcademicRecord,
} from "@/hooks/academic-record.hook";
import type { IAcademicRecord } from "@/types/academic-record.type";
import { AcademicRecordFormValues } from "@/validation";

interface AcademicRecordDialogProps {
  record?: IAcademicRecord;
  trigger?: React.ReactNode;
}

export function AcademicRecordDialog({
  record,
  trigger,
}: AcademicRecordDialogProps) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(record);

  const { mutate: createRecord, isPending: isCreating } =
    useCreateAcademicRecord();
  const { mutate: updateRecord, isPending: isUpdating } =
    useUpdateAcademicRecord();

  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = (values: AcademicRecordFormValues) => {
    if (isEdit && record) {
      updateRecord(
        { id: record.id, payload: values },
        { onSuccess: () => setOpen(false) },
      );
    } else {
      createRecord(values, { onSuccess: () => setOpen(false) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button size="sm" className="gap-1.5">
              <Plus className="size-4" />
              Add Record
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
            {isEdit ? "Edit Academic Record" : "Add Academic Record"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update your degree information."
              : "Add your undergraduate/graduate degree details."}
          </DialogDescription>
        </DialogHeader>

        <AcademicRecordForm
          defaultValues={record}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel={isEdit ? "Update Record" : "Add Record"}
        />
      </DialogContent>
    </Dialog>
  );
}