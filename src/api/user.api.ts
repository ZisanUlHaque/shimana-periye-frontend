import apiClient from "@/lib/apiClient";
import type { IApiResponse } from "@/types/api.type";
import type {
  IUpdateProfilePayload,
  IUpdateUserRolePayload,
  IUpdateUserStatusPayload,
  IUser,
  IUserFilterParams,
} from "@/types/user.type";

export function getAllUsers(params?: IUserFilterParams) {
  const cleanParams: Record<string, unknown> = {};
  if (params?.searchTerm) cleanParams.searchTerm = params.searchTerm;
  if (params?.role && params.role !== "ALL") cleanParams.role = params.role;
  if (params?.status && params.status !== "ALL")
    cleanParams.status = params.status;
  if (params?.page) cleanParams.page = params.page;
  if (params?.limit) cleanParams.limit = params.limit;

  return apiClient<IApiResponse<IUser[]>>("/user", {
    method: "GET",
    params: cleanParams,
  });
}

export function getUserById(id: string) {
  return apiClient<IApiResponse<IUser>>(`/user/${id}`, {
    method: "GET",
  });
}

export function updateUserStatus(
  id: string,
  payload: IUpdateUserStatusPayload,
) {
  return apiClient<IApiResponse<IUser>>(`/user/${id}/status`, {
    method: "PATCH",
    body: payload,
  });
}

export function updateUserRole(id: string, payload: IUpdateUserRolePayload) {
  return apiClient<IApiResponse<IUser>>(`/user/${id}/role`, {
    method: "PATCH",
    body: payload,
  });
}

export function updateProfile(payload: IUpdateProfilePayload) {
  return apiClient<IApiResponse<IUser>>("/user/profile", {
    method: "PATCH",
    body: payload,
  });
}

export function deleteUser(id: string) {
  return apiClient<IApiResponse<{ id: string }>>(`/user/${id}`, {
    method: "DELETE",
  });
}

export function uploadProfileImage(file: File) {
  const formData = new FormData();
  formData.append("profileImage", file);

  return apiClient<IApiResponse<IUser>>("/user/profile-image", {
    method: "PATCH",
    body: formData,
  });
}
