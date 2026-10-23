"use client";

import { useState } from "react";
import { Plus, X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TagEditorProps {
  label: string;
  description: string;
  placeholder: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  disabled?: boolean;
}

export function TagEditor({
  label,
  description,
  placeholder,
  tags,
  onChange,
  maxTags = 20,
  disabled = false,
}: TagEditorProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    if (tags.length >= maxTags) {
      setError(`Maximum ${maxTags} tags allowed.`);
      return;
    }

    if (tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      setError("This item has already been added.");
      return;
    }

    if (trimmed.length > 50) {
      setError("Tag must be 50 characters or fewer.");
      return;
    }

    onChange([...tags, trimmed]);
    setInputValue("");
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (indexToRemove: number) => {
    onChange(tags.filter((_, i) => i !== indexToRemove));
    setError(null);
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Tag className="size-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground">{label}</h4>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">
          {tags.length} / {maxTags}
        </span>
      </div>

      {/* Input row */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || tags.length >= maxTags}
          className="text-xs"
        />
        <Button
          type="button"
          size="sm"
          onClick={handleAdd}
          disabled={disabled || !inputValue.trim() || tags.length >= maxTags}
          className="gap-1 px-3 text-xs"
        >
          <Plus className="size-3.5" />
          Add
        </Button>
      </div>

      {error && <p className="text-xs font-medium text-destructive">{error}</p>}

      {/* Tag Badges */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {tags.length === 0 ? (
          <span className="text-xs italic text-muted-foreground">
            No items added yet. Add some to improve matching.
          </span>
        ) : (
          tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                disabled={disabled}
                className="rounded-full p-0.5 hover:bg-primary/20 hover:text-primary-foreground focus:outline-hidden"
              >
                <X className="size-3" />
              </button>
            </span>
          ))
        )}
      </div>
    </div>
  );
}
