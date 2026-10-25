import { MentorAvailableSlots } from "@/components/features/mentor-schedule/mentor-available-slots";
import { MyBookingsList } from "@/components/features/mentor-schedule/my-bookings-list";
import { PageHeader } from "@/components/layout/public/page-header";

export default function MentorBookingPage() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-4 sm:p-6">
      <PageHeader
        title="1-on-1 Mentor Sessions"
        description="Connect with alumni and graduate mentors to review your essays, applications, and interview readiness."
      />

      <div className="flex flex-col gap-4">
        <h3 className="text-base font-semibold text-foreground">
          My Booked Sessions
        </h3>
        <MyBookingsList />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">
            Available Mentor Slots
          </h3>
          <span className="text-xs text-muted-foreground">
            100% Free · Verified Mentors
          </span>
        </div>
        <MentorAvailableSlots />
      </div>
    </div>
  );
}
