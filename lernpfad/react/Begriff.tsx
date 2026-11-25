import type { ReactNode } from 'react';
import type { Eintrag } from '../../src/lib/begriffe';

type Fenster = Window & { BEGRIFFE?: Record<string, Eintrag> };

const gewarnt = new Set<string>();

/** Lernpfad-Fassung: ein antippbarer Fachbegriff. Das Popover liefert die Engine (data-b). Unbekannte id: nur Text. */
export function Begriff({ id, children }: { id: string; children: ReactNode }): ReactNode {
  const verzeichnis = (window as Fenster).BEGRIFFE;
  if (!verzeichnis || !Object.hasOwn(verzeichnis, id)) {
    if (verzeichnis && !gewarnt.has(id)) {
      gewarnt.add(id);
      console.warn(`Fachbegriff unbekannt: <Begriff id="${id}"> steht im Verzeichnis (lernpfad/begriffe.json) nicht und wird als bloßer Text gezeigt.`);
    }
    return children;
  }
  return <button type="button" className="begriff" data-b={id}>{children}</button>;
}
