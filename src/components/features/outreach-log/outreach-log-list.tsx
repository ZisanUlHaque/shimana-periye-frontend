"use client";

import { useGetMyOutreachLogs, useDeleteOutreachLog, useMarkOutreachReplyReceived } from "@/hooks/outreach-log.hook";
import { OutreachLogDialog } from "./outreach-log-dialog";
import { ListState } from "@/components/shared/list-state";
import { Mail, Calendar, CheckCircle2, Trash2 } from "lucide-react";
import type { IOutreachLog } from "@/types/outreach-log.type";
import { Button } from "@/components/ui/button";

export function OutreachLogList() {
  const { data, isLoading, isError } = useGetMyOutreachLogs();
  const logs: IOutreachLog[] = data?.data ?? [];

  const { mutate: deleteLog } = useDeleteOutreachLog();
  const { mutate: markReply } = useMarkOutreachReplyReceived();

  return (
    <ListState
      isLoading={isLoading}
      isError={isError}
      items={logs}
      emptyIcon={Mail}
      emptyTitle="No outreach emails logged yet"
      emptyDescription="Keep track of all professors you have emailed and set timely follow-ups."
      emptyAction={<OutreachLogDialog />}
      errorMessage="Failed to load outreach logs."
    >
      {(items) => (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((log) => (
            <div
              key={log.id}
              className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Mail className="size-4.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-foreground truncate">
                      {log.professor?.name ?? "Independent Professor"}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {log.opportunity?.title ?? log.professor?.university?.name ?? "Direct Outreach"}
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteLog(log.id)}
                  className="size-7 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>

              {log.notes && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {log.notes}
                </p>
              )}

              <div className="flex items-center justify-between border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  <span>
                    Sent: {log.emailSentAt ? new Date(log.emailSentAt).toLocaleDateString() : "—"}
                  </span>
                </div>

                {log.replyAt ? (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="size-3.5" />
                    Replied
                  </span>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markReply({ id: log.id })}
                    className="h-6 text-[10px] px-2"
                  >
                    Mark Replied
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </ListState>
  );
}
