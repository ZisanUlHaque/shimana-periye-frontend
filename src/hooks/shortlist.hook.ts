import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToShortlist,
  compareShortlistItems,
  getMyShortlist,
  getStudentShortlistForMentor,
  removeFromShortlist,
  updateShortlistNotes,
} from "@/api/shortlist.api";
import type {
  ICreateShortlistPayload,
  IShortlistCompareItem,
  IShortlistCreateResult,
  IShortlistListItem,
  IShortlistMentorViewItem,
  IUpdateShortlistPayload,
} from "@/types/shortlist.type";
import { toast } from "@/components/ui/toast";

export const MY_SHORTLIST_QUERY_KEY = ["my-shortlist"] as const;
export const SHORTLIST_COMPARE_QUERY_KEY = (ids: string[]) =>
  ["shortlist-compare", ids] as const;
export const STUDENT_SHORTLIST_FOR_MENTOR_QUERY_KEY = (studentProfileId: string) =>
  ["student-shortlist", studentProfileId] as const;

export const useMyShortlist = () =>
  useQuery({
    queryKey: MY_SHORTLIST_QUERY_KEY,
    queryFn: async () => {
      const res = await getMyShortlist();
      return res.data as IShortlistListItem[];
    },
  });

// Derived helper — is a given opportunity already shortlisted?
export const useIsOpportunityShortlisted = (opportunityId: string) => {
  const { data, isLoading } = useMyShortlist();
  const entry = data?.find((item) => item.opportunity.id === opportunityId);
  return { isShortlisted: !!entry, shortlistId: entry?.shortlistId, isLoading };
};

export const useShortlistCompare = (ids: string[]) =>
  useQuery({
    queryKey: SHORTLIST_COMPARE_QUERY_KEY(ids),
    queryFn: async () => {
      const res = await compareShortlistItems(ids);
      return res.data as IShortlistCompareItem[];
    },
    enabled: ids.length >= 2 && ids.length <= 5,
  });

export const useStudentShortlistForMentor = (studentProfileId: string) =>
  useQuery({
    queryKey: STUDENT_SHORTLIST_FOR_MENTOR_QUERY_KEY(studentProfileId),
    queryFn: async () => {
      const res = await getStudentShortlistForMentor(studentProfileId);
      return res.data as IShortlistMentorViewItem[];
    },
    enabled: !!studentProfileId,
  });

export const useAddToShortlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateShortlistPayload) => addToShortlist(payload),
    onSuccess: (res) => {
      const result = res.data as IShortlistCreateResult;
      queryClient.invalidateQueries({ queryKey: MY_SHORTLIST_QUERY_KEY });

      if (result.deadlinePassed) {
        toast.add({
          title: "Added to shortlist",
          description: "Heads up — this opportunity's deadline has already passed.",
          type: "warning",
        });
      } else {
        toast.add({ title: "Added to shortlist", type: "success" });
      }
    },
    onError: () => {
      toast.add({
        title: "Could not add to shortlist",
        description: "Please try again.",
        type: "error",
      });
    },
  });
};

export const useUpdateShortlistNotes = (shortlistId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IUpdateShortlistPayload) =>
      updateShortlistNotes(shortlistId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_SHORTLIST_QUERY_KEY });
      toast.add({ title: "Notes updated", type: "success" });
    },
  });
};

export const useRemoveFromShortlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (shortlistId: string) => removeFromShortlist(shortlistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_SHORTLIST_QUERY_KEY });
      toast.add({ title: "Removed from shortlist", type: "success" });
    },
  });
};