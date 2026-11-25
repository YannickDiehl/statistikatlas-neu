// Gibt die JSON-fähigen Exporte von src/chapter/<sNN>/content.ts (und bilder/index.ts, falls vorhanden) als JSON aus.
// Aufruf: node --import tsx scripts/lernpfad-daten.ts s04
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const kapitel = process.argv[2];
const ordner = path.resolve('src/chapter', kapitel);
const daten: Record<string, unknown> = {};
const nimm = (mod: Record<string, unknown>) => {
  for (const [k, v] of Object.entries(mod)) {
    if (typeof v === 'function' || v === undefined) continue;
    try { JSON.stringify(v); daten[k] = v; } catch { /* nicht serialisierbar */ }
  }
};
nimm(await import(pathToFileURL(path.join(ordner, 'content.ts')).href));
const bilder = path.join(ordner, 'bilder', 'index.ts');
if (fs.existsSync(bilder)) {
  // Bilder für die Zusatzinfos: alle SVG-Zeichenketten als SVG[name], übrige Exporte (z. B. ALT) wie sie sind.
  const mod = await import(pathToFileURL(bilder).href) as Record<string, unknown>;
  const svg: Record<string, string> = {};
  for (const [k, v] of Object.entries(mod)) if (typeof v === 'string' && v.trimStart().startsWith('<svg')) svg[k] = v; else if (typeof v !== 'function') daten[k] = v;
  daten.SVG = svg;
}
process.stdout.write(JSON.stringify(daten));
