import { CalendarView } from "@/components/features/calendar/calendar-view";
import { PageHeader } from "@/components/layout/public/page-header";

export default function StudentCalendarPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description="All your deadlines, tasks, interviews and test dates in one place."
      />
      <CalendarView />
    </div>
  );
}