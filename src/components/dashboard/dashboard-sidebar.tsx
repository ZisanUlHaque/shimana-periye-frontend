"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { adminRoutes } from "@/routes/admin.routes";
import { mentorRoutes } from "@/routes/mentor.routes";
import { studentRoutes } from "@/routes/student.routes";
import { Role } from "@/types";
import { SidebarItems } from "@/types/sidebar.type";
import { useGetMe, useLogout } from "@/hooks";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ChevronsUpDown, Sparkles, Plane } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "@/components/ui/toast";

const sidebarRoutes: Partial<Record<Role, SidebarItems>> = {
  ADMIN: adminRoutes,
  STUDENT: studentRoutes,
  MENTOR: mentorRoutes,
};

export function DashboardSidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const router = useRouter();
  const routes: SidebarItems = sidebarRoutes[role] || [];

  const { data: userData } = useGetMe();
  const user = userData?.data?.user || userData?.data;
  const { mutate: logout } = useLogout();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout(undefined as any, {
      onSuccess: () => {
        toast.add({ title: "Logged out", type: "success" });
        router.push("/login");
      },
    });
  };

  return (
    <Sidebar className="border-sidebar-border/60">
      {/* ---------- Brand Header ---------- */}
      <SidebarHeader className="border-b border-sidebar-border/60 px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 ring-1 ring-primary/10">
            <Image
              src="/logo1.png"
              alt="ShimanaPeriye"
              width={28}
              height={28}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-bold tracking-tight text-sidebar-foreground">
              ShimanaPeriye
            </span>
            <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
              <Plane className="size-2.5 text-primary" />
              {role.charAt(0) + role.slice(1).toLowerCase()} Portal
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* ---------- Nav Groups ---------- */}
      <SidebarContent className="gap-0 px-2 py-3">
        {routes.map((group, idx) => (
          <SidebarGroup key={group.title} className="py-2">
            <SidebarGroupLabel className="px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/70">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent className="mt-1">
              <SidebarMenu className="gap-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.url;
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        render={<Link href={item.url} />}
                        isActive={isActive}
                        className={`group relative h-9 gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(16,185,129,0.15)]"
                            : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-primary" />
                        )}
                        {Icon && (
                          <Icon
                            className={`size-4 shrink-0 transition-colors ${
                              isActive
                                ? "text-primary"
                                : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
                            }`}
                          />
                        )}
                        <span className="truncate">{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
            {idx < routes.length - 1 && (
              <SidebarSeparator className="mx-0 mt-3" />
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* ---------- User Footer ---------- */}
      <SidebarFooter className="border-t border-sidebar-border/60 p-2">
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((p) => !p)}
            className="flex w-full items-center gap-2.5 rounded-xl p-2 text-left transition-colors hover:bg-sidebar-accent"
          >
   <div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary/70 text-xs font-bold text-primary-foreground shadow-sm">
  {user?.imageUrl ? (
    <Image
      src={user.imageUrl}
      alt={user?.name ?? "User"}
      fill
      sizes="36px"
      className="object-cover"
    />
  ) : (
    user?.name?.[0]?.toUpperCase() || "U"
  )}
</div>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-xs font-semibold text-sidebar-foreground">
                {user?.name || "Loading..."}
              </span>
              <span className="truncate text-[11px] text-muted-foreground">
                {user?.email}
              </span>
            </div>
            <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
          </button>

          {menuOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-full rounded-xl border border-border bg-popover p-1.5 shadow-xl animate-in fade-in-0 zoom-in-95">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  const profilePath =
                    role === "STUDENT"
                      ? "/student/profile"
                      : role === "MENTOR"
                        ? "/mentor/profile"
                        : "/admin/profile";
                  router.push(profilePath);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-foreground hover:bg-muted"
              >
                View Profile
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-destructive hover:bg-destructive/10"
              >
                <LogOut className="size-3.5" />
                Log out
              </button>
            </div>
          )}
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
