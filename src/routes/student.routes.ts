import {
  LayoutDashboard,
  Gauge,
  CalendarDays,
  UserCircle2,
  GraduationCap,
  Briefcase,
  BookMarked,
  FileCheck2,
  Compass,
  Bookmark,
  Scale,
  ClipboardList,
  FileStack,
  MessagesSquare,
  Video,
  Users,
  Mail,
  HandCoins,
} from "lucide-react";
import { SidebarItems } from "@/types/sidebar.type";

const prefix = "/student";

export const studentRoutes: SidebarItems = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: `${prefix}`, icon: LayoutDashboard },
      { title: "Readiness Score", url: `${prefix}/readiness`, icon: Gauge },
      { title: "Calendar", url: `${prefix}/calendar`, icon: CalendarDays },
    ],
  },
  {
    title: "My Profile",
    items: [
      { title: "Profile Info", url: `${prefix}/profile`, icon: UserCircle2 },
      { title: "Academic Records", url: `${prefix}/profile/academic-records`, icon: GraduationCap },
      { title: "Experience", url: `${prefix}/profile/experiences`, icon: Briefcase },
      { title: "Publications", url: `${prefix}/profile/publications`, icon: BookMarked },
      { title: "Test Scores", url: `${prefix}/profile/test-records`, icon: FileCheck2 },
    ],
  },
  {
    title: "Opportunities",
    items: [
      { title: "Browse Opportunities", url: `${prefix}/opportunities`, icon: Compass },
      { title: "Shortlist", url: `${prefix}/shortlist`, icon: Bookmark },
      { title: "Compare", url: `${prefix}/shortlist/compare`, icon: Scale },
    ],
  },
  {
    title: "Applications",
    items: [
      { title: "My Applications", url: `${prefix}/applications`, icon: ClipboardList },
      { title: "Documents", url: `${prefix}/documents`, icon: FileStack },
    ],
  },
  {
    title: "Interview & Mentors",
    items: [
      { title: "Interview Practice", url: `${prefix}/interview-practice`, icon: MessagesSquare },
      { title: "Book a Mentor", url: `${prefix}/mentor-booking`, icon: Video },
    ],
  },
  {
    title: "Funding & Outreach",
    items: [
      { title: "Recommendations", url: `${prefix}/recommendations`, icon: Users },
      { title: "Professor Outreach", url: `${prefix}/outreach`, icon: Mail },
      { title: "Scholarships & Funding", url: `${prefix}/fundings`, icon: HandCoins },
    ],
  },
];