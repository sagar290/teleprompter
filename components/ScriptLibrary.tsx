"use client";

import { Button } from "@/components/Button";
import type { ScriptDocument } from "@/types";

interface ScriptLibraryProps {
  scripts: ScriptDocument[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
}

export function ScriptLibrary({
  scripts,
  activeId,
  onSelect,
  onDelete,
  compact = false,
}: ScriptLibraryProps) {
  return (
    <section className={compact ? "" : "rounded-2xl border border-border bg-surface-elevated p-4 sm:p-5"}>
      <div className="mb-3">
        {!compact ? (
          <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-ink-muted">
            Saved scripts
          </h2>
        ) : (
          <p className="text-xs text-ink-muted">Your scripts in this browser</p>
        )}
      </div>

      {scripts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-sm text-ink-muted">
          No saved scripts yet. Write something and hit Save.
        </p>
      ) : (
        <ul className="flex max-h-[50vh] flex-col gap-1.5 overflow-y-auto">
          {scripts
            .slice()
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .map((script) => {
              const active = script.id === activeId;
              return (
                <li key={script.id}>
                  <div
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 ${
                      active
                        ? "border-accent/40 bg-accent/10"
                        : "border-border/70 bg-surface hover:bg-white/5"
                    }`}
                  >
                    <button
                      type="button"
                      className="min-w-0 flex-1 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      onClick={() => onSelect(script.id)}
                      aria-current={active ? "true" : undefined}
                    >
                      <span className="block truncate text-sm text-ink">
                        {script.title || "Untitled"}
                      </span>
                      <span className="block text-xs text-ink-muted">
                        {new Date(script.updatedAt).toLocaleString()}
                      </span>
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(script.id)}
                      aria-label={`Delete ${script.title || "script"}`}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              );
            })}
        </ul>
      )}
    </section>
  );
}
