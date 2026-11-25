import type { Plugin } from 'vite';

/** Begriffs-Marke ⟪Anzeigetext|id⟫ oder ⟪Name⟫ (U+27EA / U+27EB).
 *  ⟦…⟧ ist die Lücken-Syntax der Code-Werkstatt und bleibt immer unberührt. */
export const MARKE = /⟪([^⟪⟫|\n]+)(?:\|([a-z0-9-]+))?⟫/g;

export function ohneMarken(s: string): string {
  return s.replace(MARKE, (_m, text: string) => text);
}

export type Eintrag = {
  name: string;
  alias?: string[];
  fach: string;
  kurz: string;
  bild?: string[];
  karte?: string;
  kapitel: number;
};

/** Löst eine Marke zur Eintrags-id auf: erst id, sonst exakter name/alias (ohne Groß-/Kleinschreibung). */
export function aufloesen(
  text: string,
  id: string | undefined,
  verzeichnis: Record<string, Eintrag>,
): string | null {
  if (id) return Object.hasOwn(verzeichnis, id) ? id : null;
  const t = text.trim().toLowerCase();
  for (const [key, e] of Object.entries(verzeichnis)) {
    if (e.name.toLowerCase() === t || (e.alias ?? []).some((a) => a.toLowerCase() === t)) return key;
  }
  return null;
}

/** Vite-Plugin: ersetzt Marken in .ts/.tsx unter src/ durch ihren Text (Atlas-Build). */
export function markenEntfernen(): Plugin {
  // Nur Dateien unter <Wurzel>/src/: Arbeitsverzeichnis und (falls anders) die Vite-Wurzel, z. B. lernpfad/ mit @atlas → src/.
  const norm = (p: string) => p.replace(/\\/g, '/').replace(/\/$/, '') + '/src/';
  const ordner = new Set([norm(process.cwd())]);
  return {
    configResolved(c) { ordner.add(norm(c.root)); },
    name: 'marken-entfernen',
    enforce: 'pre',
    transform(code, id) {
      const pfad = id.split('?')[0].replace(/\\/g, '/');
      if (!/\.tsx?$/.test(pfad) || pfad.includes('/node_modules/') || ![...ordner].some((o) => pfad.startsWith(o))) return undefined;
      const neu = ohneMarken(code);
      return neu === code ? undefined : { code: neu, map: null };
    },
  };
}
