"use client";

import { useState } from "react";
import { Plus, MailCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RecommendationRequestForm } from "./recommendation-request-form";
import {
  useCreateRecommendationRequest,
  useUpdateRecommendationRequest,
} from "@/hooks/recommendation-request.hook";
import type { IRecommendationRequest } from "@/types/recommendation-request.type";
import type { RecommendationRequestFormValues } from "@/validation/recommendation-request.validation";

interface RecommendationRequestDialogProps {
  request?: IRecommendationRequest;
  trigger?: React.ReactNode;
}

export function RecommendationRequestDialog({
  request,
  trigger,
}: RecommendationRequestDialogProps) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(request);

  const { mutate: createReq, isPending: isCreating } =
    useCreateRecommendationRequest();
  const { mutate: updateReq, isPending: isUpdating } =
    useUpdateRecommendationRequest();

  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = (values: RecommendationRequestFormValues) => {
    if (isEdit && request) {
      updateReq(
        {
          id: request.id,
          payload: {
            professorName: values.professorName,
            professorEmail: values.professorEmail || undefined,
            followUpAt: values.followUpAt || undefined,
          },
        },
        { onSuccess: () => setOpen(false) },
      );
    } else {
      createReq(
        {
          professorName: values.professorName,
          professorEmail: values.professorEmail || undefined,
          applicationId: values.applicationId || undefined,
          followUpAt: values.followUpAt || undefined,
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
              Request Recommendation
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MailCheck className="size-5" />
          </div>
          <DialogTitle className="mt-2">
            {isEdit ? "Edit Reference Details" : "Track Letter of Recommendation"}
          </DialogTitle>
          <DialogDescription>
            Log professor recommendation requests, track submission statuses and follow-up deadlines.
          </DialogDescription>
        </DialogHeader>

        <RecommendationRequestForm
          defaultValues={request}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
