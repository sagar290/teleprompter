"use client";

import { NEWS_PRESETS } from "@/lib/presets";
import type { NewsPreset } from "@/lib/presets";

interface NewsPresetsProps {
  onLoad: (preset: NewsPreset) => void;
  compact?: boolean;
}

export function NewsPresets({ onLoad, compact = false }: NewsPresetsProps) {
  return (
    <section className={compact ? "" : "rounded-2xl border border-border bg-surface-elevated p-4 sm:p-5"}>
      {!compact ? (
        <div className="mb-3">
          <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-ink-muted">
            বাংলা নিউজ প্রিসেট
          </h2>
          <p className="mt-1 text-xs text-ink-muted">
            নমুনা স্ক্রিপ্ট এডিটরে লোড করুন
          </p>
        </div>
      ) : (
        <p className="mb-3 text-xs text-ink-muted">
          Tap a preset to load it into the editor
        </p>
      )}

      <ul className="grid gap-1.5">
        {NEWS_PRESETS.map((preset) => (
          <li key={preset.id}>
            <button
              type="button"
              onClick={() => onLoad(preset)}
              className="group flex w-full items-center gap-3 rounded-xl border border-border/70 bg-surface px-3 py-2.5 text-left transition-colors hover:border-accent/40 hover:bg-accent/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label={`Load preset: ${preset.title}`}
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm text-ink">
                  {preset.title}
                </span>
                <span className="block text-xs text-ink-muted">
                  {preset.category}
                </span>
              </span>
              <span className="shrink-0 rounded-lg bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent group-hover:bg-accent group-hover:text-black">
                Load
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
