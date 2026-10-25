"use client";

import {
  useMyReminders,
  useUnreadReminderCount,
  useMarkReminderAsRead,
  useMarkAllRemindersAsRead,
  useDeleteReminder,
} from "@/hooks/reminder.hook";
import {
  Bell,
  CheckCircle2,
  Trash2,
  CheckCheck,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ReminderBell() {
  const { data: countData } = useUnreadReminderCount();
  const { data: remindersData } = useMyReminders();
  const { mutate: markRead } = useMarkReminderAsRead();
  const { mutate: markAllRead } = useMarkAllRemindersAsRead();
  const { mutate: removeReminder } = useDeleteReminder();

  const rawUnread = countData?.data;
  const unreadCount =
    typeof rawUnread === "number"
      ? rawUnread
      : (rawUnread as any)?.unreadCount ?? 0;

  const rawReminders = remindersData?.data;
  const reminders: any[] = Array.isArray(rawReminders)
    ? rawReminders
    : Array.isArray((rawReminders as any)?.data)
    ? (rawReminders as any).data
    : [];

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="ghost" size="icon" className="relative size-9">
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
            )}
          </Button>
        }
      />
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b border-border/60 p-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-foreground">
              Notifications & Reminders
            </span>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => markAllRead()}
              className="h-6 gap-1 text-[11px]"
            >
              <CheckCheck className="size-3" />
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-border/40">
          {reminders.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              No notifications yet.
            </div>
          ) : (
            reminders.slice(0, 8).map((r: any) => (
              <div
                key={r.id}
                className={`flex items-start justify-between gap-2 p-3 transition-colors ${
                  !r.readAt ? "bg-primary/5" : "bg-card"
                }`}
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => !r.readAt && markRead(r.id)}
                >
                  <h5 className="text-xs font-semibold text-foreground">
                    {r.title}
                  </h5>
                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                    {r.message}
                  </p>
                  <span className="text-[10px] text-muted-foreground/75 mt-1 block">
                    {new Date(r.scheduledFor).toLocaleDateString()}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="size-6 text-muted-foreground hover:text-destructive"
                  onClick={() => removeReminder(r.id)}
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
