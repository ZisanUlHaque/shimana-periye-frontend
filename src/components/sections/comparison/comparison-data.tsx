import {
  Award,
  ClipboardList,
  DollarSign,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

export type CleanRow = {
  label: string;
  meta: string;
  /** 0–100, drives the little progress bar in the "new way" preview. */
  progress?: number;
};

export type ComparisonItem = {
  id: string;
  icon: ReactNode;
  title: string;
  without: string;
  withUs: string;
  /** Headline before → after, shown as a pill. */
  metric: { from: string; to: string };
  /** Scattered fragments for the "old way" picture. */
  messy: string[];
  /** Rows for the "new way" dashboard preview (illustrative sample data). */
  clean: CleanRow[];
};

/* No "use client": safe to import from Server Components. */
export const comparisonItems: ComparisonItem[] = [
  {
    id: "research",
    icon: <Search />,
    title: "University research",
    without: "Weeks of scattered Google searches and outdated blog posts",
    withUs: "A curated shortlist generated for your exact profile in minutes",
    metric: { from: "Weeks", to: "Minutes" },
    messy: [
      "47 open browser tabs",
      "Blog post from 2019",
      "“Is this uni good??”",
      "Ranking list (paywalled)",
      "Outdated fee page",
    ],
    clean: [
      { label: "MSc Computer Science", meta: "Germany · 92% fit", progress: 92 },
      { label: "MSc Data Science", meta: "Denmark · 88% fit", progress: 88 },
      { label: "MSc Artificial Intelligence", meta: "Canada · 81% fit", progress: 81 },
    ],
  },
  {
    id: "tracking",
    icon: <ClipboardList />,
    title: "Application tracking",
    without: "Spreadsheets, sticky notes, and missed deadlines",
    withUs: "One live dashboard tracking every deadline automatically",
    metric: { from: "Scattered", to: "One dashboard" },
    messy: [
      "deadline_final_v7.xlsx",
      "Sticky note: “apply!!”",
      "Portal closed yesterday",
      "Email from 3 weeks ago",
      "Which form was this?",
    ],
    clean: [
      { label: "Submit application", meta: "Due soon · reminder set", progress: 70 },
      { label: "Request transcript", meta: "Completed", progress: 100 },
      { label: "Upload statement of purpose", meta: "In progress", progress: 45 },
    ],
  },
  {
    id: "scholarships",
    icon: <Award />,
    title: "Scholarship discovery",
    without: "Stumbling onto scholarships by luck, if at all",
    withUs: "AI-matched scholarships delivered straight to your inbox",
    metric: { from: "By luck", to: "AI-matched" },
    messy: [
      "Found one by accident…",
      "Link expired",
      "Eligibility unclear",
      "Deadline already passed",
      "Rumour from a group chat",
    ],
    clean: [
      { label: "Merit scholarship", meta: "AI match · 94%", progress: 94 },
      { label: "Country-funded award", meta: "AI match · 87%", progress: 87 },
      { label: "Research assistantship", meta: "AI match · 79%", progress: 79 },
    ],
  },
  {
    id: "guidance",
    icon: <Users />,
    title: "Expert guidance",
    without: "Paying hundreds for generic, one-size-fits-all consultants",
    withUs: "Verified mentors who've lived your exact journey, on demand",
    metric: { from: "Generic", to: "Verified mentors" },
    messy: [
      "Generic consultant package",
      "Big fee paid upfront",
      "Same advice for everyone",
      "No follow-up",
      "Can't reach them",
    ],
    clean: [
      { label: "Mentor session", meta: "Booked · tomorrow", progress: 100 },
      { label: "Statement feedback", meta: "Reviewed by a verified mentor", progress: 80 },
      { label: "Interview practice", meta: "Matched to your target", progress: 55 },
    ],
  },
  {
    id: "visa",
    icon: <ShieldCheck />,
    title: "Visa preparation",
    without: "Confusing forms with no second opinion",
    withUs: "A step-by-step roadmap plus real mentor review",
    metric: { from: "Guesswork", to: "Mentor-reviewed" },
    messy: [
      "Confusing form fields",
      "Which documents??",
      "Contradicting forum posts",
      "No second opinion",
      "“Missing paper” rejection",
    ],
    clean: [
      { label: "Document checklist", meta: "Everything accounted for", progress: 100 },
      { label: "Form walkthrough", meta: "Step 3 of 5", progress: 60 },
      { label: "Mentor review", meta: "Scheduled", progress: 30 },
    ],
  },
  {
    id: "cost",
    icon: <DollarSign />,
    title: "Total cost",
    without: "$500–$2,000+ in consultancy fees",
    withUs: "Free to start — pay only for the guidance you need",
    metric: { from: "$500–$2,000+", to: "Free to start" },
    messy: [
      "Consultancy fee",
      "Document review fee",
      "Add-on for “priority”",
      "Hidden charges",
      "Another premium tier",
    ],
    clean: [
      { label: "Explore & shortlist", meta: "Free", progress: 100 },
      { label: "Track applications", meta: "Free", progress: 100 },
      { label: "Mentor sessions", meta: "Only when you need them", progress: 40 },
    ],
  },
];
