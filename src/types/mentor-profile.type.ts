export enum MentorVerificationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface IApplyAsMentorPayload {
  name: string;
  email: string;
  institution?: string;
  designation?: string;
  contactNumber?: string;
  bio?: string;
  expertise?: string[];
}

export interface IVerifyMentorEmailPayload {
  email: string;
  otp: string;
}

export interface IMentorApplicationStatus {
  emailVerified: boolean;
  verificationStatus: MentorVerificationStatus;
  rejectionReason?: string | null;
}

export interface IApproveMentorPayload {
  mentorProfileId: string;
  verificationStatus:
    | MentorVerificationStatus.APPROVED
    | MentorVerificationStatus.REJECTED;
  rejectionReason?: string;
}

export interface IMentorProfile {
  id: string;
  userId: string;
  bio?: string | null;
  expertise: string[];
  institution?: string | null;
  designation?: string | null;
  contactNumber?: string | null;
  verificationStatus: MentorVerificationStatus;
  rejectionReason?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    imageUrl?: string | null;
    emailVerified?: boolean;
    status?: string;
  };
}
