"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { cn } from "@/lib/cn";
import { countWords, estimateReadingMinutes, formatDuration } from "@/lib/script";

interface ScriptEditorProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

type InsertPreset = {
  id: string;
  label: string;
  insert: string;
  hint: string;
  mode: "break" | "block" | "pause";
};

const BREAK_PRESET: InsertPreset = {
  id: "break",
  label: "Break",
  insert: "---",
  hint: "Insert a line break pause (2 seconds)",
  mode: "break",
};

const SCRIPT_PRESETS: InsertPreset[] = [
  {
    id: "headlines",
    label: "Headlines",
    insert: `H1. 
H2. 
H3. 
H4. `,
    hint: "Insert headline placeholders",
    mode: "block",
  },
  {
    id: "open",
    label: "Open",
    insert: `আসসালামু আলাইকুম। উইন্ডো নিউজের দুপুরের সংবাদে সবাইকে স্বাগত জানিয়ে সাথে আছি আমি .............। এতক্ষণ শুনছিলেন সংবাদ শিরোনাম, এবার জানাবো বিস্তারিত।`,
    hint: "Insert opening greeting",
    mode: "block",
  },
  {
    id: "sports",
    label: "Sports",
    insert: `এবার খেলাধুলা সংবাদ।`,
    hint: "Insert sports section cue",
    mode: "block",
  },
  {
    id: "handoff",
    label: "Handoff",
    insert: `এ নিয়ে বিস্তারিত জানাচ্ছেন .............।`,
    hint: "Insert reporter handoff line",
    mode: "block",
  },
  {
    id: "desk",
    label: "Desk",
    insert: `বিস্তারিত দেখুন ডেস্ক রিপোর্টে।`,
    hint: "Insert desk report line",
    mode: "block",
  },
  {
    id: "close",
    label: "Close",
    insert: `এই ছিল আজকের সংবাদ। দেশ-বিদেশের সবশেষ আপডেট পেতে 'উইন্ডো নিউজ'-এর সাথেই থাকুন।
পরবর্তী সংবাদ দেখার আমন্ত্রণ জানিয়ে বিদায় নিচ্ছি। আল্লাহ হাফেজ।`,
    hint: "Insert closing sign-off",
    mode: "block",
  },
];

function Chip({
  label,
  hint,
  onClick,
  emphasize,
  active,
}: {
  label: string;
  hint: string;
  onClick: () => void;
  emphasize?: boolean;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={hint}
      aria-label={hint}
      aria-expanded={active}
      className={cn(
        "inline-flex h-9 min-w-9 items-center justify-center rounded-xl border px-3 text-sm font-medium transition-colors duration-150",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        emphasize || active
          ? "border-accent/40 bg-accent/10 text-accent hover:bg-accent/20"
          : "border-border bg-surface text-ink hover:bg-surface-muted"
      )}
    >
      {label}
    </button>
  );
}

export function ScriptEditor({ value, onChange, onClear }: ScriptEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pauseInputRef = useRef<HTMLInputElement>(null);
  const [pauseOpen, setPauseOpen] = useState(false);
  const [pauseSeconds, setPauseSeconds] = useState("1");

  const words = countWords(value);
  const minutes = estimateReadingMinutes(words);
  const readingLabel =
    minutes < 1
      ? `${Math.round(minutes * 60)}s`
      : formatDuration(minutes * 60);

  useEffect(() => {
    if (pauseOpen) {
      pauseInputRef.current?.focus();
      pauseInputRef.current?.select();
    }
  }, [pauseOpen]);

  const insertAtCursor = (preset: InsertPreset) => {
    const el = textareaRef.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    let before = value.slice(0, start);
    const after = value.slice(end);
    let insert = preset.insert;

    if (preset.mode === "break") {
      const needsLead = before.length > 0 && !before.endsWith("\n");
      const needsTrail = after.length > 0 && !after.startsWith("\n");
      insert = `${needsLead ? "\n" : ""}---${needsTrail ? "\n" : "\n"}`;
    } else if (preset.mode === "block") {
      if (before && !before.endsWith("\n")) insert = `\n${insert}`;
      if (!insert.endsWith("\n")) insert = `${insert}\n`;
      if (after && !after.startsWith("\n")) insert = `${insert}\n`;
    } else {
      if (before && !/\s$/.test(before)) insert = ` ${insert}`;
      if (after && !/^\s/.test(after)) insert = `${insert} `;
    }

    const next = `${before}${insert}${after}`;
    const caret = before.length + insert.length;
    onChange(next);

    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(caret, caret);
    });
  };

  const applyCustomPause = () => {
    const parsed = Number(pauseSeconds);
    const seconds = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
    const normalized = Number.isInteger(seconds)
      ? String(seconds)
      : String(Math.round(seconds * 10) / 10);

    insertAtCursor({
      id: "custom-pause",
      label: "Pause",
      insert: `[pause ${normalized}s]`,
      hint: `Pause ${normalized} seconds`,
      mode: "pause",
    });
    setPauseSeconds("1");
    setPauseOpen(false);
  };

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-elevated p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-ink-muted">
          Script
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          aria-label="Clear script"
          disabled={!value}
        >
          Clear
        </Button>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-14 shrink-0 text-xs font-medium uppercase tracking-wide text-ink-muted">
            Pause
          </span>
          <Chip
            label="Break"
            hint={BREAK_PRESET.hint}
            emphasize
            onClick={() => insertAtCursor(BREAK_PRESET)}
          />
          <Chip
            label="Pause"
            hint="Insert a custom pause"
            active={pauseOpen}
            onClick={() => setPauseOpen((open) => !open)}
          />

          {pauseOpen ? (
            <form
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-2 py-1"
              onSubmit={(event) => {
                event.preventDefault();
                applyCustomPause();
              }}
            >
              <label htmlFor="pause-seconds" className="sr-only">
                Pause seconds
              </label>
              <input
                ref={pauseInputRef}
                id="pause-seconds"
                type="number"
                min={0.5}
                step={0.5}
                value={pauseSeconds}
                onChange={(event) => setPauseSeconds(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.preventDefault();
                    setPauseOpen(false);
                  }
                }}
                className="h-7 w-14 rounded-md border border-border bg-surface-elevated px-2 text-sm tabular-nums text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
                aria-label="Pause duration in seconds"
              />
              <span className="text-xs text-ink-muted">sec</span>
              <button
                type="submit"
                className="h-7 rounded-lg bg-accent px-2.5 text-xs font-medium text-black hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
              >
                Insert
              </button>
            </form>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="w-14 shrink-0 text-xs font-medium uppercase tracking-wide text-ink-muted">
            Insert
          </span>
          {SCRIPT_PRESETS.map((preset) => (
            <Chip
              key={preset.id}
              label={preset.label}
              hint={preset.hint}
              onClick={() => insertAtCursor(preset)}
            />
          ))}
        </div>
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write or paste your script…"
        spellCheck
        className="h-[420px] resize-none overflow-y-auto rounded-xl border border-border bg-surface px-4 py-3 text-base leading-relaxed text-ink placeholder:text-ink-muted/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:h-[520px]"
        aria-label="Script editor"
      />

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
        <span>
          <span className="tabular-nums text-ink">{words}</span> words
        </span>
        <span aria-hidden="true">·</span>
        <span>
          ~<span className="tabular-nums text-ink">{readingLabel}</span> reading time
        </span>
      </div>
    </section>
  );
}
