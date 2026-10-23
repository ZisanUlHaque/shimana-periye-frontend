import { OutreachLogDialog } from "@/components/features/outreach-log/outreach-log-dialog";
import { OutreachLogList } from "@/components/features/outreach-log/outreach-log-list";
import { PageHeader } from "@/components/layout/public/page-header";

export default function OutreachPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        title="Professor Outreach"
        description="Log cold emails to prospective professors, monitor replies, and track follow-ups."
        action={<OutreachLogDialog />}
      />
      <OutreachLogList />
    </div>
  );
}
