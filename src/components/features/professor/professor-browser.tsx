"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ProfessorList } from "./professor-list";

export function ProfessorBrowser({ isAdmin = false }: { isAdmin?: boolean }) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
        <Input
          placeholder="Search professors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 text-xs"
        />
      </div>
      <ProfessorList filters={{ searchTerm: searchTerm || undefined }} isAdmin={isAdmin} />
    </div>
  );
}
