"use client";

import {
  useGetMyRecommendationRequests,
  useDeleteRecommendationRequest,
  useUpdateRecommendationStatus,
} from "@/hooks/recommendation-request.hook";
import { RecommendationRequestDialog } from "./recommendation-request-dialog";
import { ListState } from "@/components/shared/list-state";
import { MailCheck, Calendar, Trash2, Mail } from "lucide-react";
import type {
  IRecommendationRequest,
  RecommendationStatus,
} from "@/types/recommendation-request.type";
import { Button } from "@/components/ui/button";

const STATUSES: { value: RecommendationStatus; label: string }[] = [
  { value: "NOT_REQUESTED", label: "Not Requested" },
  { value: "REQUESTED", label: "Requested" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "DECLINED", label: "Declined" },
];

export function RecommendationRequestList() {
  const { data, isLoading, isError } = useGetMyRecommendationRequests();
  const requests: IRecommendationRequest[] = data?.data ?? [];

  const { mutate: deleteReq } = useDeleteRecommendationRequest();
  const { mutate: updateStatus } = useUpdateRecommendationStatus();

  return (
    <ListState
      isLoading={isLoading}
      isError={isError}
      items={requests}
      emptyIcon={MailCheck}
      emptyTitle="No recommendation requests tracked"
      emptyDescription="Track references and recommendation letters requested from professors."
      emptyAction={<RecommendationRequestDialog />}
      errorMessage="Failed to load recommendation requests."
    >
      {(items) => (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((req) => (
            <div
              key={req.id}
              className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MailCheck className="size-4.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-foreground truncate">
                      {req.professorName}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {req.application?.opportunity?.title ?? "General Reference"}
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteReq(req.id)}
                  className="size-7 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>

              {req.professorEmail && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Mail className="size-3" />
                  <span className="truncate">{req.professorEmail}</span>
                </div>
              )}

              {req.followUpAt && (
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Calendar className="size-3" />
                  <span>
                    Follow-up: {new Date(req.followUpAt).toLocaleDateString()}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-border/60 pt-3">
                <span className="text-xs text-muted-foreground">Status:</span>
                <select
                  value={req.status}
                  onChange={(e) =>
                    updateStatus({
                      id: req.id,
                      status: e.target.value as RecommendationStatus,
                    })
                  }
                  className="rounded-md border border-input bg-transparent px-2 py-0.5 text-xs font-semibold"
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </ListState>
  );
}
