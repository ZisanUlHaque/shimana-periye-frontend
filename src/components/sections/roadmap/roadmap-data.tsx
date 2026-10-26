import {
  Award,
  BadgeCheck,
  Compass,
  FileText,
  GraduationCap,
  PlaneTakeoff,
  Send,
} from "lucide-react";
import type { RoadmapMilestone } from "./types";

/**
 * Default study-abroad journey. Dates are placeholders: edit freely, or pass your
 * own `milestones` array to <Roadmap />.
 * No "use client" here, so this can be imported from Server Components.
 */
export const studyAbroadMilestones: RoadmapMilestone[] = [
  {
    id: "discover",
    title: "Discover your destinations",
    description:
      "Explore countries, cities and universities that fit your goals, budget and lifestyle.",
    date: "Step 1",
    icon: <Compass />,
    tags: ["Destinations", "Rankings"],
  },
  {
    id: "shortlist",
    title: "Build your shortlist",
    description:
      "Match your profile with programs and get a balanced list of reach, target and safe options.",
    date: "Step 2",
    icon: <GraduationCap />,
    tags: ["Programs", "Eligibility"],
  },
  {
    id: "prepare",
    title: "Prepare your documents",
    description:
      "Language tests, statement of purpose, recommendations and transcripts, all organised in one place.",
    date: "Step 3",
    icon: <FileText />,
    tags: ["SOP", "Test scores"],
  },
  {
    id: "funding",
    title: "Unlock scholarships",
    description:
      "Find funding you qualify for and learn how to make your application stand out.",
    date: "Step 4",
    icon: <Award />,
    tags: ["Scholarships", "Funding"],
  },
  {
    id: "apply",
    title: "Apply with confidence",
    description:
      "Submit before the deadlines with mentor feedback on every essay and form.",
    date: "Step 5",
    icon: <Send />,
    tags: ["Deadlines", "Mentors"],
  },
  {
    id: "visa",
    title: "Secure your visa",
    description:
      "Step-by-step visa guidance, document checklists and interview preparation.",
    date: "Step 6",
    icon: <BadgeCheck />,
    tags: ["Visa", "Interview"],
  },
  {
    id: "takeoff",
    title: "Take off",
    description:
      "Plan your travel, housing and arrival so you land ready to start the next chapter.",
    date: "Step 7",
    icon: <PlaneTakeoff />,
    tags: ["Travel", "Arrival"],
  },
];
