"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteTestRecord } from "@/hooks/test-record.hook";

interface DeleteTestRecordDialogProps {
  id: string;
  trigger: React.ReactNode;
}

export function DeleteTestRecordDialog({
  id,
  trigger,
}: DeleteTestRecordDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate: deleteRecord, isPending } = useDeleteTestRecord();

  const handleDelete = () => {
    deleteRecord(id, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={trigger} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Test Record</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this test score? This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
