import apiClient from "@/lib/apiClient";

export function getCalendarEvents() {
  return apiClient("/calendar/events");
}

export function downloadCalendarIcs() {
  return apiClient("/calendar/export.ics", {
    responseType: "blob",
  });
}
