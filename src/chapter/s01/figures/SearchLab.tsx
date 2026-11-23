// Grundlage 2b, „Suchwort-Labor“: feste Ausgaben von find_var() für sieben Suchwörter, ohne Datei.
import { useState, type ReactNode } from 'react';
import { LAB } from '../content';

/** **fett** im Lehrtext. */
export function bold(text: string): ReactNode {
  const parts = text.split(/\*\*([^*]+)\*\*/);
  return parts.length === 1 ? text : parts.map((p, i) => (i % 2 ? <b key={i}>{p}</b> : p));
}

/** Text of the output field for one search word (as R prints it, after the command). */
export const labOutput = (i: number) => `> find_var(allbus, "${LAB[i].word}")\n${LAB[i].output}`;

export function SearchLab({ initialAt = null }: { initialAt?: number | null }) {
  const [at, setAt] = useState<number | null>(initialAt);
  return <div className="s1-labor">
    <div className="s1-wahl" role="group" aria-label="Suchwort wählen">
      {LAB.map((w, i) => <button key={w.word} type="button" aria-pressed={at === i} onClick={() => setAt(i)}><code>{`"${w.word}"`}</code></button>)}
    </div>
    <div aria-live="polite">
      {at === null
        ? <p className="erkl">Wähl ein Suchwort.</p>
        : <>
            <pre className="s1-ausgabe" role="region" aria-label="Ausgabe von R" tabIndex={0}>{labOutput(at)}</pre>
            <p className="erkl"><b>Was lernst du daraus?</b> {bold(LAB[at].lesson)}</p>
          </>}
    </div>
  </div>;
}
