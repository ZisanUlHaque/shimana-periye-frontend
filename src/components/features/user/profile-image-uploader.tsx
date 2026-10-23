"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { useUploadProfileImage } from "@/hooks/user.hook";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface ProfileImageUploaderProps {
  currentImageUrl?: string | null;
  fallbackInitial?: string;
}

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ProfileImageUploader({
  currentImageUrl,
  fallbackInitial = "?",
}: ProfileImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { mutate: upload, isPending } = useUploadProfileImage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.add({
        title: "Invalid file type",
        description: "Only JPG, PNG or WEBP images are allowed.",
        type: "error",
      });
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.add({
        title: "File too large",
        description: `Image must be under ${MAX_SIZE_MB}MB.`,
        type: "error",
      });
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    upload(file);
  };

  const displayUrl = previewUrl ?? currentImageUrl;

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <div className="flex size-20 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-muted text-xl font-semibold text-muted-foreground">
          {displayUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={displayUrl} alt="Profile" className="size-full object-cover" />
          ) : (
            fallbackInitial
          )}
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          className={cn(
            "absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border border-border bg-background shadow-sm hover:bg-muted",
            isPending && "cursor-not-allowed opacity-70"
          )}
        >
          {isPending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Camera className="size-3.5" />
          )}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="text-sm text-muted-foreground">
        <p>JPG, PNG or WEBP. Max {MAX_SIZE_MB}MB.</p>
      </div>
    </div>
  );
}