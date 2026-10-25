import {
  LayoutDashboard,
  ClipboardList,
  Calendar,
  User,
} from "lucide-react";
import { SidebarItems } from "@/types/sidebar.type";

const prefix = "/mentor";

export const mentorRoutes: SidebarItems = [
  {
    title: "Mentorship Hub",
    items: [
      { title: "Dashboard", url: `${prefix}`, icon: LayoutDashboard },
      { title: "Assigned Applications", url: `${prefix}/applications`, icon: ClipboardList },
      { title: "Consultation Schedule", url: `${prefix}/schedule`, icon: Calendar },
      { title: "Profile & Credentials", url: `${prefix}/profile`, icon: User },
    ],
  },
];
