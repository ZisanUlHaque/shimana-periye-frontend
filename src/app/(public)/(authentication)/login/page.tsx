import LoginForm from "@/components/form/login-form"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-6xl rounded-3xl border bg-chart-1/10 p-6 shadow-lg md:p-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div className="space-y-6 px-4 md:px-8">
            <Link href={"/"}>
              <div className="font-serif text-2xl text-primary italic">
                ShimanaPeriye
              </div>
            </Link>

            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground">Login</h1>
              <p className="text-sm text-muted-foreground">
                Login to access your ShimanaPeriye account
              </p>
            </div>

            <LoginForm />
          </div>

          <div className="relative h-[400px] overflow-hidden rounded-2xl lg:h-[600px]">
            <Image
              src="https://plus.unsplash.com/premium_photo-1713296255442-e9338f42aad8?q=80&w=722&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
              alt="Hotel view"
              fill
              className="object-cover"
              priority
            />
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