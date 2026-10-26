import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateProfile,
  updateUserRole,
  updateUserStatus,
  uploadProfileImage,
} from "@/api/user.api";
import { toast } from "@/components/ui/toast";
import type {
  IUpdateProfilePayload,
  IUpdateUserRolePayload,
  IUpdateUserStatusPayload,
  IUserFilterParams,
} from "@/types/user.type";
import { DASHBOARD_KEYS } from "./dashboard.hook";

export const USER_KEYS = {
  all: ["users"] as const,
  list: (params?: IUserFilterParams) => ["users", "list", params] as const,
  detail: (id: string) => ["users", "detail", id] as const,
};

export function useUsers(params?: IUserFilterParams) {
  return useQuery({
    queryKey: USER_KEYS.list(params),
    queryFn: () => getAllUsers(params),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: USER_KEYS.detail(id),
    queryFn: () => getUserById(id),
    enabled: Boolean(id),
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: IUpdateUserStatusPayload;
    }) => updateUserStatus(id, payload),
    onSuccess: (_, variables) => {
      toast.add({
        title: `User ${variables.payload.status === "ACTIVE" ? "activated" : "blocked"} successfully`,
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.admin });
    },
    onError: (err: Error) => {
      toast.add({
        title: "Status update failed",
        description: err?.message,
        type: "error",
      });
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: IUpdateUserRolePayload;
    }) => updateUserRole(id, payload),
    onSuccess: (_, variables) => {
      toast.add({
        title: `User role updated to ${variables.payload.role}`,
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
    },
    onError: (err: Error) => {
      toast.add({
        title: "Role update failed",
        description: err?.message,
        type: "error",
      });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IUpdateProfilePayload) => updateProfile(payload),
    onSuccess: () => {
      toast.add({
        title: "Profile updated successfully",
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
    },
    onError: (err: Error) => {
      toast.add({
        title: "Update failed",
        description: err?.message,
        type: "error",
      });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      toast.add({
        title: "User deleted successfully",
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.admin });
    },
    onError: (err: Error) => {
      toast.add({
        title: "Delete failed",
        description: err?.message,
        type: "error",
      });
    },
  });
}

export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadProfileImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
      toast.add({
        title: "Profile image updated",
        type: "success",
      });
    },
    onError: (err: Error) => {
      toast.add({
        title: "Upload failed",
        description: err?.message,
        type: "error",
      });
    },
  });
};
