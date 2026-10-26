export type UserRole = "STUDENT" | "MENTOR" | "ADMIN";
export type UserStatus = "ACTIVE" | "BLOCKED";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  emailVerified?: boolean;
  authProvider?: string;
  createdAt?: string;
  updatedAt?: string;
  studentProfile?: {
    id: string;
    bio?: string | null;
    targetDegree?: string | null;
    targetField?: string | null;
    targetCountry?: string | null;
  } | null;
  mentorProfile?: {
    id: string;
    bio?: string | null;
    expertise: string[];
    institution?: string | null;
    designation?: string | null;
    verificationStatus: string;
  } | null;
}

export interface IUpdateUserStatusPayload {
  status: UserStatus;
}

export interface IUpdateUserRolePayload {
  role: UserRole;
}

export interface IUpdateProfilePayload {
  name: string;
}

export interface IUserFilterParams {
  searchTerm?: string;
  role?: UserRole | "ALL";
  status?: UserStatus | "ALL";
  page?: number;
  limit?: number;
}
