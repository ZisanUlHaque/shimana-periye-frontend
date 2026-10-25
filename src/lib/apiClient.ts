import { ofetch } from "ofetch";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
  onResponseError({ response, error }) {
    // 1. Extract backend error message if returned in standard response format
    const data = response?._data;
    const backendMessage = data?.message || data?.error;

    if (backendMessage && typeof backendMessage === "string") {
      error.message = backendMessage;
      return;
    }

    // 2. Extract validation error sources if provided (e.g. Zod / Prisma issues)
    if (data?.errorSources && Array.isArray(data.errorSources) && data.errorSources.length > 0) {
      error.message = data.errorSources
        .map((s: any) => s.message || `${s.path} is invalid`)
        .join(", ");
      return;
    }

    // 3. User-friendly fallbacks based on HTTP status code (stripping raw URLs)
    const status = response?.status;
    if (status === 400) {
      error.message = "Bad request. Please verify your submitted information.";
    } else if (status === 401) {
      error.message = "Session expired or unauthorized. Please log in again.";
    } else if (status === 403) {
      error.message = "Access restricted. You do not have permission for this resource.";
    } else if (status === 404) {
      error.message = "Requested resource could not be found.";
    } else if (status === 409) {
      error.message = "Conflict detected. This action has already been completed.";
    } else if (status === 422) {
      error.message = "Validation error. Please verify your data and try again.";
    } else if (status && status >= 500) {
      error.message = "Server encountered an error. Please try again in a moment.";
    } else {
      // Clean any accidental URLs or methods in the error string
      let rawMsg = error?.message || "An unexpected error occurred.";
      rawMsg = rawMsg
        .replace(/https?:\/\/[^\s\)]+/gi, "")
        .replace(/\[(GET|POST|PUT|PATCH|DELETE)\]\s*""?:?/gi, "")
        .replace(/\(\s*\)/g, "")
        .trim();
      error.message = rawMsg || "Network request failed. Please check your connection.";
    }
  },
});

export default apiClient;
