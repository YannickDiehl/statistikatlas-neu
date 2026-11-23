import { useEffect, useRef, useState } from 'react';

/** Text for an aria-live region: cleared first, then set, so the same text is announced again. */
export function useAnnounce<T>(initial: T, empty: T) {
  const [value, setValue] = useState<T>(initial);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const announce = (next: T) => {
    clearTimeout(timer.current);
    setValue(empty);
    timer.current = setTimeout(() => setValue(next), 30);
  };
  return [value, announce] as const;
}
