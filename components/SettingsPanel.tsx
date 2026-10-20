"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { ColorPicker } from "@/components/ColorPicker";
import { Slider } from "@/components/Slider";
import { Toggle } from "@/components/Toggle";
import { cn } from "@/lib/cn";
import {
  DEFAULT_SETTINGS,
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
  compact?: boolean;
}

function Section({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 py-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span className="text-sm font-medium text-ink">{title}</span>
        <span className="text-ink-muted" aria-hidden="true">
          {open ? "−" : "+"}
        </span>
      </button>
      {open ? <div className="grid gap-4 pb-4">{children}</div> : null}
    </div>
  );
}

export function SettingsPanel({
  settings,
  onChange,
  voiceSupported = false,
  compact = false,
}: SettingsPanelProps) {
  const [openScroll, setOpenScroll] = useState(true);
  const [openLook, setOpenLook] = useState(true);
  const [openGuide, setOpenGuide] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);

  const patch = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <section className={cn(!compact && "rounded-2xl border border-border bg-surface-elevated p-4 sm:p-5")}>
      {!compact ? (
        <h2 className="mb-3 text-sm font-medium uppercase tracking-[0.14em] text-ink-muted">
          Settings
        </h2>
      ) : null}

      <div className="grid gap-1">
        <Section
          title="Scroll & type"
          open={openScroll}
          onToggle={() => setOpenScroll((v) => !v)}
        >
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
        </Section>

        <Section
          title="Colors"
          open={openLook}
          onToggle={() => setOpenLook((v) => !v)}
        >
          <ColorPicker
            label="Text"
            value={settings.textColor}
            onChange={(v) => patch("textColor", v)}
          />
          <ColorPicker
            label="Background"
            value={settings.backgroundColor}
            onChange={(v) => patch("backgroundColor", v)}
          />
          <ColorPicker
            label="Guide"
            value={settings.guideColor ?? "#5eead4"}
            onChange={(v) => patch("guideColor", v)}
          />
        </Section>

        <Section
          title="Reading guide"
          open={openGuide}
          onToggle={() => setOpenGuide((v) => !v)}
        >
          <Toggle
            label="Show guide"
            checked={settings.showReadingGuide}
            onChange={(v) => patch("showReadingGuide", v)}
          />
          <Slider
            label="Position"
            value={settings.guidePosition ?? 33}
            min={8}
            max={85}
            step={1}
            unit="%"
            onChange={(v) => patch("guidePosition", v)}
          />
          <Slider
            label="Height"
            value={settings.guideHeight ?? 64}
            min={32}
            max={200}
            step={2}
            unit="px"
            onChange={(v) => patch("guideHeight", v)}
          />
        </Section>

        <Section
          title="Options"
          open={openOptions}
          onToggle={() => setOpenOptions((v) => !v)}
        >
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
        </Section>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onChange(DEFAULT_SETTINGS)}
        >
          Reset settings
        </Button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ink-muted">
        Prompter keys: Space · ↑↓ speed · +/- font · M mirror · F fullscreen · R
        reset · Esc exit
      </p>
    </section>
  );
}
