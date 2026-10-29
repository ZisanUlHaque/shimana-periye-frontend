Here is the complete API reference for **PUB GradPath**, categorized by **Public**, **Student**, **Mentor**, **Admin**, and **Shared Authenticated** routes.

All routes are prefixed with: `{{BASE_URL}}/api/v1`

---

## 1. 🌐 Public Routes (No Authentication Required)

These endpoints are open to all visitors for registration, authentication, and session handling.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Base health check / welcome route |
| `POST` | `/api/v1/auth/register` | Register new student account (dispatches email OTP) |
| `POST` | `/api/v1/auth/verify-email` | Verify OTP and activate account |
| `POST` | `/api/v1/auth/login` | Authenticate user with email & password |
| `POST` | `/api/v1/auth/google` | Sign in / register with Google OAuth ID token |
| `POST` | `/api/v1/auth/refresh-token` | Exchange refresh token for new access token |
| `POST` | `/api/v1/auth/forgot-password` | Request password reset OTP to email |
| `POST` | `/api/v1/auth/reset-password` | Reset password using verified OTP |
| `POST` | `/api/v1/auth/logout` | Revoke tokens in Redis and wipe cookies |

---

## 2. 🎓 Student Only Routes (`Role.STUDENT`)

### A. Profile & Credentials (FR-01, FR-05)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/student-profile/me` | Fetch authenticated student profile |
| `PATCH` | `/api/v1/student-profile/me` | Update target degree, bio, research interests & skills |
| `GET` | `/api/v1/student-profile/me/completeness` | Get profile completeness score & missing fields |
| `POST` | `/api/v1/academic-records` | Add undergraduate/graduate degree record |
| `GET` | `/api/v1/academic-records` | View all academic records |
| `PATCH` | `/api/v1/academic-records/:id` | Update academic record |
| `DELETE` | `/api/v1/academic-records/:id` | Delete academic record |
| `POST` | `/api/v1/experiences` | Add work, lab, or research experience |
| `GET` | `/api/v1/experiences` | View all experiences |
| `PATCH` | `/api/v1/experiences/:id` | Update experience |
| `DELETE` | `/api/v1/experiences/:id` | Delete experience |
| `POST` | `/api/v1/publications` | Add publication record (journal, DOI, citations) |
| `GET` | `/api/v1/publications` | View all publications |
| `PATCH` | `/api/v1/publications/:id` | Update publication |
| `DELETE` | `/api/v1/publications/:id` | Delete publication |
| `POST` | `/api/v1/test-records` | Add standardized test score (IELTS, TOEFL, GRE, GMAT) |
| `GET` | `/api/v1/test-records` | View all test records |
| `PATCH` | `/api/v1/test-records/:id` | Update test record |
| `DELETE` | `/api/v1/test-records/:id` | Delete test record |

### B. Matching & Intelligence (FR-03 & Opt-01)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/matching/:opportunityId` | Get deterministic match score (0–100%) & requirement gaps |
| `POST` | `/api/v1/matching/:opportunityId/recompute` | Recalculate match score after updating profile |
| `POST` | `/api/v1/matching/:opportunityId/ai-explain` | AI-assisted explanation of fit, strengths & missing gaps |

### C. Shortlist & Comparison Matrix (FR-04)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/shortlist` | Add opportunity to shortlist (priority, personal notes) |
| `GET` | `/api/v1/shortlist` | View my shortlisted opportunities |
| `GET` | `/api/v1/shortlist/compare` | Side-by-side comparison table (fit, fees, living costs, deadline) |
| `PATCH` | `/api/v1/shortlist/:id` | Update priority (`HIGH`, `MEDIUM`, `LOW`) or personal notes |
| `DELETE` | `/api/v1/shortlist/:id` | Remove opportunity from shortlist |

### D. Applications & Tasks Workspace (FR-06, FR-10)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/applications` | Create and track new application |
| `GET` | `/api/v1/applications` | View all my applications with current stages |
| `GET` | `/api/v1/applications/:id` | Get application details |
| `PATCH` | `/api/v1/applications/:id/status` | Update stage (`DRAFT`, `SUBMITTED`, `UNDER_REVIEW`, etc.) |
| `PATCH` | `/api/v1/applications/:id/interview` | Record scheduled interview date & notes |
| `PATCH` | `/api/v1/applications/:id/decision` | Record decision outcome (`OFFER`, `REJECTED`, `WAITLIST`) |
| `POST` | `/api/v1/applications/:applicationId/tasks` | Add checklist task with deadline & dependencies |
| `GET` | `/api/v1/applications/:applicationId/tasks` | View all tasks for this application |
| `PATCH` | `/api/v1/applications/:applicationId/tasks/:taskId` | Update task details |
| `PATCH` | `/api/v1/applications/:applicationId/tasks/:taskId/status` | Toggle task completion status (`PENDING` / `COMPLETED`) |
| `DELETE` | `/api/v1/applications/:applicationId/tasks/:taskId` | Delete application task |

### E. Document Studio & AI SOP Reviewer (FR-07 & Opt-02)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/documents` | Upload new SOP, CV, or Research Statement |
| `GET` | `/api/v1/documents` | List uploaded documents with version history |
| `GET` | `/api/v1/documents/:id` | View document details and review status |
| `POST` | `/api/v1/documents/:id/ai-feedback` | Run AI SOP evaluation & rubric scoring (Clarity, Tone, Fit) |
| `POST` | `/api/v1/documents/:id/versions` | Upload a new revision/version |
| `PATCH` | `/api/v1/documents/:id` | Update document metadata |
| `DELETE` | `/api/v1/documents/:id` | Delete document |

### F. Interview Hub & Live Mentor Booking (Opt-03 & Bonus)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/interview-practice/:applicationId/generate` | AI generates 5 program-specific mock interview questions |
| `POST` | `/api/v1/interview-practice/:applicationId/evaluate` | Submit answers for instant AI rubric scoring |
| `POST` | `/api/v1/mentor-schedules/book` | Book mentor slot (Zero payment; sends Google Meet invite) |

### G. Outreach, Recommendations & Financial Planner (FR-08, FR-09)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/recommendation-requests` | Create recommendation letter request tracker |
| `GET` | `/api/v1/recommendation-requests` | View my recommendation requests & statuses |
| `PATCH` | `/api/v1/recommendation-requests/:id` | Update recommender details |
| `PATCH` | `/api/v1/recommendation-requests/:id/status` | Update letter status (`REQUESTED`, `SUBMITTED`) |
| `DELETE` | `/api/v1/recommendation-requests/:id` | Delete recommendation request |
| `POST` | `/api/v1/outreach-logs` | Log cold email outreach to prospective professors |
| `GET` | `/api/v1/outreach-logs` | View professor outreach history |
| `PATCH` | `/api/v1/outreach-logs/:id` | Update outreach log details |
| `PATCH` | `/api/v1/outreach-logs/:id/status` | Update reply status (`AWAITING_REPLY`, `POSITIVE`, etc.) |
| `DELETE` | `/api/v1/outreach-logs/:id` | Delete outreach log |
| `POST` | `/api/v1/fundings` | Track scholarship or fellowship opportunity |
| `GET` | `/api/v1/fundings` | View my tracked funding entries |
| `PATCH` | `/api/v1/fundings/:id` | Update funding amount or criteria |
| `PATCH` | `/api/v1/fundings/:id/status` | Update award status (`APPLIED`, `AWARDED`, `REJECTED`) |
| `DELETE` | `/api/v1/fundings/:id` | Delete funding entry |
| `PUT` | `/api/v1/cost-estimates/:applicationId` | Calculate net cost (Tuition + Living + Travel - Funding) |
| `GET` | `/api/v1/cost-estimates/:applicationId` | Get application cost breakdown |

### H. Readiness, Calendar & Dashboard (FR-10 & Opt-05)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/readiness/me` | Composite readiness score & 5-axis readiness breakdown |
| `GET` | `/api/v1/calendar/events` | JSON event feed for FullCalendar (deadlines, tasks, calls) |
| `GET` | `/api/v1/calendar/export.ics` | RFC 5545 iCal feed to subscribe in Google / Apple Calendar |
| `GET` | `/api/v1/dashboard/student` | Student overview dashboard metrics & urgent alerts |

---

## 3. 👨‍🏫 Mentor Only Routes (`Role.MENTOR`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/mentor-profile/me` | Get mentor's own profile |
| `PATCH` | `/api/v1/mentor-profile/me` | Update expertise areas and bio |
| `GET` | `/api/v1/mentor-assignments/my-students` | View all students assigned to this mentor |
| `GET` | `/api/v1/dashboard/mentor` | Mentor dashboard (mentees, pending reviews, upcoming calls) |
| `GET` | `/api/v1/shortlist/student/:studentProfileId` | Review shortlisted opportunities of a mentee |
| `GET` | `/api/v1/applications/mentor/:id` | Inspect mentee application details |
| `GET` | `/api/v1/applications/:applicationId/tasks/mentor/view` | Inspect mentee checklist tasks |
| `GET` | `/api/v1/documents/mentor/:id` | Review mentee uploaded document (SOP, CV) |
| `PATCH` | `/api/v1/documents/mentor/:id/status` | Update document review status (`APPROVED`, `CHANGES_REQUESTED`) |
| `POST` | `/api/v1/document-comments` | Add inline / general comment on mentee document |
| `DELETE` | `/api/v1/document-comments/:id` | Delete mentor's own document comment |
| `POST` | `/api/v1/mentor-feedback` | Submit structured feedback on mentee's application |
| `GET` | `/api/v1/mentor-feedback/student/:studentProfileId` | View feedback history given to a student |
| `POST` | `/api/v1/mentor-schedules` | Create available 30-min Google Meet slots for a date range |
| `GET` | `/api/v1/mentor-schedules/me` | List all schedules created by this mentor |
| `PATCH` | `/api/v1/mentor-schedules/:id` | Update schedule slot |
| `DELETE` | `/api/v1/mentor-schedules/:id` | Delete schedule slot |

---

## 4. 🛡️ Admin Only Routes (`Role.ADMIN`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/dashboard/admin` | System overview (total users, opportunities, universities) |
| `GET` | `/api/v1/mentor-profile` | List all registered mentors |
| `POST` | `/api/v1/mentor-assignments` | Assign a mentor to a student |
| `GET` | `/api/v1/mentor-assignments` | View all active student-mentor assignments |
| `DELETE` | `/api/v1/mentor-assignments/:id` | Remove a mentor assignment |
| `POST` | `/api/v1/universities` | Create new university record |
| `PATCH` | `/api/v1/universities/:id` | Update university details |
| `DELETE` | `/api/v1/universities/:id` | Delete university record |
| `POST` | `/api/v1/professors` | Add professor record |
| `PATCH` | `/api/v1/professors/:id` | Update professor record |
| `DELETE` | `/api/v1/professors/:id` | Delete professor record |
| `POST` | `/api/v1/labs` | Add research lab record |
| `PATCH` | `/api/v1/labs/:id` | Update lab record |
| `DELETE` | `/api/v1/labs/:id` | Delete lab record |
| `POST` | `/api/v1/opportunities` | Create new opportunity record |
| `PATCH` | `/api/v1/opportunities/:id` | Update opportunity (auto-notifies students if deadline changes) |
| `DELETE` | `/api/v1/opportunities/:id` | Delete opportunity |
| `POST` | `/api/v1/opportunities/:opportunityId/requirements` | Add requirement rule (GPA, test cutoffs) |
| `PATCH` | `/api/v1/opportunities/:opportunityId/requirements/:requirementId` | Update requirement rule |
| `DELETE` | `/api/v1/opportunities/:opportunityId/requirements/:requirementId` | Delete requirement rule |

---

## 5. 👥 Shared Authenticated Routes

Accessible across roles as specified below:

| Method | Endpoint | Allowed Roles | Description |
|---|---|---|---|
| `GET` | `/api/v1/auth/me` | `STUDENT`, `MENTOR`, `ADMIN` | Fetch current authenticated user info |
| `PATCH` | `/api/v1/user/profile-image` | `STUDENT`, `MENTOR`, `ADMIN` | Upload/update user avatar image |
| `GET` | `/api/v1/universities` | `STUDENT`, `MENTOR`, `ADMIN` | Search & list universities |
| `GET` | `/api/v1/universities/:id` | `STUDENT`, `MENTOR`, `ADMIN` | View university details |
| `GET` | `/api/v1/professors` | `STUDENT`, `MENTOR`, `ADMIN` | Search & list professors |
| `GET` | `/api/v1/professors/:id` | `STUDENT`, `MENTOR`, `ADMIN` | View professor details |
| `GET` | `/api/v1/labs` | `STUDENT`, `MENTOR`, `ADMIN` | Search & list labs |
| `GET` | `/api/v1/labs/:id` | `STUDENT`, `MENTOR`, `ADMIN` | View lab details |
| `GET` | `/api/v1/opportunities` | `STUDENT`, `MENTOR`, `ADMIN` | Search opportunities (type, country, funding) |
| `GET` | `/api/v1/opportunities/:id` | `STUDENT`, `MENTOR`, `ADMIN` | View opportunity details & requirements |
| `GET` | `/api/v1/opportunities/:opportunityId/requirements` | `STUDENT`, `MENTOR`, `ADMIN` | View requirements of an opportunity |
| `GET` | `/api/v1/student-profile/:studentProfileId` | `MENTOR`, `ADMIN` | View full student profile |
| `GET` | `/api/v1/mentor-schedules/available` | `STUDENT`, `MENTOR`, `ADMIN` | Browse available live interview slots |
| `GET` | `/api/v1/mentor-schedules/bookings/my` | `STUDENT`, `MENTOR` | View my active booked interview sessions |
| `PATCH` | `/api/v1/mentor-schedules/bookings/:bookingId/cancel` | `STUDENT`, `MENTOR` | Cancel a booked interview session |
| `GET` | `/api/v1/document-comments/:documentId` | `STUDENT`, `MENTOR` | View comment thread on a document |
| `GET` | `/api/v1/mentor-feedback/application/:applicationId` | `STUDENT`, `MENTOR` | View mentor feedback for an application |
| `GET` | `/api/v1/reminders` | `STUDENT`, `MENTOR`, `ADMIN` | List user reminders / alerts |
| `PATCH` | `/api/v1/reminders/:id/read` | `STUDENT`, `MENTOR`, `ADMIN` | Mark reminder as read |
| `DELETE` | `/api/v1/reminders/:id` | `STUDENT`, `MENTOR`, `ADMIN` | Dismiss/delete reminder |