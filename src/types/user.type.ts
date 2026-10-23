export interface IUser {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "MENTOR" | "ADMIN";
  imageUrl?: string | null;
  imagePublicId?: string | null;
  // ...other fields
}