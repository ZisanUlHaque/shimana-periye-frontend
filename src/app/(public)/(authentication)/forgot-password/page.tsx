import ForgotPasswordForm from "@/components/form/forgot-password-form";
import Image from "next/image";

export default function ForgotPasswordPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop"
          alt="Forgot Password"
          fill
          priority
          sizes="50vw"
          className="object-cover dark:brightness-[0.3] dark:grayscale"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
        </div>

        <div className="flex flex-1 items-center justify-center py-6">
          <div className="w-full max-w-sm">
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
