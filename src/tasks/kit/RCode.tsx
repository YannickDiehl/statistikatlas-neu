import type { ReactNode } from 'react';

/** Zerlegt R-Code in farbige Stücke, damit Anfänger sehen, was Kommentar und was Code ist.
 *  Bewusst schlicht: Kommentare, Zeichenketten, Zahlen, Funktionsnamen, Pipe/Zuweisung, Lücken ___ und Schlüsselwörter. */
export type RToken = { kind: 'comment' | 'string' | 'number' | 'fn' | 'op' | 'gap' | 'keyword' | 'plain'; text: string };

const RULES: [RToken['kind'], RegExp][] = [
  ['comment', /^#.*/],
  ['string', /^"(?:[^"\\]|\\.)*"?/],
  ['gap', /^_{3,}/],
  ['op', /^(?:%>%|\|>|<-|->|==|!=|<=|>=|~)/],
  ['keyword', /^(?:TRUE|FALSE|NA|NULL)\b/],
  ['number', /^-?\d+(?:\.\d+)?\b/],
  ['fn', /^[A-Za-z_.][A-Za-z0-9_.]*(?=\()/],
  ['plain', /^[A-Za-z_.][A-Za-z0-9_.]*/],
];

export function tokenizeR(code: string): RToken[] {
  const out: RToken[] = [];
  let rest = code;
  while (rest.length) {
    let hit: RToken | null = null;
    for (const [kind, re] of RULES) {
      const m = rest.match(re);
      if (m && m[0].length) { hit = { kind, text: m[0] }; break; }
    }
    // Alles andere (Klammern, Kommas, Leerzeichen, Zeilenumbrüche) zeichenweise als normaler Text
    if (!hit) hit = { kind: 'plain', text: rest[0] };
    const last = out[out.length - 1];
    if (hit.kind === 'plain' && last?.kind === 'plain') last.text += hit.text;
    else out.push(hit);
    rest = rest.slice(hit.text.length);
  }
  return out;
}

/** R-Code mit Farben, Zeile für Zeile. Bricht eine lange Zeile um, rückt die Fortsetzung ein – so bleibt sichtbar,
 *  wo eine Zeile weitergeht. Der Kopieren-Knopf nimmt immer den unveränderten Code. */
export function RCode({ code }: { code: string }): ReactNode {
  // Leere Zeilen am Ende nicht als Leerraum zeichnen
  return code.replace(/\n+$/, '').split('\n').map((line, n) => {
    const indent = line.length - line.trimStart().length, text = line.trimStart();
    return <span key={n} className="r-line" style={{ ['--ind' as string]: indent }}>
      {text ? tokenizeR(text).map((t, i) => (t.kind === 'plain' ? t.text : <span key={i} className={`r-${t.kind}`}>{t.text}</span>)) : '\u200b'}
    </span>;
  });
}

/** Für Tests: entfernt die Farb-Hüllen wieder, damit Code in gerendertem HTML als durchgehender Text lesbar bleibt. */
export const plainCode = (html: string) => html
  .replace(/<span class="r-(?!line)[a-z]+">([^<]*)<\/span>/g, '$1')
  .replace(/<span class="r-line" style="--ind:(\d+)">([^]*?)<\/span>/g, (_, ind: string, text: string) => `${' '.repeat(Number(ind))}${text.replace(/\u200b/g, '')}\n`)
  .replace(/\n(<\/code>)/g, '$1');
