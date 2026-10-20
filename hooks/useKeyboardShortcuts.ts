"use client";

import { useEffect } from "react";

export interface KeyboardShortcutHandlers {
  onTogglePlay?: () => void;
  onSpeedUp?: () => void;
  onSpeedDown?: () => void;
  onFontUp?: () => void;
  onFontDown?: () => void;
  onToggleMirror?: () => void;
  onToggleFullscreen?: () => void;
  onReset?: () => void;
  onExit?: () => void;
  enabled?: boolean;
}

/**
 * Space = play/pause, Up/Down = speed, +/- = font size,
 * M = mirror, F = fullscreen, R = reset, Esc = exit
 */
export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers) {
  const {
    onTogglePlay,
    onSpeedUp,
    onSpeedDown,
    onFontUp,
    onFontDown,
    onToggleMirror,
    onToggleFullscreen,
    onReset,
    onExit,
    enabled = true,
  } = handlers;

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || target?.isContentEditable) {
        return;
      }

      switch (event.key) {
        case " ":
          event.preventDefault();
          onTogglePlay?.();
          break;
        case "ArrowUp":
          event.preventDefault();
          onSpeedUp?.();
          break;
        case "ArrowDown":
          event.preventDefault();
          onSpeedDown?.();
          break;
        case "+":
        case "=":
          event.preventDefault();
          onFontUp?.();
          break;
        case "-":
        case "_":
          event.preventDefault();
          onFontDown?.();
          break;
        case "m":
        case "M":
          onToggleMirror?.();
          break;
        case "f":
        case "F":
          onToggleFullscreen?.();
          break;
        case "r":
        case "R":
          onReset?.();
          break;
        case "Escape":
          onExit?.();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    enabled,
    onTogglePlay,
    onSpeedUp,
    onSpeedDown,
    onFontUp,
    onFontDown,
    onToggleMirror,
    onToggleFullscreen,
    onReset,
    onExit,
  ]);
}
