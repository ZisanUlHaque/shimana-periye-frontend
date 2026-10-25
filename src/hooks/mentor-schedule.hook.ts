import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import {
  getAvailableSchedules,
  getMySchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  bookInterviewSlot,
  getMyBookings,
} from "@/api/mentor-schedule.api";
import type {
  ICreateSchedulePayload,
  IUpdateSchedulePayload,
  IBookSchedulePayload,
} from "@/types/mentor-schedule.type";

export const MENTOR_SCHEDULE_KEYS = {
  available: ["mentor-schedules", "available"] as const,
  mySchedules: ["mentor-schedules", "me"] as const,
  myBookings: ["mentor-schedules", "bookings", "me"] as const,
};

export function useAvailableSchedules(params?: Record<string, string>) {
  return useQuery({
    queryKey: [...MENTOR_SCHEDULE_KEYS.available, params],
    queryFn: () => getAvailableSchedules(params),
  });
}

export function useMyMentorSchedules() {
  return useQuery({
    queryKey: MENTOR_SCHEDULE_KEYS.mySchedules,
    queryFn: getMySchedules,
  });
}

export function useMyBookings() {
  return useQuery({
    queryKey: MENTOR_SCHEDULE_KEYS.myBookings,
    queryFn: getMyBookings,
  });
}

export function useCreateMentorSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateSchedulePayload) => createSchedule(payload),
    onSuccess: () => {
      toast.add({ title: "Availability slot created!", type: "success" });
      queryClient.invalidateQueries({ queryKey: MENTOR_SCHEDULE_KEYS.mySchedules });
      queryClient.invalidateQueries({ queryKey: MENTOR_SCHEDULE_KEYS.available });
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to create slot",
        description: err?.message,
        type: "error",
      });
    },
  });
}

export function useBookInterviewSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IBookSchedulePayload) => bookInterviewSlot(payload),
    onSuccess: () => {
      toast.add({ title: "Session successfully booked!", type: "success" });
      queryClient.invalidateQueries({ queryKey: MENTOR_SCHEDULE_KEYS.myBookings });
      queryClient.invalidateQueries({ queryKey: MENTOR_SCHEDULE_KEYS.available });
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to book session",
        description: err?.message,
        type: "error",
      });
    },
  });
}

export function useDeleteMentorSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSchedule(id),
    onSuccess: () => {
      toast.add({ title: "Schedule slot removed", type: "success" });
      queryClient.invalidateQueries({ queryKey: MENTOR_SCHEDULE_KEYS.mySchedules });
      queryClient.invalidateQueries({ queryKey: MENTOR_SCHEDULE_KEYS.available });
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to delete slot",
        description: err?.message,
        type: "error",
      });
    },
  });
}
