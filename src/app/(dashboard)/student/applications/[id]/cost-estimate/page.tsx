"use client";

import { use } from "react";
import {
  useGetCostEstimate,
  useUpsertCostEstimate,
} from "@/hooks/cost-estimate.hook";
import { PageHeader } from "@/components/layout/public/page-header";
import { CostEstimateForm } from "@/components/features/cost-estimate/cost-estimate-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Coins, PiggyBank, ArrowDownRight, Scale } from "lucide-react";
import type { CostEstimateFormValues } from "@/validation/cost-estimate.validation";

export default function CostEstimatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = useGetCostEstimate(id);
  const costEstimate = data?.data;

  const { mutate: saveEstimate, isPending: isSaving } =
    useUpsertCostEstimate(id);

  const handleSubmit = (values: CostEstimateFormValues) => {
    saveEstimate(values);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        title="Cost Estimator & Financial Planner"
        description="Calculate estimated total expenses, deduct scholarships, and project your net cost."
      />

      {/* Summary Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
      ) : costEstimate ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1 rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Estimated Total Expenses</span>
              <Coins className="size-4 text-primary" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground mt-1">
              {costEstimate.currency} {costEstimate.estimatedTotal?.toLocaleString() ?? 0}
            </span>
            <span className="text-[11px] text-muted-foreground">
              Tuition, living, visa & incidentals
            </span>
          </div>

          <div className="flex flex-col gap-1 rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Scholarships / Waivers</span>
              <PiggyBank className="size-4 text-emerald-500" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 mt-1">
              - {costEstimate.currency} {costEstimate.scholarshipOrWaiver?.toLocaleString() ?? 0}
            </span>
            <span className="text-[11px] text-muted-foreground">
              Awarded or expected aid
            </span>
          </div>

          <div className="flex flex-col gap-1 rounded-2xl border border-primary/30 bg-primary/5 p-5 shadow-xs">
            <div className="flex items-center justify-between text-primary font-medium">
              <span className="text-xs">Projected Net Cost</span>
              <Scale className="size-4" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-primary mt-1">
              {costEstimate.currency} {costEstimate.netCost?.toLocaleString() ?? 0}
            </span>
            <span className="text-[11px] text-muted-foreground">
              Remaining out-of-pocket budget
            </span>
          </div>
        </div>
      ) : null}

      {/* Form Input Block */}
      <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs">
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Financial Budget Breakdown
        </h3>
        <CostEstimateForm
          defaultValues={costEstimate}
          onSubmit={handleSubmit}
          isSubmitting={isSaving}
        />
      </div>
    </div>
  );
}
