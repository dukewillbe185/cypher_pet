"use client";

import { useCallback, useEffect, useRef } from "react";

export type BufferedStreamController = {
  append: (token: string) => void;
  flushNow: () => void;
  reset: () => void;
};

export function useBufferedStream(onChunk: (chunk: string) => void): BufferedStreamController {
  const frameRef = useRef<number | null>(null);
  const bufferRef = useRef("");
  const onChunkRef = useRef(onChunk);

  useEffect(() => {
    onChunkRef.current = onChunk;
  }, [onChunk]);

  const flushNow = useCallback(() => {
    if (!bufferRef.current) {
      return;
    }

    const nextChunk = bufferRef.current;
    bufferRef.current = "";
    onChunkRef.current(nextChunk);
  }, []);

  const reset = useCallback(() => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    bufferRef.current = "";
  }, []);

  const append = useCallback(
    (token: string) => {
      bufferRef.current += token;

      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        flushNow();
      });
    },
    [flushNow],
  );

  useEffect(() => reset, [reset]);

  return {
    append,
    flushNow,
    reset,
  };
}
