"use client";

import { useEffect, useState } from "react";

interface CountdownOverlayProps {
  active: boolean;
  onComplete: () => void;
  seconds?: number;
}

export function CountdownOverlay({
  active,
  onComplete,
  seconds = 3,
}: CountdownOverlayProps) {
  const [count, setCount] = useState(seconds);

  useEffect(() => {
    if (!active) {
      setCount(seconds);
      return;
    }

    setCount(seconds);
    let current = seconds;
    const id = window.setInterval(() => {
      current -= 1;
      if (current <= 0) {
        window.clearInterval(id);
        onComplete();
      } else {
        setCount(current);
      }
    }, 1000);

    return () => window.clearInterval(id);
  }, [active, onComplete, seconds]);

  if (!active) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-black/55 backdrop-blur-[2px]"
      role="status"
      aria-live="assertive"
      aria-label={`Starting in ${count}`}
    >
      <span
        key={count}
        className="animate-countdown text-[min(28vw,180px)] font-semibold tabular-nums text-white drop-shadow-lg"
      >
        {count}
      </span>
    </div>
  );
}
