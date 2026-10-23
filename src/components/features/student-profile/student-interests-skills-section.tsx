"use client";

import { useEffect, useState } from "react";
import {
  useGetMyStudentProfile,
  useUpdateMyStudentProfile,
} from "@/hooks/student-profile.hook";
import { TagEditor } from "./tag-editor";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";

export function StudentInterestsSkillsSection() {
  const { data, isLoading } = useGetMyStudentProfile();
  const profile = data?.data;
  const { mutate: updateProfile, isPending: isUpdating } =
    useUpdateMyStudentProfile();

  const [interests, setInterests] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (profile) {
      setInterests(profile.interests ?? []);
      setSkills(profile.skills ?? []);
      setIsDirty(false);
    }
  }, [profile]);

  const handleInterestsChange = (newInterests: string[]) => {
    setInterests(newInterests);
    setIsDirty(true);
  };

  const handleSkillsChange = (newSkills: string[]) => {
    setSkills(newSkills);
    setIsDirty(true);
  };

  const handleSave = () => {
    updateProfile(
      { interests, skills },
      {
        onSuccess: () => {
          setIsDirty(false);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="h-48 animate-pulse rounded-2xl border border-border/70 bg-muted/40" />
        <div className="h-48 animate-pulse rounded-2xl border border-border/70 bg-muted/40" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TagEditor
          label="Research Interests"
          description="E.g., Machine Learning, Quantum Computing, Distributed Systems"
          placeholder="Add an interest..."
          tags={interests}
          onChange={handleInterestsChange}
        />
        <TagEditor
          label="Technical & Academic Skills"
          description="E.g., PyTorch, Data Analysis, Molecular Cloning, LaTeX"
          placeholder="Add a skill..."
          tags={skills}
          onChange={handleSkillsChange}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        {isDirty && (
          <span className="text-xs text-amber-600 dark:text-amber-400">
            You have unsaved changes
          </span>
        )}
        <Button
          type="button"
          onClick={handleSave}
          disabled={!isDirty || isUpdating}
          className="gap-2"
        >
          {isUpdating ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving Changes...
            </>
          ) : (
            <>
              <Check className="size-4" />
              Save Profile Interests & Skills
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
