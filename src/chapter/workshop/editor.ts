/** RStudio-Kürzel der Code-Werkstatt als reine Funktionen auf Text und Auswahl (ohne DOM).
 *  Tab und Umschalt+Tab bleiben beim Browser, damit man die Werkstatt per Tastatur verlassen kann. */
export type Edit = { text: string; start: number; end: number };
export type Key = { key: string; ctrl: boolean; meta: boolean; shift: boolean; alt: boolean };

const replace = (e: Edit, text: string, back = 0): Edit => {
  const pos = e.start + text.length - back;
  return { text: e.text.slice(0, e.start) + text + e.text.slice(e.end), start: pos, end: pos };
};

const needsSpace = (e: Edit) => e.start > 0 && !/\s/.test(e.text[e.start - 1]);

/** Einzug der nächsten Zeile: offene Klammer → eine Spalte rechts davon; nach %>% oder + einrücken; sonst gleich. */
function indentAfter(text: string, lineStart: number, caret: number): string {
  const line = text.slice(lineStart, caret);
  const open: number[] = [];
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { const j = line.indexOf('"', i + 1); if (j < 0) break; i = j; continue; }
    if (ch === '#') break;
    if (ch === '(') open.push(i);
    if (ch === ')') open.pop();
  }
  if (open.length) return ' '.repeat(open[open.length - 1] + 1);
  const base = line.match(/^ */)![0].length;
  const body = line.replace(/#.*$/, '').trimEnd();
  if (/(%>%|\+|\||&|,)$/.test(body)) return ' '.repeat(base === 0 ? 2 : base);
  const prevLine = lineStart > 0 ? text.slice(0, lineStart - 1).split('\n').pop()! : '';
  if (base > 0 && /(%>%|\+)\s*$/.test(prevLine.replace(/#.*$/, ''))) return '';
  return ' '.repeat(base);
}

export function applyKey(e: Edit, k: Key): Edit | null {
  const mod = k.ctrl || k.meta;
  const { text, start, end } = e;
  const lower = k.key.toLowerCase();

  if (mod && k.key === 'Enter') return null;
  if (k.key === 'Tab') return null;

  if (mod && k.shift && lower === 'm') return replace(e, (needsSpace(e) ? ' ' : '') + '%>% ');
  if (k.alt && !mod && (k.key === '-' || k.key === '–' || k.key === '−')) return replace(e, (needsSpace(e) ? ' ' : '') + '<- ');

  if (mod && k.shift && lower === 'c') {
    const s0 = text.lastIndexOf('\n', start - 1) + 1;
    const last = end > start && text[end - 1] === '\n' ? end - 1 : end;
    const nl = text.indexOf('\n', last);
    const e0 = nl < 0 ? text.length : nl;
    const block = text.slice(s0, e0).split('\n');
    const all = block.every(z => /^\s*#/.test(z) || !z.trim());
    const next = block.map(z => !z.trim() ? z : all ? z.replace(/^(\s*)# ?/, '$1') : z.replace(/^(\s*)/, '$1# ')).join('\n');
    return { text: text.slice(0, s0) + next + text.slice(e0), start: s0, end: s0 + next.length };
  }

  if (k.key === 'Enter' && !mod && !k.shift && !k.alt) {
    const lineStart = text.lastIndexOf('\n', start - 1) + 1;
    return replace(e, '\n' + indentAfter(text, lineStart, start));
  }

  if (!mod && !k.alt) {
    const pair = k.key === '(' ? ')' : k.key === '"' ? '"' : null;
    if (pair) {
      if (start !== end) {
        const sel = text.slice(start, end);
        return { text: text.slice(0, start) + k.key + sel + pair + text.slice(end), start: start + 1, end: end + 1 };
      }
      if (k.key === '"' && text[start] === '"') return { ...e, start: start + 1, end: start + 1 };
      return replace(e, k.key + pair, 1);
    }
    if (start === end && k.key === ')' && text[start] === ')') return { ...e, start: start + 1, end: start + 1 };
    if (start === end && k.key === 'Backspace' && start > 0
      && ((text[start - 1] === '(' && text[start] === ')') || (text[start - 1] === '"' && text[start] === '"'))) {
      return { text: text.slice(0, start - 1) + text.slice(start + 1), start: start - 1, end: start - 1 };
    }
  }
  return null;
}

/** Stellen in ⟦…⟧ sind die Marken, die Studierende anpassen; Zeilen 0-basiert, Spalten im Code ohne Klammern. */
export function parseMarks(template: string): { code: string; marks: { line: number; from: number; to: number; word: string }[] } {
  const marks: { line: number; from: number; to: number; word: string }[] = [];
  const lines = template.split('\n').map((line, i) => {
    let out = '';
    let last = 0;
    for (const m of line.matchAll(/⟦(.*?)⟧/g)) {
      out += line.slice(last, m.index);
      marks.push({ line: i, from: out.length, to: out.length + m[1].length, word: m[1] });
      out += m[1];
      last = m.index! + m[0].length;
    }
    return out + line.slice(last);
  });
  return { code: lines.join('\n'), marks };
}

/** Im Browser sind Pakete und Daten schon da: Kopfzeilen des Startblocks weglassen. */
export function forBrowser(code: string): string {
  return code
    .replace(/^[ \t]*library\(tidyverse\)[ \t]*(\r?\n|$)/m, '')
    .replace(/^[ \t]*library\(mariposa\)[ \t]*(\r?\n|$)/m, '')
    .replace(/^[ \t]*allbus <- read_spss\(.*\)[ \t]*(\r?\n|$)/m, '');
}
