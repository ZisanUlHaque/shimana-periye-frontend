import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { Role } from "@/types/role.enum";
import { ReactNode } from "react";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard roles={[Role.STUDENT]}>
      <DashboardShell role={Role.STUDENT}>{children}</DashboardShell>
    </RoleGuard>
  );
}
