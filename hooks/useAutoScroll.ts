"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PauseMarker } from "@/types";

export interface UseAutoScrollOptions {
  containerRef: React.RefObject<HTMLElement | null>;
  speed: number;
  playing: boolean;
  pauses?: PauseMarker[];
  /** Reading-guide position as 0–1 fraction of viewport height. */
  guideRatio?: number;
  /** Called when scroll reaches the bottom. */
  onComplete?: () => void;
}

/**
 * Smooth auto-scroll driven by requestAnimationFrame.
 * Uses delta-time so px/s speed stays consistent across refresh rates.
 * Manual wheel/touch scrolling updates position; auto-scroll resumes from there.
 * Pause markers briefly freeze scrolling when their y-position reaches the guide.
 */
export function useAutoScroll({
  containerRef,
  speed,
  playing,
  pauses = [],
  guideRatio = 0.33,
  onComplete,
}: UseAutoScrollOptions) {
  const [progress, setProgress] = useState(0);
  const [remainingPixels, setRemainingPixels] = useState(0);

  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const speedRef = useRef(speed);
  const playingRef = useRef(playing);
  const pauseUntilRef = useRef(0);
  const triggeredPausesRef = useRef<Set<string>>(new Set());
  const pausesRef = useRef(pauses);
  const guideRatioRef = useRef(guideRatio);
  const onCompleteRef = useRef(onComplete);
  const userScrollingRef = useRef(false);
  const userScrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  speedRef.current = speed;
  playingRef.current = playing;
  pausesRef.current = pauses;
  guideRatioRef.current = guideRatio;
  onCompleteRef.current = onComplete;

  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return { progress: 0, remaining: 0, max: 0 };
    const max = Math.max(0, el.scrollHeight - el.clientHeight);
    const current = el.scrollTop;
    const remaining = Math.max(0, max - current);
    const p = max === 0 ? 1 : current / max;
    return { progress: p, remaining, max };
  }, [containerRef]);

  const syncMetrics = useCallback(() => {
    const { progress: p, remaining } = measure();
    setProgress(p);
    setRemainingPixels(remaining);
  }, [measure]);

  const reset = useCallback(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = 0;
    triggeredPausesRef.current.clear();
    pauseUntilRef.current = 0;
    lastTimeRef.current = null;
    syncMetrics();
  }, [containerRef, syncMetrics]);

  // Track manual scroll so rAF doesn't fight the user mid-gesture.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const markUserScroll = () => {
      userScrollingRef.current = true;
      if (userScrollTimerRef.current) clearTimeout(userScrollTimerRef.current);
      userScrollTimerRef.current = setTimeout(() => {
        userScrollingRef.current = false;
        lastTimeRef.current = null;
        syncMetrics();
      }, 150);
    };

    const onScroll = () => {
      syncMetrics();
    };

    el.addEventListener("wheel", markUserScroll, { passive: true });
    el.addEventListener("touchmove", markUserScroll, { passive: true });
    el.addEventListener("scroll", onScroll, { passive: true });

    syncMetrics();

    return () => {
      el.removeEventListener("wheel", markUserScroll);
      el.removeEventListener("touchmove", markUserScroll);
      el.removeEventListener("scroll", onScroll);
      if (userScrollTimerRef.current) clearTimeout(userScrollTimerRef.current);
    };
  }, [containerRef, syncMetrics]);

  useEffect(() => {
    if (!playing) {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTimeRef.current = null;
      return;
    }

    const tick = (now: number) => {
      const el = containerRef.current;
      if (!el || !playingRef.current) {
        rafRef.current = null;
        return;
      }

      if (lastTimeRef.current == null) {
        lastTimeRef.current = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const dt = Math.min(0.05, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;

      if (!userScrollingRef.current && now >= pauseUntilRef.current) {
        // Fire pauses when real DOM markers cross the reading guide.
        const containerTop = el.getBoundingClientRect().top;
        const guideY =
          containerTop + el.clientHeight * guideRatioRef.current;

        for (const pause of pausesRef.current) {
          if (triggeredPausesRef.current.has(pause.id)) continue;
          const marker = el.querySelector(
            `[data-pause-id="${pause.id}"]`
          ) as HTMLElement | null;
          if (!marker) continue;

          const markerTop = marker.getBoundingClientRect().top;
          if (markerTop <= guideY) {
            triggeredPausesRef.current.add(pause.id);
            pauseUntilRef.current = now + pause.durationMs;
            break;
          }
        }

        if (now >= pauseUntilRef.current) {
          const max = Math.max(0, el.scrollHeight - el.clientHeight);
          const next = Math.min(max, el.scrollTop + speedRef.current * dt);
          el.scrollTop = next;

          if (next >= max - 0.5) {
            playingRef.current = false;
            onCompleteRef.current?.();
          }
        }
      }

      const { progress: p, remaining } = measure();
      setProgress(p);
      setRemainingPixels(remaining);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTimeRef.current = null;
    };
  }, [playing, containerRef, measure]);

  return { progress, remainingPixels, reset, syncMetrics };
}
