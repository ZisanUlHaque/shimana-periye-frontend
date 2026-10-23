model Application {
  id                    String            @id @default(uuid())
  studentProfileId      String
  opportunityId         String
  status                ApplicationStatus @default(DRAFT)
  submittedAt           DateTime?
  interviewDate         DateTime?
  decision              Decision          @default(PENDING)
  offerResponseDeadline DateTime?
  createdAt             DateTime          @default(now())
  updatedAt             DateTime          @updatedAt

  studentProfile StudentProfile @relation(fields: [studentProfileId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  opportunity    Opportunity    @relation(fields: [opportunityId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  tasks           ApplicationTask[]
  documents       Document[]
  recommendations RecommendationRequest[]
  costEstimate    CostEstimate?
  mentorFeedback  MentorFeedback[]

  @@unique([studentProfileId, opportunityId], name: "unique_application")
  @@map("applications")
}

model ApplicationTask {
  id             String     @id @default(uuid())
  applicationId  String
  title          String
  description    String?
  deadline       DateTime?
  dependsOnId    String?
  status         TaskStatus @default(PENDING)
  reminderSentAt DateTime?
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt

  application  Application      @relation(fields: [applicationId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  dependsOn    ApplicationTask? @relation("TaskDependency", fields: [dependsOnId], references: [id])
  blockedTasks ApplicationTask[] @relation("TaskDependency")

  @@map("application_tasks")
}
model Document {
  id                String       @id @default(uuid())
  studentProfileId  String
  applicationId     String?
  type              DocumentType
  isDeleted         Boolean      @default(false)
  deletedAt         DateTime?
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt

  studentProfile StudentProfile    @relation(fields: [studentProfileId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  application    Application?      @relation(fields: [applicationId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  versions       DocumentVersion[]

  @@map("documents")
}

model DocumentVersion {
  id           String       @id @default(uuid())
  documentId   String
  versionNo    Int
  fileUrl      String
  filePublicId String
  fileSize     Int?
  mimeType     String?
  reviewStatus ReviewStatus @default(DRAFT)
  uploadedAt   DateTime     @default(now())

  document Document          @relation(fields: [documentId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  comments DocumentComment[]

  @@unique([documentId, versionNo], name: "unique_document_version")
  @@map("document_versions")
}

model DocumentComment {
  id                String   @id @default(uuid())
  documentVersionId String
  mentorId          String
  comment           String
  createdAt         DateTime @default(now())

  documentVersion DocumentVersion @relation(fields: [documentVersionId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  @@map("document_comments")
}
enum Role {
  STUDENT
  MENTOR
  ADMIN
}

enum AuthProvider {
  CREDENTIAL
  GOOGLE
}

enum UserStatus {
  ACTIVE
  BLOCKED
  DELETED
}

enum OpportunityType {
  PROGRAMME
  PROFESSOR_OPENING
  LAB_POSITION
  FUNDING
}

enum RequirementType {
  TEST_SCORE
  DEGREE
  GPA
  PUBLICATION
  OTHER
}

enum TestType {
  IELTS
  GRE
  TOEFL
  GMAT
  OTHER
}

enum MentorVerificationStatus {
  PENDING
  APPROVED
  REJECTED
}

enum ApplicationStatus {
  DRAFT
  IN_PROGRESS
  SUBMITTED
  INTERVIEW
  DECISION
  CLOSED
}

enum Decision {
  PENDING
  ACCEPTED
  REJECTED
  WAITLISTED
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  DONE
  BLOCKED
}

enum DocumentType {
  SOP
  CV
  RESEARCH_STATEMENT
  OTHER
}

enum ReviewStatus {
  DRAFT
  IN_REVIEW
  APPROVED
  CHANGES_REQUESTED
}

enum FundingStatus {
  AVAILABLE
  APPLIED
  AWARDED
  REJECTED
}

enum OutreachStatus {
  NOT_REQUESTED
  REQUESTED
  SUBMITTED
  DECLINED
}

enum ScheduleStatus {
  DRAFT
  PUBLISHED
  CANCELLED
}

enum BookingStatus {
  CONFIRMED
  COMPLETED
  CANCELLED
}

model Funding {
  id               String        @id @default(uuid())
  opportunityId    String?
  studentProfileId String?
  name             String
  amount           Decimal       @db.Decimal(12, 2)
  currency         String
  status           FundingStatus @default(AVAILABLE)
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  opportunity    Opportunity?    @relation(fields: [opportunityId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  studentProfile StudentProfile? @relation(fields: [studentProfileId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  @@map("fundings")
}

model CostEstimate {
  id                 String   @id @default(uuid())
  applicationId      String   @unique
  feesAmount         Decimal  @db.Decimal(12, 2)
  feesCurrency       String
  livingCostAmount   Decimal  @db.Decimal(12, 2)
  livingCurrency     String
  travelAmount       Decimal  @db.Decimal(12, 2)
  travelCurrency     String
  assumptions        String?
  totalBaseCurrency  Decimal? @db.Decimal(12, 2)
  updatedAt          DateTime @updatedAt
  createdAt          DateTime @default(now())

  application Application @relation(fields: [applicationId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  @@map("cost_estimates")
}
model MatchResult {
  id               String   @id @default(uuid())
  studentProfileId String
  opportunityId    String
  score            Float
  explanationText  String?
  computedAt       DateTime @default(now())

  studentProfile StudentProfile @relation(fields: [studentProfileId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  opportunity    Opportunity    @relation(fields: [opportunityId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  gaps           MatchGap[]

  @@unique([studentProfileId, opportunityId], name: "unique_match_result")
  @@map("match_results")
}

model MatchGap {
  id            String @id @default(uuid())
  matchResultId String
  requirementId String
  description   String

  matchResult MatchResult @relation(fields: [matchResultId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  requirement Requirement @relation(fields: [requirementId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  @@map("match_gaps")
}
model MentorSchedule {
  id             String         @id @default(uuid())
  mentorId       String
  startDateTime  DateTime
  endDateTime    DateTime
  meetingLink    String
  totalSlots     Int            @default(1)
  availableSlots Int            @default(1)
  status         ScheduleStatus @default(PUBLISHED)
  isDeleted      Boolean        @default(false)
  deletedAt      DateTime?
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt

  bookings       MentorBooking[]

  @@map("mentor_schedules")
}

model MentorBooking {
  id            String        @id @default(uuid())
  scheduleId    String
  studentId     String
  applicationId String?
  notes         String?
  status        BookingStatus @default(CONFIRMED)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  schedule      MentorSchedule @relation(fields: [scheduleId], references: [id], onDelete: Cascade)

  @@map("mentor_bookings")
}

model Opportunity {
  id            String          @id @default(uuid())
  type          OpportunityType
  title         String
  universityId  String
  professorId   String?
  labId         String?
  fieldOfStudy  String
  deadline      DateTime?
  source        String
  lastCheckedAt DateTime
  createdById   String
  isDeleted     Boolean         @default(false)
  deletedAt     DateTime?
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  university University @relation(fields: [universityId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  professor  Professor? @relation(fields: [professorId], references: [id], onDelete: SetNull, onUpdate: Cascade)
  lab        Lab?       @relation(fields: [labId], references: [id], onDelete: SetNull, onUpdate: Cascade)

  requirements       Requirement[]
  fundings           Funding[]
  matchResults       MatchResult[]
  shortlists         Shortlist[]
  applications       Application[]
  outreachLogs       OutreachLog[]
  deadlineChangeLogs DeadlineChangeLog[]

  @@index([fieldOfStudy], name: "idx_opportunity_fieldOfStudy")
  @@index([deadline], name: "idx_opportunity_deadline")
  @@map("opportunities")
}

model Requirement {
  id            String           @id @default(uuid())
  opportunityId String
  type          RequirementType
  detail        String
  minValue      Float?
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt

  opportunity Opportunity @relation(fields: [opportunityId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  matchGaps   MatchGap[]

  @@map("requirements")
}

model DeadlineChangeLog {
  id            String    @id @default(uuid())
  opportunityId String
  oldDeadline   DateTime?
  newDeadline   DateTime?
  changedById   String
  changedAt     DateTime  @default(now())

  opportunity Opportunity @relation(fields: [opportunityId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  @@map("deadline_change_logs")
}
model RecommendationRequest {
  id                String         @id @default(uuid())
  applicationId     String?
  studentProfileId  String
  professorName     String
  professorEmail    String?
  status            OutreachStatus @default(NOT_REQUESTED)
  requestedAt       DateTime?
  followUpAt        DateTime?
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt

  application    Application?    @relation(fields: [applicationId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  studentProfile StudentProfile  @relation(fields: [studentProfileId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  @@map("recommendation_requests")
}

model OutreachLog {
  id                String    @id @default(uuid())
  studentProfileId  String
  professorId       String?
  opportunityId     String?
  emailSentAt       DateTime?
  replyReceived     Boolean   @default(false)
  replyAt           DateTime?
  followUpAt        DateTime?
  notes             String?
  createdAt         DateTime  @default(now())

  studentProfile StudentProfile @relation(fields: [studentProfileId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  professor      Professor?     @relation(fields: [professorId], references: [id], onDelete: SetNull, onUpdate: Cascade)
  opportunity    Opportunity?   @relation(fields: [opportunityId], references: [id], onDelete: SetNull, onUpdate: Cascade)

  @@map("outreach_logs")
}
model Reminder {
  id           String    @id @default(uuid())
  userId       String
  relatedType  String
  relatedId    String
  message      String
  scheduledFor DateTime
  sentAt       DateTime?
    readAt       DateTime?   
  createdAt    DateTime  @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  @@map("reminders")
}
model Shortlist {
  id               String   @id @default(uuid())
  studentProfileId String
  opportunityId    String
  notes            String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  studentProfile StudentProfile    @relation(fields: [studentProfileId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  opportunity    Opportunity       @relation(fields: [opportunityId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  mentorFeedback MentorFeedback[]

  @@unique([studentProfileId, opportunityId], name: "unique_shortlist")
  @@map("shortlists")
}

model MentorFeedback {
  id            String   @id @default(uuid())
  shortlistId   String?
  applicationId String?
  mentorId      String
  comment       String
  createdAt     DateTime @default(now())

  shortlist   Shortlist?   @relation(fields: [shortlistId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  application Application? @relation(fields: [applicationId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  @@map("mentor_feedback")
}
model StudentProfile {
  id        String    @id @default(uuid())
  userId    String    @unique
  interests String[]
  skills    String[]
  isDeleted Boolean   @default(false)
  deletedAt DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  academics               AcademicRecord[]
  publications            Publication[]
  experiences             Experience[]
  documents               Document[]
  testRecords             TestRecord[]
  shortlists              Shortlist[]
  applications            Application[]
  matchResults            MatchResult[]
  fundings                Funding[]
  outreachLogs            OutreachLog[]
  recommendationRequests  RecommendationRequest[]

  @@index([isDeleted], name: "idx_student_profile_isDeleted")
  @@map("student_profiles")
}

model AcademicRecord {
  id               String   @id @default(uuid())
  studentProfileId String
  degree           String
  institution      String
  fieldOfStudy     String
  gpa              Float?
  startYear        Int?
  endYear          Int?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  studentProfile StudentProfile @relation(fields: [studentProfileId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  @@map("academic_records")
}

model Publication {
  id               String   @id @default(uuid())
  studentProfileId String
  title            String
  venue            String?
  year             Int?
  link             String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  studentProfile StudentProfile @relation(fields: [studentProfileId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  @@map("publications")
}

model Experience {
  id               String    @id @default(uuid())
  studentProfileId String
  role             String
  organization     String
  startDate        DateTime?
  endDate          DateTime?
  description      String?
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  studentProfile StudentProfile @relation(fields: [studentProfileId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  @@map("experiences")
}
model TestRecord {
  id               String    @id @default(uuid())
  studentProfileId String
  testType         TestType
  score            Json?
  plannedDate      DateTime?
  actualDate       DateTime?
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  studentProfile StudentProfile @relation(fields: [studentProfileId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  @@map("test_records")
}
model University {
  id        String    @id @default(uuid())
  name      String
  country   String
  website   String?
  isDeleted Boolean   @default(false)
  deletedAt DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  professors    Professor[]
  labs          Lab[]
  opportunities Opportunity[]

  @@map("universities")
}

model Professor {
  id            String    @id @default(uuid())
  name          String
  email         String?
  universityId  String
  labId         String?
  researchAreas String[]
  isDeleted     Boolean   @default(false)
  deletedAt     DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  university University @relation(fields: [universityId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  lab        Lab?       @relation(fields: [labId], references: [id], onDelete: SetNull, onUpdate: Cascade)

  opportunities Opportunity[]
  outreachLogs  OutreachLog[]

  @@index([email], name: "idx_professor_email")
  @@map("professors")
}

model Lab {
  id           String    @id @default(uuid())
  name         String
  universityId String
  focusAreas   String[]
  isDeleted    Boolean   @default(false)
  deletedAt    DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  university University @relation(fields: [universityId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  professors    Professor[]
  opportunities Opportunity[]

  @@map("labs")
}
model User {
  id                 String       @id @default(uuid())
  name               String
  email              String       
  password           String?
  googleId           String?      @unique
  authProvider       AuthProvider @default(CREDENTIAL)
  emailVerified      Boolean      @default(false)
  role               Role         @default(STUDENT)
  status             UserStatus   @default(ACTIVE)
  needPasswordChange Boolean      @default(false)
  imageUrl           String       @default("")
  imagePublicId      String       @default("")
  isDeleted          Boolean      @default(false)
  deletedAt          DateTime?
  createdAt          DateTime     @default(now())
  updatedAt          DateTime     @updatedAt

  studentProfile StudentProfile?
  mentorProfile  MentorProfile?

  mentorAssignmentsAsMentor  MentorAssignment[] @relation("MentorLinks")
  mentorAssignmentsAsStudent MentorAssignment[] @relation("StudentLinks")

  reminders Reminder[]

  @@unique([email])
  @@map("users")
}

model MentorProfile {
  id        String   @id @default(uuid())
  userId    String   @unique
  bio       String?
  expertise String[]
  institution        String?
  designation        String?
  contactNumber      String?
  verificationStatus MentorVerificationStatus  @default(PENDING)
  rejectionReason    String?
  reviewedBy         String?
  reviewedAt         DateTime?
  isDeleted          Boolean                   @default(false)
  deletedAt          DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  @@map("mentor_profiles")
}

model MentorAssignment {
  id         String   @id @default(uuid())
  mentorId   String
  studentId  String
  assignedAt DateTime @default(now())

  mentor  User @relation("MentorLinks", fields: [mentorId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  student User @relation("StudentLinks", fields: [studentId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  @@unique([mentorId, studentId], name: "unique_mentor_student")
  @@map("mentor_assignments")
}
import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { AcademicRecordController } from "./academic-record.controller";
import { AcademicRecordValidation } from "./academic-record.validation";

const router = Router();

router.post(
    "/",
    auth(Role.STUDENT),
    validateRequest(AcademicRecordValidation.CreateAcademicRecordZodSchema),
    AcademicRecordController.createAcademicRecord,
);

router.get("/", auth(Role.STUDENT), AcademicRecordController.getMyAcademicRecords);

router.patch(
    "/:id",
    auth(Role.STUDENT),
    validateRequest(AcademicRecordValidation.UpdateAcademicRecordZodSchema),
    AcademicRecordController.updateAcademicRecord,
);

router.delete(
    "/:id",
    auth(Role.STUDENT),
    AcademicRecordController.deleteAcademicRecord,
);

export const AcademicRecordRoutes = router;
export interface ICreateAcademicRecordPayload {
    degree: string;
    institution: string;
    fieldOfStudy: string;
    gpa?: number;
    startYear?: number;
    endYear?: number;
}

export interface IUpdateAcademicRecordPayload {
    degree?: string;
    institution?: string;
    fieldOfStudy?: string;
    gpa?: number;
    startYear?: number;
    endYear?: number;
}
import z from "zod";

const currentYear = new Date().getFullYear();

const CreateAcademicRecordZodSchema = z.object({
  degree: z.string().min(2).max(150),
  institution: z.string().min(2).max(200),
  fieldOfStudy: z.string().min(2).max(150),
  gpa: z.number().min(0).max(5).optional(),
  startYear: z
    .number()
    .int()
    .min(1950)
    .max(currentYear + 1)
    .optional(),
  endYear: z
    .number()
    .int()
    .min(1950)
    .max(currentYear + 10)
    .optional(),
});

const UpdateAcademicRecordZodSchema = z.object({
  degree: z.string().min(2).max(150).optional(),
  institution: z.string().min(2).max(200).optional(),
  fieldOfStudy: z.string().min(2).max(150).optional(),
  gpa: z.number().min(0).max(5).optional(),
  startYear: z
    .number()
    .int()
    .min(1950)
    .max(currentYear + 1)
    .optional(),
  endYear: z
    .number()
    .int()
    .min(1950)
    .max(currentYear + 10)
    .optional(),
});

export const AcademicRecordValidation = {
  CreateAcademicRecordZodSchema,
  UpdateAcademicRecordZodSchema,
};

import type { ApplicationStatus, Decision } from "../../../generated/prisma/enums";

export interface IStartApplicationPayload {
    opportunityId: string;
}

export interface IUpdateApplicationStatusPayload {
    status: ApplicationStatus;
}

export interface IRecordDecisionPayload {
    decision: Decision;
    offerResponseDeadline?: Date;
}

export interface IRecordInterviewPayload {
    interviewDate: Date;
}
import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { ApplicationTaskRoutes } from "../application-task/application-task.route";
import { ApplicationController } from "./application.controller";
import { ApplicationValidation } from "./application.validation";

const router = Router();

router.post(
    "/",
    auth(Role.STUDENT),
    validateRequest(ApplicationValidation.StartApplicationZodSchema),
    ApplicationController.startApplication,
);

router.get("/", auth(Role.STUDENT), ApplicationController.getMyApplications);
router.get("/:id", auth(Role.STUDENT), ApplicationController.getApplicationById);

router.patch(
    "/:id/status",
    auth(Role.STUDENT),
    validateRequest(ApplicationValidation.UpdateApplicationStatusZodSchema),
    ApplicationController.updateApplicationStatus,
);

router.patch(
    "/:id/interview",
    auth(Role.STUDENT),
    validateRequest(ApplicationValidation.RecordInterviewZodSchema),
    ApplicationController.recordInterview,
);

router.patch(
    "/:id/decision",
    auth(Role.STUDENT),
    validateRequest(ApplicationValidation.RecordDecisionZodSchema),
    ApplicationController.recordDecision,
);

router.get("/mentor/:id", auth(Role.MENTOR), ApplicationController.getApplicationForMentor);

// Nested: /applications/:applicationId/tasks
router.use("/:applicationId/tasks", ApplicationTaskRoutes);

export const ApplicationRoutes = router;
// PRD FR-06 AC1: default checklist auto-generated on application start
export const DEFAULT_APPLICATION_TASKS: Array<{ title: string; description?: string }> = [
    { title: "Submit Statement of Purpose (SOP)" },
    { title: "Submit CV/Resume" },
    { title: "Request Recommendation Letters", description: "Request at least 2 recommendation letters" },
    { title: "Submit Test Scores", description: "IELTS/GRE/TOEFL scores as required by the opportunity" },
    { title: "Pay Application Fee" },
    { title: "Submit Final Application" },
];

// PRD FR-10 AC1: student-triggered, forward-only transitions
export const APPLICATION_STATUS_TRANSITIONS: Record<string, string[]> = {
    DRAFT: ["IN_PROGRESS"],
    IN_PROGRESS: ["SUBMITTED"],
    SUBMITTED: ["INTERVIEW", "DECISION", "CLOSED"],
    INTERVIEW: ["DECISION", "CLOSED"],
    DECISION: ["CLOSED"],
    CLOSED: [],
};
import z from "zod";
import { ApplicationStatus, Decision } from "../../../generated/prisma/enums";

const StartApplicationZodSchema = z.object({
    opportunityId: z.uuid("Invalid Opportunity ID"),
});

const UpdateApplicationStatusZodSchema = z.object({
    status: z.nativeEnum(ApplicationStatus),
});

const RecordDecisionZodSchema = z
    .object({
        decision: z.nativeEnum(Decision),
        offerResponseDeadline: z.coerce.date().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.decision === "ACCEPTED" && !data.offerResponseDeadline) {
            ctx.addIssue({
                code: "custom",
                message: "offerResponseDeadline is required when decision is ACCEPTED",
                path: ["offerResponseDeadline"],
            });
        }
    });

const RecordInterviewZodSchema = z.object({
    interviewDate: z.coerce.date(),
});

export const ApplicationValidation = {
    StartApplicationZodSchema,
    UpdateApplicationStatusZodSchema,
    RecordDecisionZodSchema,
    RecordInterviewZodSchema,
};
import type { TaskStatus } from "../../../generated/prisma/enums";

export interface ICreateApplicationTaskPayload {
    title: string;
    description?: string;
    deadline?: Date;
    dependsOnId?: string;
}

export interface IUpdateApplicationTaskPayload {
    title?: string;
    description?: string;
    deadline?: Date;
    dependsOnId?: string | null;
}

export interface IUpdateTaskStatusPayload {
    status: TaskStatus;
}
import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { ApplicationTaskController } from "./application-task.controller";
import { ApplicationTaskValidation } from "./application-task.validation";

const router = Router({ mergeParams: true });

router.post(
    "/",
    auth(Role.STUDENT),
    validateRequest(ApplicationTaskValidation.CreateApplicationTaskZodSchema),
    ApplicationTaskController.createTask,
);

router.get("/", auth(Role.STUDENT), ApplicationTaskController.getApplicationTasks);
router.get("/mentor/view", auth(Role.MENTOR), ApplicationTaskController.getTasksForMentor);

router.patch(
    "/:taskId",
    auth(Role.STUDENT),
    validateRequest(ApplicationTaskValidation.UpdateApplicationTaskZodSchema),
    ApplicationTaskController.updateTask,
);

router.patch(
    "/:taskId/status",
    auth(Role.STUDENT),
    validateRequest(ApplicationTaskValidation.UpdateTaskStatusZodSchema),
    ApplicationTaskController.updateTaskStatus,
);

router.delete("/:taskId", auth(Role.STUDENT), ApplicationTaskController.deleteTask);

export const ApplicationTaskRoutes = router;
import z from "zod";
import { TaskStatus } from "../../../generated/prisma/enums";

const CreateApplicationTaskZodSchema = z.object({
    title: z.string().min(2).max(200),
    description: z.string().max(1000).optional(),
    deadline: z.coerce.date().optional(),
    dependsOnId: z.uuid().optional(),
});

const UpdateApplicationTaskZodSchema = z.object({
    title: z.string().min(2).max(200).optional(),
    description: z.string().max(1000).optional(),
    deadline: z.coerce.date().optional(),
    dependsOnId: z.uuid().nullable().optional(),
});

const UpdateTaskStatusZodSchema = z.object({
    status: z.nativeEnum(TaskStatus),
});

export const ApplicationTaskValidation = {
    CreateApplicationTaskZodSchema,
    UpdateApplicationTaskZodSchema,
    UpdateTaskStatusZodSchema,
};
export interface ICalendarEvent {
    id: string;
    title: string;
    description?: string;
    start: Date;
    end?: Date;
    allDay?: boolean;
    type:
        | "TASK"
        | "APPLICATION_DEADLINE"
        | "TEST_DATE"
        | "INTERVIEW"
        | "OFFER_DEADLINE"
        | "OUTREACH_FOLLOWUP";
    status?: string;
    color: string;
}

import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { CalendarController } from "./calendar.controller";

const router = Router();

router.get("/events", auth(Role.STUDENT), CalendarController.getEvents);
router.get("/export.ics", auth(Role.STUDENT), CalendarController.exportIcs);

export const CalendarRoutes = router;

export interface ICostEstimateInputs {
    feesAmount: number;
    feesCurrency: string;
    livingCostAmount: number;
    livingCurrency: string;
    travelAmount: number;
    travelCurrency: string;
}

export interface IComputedTotal {
    totalBaseCurrency: number | null;
    baseCurrency: string | null;
    currenciesMatch: boolean;
}

// No FX conversion exists (non-AI, deterministic constraint) — total is only
// computed when fees/living/travel all share the same currency.
export const computeCostEstimateTotal = (inputs: ICostEstimateInputs): IComputedTotal => {
    const currencies = new Set([
        inputs.feesCurrency,
        inputs.livingCurrency,
        inputs.travelCurrency,
    ]);
    const currenciesMatch = currencies.size === 1;

    if (!currenciesMatch) {
        return { totalBaseCurrency: null, baseCurrency: null, currenciesMatch: false };
    }

    const total = inputs.feesAmount + inputs.livingCostAmount + inputs.travelAmount;

    return { totalBaseCurrency: total, baseCurrency: inputs.feesCurrency, currenciesMatch: true };
};

export interface IFundingAmount {
    amount: number;
    currency: string;
}

export interface IComputedNetCost {
    potentialFunding: number;
    netCost: number | null;
    excludedFundingCount: number;
}

// Only AWARDED fundings whose currency matches the cost estimate's base
// currency can be deterministically netted; mismatched ones are excluded + counted.
export const computeNetCost = (
    totalBaseCurrency: number | null,
    baseCurrency: string | null,
    awardedFundings: IFundingAmount[],
): IComputedNetCost => {
    if (totalBaseCurrency === null || baseCurrency === null) {
        return { potentialFunding: 0, netCost: null, excludedFundingCount: awardedFundings.length };
    }

    const matching = awardedFundings.filter((f) => f.currency === baseCurrency);
    const potentialFunding = matching.reduce((sum, f) => sum + f.amount, 0);
    const excludedFundingCount = awardedFundings.length - matching.length;

    return {
        potentialFunding,
        netCost: totalBaseCurrency - potentialFunding,
        excludedFundingCount,
    };
};
export interface IUpsertCostEstimatePayload {
    feesAmount?: number;
    feesCurrency?: string;
    livingCostAmount?: number;
    livingCurrency?: string;
    travelAmount?: number;
    travelCurrency?: string;
    assumptions?: string;
}
import { Router } from "express";

import { CostEstimateValidation } from "./cost-estimate.validation";
import { CostEstimateController } from "./cost-estimate.controller";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";

const router = Router();

router.put(
    "/:applicationId",
    auth(Role.STUDENT),
    validateRequest(CostEstimateValidation.upsertCostEstimateZodSchema),
    CostEstimateController.upsertCostEstimate,
);

router.get("/:applicationId", auth(Role.STUDENT), CostEstimateController.getCostEstimate);

router.get(
    "/mentor/:applicationId",
    auth(Role.MENTOR),
    CostEstimateController.getCostEstimateForMentor,
);

export const CostEstimateRoutes = router;
import { z } from "zod";

const currencySchema = z
    .string()
    .length(3, "Currency must be a 3-letter ISO code (e.g. USD)")
    .toUpperCase();

const upsertCostEstimateZodSchema = z.object({
    body: z.object({
        feesAmount: z.number().nonnegative().optional(),
        feesCurrency: currencySchema.optional(),
        livingCostAmount: z.number().nonnegative().optional(),
        livingCurrency: currencySchema.optional(),
        travelAmount: z.number().nonnegative().optional(),
        travelCurrency: currencySchema.optional(),
        assumptions: z.string().max(2000).optional(),
    }),
});

export const CostEstimateValidation = { upsertCostEstimateZodSchema };
import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { DashboardController } from "./dashboard.controller";
import { auth } from "../../middleware/checkAuth";

const router = Router();

router.get("/student", auth(Role.STUDENT), DashboardController.getStudentDashboard);
router.get("/mentor", auth(Role.MENTOR), DashboardController.getMentorDashboard);
router.get("/admin", auth(Role.ADMIN), DashboardController.getAdminDashboard);

export const DashboardRoutes = router;
import { DocumentType } from "../../../generated/prisma/enums";

export interface ICreateDocumentPayload {
    type: DocumentType;
    applicationId?: string;
}

export interface IUpdateDocumentPayload {
    type?: DocumentType;
    applicationId?: string | null;
}

export interface IUploadedFile {
    url: string;
    publicId: string;
    size: number;
    mimeType: string;
}
import { Router } from "express";

import { DocumentValidation } from "./document.validation";
import { DocumentController } from "./document.controller";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { Role } from "../../../generated/prisma/enums";
import { uploadDocumentFile } from "../../middleware/uploadDocument";

const router = Router();

router.post(
    "/",
    auth(Role.STUDENT),
    uploadDocumentFile,
    validateRequest(DocumentValidation.createDocumentZodSchema),
    DocumentController.createDocument,
);

router.get("/", auth(Role.STUDENT), DocumentController.getMyDocuments);
router.get("/:id", auth(Role.STUDENT), DocumentController.getDocumentById);
router.post("/:id/ai-feedback", auth(Role.STUDENT), DocumentController.getAiFeedback);

router.post(
    "/:id/versions",
    auth(Role.STUDENT),
    uploadDocumentFile,
    DocumentController.addNewVersion,
);

router.patch(
    "/:id",
    auth(Role.STUDENT),
    validateRequest(DocumentValidation.updateDocumentZodSchema),
    DocumentController.updateDocument,
);

router.delete("/:id", auth(Role.STUDENT), DocumentController.deleteDocument);

// Mentor-only
router.get(
    "/student/:studentProfileId",
    auth(Role.MENTOR),
    DocumentController.getDocumentsForMentor,
);
router.get("/mentor/:id", auth(Role.MENTOR), DocumentController.getDocumentByIdForMentor);
router.patch(
    "/versions/:versionId/review-status",
    auth(Role.MENTOR),
    validateRequest(DocumentValidation.updateReviewStatusZodSchema),
    DocumentController.updateVersionReviewStatus,
);

export const DocumentRoutes = router;
import type { UploadApiResponse } from "cloudinary";
import httpStatus from "http-status";
import { cloudinary } from "../../lib/cloudinary";
import { AppError } from "../../utils/AppError";
import type { IUploadedFile } from "./document.interface";

export const uploadDocumentToCloudinary = async (
    file: Express.Multer.File,
    folder: string,
): Promise<IUploadedFile> => {
    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                {
                    folder,
                    resource_type: "auto",
                },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    if (!result) {
                        return reject(
                            new AppError(
                                httpStatus.INTERNAL_SERVER_ERROR,
                                "No result returned from Cloudinary",
                            ),
                        );
                    }
                    resolve(result);
                },
            )
            .end(file.buffer);
    });

    return {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        size: file.size,
        mimeType: file.mimetype,
    };
};

// Schema does not persist resource_type, so on delete we try the likely
// types in order and stop at the first successful destroy (best-effort).
const RESOURCE_TYPES_TO_TRY = ["image", "raw", "video"] as const;

export const deleteDocumentFromCloudinary = async (publicId: string) => {
    for (const resourceType of RESOURCE_TYPES_TO_TRY) {
        try {
            const result = await cloudinary.uploader.destroy(publicId, {
                resource_type: resourceType,
            });
            if (result?.result === "ok") return;
        } catch {
            // try the next resource type
        }
    }
};
import { z } from "zod";
import { DocumentType, ReviewStatus } from "../../../generated/prisma/enums";

const createDocumentZodSchema = z.object({
    body: z.object({
        type: z.nativeEnum(DocumentType),
        applicationId: z.string().uuid().optional(),
    }),
});

const updateDocumentZodSchema = z.object({
    body: z.object({
        type: z.nativeEnum(DocumentType).optional(),
        applicationId: z.string().uuid().nullable().optional(),
    }),
});

const updateReviewStatusZodSchema = z.object({
    body: z.object({
        reviewStatus: z.nativeEnum(ReviewStatus),
    }),
});

export const DocumentValidation = {
    createDocumentZodSchema,
    updateDocumentZodSchema,
    updateReviewStatusZodSchema,
};
export interface ICreateDocumentCommentPayload {
    documentVersionId: string;
    comment: string;
}
import { Router } from "express";

import { DocumentCommentValidation } from "./document-comment.validation";
import { DocumentCommentController } from "./document-comment.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";

const router = Router();

router.post(
    "/",
    auth(Role.MENTOR),
    validateRequest(DocumentCommentValidation.createDocumentCommentZodSchema),
    DocumentCommentController.createComment,
);

router.get(
    "/version/:documentVersionId",
    auth(Role.STUDENT, Role.MENTOR),
    DocumentCommentController.getCommentsForVersion,
);

router.delete("/:id", auth(Role.MENTOR), DocumentCommentController.deleteComment);

export const DocumentCommentRoutes = router;
import { z } from "zod";

const createDocumentCommentZodSchema = z.object({
    body: z.object({
        documentVersionId: z.string().uuid(),
        comment: z.string().min(1, "Comment cannot be empty").max(2000),
    }),
});

export const DocumentCommentValidation = { createDocumentCommentZodSchema };
export interface ICreateExperiencePayload {
    role: string;
    organization: string;
    startDate?: Date;
    endDate?: Date;
    description?: string;
}

export interface IUpdateExperiencePayload {
    role?: string;
    organization?: string;
    startDate?: Date;
    endDate?: Date;
    description?: string;
}

import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { ExperienceController } from "./experience.controller";
import { ExperienceValidation } from "./experience.validation";

const router = Router();

router.post(
    "/",
    auth(Role.STUDENT),
    validateRequest(ExperienceValidation.CreateExperienceZodSchema),
    ExperienceController.createExperience,
);

router.get("/", auth(Role.STUDENT), ExperienceController.getMyExperiences);

router.patch(
    "/:id",
    auth(Role.STUDENT),
    validateRequest(ExperienceValidation.UpdateExperienceZodSchema),
    ExperienceController.updateExperience,
);

router.delete("/:id", auth(Role.STUDENT), ExperienceController.deleteExperience);

export const ExperienceRoutes = router;

import z from "zod";

const CreateExperienceZodSchema = z.object({
    role: z.string().min(2, "Role must be at least 2 characters").max(100),
    organization: z.string().min(2, "Organization must be at least 2 characters").max(150),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    description: z.string().max(2000).optional(),
});

const UpdateExperienceZodSchema = z.object({
    role: z.string().min(2).max(100).optional(),
    organization: z.string().min(2).max(150).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    description: z.string().max(2000).optional(),
});

export const ExperienceValidation = {
    CreateExperienceZodSchema,
    UpdateExperienceZodSchema,
};

import { FundingStatus } from "../../../generated/prisma/enums";

export interface ICreateFundingPayload {
    opportunityId?: string;
    name: string;
    amount: number;
    currency: string;
}

export interface ICreateCatalogFundingPayload {
    opportunityId: string;
    name: string;
    amount: number;
    currency: string;
}

export interface IUpdateFundingPayload {
    name?: string;
    amount?: number;
    currency?: string;
}

export interface IUpdateFundingStatusPayload {
    status: FundingStatus;
}
import { Router } from "express";

import { FundingValidation } from "./funding.validation";
import { FundingController } from "./funding.controller";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";

const router = Router();

router.post(
    "/",
    auth(Role.STUDENT),
    validateRequest(FundingValidation.createFundingZodSchema),
    FundingController.createFunding,
);

router.get("/", auth(Role.STUDENT), FundingController.getMyFundings);

router.patch(
    "/:id",
    auth(Role.STUDENT),
    validateRequest(FundingValidation.updateFundingZodSchema),
    FundingController.updateFunding,
);

router.patch(
    "/:id/status",
    auth(Role.STUDENT),
    validateRequest(FundingValidation.updateFundingStatusZodSchema),
    FundingController.updateStatus,
);

router.delete("/:id", auth(Role.STUDENT), FundingController.deleteFunding);

router.get(
    "/student/:studentProfileId",
    auth(Role.MENTOR),
    FundingController.getFundingsForMentor,
);

// Admin-maintained catalog (general funding info per opportunity)
router.post(
    "/catalog",
    auth(Role.ADMIN),
    validateRequest(FundingValidation.createCatalogFundingZodSchema),
    FundingController.createCatalogFunding,
);

router.get(
    "/catalog/:opportunityId",
    auth(Role.STUDENT, Role.MENTOR, Role.ADMIN),
    FundingController.getCatalogFundingsForOpportunity,
);

export const FundingRoutes = router;
import { z } from "zod";
import { FundingStatus } from "../../../generated/prisma/enums";

const currencySchema = z
    .string()
    .length(3, "Currency must be a 3-letter ISO code (e.g. USD)")
    .toUpperCase();

const createFundingZodSchema = z.object({
    body: z.object({
        opportunityId: z.string().uuid().optional(),
        name: z.string().min(2).max(200),
        amount: z.number().nonnegative(),
        currency: currencySchema,
    }),
});

const createCatalogFundingZodSchema = z.object({
    body: z.object({
        opportunityId: z.string().uuid(),
        name: z.string().min(2).max(200),
        amount: z.number().nonnegative(),
        currency: currencySchema,
    }),
});

const updateFundingZodSchema = z.object({
    body: z.object({
        name: z.string().min(2).max(200).optional(),
        amount: z.number().nonnegative().optional(),
        currency: currencySchema.optional(),
    }),
});

const updateFundingStatusZodSchema = z.object({
    body: z.object({
        status: z.nativeEnum(FundingStatus),
    }),
});

export const FundingValidation = {
    createFundingZodSchema,
    createCatalogFundingZodSchema,
    updateFundingZodSchema,
    updateFundingStatusZodSchema,
};
export interface IEvaluateAnswerPayload {
    question: string;
    answer: string;
    category?: "BEHAVIORAL" | "TECHNICAL" | "RESEARCH_FIT" | "MOTIVATION";
}

import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { InterviewPracticeController } from "./interview-practice.controller";
import { InterviewPracticeValidation } from "./interview-practice.validation";

const router = Router();

router.post(
    "/:applicationId/generate",
    auth(Role.STUDENT),
    InterviewPracticeController.generateQuestions,
);

router.post(
    "/:applicationId/evaluate",
    auth(Role.STUDENT),
    validateRequest(InterviewPracticeValidation.EvaluateAnswerZodSchema),
    InterviewPracticeController.evaluateAnswer,
);

export const InterviewPracticeRoutes = router;

import z from "zod";

const EvaluateAnswerZodSchema = z.object({
    question: z.string().min(5, "Question must be at least 5 characters"),
    answer: z.string().min(10, "Answer must be at least 10 characters"),
    category: z.enum(["BEHAVIORAL", "TECHNICAL", "RESEARCH_FIT", "MOTIVATION"]).optional(),
});

export const InterviewPracticeValidation = {
    EvaluateAnswerZodSchema,
};

export interface ICreateLabPayload {
    name: string;
    universityId: string;
    focusAreas?: string[];
}

export interface IUpdateLabPayload {
    name?: string;
    focusAreas?: string[];
}

export interface ILabFilters {
    searchTerm?: string;
    universityId?: string;
    focusArea?: string;
}
import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { LabController } from "./lab.controller";
import { LabValidation } from "./lab.validation";

const router = Router();

router.post(
    "/",
    auth(Role.ADMIN),
    validateRequest(LabValidation.CreateLabZodSchema),
    LabController.createLab,
);

router.get("/", auth(Role.STUDENT, Role.MENTOR, Role.ADMIN), LabController.getAllLabs);

router.get("/:id", auth(Role.STUDENT, Role.MENTOR, Role.ADMIN), LabController.getLabById);

router.patch(
    "/:id",
    auth(Role.ADMIN),
    validateRequest(LabValidation.UpdateLabZodSchema),
    LabController.updateLab,
);

router.delete("/:id", auth(Role.ADMIN), LabController.deleteLab);

export const LabRoutes = router;
import z from "zod";

const CreateLabZodSchema = z.object({
    name: z.string().min(2).max(200),
    universityId: z.uuid("Invalid University ID"),
    focusAreas: z.array(z.string().min(1).max(100)).max(20).optional(),
});

const UpdateLabZodSchema = z.object({
    name: z.string().min(2).max(200).optional(),
    focusAreas: z.array(z.string().min(1).max(100)).max(20).optional(),
});

export const LabValidation = {
    CreateLabZodSchema,
    UpdateLabZodSchema,
};
import type {
    AcademicRecord,
    Publication,
    Requirement,
    TestRecord,
} from "../../../generated/prisma/client";
import type {
    IMatchResultComputed,
    IRequirementEvaluation,
    RequirementEligibilityStatus,
} from "./matching.interface";

const INTEREST_MAX = 40;
const SKILL_MAX = 20;
const REQUIREMENT_MAX = 40;

const normalize = (value: string) => value.toLowerCase().trim();

/** Tag-overlap scorer — used for both interest and skill matching */
const calculateOverlapScore = (
    studentTags: string[],
    opportunityTags: string[],
    maxPoints: number,
): number => {
    const cleanOpportunityTags = Array.from(
        new Set(opportunityTags.filter(Boolean).map(normalize)),
    );
    const cleanStudentTags = studentTags.filter(Boolean).map(normalize);

    if (cleanOpportunityTags.length === 0 || cleanStudentTags.length === 0) return 0;

    const matchedCount = cleanOpportunityTags.filter((tag) =>
        cleanStudentTags.some((studentTag) => studentTag.includes(tag) || tag.includes(studentTag)),
    ).length;

    const ratio = matchedCount / cleanOpportunityTags.length;
    return Math.round(ratio * maxPoints);
};

/**
 * Eligibility Evaluation — PRD Section 12 #2
 * Never defaults missing data to "met" — missing info => INSUFFICIENT_INFORMATION.
 */
export const evaluateRequirement = (
    requirement: Requirement,
    context: {
        testRecords: TestRecord[];
        academicRecords: AcademicRecord[];
        publications: Publication[];
        opportunityDeadline: Date | null;
    },
): { status: RequirementEligibilityStatus; reason: string } => {
    switch (requirement.type) {
        case "TEST_SCORE": {
            const testTypeNeeded = requirement.detail.toUpperCase();
            const record = context.testRecords.find((t) => t.testType === testTypeNeeded);

            if (!record) {
                return {
                    status: "INSUFFICIENT_INFORMATION",
                    reason: `No ${testTypeNeeded} test record found`,
                };
            }

            const score = record.score as { overall?: number } | null;

            if (score?.overall !== undefined && score.overall !== null) {
                const met = requirement.minValue !== null ? score.overall >= requirement.minValue : true;
                return {
                    status: met ? "ELIGIBLE" : "NOT_ELIGIBLE",
                    reason: met
                        ? `${testTypeNeeded} score ${score.overall} meets minimum ${requirement.minValue}`
                        : `${testTypeNeeded} score ${score.overall} is below minimum ${requirement.minValue}`,
                };
            }

            if (
                record.plannedDate &&
                (!context.opportunityDeadline || record.plannedDate <= context.opportunityDeadline)
            ) {
                return {
                    status: "POTENTIALLY_ELIGIBLE",
                    reason: `${testTypeNeeded} planned for ${record.plannedDate.toDateString()}, before deadline`,
                };
            }

            return {
                status: "INSUFFICIENT_INFORMATION",
                reason: `${testTypeNeeded} record exists but has no score or valid planned date`,
            };
        }

        case "GPA": {
            const sorted = [...context.academicRecords].sort((a, b) => (b.endYear || 0) - (a.endYear || 0));
            const latest = sorted[0];

            if (!latest || latest.gpa === null || latest.gpa === undefined) {
                return { status: "INSUFFICIENT_INFORMATION", reason: "No GPA recorded in academic records" };
            }

            const met = requirement.minValue !== null ? latest.gpa >= requirement.minValue : true;
            return {
                status: met ? "ELIGIBLE" : "NOT_ELIGIBLE",
                reason: met
                    ? `GPA ${latest.gpa} meets minimum ${requirement.minValue}`
                    : `GPA ${latest.gpa} is below minimum ${requirement.minValue}`,
            };
        }

        case "PUBLICATION": {
            const count = context.publications.length;
            const required = requirement.minValue ?? 1;
            const met = count >= required;
            return {
                status: met ? "ELIGIBLE" : "NOT_ELIGIBLE",
                reason: met
                    ? `Has ${count} publication(s), meets minimum ${required}`
                    : `Requires ${required} publication(s), you have ${count}`,
            };
        }

        case "DEGREE": {
            const requiredDegree = normalize(requirement.detail);
            const hasDegree = context.academicRecords.some((a) =>
                normalize(a.degree).includes(requiredDegree),
            );
            return {
                status: hasDegree ? "ELIGIBLE" : "NOT_ELIGIBLE",
                reason: hasDegree
                    ? `Has required degree: ${requirement.detail}`
                    : `Missing required degree: ${requirement.detail}`,
            };
        }

        default:
            // OTHER / unrecognized type — conservative default (PRD)
            return {
                status: "INSUFFICIENT_INFORMATION",
                reason: `Requirement type ${requirement.type} cannot be automatically evaluated`,
            };
    }
};

/** Worst-case priority: NOT_ELIGIBLE > INSUFFICIENT_INFORMATION > POTENTIALLY_ELIGIBLE > ELIGIBLE */
const ELIGIBILITY_PRIORITY: Record<RequirementEligibilityStatus, number> = {
    NOT_ELIGIBLE: 3,
    INSUFFICIENT_INFORMATION: 2,
    POTENTIALLY_ELIGIBLE: 1,
    ELIGIBLE: 0,
};

export const computeOverallEligibility = (
    statuses: RequirementEligibilityStatus[],
): RequirementEligibilityStatus => {
    if (statuses.length === 0) return "ELIGIBLE";

    return statuses.reduce((worst, current) =>
        ELIGIBILITY_PRIORITY[current] > ELIGIBILITY_PRIORITY[worst] ? current : worst,
    );
};

/**
 * Profile-to-Opportunity Matching — PRD Section 12 #1
 * Deterministic, 100% explainable, no AI dependency.
 */
export const computeMatchScore = (params: {
    studentInterests: string[];
    studentSkills: string[];
    opportunityTags: string[];
    requirements: Requirement[];
    testRecords: TestRecord[];
    academicRecords: AcademicRecord[];
    publications: Publication[];
    opportunityDeadline: Date | null;
}): IMatchResultComputed => {
    const interestScore = calculateOverlapScore(params.studentInterests, params.opportunityTags, INTEREST_MAX);
    const skillScore = calculateOverlapScore(params.studentSkills, params.opportunityTags, SKILL_MAX);

    const gaps: IRequirementEvaluation[] = [];
    const statuses: RequirementEligibilityStatus[] = [];
    let requirementScore = 0;

    if (params.requirements.length > 0) {
        const weightPerRequirement = REQUIREMENT_MAX / params.requirements.length;

        for (const requirement of params.requirements) {
            const { status, reason } = evaluateRequirement(requirement, {
                testRecords: params.testRecords,
                academicRecords: params.academicRecords,
                publications: params.publications,
                opportunityDeadline: params.opportunityDeadline,
            });

            statuses.push(status);

            if (status === "ELIGIBLE") {
                requirementScore += weightPerRequirement;
            } else {
                gaps.push({
                    requirementId: requirement.id,
                    type: requirement.type,
                    detail: requirement.detail,
                    minValue: requirement.minValue,
                    status,
                    reason,
                });
            }
        }
    }

    const score = Math.round(interestScore + skillScore + requirementScore);

    return {
        score,
        breakdown: {
            interestScore,
            interestMax: INTEREST_MAX,
            skillScore,
            skillMax: SKILL_MAX,
            requirementScore: Math.round(requirementScore),
            requirementMax: REQUIREMENT_MAX,
        },
        gaps,
        overallEligibility: computeOverallEligibility(statuses),
    };
};
export type RequirementEligibilityStatus =
    | "ELIGIBLE"
    | "NOT_ELIGIBLE"
    | "POTENTIALLY_ELIGIBLE"
    | "INSUFFICIENT_INFORMATION";

export interface IRequirementEvaluation {
    requirementId: string;
    type: string;
    detail: string;
    minValue: number | null;
    status: RequirementEligibilityStatus;
    reason: string;
}

export interface IMatchBreakdown {
    interestScore: number;
    interestMax: number;
    skillScore: number;
    skillMax: number;
    requirementScore: number;
    requirementMax: number;
}

export interface IMatchResultComputed {
    score: number;
    breakdown: IMatchBreakdown;
    gaps: IRequirementEvaluation[];
    overallEligibility: RequirementEligibilityStatus;
}
import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { MatchingController } from "./matching.controller";

const router = Router();

router.get("/:opportunityId", auth(Role.STUDENT), MatchingController.getMatchResult);
router.post("/:opportunityId/recompute", auth(Role.STUDENT), MatchingController.recomputeMatchResult);
router.post("/:opportunityId/ai-explain", auth(Role.STUDENT), MatchingController.getAiMatchExplanation);
router.get(
    "/mentor/:studentProfileId/:opportunityId",
    auth(Role.MENTOR),
    MatchingController.getMatchResultForMentor,
);

export const MatchingRoutes = router;
export interface ICreateMentorAssignmentPayload {
    mentorId: string;
    studentId: string;
}
import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { MentorAssignmentController } from "./mentor-assignment.controller";
import { MentorAssignmentValidation } from "./mentor-assignment.validation";
import { requireApprovedMentor } from "../../middleware/requireApprovedMentor";

const router = Router();

router.post(
  "/",
  auth(Role.ADMIN),
  validateRequest(MentorAssignmentValidation.CreateMentorAssignmentZodSchema),
  MentorAssignmentController.assignMentorToStudent,
);

router.get("/", auth(Role.ADMIN), MentorAssignmentController.getAllAssignments);

router.delete(
  "/:id",
  auth(Role.ADMIN),
  MentorAssignmentController.removeMentorAssignment,
);

router.get(
  "/my-students",
  auth(Role.MENTOR),
  requireApprovedMentor,
  MentorAssignmentController.getMyAssignedStudents,
);

router.get(
  "/my-mentors",
  auth(Role.STUDENT),
  MentorAssignmentController.getMyMentors,
);

export const MentorAssignmentRoutes = router;

import z from "zod";

const CreateMentorAssignmentZodSchema = z.object({
    mentorId: z.uuid("Invalid Mentor ID"),
    studentId: z.uuid("Invalid Student ID"),
});

export const MentorAssignmentValidation = {
    CreateMentorAssignmentZodSchema,
};
export interface ICreateMentorFeedbackPayload {
    shortlistId?: string;
    applicationId?: string;
    comment: string;
}
import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { MentorFeedbackController } from "./mentor-feedback.controller";
import { MentorFeedbackValidation } from "./mentor-feedback.validation";

const router = Router();

router.post(
    "/",
    auth(Role.MENTOR),
    validateRequest(MentorFeedbackValidation.CreateMentorFeedbackZodSchema),
    MentorFeedbackController.createMentorFeedback,
);

router.get(
    "/shortlist/:shortlistId",
    auth(Role.STUDENT, Role.MENTOR),
    MentorFeedbackController.getFeedbackForShortlist,
);

router.get(
    "/application/:applicationId",
    auth(Role.STUDENT, Role.MENTOR),
    MentorFeedbackController.getFeedbackForApplication,
);

export const MentorFeedbackRoutes = router;
import z from "zod";

const CreateMentorFeedbackZodSchema = z
    .object({
        shortlistId: z.uuid().optional(),
        applicationId: z.uuid().optional(),
        comment: z.string().min(1).max(2000),
    })
    .refine((data) => data.shortlistId || data.applicationId, {
        message: "Either shortlistId or applicationId must be provided",
        path: ["shortlistId"],
    });

export const MentorFeedbackValidation = {
    CreateMentorFeedbackZodSchema,
};
import type { MentorVerificationStatus } from "../../../generated/prisma/enums";

export interface ICreateMentorPayload {
    name: string;
    email: string;
    bio?: string;
    expertise?: string[];
}

export interface IUpdateMentorProfilePayload {
    bio?: string;
    expertise?: string[];
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

export interface IApproveMentorPayload {
    mentorProfileId: string;
    verificationStatus: MentorVerificationStatus;
    rejectionReason?: string;
}

export interface IMentorApplicationStatus {
    emailVerified: boolean;
    verificationStatus: MentorVerificationStatus;
    rejectionReason: string | null;
}
import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { MentorProfileController } from "./mentor-profile.controller";
import { MentorProfileValidation } from "./mentor-profile.validation";

const router = Router();

router.post(
    "/apply",
    validateRequest(MentorProfileValidation.ApplyAsMentorZodSchema),
    MentorProfileController.applyAsMentor,
);

router.post(
    "/apply/verify-email",
    validateRequest(MentorProfileValidation.VerifyMentorEmailZodSchema),
    MentorProfileController.verifyMentorEmail,
);

router.get(
    "/apply/status/:email",
    MentorProfileController.getMentorApplicationStatus,
);

router.post(
    "/approve",
    auth(Role.ADMIN),
    validateRequest(MentorProfileValidation.ApproveMentorZodSchema),
    MentorProfileController.approveMentor,
);

router.post(
    "/",
    auth(Role.ADMIN),
    validateRequest(MentorProfileValidation.CreateMentorZodSchema),
    MentorProfileController.createMentorByAdmin,
);

router.get("/", auth(Role.ADMIN), MentorProfileController.getAllMentors);

router.get("/me", auth(Role.MENTOR), MentorProfileController.getMyMentorProfile);

router.patch(
    "/me",
    auth(Role.MENTOR),
    validateRequest(MentorProfileValidation.UpdateMentorProfileZodSchema),
    MentorProfileController.updateMyMentorProfile,
);

export const MentorProfileRoutes = router;
import z from "zod";
import { MentorVerificationStatus } from "../../../generated/prisma/enums";

const CreateMentorZodSchema = z.object({
    name: z.string().min(3).max(100),
    email: z.email("Invalid email"),
    bio: z.string().max(1000).optional(),
    expertise: z.array(z.string().min(1).max(50)).max(15).optional(),
});

const UpdateMentorProfileZodSchema = z.object({
    bio: z.string().max(1000).optional(),
    expertise: z.array(z.string().min(1).max(50)).max(15).optional(),
});

const ApplyAsMentorZodSchema = z.object({
    name: z.string().min(3).max(100),
    email: z.email("Invalid email"),
    institution: z.string().min(2).max(200).optional(),
    designation: z.string().min(2).max(150).optional(),
    contactNumber: z.string().min(5).max(20).optional(),
    bio: z.string().max(1000).optional(),
    expertise: z.array(z.string().min(1).max(50)).max(15).optional(),
});

const VerifyMentorEmailZodSchema = z.object({
    email: z.email("Invalid email"),
    otp: z.string().length(6, "OTP must be 6 digits"),
});

const ApproveMentorZodSchema = z
    .object({
        mentorProfileId: z.uuid("Invalid Mentor Profile ID"),
        verificationStatus: z.enum([
            MentorVerificationStatus.APPROVED,
            MentorVerificationStatus.REJECTED,
        ]),
        rejectionReason: z.string().min(5).max(500).optional(),
    })
    .refine(
        (data) =>
            data.verificationStatus !== MentorVerificationStatus.REJECTED ||
            !!data.rejectionReason,
        {
            message: "Rejection reason is required when rejecting a mentor application",
            path: ["rejectionReason"],
        },
    );

export const MentorProfileValidation = {
    CreateMentorZodSchema,
    UpdateMentorProfileZodSchema,
    ApplyAsMentorZodSchema,
    VerifyMentorEmailZodSchema,
    ApproveMentorZodSchema,
};
export enum ScheduleStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
    CANCELLED = "CANCELLED",
}

export enum BookingStatus {
    CONFIRMED = "CONFIRMED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export interface ICreateSchedulePayload {
    startDateTime: Date;
    endDateTime: Date;
    meetingLink: string;
}

export interface IUpdateSchedulePayload {
    startDateTime?: Date;
    endDateTime?: Date;
    meetingLink?: string;
}

export interface IBookSchedulePayload {
    scheduleId: string;
    applicationId?: string;
    topic?: string;
    notes?: string;
}

export interface IScheduleQuery {
    limit?: number | string;
    page?: number | string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    mentorId?: string;
    email?: string;
    status?: string;
    searchTerm?: string;
}

import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { MentorScheduleController } from "./mentor-schedule.controller";
import { MentorScheduleValidation } from "./mentor-schedule.validation";

const router = Router();

// Mentor endpoints
router.post(
    "/",
    auth(Role.MENTOR),
    validateRequest(MentorScheduleValidation.CreateScheduleValidationZodSchema),
    MentorScheduleController.createSchedule,
);

router.get("/me", auth(Role.MENTOR), MentorScheduleController.getMySchedules);

router.patch(
    "/:id",
    auth(Role.MENTOR),
    validateRequest(MentorScheduleValidation.UpdateScheduleValidationZodSchema),
    MentorScheduleController.updateSchedule,
);

router.delete("/:id", auth(Role.MENTOR), MentorScheduleController.deleteSchedule);

// Student booking endpoints (NO PAYMENT REQUIRED)
router.get(
    "/available",
    auth(Role.STUDENT, Role.MENTOR, Role.ADMIN),
    MentorScheduleController.getAllSchedules,
);

router.post(
    "/book",
    auth(Role.STUDENT),
    validateRequest(MentorScheduleValidation.BookScheduleValidationZodSchema),
    MentorScheduleController.bookInterviewSlot,
);

router.get(
    "/bookings/me",
    auth(Role.STUDENT),
    MentorScheduleController.getMyBookings,
);

router.get(
    "/:id",
    auth(Role.STUDENT, Role.MENTOR, Role.ADMIN),
    MentorScheduleController.getScheduleById,
);

export const MentorScheduleRoutes = router;

import { z } from "zod";

export const CreateScheduleValidationZodSchema = z.object({
    startDateTime: z.coerce.date(),
    endDateTime: z.coerce.date(),
    meetingLink: z.string().url("Invalid Meeting Link").trim(),
});

export const UpdateScheduleValidationZodSchema = z.object({
    startDateTime: z.coerce.date().optional(),
    endDateTime: z.coerce.date().optional(),
    meetingLink: z.string().url("Invalid Meeting Link").trim().optional(),
});

export const BookScheduleValidationZodSchema = z.object({
    scheduleId: z.string().uuid("Invalid Schedule ID"),
    applicationId: z.string().uuid("Invalid Application ID").optional(),
    topic: z.string().max(200).optional(),
    notes: z.string().max(1000).optional(),
});

export const MentorScheduleValidation = {
    CreateScheduleValidationZodSchema,
    UpdateScheduleValidationZodSchema,
    BookScheduleValidationZodSchema,
};

import type { OpportunityType } from "../../../generated/prisma/enums";

export interface ICreateOpportunityPayload {
    type: OpportunityType;
    title: string;
    universityId: string;
    professorId?: string;
    labId?: string;
    fieldOfStudy: string;
    deadline?: Date | string;
    source: string;
    lastCheckedAt: Date | string;
}

export interface IUpdateOpportunityPayload {
    type?: OpportunityType;
    title?: string;
    professorId?: string | null;
    labId?: string | null;
    fieldOfStudy?: string;
    deadline?: Date | string | null;
    source?: string;
    lastCheckedAt?: Date | string;
}

export interface IOpportunityFilters {
    searchTerm?: string;
    type?: OpportunityType;
    universityId?: string;
    fieldOfStudy?: string;
    country?: string;
    deadlineFrom?: string;
    deadlineTo?: string;
}
import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { OpportunityController } from "./opportunity.controller";
import { OpportunityValidation } from "./opportunity.validation";
import { RequirementRoutes } from "../requirement/requirement.route";

const router = Router();

router.post(
    "/",
    auth(Role.ADMIN),
    validateRequest(OpportunityValidation.CreateOpportunityZodSchema),
    OpportunityController.createOpportunity,
);

router.get(
    "/",
    auth(Role.STUDENT, Role.MENTOR, Role.ADMIN),
    OpportunityController.getAllOpportunities,
);

router.get(
    "/:id",
    auth(Role.STUDENT, Role.MENTOR, Role.ADMIN),
    OpportunityController.getOpportunityById,
);

router.patch(
    "/:id",
    auth(Role.ADMIN),
    validateRequest(OpportunityValidation.UpdateOpportunityZodSchema),
    OpportunityController.updateOpportunity,
);

router.delete("/:id", auth(Role.ADMIN), OpportunityController.deleteOpportunity);

router.get(
    "/:id/deadline-logs",
    auth(Role.ADMIN),
    OpportunityController.getDeadlineChangeLogs,
);

// Nested Requirement routes: /opportunities/:opportunityId/requirements
router.use("/:opportunityId/requirements", RequirementRoutes);

export const OpportunityRoutes = router;
import z from "zod";
import { OpportunityType } from "../../../generated/prisma/enums";

const CreateOpportunityZodSchema = z.object({
    type: z.enum(OpportunityType),
    title: z.string().min(3).max(300),
    universityId: z.uuid("Invalid University ID"),
    professorId: z.uuid("Invalid Professor ID").optional(),
    labId: z.uuid("Invalid Lab ID").optional(),
    fieldOfStudy: z.string().min(2).max(150),
    deadline: z.coerce.date().optional(),
    source: z.string().min(3).max(500),
    lastCheckedAt: z.coerce.date(),
});

const UpdateOpportunityZodSchema = z.object({
    type: z.enum(OpportunityType).optional(),
    title: z.string().min(3).max(300).optional(),
    professorId: z.uuid("Invalid Professor ID").nullable().optional(),
    labId: z.uuid("Invalid Lab ID").nullable().optional(),
    fieldOfStudy: z.string().min(2).max(150).optional(),
    deadline: z.coerce.date().nullable().optional(),
    source: z.string().min(3).max(500).optional(),
    lastCheckedAt: z.coerce.date().optional(),
});

export const OpportunityValidation = {
    CreateOpportunityZodSchema,
    UpdateOpportunityZodSchema,
};
export interface ICreateOutreachLogPayload {
    professorId?: string;
    opportunityId?: string;
    emailSentAt?: string;
    followUpAt?: string;
    notes?: string;
}

export interface IUpdateOutreachLogPayload {
    emailSentAt?: string | null;
    followUpAt?: string | null;
    notes?: string;
}

export interface IMarkReplyReceivedPayload {
    replyAt?: string;
}
import { Router } from "express";

import { OutreachLogValidation } from "./outreach-log.validation";
import { OutreachLogController } from "./outreach-log.controller";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
    "/",
    auth(Role.STUDENT),
    validateRequest(OutreachLogValidation.createOutreachLogZodSchema),
    OutreachLogController.createLog,
);

router.get("/", auth(Role.STUDENT), OutreachLogController.getMyLogs);

router.patch(
    "/:id",
    auth(Role.STUDENT),
    validateRequest(OutreachLogValidation.updateOutreachLogZodSchema),
    OutreachLogController.updateLog,
);

router.patch(
    "/:id/reply-received",
    auth(Role.STUDENT),
    validateRequest(OutreachLogValidation.markReplyReceivedZodSchema),
    OutreachLogController.markReplyReceived,
);

router.delete("/:id", auth(Role.STUDENT), OutreachLogController.deleteLog);

router.get(
    "/student/:studentProfileId",
    auth(Role.MENTOR),
    OutreachLogController.getLogsForMentor,
);

export const OutreachLogRoutes = router;
import { z } from "zod";

const createOutreachLogZodSchema = z.object({
    body: z.object({
        professorId: z.string().uuid().optional(),
        opportunityId: z.string().uuid().optional(),
        emailSentAt: z.string().datetime().optional(),
        followUpAt: z.string().datetime().optional(),
        notes: z.string().max(2000).optional(),
    }),
});

const updateOutreachLogZodSchema = z.object({
    body: z.object({
        emailSentAt: z.string().datetime().nullable().optional(),
        followUpAt: z.string().datetime().nullable().optional(),
        notes: z.string().max(2000).optional(),
    }),
});

const markReplyReceivedZodSchema = z.object({
    body: z.object({
        replyAt: z.string().datetime().optional(),
    }),
});

export const OutreachLogValidation = {
    createOutreachLogZodSchema,
    updateOutreachLogZodSchema,
    markReplyReceivedZodSchema,
};
export interface ICreateProfessorPayload {
    name: string;
    email?: string;
    universityId: string;
    labId?: string;
    researchAreas?: string[];
}

export interface IUpdateProfessorPayload {
    name?: string;
    email?: string;
    labId?: string | null;
    researchAreas?: string[];
}

export interface IProfessorFilters {
    searchTerm?: string;
    universityId?: string;
    labId?: string;
    researchArea?: string;
}
import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { ProfessorController } from "./professor.controller";
import { ProfessorValidation } from "./professor.validation";

const router = Router();

router.post(
    "/",
    auth(Role.ADMIN),
    validateRequest(ProfessorValidation.CreateProfessorZodSchema),
    ProfessorController.createProfessor,
);

router.get(
    "/",
    auth(Role.STUDENT, Role.MENTOR, Role.ADMIN),
    ProfessorController.getAllProfessors,
);

router.get(
    "/:id",
    auth(Role.STUDENT, Role.MENTOR, Role.ADMIN),
    ProfessorController.getProfessorById,
);

router.patch(
    "/:id",
    auth(Role.ADMIN),
    validateRequest(ProfessorValidation.UpdateProfessorZodSchema),
    ProfessorController.updateProfessor,
);

router.delete("/:id", auth(Role.ADMIN), ProfessorController.deleteProfessor);

export const ProfessorRoutes = router;
import z from "zod";

const CreateProfessorZodSchema = z.object({
    name: z.string().min(2).max(150),
    email: z.email("Invalid email").optional(),
    universityId: z.uuid("Invalid University ID"),
    labId: z.uuid("Invalid Lab ID").optional(),
    researchAreas: z.array(z.string().min(1).max(100)).max(20).optional(),
});

const UpdateProfessorZodSchema = z.object({
    name: z.string().min(2).max(150).optional(),
    email: z.email("Invalid email").optional(),
    labId: z.uuid("Invalid Lab ID").nullable().optional(),
    researchAreas: z.array(z.string().min(1).max(100)).max(20).optional(),
});

export const ProfessorValidation = {
    CreateProfessorZodSchema,
    UpdateProfessorZodSchema,
};
export interface ICreatePublicationPayload {
    title: string;
    venue?: string;
    year?: number;
    link?: string;
}

export interface IUpdatePublicationPayload {
    title?: string;
    venue?: string;
    year?: number;
    link?: string;
}
import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { PublicationController } from "./publication.controller";
import { PublicationValidation } from "./publication.validation";

const router = Router();

router.post(
    "/",
    auth(Role.STUDENT),
    validateRequest(PublicationValidation.CreatePublicationZodSchema),
    PublicationController.createPublication,
);

router.get("/", auth(Role.STUDENT), PublicationController.getMyPublications);

router.patch(
    "/:id",
    auth(Role.STUDENT),
    validateRequest(PublicationValidation.UpdatePublicationZodSchema),
    PublicationController.updatePublication,
);

router.delete("/:id", auth(Role.STUDENT), PublicationController.deletePublication);

export const PublicationRoutes = router;
import z from "zod";

const currentYear = new Date().getFullYear();

const CreatePublicationZodSchema = z.object({
    title: z.string().min(3).max(300),
    venue: z.string().max(200).optional(),
    year: z.number().int().min(1950).max(currentYear + 1).optional(),
    link: z.url("Invalid URL").optional(),
});

const UpdatePublicationZodSchema = z.object({
    title: z.string().min(3).max(300).optional(),
    venue: z.string().max(200).optional(),
    year: z.number().int().min(1950).max(currentYear + 1).optional(),
    link: z.url("Invalid URL").optional(),
});

export const PublicationValidation = {
    CreatePublicationZodSchema,
    UpdatePublicationZodSchema,
};
import type {
    IReadinessInput,
    IReadinessItem,
    IReadinessResult,
    ReadinessLevel,
} from "./readiness.interface";

interface IChecklistRule {
    key: string;
    label: string;
    max: number;
    test: (input: IReadinessInput) => boolean;
}

const CHECKLIST: IChecklistRule[] = [
    { key: "profile_basics", label: "Interests and skills added to profile", max: 10, test: (i) => i.hasProfileBasics },
    { key: "academic_records", label: "At least one academic record added", max: 10, test: (i) => i.academicRecordCount >= 1 },
    { key: "test_scores", label: "At least one test score added (IELTS/GRE/TOEFL/GMAT)", max: 15, test: (i) => i.testRecordCount >= 1 },
    { key: "publications", label: "At least one publication added", max: 5, test: (i) => i.publicationCount >= 1 },
    { key: "cv_uploaded", label: "CV uploaded", max: 10, test: (i) => i.hasCV },
    { key: "sop_uploaded", label: "Statement of Purpose uploaded", max: 10, test: (i) => i.hasSOP },
    { key: "document_approved", label: "At least one document approved by mentor", max: 5, test: (i) => i.hasApprovedDocument },
    { key: "shortlist", label: "At least one opportunity shortlisted", max: 10, test: (i) => i.shortlistCount >= 1 },
    { key: "application_started", label: "At least one application started", max: 5, test: (i) => i.applicationCount >= 1 },
    { key: "application_submitted", label: "At least one application submitted", max: 10, test: (i) => i.submittedApplicationCount >= 1 },
    { key: "recommendation_submitted", label: "At least one recommendation submitted", max: 5, test: (i) => i.submittedRecommendationCount >= 1 },
    { key: "cost_estimate", label: "Cost estimate created for an application", max: 3, test: (i) => i.costEstimateCount >= 1 },
    { key: "funding_awarded", label: "Funding awarded", max: 2, test: (i) => i.awardedFundingCount >= 1 },
];

export const computeReadiness = (input: IReadinessInput): IReadinessResult => {
    const items: IReadinessItem[] = CHECKLIST.map((rule) => {
        const completed = rule.test(input);
        return {
            key: rule.key,
            label: rule.label,
            earned: completed ? rule.max : 0,
            max: rule.max,
            completed,
        };
    });

    const totalScore = items.reduce((sum, item) => sum + item.earned, 0);

    const level: ReadinessLevel =
        totalScore >= 90
            ? "READY"
            : totalScore >= 70
                ? "NEARLY_READY"
                : totalScore >= 40
                    ? "IN_PROGRESS"
                    : "GETTING_STARTED";

    return { totalScore, level, items };
};
export interface IReadinessInput {
    hasProfileBasics: boolean; // interests + skills দুটোই অন্তত ১টা করে আছে
    academicRecordCount: number;
    testRecordCount: number;
    publicationCount: number;
    hasCV: boolean;
    hasSOP: boolean;
    hasApprovedDocument: boolean;
    shortlistCount: number;
    applicationCount: number;
    submittedApplicationCount: number;
    submittedRecommendationCount: number;
    costEstimateCount: number;
    awardedFundingCount: number;
}

export type ReadinessLevel =
    | "GETTING_STARTED"
    | "IN_PROGRESS"
    | "NEARLY_READY"
    | "READY";

export interface IReadinessItem {
    key: string;
    label: string;
    earned: number;
    max: number;
    completed: boolean;
}

export interface IReadinessResult {
    totalScore: number; // 0–100
    level: ReadinessLevel;
    items: IReadinessItem[];
}
import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { ReadinessController } from "./readiness.controller";
import { auth } from "../../middleware/checkAuth";

const router = Router();

router.get("/me", auth(Role.STUDENT), ReadinessController.getMyReadiness);
router.get(
    "/student/:studentProfileId",
    auth(Role.MENTOR),
    ReadinessController.getReadinessForMentor,
);

export const ReadinessRoutes = router;
import { OutreachStatus } from "../../../generated/prisma/enums";

export interface ICreateRecommendationRequestPayload {
    applicationId?: string;
    professorName: string;
    professorEmail?: string;
    followUpAt?: string;
}

export interface IUpdateRecommendationRequestPayload {
    professorName?: string;
    professorEmail?: string;
    followUpAt?: string | null;
}

export interface IUpdateRecommendationStatusPayload {
    status: OutreachStatus;
}
import { Router } from "express";

import { RecommendationRequestValidation } from "./recommendation-request.validation";
import { RecommendationRequestController } from "./recommendation-request.controller";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
    "/",
    auth(Role.STUDENT),
    validateRequest(RecommendationRequestValidation.createRecommendationRequestZodSchema),
    RecommendationRequestController.createRequest,
);

router.get("/", auth(Role.STUDENT), RecommendationRequestController.getMyRequests);

router.patch(
    "/:id",
    auth(Role.STUDENT),
    validateRequest(RecommendationRequestValidation.updateRecommendationRequestZodSchema),
    RecommendationRequestController.updateRequest,
);

router.patch(
    "/:id/status",
    auth(Role.STUDENT),
    validateRequest(RecommendationRequestValidation.updateRecommendationStatusZodSchema),
    RecommendationRequestController.updateStatus,
);

router.delete("/:id", auth(Role.STUDENT), RecommendationRequestController.deleteRequest);

router.get(
    "/student/:studentProfileId",
    auth(Role.MENTOR),
    RecommendationRequestController.getRequestsForMentor,
);

export const RecommendationRequestRoutes = router;
import { z } from "zod";
import { OutreachStatus } from "../../../generated/prisma/enums";

const createRecommendationRequestZodSchema = z.object({
    body: z.object({
        applicationId: z.string().uuid().optional(),
        professorName: z.string().min(2).max(150),
        professorEmail: z.string().email().optional(),
        followUpAt: z.string().datetime().optional(),
    }),
});

const updateRecommendationRequestZodSchema = z.object({
    body: z.object({
        professorName: z.string().min(2).max(150).optional(),
        professorEmail: z.string().email().optional(),
        followUpAt: z.string().datetime().nullable().optional(),
    }),
});

const updateRecommendationStatusZodSchema = z.object({
    body: z.object({
        status: z.nativeEnum(OutreachStatus),
    }),
});

export const RecommendationRequestValidation = {
    createRecommendationRequestZodSchema,
    updateRecommendationRequestZodSchema,
    updateRecommendationStatusZodSchema,
};
export interface ICreateReminderPayload {
    userId: string;
    relatedType: string; 
    relatedId: string;
    message: string;
}

export interface IReminderQuery {
    unreadOnly?: boolean;
    page?: number;
    limit?: number;
}
import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { ReminderController } from "./reminder.controller";
import { auth } from "../../middleware/checkAuth";

const router = Router();

router.get(
    "/",
    auth(Role.STUDENT, Role.MENTOR, Role.ADMIN),
    ReminderController.getMyReminders,
);
router.get(
    "/unread-count",
    auth(Role.STUDENT, Role.MENTOR, Role.ADMIN),
    ReminderController.getUnreadCount,
);
router.patch(
    "/read-all",
    auth(Role.STUDENT, Role.MENTOR, Role.ADMIN),
    ReminderController.markAllAsRead,
);
router.patch(
    "/:id/read",
    auth(Role.STUDENT, Role.MENTOR, Role.ADMIN),
    ReminderController.markAsRead,
);
router.delete(
    "/:id",
    auth(Role.STUDENT, Role.MENTOR, Role.ADMIN),
    ReminderController.deleteReminder,
);

export const ReminderRoutes = router;
import type { RequirementType } from "../../../generated/prisma/enums";

export interface ICreateRequirementPayload {
    type: RequirementType;
    detail: string;
    minValue?: number;
}

export interface IUpdateRequirementPayload {
    type?: RequirementType;
    detail?: string;
    minValue?: number;
}
import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { RequirementController } from "./requirement.controller";
import { RequirementValidation } from "./requirement.validation";

const router = Router({ mergeParams: true });

// POST /opportunities/:opportunityId/requirements
router.post(
    "/",
    auth(Role.ADMIN),
    validateRequest(RequirementValidation.CreateRequirementZodSchema),
    RequirementController.createRequirement,
);

// GET /opportunities/:opportunityId/requirements
router.get(
    "/",
    auth(Role.STUDENT, Role.MENTOR, Role.ADMIN),
    RequirementController.getRequirementsByOpportunity,
);

// GET /opportunities/:opportunityId/requirements/:requirementId
router.get(
    "/:requirementId",
    auth(Role.STUDENT, Role.MENTOR, Role.ADMIN),
    RequirementController.getRequirementById,
);

// PATCH /opportunities/:opportunityId/requirements/:requirementId
router.patch(
    "/:requirementId",
    auth(Role.ADMIN),
    validateRequest(RequirementValidation.UpdateRequirementZodSchema),
    RequirementController.updateRequirement,
);

// DELETE /opportunities/:opportunityId/requirements/:requirementId
router.delete(
    "/:requirementId",
    auth(Role.ADMIN),
    RequirementController.deleteRequirement,
);

export const RequirementRoutes = router;
import z from "zod";
import { RequirementType } from "../../../generated/prisma/enums";

const CreateRequirementZodSchema = z.object({
    type: z.enum(RequirementType),
    detail: z.string().min(2).max(500),
    minValue: z.number().optional(),
});

const UpdateRequirementZodSchema = z.object({
    type: z.enum(RequirementType).optional(),
    detail: z.string().min(2).max(500).optional(),
    minValue: z.number().optional(),
});

export const RequirementValidation = {
    CreateRequirementZodSchema,
    UpdateRequirementZodSchema,
};
export interface ICreateShortlistPayload {
    opportunityId: string;
    notes?: string;
}

export interface IUpdateShortlistPayload {
    notes?: string;
}
import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { ShortlistController } from "./shortlist.controller";
import { ShortlistValidation } from "./shortlist.validation";

const router = Router();

router.post(
    "/",
    auth(Role.STUDENT),
    validateRequest(ShortlistValidation.CreateShortlistZodSchema),
    ShortlistController.addToShortlist,
);

router.get("/", auth(Role.STUDENT), ShortlistController.getMyShortlist);
router.get("/compare", auth(Role.STUDENT), ShortlistController.compareShortlistItems);

router.patch(
    "/:id",
    auth(Role.STUDENT),
    validateRequest(ShortlistValidation.UpdateShortlistZodSchema),
    ShortlistController.updateShortlistNotes,
);

router.delete("/:id", auth(Role.STUDENT), ShortlistController.removeFromShortlist);

router.get(
    "/student/:studentProfileId",
    auth(Role.MENTOR),
    ShortlistController.getStudentShortlistForMentor,
);

export const ShortlistRoutes = router;
import z from "zod";

const CreateShortlistZodSchema = z.object({
    opportunityId: z.uuid("Invalid Opportunity ID"),
    notes: z.string().max(2000).optional(),
});

const UpdateShortlistZodSchema = z.object({
    notes: z.string().max(2000).optional(),
});

export const ShortlistValidation = {
    CreateShortlistZodSchema,
    UpdateShortlistZodSchema,
};
export interface IUpdateStudentProfilePayload {
  interests?: string[];
  skills?: string[];
}

export interface IProfileCompleteness {
  percentage: number;
  breakdown: {
    academics: { score: number; max: number; done: boolean };
    interestsAndSkills: { score: number; max: number; done: boolean };
    documents: { score: number; max: number; done: boolean };
    tests: { score: number; max: number; done: boolean };
    publications: { score: number; max: number; done: boolean };
  };
}

import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { StudentProfileController } from "./student-profile.controller";
import { StudentProfileValidation } from "./student-profile.validation";

const router = Router();

router.get(
    "/me",
    auth(Role.STUDENT),
    StudentProfileController.getMyProfile,
);

router.patch(
    "/me",
    auth(Role.STUDENT),
    validateRequest(StudentProfileValidation.UpdateStudentProfileZodSchema),
    StudentProfileController.updateMyProfile,
);

router.get(
    "/me/completeness",
    auth(Role.STUDENT),
    StudentProfileController.getMyCompleteness,
);

router.get(
    "/:studentProfileId",
    auth(Role.MENTOR, Role.ADMIN),
    StudentProfileController.getStudentProfileForMentor,
);

export const StudentProfileRoutes = router;
import z from "zod";

const UpdateStudentProfileZodSchema = z.object({
    interests: z
        .array(z.string().min(1).max(50))
        .max(20, "Maximum 20 interests allowed")
        .optional(),
    skills: z
        .array(z.string().min(1).max(50))
        .max(20, "Maximum 20 skills allowed")
        .optional(),
});

export const StudentProfileValidation = {
    UpdateStudentProfileZodSchema,
};
import type { TestType } from "../../../generated/prisma/enums";

export interface ITestScore {
    overall: number;
    [section: string]: number | undefined;
}

export interface ICreateTestRecordPayload {
    testType: TestType;
    score?: ITestScore;
    plannedDate?: Date;
    actualDate?: Date;
}

export interface IUpdateTestRecordPayload {
    score?: ITestScore;
    plannedDate?: Date;
    actualDate?: Date;
}
import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { TestRecordController } from "./test-record.controller";
import { TestRecordValidation } from "./test-record.validation";

const router = Router();

router.post(
    "/",
    auth(Role.STUDENT),
    validateRequest(TestRecordValidation.CreateTestRecordZodSchema),
    TestRecordController.createTestRecord,
);

router.get("/", auth(Role.STUDENT), TestRecordController.getMyTestRecords);

router.patch(
    "/:id",
    auth(Role.STUDENT),
    validateRequest(TestRecordValidation.UpdateTestRecordZodSchema),
    TestRecordController.updateTestRecord,
);

router.delete("/:id", auth(Role.STUDENT), TestRecordController.deleteTestRecord);

export const TestRecordRoutes = router;
import z from "zod";
import { TestType } from "../../../generated/prisma/enums";

// Higher-is-better for all current test types in MVP (PRD AC5, FR-05)
const scoreRangeByTestType: Record<string, { min: number; max: number }> = {
    IELTS: { min: 0, max: 9 },
    TOEFL: { min: 0, max: 120 },
    GRE: { min: 260, max: 340 },
    GMAT: { min: 200, max: 800 },
    OTHER: { min: 0, max: 100000 },
};

const ScoreZodSchema = z.object({ overall: z.number() }).catchall(z.number());

const CreateTestRecordZodSchema = z
    .object({
        testType: z.nativeEnum(TestType),
        score: ScoreZodSchema.optional(),
        plannedDate: z.coerce.date().optional(),
        actualDate: z.coerce.date().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.score) {
            const range = scoreRangeByTestType[data.testType] ?? scoreRangeByTestType.OTHER;
            if (data.score.overall < range!.min || data.score.overall > range!.max) {
                ctx.addIssue({
                    code: "custom",
                    message: `${data.testType} overall score must be between ${range!.min} and ${range!.max}`,
                    path: ["score", "overall"],
                });
            }
        }
    });

const UpdateTestRecordZodSchema = z.object({
    score: ScoreZodSchema.optional(),
    plannedDate: z.coerce.date().optional(),
    actualDate: z.coerce.date().optional(),
});

export const TestRecordValidation = {
    CreateTestRecordZodSchema,
    UpdateTestRecordZodSchema,
};
export interface ICreateUniversityPayload {
    name: string;
    country: string;
    website?: string;
}

export interface IUpdateUniversityPayload {
    name?: string;
    country?: string;
    website?: string;
}

export interface IUniversityFilters {
    searchTerm?: string;
    country?: string;
}
import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { UniversityController } from "./university.controller";
import { UniversityValidation } from "./university.validation";

const router = Router();

router.post(
    "/",
    auth(Role.ADMIN),
    validateRequest(UniversityValidation.CreateUniversityZodSchema),
    UniversityController.createUniversity,
);

router.get(
    "/",
    auth(Role.STUDENT, Role.MENTOR, Role.ADMIN),
    UniversityController.getAllUniversities,
);

router.get(
    "/:id",
    auth(Role.STUDENT, Role.MENTOR, Role.ADMIN),
    UniversityController.getUniversityById,
);

router.patch(
    "/:id",
    auth(Role.ADMIN),
    validateRequest(UniversityValidation.UpdateUniversityZodSchema),
    UniversityController.updateUniversity,
);

router.delete("/:id", auth(Role.ADMIN), UniversityController.deleteUniversity);

export const UniversityRoutes = router;
import z from "zod";

const CreateUniversityZodSchema = z.object({
    name: z.string().min(2).max(200),
    country: z.string().min(2).max(100),
    website: z.url("Invalid URL").optional(),
});

const UpdateUniversityZodSchema = z.object({
    name: z.string().min(2).max(200).optional(),
    country: z.string().min(2).max(100).optional(),
    website: z.url("Invalid URL").optional(),
});

export const UniversityValidation = {
    CreateUniversityZodSchema,
    UpdateUniversityZodSchema,
};

