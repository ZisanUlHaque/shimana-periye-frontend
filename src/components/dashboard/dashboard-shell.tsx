"use client";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { Role } from "@/types";
import { DashboardSidebar } from "./dashboard-sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Fragment } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ReminderBell } from "@/components/features/reminder/reminder-bell";
import { DashboardSearch } from "./dashboard-search";

function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center gap-1.5 text-sm">
      {segments.map((seg, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/");
        const isLast = i === segments.length - 1;
        const label = seg
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        return (
          <Fragment key={href}>
            {i > 0 && <span className="text-muted-foreground/40">/</span>}
            {isLast ? (
              <span className="font-semibold text-foreground">{label}</span>
            ) : (
              <Link
                href={href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}

export default function DashboardShell({
  children,
  role,
}: {
  children: ReactNode;
  role: Role;
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar role={role} />
      <SidebarInset className="bg-muted/30">
        {/* ---------- Top Bar ---------- */}
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-5" />
          <Breadcrumbs />

          <div className="ml-auto flex items-center gap-3">
            {/* Functional Command Palette & Search */}
            <DashboardSearch role={role} />

            {/* Dark / Light Mode Switcher */}
            <ThemeToggle />

            {/* Live Notifications & Reminders */}
            <ReminderBell />
          </div>
        </header>

        {/* ---------- Page Content ---------- */}
        <main className="flex flex-1 flex-col">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
