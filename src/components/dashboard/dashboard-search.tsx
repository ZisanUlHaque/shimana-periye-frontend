"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  GraduationCap,
  FileText,
  Calendar,
  Compass,
  Building2,
  Mail,
  Award,
  Video,
  User,
  X,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Role } from "@/types";

interface SearchItem {
  id: string;
  title: string;
  description: string;
  href: string;
  category: "Navigation" | "Admissions" | "Mentorship" | "Tools";
  icon: any;
  roles?: Role[];
}

const SEARCH_ITEMS: SearchItem[] = [
  {
    id: "opps",
    title: "Opportunities & Scholarships",
    description: "Browse funded Master's, PhDs, and research assistantships",
    href: "/student/opportunities",
    category: "Admissions",
    icon: GraduationCap,
  },
  {
    id: "apps",
    title: "Application Pipeline",
    description: "Manage stages, university requirements, and deadline tracking",
    href: "/student/applications",
    category: "Admissions",
    icon: Building2,
  },
  {
    id: "shortlist",
    title: "Shortlisted Programs",
    description: "Review saved universities, target labs, and reach programs",
    href: "/student/shortlist",
    category: "Admissions",
    icon: Compass,
  },
  {
    id: "readiness",
    title: "Admissions Readiness Score",
    description: "Evaluate your 5-pillar profile strength (0-100%)",
    href: "/student/readiness",
    category: "Tools",
    icon: Award,
  },
  {
    id: "docs",
    title: "Document Vault (SOP & CV)",
    description: "Upload and review statements, transcripts, and portfolios",
    href: "/student/documents",
    category: "Tools",
    icon: FileText,
  },
  {
    id: "outreach",
    title: "Cold Email & Outreach Logs",
    description: "Track professor emails, reply dates, and follow-ups",
    href: "/student/outreach",
    category: "Admissions",
    icon: Mail,
  },
  {
    id: "mentor-booking",
    title: "Book Mentorship Consultation",
    description: "Reserve 1-on-1 feedback slots with verified alumni",
    href: "/student/mentor-schedule",
    category: "Mentorship",
    icon: Calendar,
  },
  {
    id: "interview",
    title: "Mock Interview Simulator",
    description: "Practice behavioral and technical faculty interview questions",
    href: "/student/interview-practice",
    category: "Tools",
    icon: Video,
  },
  {
    id: "profile",
    title: "Student Academic Profile",
    description: "Update test scores, GPA, publications, and research background",
    href: "/student/profile",
    category: "Navigation",
    icon: User,
  },
  {
    id: "admin-mentors",
    title: "Admin Mentor Verification Queue",
    description: "Review and approve prospective mentor applications",
    href: "/admin",
    category: "Navigation",
    icon: Award,
  },
  {
    id: "admin-opps",
    title: "Admin Opportunities Manager",
    description: "Add new scholarships and graduate assistantships to catalog",
    href: "/admin/opportunities",
    category: "Navigation",
    icon: GraduationCap,
  },
  {
    id: "mentor-dash",
    title: "Mentor Advising Dashboard",
    description: "Overview of assigned mentees, document reviews, and bookings",
    href: "/mentor",
    category: "Mentorship",
    icon: Building2,
  },
  {
    id: "mentor-apps",
    title: "Mentor Assigned Applications",
    description: "Inspect mentee application files, statement drafts, and tasks",
    href: "/mentor/applications",
    category: "Mentorship",
    icon: FileText,
  },
  {
    id: "mentor-schedule",
    title: "Mentor Consultation Schedule",
    description: "Publish 1-on-1 availability slots and manage student bookings",
    href: "/mentor/schedule",
    category: "Mentorship",
    icon: Calendar,
  },
  {
    id: "mentor-profile",
    title: "Mentor Profile & Credentials",
    description: "Update advising bio, academic institution, and expertise tags",
    href: "/mentor/profile",
    category: "Mentorship",
    icon: User,
  },
];

export function DashboardSearch({ role }: { role?: Role }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredItems = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return SEARCH_ITEMS.slice(0, 8);
    return SEARCH_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(trimmed) ||
        item.description.toLowerCase().includes(trimmed) ||
        item.category.toLowerCase().includes(trimmed)
    );
  }, [query]);

  const handleSelect = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <>
      {/* Trigger in dashboard top bar */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative flex h-9 w-48 sm:w-60 items-center gap-2 rounded-full border border-border bg-muted/40 px-3 text-xs text-muted-foreground transition-all hover:border-primary/40 hover:bg-muted/70 focus:outline-none"
      >
        <Search className="size-3.5 text-muted-foreground" />
        <span className="truncate">Search modules & pages...</span>
        <kbd className="pointer-events-none ml-auto hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </button>

      {/* Command Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl gap-0 border border-border shadow-2xl">
          <DialogHeader className="p-0 border-b border-border/60">
            <div className="flex items-center px-4 py-3 gap-2">
              <Search className="size-4 text-primary shrink-0" />
              <input
                autoFocus
                placeholder="Type to search opportunities, tools, profile, or mentorship..."
                className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </DialogHeader>

          {/* Search Results */}
          <div className="max-h-80 overflow-y-auto p-2 divide-y divide-border/30">
            {filteredItems.length === 0 ? (
              <div className="py-10 text-center text-xs text-muted-foreground">
                No matching pages or tools found for "{query}".
              </div>
            ) : (
              filteredItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.href)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl p-3 text-left transition-colors hover:bg-muted/60 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-foreground">
                            {item.title}
                          </span>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                            {item.category}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-4 py-2 text-[11px] text-muted-foreground">
            <span>Press <kbd className="font-mono text-[10px] bg-background border px-1 rounded">ESC</kbd> to close</span>
            <span>Navigate instantly with 1-click</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
