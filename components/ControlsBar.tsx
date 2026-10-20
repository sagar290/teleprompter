"use client";

import { Button } from "@/components/Button";
import { ProgressBar } from "@/components/ProgressBar";
import { Slider } from "@/components/Slider";
import { cn } from "@/lib/cn";
import {
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  SPEED_MAX,
  SPEED_MIN,
} from "@/lib/defaults";

interface ControlsBarProps {
  visible: boolean;
  playing: boolean;
  speed: number;
  fontSize: number;
  guidePosition: number;
  guideHeight: number;
  showReadingGuide: boolean;
  mirrored: boolean;
  isFullscreen: boolean;
  progress: number;
  remainingPixels: number;
  voiceListening?: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onFontSizeChange: (size: number) => void;
  onGuidePositionChange: (position: number) => void;
  onGuideHeightChange: (height: number) => void;
  onToggleMirror: () => void;
  onToggleFullscreen: () => void;
  onExit: () => void;
}

export function ControlsBar({
  visible,
  playing,
  speed,
  fontSize,
  guidePosition,
  guideHeight,
  showReadingGuide,
  mirrored,
  isFullscreen,
  progress,
  remainingPixels,
  voiceListening,
  onPlayPause,
  onReset,
  onSpeedChange,
  onFontSizeChange,
  onGuidePositionChange,
  onGuideHeightChange,
  onToggleMirror,
  onToggleFullscreen,
  onExit,
}: ControlsBarProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-5 sm:pb-5",
        "transition-all duration-300 ease-soft",
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0"
      )}
    >
      <div
        className={cn(
          "pointer-events-auto mx-auto max-w-3xl rounded-2xl border border-white/10",
          "bg-black/70 p-3 shadow-float backdrop-blur-md sm:p-4",
          !visible && "pointer-events-none"
        )}
      >
        <ProgressBar
          progress={progress}
          remainingPixels={remainingPixels}
          speed={speed}
        />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button
            variant="primary"
            size="icon"
            onClick={onPlayPause}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <PauseIcon />
            ) : (
              <PlayIcon />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={onReset} aria-label="Reset">
            <ResetIcon />
          </Button>
          <Button
            variant={mirrored ? "primary" : "ghost"}
            size="icon"
            onClick={onToggleMirror}
            aria-label="Toggle mirror"
          >
            <MirrorIcon />
          </Button>
          <Button
            variant={isFullscreen ? "primary" : "ghost"}
            size="icon"
            onClick={onToggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <CloseIcon /> : <FullscreenIcon />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onExit} aria-label="Exit prompter">
            <ExitIcon />
          </Button>

          {voiceListening ? (
            <span className="ml-1 rounded-full bg-accent/20 px-2.5 py-1 text-xs text-accent">
              Listening…
            </span>
          ) : null}
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Slider
            label="Speed"
            value={speed}
            min={SPEED_MIN}
            max={SPEED_MAX}
            unit=" px/s"
            onChange={onSpeedChange}
          />
          <Slider
            label="Font size"
            value={fontSize}
            min={FONT_SIZE_MIN}
            max={FONT_SIZE_MAX}
            unit="px"
            onChange={onFontSizeChange}
          />
          {showReadingGuide ? (
            <>
              <Slider
                label="Guide position"
                value={guidePosition}
                min={8}
                max={85}
                unit="%"
                onChange={onGuidePositionChange}
              />
              <Slider
                label="Guide height"
                value={guideHeight}
                min={32}
                max={200}
                step={2}
                unit="px"
                onChange={onGuideHeightChange}
              />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}

function MirrorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 3v18" />
      <path d="M8 8H4l6 4-6 4h4" />
      <path d="M16 8h4l-6 4 6 4h-4" />
    </svg>
  );
}

function FullscreenIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function ExitIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}
