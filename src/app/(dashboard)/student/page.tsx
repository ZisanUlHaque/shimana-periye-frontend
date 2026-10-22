import { PageHeader } from "@/components/layout/public/page-header";
import { StatCard } from "@/components/shared/stat-card";
import {
  FileClock,
  Bookmark,
  Gauge,
  CalendarClock,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export default function StudentDashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <PageHeader
        title="Welcome back 👋"
        description="Here's an overview of your application journey."
      />

      {/* TODO: GET /api/v1/dashboard/student */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Applications"
          value="4"
          icon={FileClock}
          trend={{ value: "+2", direction: "up" }}
          accent="primary"
        />
        <StatCard
          label="Shortlisted"
          value="12"
          icon={Bookmark}
          trend={{ value: "+5", direction: "up" }}
          accent="blue"
        />
        <StatCard
          label="Readiness Score"
          value="78%"
          icon={Gauge}
          trend={{ value: "+6%", direction: "up" }}
          accent="violet"
        />
        <StatCard
          label="Upcoming Deadlines"
          value="3"
          icon={CalendarClock}
          trend={{ value: "-1", direction: "down" }}
          accent="amber"
        />
      </div>

      {/* Placeholder content sections for future widgets */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">
              Recent Applications
            </h3>
            <Link
              href="/student/applications"
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              View all <ArrowUpRight className="size-3" />
            </Link>
          </div>
          <div className="mt-4 flex h-40 items-center justify-center rounded-xl border border-dashed border-border text-xs text-muted-foreground">
            Application list will appear here
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-bold text-foreground">
            Upcoming Tasks
          </h3>
          <div className="mt-4 flex h-40 items-center justify-center rounded-xl border border-dashed border-border text-xs text-muted-foreground">
            Task list will appear here
          </div>
        </div>
      </div>
    </div>
  );
}