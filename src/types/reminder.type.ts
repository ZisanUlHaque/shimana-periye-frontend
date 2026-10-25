export interface IReminder {
  id: string;
  userId: string;
  title: string;
  message: string;
  scheduledFor: string;
  readAt: string | null;
  createdAt: string;
}
