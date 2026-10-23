import type { Metadata } from "next";
import { UniversityDetail } from "@/components/features/university/university-detail";
import { PageHeader } from "@/components/layout/public/page-header";

export const metadata: Metadata = {
  title: "University Details",
  description: "View university details and programs.",
};

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
