"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { CalendarCheck, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBookInterviewSlot } from "@/hooks/mentor-schedule.hook";
import { useGetMyApplications } from "@/hooks/application.hook";
import type { IMentorSchedule } from "@/types/mentor-schedule.type";

interface BookSlotDialogProps {
  schedule: IMentorSchedule;
  trigger?: React.ReactNode;
}

export function BookSlotDialog({ schedule, trigger }: BookSlotDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate: bookSlot, isPending } = useBookInterviewSlot();

  const { data: appsData } = useGetMyApplications();
  const applications = appsData?.data ?? [];

  const form = useForm({
    defaultValues: {
      applicationId: "",
      topic: "",
      notes: "",
    },
    onSubmit: ({ value }) => {
      bookSlot(
        {
          scheduleId: schedule.id,
          applicationId: value.applicationId ? value.applicationId : undefined,
          topic: value.topic ? value.topic : undefined,
          notes: value.notes ? value.notes : undefined,
        },
        {
          onSuccess: () => setOpen(false),
        }
      );
    },
  });

  const startTime = new Date(schedule.startDateTime).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const endTime = new Date(schedule.endDateTime).toLocaleTimeString(undefined, {
    timeStyle: "short",
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button size="sm" className="gap-1.5 text-xs">
              <CalendarCheck className="size-3.5" />
              Book Slot
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CalendarCheck className="size-5" />
          </div>
          <DialogTitle className="mt-2">Book Mentorship Session</DialogTitle>
          <DialogDescription>
            {startTime} – {endTime} with {schedule.mentor?.name ?? "Mentor"}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4 mt-2"
        >
          {/* Target Application (Optional) */}
          <form.Field name="applicationId">
            {(field) => (
              <div className="grid gap-1.5">
                <Label htmlFor="book-app">Link to Application (Optional)</Label>
                <select
                  id="book-app"
                  disabled={isPending}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                >
                  <option value="">General Consultation (No linked application)</option>
                  {applications.map((app: any) => (
                    <option key={app.id} value={app.id}>
                      {app.opportunity?.title ?? "Application"}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </form.Field>

          {/* Session Topic */}
          <form.Field name="topic">
            {(field) => (
              <div className="grid gap-1.5">
                <Label htmlFor="book-topic">Discussion Topic</Label>
                <Input
                  id="book-topic"
                  placeholder="e.g. SOP Review & Professor Outreach advice"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isPending}
                />
              </div>
            )}
          </form.Field>

          {/* Questions / Notes */}
          <form.Field name="notes">
            {(field) => (
              <div className="grid gap-1.5">
                <Label htmlFor="book-notes">Questions or context for the mentor</Label>
                <Textarea
                  id="book-notes"
                  rows={3}
                  placeholder="Share what specific feedback you're looking for..."
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isPending}
                />
              </div>
            )}
          </form.Field>

          <Button type="submit" disabled={isPending} className="mt-2 w-full gap-2">
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Confirm Free Booking
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
