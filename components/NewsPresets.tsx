"use client";

import { NEWS_PRESETS } from "@/lib/presets";
import type { NewsPreset } from "@/lib/presets";

interface NewsPresetsProps {
  onLoad: (preset: NewsPreset) => void;
}

export function NewsPresets({ onLoad }: NewsPresetsProps) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-elevated p-4 sm:p-5">
      <div>
        <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-ink-muted">
          বাংলা নিউজ প্রিসেট
        </h2>
        <p className="mt-1 text-xs text-ink-muted">
          নমুনা স্ক্রিপ্ট এডিটরে লোড করুন
        </p>
      </div>

      <ul className="grid gap-2">
        {NEWS_PRESETS.map((preset) => (
          <li key={preset.id}>
            <button
              type="button"
              onClick={() => onLoad(preset)}
              className="flex w-full items-center justify-between gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left transition-colors hover:border-border hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label={`Load preset: ${preset.title}`}
            >
              <span className="min-w-0">
                <span className="block truncate text-sm text-ink">
                  {preset.title}
                </span>
                <span className="block text-xs text-ink-muted">
                  {preset.category}
                </span>
              </span>
              <span className="shrink-0 text-xs font-medium text-accent">
                লোড
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
