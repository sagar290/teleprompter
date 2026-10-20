export interface Settings {
  /** Pixels scrolled per second at 1× (base unit for speed multiplier). */
  speed: number;
  fontSize: number;
  lineHeight: number;
  /** Horizontal padding as a percentage of viewport width (side margins). */
  textWidth: number;
  mirrorHorizontal: boolean;
  mirrorVertical: boolean;
  textColor: string;
  backgroundColor: string;
  showReadingGuide: boolean;
  /** Reading-guide / highlight band color. */
  guideColor: string;
  /** Reading-guide vertical position from top of the viewport (0–100%). */
  guidePosition: number;
  /** Reading-guide band height in pixels. */
  guideHeight: number;
  countdownEnabled: boolean;
  voiceFollowEnabled: boolean;
}

export interface ScriptDocument {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

export interface PrompterState {
  script: string;
  settings: Settings;
  activeScriptId: string | null;
}

export type ScrollControlMessage =
  | { type: "play" }
  | { type: "pause" }
  | { type: "toggle" }
  | { type: "reset" }
  | { type: "set-speed"; speed: number }
  | { type: "nudge-speed"; delta: number }
  | { type: "set-font-size"; fontSize: number }
  | { type: "nudge-font-size"; delta: number }
  | { type: "toggle-mirror" }
  | { type: "exit" };

export interface PauseMarker {
  /** Pause duration in milliseconds. */
  durationMs: number;
  /** Unique key for this marker instance (matches data-pause-id in the DOM). */
  id: string;
  /** Line break pause vs inline `[pause Ns]`. */
  kind: "line" | "inline";
}

export type ScriptSegment =
  | { type: "text"; value: string }
  | { type: "pause"; id: string; durationMs: number; kind: "line" | "inline" };

export interface ParsedScript {
  /** Renderable segments (text + pause markers). */
  segments: ScriptSegment[];
  /** Plain text for voice-follow / word counts (no pause glyphs). */
  displayText: string;
  /** Pause points derived from `---` and `[pause Ns]` markup. */
  pauses: PauseMarker[];
  wordCount: number;
}
