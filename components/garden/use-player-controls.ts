"use client";

import { useEffect, useRef } from "react";

export interface PlayerControlState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  sprint: boolean;
}

export interface PointerMoveTarget {
  sceneX: number;
  sceneY: number;
}

const MOVEMENT_KEYS = new Map<string, keyof PlayerControlState>([
  ["arrowup", "up"],
  ["arrowdown", "down"],
  ["arrowleft", "left"],
  ["arrowright", "right"],
  ["w", "up"],
  ["s", "down"],
  ["a", "left"],
  ["d", "right"],
]);

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target.isContentEditable
  );
}

/**
 * Keyboard state for the garden player avatar. Values live in a ref so the
 * Pixi ticker can read them every frame without re-rendering React.
 */
export function usePlayerKeyboard(enabled: boolean) {
  const controlsRef = useRef<PlayerControlState>({
    up: false,
    down: false,
    left: false,
    right: false,
    sprint: false,
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const setKey = (event: KeyboardEvent, pressed: boolean) => {
      if (event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) {
        return;
      }

      const key = event.key.toLowerCase();

      if (key === "shift") {
        controlsRef.current.sprint = pressed;
        return;
      }

      const control = MOVEMENT_KEYS.get(key);

      if (!control) {
        return;
      }

      controlsRef.current[control] = pressed;
      event.preventDefault();
    };

    const handleKeyDown = (event: KeyboardEvent) => setKey(event, true);
    const handleKeyUp = (event: KeyboardEvent) => setKey(event, false);
    const releaseAll = () => {
      controlsRef.current.up = false;
      controlsRef.current.down = false;
      controlsRef.current.left = false;
      controlsRef.current.right = false;
      controlsRef.current.sprint = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", releaseAll);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", releaseAll);
      releaseAll();
    };
  }, [enabled]);

  return controlsRef;
}
