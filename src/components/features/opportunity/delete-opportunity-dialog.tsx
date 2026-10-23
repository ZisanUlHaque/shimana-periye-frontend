"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useDeleteOpportunity } from "@/hooks/opportunity.hook";

interface DeleteOpportunityDialogProps {
  id: string;
  trigger?: React.ReactNode;
}

export function DeleteOpportunityDialog({ id, trigger }: DeleteOpportunityDialogProps) {
  const { mutate: deleteOpportunity, isPending } = useDeleteOpportunity();

  return (
    <ConfirmDialog
      trigger={
        trigger ?? (
          <Button variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-destructive">
            <Trash2 className="size-3.5" />
          </Button>
        )
      }
      title="Delete this opportunity?"
      description="This action cannot be undone. Students will no longer see this opportunity."
      confirmLabel="Delete"
      isPending={isPending}
      onConfirm={() => deleteOpportunity(id)}
    />
  );
}