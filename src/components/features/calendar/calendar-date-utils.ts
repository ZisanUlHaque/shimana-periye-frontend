export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatEventDateLabel(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  if (isSameDay(date, now)) return "Today";
  if (isSameDay(date, tomorrow)) return "Tomorrow";

  return date.toLocaleDateString("en-US", {
    timeZone: "Asia/Dhaka",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function formatEventTime(dateStr: string, allDay?: boolean) {
  if (allDay) return "All day";
  return (
    new Date(dateStr).toLocaleTimeString("en-US", {
      timeZone: "Asia/Dhaka",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }) + " (BST)"
  );
}

export function dateKey(dateStr: string) {
  // Format key based on Bangladesh Time so groupings are timezone-accurate
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" }); // YYYY-MM-DD
}
