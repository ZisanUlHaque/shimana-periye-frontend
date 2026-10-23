"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useDeleteOpportunity } from "@/hooks/opportunity.hook";

interface DeleteOpportunityDialogProps {
  id: string;
}

export function DeleteOpportunityDialog({ id }: DeleteOpportunityDialogProps) {
  const deleteMutation = useDeleteOpportunity();

  return (
    <ConfirmDialog
      title="Delete Opportunity"
      description="Are you sure you want to delete this opportunity? This action cannot be undone."
      confirmLabel="Delete"
      isPending={deleteMutation.isPending}
      destructive
      onConfirm={() => deleteMutation.mutate(id)}
      trigger={
        <button className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
          <Trash2 className="size-3.5" />
        </button>
      }
    />
  );
}