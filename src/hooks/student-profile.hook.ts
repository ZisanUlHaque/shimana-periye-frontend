import {
  getMyStudentProfile,
  getMyStudentProfileCompleteness,
  updateMyStudentProfile,
} from "@/api/student-profile.api";
import { toast } from "@/components/ui/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const STUDENT_PROFILE_QUERY_KEY = ["student-profile", "me"];
export const STUDENT_COMPLETENESS_QUERY_KEY = ["student-profile", "completeness"];

export function useGetMyStudentProfile() {
  return useQuery({
    queryKey: STUDENT_PROFILE_QUERY_KEY,
    queryFn: getMyStudentProfile,
  });
}

export function useGetMyStudentProfileCompleteness() {
  return useQuery({
    queryKey: STUDENT_COMPLETENESS_QUERY_KEY,
    queryFn: getMyStudentProfileCompleteness,
  });
}

export function useUpdateMyStudentProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyStudentProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENT_PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: STUDENT_COMPLETENESS_QUERY_KEY,
      });
      toast.add({
        title: "Profile updated",
        description: "Your interests and skills have been updated.",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to update profile",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}
