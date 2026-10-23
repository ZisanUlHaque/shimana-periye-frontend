"use client";

import { FlaskConical, Building2, Pencil, Trash2 } from "lucide-react";
import type { ILab } from "@/types/lab.type";
import { LabDialog } from "./lab-dialog";
import { Button } from "@/components/ui/button";
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
import { useDeleteLab } from "@/hooks/lab.hook";
import { useState } from "react";

export function LabCard({
  lab,
  isAdmin = false,
}: {
  lab: ILab;
  isAdmin?: boolean;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: deleteLabFn, isPending } = useDeleteLab();

  return (
    <div className="group relative flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:border-border hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FlaskConical className="size-5" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-foreground">
              {lab.name}
            </h3>
            <p className="truncate text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Building2 className="size-3" />
              <span>{lab.university?.name ?? "University Lab"}</span>
            </p>
          </div>
        </div>

        {isAdmin && (
          <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <LabDialog
              lab={lab}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="size-3.5" />
                </Button>
              }
            />
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <AlertDialogTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Lab</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this lab?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isPending}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      deleteLabFn(lab.id, {
                        onSuccess: () => setDeleteOpen(false),
                      })
                    }
                    disabled={isPending}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isPending ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      {lab.focusAreas && lab.focusAreas.length > 0 && (
        <div className="flex flex-wrap gap-1 border-t border-border/60 pt-3">
          {lab.focusAreas.map((area, i) => (
            <span
              key={i}
              className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {area}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
