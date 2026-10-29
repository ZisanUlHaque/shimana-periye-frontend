import ResetPasswordForm from "@/components/form/reset-password-form"
import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-6xl rounded-3xl border bg-chart-1/10 p-6 shadow-lg md:p-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div className="space-y-6 px-4 md:px-8">
            <Link href={"/"}>
              <div className="font-serif text-2xl text-primary italic">
                PUB GradPath
              </div>
            </Link>

            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground">
                Reset Password
              </h1>
              <p className="text-sm text-muted-foreground">
                Choose a new password for your PUB GradPath account
              </p>
            </div>

            <Suspense
              fallback={
                <p className="py-6 text-center text-xs text-muted-foreground">
                  Loading…
                </p>
              }
            >
              <ResetPasswordForm />
            </Suspense>

            <p className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Back to login
              </Link>
            </p>
          </div>

          <div className="relative h-[400px] overflow-hidden rounded-2xl lg:h-[600px]">
            <Image
              src="https://plus.unsplash.com/premium_photo-1690208323920-ee856e95d403?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
              alt="Reset Password"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
              <div className="h-2 w-6 rounded-full bg-primary"></div>
              <div className="h-2 w-2 rounded-full bg-white/70"></div>
              <div className="h-2 w-2 rounded-full bg-white/70"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}