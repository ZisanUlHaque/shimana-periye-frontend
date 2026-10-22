// routes/admin.routes.ts
import {
  LayoutDashboard,
  UserCheck,
  Route as RouteIcon,
  Database,
} from "lucide-react";
import { SidebarItems } from "@/types/sidebar.type";

const prefix = "/admin";

export const adminRoutes: SidebarItems = [
  {
    title: "Management",
    items: [
      { title: "Overview", url: `${prefix}`, icon: LayoutDashboard },
      { title: "Doctor Approval", url: `${prefix}/approve-doctor`, icon: UserCheck },
    ],
  },
  {
    title: "App Settings",
    items: [
      { title: "Routing", url: "#", icon: RouteIcon },
      { title: "Data Fetching", url: "#", icon: Database },
    ],
  },
];