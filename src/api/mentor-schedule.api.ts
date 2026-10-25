import apiClient from "@/lib/apiClient";
import type { IApiResponse } from "@/types/api.type";
import type {
  IMentorSchedule,
  IBooking,
  ICreateSchedulePayload,
  IUpdateSchedulePayload,
  IBookSchedulePayload,
} from "@/types/mentor-schedule.type";

export function getAvailableSchedules(params?: Record<string, string>) {
  return apiClient<IApiResponse<IMentorSchedule[]>>("/mentor-schedules/available", {
    params,
  });
}

export function getMySchedules() {
  return apiClient<IApiResponse<IMentorSchedule[]>>("/mentor-schedules/me");
}

export function createSchedule(payload: ICreateSchedulePayload) {
  return apiClient<IApiResponse<IMentorSchedule>>("/mentor-schedules", {
    method: "POST",
    body: payload,
  });
}

export function updateSchedule(id: string, payload: IUpdateSchedulePayload) {
  return apiClient<IApiResponse<IMentorSchedule>>(`/mentor-schedules/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteSchedule(id: string) {
  return apiClient<IApiResponse<null>>(`/mentor-schedules/${id}`, {
    method: "DELETE",
  });
}

export function bookInterviewSlot(payload: IBookSchedulePayload) {
  return apiClient<IApiResponse<IBooking>>("/mentor-schedules/book", {
    method: "POST",
    body: payload,
  });
}

export function getMyBookings() {
  return apiClient<IApiResponse<IBooking[]>>("/mentor-schedules/bookings/me");
}
