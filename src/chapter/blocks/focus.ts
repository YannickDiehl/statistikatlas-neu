import { useEffect, useRef } from 'react';

/** Focuses an element after the next render (e.g. the first radio once a reset has re-rendered the form). */
export function useFocusLater() {
  const pending = useRef<(() => HTMLElement | null | undefined) | null>(null);
  useEffect(() => {
    const get = pending.current;
    if (!get) return;
    pending.current = null;
    get()?.focus();
  });
  return (get: () => HTMLElement | null | undefined) => { pending.current = get; };
}
