"use client";

import { use } from "react";
import { AdminOpportunityDetail } from "@/components/features/opportunity/admin-opportunity-detail";
import { PageHeader } from "@/components/layout/public/page-header";

interface AdminOpportunityDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function AdminOpportunityDetailPage({
  params,
}: AdminOpportunityDetailPageProps) {
  const { id } = use(params);
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Opportunity Details"
        description="Edit details and view deadline history."
      />
      <AdminOpportunityDetail opportunityId={id} />
    </div>
  );
}
