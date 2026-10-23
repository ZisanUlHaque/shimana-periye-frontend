"use client";

import { useForm } from "@tanstack/react-form";
import { Loader2, Calculator } from "lucide-react";
import type { ICostEstimate } from "@/types/cost-estimate.type";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field";
import {
  type CostEstimateFormValues,
  CostEstimateValidation,
} from "@/validation/cost-estimate.validation";

interface CostEstimateFormProps {
  defaultValues?: Partial<ICostEstimate>;
  onSubmit: (values: CostEstimateFormValues) => void;
  isSubmitting?: boolean;
}

export function CostEstimateForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: CostEstimateFormProps) {
  const form = useForm({
    defaultValues: {
      tuitionFee: defaultValues?.tuitionFee ?? 0,
      livingCost: defaultValues?.livingCost ?? 0,
      visaAndTravelFee: defaultValues?.visaAndTravelFee ?? 0,
      healthInsurance: defaultValues?.healthInsurance ?? 0,
      applicationFee: defaultValues?.applicationFee ?? 0,
      miscellaneousCost: defaultValues?.miscellaneousCost ?? 0,
      scholarshipOrWaiver: defaultValues?.scholarshipOrWaiver ?? 0,
      currency: defaultValues?.currency ?? "USD",
      notes: defaultValues?.notes ?? "",
    } as CostEstimateFormValues,
    validators: {
      onSubmit: CostEstimateValidation.UpsertCostEstimateZodSchema,
    },
    onSubmit: ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-5"
      noValidate
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Tuition Fee */}
        <form.Field name="tuitionFee">
          {(field) => (
            <div className="grid gap-1.5">
              <Label htmlFor="tuitionFee">Tuition Fee</Label>
              <Input
                id="tuitionFee"
                type="number"
                placeholder="0"
                value={(field.state.value as number) ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                disabled={isSubmitting}
              />
            </div>
          )}
        </form.Field>

        {/* Living Cost */}
        <form.Field name="livingCost">
          {(field) => (
            <div className="grid gap-1.5">
              <Label htmlFor="livingCost">Living Cost</Label>
              <Input
                id="livingCost"
                type="number"
                placeholder="0"
                value={(field.state.value as number) ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                disabled={isSubmitting}
              />
            </div>
          )}
        </form.Field>

        {/* Visa & Travel */}
        <form.Field name="visaAndTravelFee">
          {(field) => (
            <div className="grid gap-1.5">
              <Label htmlFor="visaAndTravelFee">Visa & Travel Expenses</Label>
              <Input
                id="visaAndTravelFee"
                type="number"
                placeholder="0"
                value={(field.state.value as number) ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                disabled={isSubmitting}
              />
            </div>
          )}
        </form.Field>

        {/* Health Insurance */}
        <form.Field name="healthInsurance">
          {(field) => (
            <div className="grid gap-1.5">
              <Label htmlFor="healthInsurance">Health Insurance</Label>
              <Input
                id="healthInsurance"
                type="number"
                placeholder="0"
                value={(field.state.value as number) ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                disabled={isSubmitting}
              />
            </div>
          )}
        </form.Field>

        {/* Application Fee */}
        <form.Field name="applicationFee">
          {(field) => (
            <div className="grid gap-1.5">
              <Label htmlFor="applicationFee">Application Fee</Label>
              <Input
                id="applicationFee"
                type="number"
                placeholder="0"
                value={(field.state.value as number) ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                disabled={isSubmitting}
              />
            </div>
          )}
        </form.Field>

        {/* Miscellaneous */}
        <form.Field name="miscellaneousCost">
          {(field) => (
            <div className="grid gap-1.5">
              <Label htmlFor="miscellaneousCost">Miscellaneous Cost</Label>
              <Input
                id="miscellaneousCost"
                type="number"
                placeholder="0"
                value={(field.state.value as number) ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                disabled={isSubmitting}
              />
            </div>
          )}
        </form.Field>

        {/* Scholarship / Tuition Waiver Deduction */}
        <form.Field name="scholarshipOrWaiver">
          {(field) => (
            <div className="grid gap-1.5">
              <Label htmlFor="scholarshipOrWaiver">
                Scholarship / Waiver (Deduction)
              </Label>
              <Input
                id="scholarshipOrWaiver"
                type="number"
                placeholder="0"
                value={(field.state.value as number) ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                disabled={isSubmitting}
              />
            </div>
          )}
        </form.Field>

        {/* Currency */}
        <form.Field name="currency">
          {(field) => (
            <div className="grid gap-1.5">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                placeholder="USD"
                value={field.state.value as string}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value.toUpperCase())}
                disabled={isSubmitting}
              />
            </div>
          )}
        </form.Field>
      </div>

      {/* Notes */}
      <form.Field name="notes">
        {(field) => (
          <div className="grid gap-1.5">
            <Label htmlFor="notes">Personal Notes / Cost Assumptions</Label>
            <Textarea
              id="notes"
              placeholder="e.g. Assuming on-campus graduate housing and TA tuition waiver..."
              rows={3}
              value={(field.state.value as string) ?? ""}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting] as const}
      >
        {([canSubmit, isFormSubmitting]) => (
          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="w-full sm:w-auto self-end gap-2"
          >
            {(isSubmitting || isFormSubmitting) ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Calculator className="size-4" />
            )}
            Save & Calculate Cost Estimate
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
