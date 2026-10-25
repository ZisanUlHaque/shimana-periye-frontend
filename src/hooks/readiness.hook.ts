import { useQuery } from "@tanstack/react-query";
import { getMyReadiness, getReadinessForMentor } from "@/api/readiness.api";

export const READINESS_KEYS = {
  me: ["readiness", "me"] as const,
  mentor: (studentProfileId: string) =>
    ["readiness", "student", studentProfileId] as const,
};

export function useMyReadiness() {
  return useQuery({
    queryKey: READINESS_KEYS.me,
    queryFn: getMyReadiness,
  });
}

export function useReadinessForMentor(studentProfileId: string) {
  return useQuery({
    queryKey: READINESS_KEYS.mentor(studentProfileId),
    queryFn: () => getReadinessForMentor(studentProfileId),
    enabled: Boolean(studentProfileId),
  });
}
