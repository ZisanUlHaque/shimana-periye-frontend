import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { ReactNode } from "react";

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard roles={["MENTOR"]}>
      <DashboardShell role="MENTOR">{children}</DashboardShell>
    </RoleGuard>
  );
}