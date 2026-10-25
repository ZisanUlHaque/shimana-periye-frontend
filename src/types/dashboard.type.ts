import type { ApplicationStatus } from "./application.type";

export interface IStudentDashboard {
  counts: {
    shortlistedOpportunities: number;
    applications: number;
    pendingTasks: number;
    documentsInReview: number;
    documentsApproved: number;
    unreadReminders: number;
  };
  applicationsByStatus: Record<ApplicationStatus, number>;
  recentReminders: Array<{
    id: string;
    title: string;
    message: string;
    scheduledFor: string;
    readAt: string | null;
  }>;
  upcomingReminders: Array<{
    id: string;
    title: string;
    message: string;
    scheduledFor: string;
    readAt: string | null;
  }>;
  readiness?: {
    totalScore?: number;
    level?: string;
    items?: Array<{
      key: string;
      label: string;
      earned: number;
      max: number;
      completed: boolean;
    }>;
    overallScore?: number;
    categoryScores?: Record<string, number>;
    breakdown?: Record<string, any>;
    recommendations?: string[];
  };
}

export interface IMentorDashboardStudent {
  studentProfileId: string;
  studentUserId: string;
  name: string;
  email: string;
  imageUrl?: string | null;
  assignedAt: string;
  applicationCount: number;
  submittedApplicationCount: number;
  documentsAwaitingReview: number;
}

export interface IMentorDashboard {
  totalStudents: number;
  totalDocumentsAwaitingReview: number;
  students: IMentorDashboardStudent[];
}

export interface IAdminDashboard {
  users?: {
    byRole: Record<string, number>;
    active: number;
    blocked: number;
  };
  mentors?: {
    pendingVerification: number;
    pendingList: Array<{
      id: string;
      userId: string;
      institution?: string | null;
      designation?: string | null;
      contactNumber?: string | null;
      bio?: string | null;
      expertise?: string[];
      createdAt: string;
      user: {
        id: string;
        name: string;
        email: string;
      };
    }>;
  };
  opportunities?: {
    total: number;
  };
  applications?: {
    total: number;
    byStatus: Record<string, number>;
  };
  documents?: {
    total: number;
  };
  fundings?: {
    awarded: number;
  };
  // Fallback flat properties for backwards-compatibility
  usersByRole?: Record<string, number>;
  totalActiveUsers?: number;
  totalBlockedUsers?: number;
  pendingMentorCount?: number;
  pendingMentors?: Array<any>;
  totalOpportunities?: number;
  totalApplications?: number;
  applicationsByStatus?: Record<string, number>;
  totalDocuments?: number;
  totalAwardedFunding?: number;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
  }>;
}
