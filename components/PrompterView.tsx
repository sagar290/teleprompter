"use client";

import { forwardRef } from "react";
import { CountdownOverlay } from "@/components/CountdownOverlay";
import { ReadingGuide } from "@/components/ReadingGuide";
import { ScriptContent } from "@/components/ScriptContent";
import type { ScriptSegment, Settings } from "@/types";

interface PrompterViewProps {
  segments: ScriptSegment[];
  settings: Settings;
  countdownActive: boolean;
  onCountdownComplete: () => void;
  onGuidePositionChange?: (position: number) => void;
  onGuideHeightChange?: (height: number) => void;
}

/**
 * Scrolling text surface. Mirroring is applied via CSS scale transforms so
 * beam-splitter glass users can read correctly without flipping the DOM layout.
 */
export const PrompterView = forwardRef<HTMLDivElement, PrompterViewProps>(
  function PrompterView(
    {
      segments,
      settings,
      countdownActive,
      onCountdownComplete,
      onGuidePositionChange,
      onGuideHeightChange,
    },
    ref
  ) {
    const scaleX = settings.mirrorHorizontal ? -1 : 1;
    const scaleY = settings.mirrorVertical ? -1 : 1;
    const guidePosition = settings.guidePosition ?? 33;
    const guideHeight = settings.guideHeight ?? 64;

    return (
      <div
        data-prompter-root
        className="relative h-full w-full overflow-hidden"
        style={{ backgroundColor: settings.backgroundColor }}
      >
        <ReadingGuide
          visible={settings.showReadingGuide}
          color={settings.guideColor ?? "#5eead4"}
          position={guidePosition}
          height={guideHeight}
          onPositionChange={onGuidePositionChange}
          onHeightChange={onGuideHeightChange}
        />

        <div
          ref={ref}
          className="scrollbar-none h-full w-full overflow-y-auto overscroll-contain"
          style={{
            // Top padding tracks the guide so the first line can reach it.
            // Bottom padding >= 100vh so the last line can scroll fully off-screen.
            paddingTop: `${Math.max(guidePosition, 20)}vh`,
            paddingBottom: "110vh",
            paddingLeft: `${settings.textWidth}%`,
            paddingRight: `${settings.textWidth}%`,
            color: settings.textColor,
            fontSize: `${settings.fontSize}px`,
            lineHeight: settings.lineHeight,
            transform: `scale(${scaleX}, ${scaleY})`,
            transformOrigin: "center center",
          }}
          tabIndex={0}
          aria-label="Prompter script"
        >
          <ScriptContent segments={segments} textColor={settings.textColor} />
        </div>

        <CountdownOverlay
          active={countdownActive}
          onComplete={onCountdownComplete}
        />
      </div>
    );
  }
);
