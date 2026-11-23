// Schreibt alle Codevorlagen eines Kapitels als ein R-Skript, um sie mit der echten Datei durchlaufen zu lassen:
//   node --import tsx scripts/chapter-r-export.ts s04 > /tmp/s04.R
//   ALLBUS_SAV=/pfad/ZA8831_v1-3-0.sav Rscript /tmp/s04.R
// Marken ⟦…⟧ stehen mit ihrem Beispielwert; Grafiken gehen in eine temporäre PDF-Datei.
import { pathToFileURL } from 'node:url';
import { forBrowser, parseMarks } from '../src/chapter/workshop/editor';
import { R_CHECK as S01 } from '../src/chapter/s01/content';
import { TEMPLATES as S02 } from '../src/chapter/s02/content';
import { TEMPLATES as S03 } from '../src/chapter/s03/content';
import { TEMPLATES as S04 } from '../src/chapter/s04/content';
import { TEMPLATES as S05 } from '../src/chapter/s05/content';
import { TEMPLATES as S06 } from '../src/chapter/s06/content';
import { TEMPLATES as S07 } from '../src/chapter/s07/content';
import { TEMPLATES as S08 } from '../src/chapter/s08/content';
import { TEMPLATES as S09 } from '../src/chapter/s09/content';
import { TEMPLATES as S10 } from '../src/chapter/s10/content';
import { TEMPLATES as S11 } from '../src/chapter/s11/content';

type Templates = Record<string, { title: string; code: string; tryOut?: boolean }>;
const CHAPTERS: Record<string, Templates> = { s01: S01, s02: S02, s03: S03, s04: S04, s05: S05, s06: S06, s07: S07, s08: S08, s09: S09, s10: S10, s11: S11 };

const HEADER = `# Alle Vorlagen nacheinander, erzeugt von scripts/chapter-r-export.ts
pdf(file = tempfile(fileext = ".pdf"))

library(tidyverse)
library(mariposa)

allbus <- read_spss(Sys.getenv("ALLBUS_SAV"))
`;

/** Ein Skript: Kopf mit Paketen und Datei aus ALLBUS_SAV, dann jede Vorlage ohne eigene Kopfzeilen. */
export function rScript(templates: Templates): string {
  const parts = Object.entries(templates).map(([key, t]) => {
    const body = forBrowser(parseMarks(t.code).code).replace(/\n+$/, '');
    return `# ---- ${key}: ${t.title} ----\n${body}\n`;
  });
  return [HEADER, ...parts].join('\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const id = process.argv[2];
  const templates = id ? CHAPTERS[id] : undefined;
  if (!templates) {
    console.error(`Aufruf: node --import tsx scripts/chapter-r-export.ts <${Object.keys(CHAPTERS).join('|')}>`);
    process.exit(1);
  }
  process.stdout.write(rScript(templates));
}
