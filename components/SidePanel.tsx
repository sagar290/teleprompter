"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export type SideTab = "presets" | "settings" | "saved";

interface SidePanelProps {
  presets: React.ReactNode;
  settings: React.ReactNode;
  saved: React.ReactNode;
}

const TABS: Array<{ id: SideTab; label: string }> = [
  { id: "presets", label: "Presets" },
  { id: "settings", label: "Settings" },
  { id: "saved", label: "Saved" },
];

export function SidePanel({ presets, settings, saved }: SidePanelProps) {
  const [tab, setTab] = useState<SideTab>("presets");

  return (
    <aside className="flex h-full min-h-[28rem] flex-col overflow-hidden rounded-2xl border border-border bg-surface-elevated lg:min-h-0">
      <div
        role="tablist"
        aria-label="Editor side panel"
        className="flex border-b border-border p-1.5"
      >
        {TABS.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(item.id)}
              className={cn(
                "flex-1 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                active
                  ? "bg-accent/15 text-accent"
                  : "text-ink-muted hover:bg-white/5 hover:text-ink"
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5"
      >
        {tab === "presets" ? presets : null}
        {tab === "settings" ? settings : null}
        {tab === "saved" ? saved : null}
      </div>
    </aside>
  );
}
