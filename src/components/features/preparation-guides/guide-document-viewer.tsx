"use client";

import {
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Maximize2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface GuideImage {
  url: string;
  caption: string;
  previewUrl: string;
}

interface GuideDocumentViewerProps {
  pdfUrl?: string;
  pdfName?: string;
  images?: GuideImage[];
  title: string;
}

export function GuideDocumentViewer({
  pdfUrl,
  pdfName,
  images = [],
  title,
}: GuideDocumentViewerProps) {
  const [activeTab, setActiveTab] = useState<"images" | "pdf">(
    pdfUrl ? "pdf" : "images",
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs flex flex-col gap-6">
      {/* ── Action Header & Tab Switcher ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            Official Sample Document & PDF Blueprint
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verified academic layout with downloadable letterhead-ready PDF
            standard.
          </p>
        </div>

        {/* View Mode Toggle + PDF Download Action */}
        <div className="flex flex-wrap items-center gap-2">
          {pdfUrl && images.length > 0 && (
            <div className="flex items-center rounded-xl bg-muted/60 p-1 border border-border/60 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("pdf")}
                className={`rounded-lg px-3 py-1 font-semibold transition-all ${
                  activeTab === "pdf"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                PDF Reader
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("images")}
                className={`rounded-lg px-3 py-1 font-semibold transition-all ${
                  activeTab === "images"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Visual Sheets ({images.length})
              </button>
            </div>
          )}

          {pdfUrl && (
            <a
              href={pdfUrl}
              download={pdfName || "document.pdf"}
              className="inline-flex"
            >
              <Button
                size="sm"
                className="gap-2 rounded-xl h-9 text-xs font-bold bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:shadow-primary/30"
              >
                <Download className="size-3.5" />
                <span>Download Sample PDF</span>
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* ── PDF Reader Mode ── */}
      {activeTab === "pdf" && pdfUrl && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/30 rounded-xl px-4 py-2 border border-border/50">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <CheckCircle2 className="size-4 text-emerald-500" />
              Document: {pdfName || "Official Template.pdf"}
            </span>
            <div className="flex items-center gap-3">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold flex items-center gap-1"
              >
                <span>Open in Tab</span>
                <ExternalLink className="size-3" />
              </a>
              <a
                href={pdfUrl}
                download={pdfName || "document.pdf"}
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1"
              >
                <span>Download</span>
                <Download className="size-3" />
              </a>
            </div>
          </div>

          {/* Embedded Interactive PDF Viewer */}
          <div className="w-full rounded-2xl overflow-hidden border border-border/80 bg-background/50 shadow-inner">
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=0`}
              title={title}
              className="w-full h-[600px] sm:h-[750px] border-0"
            />
          </div>
        </div>
      )}

      {/* ── Visual Sheets & Image Infographics Mode ── */}
      {(activeTab === "images" || !pdfUrl) && images.length > 0 && (
        <div className="grid gap-6">
          {images.map((img, idx) => (
            <div
              key={img.url}
              className="rounded-2xl border border-border/70 bg-muted/20 overflow-hidden shadow-xs flex flex-col"
            >
              <div className="p-4 bg-muted/40 border-b border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="rounded-md bg-primary text-primary-foreground font-bold text-xs px-2 py-0.5">
                    Sheet #{idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-foreground">
                    {img.caption}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedImage(img.url)}
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground bg-background/80 px-2.5 py-1 rounded-lg border border-border/60 transition-colors"
                  >
                    <Maximize2 className="size-3" />
                    <span>Zoom</span>
                  </button>
                  <a href={img.url} target="_blank" rel="noopener noreferrer">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 text-xs h-8"
                    >
                      <ExternalLink className="size-3" />
                      <span>Full Resolution</span>
                    </Button>
                  </a>
                </div>
              </div>

              {/* Render High-Res Image Cleanly */}
              <div className="w-full bg-background/60 p-4 sm:p-6 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setSelectedImage(img.url)}
                  className="cursor-zoom-in max-w-3xl w-full rounded-xl overflow-hidden border border-border/70 shadow-md transition-transform hover:scale-[1.01] p-0 bg-transparent text-left"
                >
                  <Image
                    src={img.url}
                    alt={img.caption}
                    width={900}
                    height={1100}
                    className="w-full h-auto object-contain max-h-[700px] mx-auto bg-card"
                  />
                </button>
              </div>

              <div className="p-3 bg-muted/30 border-t border-border/50 text-center">
                <p className="text-[11px] text-muted-foreground">
                  Click the sheet or "Zoom" to view at 100% scale. All sections
                  adhere to international graduate standards.
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Fullscreen Zoom Lightbox Modal ── */}
      {selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-8"
        >
          <div className="relative max-w-5xl max-h-[90vh] overflow-auto rounded-2xl bg-background p-4 border border-border shadow-2xl flex flex-col items-center">
            <div className="w-full flex justify-end pb-2">
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground bg-muted/60 px-3 py-1 rounded-lg border"
              >
                <X className="size-4" />
                <span>Close</span>
              </button>
            </div>
            <Image
              src={selectedImage}
              alt="Enlarged document preview"
              width={1200}
              height={1600}
              className="max-h-[80vh] w-auto mx-auto rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
