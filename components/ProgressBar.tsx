"use client";

import { formatDuration, estimateTimeRemaining } from "@/lib/script";

interface ProgressBarProps {
  progress: number;
  remainingPixels: number;
  speed: number;
}

export function ProgressBar({
  progress,
  remainingPixels,
  speed,
}: ProgressBarProps) {
  const remainingSec = estimateTimeRemaining(remainingPixels, speed);
  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);

  return (
    <div className="w-full" role="status" aria-label={`Progress ${pct}%`}>
      <div className="mb-1.5 flex items-center justify-between text-xs text-white/70">
        <span className="tabular-nums">{pct}%</span>
        <span className="tabular-nums">~{formatDuration(remainingSec)} left</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-150 ease-soft"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
