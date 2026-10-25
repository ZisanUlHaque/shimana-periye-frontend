import apiClient from "@/lib/apiClient";
import type { IApiResponse } from "@/types/api.type";
import type {
  IStudentDashboard,
  IMentorDashboard,
  IAdminDashboard,
} from "@/types/dashboard.type";

export function getStudentDashboard() {
  return apiClient<IApiResponse<IStudentDashboard>>("/dashboard/student");
}

export function getMentorDashboard() {
  return apiClient<IApiResponse<IMentorDashboard>>("/dashboard/mentor");
}

export function getAdminDashboard() {
  return apiClient<IApiResponse<IAdminDashboard>>("/dashboard/admin");
}
