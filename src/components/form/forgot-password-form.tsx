"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { ForgotPasswordZodSchema } from "@/validation";
import { ArrowLeft, Mail } from "lucide-react";
import { useForgotPassword } from "@/hooks";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const { mutate: sendOtp, isPending } = useForgotPassword();

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: ForgotPasswordZodSchema,
    },
    onSubmit: ({ value }) => {
      const email = value.email.trim().toLowerCase();

      sendOtp(
        { email },
        {
          onSuccess: (res: any) => {
            if (res && res.success === false) {
              toast.add({
                title: "Request Failed",
                description: res.message || "Unable to send reset code",
                type: "error",
              });
              return;
            }

            toast.add({
              title: "OTP Sent!",
              description: "Check your email inbox for the 6-digit reset code.",
              type: "success",
            });
            const params = new URLSearchParams({ email });
            router.push(`/reset-password?${params.toString()}`);
          },
          onError: (err: any) => {
            toast.add({
              title: "Request Failed",
              description:
                err?.data?.message ||
                err?.message ||
                "Failed to send reset code. Please check your email.",
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
          <Mail className="size-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Forgot Password?
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your registered email address and we&apos;ll send you a 6-digit verification code.
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
        <form.Field name="email">
          {(field) => {
            const hasError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <div className="relative pt-2">
                <span className="absolute left-4 top-0 z-10 bg-card px-1.5 text-xs font-medium text-muted-foreground pointer-events-none">
                  Email
                </span>
                <Input
                  type="email"
                  placeholder="john.doe@gmail.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isPending}
                  required
                />
                {hasError && (
                  <FieldError className="mt-1">
                    {field.state.meta.errors.map((e) => e?.message || String(e)).join(", ")}
                  </FieldError>
                )}
              </div>
            );
          }}
        </form.Field>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-12 text-sm font-semibold rounded-2xl"
        >
          {isPending ? (
            <>
              <Spinner className="mr-2 size-4" /> Sending Code...
            </>
          ) : (
            "Send Reset Code"
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
