import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito_Sans, Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/providers";
import { Toaster } from "@/components/ui/toast";

const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://pubgradpath.com"; 

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PUB GradPath | Higher-Study Discovery & Application Workspace",
    template: "%s | PUB GradPath",
  },
  description:
    "PUB GradPath helps students find universities, track scholarships, and connect with verified mentors to plan their journey abroad — all in one place.",
  keywords: [
    "study abroad",
    "scholarships",
    "university admissions",
    "mentorship",
    "student visa",
    "graduate path",
    "international education",
    "PUB GradPath",
  ],
  authors: [{ name: "PUB GradPath" }],
  creator: "PUB GradPath",
  publisher: "PUB GradPath",
  applicationName: "PUB GradPath",
  category: "Education",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "PUB GradPath",
    title: "PUB GradPath | Higher-Study Discovery & Application Workspace",
    description:
      "Find universities, track scholarships, and connect with verified mentors to plan your journey abroad.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PUB GradPath - Higher-Study Discovery & Application Workspace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PUB GradPath | Higher-Study Discovery & Application Workspace",
    description:
      "Find universities, track scholarships, and connect with verified mentors to plan your journey abroad.",
    images: ["/og-image.png"],
    creator: "@pubgradpath",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        roboto.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}