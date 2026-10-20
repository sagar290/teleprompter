"use client";

import { Button } from "@/components/Button";
import type { ScriptDocument } from "@/types";

interface ScriptLibraryProps {
  scripts: ScriptDocument[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onSaveCurrent: () => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

export function ScriptLibrary({
  scripts,
  activeId,
  onSelect,
  onSaveCurrent,
  onDelete,
  onNew,
}: ScriptLibraryProps) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-elevated p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-ink-muted">
          Saved scripts
        </h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onNew} aria-label="New script">
            New
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onSaveCurrent}
            aria-label="Save current script"
          >
            Save
          </Button>
        </div>
      </div>

      {scripts.length === 0 ? (
        <p className="text-sm text-ink-muted">
          No saved scripts yet. Write something and hit Save.
        </p>
      ) : (
        <ul className="flex max-h-56 flex-col gap-1 overflow-y-auto">
          {scripts
            .slice()
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .map((script) => {
              const active = script.id === activeId;
              return (
                <li key={script.id}>
                  <div
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${
                      active
                        ? "border-accent/40 bg-accent/10"
                        : "border-transparent hover:bg-white/5"
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
