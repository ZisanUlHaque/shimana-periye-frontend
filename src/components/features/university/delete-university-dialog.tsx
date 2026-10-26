"use client";

import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteUniversity } from "@/hooks/university.hook";

interface DeleteUniversityDialogProps {
  universityId: string;
  universityName: string;
}

export function DeleteUniversityDialog({
  universityId,
  universityName,
}: DeleteUniversityDialogProps) {
  const { mutate, isPending } = useDeleteUniversity();

  return (
    <ConfirmDialog
      trigger={
        <Button
          size="icon"
          variant="ghost"
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </Button>
      }
      title="Delete University"
      description={`Are you sure you want to delete "${universityName}"? This action cannot be undone.`}
      confirmLabel="Delete"
      destructive
      isPending={isPending}
      onConfirm={() => mutate(universityId)}
    />
  );
}
