"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Eye,
  EyeOff,
  Shield,
  User,
  GraduationCap,
  ArrowRight,
  FastForward,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "../ui/toast";
import { Spinner } from "../ui/spinner";
import Link from "next/link";
import GoogleLoginComponent from "../modules/google-login/GoogleLogin";
import { cn } from "@/lib/utils";
import { useLogin } from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";


export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: login, isPending: loginPending } = useLogin();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.add({
        title: "Required fields missing",
        description: "Please enter your email and password.",
        type: "error",
      });
      return;
    }

    login(
      { email: email.trim().toLowerCase(), password },
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

          // Pre-populate query client user state so RoleGuard does not bounce
          queryClient.setQueryData(["user"], res);
          queryClient.invalidateQueries({ queryKey: ["user"] });

          const role = res?.data?.user?.role || res?.data?.role;
          const target =
            role === "ADMIN"
              ? "/admin"
              : role === "MENTOR"
              ? "/mentor"
              : "/";

          router.replace(target);
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
  };


  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleLoginSubmit} className="space-y-4">
        {/* Floating Email Field */}
        <div className="relative pt-2">
          <span className="absolute left-4 top-0 z-10 bg-card px-2 text-xs font-semibold text-muted-foreground pointer-events-none">
            Email
          </span>
          <Input
            type="email"
            placeholder="john.doe@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loginPending}
            className="h-13 rounded-2xl bg-card border-border/80 px-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
            required
          />
        </div>

        {/* Floating Password Field with Forgot Password */}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
        </div>

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

        {/* Google OAuth Button */}
        <div className="w-full">
          <GoogleLoginComponent />
        </div>
      </form>
    </div>
  );
}
