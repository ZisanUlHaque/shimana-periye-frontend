import { cn } from "@/lib/utils";

export interface StatusMeta {
  label: string;
  className: string;
}

interface StatusBadgeProps<T extends string> {
  value: T;
  meta: Record<T, StatusMeta | null>;
}

export function StatusBadge<T extends string>({ value, meta }: StatusBadgeProps<T>) {
  const m = meta[value];
  if (!m) return null;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold",
        m.className
      )}
    >
      {m.label}
    </span>
  );
}