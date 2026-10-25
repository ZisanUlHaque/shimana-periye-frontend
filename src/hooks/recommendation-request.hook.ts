import {
  createRecommendationRequest,
  deleteRecommendationRequest,
  getMyRecommendationRequests,
  updateRecommendationRequest,
  updateRecommendationStatus,
} from "@/api/recommendation-request.api";
import { toast } from "@/components/ui/toast";
import type {
  ICreateRecommendationRequestPayload,
  IUpdateRecommendationRequestParams,
  IUpdateRecommendationStatusParams,
} from "@/types/recommendation-request.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const RECOMMENDATION_REQUESTS_QUERY_KEY = ["recommendation-requests"];

export function useGetMyRecommendationRequests() {
  return useQuery({
    queryKey: RECOMMENDATION_REQUESTS_QUERY_KEY,
    queryFn: getMyRecommendationRequests,
  });
}

export function useCreateRecommendationRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateRecommendationRequestPayload) =>
      createRecommendationRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: RECOMMENDATION_REQUESTS_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: ["readiness"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.add({
        title: "Recommendation requested",
        description: "Your reference request has been logged.",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to create request",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}

export function useUpdateRecommendationRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: IUpdateRecommendationRequestParams) =>
      updateRecommendationRequest(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: RECOMMENDATION_REQUESTS_QUERY_KEY,
      });
      toast.add({
        title: "Request updated",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to update",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}

export function useUpdateRecommendationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: IUpdateRecommendationStatusParams) =>
      updateRecommendationStatus(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: RECOMMENDATION_REQUESTS_QUERY_KEY,
      });
      toast.add({
        title: "Status updated",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to update status",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}

export function useDeleteRecommendationRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRecommendationRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: RECOMMENDATION_REQUESTS_QUERY_KEY,
      });
      toast.add({
        title: "Request deleted",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to delete request",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}
