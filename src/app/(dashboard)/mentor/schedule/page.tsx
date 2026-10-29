import { MentorScheduleManager } from "@/components/features/mentor/mentor-schedule-manager";

export const metadata = {
  title: "Mentorship Schedule | PUB GradPath",
  description: "Manage your mentorship availability slots and student bookings.",
};

export default function MentorSchedulePage() {
  return <MentorScheduleManager />;
}
