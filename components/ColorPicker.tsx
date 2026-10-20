"use client";

import { cn } from "@/lib/cn";

interface ColorPickerProps {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ColorPicker({
  id,
  label,
  value,
  onChange,
  className,
}: ColorPickerProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label
      className={cn("flex items-center justify-between gap-3 text-sm", className)}
      htmlFor={inputId}
    >
      <span className="text-ink-muted">{label}</span>
      <span className="flex items-center gap-2">
        <span className="tabular-nums text-ink uppercase">{value}</span>
        <input
          id={inputId}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-9 cursor-pointer rounded-md border border-border bg-transparent p-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label={label}
        />
      </span>
    </label>
  );
}
