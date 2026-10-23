"use client";

import { useState } from "react";
import { NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FormDialog } from "@/components/shared/form-dialog";
import { useUpdateShortlistNotes } from "@/hooks/shortlist.hook";
import type { IShortlistListItem } from "@/types/shortlist.type";

interface ShortlistNotesDialogProps {
  item: IShortlistListItem;
}

export function ShortlistNotesDialog({ item }: ShortlistNotesDialogProps) {
  const [notes, setNotes] = useState(item.notes ?? "");
  const { mutate, isPending } = useUpdateShortlistNotes(item.shortlistId);

  return (
    <FormDialog
      trigger={
        <Button variant="ghost" size="icon">
          <NotebookPen className="size-4" />
        </Button>
      }
      title="Shortlist Notes"
      description="Add private notes about this opportunity."
    >
      {(close) => (
        <div className="space-y-4">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Why does this opportunity interest you?"
            rows={5}
            maxLength={2000}
          />
          <Button
            className="w-full"
            disabled={isPending}
            onClick={() => mutate({ notes }, { onSuccess: () => close() })}
          >
            {isPending ? "Saving..." : "Save Notes"}
          </Button>
        </div>
      )}
    </FormDialog>
  );
}