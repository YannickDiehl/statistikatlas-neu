import { useState, type FormEvent, type ReactNode } from 'react';
import { Part } from './ChapterLayout';
import { useAnnounce } from './announce';

export type SelfTestItem = { question: string; options: string[]; /** index into options */ answer: number; why: string };

function SelfTestQuestion({ n, item }: { n: number; item: SelfTestItem }) {
  const [choice, setChoice] = useState<number | null>(null);
  const [feedback, announce] = useAnnounce<{ ok: boolean | null; text: string }>({ ok: null, text: '' }, { ok: null, text: '' });
  const name = `selbsttest-${n}`;

  function submit(e: FormEvent) {
    e.preventDefault();
    if (choice === null) { announce({ ok: false, text: 'Wähl zuerst eine Antwort.' }); return; }
    const ok = choice === item.answer;
    announce({ ok, text: `${ok ? 'Richtig. ' : 'Noch nicht. '}Deine Wahl: „${item.options[choice]}“. ${item.why}` });
  }

  return <form className="frage selbst" onSubmit={submit}>
    <fieldset>
      <legend>{`${n}. ${item.question}`}</legend>
      <div className="radios">{item.options.map((o, k) => <label key={k}>
        <input type="radio" name={name} value={k} checked={choice === k} onChange={() => setChoice(k)} /> {o}
      </label>)}</div>
    </fieldset>
    <div className="reihe-knoepfe"><button type="submit" className="knopf hell">Prüfen</button></div>
    <p className={`rueck${feedback.ok === null ? '' : feedback.ok ? ' ok' : ' no'}`} aria-live="polite">{feedback.text}</p>
  </form>;
}

/** The script as a data URI, so it also works in the offline file. */
export const scriptHref = (script: string) => `data:text/plain;charset=utf-8,${encodeURIComponent(script)}`;

/**
 * „Zum Schluss: Mitnehmen“ (h3, id `mitnehmen`): Das Wichtigste (`#wichtig`), Prüf dich selbst (`#selbsttest`),
 * Dein Skript zum Mitnehmen (`#skript`) with a download of `scriptName`.
 */
export function TakeAway({ points, selfTest, script, scriptName, more, scriptNote }: {
  points: ReactNode[];
  selfTest: SelfTestItem[];
  script: string;
  scriptName: string;
  /** Optional link next to the download, e.g. „Nachlesen im R-Workshop, Kapitel 6“. */
  more?: { href: string; label: string };
  /** Replaces „Alle Vorlagen dieser Sitzung in einer Datei, mit Kommentaren. …“ above the download. */
  scriptNote?: ReactNode;
}) {
  return <>
    <Part id="mitnehmen" tone="green" title="Zum Schluss: Mitnehmen" />
    <section className="wichtig" id="wichtig" aria-labelledby="wichtig-h">
      <h4 id="wichtig-h">Das Wichtigste aus dieser Sitzung</h4>
      <ul>{points.map((p, i) => <li key={i}>{p}</li>)}</ul>
    </section>
    <section className="karte" id="selbsttest" aria-labelledby="selbsttest-h">
      <div className="karte-kopf">
        <span className="st m c2" aria-hidden="true">✓</span>
        <h4 id="selbsttest-h">Prüf dich selbst</h4>
        <span className="art deuten">{selfTest.length === 1 ? '1 Frage' : `${selfTest.length} Fragen`}</span>
      </div>
      {selfTest.map((item, i) => <SelfTestQuestion key={i} n={i + 1} item={item} />)}
    </section>
    <section className="karte" id="skript" aria-labelledby="skript-h">
      <div className="karte-kopf"><span className="st m c2" aria-hidden="true">R</span><h4 id="skript-h">Dein Skript zum Mitnehmen</h4></div>
      <p>{scriptNote ?? 'Alle Vorlagen dieser Sitzung in einer Datei, mit Kommentaren. Öffne sie in RStudio und führe sie Block für Block aus.'}</p>
      <div className="reihe-knoepfe">
        <a className="knopf" href={scriptHref(script)} download={scriptName}>{`Skript herunterladen (${scriptName})`}</a>
        {more ? <a className="mehr" href={more.href} target="_blank" rel="noreferrer">{`→ ${more.label}`}</a> : null}
      </div>
    </section>
  </>;
}
