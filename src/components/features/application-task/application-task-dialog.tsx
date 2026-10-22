"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ApplicationTaskForm } from "./application-task-form";
import {
  useCreateApplicationTask,
  useUpdateApplicationTask,
} from "@/hooks/application-task.hook";
import type { IApplicationTask } from "@/types/application-task.type";
import type { ApplicationTaskFormValues } from "@/validation";

interface ApplicationTaskDialogProps {
  applicationId: string;
  task?: IApplicationTask;
  availableTasks?: IApplicationTask[];
  trigger?: React.ReactNode;
}

export function ApplicationTaskDialog({
  applicationId,
  task,
  availableTasks = [],
  trigger,
}: ApplicationTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(task);

  const { mutate: createTask, isPending: isCreating } =
    useCreateApplicationTask(applicationId);
  const { mutate: updateTask, isPending: isUpdating } =
    useUpdateApplicationTask(applicationId);

  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = (values: ApplicationTaskFormValues) => {
    const payload = {
      title: values.title,
      description: values.description || undefined,
      deadline: values.deadline || undefined,
      dependsOnId: values.dependsOnId || undefined,
    };

    if (isEdit && task) {
      updateTask({ taskId: task.id, payload }, { onSuccess: () => setOpen(false) });
    } else {
      createTask(payload, { onSuccess: () => setOpen(false) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button className="gap-1.5">
              <Plus className="size-4" />
              Add Task
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Task" : "Add Task"}</DialogTitle>
        </DialogHeader>
        <ApplicationTaskForm
          defaultValues={task}
          availableTasks={availableTasks}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel={isEdit ? "Save Changes" : "Add Task"}
        />
      </DialogContent>
    </Dialog>
  );
}