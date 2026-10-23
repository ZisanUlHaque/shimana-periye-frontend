import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { Role } from "@/types/role.enum";
import { ReactNode } from "react";

export default function MentorLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard roles={[Role.MENTOR]}>
      <DashboardShell role={Role.MENTOR}>{children}</DashboardShell>
    </RoleGuard>
  );
}
