"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useRemoveFromShortlist } from "@/hooks/shortlist.hook";

interface RemoveShortlistDialogProps {
  shortlistId: string;
  opportunityTitle?: string;
}

export function RemoveShortlistDialog({
  shortlistId,
  opportunityTitle,
}: RemoveShortlistDialogProps) {
  const { mutate, isPending } = useRemoveFromShortlist();

  return (
    <ConfirmDialog
      trigger={
        <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive">
          <Trash2 className="size-4" />
        </Button>
      }
      title="Remove from Shortlist"
      description={
        opportunityTitle
          ? `Remove "${opportunityTitle}" from your shortlist?`
          : "Remove this opportunity from your shortlist?"
      }
      confirmLabel="Remove"
      destructive
      isPending={isPending}
      onConfirm={() => mutate(shortlistId)}
    />
  );
}