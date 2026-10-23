"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  User,
  GraduationCap,
  Briefcase,
  BookOpen,
  Award,
} from "lucide-react";

const tabs = [
  { title: "Profile Info", href: "/student/profile", icon: User },
  {
    title: "Academic Records",
    href: "/student/profile/academic-records",
    icon: GraduationCap,
  },
  {
    title: "Experience",
    href: "/student/profile/experiences",
    icon: Briefcase,
  },
  {
    title: "Publications",
    href: "/student/profile/publications",
    icon: BookOpen,
  },
  {
    title: "Test Scores",
    href: "/student/profile/test-records",
    icon: Award,
  },
];

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <nav className="flex flex-wrap gap-2 border-b border-border/60 pb-3">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-3.5" />
              <span>{tab.title}</span>
            </Link>
          );
        })}
      </nav>
      {children}
    </div>
  );
}
