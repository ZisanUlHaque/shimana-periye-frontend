import { ApplyMentorForm } from "@/components/features/mentor/apply-mentor-form";

export const metadata = {
  title: "Become a Mentor | PUB GradPath",
  description:
    "Apply to become an academic mentor at PUB GradPath. Guide prospective students through admissions, SOPs, and research fellowships.",
};

export default function ApplyMentorPage() {
  return (
    <div className="relative min-h-[calc(100vh-160px)] py-20 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex justify-center overflow-hidden">
        <div className="h-[400px] w-[800px] rounded-full bg-primary/10 blur-3xl opacity-50 dark:opacity-20" />
      </div>

      <div className="mx-auto max-w-4xl text-center mb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-4">
          🎓 Academic Mentorship Network
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
          Empower Global Aspirations
        </h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
          Share your research experience, review student statements, and provide structured 1-on-1 guidance to future graduate scholars.
        </p>
      </div>

      <ApplyMentorForm />
    </div>
  );
}
