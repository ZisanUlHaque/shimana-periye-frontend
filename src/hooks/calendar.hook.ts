import { useMutation, useQuery } from "@tanstack/react-query";
import { downloadCalendarIcs, getCalendarEvents } from "@/api/calendar.api";
import { ICalendarEvent } from "@/types/calendar.type";
import { toast } from "@/components/ui/toast";

export const CALENDAR_EVENTS_QUERY_KEY = ["calendar-events"] as const;

export const useCalendarEvents = () =>
  useQuery({
    queryKey: CALENDAR_EVENTS_QUERY_KEY,
    queryFn: async () => {
      const res = await getCalendarEvents();
      return res.data as ICalendarEvent[];
    },
  });

export const useExportCalendarIcs = () =>
  useMutation({
    mutationFn: async () => {
      const blob = await downloadCalendarIcs();
      const url = window.URL.createObjectURL(blob as Blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "gradpath-calendar.ics";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast.add({
        title: "Calendar exported",
        description: "Your .ics file has been downloaded.",
        type: "success",
      });
    },
  });