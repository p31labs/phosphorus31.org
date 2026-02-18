import { useEffect } from "react";

interface KeyboardShortcuts {
  onScore?: () => void;
  onReset?: () => void;
}

export function useKeyboard({ onScore, onReset }: KeyboardShortcuts): void {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        onScore?.();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        onReset?.();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onScore, onReset]);
}
