import {
  ListChecks,
  Flag,
  FileCheck2,
  Video,
  HandCoins,
  Mail,
  UserCheck,
  FileSignature,
  type LucideIcon,
} from "lucide-react";
import { CalendarEventType } from "@/types/calendar.type";

export const CALENDAR_EVENT_TYPE_META: Record<
  CalendarEventType,
  { label: string; icon: LucideIcon; badgeColor: string }
> = {
  TASK: {
    label: "Application Task",
    icon: ListChecks,
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  APPLICATION_DEADLINE: {
    label: "University Deadline",
    icon: Flag,
    badgeColor: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  },
  TEST_DATE: {
    label: "Exam Date",
    icon: FileCheck2,
    badgeColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  },
  INTERVIEW: {
    label: "Admissions Interview",
    icon: Video,
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  OFFER_DEADLINE: {
    label: "Offer Response Due",
    icon: HandCoins,
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  OUTREACH_FOLLOWUP: {
    label: "Professor Follow-up",
    icon: Mail,
    badgeColor: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
  },
  MOCK_INTERVIEW: {
    label: "Mentor Session / Mock Interview",
    icon: UserCheck,
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  RECOMMENDATION_DEADLINE: {
    label: "LOR Follow-up",
    icon: FileSignature,
    badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
};
