"use client";

import { use } from "react";
import { MentorApplicationTaskList } from "@/components/features/application-task/mentor-application-task-list";
import { PageHeader } from "@/components/layout/public/page-header";

interface MentorApplicationTasksPageProps {
  params: Promise<{ id: string }>;
}

export default function MentorApplicationTasksPage({ params }: MentorApplicationTasksPageProps) {
  const { id } = use(params);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Mentee's Application Tasks"
        description="View progress on tasks for this application."
      />
      <MentorApplicationTaskList applicationId={id} />
    </div>
  );
}
