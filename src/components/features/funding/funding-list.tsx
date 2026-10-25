"use client";

import {
  useMyFundings,
  useUpdateFundingStatus,
  useDeleteFunding,
} from "@/hooks/funding.hook";
import {
  Coins,
  Pencil,
  Trash2,
  GraduationCap,
  Building2,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FundingDialog } from "./funding-dialog";
import type { FundingStatus, IFunding } from "@/types/funding.type";

const STATUS_VARIANTS: Record<FundingStatus, { label: string; className: string }> = {
  AVAILABLE: {
    label: "Available / Searching",
    className: "border-blue-500/30 bg-blue-500/10 text-blue-600",
  },
  APPLIED: {
    label: "Applied",
    className: "border-amber-500/30 bg-amber-500/10 text-amber-600",
  },
  AWARDED: {
    label: "Awarded 🎉",
    className: "border-green-500/30 bg-green-500/10 text-green-600",
  },
  REJECTED: {
    label: "Not Awarded",
    className: "border-destructive/30 bg-destructive/10 text-destructive",
  },
};

export function FundingList() {
  const { data, isLoading } = useMyFundings();
  const fundings: IFunding[] = data?.data ?? [];

  const { mutate: updateStatus } = useUpdateFundingStatus();
  const { mutate: removeFunding } = useDeleteFunding();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-44 rounded-2xl" />
        <Skeleton className="h-44 rounded-2xl" />
        <Skeleton className="h-44 rounded-2xl" />
      </div>
    );
  }

  if (fundings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Coins className="size-6" />
        </div>
        <h4 className="mt-4 text-sm font-semibold text-foreground">
          No scholarships or funding tracked yet
        </h4>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm">
          Add prospective fellowships, scholarships, or tuition stipends to keep track of
          your aid packages.
        </p>
        <div className="mt-4">
          <FundingDialog />
        </div>
      </div>
    );
  }

  // Calculate totals
  const totalAwarded = fundings
    .filter((f) => f.status === "AWARDED")
    .reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Metric Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
            <Coins className="size-5" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground">
              Total Awarded Funding
            </span>
            <h4 className="text-xl font-bold text-foreground">
              ${totalAwarded.toLocaleString()}
            </h4>
          </div>
        </div>

        <FundingDialog />
      </div>

      {/* Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fundings.map((item) => {
          const statusInfo = STATUS_VARIANTS[item.status] ?? STATUS_VARIANTS.AVAILABLE;

          return (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-shadow hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="outline" className={`text-xs ${statusInfo.className}`}>
                    {statusInfo.label}
                  </Badge>

                  <div className="flex items-center gap-1">
                    <FundingDialog
                      funding={item}
                      trigger={
                        <Button variant="ghost" size="icon-sm" className="size-7">
                          <Pencil className="size-3.5" />
                        </Button>
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="size-7 text-destructive hover:bg-destructive/10"
                      onClick={() => removeFunding(item.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>

                <h4 className="mt-3 text-sm font-semibold text-foreground">
                  {item.name}
                </h4>

                <div className="mt-1 text-2xl font-black text-primary">
                  {item.currency} {item.amount.toLocaleString()}
                </div>

                {item.opportunity && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground border-t border-border/50 pt-2.5">
                    <Building2 className="size-3.5 shrink-0" />
                    <span className="truncate">{item.opportunity.title}</span>
                  </div>
                )}
              </div>

              {/* Status Update Quick Buttons */}
              <div className="mt-4 border-t border-border/60 pt-3">
                <span className="text-[11px] text-muted-foreground block mb-1.5">
                  Update Status:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(["AVAILABLE", "APPLIED", "AWARDED", "REJECTED"] as FundingStatus[]).map(
                    (s) => (
                      <Button
                        key={s}
                        size="xs"
                        variant={item.status === s ? "default" : "outline"}
                        className="text-[10px] h-6 px-2 capitalize"
                        onClick={() =>
                          updateStatus({
                            id: item.id,
                            payload: { status: s },
                          })
                        }
                      >
                        {s.toLowerCase()}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
