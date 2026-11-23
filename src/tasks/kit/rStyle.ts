/** Einheitliches Schriftbild für jeden R-Code, den Studierende im Lernpfad sehen (Werkzeugkasten, Hilfe, Skripte).
 *  Regeln (siehe docs/AUFGABEN-LEITFADEN.md, „Schriftbild“):
 *  1. `%>%` steht immer am Zeilenende; jede Funktion der Kette in eigener Zeile, zwei Leerzeichen eingerückt.
 *  2. ggplot-Schichten: `+` am Zeilenende, jede Schicht in eigener Zeile.
 *  3. `mutate(` endet die Zeile; jede neue Variable in eigener Zeile, die schließende Klammer allein in einer Zeile.
 *  4. Kommentare stehen in eigener Zeile über dem Code, nie hinter Code.
 *  5. Zwischen zwei Anweisungen steht eine Leerzeile (Ausnahme: mehrere library()-Zeilen hintereinander).
 *  6. Einrückung nur in Zweierschritten, keine Tabs, keine Leerzeichen am Zeilenende.
 *  7. Zeilen höchstens 100 Zeichen – außer eine lange rules-Angabe in Anführungszeichen oder der Dateipfad in read_spss(). */

const MAX = 100;

/** Code ohne Inhalt von Zeichenketten, damit `#`, `+` oder `%>%` in "…" nicht zählen. */
const stripStrings = (line: string) => line.replace(/"(?:[^"\\]|\\.)*"/g, '""');

const indentOf = (line: string) => line.length - line.trimStart().length;

/** Liste der Verstöße („Zeile 4: …“); leer heißt: sauber formatiert. */
export function rStyleProblems(code: string): string[] {
  const problems: string[] = [];
  const lines = code.replace(/\n+$/, '').split('\n');
  let depth = 0; // offene Klammern über Zeilen hinweg
  let continued = false; // vorige Zeile endete mit %>%, + oder Komma bzw. offener Klammer
  lines.forEach((raw, i) => {
    const n = i + 1, line = raw, bare = stripStrings(line), trimmed = bare.trim();
    const say = (text: string) => problems.push(`Zeile ${n}: ${text}`);
    if (/\t/.test(line)) say('Tabulator statt Leerzeichen');
    if (/\s+$/.test(line)) say('Leerzeichen am Zeilenende');
    if (indentOf(line) % 2) say('Einrückung nicht in Zweierschritten');
    const isComment = trimmed.startsWith('#');
    const codePart = isComment ? '' : bare.replace(/#.*$/, '');
    if (!isComment && /#/.test(bare)) say('Kommentar hinter Code – gehört in eine eigene Zeile darüber');
    if (/%>%\s*\S/.test(codePart)) say('nach %>% geht es in einer neuen Zeile weiter');
    if (/\)\s*\+\s*(?:geom_|labs|scale_|theme|facet_|coord_|stat_|ggtitle|xlab|ylab|guides)/.test(codePart)) say('ggplot-Schicht in eigene Zeile: + ans Zeilenende');
    if (/\bmutate\(\s*\S/.test(codePart)) say('nach mutate( geht es in einer neuen Zeile weiter');
    if (line.length > MAX && !/rules\s*=\s*"|read_spss\(/.test(line) && !isComment) say(`Zeile länger als ${MAX} Zeichen`);
    // Leerzeile zwischen Anweisungen: eine neue Anweisung beginnt ganz links, wenn die vorige abgeschlossen ist.
    const startsStatement = trimmed !== '' && !isComment && indentOf(line) === 0 && depth === 0 && !continued && !/^[)\]}]/.test(trimmed);
    if (startsStatement && i > 0) {
      let j = i - 1;
      while (j >= 0 && lines[j].trim().startsWith('#')) j--;
      const before = j >= 0 ? lines[j].trim() : '';
      const libraries = /^library\(/.test(trimmed) && /^library\(/.test(before);
      if (j >= 0 && before !== '' && !libraries) say('Leerzeile vor dieser Anweisung fehlt');
    }
    if (!isComment && trimmed) {
      for (const ch of codePart) { if ('([{'.includes(ch)) depth++; else if (')]}'.includes(ch)) depth = Math.max(0, depth - 1); }
      continued = /(%>%|\+|,|\(|<-|=|~)\s*$/.test(codePart.trimEnd());
    }
  });
  // Innerhalb von mutate( … ): jede Zuweisung in eigener Zeile, schließende Klammer allein
  // Ohne Zeichenketten und Kommentare, damit Klammern darin nicht mitzählen
  const text = code.split('\n').map(l => stripStrings(l).replace(/#.*$/, '')).join('\n');
  const re = /\bmutate\(\n/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    let k = m.index + m[0].length - 1, d = 1, inner = '';
    while (++k < text.length && d > 0) { const ch = text[k]; if (ch === '(') d++; else if (ch === ')') d--; if (d > 0) inner += ch; }
    const lineNo = text.slice(0, m.index).split('\n').length;
    if (!/\n\s*$/.test(inner)) problems.push(`Zeile ${lineNo}: schließende Klammer von mutate() gehört in eine eigene Zeile`);
    let d2 = 0;
    for (let q = 0; q < inner.length; q++) {
      const ch = inner[q];
      if (ch === '(') d2++; else if (ch === ')') d2--;
      else if (ch === ',' && d2 === 0 && !/^[ ]*\n/.test(inner.slice(q + 1))) problems.push(`Zeile ${lineNo}: in mutate() jede neue Variable in eigene Zeile`);
    }
  }
  return problems;
}
