"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NewsPresets } from "@/components/NewsPresets";
import { ScriptEditor } from "@/components/ScriptEditor";
import { ScriptLibrary } from "@/components/ScriptLibrary";
import { SettingsPanel } from "@/components/SettingsPanel";
import { SidePanel } from "@/components/SidePanel";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  DEFAULT_SCRIPT,
  DEFAULT_SETTINGS,
  mergeSettings,
  STORAGE_KEYS,
} from "@/lib/defaults";
import type { NewsPreset } from "@/lib/presets";
import { createScriptId } from "@/lib/script";
import type { ScriptDocument, Settings } from "@/types";

export default function EditorPage() {
  const [script, setScript] = useLocalStorage(STORAGE_KEYS.script, DEFAULT_SCRIPT);
  const [settingsRaw, setSettings] = useLocalStorage<Settings>(
    STORAGE_KEYS.settings,
    DEFAULT_SETTINGS
  );
  const settings = useMemo(() => mergeSettings(settingsRaw), [settingsRaw]);
  const [scripts, setScripts] = useLocalStorage<ScriptDocument[]>(
    STORAGE_KEYS.scripts,
    []
  );
  const [activeScriptId, setActiveScriptId] = useLocalStorage<string | null>(
    STORAGE_KEYS.activeScriptId,
    null
  );
  const [voiceSupported, setVoiceSupported] = useState(false);

  useEffect(() => {
    const w = window as Window & {
      SpeechRecognition?: unknown;
      webkitSpeechRecognition?: unknown;
    };
    setVoiceSupported(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition));
  }, []);

  const canStart = useMemo(() => script.trim().length > 0, [script]);

  const handleClear = useCallback(() => {
    setScript("");
    setActiveScriptId(null);
  }, [setActiveScriptId, setScript]);

  const handleSaveCurrent = useCallback(() => {
    const title =
      script.trim().split("\n").find((line) => line.trim())?.slice(0, 48) ||
      "Untitled";
    const now = Date.now();

    if (activeScriptId) {
      setScripts((prev) =>
        prev.map((item) =>
          item.id === activeScriptId
            ? { ...item, title, content: script, updatedAt: now }
            : item
        )
      );
      return;
    }

    const id = createScriptId();
    setScripts((prev) => [
      ...prev,
      { id, title, content: script, updatedAt: now },
    ]);
    setActiveScriptId(id);
  }, [activeScriptId, script, setActiveScriptId, setScripts]);

  const handleSelect = useCallback(
    (id: string) => {
      const found = scripts.find((item) => item.id === id);
      if (!found) return;
      setActiveScriptId(id);
      setScript(found.content);
    },
    [scripts, setActiveScriptId, setScript]
  );

  const handleDelete = useCallback(
    (id: string) => {
      setScripts((prev) => prev.filter((item) => item.id !== id));
      if (activeScriptId === id) {
        setActiveScriptId(null);
      }
    },
    [activeScriptId, setActiveScriptId, setScripts]
  );

  const handleLoadPreset = useCallback(
    (preset: NewsPreset) => {
      setActiveScriptId(null);
      setScript(preset.content);
    },
    [setActiveScriptId, setScript]
  );

  return (
    <main className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-surface/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
              Local-first
            </p>
            <h1 className="truncate text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              Teleprompter
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/remote"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-surface-elevated px-3.5 text-sm text-ink transition-colors hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Remote
            </Link>
            <Link
              href={canStart ? "/prompter" : "#"}
              aria-disabled={!canStart}
              className={`inline-flex h-10 items-center justify-center rounded-xl px-5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                canStart
                  ? "bg-accent text-black hover:brightness-110"
                  : "pointer-events-none bg-surface-muted text-ink-muted"
              }`}
            >
              Start
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1600px] flex-1 gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)] lg:gap-5 lg:px-8 lg:py-6">
        <ScriptEditor
          value={script}
          onChange={setScript}
          onClear={handleClear}
          onSave={handleSaveCurrent}
          isUpdating={Boolean(activeScriptId)}
        />

        <div className="lg:sticky lg:top-[4.5rem] lg:self-start lg:h-[calc(100dvh-5.5rem)]">
          <SidePanel
            presets={
              <NewsPresets onLoad={handleLoadPreset} compact />
            }
            settings={
              <SettingsPanel
                settings={settings}
                onChange={(next) => setSettings(mergeSettings(next))}
                voiceSupported={voiceSupported}
                compact
              />
            }
            saved={
              <ScriptLibrary
                scripts={scripts}
                activeId={activeScriptId}
                onSelect={handleSelect}
                onDelete={handleDelete}
                compact
              />
            }
          />
        </div>
      </div>

      {/* Mobile sticky start */}
      <div className="sticky bottom-0 z-30 border-t border-border/80 bg-surface/90 p-3 backdrop-blur-md lg:hidden">
        <Link
          href={canStart ? "/prompter" : "#"}
          aria-disabled={!canStart}
          className={`flex h-12 w-full items-center justify-center rounded-xl text-base font-semibold transition-colors ${
            canStart
              ? "bg-accent text-black"
              : "pointer-events-none bg-surface-muted text-ink-muted"
          }`}
        >
          Start prompter
        </Link>
      </div>
    </main>
  );
}
