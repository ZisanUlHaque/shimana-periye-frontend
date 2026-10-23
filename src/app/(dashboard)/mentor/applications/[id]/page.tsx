import { MentorApplicationDetail } from "@/components/features/application/mentor-application-detail";
import { PageHeader } from "@/components/layout/public/page-header";

interface MentorApplicationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MentorApplicationDetailPage({
  params,
}: MentorApplicationDetailPageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Mentee's Application" description="View their progress and status." />
      <MentorApplicationDetail applicationId={id} />
    </div>
  );
}