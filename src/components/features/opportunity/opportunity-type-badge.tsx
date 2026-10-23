import { StatusBadge } from "@/components/shared/status-badge";
import { OpportunityType } from "@/types/opportunity.type";

const OPPORTUNITY_TYPE_META: Record<OpportunityType, { label: string; className: string }> = {
  PROGRAMME: { label: "Programme", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  PROFESSOR_OPENING: { label: "Professor Opening", className: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
  LAB_POSITION: { label: "Lab Position", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  FUNDING: { label: "Funding", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
};

export function OpportunityTypeBadge({ type }: { type: OpportunityType }) {
  return <StatusBadge value={type} meta={OPPORTUNITY_TYPE_META} />;
}