"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { toast } from "../ui/toast";
import { Spinner } from "../ui/spinner";
import { useVerifyStudentEmail } from "@/hooks";
import { Mail, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const RESEND_COOLDOWN = 120;

export default function VerifyAccountForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);

  const { mutate: verifyAccount, isPending: isVerifying } = useVerifyStudentEmail();

  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (!email) {
      router.push("/register");
    }
  }, [email, router]);

  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOTP = () => {
    if (otp.length !== 6) {
      setIsInvalid(true);
      return;
    }

    verifyAccount(
      { email, otp },
      {
        onSuccess: (res: any) => {
          if (res && res.success === false) {
            toast.add({
              title: "Verification Failed",
              description: res.message || "Invalid or expired OTP code",
              type: "error",
            });
            setIsInvalid(true);
            return;
          }

          toast.add({
            title: "Verification Successful!",
            description: "Your student account is now verified. Please sign in.",
            type: "success",
          });

          router.push("/login");
        },
        onError: (err: any) => {
          toast.add({
            title: "Verification Failed",
            description:
              err?.data?.message || err?.message || "Invalid or expired OTP",
            type: "error",
          });
          setIsInvalid(true);
        },
      }
    );
  };

  return (
    <Card className="w-full border-border/80 shadow-md">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Mail className="size-6" />
        </div>
        <CardTitle className="text-2xl font-bold">Check your inbox</CardTitle>
        <CardDescription className="text-sm">
          We sent a 6-digit verification code to
          <br />
          <span className="font-semibold text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Field data-invalid={isInvalid ? "" : undefined}>
          <FieldLabel className="sr-only">6-Digit Verification Code</FieldLabel>
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              value={otp}
              onChange={(value) => {
                setOtp(value);
                if (isInvalid) setIsInvalid(false);
              }}
              disabled={isVerifying}
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
          {isInvalid && (
            <FieldError className="text-center">
              Please enter a valid 6-digit code.
            </FieldError>
          )}
          <FieldDescription className="text-center text-xs pt-1">
            Enter the 6-digit code sent to your email address.
          </FieldDescription>
        </Field>

        <Button
          onClick={handleOTP}
          disabled={otp.length !== 6 || isVerifying}
          className="w-full h-10 font-semibold"
        >
          {isVerifying ? (
            <>
              <Spinner className="mr-2 size-4" /> Verifying...
            </>
          ) : (
            "Verify & Continue"
          )}
        </Button>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 text-center text-xs text-muted-foreground border-t pt-4">
        <p>
          Didn&apos;t receive the email?{" "}
          <Link
            href="/register"
            className="text-primary hover:underline font-medium"
          >
            Try re-registering
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
