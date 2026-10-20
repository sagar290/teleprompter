"use client";

import Link from "next/link";
import { Button } from "@/components/Button";
import { useRemotePublisher } from "@/hooks/useRemoteControl";
import { FONT_SIZE_STEP, SPEED_STEP } from "@/lib/defaults";

/**
 * Phone-friendly remote for same-origin tabs via BroadcastChannel.
 *
 * Cross-device options (not implemented here):
 * - WebSocket relay server that both phone and desktop join with a room code
 * - WebRTC data channel with a lightweight signaling server
 */
export default function RemotePage() {
  const { publish } = useRemotePublisher();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-6 px-4 py-8">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          Remote control
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-ink">Phone remote</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Keep the prompter open in another tab on this same browser/origin.
          Commands travel over BroadcastChannel — no server required.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="primary"
          size="lg"
          className="col-span-2 h-16 text-lg"
          onClick={() => publish({ type: "toggle" })}
        >
          Play / Pause
        </Button>
        <Button size="lg" className="h-14" onClick={() => publish({ type: "reset" })}>
          Reset
        </Button>
        <Button
          size="lg"
          className="h-14"
          onClick={() => publish({ type: "toggle-mirror" })}
        >
          Mirror
        </Button>
        <Button
          size="lg"
          className="h-14"
          onClick={() => publish({ type: "nudge-speed", delta: SPEED_STEP })}
        >
          Speed +
        </Button>
        <Button
          size="lg"
          className="h-14"
          onClick={() => publish({ type: "nudge-speed", delta: -SPEED_STEP })}
        >
          Speed −
        </Button>
        <Button
          size="lg"
          className="h-14"
          onClick={() =>
            publish({ type: "nudge-font-size", delta: FONT_SIZE_STEP })
          }
        >
          Font +
        </Button>
        <Button
          size="lg"
          className="h-14"
          onClick={() =>
            publish({ type: "nudge-font-size", delta: -FONT_SIZE_STEP })
          }
        >
          Font −
        </Button>
        <Button
          variant="danger"
          size="lg"
          className="col-span-2 h-14"
          onClick={() => publish({ type: "exit" })}
        >
          Exit prompter
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-surface-elevated p-4 text-sm text-ink-muted">
        <p className="font-medium text-ink">Same-device only</p>
        <p className="mt-2 leading-relaxed">
          BroadcastChannel reaches other tabs in this browser. For a real phone
          controlling a laptop, use a WebSocket or WebRTC room instead.
        </p>
      </div>

      <Link
        href="/"
        className="text-center text-sm text-accent underline-offset-4 hover:underline"
      >
        Back to editor
      </Link>
    </main>
  );
}
