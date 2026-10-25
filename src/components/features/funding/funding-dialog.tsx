"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Plus, Coins, Loader2 } from "lucide-react";
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
import { FieldError } from "@/components/ui/field";
import { useCreateFunding, useUpdateFunding } from "@/hooks/funding.hook";
import { useOpportunities } from "@/hooks/opportunity.hook";
import type { IFunding } from "@/types/funding.type";

interface FundingDialogProps {
  funding?: IFunding;
  trigger?: React.ReactNode;
}

export function FundingDialog({ funding, trigger }: FundingDialogProps) {
  const [open, setOpen] = useState(false);
  const isEditing = Boolean(funding);

  const { mutate: create, isPending: isCreating } = useCreateFunding();
  const { mutate: update, isPending: isUpdating } = useUpdateFunding();
  const isSubmitting = isCreating || isUpdating;

  const { data: oppsData } = useOpportunities();
  const opportunities = oppsData?.data ?? [];

  const form = useForm({
    defaultValues: {
      opportunityId: funding?.opportunityId ?? "",
      name: funding?.name ?? "",
      amount: funding?.amount ?? 0,
      currency: funding?.currency ?? "USD",
    },
    onSubmit: ({ value }) => {
      if (isEditing && funding) {
        update(
          {
            id: funding.id,
            payload: {
              name: value.name,
              amount: Number(value.amount),
              currency: value.currency.toUpperCase(),
            },
          },
          {
            onSuccess: () => setOpen(false),
          }
        );
      } else {
        create(
          {
            opportunityId: value.opportunityId ? value.opportunityId : undefined,
            name: value.name,
            amount: Number(value.amount),
            currency: value.currency.toUpperCase(),
          },
          {
            onSuccess: () => {
              form.reset();
              setOpen(false);
            },
          }
        );
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button size="sm" className="gap-1.5">
              <Plus className="size-4" />
              Add Funding / Scholarship
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Coins className="size-5" />
          </div>
          <DialogTitle className="mt-2">
            {isEditing ? "Edit Funding Record" : "Add Funding / Scholarship"}
          </DialogTitle>
          <DialogDescription>
            Record scholarships, stipends, or tuition waivers to track your financial plan.
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
          {/* Linked Opportunity (Optional) */}
          <form.Field name="opportunityId">
            {(field) => (
              <div className="grid gap-1.5">
                <Label htmlFor="funding-opp">Link to Opportunity (Optional)</Label>
                <select
                  id="funding-opp"
                  disabled={isSubmitting || isEditing}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                >
                  <option value="">General Scholarship / Funding</option>
                  {opportunities.map((opp: any) => (
                    <option key={opp.id} value={opp.id}>
                      {opp.title} ({opp.university?.name ?? "University"})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </form.Field>

          {/* Scholarship / Funding Name */}
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) =>
                !value || value.length < 2 ? "Name is required" : undefined,
            }}
          >
            {(field) => (
              <div className="grid gap-1.5">
                <Label htmlFor="funding-name">Funding / Award Name *</Label>
                <Input
                  id="funding-name"
                  placeholder="e.g. Fulbright Foreign Student Fellowship"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isSubmitting}
                />
                {field.state.meta.errors?.[0] && (
                  <FieldError>{String(field.state.meta.errors[0])}</FieldError>
                )}
              </div>
            )}
          </form.Field>

          {/* Amount & Currency */}
          <div className="grid grid-cols-2 gap-3">
            <form.Field
              name="amount"
              validators={{
                onChange: ({ value }) =>
                  Number(value) < 0 ? "Amount cannot be negative" : undefined,
              }}
            >
              {(field) => (
                <div className="grid gap-1.5">
                  <Label htmlFor="funding-amount">Amount *</Label>
                  <Input
                    id="funding-amount"
                    type="number"
                    min="0"
                    step="any"
                    placeholder="25000"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    disabled={isSubmitting}
                  />
                  {field.state.meta.errors?.[0] && (
                    <FieldError>{String(field.state.meta.errors[0])}</FieldError>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="currency"
              validators={{
                onChange: ({ value }) =>
                  value.length !== 3 ? "Must be 3 chars (e.g. USD)" : undefined,
              }}
            >
              {(field) => (
                <div className="grid gap-1.5">
                  <Label htmlFor="funding-currency">Currency (3 Letters) *</Label>
                  <Input
                    id="funding-currency"
                    placeholder="USD"
                    maxLength={3}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value.toUpperCase())}
                    disabled={isSubmitting}
                  />
                  {field.state.meta.errors?.[0] && (
                    <FieldError>{String(field.state.meta.errors[0])}</FieldError>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting] as const}
          >
            {([canSubmit]) => (
              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="mt-2 w-full gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Coins className="size-4" />
                )}
                {isEditing ? "Save Changes" : "Add Funding"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </DialogContent>
    </Dialog>
  );
}
