"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff, KeyRound, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useResetPassword, useForgotPassword } from "@/hooks";
import { ResetPasswordZodSchema } from "@/validation";
import { cn } from "@/lib/utils";

const RESEND_COOLDOWN = 120;

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);

  const { mutate: resetPass, isPending } = useResetPassword();
  const { mutate: resendOtp, isPending: resending } = useForgotPassword();

  useEffect(() => {
    if (!emailFromUrl) {
      router.replace("/forgot-password");
    }
  }, [emailFromUrl, router]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setInterval(() => setResendTimer((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handleResend = () => {
    if (resendTimer > 0 || resending || !emailFromUrl) return;

    resendOtp(
      { email: emailFromUrl.trim().toLowerCase() },
      {
        onSuccess: () => {
          toast.add({
            title: "Code sent",
            description: "A new OTP has been sent to your email.",
            type: "success",
          });
          setResendTimer(RESEND_COOLDOWN);
        },
        onError: (err: any) => {
          toast.add({
            title: "Resend failed",
            description:
              err?.data?.message || err?.message || "Please wait a moment and try again.",
            type: "error",
          });
        },
      }
    );
  };

  const form = useForm({
    defaultValues: {
      email: emailFromUrl,
      otp: "",
      newPassword: "",
    },
    validators: {
      onSubmit: ResetPasswordZodSchema,
    },
    onSubmit: ({ value }) => {
      resetPass(
        {
          email: value.email.trim().toLowerCase(),
          otp: value.otp,
          newPassword: value.newPassword,
        },
        {
          onSuccess: (res: any) => {
            if (res && res.success === false) {
              toast.add({
                title: "Reset Failed",
                description: res.message || "Invalid or expired OTP",
                type: "error",
              });
              return;
            }

            toast.add({
              title: "Password Updated",
              description: "You can now log in with your new password.",
              type: "success",
            });
            router.push("/login");
          },
          onError: (err: any) => {
            toast.add({
              title: "Reset Failed",
              description:
                err?.data?.message || err?.message || "Could not reset password. Check OTP.",
              type: "error",
            });
          },
        }
      );
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
          <KeyRound className="size-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Create New Password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code sent to{" "}
          <span className="font-medium text-foreground">{emailFromUrl}</span> and your new password.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        {/* OTP Input */}
        <form.Field name="otp">
          {(field) => {
            const hasError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <div className="relative pt-2">
                <span className="text-xs font-medium text-muted-foreground block text-center mb-1">
                  6-Digit Verification Code
                </span>
                <div className="flex justify-center my-1">
                  <InputOTP
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS}
                    value={field.state.value}
                    onChange={(val) => field.handleChange(val)}
                    disabled={isPending}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {hasError && (
                  <FieldError className="text-center mt-1">
                    {field.state.meta.errors.map((e) => e?.message || String(e)).join(", ")}
                  </FieldError>
                )}
              </div>
            );
          }}
        </form.Field>

        {/* New Password */}
        <form.Field name="newPassword">
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
                <span className="absolute left-4 top-0 z-10 bg-card px-1.5 text-xs font-medium text-muted-foreground pointer-events-none">
                  New Password
                </span>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={val}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={isPending}
                    className="pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>

                {val.length > 0 && (
                  <div className="mt-2 rounded-xl border bg-muted/40 p-3 text-xs space-y-1">
                    <p className="font-medium text-foreground">Password requirements:</p>
                    <div className="grid grid-cols-2 gap-1 text-muted-foreground">
                      <span className={cn("inline-flex items-center gap-1", hasLength && "text-success font-medium")}>
                        {hasLength ? <CheckCircle2 className="size-3.5" /> : <XCircle className="size-3.5" />} 8+ chars
                      </span>
                      <span className={cn("inline-flex items-center gap-1", hasUpper && "text-success font-medium")}>
                        {hasUpper ? <CheckCircle2 className="size-3.5" /> : <XCircle className="size-3.5" />} 1 uppercase
                      </span>
                      <span className={cn("inline-flex items-center gap-1", hasLower && "text-success font-medium")}>
                        {hasLower ? <CheckCircle2 className="size-3.5" /> : <XCircle className="size-3.5" />} 1 lowercase
                      </span>
                      <span className={cn("inline-flex items-center gap-1", (hasNumber && hasSpecial) && "text-success font-medium")}>
                        {hasNumber && hasSpecial ? <CheckCircle2 className="size-3.5" /> : <XCircle className="size-3.5" />} Number & symbol
                      </span>
                    </div>
                  </div>
                )}

                {hasError && (
                  <FieldError className="mt-1">
                    {field.state.meta.errors.map((e) => e?.message || String(e)).join(", ")}
                  </FieldError>
                )}
              </div>
            );
          }}
        </form.Field>

        {/* Resend timer */}
        <div className="text-center text-xs text-muted-foreground pt-1">
          Didn&apos;t receive code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={resendTimer > 0 || resending}
            className={cn(
              "font-medium",
              resendTimer > 0 || resending
                ? "text-muted-foreground/60 cursor-not-allowed"
                : "text-primary hover:underline cursor-pointer"
            )}
          >
            {resendTimer > 0 ? `Resend code (${formatTime(resendTimer)})` : "Resend code"}
          </button>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-12 text-sm font-semibold rounded-2xl mt-2"
        >
          {isPending ? (
            <>
              <Spinner className="mr-2 size-4" /> Resetting password...
            </>
          ) : (
            "Save New Password"
          )}
        </Button>

        <div className="text-center pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium"
          >
            <ArrowLeft className="size-3.5" /> Back to Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
