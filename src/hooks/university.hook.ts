import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUniversity,
  deleteUniversity,
  getAllUniversities,
  getUniversityById,
  updateUniversity,
} from "@/api/university.api";
import type {
  ICreateUniversityPayload,
  IUniversity,
  IUniversityDetail,
  IUniversityListParams,
  IUpdateUniversityPayload,
} from "@/types/university.type";
import type { IApiListResponse } from "@/types/api.type";
import { toast } from "@/components/ui/toast";

export const UNIVERSITIES_QUERY_KEY = (params?: IUniversityListParams) =>
  ["universities", params ?? {}] as const;

export const UNIVERSITY_QUERY_KEY = (id: string) => ["university", id] as const;

export const useUniversities = (params?: IUniversityListParams) =>
  useQuery({
    queryKey: UNIVERSITIES_QUERY_KEY(params),
    queryFn: async () => {
      const res = (await getAllUniversities(params)) as IApiListResponse<IUniversity>;
      return { data: res.data, meta: res.meta };
    },
  });

export const useUniversity = (id: string) =>
  useQuery({
    queryKey: UNIVERSITY_QUERY_KEY(id),
    queryFn: async () => {
      const res = await getUniversityById(id);
      return res.data as IUniversityDetail;
    },
    enabled: !!id,
  });

export const useCreateUniversity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateUniversityPayload) => createUniversity(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["universities"] });
      toast.add({ title: "University created", type: "success" });
    },
  });
};

export const useUpdateUniversity = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IUpdateUniversityPayload) => updateUniversity(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["universities"] });
      queryClient.invalidateQueries({ queryKey: UNIVERSITY_QUERY_KEY(id) });
      toast.add({ title: "University updated", type: "success" });
    },
  });
};

export const useDeleteUniversity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUniversity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["universities"] });
      toast.add({ title: "University deleted", type: "success" });
    },
  });
};