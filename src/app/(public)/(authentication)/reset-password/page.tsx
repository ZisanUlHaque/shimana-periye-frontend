import Logo from "@/app/assets/Logo";
import ResetPasswordForm from "@/components/form/reset-password-form";
import Image from "next/image";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop"
          alt="Reset Password"
          fill
          priority
          sizes="50vw"
          className="object-cover dark:brightness-[0.3] dark:grayscale"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Logo />
        </div>

        <div className="flex flex-1 items-center justify-center py-6">
          <div className="w-full max-w-sm">
            <Suspense
              fallback={
                <p className="text-center text-xs text-muted-foreground py-6">
                  Loading…
                </p>
              }
            >
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
