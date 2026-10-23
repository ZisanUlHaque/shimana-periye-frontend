"use client";

import { useState } from "react";
import { Award, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TestRecordForm } from "./test-record-form";
import {
  useCreateTestRecord,
  useUpdateTestRecord,
} from "@/hooks/test-record.hook";
import type { ITestRecord } from "@/types/test-record.type";
import type { TestRecordFormValues } from "@/validation/test-record.validation";

interface TestRecordDialogProps {
  testRecord?: ITestRecord;
  trigger?: React.ReactNode;
}

export function TestRecordDialog({
  testRecord,
  trigger,
}: TestRecordDialogProps) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(testRecord);

  const { mutate: createRecord, isPending: isCreating } = useCreateTestRecord();
  const { mutate: updateRecord, isPending: isUpdating } = useUpdateTestRecord();

  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = (values: TestRecordFormValues) => {
    const scoreObj =
      values.overallScore !== undefined
        ? { overall: Number(values.overallScore) }
        : undefined;

    if (isEdit && testRecord) {
      updateRecord(
        {
          id: testRecord.id,
          payload: {
            score: scoreObj,
            plannedDate: values.plannedDate || undefined,
            actualDate: values.actualDate || undefined,
          },
        },
        { onSuccess: () => setOpen(false) },
      );
    } else {
      createRecord(
        {
          testType: values.testType,
          score: scoreObj,
          plannedDate: values.plannedDate || undefined,
          actualDate: values.actualDate || undefined,
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
              Add Test Score
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Award className="size-5" />
          </div>
          <DialogTitle className="mt-2">
            {isEdit ? "Edit Test Score" : "Add Test Score"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update your standardized examination score."
              : "Add IELTS, TOEFL, GRE, or GMAT examination records."}
          </DialogDescription>
        </DialogHeader>

        <TestRecordForm
          defaultValues={testRecord}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel={isEdit ? "Update Score" : "Add Score"}
        />
      </DialogContent>
    </Dialog>
  );
}
