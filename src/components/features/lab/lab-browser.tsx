"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { LabList } from "./lab-list";

export function LabBrowser({ isAdmin = false }: { isAdmin?: boolean }) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
        <Input
          placeholder="Search laboratories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 text-xs"
        />
      </div>
      <LabList filters={{ searchTerm: searchTerm || undefined }} isAdmin={isAdmin} />
    </div>
  );
}
