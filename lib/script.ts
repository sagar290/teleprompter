import type { ParsedScript, PauseMarker, ScriptSegment } from "@/types";
import { WORDS_PER_MINUTE } from "@/lib/defaults";

const PAUSE_LINE = /^\s*---\s*$/;
const PAUSE_INLINE = /\[pause\s+(\d+(?:\.\d+)?)\s*s?\]/gi;

/**
 * Parses simple markup:
 * - A line of `---` becomes a 2s line pause
 * - `[pause 3s]` becomes an inline pause of the given seconds
 *
 * Pauses are segments (not emoji) so the prompter can place real DOM markers.
 */
export function parseScript(raw: string): ParsedScript {
  const pauses: PauseMarker[] = [];
  const segments: ScriptSegment[] = [];
  const textParts: string[] = [];
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  let pauseIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (PAUSE_LINE.test(line)) {
      const id = `pause-line-${pauseIndex++}`;
      const pause: PauseMarker = { id, durationMs: 2000, kind: "line" };
      pauses.push(pause);
      segments.push({ type: "pause", ...pause });
      if (i < lines.length - 1) {
        segments.push({ type: "text", value: "\n" });
        textParts.push("\n");
      }
      continue;
    }

    let last = 0;
    PAUSE_INLINE.lastIndex = 0;
    let match: RegExpExecArray | null;
    let lineText = "";

    while ((match = PAUSE_INLINE.exec(line)) !== null) {
      const start = match.index;
      const before = line.slice(last, start);
      if (before) {
        segments.push({ type: "text", value: before });
        lineText += before;
      }
      const seconds = Number(match[1]);
      const id = `pause-inline-${pauseIndex++}`;
      const pause: PauseMarker = {
        id,
        durationMs: Math.max(0, seconds) * 1000,
        kind: "inline",
      };
      pauses.push(pause);
      segments.push({ type: "pause", ...pause });
      last = start + match[0].length;
    }

    const rest = line.slice(last);
    const withNewline = i < lines.length - 1 ? `${rest}\n` : rest;
    if (withNewline) {
      segments.push({ type: "text", value: withNewline });
      lineText += withNewline;
    }
    textParts.push(lineText);
  }

  const displayText = textParts.join("");
  const wordCount = countWords(raw);

  return { segments, displayText, pauses, wordCount };
}

export function countWords(text: string): number {
  const cleaned = text
    .replace(PAUSE_INLINE, " ")
    .replace(/^\s*---\s*$/gm, " ")
    .trim();
  if (!cleaned) return 0;
  return cleaned.split(/\s+/).filter(Boolean).length;
}

export function estimateReadingMinutes(wordCount: number): number {
  if (wordCount <= 0) return 0;
  return wordCount / WORDS_PER_MINUTE;
}

export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.round(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Rough remaining-time estimate from scroll progress and configured speed.
 * Uses remaining scroll distance / speed (px/s).
 */
export function estimateTimeRemaining(
  remainingPixels: number,
  speedPxPerSec: number
): number {
  if (speedPxPerSec <= 0) return 0;
  return Math.max(0, remainingPixels / speedPxPerSec);
}

export function createScriptId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `script-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
