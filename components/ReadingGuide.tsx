"use client";

import { useCallback, useRef } from "react";
import { hexToRgba } from "@/lib/color";

interface ReadingGuideProps {
  visible: boolean;
  /** Highlight / guide color (independent from script text color). */
  color?: string;
  /** Vertical position from top (0–100%). */
  position?: number;
  /** Band height in pixels. */
  height?: number;
  /** Live-edit position by dragging the band. */
  onPositionChange?: (position: number) => void;
  /** Live-edit height by dragging the bottom edge. */
  onHeightChange?: (height: number) => void;
}

const POSITION_MIN = 8;
const POSITION_MAX = 85;
const HEIGHT_MIN = 32;
const HEIGHT_MAX = 200;

/** Highlight band so the eye has a fixed reading target. */
export function ReadingGuide({
  visible,
  color = "#5eead4",
  position = 33,
  height = 64,
  onPositionChange,
  onHeightChange,
}: ReadingGuideProps) {
  const dragModeRef = useRef<"move" | "resize" | null>(null);

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      const mode = dragModeRef.current;
      if (!mode) return;

      const parent = (event.target as HTMLElement | null)?.closest(
        "[data-prompter-root]"
      ) as HTMLElement | null;
      const root =
        parent ??
        (document.querySelector("[data-prompter-root]") as HTMLElement | null);
      if (!root) return;

      const rect = root.getBoundingClientRect();
      if (rect.height <= 0) return;

      if (mode === "move" && onPositionChange) {
        const pct = ((event.clientY - rect.top) / rect.height) * 100;
        onPositionChange(
          Math.min(POSITION_MAX, Math.max(POSITION_MIN, Math.round(pct)))
        );
      }

      if (mode === "resize" && onHeightChange) {
        const topPx = (position / 100) * rect.height;
        const next = event.clientY - rect.top - topPx;
        onHeightChange(
          Math.min(HEIGHT_MAX, Math.max(HEIGHT_MIN, Math.round(next)))
        );
      }
    },
    [onHeightChange, onPositionChange, position]
  );

  const endDrag = useCallback(() => {
    dragModeRef.current = null;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", endDrag);
  }, [onPointerMove]);

  const startDrag = useCallback(
    (mode: "move" | "resize") => (event: React.PointerEvent) => {
      if (!onPositionChange && !onHeightChange) return;
      event.preventDefault();
      event.stopPropagation();
      dragModeRef.current = mode;
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", endDrag);
    },
    [endDrag, onHeightChange, onPointerMove, onPositionChange]
  );

  if (!visible) return null;

  const editable = Boolean(onPositionChange || onHeightChange);
  const fill = hexToRgba(color, 0.22);
  const edge = hexToRgba(color, 0.85);
  const mid = hexToRgba(color, 0.45);

  return (
    <div
      className="absolute inset-x-0 z-10"
      style={{
        top: `${position}%`,
        height: `${height}px`,
        pointerEvents: editable ? "auto" : "none",
      }}
      aria-hidden={!editable}
    >
      <div
        role={editable ? "slider" : undefined}
        aria-label={editable ? "Reading guide position" : undefined}
        aria-valuemin={POSITION_MIN}
        aria-valuemax={POSITION_MAX}
        aria-valuenow={Math.round(position)}
        tabIndex={editable ? 0 : undefined}
        onPointerDown={editable ? startDrag("move") : undefined}
        onKeyDown={
          editable && onPositionChange
            ? (event) => {
                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  onPositionChange(
                    Math.max(POSITION_MIN, Math.round(position) - 1)
                  );
                }
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  onPositionChange(
                    Math.min(POSITION_MAX, Math.round(position) + 1)
                  );
                }
              }
            : undefined
        }
        className={`relative h-full w-full ${
          editable ? "cursor-ns-resize touch-none" : ""
        }`}
        style={{
          background: `linear-gradient(to bottom, transparent, ${fill}, transparent)`,
          borderTop: `2px solid ${edge}`,
          borderBottom: `2px solid ${edge}`,
          boxShadow: `inset 0 0 0 1px ${mid}`,
        }}
      >
        <span
          className="absolute left-2 top-1/2 -translate-y-1/2 text-lg leading-none sm:left-4"
          style={{ color }}
        >
          ▶
        </span>
        <span
          className="absolute right-2 top-1/2 -translate-y-1/2 rotate-180 text-lg leading-none sm:right-4"
          style={{ color }}
        >
          ▶
        </span>

        {editable && onHeightChange ? (
          <button
            type="button"
            aria-label="Resize reading guide"
            className="absolute inset-x-8 -bottom-1 h-3 cursor-ns-resize rounded-full bg-transparent"
            onPointerDown={startDrag("resize")}
            style={{ borderBottom: `2px solid ${edge}` }}
          />
        ) : null}
      </div>
    </div>
  );
}
