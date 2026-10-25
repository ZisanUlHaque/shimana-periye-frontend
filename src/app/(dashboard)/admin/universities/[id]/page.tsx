import { Suspense } from "react";
import { UniversityDetail } from "@/components/features/university/university-detail";
import { PageHeader } from "@/components/layout/public/page-header";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function UniversityDetailContent({ params }: PageProps) {
  const { id } = await params;
  return <UniversityDetail universityId={id} />;
}

export default function AdminUniversityDetailPage({ params }: PageProps) {
  return (
    <div className="space-y-6">
      <PageHeader title="University Details" />
      <Suspense
        fallback={<div className="h-48 animate-pulse rounded-2xl bg-muted/60" />}
      >
        <UniversityDetailContent params={params} />
      </Suspense>
    </div>
  );
}
