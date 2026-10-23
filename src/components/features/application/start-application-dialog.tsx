// start-application-dialog.tsx
"use client";

import { Rocket } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useStartApplication } from "@/hooks/application.hook";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";

interface StartApplicationDialogProps {
  opportunityId: string;
  opportunityTitle?: string;
  trigger?: React.ReactNode;
}

export function StartApplicationDialog({
  opportunityId,
  opportunityTitle,
  trigger,
}: StartApplicationDialogProps) {
  const router = useRouter();
  const { mutate: startApp, isPending } = useStartApplication();

  const handleConfirm = () => {
    startApp(
      { opportunityId },
      {
        onSuccess: (res) => {
          const newId = (res as any)?.data?.id ?? (res as any)?.id;
          if (newId) router.push(`/student/applications/${newId}`);
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message ??
            error?.response?.data?.errorSources?.[0]?.message ??
            "Failed to start application. Please try again.";
          toast.add({
            title: "Could not start application",
            description: message,
            type: "error",
          });
        },
      }
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          trigger ?? (
            <Button className="gap-1.5">
              <Rocket className="size-4" />
              Start Application
            </Button>
          )
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Start this application?</AlertDialogTitle>
          <AlertDialogDescription>
            {opportunityTitle
              ? `This will create a new application for "${opportunityTitle}" with a default task checklist.`
              : "This will create a new application with a default task checklist."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={handleConfirm}>
            {isPending ? "Starting..." : "Start Application"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}