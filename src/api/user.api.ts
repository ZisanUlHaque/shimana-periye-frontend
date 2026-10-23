import apiClient from "@/lib/apiClient";

export function uploadProfileImage(file: File) {
  const formData = new FormData();
  formData.append("profileImage", file);

  return apiClient("/user/profile-image", {
    method: "PATCH",
    body: formData,
  });
}