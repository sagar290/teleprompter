"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { ControlsBar } from "@/components/ControlsBar";
import { PrompterView } from "@/components/PrompterView";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { useFullscreen } from "@/hooks/useFullscreen";
import { useIdle } from "@/hooks/useIdle";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useRemoteControl } from "@/hooks/useRemoteControl";
import { useVoiceFollow } from "@/hooks/useVoiceFollow";
import {
  DEFAULT_SCRIPT,
  DEFAULT_SETTINGS,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  FONT_SIZE_STEP,
  mergeSettings,
  SPEED_MAX,
  SPEED_MIN,
  SPEED_STEP,
  STORAGE_KEYS,
} from "@/lib/defaults";
import { parseScript } from "@/lib/script";
import type { ScrollControlMessage, Settings } from "@/types";

export default function PrompterPage() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [script] = useLocalStorage(STORAGE_KEYS.script, DEFAULT_SCRIPT);
  const [settingsRaw, setSettings] = useLocalStorage<Settings>(
    STORAGE_KEYS.settings,
    DEFAULT_SETTINGS
  );
  const settings = useMemo(() => mergeSettings(settingsRaw), [settingsRaw]);

  const [playing, setPlaying] = useState(false);
  const [countdownActive, setCountdownActive] = useState(false);

  const idle = useIdle(3000);
  const {
    isFullscreen,
    exit: exitFullscreen,
    toggle: toggleFullscreen,
  } = useFullscreen(rootRef);

  const parsed = useMemo(() => parseScript(script), [script]);

  const handleComplete = useCallback(() => {
    setPlaying(false);
  }, []);

  const { progress, remainingPixels, reset } = useAutoScroll({
    containerRef: scrollRef,
    speed: settings.speed,
    playing: playing && !settings.voiceFollowEnabled,
    pauses: parsed.pauses,
    guideRatio: settings.guidePosition / 100,
    onComplete: handleComplete,
  });

  const voice = useVoiceFollow({
    enabled: settings.voiceFollowEnabled && playing,
    script: parsed.displayText,
    containerRef: scrollRef,
  });

  const patchSettings = useCallback(
    (partial: Partial<Settings>) => {
      setSettings((prev) => mergeSettings({ ...prev, ...partial }));
    },
    [setSettings]
  );

  const beginPlayback = useCallback(() => {
    if (settings.countdownEnabled) {
      setCountdownActive(true);
    } else {
      setPlaying(true);
    }
  }, [settings.countdownEnabled]);

  const handlePlayPause = useCallback(() => {
    if (playing || countdownActive) {
      setPlaying(false);
      setCountdownActive(false);
      return;
    }
    beginPlayback();
  }, [beginPlayback, countdownActive, playing]);

  const handleCountdownComplete = useCallback(() => {
    setCountdownActive(false);
    setPlaying(true);
  }, []);

  const handleReset = useCallback(() => {
    setPlaying(false);
    setCountdownActive(false);
    reset();
  }, [reset]);

  const handleExit = useCallback(() => {
    setPlaying(false);
    setCountdownActive(false);
    router.push("/");
  }, [router]);

  const nudgeSpeed = useCallback(
    (delta: number) => {
      patchSettings({
        speed: Math.min(SPEED_MAX, Math.max(SPEED_MIN, settings.speed + delta)),
      });
    },
    [patchSettings, settings.speed]
  );

  const nudgeFont = useCallback(
    (delta: number) => {
      patchSettings({
        fontSize: Math.min(
          FONT_SIZE_MAX,
          Math.max(FONT_SIZE_MIN, settings.fontSize + delta)
        ),
      });
    },
    [patchSettings, settings.fontSize]
  );

  const toggleMirror = useCallback(() => {
    patchSettings({ mirrorHorizontal: !settings.mirrorHorizontal });
  }, [patchSettings, settings.mirrorHorizontal]);

  useKeyboardShortcuts({
    onTogglePlay: handlePlayPause,
    onSpeedUp: () => nudgeSpeed(SPEED_STEP),
    onSpeedDown: () => nudgeSpeed(-SPEED_STEP),
    onFontUp: () => nudgeFont(FONT_SIZE_STEP),
    onFontDown: () => nudgeFont(-FONT_SIZE_STEP),
    onToggleMirror: toggleMirror,
    onToggleFullscreen: () => {
      void toggleFullscreen();
    },
    onReset: handleReset,
    onExit: handleExit,
  });

  const onRemoteMessage = useCallback(
    (message: ScrollControlMessage) => {
      switch (message.type) {
        case "play":
          if (!playing && !countdownActive) beginPlayback();
          break;
        case "pause":
          setPlaying(false);
          setCountdownActive(false);
          break;
        case "toggle":
          handlePlayPause();
          break;
        case "reset":
          handleReset();
          break;
        case "set-speed":
          patchSettings({
            speed: Math.min(SPEED_MAX, Math.max(SPEED_MIN, message.speed)),
          });
          break;
        case "nudge-speed":
          nudgeSpeed(message.delta);
          break;
        case "set-font-size":
          patchSettings({
            fontSize: Math.min(
              FONT_SIZE_MAX,
              Math.max(FONT_SIZE_MIN, message.fontSize)
            ),
          });
          break;
        case "nudge-font-size":
          nudgeFont(message.delta);
          break;
        case "toggle-mirror":
          toggleMirror();
          break;
        case "exit":
          handleExit();
          break;
        default:
          break;
      }
    },
    [
      beginPlayback,
      countdownActive,
      handleExit,
      handlePlayPause,
      handleReset,
      nudgeFont,
      nudgeSpeed,
      patchSettings,
      playing,
      toggleMirror,
    ]
  );

  useRemoteControl({ onMessage: onRemoteMessage });

  const showControls = !idle || !playing;

  return (
    <div
      ref={rootRef}
      className="relative h-dvh w-full overflow-hidden bg-black"
    >
      <PrompterView
        ref={scrollRef}
        segments={parsed.segments}
        settings={settings}
        countdownActive={countdownActive}
        onCountdownComplete={handleCountdownComplete}
        onGuidePositionChange={(guidePosition) =>
          patchSettings({ guidePosition })
        }
        onGuideHeightChange={(guideHeight) => patchSettings({ guideHeight })}
      />

      {isFullscreen ? (
        <button
          type="button"
          onClick={() => {
            void exitFullscreen();
          }}
          aria-label="Exit fullscreen"
          className="absolute right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white shadow-float backdrop-blur-md transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      ) : null}

      <ControlsBar
        visible={showControls}
        playing={playing || countdownActive}
        speed={settings.speed}
        fontSize={settings.fontSize}
        guidePosition={settings.guidePosition}
        guideHeight={settings.guideHeight}
        showReadingGuide={settings.showReadingGuide}
        mirrored={settings.mirrorHorizontal}
        isFullscreen={isFullscreen}
        progress={progress}
        remainingPixels={remainingPixels}
        voiceListening={voice.listening}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
        onSpeedChange={(speed) => patchSettings({ speed })}
        onFontSizeChange={(fontSize) => patchSettings({ fontSize })}
        onGuidePositionChange={(guidePosition) =>
          patchSettings({ guidePosition })
        }
        onGuideHeightChange={(guideHeight) => patchSettings({ guideHeight })}
        onToggleMirror={toggleMirror}
        onToggleFullscreen={() => {
          void toggleFullscreen();
        }}
        onExit={handleExit}
      />

      {settings.voiceFollowEnabled && voice.error ? (
        <p className="absolute left-4 top-4 z-40 rounded-lg bg-danger/20 px-3 py-2 text-sm text-danger">
          {voice.error}
        </p>
      ) : null}
    </div>
  );
}
