"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { NewsPresets } from "@/components/NewsPresets";
import { ScriptEditor } from "@/components/ScriptEditor";
import { ScriptLibrary } from "@/components/ScriptLibrary";
import { SettingsPanel } from "@/components/SettingsPanel";
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
  }, [setScript]);

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

  const handleNew = useCallback(() => {
    setActiveScriptId(null);
    setScript("");
  }, [setActiveScriptId, setScript]);

  const handleLoadPreset = useCallback(
    (preset: NewsPreset) => {
      setActiveScriptId(null);
      setScript(preset.content);
    },
    [setActiveScriptId, setScript]
  );

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Local-first
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Teleprompter
          </h1>
          <p className="mt-2 max-w-xl text-sm text-ink-muted sm:text-base">
            Write your script, tune the settings, then go full-screen. Everything
            stays in this browser.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/remote"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-surface-elevated px-3.5 py-2 text-sm text-ink transition-colors hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Remote
          </Link>
          <Link
            href={canStart ? "/prompter" : "#"}
            aria-disabled={!canStart}
            className={`inline-flex items-center justify-center rounded-lg px-5 py-3 text-base font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              canStart
                ? "bg-accent text-black hover:brightness-110"
                : "pointer-events-none bg-surface-muted text-ink-muted"
            }`}
          >
            Start
          </Link>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
        <ScriptEditor
          value={script}
          onChange={setScript}
          onClear={handleClear}
        />

        <div className="flex flex-col gap-5">
          <NewsPresets onLoad={handleLoadPreset} />
          <SettingsPanel
            settings={settings}
            onChange={(next) => setSettings(mergeSettings(next))}
            voiceSupported={voiceSupported}
          />
          <ScriptLibrary
            scripts={scripts}
            activeId={activeScriptId}
            onSelect={handleSelect}
            onSaveCurrent={handleSaveCurrent}
            onDelete={handleDelete}
            onNew={handleNew}
          />
          <div className="rounded-2xl border border-border bg-surface-elevated p-4 text-sm text-ink-muted">
            <p className="font-medium text-ink">Keyboard (prompter)</p>
            <p className="mt-2 leading-relaxed">
              Space play/pause · ↑↓ speed · +/- font · M mirror · F fullscreen · R
              reset · Esc exit
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => setSettings(DEFAULT_SETTINGS)}
            className="self-start"
          >
            Reset settings
          </Button>
        </div>
      </div>
    </main>
  );
}
