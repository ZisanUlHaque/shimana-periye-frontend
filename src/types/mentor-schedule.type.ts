export type ScheduleStatus = "DRAFT" | "PUBLISHED" | "CANCELLED";
export type BookingStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface IMentorBookingItem {
  id: string;
  scheduleId: string;
  studentId: string;
  slotNumber?: number;
  startDateTime?: string;
  endDateTime?: string;
  formattedTimeBD?: string;
  notes?: string | null;
  status: BookingStatus;
  student?: {
    id: string;
    name: string;
    email: string;
    imageUrl?: string | null;
  };
  createdAt: string;
}

export interface IMentorSchedule {
  id: string;
  mentorId: string;
  startDateTime: string;
  endDateTime: string;
  meetingLink: string;
  totalSlots: number;
  availableSlots: number;
  status: ScheduleStatus;
  isBooked: boolean;
  isFullyBooked?: boolean;
  confirmedBookingsCount?: number;
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
  bookings?: IMentorBookingItem[];
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
