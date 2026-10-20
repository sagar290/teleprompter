"use client";

import { cn } from "@/lib/cn";

interface SliderProps {
  id?: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  className?: string;
}

export function Slider({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
  className,
}: SliderProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className={cn("flex flex-col gap-2", className)} htmlFor={inputId}>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-ink-muted">{label}</span>
        <span className="tabular-nums text-ink">
          {value}
          {unit}
        </span>
      </div>
      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-muted accent-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-label={label}
      />
    </label>
  );
}
