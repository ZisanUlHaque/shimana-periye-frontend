import {
  Building2,
  Compass,
  FlaskConical,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  UserCheck,
  UserCog,
  Users,
} from "lucide-react";
import type { SidebarItems } from "@/types/sidebar.type";

const prefix = "/admin";

export const adminRoutes: SidebarItems = [
  {
    title: "Overview",
    items: [{ title: "Dashboard", url: `${prefix}`, icon: LayoutDashboard }],
  },
  {
    title: "User Management",
    items: [
      { title: "All Users", url: `${prefix}/users`, icon: Users },
      { title: "Mentor Approvals", url: `${prefix}/mentors`, icon: UserCheck },
    ],
  },
  {
    title: "Catalog Management",
    items: [
      { title: "Opportunities", url: `${prefix}/opportunities`, icon: Compass },
      {
        title: "Requirements",
        url: `${prefix}/requirements`,
        icon: ListChecks,
      },
      { title: "Universities", url: `${prefix}/universities`, icon: Building2 },
      { title: "Professors", url: `${prefix}/professors`, icon: GraduationCap },
      { title: "Labs", url: `${prefix}/labs`, icon: FlaskConical },
    ],
  },
  {
    title: "Account",
    items: [
      { title: "Admin Profile", url: `${prefix}/profile`, icon: UserCog },
    ],
  },
];
