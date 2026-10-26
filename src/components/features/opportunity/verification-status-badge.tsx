import { StatusBadge, type StatusMeta } from "@/components/shared/status-badge";
import type { VerificationStatus } from "@/types/opportunity.type";

const VERIFICATION_STATUS_META: Record<VerificationStatus, StatusMeta> = {
  VERIFIED: { label: "Verified", className: "bg-emerald-100 text-emerald-700" },
  NEEDS_RECHECK: {
    label: "Needs Recheck",
    className: "bg-amber-100 text-amber-700",
  },
};

export function VerificationStatusBadge({
  status,
}: {
  status: VerificationStatus;
}) {
  return <StatusBadge value={status} meta={VERIFICATION_STATUS_META} />;
}
