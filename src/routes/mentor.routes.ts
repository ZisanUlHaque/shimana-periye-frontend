// routes/mentor.routes.ts
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  ClipboardList,
  ListChecks,
  FileStack,
  MessageSquareText,
  Video,
  CalendarClock,
  Mail,
  UserCircle2,
  ShieldCheck,
} from "lucide-react";
import { SidebarItems } from "@/types/sidebar.type";

const prefix = "/mentor";

export const mentorRoutes: SidebarItems = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: `${prefix}`, icon: LayoutDashboard },
      { title: "Calendar", url: `${prefix}/calendar`, icon: CalendarDays },
    ],
  },
  {
    title: "Students",
    items: [
      { title: "Assigned Students", url: `${prefix}/students`, icon: Users },
      { title: "Applications", url: `${prefix}/applications`, icon: ClipboardList },
      { title: "Tasks", url: `${prefix}/tasks`, icon: ListChecks },
    ],
  },
  {
    title: "Review & Feedback",
    items: [
      { title: "Documents", url: `${prefix}/documents`, icon: FileStack },
      { title: "Feedback", url: `${prefix}/feedback`, icon: MessageSquareText },
    ],
  },
  {
    title: "Schedule & Bookings",
    items: [
      { title: "My Schedule", url: `${prefix}/schedule`, icon: CalendarClock },
      { title: "Bookings", url: `${prefix}/bookings`, icon: Video },
    ],
  },
  {
    title: "Outreach",
    items: [
      { title: "Outreach Requests", url: `${prefix}/outreach`, icon: Mail },
    ],
  },
  {
    title: "Profile",
    items: [
      { title: "Mentor Profile", url: `${prefix}/profile`, icon: UserCircle2 },
      { title: "Verification Status", url: `${prefix}/profile/verification`, icon: ShieldCheck },
    ],
  },
];