import { useQuery } from "@tanstack/react-query";
import {
  getStudentDashboard,
  getMentorDashboard,
  getAdminDashboard,
} from "@/api/dashboard.api";

export const DASHBOARD_KEYS = {
  student: ["dashboard", "student"] as const,
  mentor: ["dashboard", "mentor"] as const,
  admin: ["dashboard", "admin"] as const,
};

export function useStudentDashboard() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.student,
    queryFn: getStudentDashboard,
  });
}

export function useMentorDashboard() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.mentor,
    queryFn: getMentorDashboard,
  });
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.admin,
    queryFn: getAdminDashboard,
  });
}
