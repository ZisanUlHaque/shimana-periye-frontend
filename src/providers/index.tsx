"use client";

import { ReactNode } from "react";
import QueryProvider from "./query.provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import GoogleAuthProvider from "./google-auth.provider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <GoogleAuthProvider>
      <QueryProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </QueryProvider>
    </GoogleAuthProvider>
  );
}