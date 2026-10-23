"use client";

import { useRequirements, useDeleteRequirement } from "@/hooks/requirement.hook";
import { RequirementDialog } from "./requirement-dialog";
import { Button } from "@/components/ui/button";
import { ListChecks, Pencil, Trash2 } from "lucide-react";
import type { IRequirement } from "@/types/requirement.type";

export function OpportunityRequirementsManager({
  opportunityId,
  isAdmin = false,
}: {
  opportunityId: string;
  isAdmin?: boolean;
}) {
  const { data, isLoading } = useRequirements(opportunityId);
  const requirements: IRequirement[] = data?.data ?? [];
  const { mutate: deleteReq } = useDeleteRequirement(opportunityId);

  if (isLoading) {
    return <div className="h-32 animate-pulse rounded-2xl bg-muted/40" />;
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListChecks className="size-4 text-primary" />
          <h4 className="text-sm font-semibold text-foreground">
            Eligibility Requirements ({requirements.length})
          </h4>
        </div>
        {isAdmin && <RequirementDialog opportunityId={opportunityId} />}
      </div>

      {requirements.length === 0 ? (
        <p className="text-xs italic text-muted-foreground py-2">
          No specific eligibility criteria specified for this opportunity.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {requirements.map((req) => (
            <div
              key={req.id}
              className="group flex items-center justify-between rounded-xl border border-border/60 bg-background/50 p-3 text-xs"
            >
              <div className="min-w-0 pr-2">
                <span className="font-semibold text-foreground block">
                  {req.type.replace(/_/g, " ")}
                </span>
                <span className="text-muted-foreground">{req.detail}</span>
                {req.minValue !== null && req.minValue !== undefined && (
                  <span className="ml-2 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-mono">
                    Min: {req.minValue}
                  </span>
                )}
              </div>

              {isAdmin && (
                <div className="flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <RequirementDialog
                    opportunityId={opportunityId}
                    requirement={req}
                    trigger={
                      <Button variant="ghost" size="icon" className="size-6">
                        <Pencil className="size-3" />
                      </Button>
                    }
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteReq(req.id)}
                    className="size-6 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
