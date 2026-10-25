export type ScheduleStatus = "DRAFT" | "PUBLISHED" | "CANCELLED";
export type BookingStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface IMentorSchedule {
  id: string;
  mentorId: string;
  startDateTime: string;
  endDateTime: string;
  meetingLink: string;
  status: ScheduleStatus;
  isBooked: boolean;
  mentor?: {
    id: string;
    name: string;
    email: string;
    imageUrl?: string | null;
  };
  booking?: {
    id: string;
    studentId: string;
    topic?: string;
    notes?: string;
    status: BookingStatus;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface IBooking {
  id: string;
  scheduleId: string;
  studentId: string;
  applicationId?: string | null;
  topic?: string;
  notes?: string;
  status: BookingStatus;
  schedule?: IMentorSchedule;
  application?: {
    id: string;
    opportunity?: {
      title: string;
      university?: { name: string };
    };
  } | null;
  createdAt: string;
}

export interface ICreateSchedulePayload {
  startDateTime: string;
  endDateTime: string;
  meetingLink: string;
}

export interface IUpdateSchedulePayload {
  startDateTime?: string;
  endDateTime?: string;
  meetingLink?: string;
}

export interface IBookSchedulePayload {
  scheduleId: string;
  applicationId?: string;
  topic?: string;
  notes?: string;
}
