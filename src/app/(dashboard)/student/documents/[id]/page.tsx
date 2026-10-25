import { Suspense } from "react";
import { DocumentDetailView } from "@/components/features/document/document-detail-view";

export const dynamic = "force-dynamic";

interface DocumentDetailPageProps {
  params: Promise<{ id: string }>;
}

async function DocumentDetailContent({ params }: DocumentDetailPageProps) {
  const { id } = await params;
  return <DocumentDetailView documentId={id} />;
}

export default function DocumentDetailPage({
  params,
}: DocumentDetailPageProps) {
  return (
    <Suspense
      fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted/60 m-6" />}
    >
      <DocumentDetailContent params={params} />
    </Suspense>
  );
}
