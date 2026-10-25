import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import {
  getMyReminders,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteReminder,
} from "@/api/reminder.api";

export const REMINDER_KEYS = {
  my: ["reminders", "my"] as const,
  unreadCount: ["reminders", "unreadCount"] as const,
};

export function useMyReminders() {
  return useQuery({
    queryKey: REMINDER_KEYS.my,
    queryFn: getMyReminders,
    refetchInterval: 30000,
  });
}

export function useUnreadReminderCount() {
  return useQuery({
    queryKey: REMINDER_KEYS.unreadCount,
    queryFn: getUnreadCount,
    refetchInterval: 30000,
  });
}

export function useMarkReminderAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REMINDER_KEYS.my });
      queryClient.invalidateQueries({ queryKey: REMINDER_KEYS.unreadCount });
    },
  });
}

export function useMarkAllRemindersAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markAllAsRead(),
    onSuccess: () => {
      toast.add({ title: "All reminders marked as read", type: "success" });
      queryClient.invalidateQueries({ queryKey: REMINDER_KEYS.my });
      queryClient.invalidateQueries({ queryKey: REMINDER_KEYS.unreadCount });
    },
  });
}

export function useDeleteReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteReminder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REMINDER_KEYS.my });
      queryClient.invalidateQueries({ queryKey: REMINDER_KEYS.unreadCount });
    },
  });
}
