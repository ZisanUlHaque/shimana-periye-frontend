"use client";

import { useForm } from "@tanstack/react-form";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Plus,
  X,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import GoogleLoginComponent from "../modules/google-login/GoogleLogin";
import { toast } from "../ui/toast";
import { Spinner } from "../ui/spinner";
import { useRegisterStudent } from "@/hooks";
import { cn } from "@/lib/utils";
import { StudentRegistrationZodSchema } from "@/validation";

const SUGGESTED_INTERESTS = [
  "Higher Studies Abroad",
  "Scholarship Applications",
  "GRE / IELTS Prep",
  "Research Papers",
  "Visa Guidance",
  "Career Transition",
];

const SUGGESTED_SKILLS = [
  "Python",
  "Data Analysis",
  "Academic Writing",
  "Full Stack Dev",
  "Machine Learning",
  "Communication",
];

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");

  const { mutate: register, isPending } = useRegisterStudent();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: StudentRegistrationZodSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = {
        name: value.name.trim(),
        email: value.email.trim().toLowerCase(),
        password: value.password,
        student: {
          interests: selectedInterests.length > 0 ? selectedInterests : undefined,
          skills: selectedSkills.length > 0 ? selectedSkills : undefined,
        },
      };

      register(payload, {
        onSuccess: (res: any) => {
          if (res && res.success === false) {
            toast.add({
              title: "Registration Failed",
              description: res.message || "Please check your inputs and try again.",
              type: "error",
            });
            return;
          }

          toast.add({
            title: "Account Created!",
            description: "A 6-digit OTP has been sent to your email.",
            type: "success",
          });

          const params = new URLSearchParams({ email: payload.email });
          router.push(`/register/verify-account?${params.toString()}`);
        },
        onError: (err: any) => {
          toast.add({
            title: "Registration Failed",
            description:
              err?.data?.message || err?.message || "Something went wrong. Please try again.",
            type: "error",
          });
        },
      });
    },
  });

  const toggleInterest = (item: string) => {
    setSelectedInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const addCustomInterest = () => {
    const trimmed = customInterest.trim();
    if (trimmed && !selectedInterests.includes(trimmed)) {
      setSelectedInterests((prev) => [...prev, trimmed]);
      setCustomInterest("");
    }
  };

  const toggleSkill = (item: string) => {
    setSelectedSkills((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  };

  const addCustomSkill = () => {
    const trimmed = customSkill.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills((prev) => [...prev, trimmed]);
      setCustomSkill("");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        {/* Full Name Field */}
        <form.Field name="name">
          {(field) => {
            const hasError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <div className="relative pt-2">
                <span className="absolute left-4 top-0 z-10 bg-card px-2 text-xs font-semibold text-muted-foreground pointer-events-none">
                  Full Name
                </span>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isPending}
                  className="h-13 rounded-2xl bg-card border-border/80 px-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                  required
                />
                {hasError && (
                  <FieldError className="mt-1 text-xs">
                    {field.state.meta.errors.map((e) => e?.message || String(e)).join(", ")}
                  </FieldError>
                )}
              </div>
            );
          }}
        </form.Field>

        {/* Email Field */}
        <form.Field name="email">
          {(field) => {
            const hasError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <div className="relative pt-2">
                <span className="absolute left-4 top-0 z-10 bg-card px-2 text-xs font-semibold text-muted-foreground pointer-events-none">
                  Email
                </span>
                <Input
                  type="email"
                  placeholder="john.doe@gmail.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isPending}
                  className="h-13 rounded-2xl bg-card border-border/80 px-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                  required
                />
                {hasError && (
                  <FieldError className="mt-1 text-xs">
                    {field.state.meta.errors.map((e) => e?.message || String(e)).join(", ")}
                  </FieldError>
                )}
              </div>
            );
          }}
        </form.Field>

        {/* Password Field */}
        <form.Field name="password">
          {(field) => {
            const val = field.state.value || "";
            const hasLength = val.length >= 8;
            const hasLower = /[a-z]/.test(val);
            const hasUpper = /[A-Z]/.test(val);
            const hasNumber = /[0-9]/.test(val);
            const hasSpecial = /[^A-Za-z0-9]/.test(val);
            const hasError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;

            return (
              <div className="relative pt-2">
                <span className="absolute left-4 top-0 z-10 bg-card px-2 text-xs font-semibold text-muted-foreground pointer-events-none">
                  Password
                </span>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={val}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={isPending}
                    className="h-13 rounded-2xl bg-card border-border/80 px-4 pr-12 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>

                {hasError && (
                  <FieldError className="mt-1 text-xs">
                    {field.state.meta.errors.map((e) => e?.message || String(e)).join(", ")}
                  </FieldError>
                )}
              </div>
            );
          }}
        </form.Field>

        {/* Confirm Password Field */}
        <form.Field name="confirmPassword">
          {(field) => {
            const hasError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <div className="relative pt-2">
                <span className="absolute left-4 top-0 z-10 bg-card px-2 text-xs font-semibold text-muted-foreground pointer-events-none">
                  Confirm Password
                </span>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={isPending}
                    className="h-13 rounded-2xl bg-card border-border/80 px-4 pr-12 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {hasError && (
                  <FieldError className="mt-1 text-xs">
                    {field.state.meta.errors.map((e) => e?.message || String(e)).join(", ")}
                  </FieldError>
                )}
              </div>
            );
          }}
        </form.Field>

        {/* Interactive Optional Student Interests */}
        <div className="rounded-2xl border border-border/70 p-4 bg-muted/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              Interests <span className="text-muted-foreground font-normal">(Optional)</span>
            </span>
            <span className="text-[11px] font-semibold text-primary">
              {selectedInterests.length} selected
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_INTERESTS.map((item) => {
              const active = selectedInterests.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleInterest(item)}
                  className={cn(
                    "rounded-xl px-3 py-1.5 text-xs font-medium transition-all duration-200 shadow-xs active:scale-95",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                      : "bg-card border border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {item}
                </button>
              );
            })}
          </div>
          {selectedInterests.filter((i) => !SUGGESTED_INTERESTS.includes(i)).length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedInterests
                .filter((i) => !SUGGESTED_INTERESTS.includes(i))
                .map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 text-xs font-semibold"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => toggleInterest(item)}
                      className="hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
            </div>
          )}
          <div className="flex gap-2 pt-1">
            <Input
              placeholder="Add other interest..."
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomInterest();
                }
              }}
              className="h-10 text-xs rounded-xl bg-card"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCustomInterest}
              disabled={!customInterest.trim()}
              className="h-10 px-3 text-xs rounded-xl"
            >
              <Plus className="size-3.5 mr-1" /> Add
            </Button>
          </div>
        </div>

        {/* Interactive Optional Student Skills */}
        <div className="rounded-2xl border border-border/70 p-4 bg-muted/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              Skills <span className="text-muted-foreground font-normal">(Optional)</span>
            </span>
            <span className="text-[11px] font-semibold text-primary">
              {selectedSkills.length} selected
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_SKILLS.map((item) => {
              const active = selectedSkills.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleSkill(item)}
                  className={cn(
                    "rounded-xl px-3 py-1.5 text-xs font-medium transition-all duration-200 shadow-xs active:scale-95",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                      : "bg-card border border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {item}
                </button>
              );
            })}
          </div>
          {selectedSkills.filter((s) => !SUGGESTED_SKILLS.includes(s)).length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedSkills
                .filter((s) => !SUGGESTED_SKILLS.includes(s))
                .map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 text-xs font-semibold"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => toggleSkill(item)}
                      className="hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
            </div>
          )}
          <div className="flex gap-2 pt-1">
            <Input
              placeholder="Add other skill..."
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomSkill();
                }
              }}
              className="h-10 text-xs rounded-xl bg-card"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCustomSkill}
              disabled={!customSkill.trim()}
              className="h-10 px-3 text-xs rounded-xl"
            >
              <Plus className="size-3.5 mr-1" /> Add
            </Button>
          </div>
        </div>

        {/* Primary Submit Button */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-10 text-sm font-bold rounded-2xl bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 mt-2"
        >
          {isPending ? (
            <>
              <Spinner className="mr-2 size-4" /> Creating account...
            </>
          ) : (
            <span className="inline-flex items-center gap-2">
              Create Student Account <ArrowRight className="size-4" />
            </span>
          )}
        </Button>

        {/* Divider */}
        <div className="relative my-4 text-center text-xs">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/80" />
          </div>
          <span className="relative bg-card px-3 text-muted-foreground font-medium">
            Or continue with
          </span>
        </div>

        {/* Google OAuth — full width, matches submit button */}
        <div className="w-full">
          <GoogleLoginComponent />
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;