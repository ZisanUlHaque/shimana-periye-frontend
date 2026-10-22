import { PageHeader } from "@/components/layout/public/page-header";

export default function CalendarPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        title="Calendar"
        description="Deadlines, tasks and interview calls in one place."
      />
      {/* TODO: GET /api/v1/calendar/events */}
      {/* TODO: GET /api/v1/calendar/export.ics (subscribe link) */}
    </div>
  );
}