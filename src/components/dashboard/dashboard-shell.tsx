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
import { Bell, Search } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

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

          <div className="ml-auto flex items-center gap-2">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-56 rounded-full border border-border bg-muted/50 pl-9 pr-4 text-xs outline-none transition-all focus:w-64 focus:border-primary/40 focus:bg-background focus:ring-2 focus:ring-primary/10"
              />
            </div>

            {/* Notifications */}
            <button
              type="button"
              className="relative flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Bell className="size-4" />
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />
            </button>
          </div>
        </header>

        {/* ---------- Page Content ---------- */}
        <main className="flex flex-1 flex-col">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}