"use client";

import { use } from "react";
import { ApplicationTaskDialog } from "@/components/features/application-task/application-task-dialog";
import { ApplicationTaskList } from "@/components/features/application-task/application-task-list";
import { PageHeader } from "@/components/layout/public/page-header";

interface ApplicationTasksPageProps {
  params: Promise<{ id: string }>;
}

export default function ApplicationTasksPage({ params }: ApplicationTasksPageProps) {
  const { id } = use(params);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Application Tasks"
        description="Track the action items for this application."
        action={<ApplicationTaskDialog applicationId={id} />}
      />
      <ApplicationTaskList applicationId={id} />
    </div>
  );
}
