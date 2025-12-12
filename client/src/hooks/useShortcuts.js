import { useEffect } from "react";

export function useShortcuts(keys, callback) {
  useEffect(() => {
    function handler(e) {
      const hit =
        (keys.ctrl ? e.ctrlKey : true) &&
        (keys.alt ? e.altKey : true) &&
        (keys.shift ? e.shiftKey : true) &&
        e.key.toLowerCase() === keys.key.toLowerCase();

      if (hit) {
        e.preventDefault();
        callback();
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [keys, callback]);
}
