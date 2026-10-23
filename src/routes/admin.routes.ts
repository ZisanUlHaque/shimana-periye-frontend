import {
  LayoutDashboard,
  CalendarDays,
  Compass,
  Building2,
  GraduationCap,
  FlaskConical,
  ListChecks,
  ClipboardList,
  Users,
  ShieldCheck,
  UserCog,
  Video,
  HandCoins,
  Mail,
  FileStack,
  BarChart3,
  Settings,
} from "lucide-react";
import { SidebarItems } from "@/types/sidebar.type";

const prefix = "/admin";

export const adminRoutes: SidebarItems = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: `${prefix}`, icon: LayoutDashboard },
      { title: "Analytics", url: `${prefix}/analytics`, icon: BarChart3 },
      { title: "Calendar", url: `${prefix}/calendar`, icon: CalendarDays },
    ],
  },
  {
    title: "Opportunities",
    items: [
      { title: "Opportunities", url: `${prefix}/opportunities`, icon: Compass },
      { title: "Requirements", url: `${prefix}/requirements`, icon: ListChecks },
      { title: "Universities", url: `${prefix}/universities`, icon: Building2 },
      { title: "Professors", url: `${prefix}/professors`, icon: GraduationCap },
      { title: "Labs", url: `${prefix}/labs`, icon: FlaskConical },
    ],
  },
  {
    title: "Applications",
    items: [
      { title: "All Applications", url: `${prefix}/applications`, icon: ClipboardList },
      { title: "Documents", url: `${prefix}/documents`, icon: FileStack },
    ],
  },
  {
    title: "People",
    items: [
      { title: "Students", url: `${prefix}/students`, icon: Users },
      { title: "Mentors", url: `${prefix}/mentors`, icon: UserCog },
      { title: "Mentor Verification", url: `${prefix}/mentors/verification`, icon: ShieldCheck },
      { title: "Mentor Bookings", url: `${prefix}/mentor-bookings`, icon: Video },
    ],
  },
  {
    title: "Funding & Outreach",
    items: [
      { title: "Fundings", url: `${prefix}/fundings`, icon: HandCoins },
      { title: "Outreach Logs", url: `${prefix}/outreach`, icon: Mail },
    ],
  },
  {
    title: "System",
    items: [
      { title: "Settings", url: `${prefix}/settings`, icon: Settings },
    ],
  },
];