export const CalendarEventType = {
  TASK: "TASK",
  APPLICATION_DEADLINE: "APPLICATION_DEADLINE",
  TEST_DATE: "TEST_DATE",
  INTERVIEW: "INTERVIEW",
  OFFER_DEADLINE: "OFFER_DEADLINE",
  OUTREACH_FOLLOWUP: "OUTREACH_FOLLOWUP",
} as const;

export type CalendarEventType =
  (typeof CalendarEventType)[keyof typeof CalendarEventType];

export interface ICalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string; // ISO string from API
  end?: string;
  allDay?: boolean;
  type: CalendarEventType;
  status?: string;
  color: string;
}