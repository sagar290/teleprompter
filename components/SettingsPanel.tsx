"use client";

import { ColorPicker } from "@/components/ColorPicker";
import { Slider } from "@/components/Slider";
import { Toggle } from "@/components/Toggle";
import {
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  SPEED_MAX,
  SPEED_MIN,
} from "@/lib/defaults";
import type { Settings } from "@/types";

interface SettingsPanelProps {
  settings: Settings;
  onChange: (next: Settings) => void;
  voiceSupported?: boolean;
}

export function SettingsPanel({
  settings,
  onChange,
  voiceSupported = false,
}: SettingsPanelProps) {
  const patch = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-border bg-surface-elevated p-4 sm:p-5">
      <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-ink-muted">
        Settings
      </h2>

      <div className="grid gap-5">
        <Slider
          label="Speed"
          value={settings.speed}
          min={SPEED_MIN}
          max={SPEED_MAX}
          step={1}
          unit=" px/s"
          onChange={(v) => patch("speed", v)}
        />
        <Slider
          label="Font size"
          value={settings.fontSize}
          min={FONT_SIZE_MIN}
          max={FONT_SIZE_MAX}
          step={1}
          unit="px"
          onChange={(v) => patch("fontSize", v)}
        />
        <Slider
          label="Line height"
          value={settings.lineHeight}
          min={1.1}
          max={2.4}
          step={0.05}
          onChange={(v) => patch("lineHeight", Number(v.toFixed(2)))}
        />
        <Slider
          label="Side margin"
          value={settings.textWidth}
          min={0}
          max={30}
          step={1}
          unit="%"
          onChange={(v) => patch("textWidth", v)}
        />
        <Slider
          label="Guide position"
          value={settings.guidePosition ?? 33}
          min={8}
          max={85}
          step={1}
          unit="%"
          onChange={(v) => patch("guidePosition", v)}
        />
        <Slider
          label="Guide height"
          value={settings.guideHeight ?? 64}
          min={32}
          max={200}
          step={2}
          unit="px"
          onChange={(v) => patch("guideHeight", v)}
        />

        <div className="grid gap-3 border-t border-border pt-4">
          <ColorPicker
            label="Text color"
            value={settings.textColor}
            onChange={(v) => patch("textColor", v)}
          />
          <ColorPicker
            label="Background"
            value={settings.backgroundColor}
            onChange={(v) => patch("backgroundColor", v)}
          />
          <ColorPicker
            label="Guide color"
            value={settings.guideColor ?? "#5eead4"}
            onChange={(v) => patch("guideColor", v)}
          />
        </div>

        <div className="grid gap-4 border-t border-border pt-4">
          <Toggle
            label="Mirror horizontal"
            description="Flip for beam-splitter glass"
            checked={settings.mirrorHorizontal}
            onChange={(v) => patch("mirrorHorizontal", v)}
          />
          <Toggle
            label="Mirror vertical"
            checked={settings.mirrorVertical}
            onChange={(v) => patch("mirrorVertical", v)}
          />
          <Toggle
            label="Reading guide"
            checked={settings.showReadingGuide}
            onChange={(v) => patch("showReadingGuide", v)}
          />
          <Toggle
            label="Countdown"
            description="3-2-1 before scrolling"
            checked={settings.countdownEnabled}
            onChange={(v) => patch("countdownEnabled", v)}
          />
          <Toggle
            label="Voice follow"
            description={
              voiceSupported
                ? "Scroll as you speak (Chrome)"
                : "Not supported in this browser"
            }
            checked={settings.voiceFollowEnabled}
            onChange={(v) => patch("voiceFollowEnabled", v)}
          />
        </div>
      </div>
    </section>
  );
}
