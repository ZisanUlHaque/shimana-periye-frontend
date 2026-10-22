import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; direction: "up" | "down" };
  accent?: "primary" | "blue" | "amber" | "violet";
}

const accentMap = {
  primary: "from-primary/15 to-primary/5 text-primary",
  blue: "from-blue-500/15 to-blue-500/5 text-blue-600",
  amber: "from-amber-500/15 to-amber-500/5 text-amber-600",
  violet: "from-violet-500/15 to-violet-500/5 text-violet-600",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  accent = "primary",
}: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      {/* decorative glow */}
      <div
        className={`pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-gradient-to-br opacity-60 blur-2xl transition-opacity group-hover:opacity-90 ${accentMap[accent]}`}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            {value}
          </p>
        </div>
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm ${accentMap[accent]}`}
        >
          <Icon className="size-5" />
        </div>
      </div>

      {trend && (
        <div className="relative mt-3 flex items-center gap-1">
          {trend.direction === "up" ? (
            <TrendingUp className="size-3.5 text-emerald-500" />
          ) : (
            <TrendingDown className="size-3.5 text-red-500" />
          )}
          <span
            className={`text-xs font-semibold ${
              trend.direction === "up" ? "text-emerald-500" : "text-red-500"
            }`}
          >
            {trend.value}
          </span>
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
      )}
    </div>
  );
}