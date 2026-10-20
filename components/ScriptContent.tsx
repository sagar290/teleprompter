"use client";

import type { ScriptSegment } from "@/types";

interface ScriptContentProps {
  segments: ScriptSegment[];
  textColor: string;
}

/** Renders script text with DOM-anchored pause markers (no emoji glyphs). */
export function ScriptContent({ segments, textColor }: ScriptContentProps) {
  return (
    <div className="font-prompter whitespace-pre-wrap break-words text-left tracking-wide">
      {segments.map((segment, i) => {
        if (segment.type === "text") {
          return <span key={`t-${i}`}>{segment.value}</span>;
        }

        if (segment.kind === "line") {
          return (
            <span
              key={segment.id}
              data-pause-id={segment.id}
              data-pause-ms={segment.durationMs}
              className="my-[0.6em] block h-0 w-full select-none"
              aria-hidden="true"
            >
              <span
                className="mx-auto block h-px w-1/3 max-w-[12rem] opacity-25"
                style={{ backgroundColor: textColor }}
              />
            </span>
          );
        }

        // Invisible inline anchor — pause fires when this crosses the guide.
        return (
          <span
            key={segment.id}
            data-pause-id={segment.id}
            data-pause-ms={segment.durationMs}
            className="inline-block h-[1em] w-0 align-baseline"
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}
