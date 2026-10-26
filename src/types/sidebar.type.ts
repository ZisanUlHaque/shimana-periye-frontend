import type { LucideIcon } from "lucide-react";

export interface SidebarItem {
  title: string;
  url: string;
  icon?: LucideIcon;
}

export interface SidebarGroupType {
  title: string;
  icon?: LucideIcon;
  items: SidebarItem[];
}

export type SidebarItems = SidebarGroupType[];
