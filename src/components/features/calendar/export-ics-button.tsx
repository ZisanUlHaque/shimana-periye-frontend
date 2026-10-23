"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExportCalendarIcs } from "@/hooks/calendar.hook";

export function ExportIcsButton() {
  const { mutate: exportIcs, isPending } = useExportCalendarIcs();

  return (
    <Button
      variant="outline"
      className="gap-1.5"
      disabled={isPending}
      onClick={() => exportIcs()}
    >
      <Download className="size-4" />
      {isPending ? "Exporting..." : "Export (.ics)"}
    </Button>
  );
}