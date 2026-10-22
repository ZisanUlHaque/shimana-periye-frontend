import { PageHeader } from "@/components/layout/public/page-header";

export default function MentorBookingPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        title="Book a Mentor"
        description="Browse available slots and manage your bookings."
      />
      {/* TODO: GET /api/v1/mentor-schedules/available */}
      {/* TODO: POST /api/v1/mentor-schedules/book */}
      {/* TODO: GET /api/v1/mentor-schedules/bookings/my */}
      {/* TODO: PATCH /api/v1/mentor-schedules/bookings/:bookingId/cancel */}
    </div>
  );
}