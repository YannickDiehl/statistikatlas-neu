// Ersatz für src/chapter/s04/Workshop.tsx: statt der Werkstatt ein Code-Block des Prototyps (app.js füllt ihn über K4Vorlage.vorlage).
import { useEffect, useRef } from 'react';

export function Workshop({ k }: { k: string; live?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { (window as unknown as { K4Vorlage?: { vorlage(el: HTMLElement, k: string): void } }).K4Vorlage?.vorlage(ref.current!, k); }, [k]);
  return <div className="v-vorlage" ref={ref} />;
}
