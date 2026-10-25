"use client";

import { useState } from "react";
import {
  Download,
  FileSpreadsheet,
  Calendar,
  Printer,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExportCalendarIcs } from "@/hooks/calendar.hook";
import { ICalendarEvent } from "@/types/calendar.type";
import { toast } from "@/components/ui/toast";

interface ExportCalendarProps {
  events?: ICalendarEvent[];
}

export function ExportIcsButton({ events = [] }: ExportCalendarProps) {
  const { mutate: exportIcs, isPending } = useExportCalendarIcs();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleExportCsv = () => {
    if (!events || events.length === 0) {
      toast.add({
        title: "No events to export",
        description: "Your calendar does not have any active events.",
        type: "info",
      });
      return;
    }

    const headers = [
      "Title",
      "Type",
      "Start Date & Time (BST)",
      "Status",
      "Description",
    ];

    const rows = events.map((e) => [
      `"${(e.title || "").replace(/"/g, '""')}"`,
      `"${e.type}"`,
      `"${new Date(e.start).toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
        dateStyle: "medium",
        timeStyle: "short",
      })} (BST)"`,
      `"${e.status || "CONFIRMED"}"`,
      `"${(e.description || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `GradPath_Admissions_Calendar_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();

    toast.add({
      title: "CSV Export Complete",
      description: "Admissions schedule exported as spreadsheet (.csv).",
      type: "success",
    });
    setDropdownOpen(false);
  };

  const handlePrint = () => {
    window.print();
    setDropdownOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs h-9 bg-card"
          disabled={isPending}
          onClick={() => exportIcs()}
        >
          <Calendar className="size-3.5 text-primary" />
          <span>{isPending ? "Exporting..." : "Export iCal (.ics)"}</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="px-2 h-9 bg-card"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <ChevronDown className="size-3.5" />
        </Button>
      </div>

      {dropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setDropdownOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-1.5 w-56 rounded-xl border border-border/80 bg-popover p-1.5 shadow-lg animate-in fade-in-0 zoom-in-95">
            <button
              type="button"
              onClick={() => {
                exportIcs();
                setDropdownOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-accent transition-colors"
            >
              <Calendar className="size-4 text-primary" />
              <div className="text-left">
                <span className="block font-semibold">iCalendar (.ics)</span>
                <span className="text-[10px] text-muted-foreground">
                  Google Calendar, Apple, Outlook
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-accent transition-colors"
            >
              <FileSpreadsheet className="size-4 text-emerald-500" />
              <div className="text-left">
                <span className="block font-semibold">Spreadsheet (.csv)</span>
                <span className="text-[10px] text-muted-foreground">
                  Excel, Google Sheets, Numbers
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-accent transition-colors"
            >
              <Printer className="size-4 text-muted-foreground" />
              <div className="text-left">
                <span className="block font-semibold">Print / Save as PDF</span>
                <span className="text-[10px] text-muted-foreground">
                  Generate printer-friendly schedule
                </span>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
