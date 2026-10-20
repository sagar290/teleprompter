"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Typed localStorage hook that stays SSR-safe:
 * - Initial render always uses `initialValue` (matches server HTML)
 * - After mount, reads from localStorage and syncs
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [stored, setStored] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) {
        setStored(JSON.parse(raw) as T);
      }
    } catch {
      // Corrupt or unavailable storage — keep defaults.
    } finally {
      setHydrated(true);
    }
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStored((prev) => {
        const next = typeof value === "function" ? (value as (p: T) => T)(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // Quota / private mode — state still updates in memory.
        }
        return next;
      });
    },
    [key]
  );

  return [stored, setValue, hydrated];
}
