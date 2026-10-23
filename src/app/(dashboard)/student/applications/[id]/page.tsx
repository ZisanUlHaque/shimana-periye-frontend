import type { Metadata } from "next";
import { ApplicationDetail } from "@/components/features/application/application-detail";
import { PageHeader } from "@/components/layout/public/page-header";

export const metadata: Metadata = {
  title: "Application Details",
  description: "Manage status, interview, and decision.",
};

interface ApplicationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplicationDetailPage({ params }: ApplicationDetailPageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Application Details" description="Manage status, interview, and decision." />
      <ApplicationDetail applicationId={id} />
    </div>
  );
}
