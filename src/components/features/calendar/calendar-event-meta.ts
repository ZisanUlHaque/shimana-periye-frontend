import {
  ListChecks,
  Flag,
  FileCheck2,
  Video,
  HandCoins,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { CalendarEventType } from "@/types/calendar.type";

export const CALENDAR_EVENT_TYPE_META: Record<
  CalendarEventType,
  { label: string; icon: LucideIcon }
> = {
  TASK: { label: "Task", icon: ListChecks },
  APPLICATION_DEADLINE: { label: "Application Deadline", icon: Flag },
  TEST_DATE: { label: "Test Date", icon: FileCheck2 },
  INTERVIEW: { label: "Interview", icon: Video },
  OFFER_DEADLINE: { label: "Offer Deadline", icon: HandCoins },
  OUTREACH_FOLLOWUP: { label: "Outreach Follow-up", icon: Mail },
};