"use client";

import { useState } from "react";
import { ArrowRightCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useUpdateApplicationStatus } from "@/hooks/application.hook";
import {
  APPLICATION_STATUS_TRANSITIONS,
  type ApplicationStatus,
} from "@/types/application.type";
import { APPLICATION_STATUS_META } from "./application-status-badge";

interface UpdateApplicationStatusDialogProps {
  applicationId: string;
  currentStatus: ApplicationStatus;
  trigger?: React.ReactNode;
}

export function UpdateApplicationStatusDialog({
  applicationId,
  currentStatus,
  trigger,
}: UpdateApplicationStatusDialogProps) {
  const [open, setOpen] = useState(false);
  const nextOptions = APPLICATION_STATUS_TRANSITIONS[currentStatus] ?? [];
  const [selected, setSelected] = useState<ApplicationStatus | "">(nextOptions[0] ?? "");

  const { mutate: updateStatus, isPending } = useUpdateApplicationStatus(applicationId);

  if (nextOptions.length === 0) return null;

  const handleSubmit = () => {
    if (!selected) return;
    updateStatus({ status: selected }, { onSuccess: () => setOpen(false) });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button variant="outline" className="gap-1.5">
              <ArrowRightCircle className="size-4" />
              Update Status
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Application Status</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="next-status">Next Status</Label>
            <select
              id="next-status"
              value={selected}
              onChange={(e) => setSelected(e.target.value as ApplicationStatus)}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              {nextOptions.map((status) => (
                <option key={status} value={status}>
                  {APPLICATION_STATUS_META[status].label}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              Transitions are forward-only and cannot be reversed.
            </p>
          </div>
          <Button onClick={handleSubmit} disabled={isPending || !selected} className="w-full">
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}