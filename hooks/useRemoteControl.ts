"use client";

import { useCallback, useEffect, useRef } from "react";
import { BROADCAST_CHANNEL } from "@/lib/defaults";
import type { ScrollControlMessage } from "@/types";

/**
 * Same-origin tab remote control via BroadcastChannel.
 * Open /remote on a phone (same browser profile / origin) to send commands
 * to the /prompter tab. For true cross-device control you'd need a WebSocket
 * or WebRTC signaling server — BroadcastChannel only reaches same-origin tabs
 * in the same browser.
 */
export function useRemoteControl(handlers: {
  onMessage: (message: ScrollControlMessage) => void;
  enabled?: boolean;
}) {
  const { onMessage, enabled = true } = handlers;
  const handlerRef = useRef(onMessage);
  handlerRef.current = onMessage;

  useEffect(() => {
    if (!enabled || typeof window === "undefined" || !("BroadcastChannel" in window)) {
      return;
    }

    const channel = new BroadcastChannel(BROADCAST_CHANNEL);
    channel.onmessage = (event: MessageEvent<ScrollControlMessage>) => {
      if (event.data?.type) {
        handlerRef.current(event.data);
      }
    };

    return () => channel.close();
  }, [enabled]);
}

export function useRemotePublisher() {
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;
    channelRef.current = new BroadcastChannel(BROADCAST_CHANNEL);
    return () => {
      channelRef.current?.close();
      channelRef.current = null;
    };
  }, []);

  const publish = useCallback((message: ScrollControlMessage) => {
    channelRef.current?.postMessage(message);
  }, []);

  return { publish, supported: typeof window !== "undefined" && "BroadcastChannel" in window };
}
