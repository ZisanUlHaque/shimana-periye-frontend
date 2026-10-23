import { StatusBadge, type StatusMeta } from "@/components/shared/status-badge";
import type { OpportunityType } from "@/types/opportunity.type";

const OPPORTUNITY_TYPE_META: Record<OpportunityType, StatusMeta> = {
  PROGRAMME: { label: "Programme", className: "bg-blue-100 text-blue-700" },
  PROFESSOR_OPENING: { label: "Professor Opening", className: "bg-purple-100 text-purple-700" },
  LAB_POSITION: { label: "Lab Position", className: "bg-cyan-100 text-cyan-700" },
  FUNDING: { label: "Funding", className: "bg-emerald-100 text-emerald-700" },
};

export function OpportunityTypeBadge({ type }: { type: OpportunityType }) {
  return <StatusBadge value={type} meta={OPPORTUNITY_TYPE_META} />;
}