"use client";

import { useState } from "react";
import { BookOpen, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PublicationForm } from "./publication-form";
import {
  useCreatePublication,
  useUpdatePublication,
} from "@/hooks/publication.hook";
import type { IPublication } from "@/types/publication.type";
import type { PublicationFormValues } from "@/validation/publication.validation";

interface PublicationDialogProps {
  publication?: IPublication;
  trigger?: React.ReactNode;
}

export function PublicationDialog({
  publication,
  trigger,
}: PublicationDialogProps) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(publication);

  const { mutate: createPub, isPending: isCreating } = useCreatePublication();
  const { mutate: updatePub, isPending: isUpdating } = useUpdatePublication();

  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = (values: PublicationFormValues) => {
    const payload = {
      title: values.title,
      venue: values.venue || undefined,
      year: values.year ? Number(values.year) : undefined,
      link: values.link || undefined,
    };

    if (isEdit && publication) {
      updatePub(
        { id: publication.id, payload },
        { onSuccess: () => setOpen(false) },
      );
    } else {
      createPub(payload, { onSuccess: () => setOpen(false) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button size="sm" className="gap-1.5">
              <Plus className="size-4" />
              Add Publication
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BookOpen className="size-5" />
          </div>
          <DialogTitle className="mt-2">
            {isEdit ? "Edit Publication" : "Add Publication"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update your published paper or journal details."
              : "Add journal papers, conference proceedings, or preprints."}
          </DialogDescription>
        </DialogHeader>

        <PublicationForm
          defaultValues={publication}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel={isEdit ? "Update Publication" : "Add Publication"}
        />
      </DialogContent>
    </Dialog>
  );
}
