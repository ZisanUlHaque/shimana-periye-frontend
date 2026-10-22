# PUB GradPath — Frontend Product Requirements Document (PRD) & Engineering Guide
### Higher-Study Discovery and Application Workspace (Problem Set D2)
**Version:** 1.0 (Hackathon & Production Edition)  
**Target Platform:** Web (Desktop-first, Responsive Tablet & Mobile)  
**Backend API Specification:** Complete ShimanaPeriye REST API (`/api/v1`)  
**Status:** Canonical Implementation Guide for Frontend Developers

---

## 1. Executive Summary & Product Vision

### 1.1 The Problem
Prospective graduate students targeting Master's, PhD, and research scholarships abroad face severe information fragmentation. They track universities, professors, deadlines, standardized test cutoffs, and funding opportunities across dozens of browser tabs and messy spreadsheets. Consequently:
- Critical application requirements are overlooked.
- Recommendation letters are requested late.
- Financial costs (tuition + living + visa) are severely underestimated.
- Document feedback (SOP/CV) from mentors is disorganized.

### 1.2 The Solution: PUB GradPath
A unified, intelligent higher-study workspace that combines:
1. **Academic Profile Hub:** Comprehensive records of education, experience, publications, test scores, and research interests.
2. **Transparent Opportunity Discovery:** Filterable database of programmes, universities, professors, and labs—each with clear data source attribution and a `lastCheckedDate`.
3. **Deterministic Match & AI Explainer:** Algorithmic fit score (0–100%) paired with on-demand AI explanations that outline strengths and concrete requirement gaps.
4. **Side-by-Side Comparison Matrix:** Compare shortlisted programs across fit, tuition, living costs, funding, deadlines, and mentor feedback.
5. **Dynamic Application Checklist & Outcomes:** Milestone tracking, task dependencies, submission records, interview dates, and decision deadlines.
6. **Collaborative Document Studio:** Version-controlled SOP and CV management with mentor annotations and automated AI rubric scoring.
7. **Dual-Mode Interview Preparation:** Instant 24/7 AI mock interview simulator + 1-on-1 mentor live interview booking (Google Meet with zero-payment).
8. **Financial Calculator:** Dynamic net-cost calculator (Tuition + Living + Travel - Scholarships) with currency switching.
9. **Unified Calendar Sync:** Interactive FullCalendar interface with 1-click RFC 5545 `.ics` export for Google Calendar, Apple Calendar, and Outlook.

---

## 2. Technical Stack & Frontend Architecture

### 2.1 Recommended Tech Stack
- **Framework:** Next.js 14+ (App Router) or React 18/19 with Vite + TypeScript
- **Styling:** Tailwind CSS with CSS Variables for theme tokens
- **Component Primitives:** `shadcn/ui` (built on Radix UI primitives)
- **Icons:** `lucide-react`
- **Data Fetching & Cache:** `@tanstack/react-query` (v5) + `axios`
- **Form Management:** `react-hook-form` + `zod` for client-side schema validation
- **Calendar Visualization:** `@fullcalendar/react` (`@fullcalendar/daygrid`, `@fullcalendar/timegrid`, `@fullcalendar/interaction`)
- **Charts & Metrics:** `recharts` (Radar charts for readiness, Bar charts for financial cost comparisons)
- **Notifications & Modals:** `sonner` (rich toast notifications)
- **Markdown Rendering:** `react-markdown` + `remark-gfm` (for AI feedback & SOP rendering)

### 2.2 Environment Variables Configuration
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_NAME="PUB GradPath"
NEXT_PUBLIC_CALENDAR_EXPORT_URL=http://localhost:5000/api/v1/calendar/export.ics
```

### 2.3 Directory Structure
```
src/
├── app/                              # Next.js App Router routes
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx                # Shared sidebar, topbar, command palette
│   │   ├── dashboard/page.tsx        # Overview, readiness gauge, task alerts
│   │   ├── profile/page.tsx          # Education, experience, pubs, tests
│   │   ├── explore/page.tsx          # Search opportunities, fit badges
│   │   ├── explore/[id]/page.tsx     # Opportunity detail + AI match drawer
│   │   ├── shortlist/page.tsx        # Saved list + comparison matrix
│   │   ├── applications/page.tsx     # Kanban & table view of submissions
│   │   ├── applications/[id]/page.tsx# Task checklist & outcome timeline
│   │   ├── documents/page.tsx        # SOP/CV vault, versions & AI review
│   │   ├── interviews/page.tsx       # Dual station: AI mock + mentor meet
│   │   ├── outreach/page.tsx         # Professor emails & recommendation tracker
│   │   ├── finances/page.tsx         # Cost estimator & scholarship tracker
│   │   ├── calendar/page.tsx         # FullCalendar & iCal export
│   │   └── readiness/page.tsx        # Overall readiness & gap audit
│   └── (mentor)/
│       ├── mentor/dashboard/page.tsx # Mentor overview & assigned mentees
│       ├── mentor/reviews/page.tsx   # Document review queue
│       └── mentor/schedules/page.tsx # Create & manage Google Meet slots
├── components/
│   ├── ui/                           # shadcn primitives (button, dialog, etc.)
│   ├── shared/                       # Navbar, Sidebar, UserMenu, StatCard
│   ├── modules/                      # Feature-specific components
│   │   ├── profile/                  # ExperienceModal, AcademicTable, etc.
│   │   ├── explore/                  # OpportunityCard, FilterBar, AiMatchDrawer
│   │   ├── shortlist/                # ComparisonTable, PriorityBadge
│   │   ├── applications/             # TaskChecklist, OutcomeStepper
│   │   ├── documents/                # DocumentViewer, AiFeedbackModal
│   │   ├── interviews/               # AiMockStation, MentorBookingCard
│   │   └── calendar/                 # CalendarView, IcalExportButton
├── hooks/                            # Custom React Query hooks
├── lib/
│   ├── api.ts                        # Axios instance with auth interceptors
│   ├── utils.ts                      # Formatting, date calculations, clsx
│   └── constants.ts                  # Enums, navigation links, currencies
└── types/                            # TypeScript interfaces matching backend models
```

---

## 3. Design System & UX Principles

### 3.1 Color Palette
- **Primary / Brand:** Deep Academic Navy (`#0F172A` / `#1E293B`) — authoritative, clean.
- **Accent / Intelligence:** Electric Indigo (`#4F46E5` / `#6366F1`) — used for AI features, primary CTAs, and fit badges.
- **Success / High Match:** Emerald (`#10B981` / `#059669`) — match scores >= 80%, completed tasks, approved documents.
- **Warning / Moderate Gap:** Amber (`#F59E0B` / `#D97706`) — match scores 50–79%, pending tasks, upcoming deadlines (< 7 days).
- **Destructive / High Gap:** Crimson (`#EF4444` / `#DC2626`) — missing hard requirements, rejected applications, overdue tasks.
- **Background / Card:** Slate Light (`#F8FAFC` / `#FFFFFF`) with dark-mode support (`#0B0F17` / `#161E2E`).

### 3.2 Visual Badges & Status Indicators
- **Data Source & Verification:**
  - `Source: MIT EECS Portal` (Clickable source pill)
  - `Verified: 2 days ago` (Green/Gray clock pill to satisfy Problem Statement rule #2)
- **Match Fit Badge:**
  - `92% Fit` (Green glow pill)
  - `65% Fit` (Amber pill)
  - `35% Fit` (Gray/Red pill)
- **Application Stage Pills:**
  - `SHORTLISTED` (Blue) → `PREPARING` (Purple) → `SUBMITTED` (Yellow) → `INTERVIEW` (Orange) → `OFFER` (Emerald) → `DECIDED` (Slate)

---

## 4. User Roles & Access Control

1. **Student / Applicant:**
   - Full access to profile builder, opportunity search, matching, shortlisting, application checklists, document uploads, AI review, mentor booking, and financial calculations.
2. **Mentor:**
   - Access to assigned mentees, document review studio (leave comments/rubric), and mentor schedule slot manager (set available Google Meet slots).
3. **Administrator:**
   - Opportunity management (add/edit programs, update verification dates, edit requirements), university/professor directories, and user account management.

---

## 5. Detailed Page-by-Page Specifications

### 5.1 Authentication & Onboarding (`/login`, `/register`)
- **Key Features:**
  - Role selection switcher (`Student` vs. `Mentor`).
  - JWT token storage (Secure cookie or `localStorage` with auto-refresh mechanism).
  - First-time student onboarding wizard: prompts for target degree (`MASTERS`, `PHD`), primary field of study, and undergrad CGPA to immediately unlock match recommendations.

---

### 5.2 Student Dashboard (`/dashboard`)
- **Purpose:** Central command center giving a 10-second summary of everything happening.
- **Key UI Widgets:**
  1. **Readiness Score Banner:** Circular progress ring showing overall readiness (0–100%) with a quick breakdown: Profile Completeness, Document Readiness, Tests, Checklists.
  2. **Urgent Deadline Countdown:** Cards sorted by urgency (e.g., `Stanford CS PhD: Deadline in 4 days`).
  3. **Action Items / Task Widget:** Top 5 upcoming checklist tasks across all active applications with direct toggle checkboxes.
  4. **Active Interviews Widget:**
     - AI practice shortcut ("Take Mock Interview").
     - Confirmed Mentor Live sessions with Google Meet direct join button.
  5. **Recent Mentor Feedback:** Quick preview of new comments on uploaded SOPs or CVs.

---

### 5.3 Student Profile Hub (`/profile`)
- **Purpose:** Fulfills Requirement 1 of the Problem Set.
- **Layout:** Vertical tab navigation:
  - **Tab 1: Basic Info & Interests:** Target degree, primary research fields, specific research tags (e.g., `NLP`, `Computer Vision`, `Robotics`), and technical skills.
  - **Tab 2: Academic Background:** Table of degrees (BSc, MSc), institutions, majors, graduation years, CGPA, and GPA scales.
  - **Tab 3: Professional & Research Experience:** Work/Lab experience with title, institution/company, location, date range, current role flag, and responsibilities.
  - **Tab 4: Publications:** List of research papers (title, journal/conference, DOI link, publication date, authors list, citation count).
  - **Tab 5: Standardized Tests:** IELTS, TOEFL, GRE, GMAT with sectional scores (e.g., GRE Quant: 168, Verbal: 156, AWA: 4.5) and upcoming planned test dates.
- **Completeness Tracker:** Live progress meter indicating which sections are incomplete (e.g., *"Add your GRE test record to reach 100% profile score"*).

---

### 5.4 Opportunity Discovery & Explorer (`/explore`, `/explore/[id]`)
- **Purpose:** Fulfills Requirement 2 & 3.
- **Explorer List View (`/explore`):**
  - **Global Search:** University name, program title, professor name, or country.
  - **Filters:** Degree level (`MASTERS`, `PHD`), Funding availability (`FULLY_FUNDED`, `PARTIAL`), Minimum GPA, Country, Field.
  - **Opportunity Card:**
    - Title, University, Location, Application Deadline.
    - Match Fit Score Badge (e.g., `88% Match`).
    - Requirement Tags (Min GPA: 3.5, IELTS: 7.0, GRE: Optional).
    - Source Attribution & Verification Date: `Source: Official Portal | Verified: Oct 12, 2026`.
    - Action Buttons: `Add to Shortlist`, `Quick View`, `View Details`.
- **Opportunity Detail View (`/explore/[id]`):**
  - Full program overview, lab affiliation, advising professor profile.
  - Associated funding packages and average living cost estimates.
  - **AI Match & Gap Drawer (Slide-out panel):**
    - Triggered by clicking `Explain Match with AI`.
    - Displays green checklist for met requirements (GPA, degree match).
    - Amber/Red badges for gaps (e.g., *"Your IELTS score of 6.5 is below the departmental minimum of 7.0"*).
    - Actionable recommendation generated by AI to overcome the gap.

---

### 5.5 Shortlist & Comparison Matrix (`/shortlist`, `/shortlist/compare`)
- **Purpose:** Fulfills Requirement 4.
- **Shortlist View:**
  - Cards sorted by student priority (`HIGH`, `MEDIUM`, `LOW`).
  - Personal notes textarea per opportunity.
  - Mentor feedback summary pill (e.g., *"Mentor Approved"* or *"3 notes from Dr. Rahman"*).
  - Multi-select checkbox enabling the `Compare Selected (Max 4)` floating action bar.
- **Side-by-Side Comparison Matrix (`/shortlist/compare`):**
  - Table grid comparing up to 4 shortlisted programs across:
    1. **Research Fit Score:** Algorithmic match percentage.
    2. **Academic Requirements:** Minimum GPA, required tests, prerequisite coursework.
    3. **Funding & Scholarships:** Stipend amount, tuition waiver status, TA/RA availability.
    4. **Estimated Financial Cost:** Net annual out-of-pocket expenses.
    5. **Application Deadlines:** Days remaining countdown.
    6. **Mentor Feedback:** Latest evaluation notes from assigned mentor.

---

### 5.6 Applications Workspace (`/applications`, `/applications/[id]`)
- **Purpose:** Fulfills Requirements 6 & 10.
- **Overview Page:**
  - Switch between **Kanban Board** (columns: `Draft`, `Submitted`, `Interview`, `Accepted`, `Waitlisted`, `Rejected`) and **Structured Table**.
- **Application Detail Workspace (`/applications/[id]`):**
  - **Top Banner:** Program title, university, application deadline, current stage, and target intake term.
  - **Checklist & Task Manager:**
    - Hierarchical tasks with due dates, priority, and dependency tags (e.g., *"Request Transcript must be completed before Submit Portal"*).
    - Inline task completion toggle.
    - "Add Reminder" button to trigger automated email/dashboard alerts.
  - **Milestone Outcome Tracker:**
    - Recorded submission date & confirmation number.
    - Interview scheduled date & outcome.
    - Formal admission decision record.
    - Offer response deadline countdown (with danger alert when < 3 days).

---

### 5.7 Document Studio & AI SOP Reviewer (`/documents`)
- **Purpose:** Fulfills Requirement 7 & Optional Feature 2.
- **Document Vault:**
  - Grid or list view of documents categorized by type: `SOP`, `CV`, `RESEARCH_PROPOSAL`, `PORTFOLIO`.
  - Version history badge (e.g., `v3`, `v2`, `v1`) with quick reversion or comparison.
  - Review Status Badge: `DRAFT`, `UNDER_REVIEW`, `CHANGES_REQUESTED`, `APPROVED`.
- **Document Detail & Review Canvas:**
  - Left pane: Document text reader or embedded PDF preview.
  - Right pane: Mentor comments thread with timestamp and specific line references.
  - **AI SOP Review Studio (Modal / Tab):**
    - Click `Run AI Evaluation` button.
    - Returns structured rubric:
      - **Clarity & Academic Tone:** Score (1–10) + feedback.
      - **Research Fit & Specificity:** Score (1–10) + feedback.
      - **Structure & Flow:** Score (1–10) + feedback.
      - **Strengths:** Bulleted list of standout sections.
      - **Weaknesses & Blindspots:** Specific paragraphs needing revision.
      - **Actionable Revision Suggestions:** Concrete rewriting ideas.

---

### 5.8 Dual Interview Hub (`/interviews`)
- **Purpose:** Fulfills Problem Set Optional Feature 3 and Mentor Mentorship Architecture.
- **Dual Tab Architecture:**

#### Tab A: AI Mock Interview Simulator
- **Trigger:** Select an active application (e.g., *Carnegie Mellon MS CS*).
- **Step 1 — Generate:** Click `Start AI Practice`. Backend generates 5 customized technical and behavioral questions tailored to the student's profile and program description.
- **Step 2 — Answer:** Interactive response cards with question text, contextual preparation hints, and rich text answer fields.
- **Step 3 — Instant Rubric Evaluation:**
  - Click `Submit for AI Evaluation`.
  - Displays instant overall score (0–100).
  - Detailed criteria breakdown:
    - Academic Readiness & Technical Depth (0–25)
    - Communication & Articulation (0–25)
    - Research Alignment & Motivation (0–25)
    - Handling Difficult Questions (0–25)
  - Actionable feedback and key improvements for future real interviews.

#### Tab B: Mentor Live 1-on-1 Interview Booking (Google Meet)
- **Concept:** Academic mentorship booking with **zero payment**.
- **Mentor Selection:** Filter by research area or view assigned mentor.
- **Slot Picker:** Interactive weekly calendar showing available 30-minute slots created by the mentor.
- **Booking Modal:**
  - Form field: Notes / focus areas (e.g., *"Mock interview for Stanford CS PhD research proposal"*).
  - Click `Confirm Booking (Free)`.
  - Success screen displays:
    - Confirmed date & time.
    - Dedicated Google Meet link (`https://meet.google.com/...`).
    - Confirmation that a calendar invite and email have been dispatched.
- **My Bookings View:** Active bookings with `Join Meeting` button and `Cancel Booking` option.

---

### 5.9 Professor Outreach & Recommendation Tracker (`/outreach`)
- **Purpose:** Fulfills Requirement 8.
- **Sub-View 1: Recommendation Requests:**
  - Table of recommenders (Professor name, institution, email, relationship).
  - Associated applications and due dates.
  - Status pills: `DRAFTED` → `REQUESTED` → `FOLLOWED_UP` → `SUBMITTED`.
  - "Send Reminder Follow-up" log.
- **Sub-View 2: Cold Email & Outreach Log:**
  - Table tracking emails sent to prospective research advisors.
  - Fields: Professor Name, University, Lab, Date Contacted, Email Subject, Response Status (`AWAITING_REPLY`, `POSITIVE`, `NEUTRAL`, `NO_REPLY`, `INTERVIEW_OFFERED`), Follow-up Due Date.
  - Overdue follow-up alert tags.

---

### 5.10 Financial Planner & Cost Estimator (`/finances`)
- **Purpose:** Fulfills Requirement 9.
- **Interactive Calculator:**
  - Select an opportunity or create a custom estimate.
  - **Expense Inputs:**
    - Tuition Fees (Annual)
    - Estimated Living Expenses (Housing, food, insurance)
    - Travel & Visa Costs (One-time)
  - **Funding / Offsets:**
    - Awarded Scholarships / Fellowships
    - Graduate Assistantship (TA/RA) stipends
  - **Dynamic Summary Card:**
    - Total Gross Cost
    - Total Secured Funding
    - **Net Out-of-Pocket Expense** (Highlighted in bold)
  - **Currency Switcher:** Toggle between `USD ($)`, `EUR (€)`, `GBP (£)`, `CAD ($)`, and `BDT (৳)` with stated assumption notes.

---

### 5.11 Application Readiness & Audit View (`/readiness`)
- **Purpose:** Fulfills Requirement 10.
- **Visual Breakdown:**
  - **Composite Readiness Score (0–100%):** Weighted score combining profile completeness (20%), test score validation (20%), document readiness (20%), checklist progress (20%), and recommendation security (20%).
  - **Radar / Spider Chart:** 5-axis representation showing where the student is strong (e.g., Research & Tests) vs. lagging (e.g., Recommendations & SOP Review).
  - **Readiness Checklist Table:** Direct links to resolve any red flags before final submission.

---

### 5.12 Calendar & Deadline Hub (`/calendar`)
- **Purpose:** Fulfills Optional Feature 5.
- **Interactive FullCalendar Component:**
  - Monthly, Weekly, and Agenda views.
  - Color-coded event markers:
    - Red: University Hard Application Deadlines
    - Blue: Application Checklist Tasks
    - Amber: Standardized Test Dates (IELTS / GRE)
    - Green: Confirmed Mentor Google Meet Live Sessions
- **Live Sync Button (`Subscribe to Calendar`):**
  - Generates a live `webcal://` or `.ics` export link (`GET /api/v1/calendar/export.ics`).
  - Allows 1-click subscription into Google Calendar, Apple Calendar, or Microsoft Outlook.

---

## 6. Mentor & Admin Workspaces

### 6.1 Mentor Portal (`/mentor/*`)
- **Dashboard (`/mentor/dashboard`):** Overview of assigned mentees, upcoming booked Google Meet sessions, and pending document reviews.
- **Document Review Workspace (`/mentor/reviews`):** Queue of submitted SOPs/CVs. Click to view document, add inline line comments, rate against academic rubrics, and toggle status to `APPROVED` or `CHANGES_REQUESTED`.
- **Availability Scheduler (`/mentor/schedules`):**
  - Interface to generate open 30-minute interview slots across selected date ranges and time windows.
  - Set default Google Meet link for all auto-generated slots.

### 6.2 Admin Portal (`/admin/*`)
- **Opportunity Management (`/admin/opportunities`):** Create and update opportunity records with program title, department, application deadline, source URL, and `lastCheckedDate`.
- **Requirement Rules Builder:** Configure GPA, IELTS, GRE, and prerequisite rules for opportunities.
- **Directory Manager:** CRUD for Universities, Professors, and Research Labs.

---

## 7. Frontend API Contract & Integration Reference

All authenticated requests must include:  
`headers: { Authorization: "Bearer " + accessToken }`

| Module | Method | Endpoint | Description |
|---|---|---|---|
| **Auth** | `POST` | `/auth/login` | Log in user (`{ email, password }`) |
| **Auth** | `POST` | `/auth/register` | Register user (`{ name, email, password, role }`) |
| **Auth** | `GET` | `/auth/me` | Fetch authenticated user profile & role |
| **Profile** | `GET` | `/student-profile/my` | Fetch student profile + completeness % |
| **Profile** | `PATCH` | `/student-profile/my` | Update target degree, bio, interests, skills |
| **Academics** | `GET` | `/academic-records/my` | Get all academic degrees |
| **Academics** | `POST` | `/academic-records` | Add degree (`{ institution, degree, field, cgpa, scale }`) |
| **Experience** | `GET` | `/experiences/my` | Get student work & research experiences |
| **Experience** | `POST` | `/experiences` | Add experience (`{ title, company, startDate, isCurrent... }`) |
| **Publications** | `GET` | `/publications/my` | Get research publications |
| **Publications** | `POST` | `/publications` | Add publication (`{ title, journal, doi, publicationDate... }`) |
| **Tests** | `GET` | `/test-records/my` | Get test records (IELTS, GRE, etc.) |
| **Tests** | `POST` | `/test-records` | Add test record (`{ testType, overallScore, testDate... }`) |
| **Opportunities** | `GET` | `/opportunities` | Search opportunities (`?search=&type=&page=&limit=`) |
| **Opportunities** | `GET` | `/opportunities/:id` | Get opportunity details, requirements, lab & professor |
| **Matching** | `GET` | `/matching/my-matches` | Pre-calculated fit scores & gap lists for all programs |
| **Matching** | `POST` | `/matching/:id/ai-explain` | AI explanation of fit score, strengths & missing gaps |
| **Shortlist** | `POST` | `/shortlist` | Save opportunity (`{ opportunityId, notes, priority }`) |
| **Shortlist** | `GET` | `/shortlist/my` | Fetch student's shortlisted opportunities |
| **Shortlist** | `GET` | `/shortlist/compare?ids=id1,id2` | Side-by-side comparison matrix |
| **Applications** | `GET` | `/applications/my` | Get all active applications with stages |
| **Applications** | `POST` | `/applications` | Start tracking application (`{ opportunityId, targetTerm }`) |
| **Applications** | `PATCH` | `/applications/:id` | Update status, interview date, submission, decision |
| **Tasks** | `GET` | `/applications/:id/tasks` | Get checklist tasks for an application |
| **Tasks** | `POST` | `/applications/:id/tasks` | Create application task (`{ title, deadline, priority }`) |
| **Tasks** | `PATCH` | `/applications/:id/tasks/:taskId` | Toggle task completion status |
| **Documents** | `GET` | `/documents/my` | Fetch uploaded documents (SOP, CV, etc.) |
| **Documents** | `POST` | `/documents` | Upload document (`{ title, type, content, fileUrl }`) |
| **Documents** | `POST` | `/documents/:id/ai-feedback` | Run AI SOP Review & scoring rubric |
| **AI Interview** | `POST` | `/interview-practice/:appId/generate` | Generate 5 tailored mock interview questions |
| **AI Interview** | `POST` | `/interview-practice/:appId/evaluate` | Submit answers for instant AI rubric scoring |
| **Mentor Slots** | `GET` | `/mentor-schedules/available` | Browse open bookable mentor slots |
| **Mentor Slots** | `POST` | `/mentor-schedules/book` | Book slot (Free; auto-sends Google Meet invite & email) |
| **Mentor Slots** | `GET` | `/mentor-schedules/bookings/my` | Fetch my active booked sessions |
| **Outreach** | `GET` | `/outreach-logs/my` | Get professor outreach logs |
| **Outreach** | `POST` | `/outreach-logs` | Log professor email outreach (`{ professorName, status... }`) |
| **Recommenders** | `GET` | `/recommendation-requests/my` | Get recommendation letter requests |
| **Finances** | `GET` | `/cost-estimates/my` | Fetch cost estimates & funding offsets |
| **Finances** | `POST` | `/cost-estimates` | Calculate net out-of-pocket costs |
| **Readiness** | `GET` | `/readiness/my` | Composite readiness score & component breakdown |
| **Calendar** | `GET` | `/calendar/events` | JSON event feed for FullCalendar |
| **Calendar** | `GET` | `/calendar/export.ics` | RFC 5545 iCal download link for Google Calendar |

---

## 8. Frontend State Management & Cache Invalidation

### 8.1 TanStack Query Query Keys Convention
```typescript
export const queryKeys = {
  auth: ['auth', 'me'] as const,
  profile: ['student-profile', 'my'] as const,
  academics: ['academic-records', 'my'] as const,
  experiences: ['experiences', 'my'] as const,
  publications: ['publications', 'my'] as const,
  tests: ['test-records', 'my'] as const,
  opportunities: (filters: Record<string, any>) => ['opportunities', filters] as const,
  opportunityDetail: (id: string) => ['opportunities', id] as const,
  matches: ['matching', 'my-matches'] as const,
  aiExplain: (oppId: string) => ['matching', oppId, 'ai-explain'] as const,
  shortlist: ['shortlist', 'my'] as const,
  comparison: (ids: string[]) => ['shortlist', 'compare', ids] as const,
  applications: ['applications', 'my'] as const,
  applicationDetail: (id: string) => ['applications', id] as const,
  tasks: (appId: string) => ['applications', appId, 'tasks'] as const,
  documents: ['documents', 'my'] as const,
  documentDetail: (id: string) => ['documents', id] as const,
  mentorAvailableSlots: (mentorId?: string) => ['mentor-schedules', 'available', mentorId] as const,
  myBookings: ['mentor-schedules', 'bookings', 'my'] as const,
  calendarEvents: (month?: string) => ['calendar', 'events', month] as const,
  readiness: ['readiness', 'my'] as const,
};
```

### 8.2 Invalidation Rules
- Mutating **Profile**, **Academics**, **Experiences**, **Publications**, or **Tests** automatically invalidates:
  `['student-profile']`, `['matching']`, and `['readiness']`.
- Mutating an **Application Task** automatically invalidates:
  `['applications', appId, 'tasks']`, `['calendar']`, and `['readiness']`.
- Booking a **Mentor Schedule Slot** invalidates:
  `['mentor-schedules', 'available']`, `['mentor-schedules', 'bookings', 'my']`, and `['calendar']`.

---

## 9. Hackathon Winning Presentation & UI Checklist

To achieve maximum scores from the hackathon judges, ensure the frontend prioritizes:

1. **The 10-Second Wow Factor on First Load:**
   - Pre-populate demo accounts with realistic higher-study data (e.g., a student profile with 3.82 CGPA, 2 publications, 1 research assistant experience, targeting Stanford and CMU).
   - Show a vibrant Dashboard with an 84% Readiness gauge, 2 urgent deadlines with amber countdown pills, and an upcoming Google Meet session.

2. **Live AI Demo Flow (Zero-Failure Execution):**
   - Click `Explain Match with AI` on an opportunity card → highlight the instant response outlining GPA match vs. IELTS gap.
   - Open Document Studio → Click `Run AI Evaluation` on an SOP → Showcase the 5-point rubric with concrete rewriting suggestions.
   - Open AI Interview Station → Click `Start Mock Interview` → Answer 1 question → Reveal the instant AI evaluation score and actionable tips.

3. **Demonstrating Mentor Collaboration:**
   - Switch from Student view to Mentor view to show the Mentor's Schedule Manager.
   - Book a slot as a Student → show the instant Google Meet link generated on screen and the automated in-app reminder.

4. **Interactive Polish:**
   - Implement loading skeletons (`shadcn/ui Skeleton`) rather than generic full-page spinners.
   - Empty state illustrations with quick action buttons (e.g., *"No shortlisted opportunities yet. Explore Top Programs"*).
   - Toast confirmations via `sonner` on every action.
   - Responsive sidebar with clean mobile drawer toggle.
