"use client";

import { GraduationCap, Mail, Building2, Pencil, Trash2 } from "lucide-react";
import type { IProfessor } from "@/types/professor.type";
import { ProfessorDialog } from "./professor-dialog";
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
import { useDeleteProfessor } from "@/hooks/professor.hook";
import { useState } from "react";

export function ProfessorCard({
  professor,
  isAdmin = false,
}: {
  professor: IProfessor;
  isAdmin?: boolean;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: deleteProf, isPending } = useDeleteProfessor();

  return (
    <div className="group relative flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:border-border hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <GraduationCap className="size-5" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-foreground">
              {professor.name}
            </h3>
            <p className="truncate text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Building2 className="size-3" />
              <span>
                {professor.university?.name ?? "University Affiliation"}
              </span>
            </p>
          </div>
        </div>

        {isAdmin && (
          <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <ProfessorDialog
              professor={professor}
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
                  <AlertDialogTitle>Delete Professor</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this professor profile?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isPending}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      deleteProf(professor.id, {
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

      {professor.lab && (
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Lab:</span> {professor.lab.name}
        </div>
      )}

      {professor.email && (
        <div className="flex items-center gap-1.5 border-t border-border/60 pt-3 text-xs text-muted-foreground">
          <Mail className="size-3.5" />
          <a
            href={`mailto:${professor.email}`}
            className="hover:text-primary truncate"
          >
            {professor.email}
          </a>
        </div>
      )}
    </div>
  );
}
