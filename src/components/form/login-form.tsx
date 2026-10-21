"use client";

import { useForm } from "@tanstack/react-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FieldError } from "../ui/field";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  Shield,
  User,
  GraduationCap,
  Sparkles,
  ArrowRight,
  FastForward,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "../ui/toast";
import { Spinner } from "../ui/spinner";
import Link from "next/link";
import GoogleLoginComponent from "../modules/google-login/GoogleLogin";
import { cn } from "@/lib/utils";
import { LoginZodSchema } from "@/validation";
import { useLogin } from "@/hooks";

const DEMO_ACCOUNTS = [
  {
    role: "Admin",
    email: "admin@gradpath.test",
    password: "Admin@1234",
    icon: Shield,
    redirect: "/admin",
    accent: "hover:border-violet-500/50 hover:bg-violet-500/5",
    iconBg: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  },
  {
    role: "Mentor",
    email: "mentor@gradpath.test",
    password: "Mentor@1234",
    icon: User,
    redirect: "/mentor",
    accent: "hover:border-blue-500/50 hover:bg-blue-500/5",
    iconBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  },
  {
    role: "Student",
    email: "student@gradpath.test",
    password: "Student@1234",
    icon: GraduationCap,
    redirect: "/student",
    accent: "hover:border-emerald-500/50 hover:bg-emerald-500/5",
    iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  },
] as const;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const router = useRouter();

  const { mutate: login, isPending: loginPending } = useLogin();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: LoginZodSchema,
    },
    onSubmit: ({ value }) => {
      login(
        { email: value.email.trim().toLowerCase(), password: value.password },
        {
          onSuccess: (res: any) => {
            if (res && res.success === false) {
              toast.add({
                title: "Login failed",
                description: res.message || "Invalid credentials",
                type: "error",
              });
              return;
            }

            toast.add({
              title: "Welcome back!",
              description: "Logged in successfully.",
              type: "success",
            });

            const role = res?.data?.user?.role || res?.data?.role;
            if (role === "ADMIN") {
              router.push("/admin");
            } else if (role === "MENTOR") {
              router.push("/mentor");
            } else {
              router.push("/student");
            }
          },
          onError: (err: any) => {
            toast.add({
              title: "Login failed",
              description:
                err?.data?.message || err?.message || "Invalid email or password",
              type: "error",
            });
          },
        }
      );
    },
  });

  const handleDemoLogin = (account: (typeof DEMO_ACCOUNTS)[number]) => {
    setDemoLoading(account.role);
    login(
      { email: account.email, password: account.password },
      {
        onSuccess: () => {
          toast.add({
            title: `Signed in as ${account.role}`,
            description: `Redirecting to ${account.role.toLowerCase()} dashboard…`,
            type: "success",
          });
          router.push(account.redirect);
        },
        onError: () => {
          form.setFieldValue("email", account.email);
          form.setFieldValue("password", account.password);
          toast.add({
            title: "Demo credentials filled",
            description: "Click Sign In to continue.",
            type: "info",
          });
          setDemoLoading(null);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        {/* Floating Email Field */}
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
                  disabled={loginPending}
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

        {/* Floating Password Field with Forgot Password */}
        <form.Field name="password">
          {(field) => {
            const hasError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <div className="relative pt-2">
                <div className="flex items-center justify-between">
                  <span className="absolute left-4 top-0 z-10 bg-card px-2 text-xs font-semibold text-muted-foreground pointer-events-none">
                    Password
                  </span>
                  <Link
                    href="/forgot-password"
                    className="ml-auto mb-1 text-xs text-primary hover:underline font-semibold"
                    tabIndex={-1}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={loginPending}
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

        {/* Interactive Primary Submit Button */}
        <Button
          type="submit"
          disabled={loginPending}
          className="w-full h-10 text-sm font-bold rounded-2xl bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          {loginPending ? (
            <>
              <Spinner className="mr-2 size-4" /> Signing in...
            </>
          ) : (
            <span className="inline-flex items-center gap-1">
              Sign In <ArrowRight className="size-4" />
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

        {/* Google OAuth Button — same width as Sign In */}
        <div className="w-full">
          <GoogleLoginComponent />
        </div>
      </form>

      {/* Quick Demo Access Bar */}
      <div className="pt-2">
        <div className="flex items-center gap-2 mb-2.5">
          <FastForward className="size-3.5 text-primary" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Quick Demo Sign-in
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {DEMO_ACCOUNTS.map((acc) => {
            const Icon = acc.icon;
            const isLoading = demoLoading === acc.role;
            return (
              <button
                key={acc.role}
                type="button"
                onClick={() => handleDemoLogin(acc)}
                disabled={Boolean(demoLoading) || loginPending}
                className={cn(
                  "group flex flex-col items-center gap-1.5 rounded-2xl border border-border/70 p-3 text-center transition-all duration-200 bg-card/60 hover:bg-card shadow-xs active:scale-95",
                  acc.accent
                )}
              >
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110",
                    acc.iconBg
                  )}
                >
                  {isLoading ? <Spinner className="size-4" /> : <Icon className="size-4" />}
                </div>
                <span className="text-xs font-semibold text-foreground">{acc.role}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Register link — final section of the form */}
      <div className="border-t border-border/60 pt-4 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
        >
          Register
        </Link>
      </div>
    </div>
  );
}