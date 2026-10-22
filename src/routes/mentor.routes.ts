// routes/mentor.routes.ts
import {
  LayoutDashboard,
  CalendarCheck,
  Route as RouteIcon,
  Database,
} from "lucide-react";
import { SidebarItems } from "@/types/sidebar.type";

const prefix = "/dashboard";

export const mentorRoutes: SidebarItems = [
  {
    title: "Bookings",
    items: [
      { title: "Overview", url: `${prefix}`, icon: LayoutDashboard },
      { title: "My Appointments", url: `${prefix}/my-appointments`, icon: CalendarCheck },
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