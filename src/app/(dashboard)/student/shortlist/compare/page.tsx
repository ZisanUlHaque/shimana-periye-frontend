"use client";

import { useSearchParams } from "next/navigation";
import { ShortlistCompareView } from "@/components/features/shortlist/shortlist-compare-view";
import { PageHeader } from "@/components/layout/public/page-header";

export default function ShortlistComparePage() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids") ?? "";
  const ids = idsParam.split(",").filter(Boolean);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compare Opportunities"
        description="Side-by-side comparison of your shortlisted opportunities."
      />
      <ShortlistCompareView ids={ids} />
    </div>
  );
}