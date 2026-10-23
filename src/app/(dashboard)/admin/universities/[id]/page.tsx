import { UniversityDetail } from "@/components/features/university/university-detail";
import { PageHeader } from "@/components/layout/public/page-header";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminUniversityDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <PageHeader title="University Details" />
      <UniversityDetail universityId={id} />
    </div>
  );
}