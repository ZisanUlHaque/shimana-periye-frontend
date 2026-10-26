"use client";

import {
  Briefcase,
  Building,
  CalendarCheck,
  GraduationCap,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllMentors } from "@/hooks/mentor-profile.hook";
import { useDebounce } from "@/hooks/use-debounce";
import type { IMentorProfile } from "@/types/mentor-profile.type";

interface StudentMentorDirectoryProps {
  onSelectMentorSlots: (mentorId: string) => void;
}

const POPULAR_EXPERTISE_FILTERS = [
  "ALL",
  "PhD Admissions",
  "Master's / MS",
  "SOP Writing",
  "Professor Cold Email",
  "Scholarship Applications",
  "Computer Science",
  "Visa Interview",
];

export function StudentMentorDirectory({
  onSelectMentorSlots,
}: StudentMentorDirectoryProps) {
  const { data, isLoading } = useAllMentors();
  const mentors: IMentorProfile[] = data?.data ?? [];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const debouncedSearch = useDebounce(searchTerm, 350);

  // Only show active / non-rejected mentors for students
  const approvedMentors = mentors.filter(
    (m) => m.verificationStatus !== "REJECTED",
  );

  const filteredMentors = approvedMentors.filter((m) => {
    // Filter by tag
    if (selectedTag !== "ALL") {
      const hasTag = m.expertise?.some(
        (t) => t.toLowerCase() === selectedTag.toLowerCase(),
      );
      if (!hasTag) return false;
    }

    if (!debouncedSearch) return true;
    const q = debouncedSearch.toLowerCase();
    const nameMatch = m.user?.name?.toLowerCase().includes(q);
    const emailMatch = m.user?.email?.toLowerCase().includes(q);
    const instMatch = m.institution?.toLowerCase().includes(q);
    const desigMatch = m.designation?.toLowerCase().includes(q);
    const expMatch = m.expertise?.some((t) => t.toLowerCase().includes(q));

    return nameMatch || emailMatch || instMatch || desigMatch || expMatch;
  });

  return (
    <div className="flex flex-col gap-5">
      {/* Search and Category Chips */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search mentors by name, university, field, or expertise (e.g. SOP, PhD, Stanford)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10 bg-background border-border/60 text-xs"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {POPULAR_EXPERTISE_FILTERS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`text-[11px] px-3 py-1 rounded-xl font-medium whitespace-nowrap transition-all duration-150 ${
                selectedTag === tag
                  ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tag === "ALL" ? "All Specialties" : tag}
            </button>
          ))}
        </div>
      </div>

      {/* Mentors Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {["skel-m-1", "skel-m-2", "skel-m-3"].map((k) => (
            <Skeleton key={k} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : filteredMentors.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 p-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
            <GraduationCap className="size-6" />
          </div>
          <h4 className="text-sm font-bold text-foreground">
            No Mentors Found
          </h4>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm">
            No verified mentors match &ldquo;{searchTerm || selectedTag}&rdquo;.
            Try clearing your search query or selecting another topic.
          </p>
          {(searchTerm || selectedTag !== "ALL") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedTag("ALL");
              }}
              className="mt-4 text-xs h-8"
            >
              Reset Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMentors.map((mentor) => {
            const userName = mentor.user?.name || "Academic Mentor";
            const userEmail = mentor.user?.email || "";
            const institution =
              mentor.institution || "Leading Global University";
            const designation = mentor.designation || "Graduate Researcher";
            const expertise = mentor.expertise ?? [];

            return (
              <div
                key={mentor.id}
                className="group flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:border-primary/40 hover:shadow-md"
              >
                <div>
                  {/* Top Profile Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="size-12 border border-border/70 shrink-0">
                        <AvatarImage src={mentor.user?.imageUrl ?? undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                          {userName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-foreground truncate">
                            {userName}
                          </h4>
                          <ShieldCheck
                            className="size-3.5 text-emerald-500 shrink-0"
                            title="Verified Mentor"
                          />
                        </div>
                        <span className="text-[11px] text-muted-foreground truncate block mt-0.5">
                          {userEmail}
                        </span>
                      </div>
                    </div>

                    <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[10px] px-2 py-0.5 font-semibold shrink-0">
                      Verified
                    </Badge>
                  </div>

                  {/* Institutional Affiliation */}
                  <div className="mt-3.5 flex flex-col gap-1 rounded-xl bg-muted/40 p-3 text-xs border border-border/50">
                    <div className="flex items-center gap-1.5 font-semibold text-foreground truncate">
                      <Building className="size-3.5 text-primary shrink-0" />
                      <span className="truncate">{institution}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] truncate">
                      <Briefcase className="size-3 shrink-0" />
                      <span className="truncate">{designation}</span>
                    </div>
                  </div>

                  {/* Bio */}
                  {mentor.bio && (
                    <p className="mt-3 text-xs text-muted-foreground line-clamp-3 leading-relaxed italic">
                      &ldquo;{mentor.bio}&rdquo;
                    </p>
                  )}

                  {/* Expertise Tags */}
                  {expertise.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {expertise.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium border border-primary/20"
                        >
                          {tag}
                        </span>
                      ))}
                      {expertise.length > 4 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-medium">
                          +{expertise.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Action */}
                <div className="mt-5 pt-3 border-t border-border/60">
                  <Button
                    size="sm"
                    onClick={() =>
                      onSelectMentorSlots(mentor.userId || mentor.id)
                    }
                    className="w-full gap-2 text-xs h-9 font-semibold bg-primary shadow-xs"
                  >
                    <CalendarCheck className="size-3.5" />
                    <span>Choose Mentor & View Slots</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
