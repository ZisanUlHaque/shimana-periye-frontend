import {
  LayoutDashboard,
  Compass,
  Building2,
  GraduationCap,
  FlaskConical,
  ListChecks,
} from "lucide-react";
import { SidebarItems } from "@/types/sidebar.type";

const prefix = "/admin";

export const adminRoutes: SidebarItems = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: `${prefix}`, icon: LayoutDashboard },
    ],
  },
  {
    title: "Catalog Management",
    items: [
      { title: "Opportunities", url: `${prefix}/opportunities`, icon: Compass },
      { title: "Requirements", url: `${prefix}/requirements`, icon: ListChecks },
      { title: "Universities", url: `${prefix}/universities`, icon: Building2 },
      { title: "Professors", url: `${prefix}/professors`, icon: GraduationCap },
      { title: "Labs", url: `${prefix}/labs`, icon: FlaskConical },
    ],
  },
];
