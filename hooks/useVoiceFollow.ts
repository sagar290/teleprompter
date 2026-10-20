"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: { transcript: string };
  }>;
}

function getSpeechRecognitionCtor():
  | (new () => SpeechRecognitionLike)
  | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/**
 * Optional voice-following via Web Speech API (Chrome).
 * Advances the scroll container when recognized words match upcoming script words.
 * Falls back gracefully when unsupported.
 */
export function useVoiceFollow(options: {
  enabled: boolean;
  script: string;
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const { enabled, script, containerRef } = options;
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const cursorRef = useRef(0);

  useEffect(() => {
    setSupported(Boolean(getSpeechRecognitionCtor()));
  }, []);

  useEffect(() => {
    cursorRef.current = 0;
  }, [script]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
  }, []);

  const start = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    stop();
    setError(null);

    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    const words = script
      .toLowerCase()
      .replace(/[^\w\s']/g, " ")
      .split(/\s+/)
      .filter(Boolean);

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += ` ${event.results[i][0].transcript}`;
      }
      const heard = transcript
        .toLowerCase()
        .replace(/[^\w\s']/g, " ")
        .split(/\s+/)
        .filter(Boolean);

      let cursor = cursorRef.current;
      for (const word of heard) {
        // Look a short window ahead so fillers don't permanently stall matching.
        const windowEnd = Math.min(words.length, cursor + 8);
        for (let i = cursor; i < windowEnd; i++) {
          if (words[i] === word) {
            cursor = i + 1;
            break;
          }
        }
      }
      cursorRef.current = cursor;

      const el = containerRef.current;
      if (el && words.length > 0) {
        const ratio = cursor / words.length;
        const max = Math.max(0, el.scrollHeight - el.clientHeight);
        el.scrollTop = ratio * max;
      }
    };

    recognition.onerror = (event) => {
      if (event.error !== "aborted" && event.error !== "no-speech") {
        setError(event.error);
      }
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setListening(true);
    } catch {
      setError("Could not start speech recognition.");
    }
  }, [containerRef, script, stop]);

  useEffect(() => {
    if (enabled && supported) {
      start();
    } else {
      stop();
    }
    return () => stop();
  }, [enabled, supported, start, stop]);

  return { supported, listening, error, start, stop };
}
