import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { Role } from "@/types/role.enum";
import { ReactNode } from "react";

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard roles={[Role.ADMIN]}>
      <DashboardShell role={Role.ADMIN}>{children}</DashboardShell>
    </RoleGuard>
  );
}
