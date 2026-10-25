import apiClient from "@/lib/apiClient";
import type { IApiResponse } from "@/types/api.type";
import type { IReminder } from "@/types/reminder.type";

export function getMyReminders() {
  return apiClient<IApiResponse<IReminder[]>>("/reminders");
}

export function getUnreadCount() {
  return apiClient<IApiResponse<{ unreadCount: number }>>("/reminders/unread-count");
}

export function markAsRead(id: string) {
  return apiClient<IApiResponse<IReminder>>(`/reminders/${id}/read`, {
    method: "PATCH",
  });
}

export function markAllAsRead() {
  return apiClient<IApiResponse<{ count: number }>>("/reminders/read-all", {
    method: "PATCH",
  });
}

export function deleteReminder(id: string) {
  return apiClient<IApiResponse<null>>(`/reminders/${id}`, {
    method: "DELETE",
  });
}
