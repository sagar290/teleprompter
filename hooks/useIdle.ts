"use client";

import { useEffect, useState } from "react";

/**
 * Becomes idle after `timeoutMs` without pointer/keyboard activity.
 * Used to auto-hide the floating controls bar.
 */
export function useIdle(timeoutMs = 3000): boolean {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const bump = () => {
      setIdle(false);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setIdle(true), timeoutMs);
    };

    const events: Array<keyof WindowEventMap> = [
      "mousemove",
      "mousedown",
      "touchstart",
      "keydown",
      "wheel",
    ];

    events.forEach((event) => window.addEventListener(event, bump, { passive: true }));
    bump();

    return () => {
      if (timer) clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, bump));
    };
  }, [timeoutMs]);

  return idle;
}
