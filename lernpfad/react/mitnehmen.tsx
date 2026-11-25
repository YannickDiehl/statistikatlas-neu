// Reiter „Mitnehmen“: Das Wichtigste (mit Verweis in Verstehen), Prüf dich selbst, Dein Lernjournal, Skript.
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import * as C from '@content';
import { MITNEHMEN } from '@kapitel/mitnehmen';

type Fenster = Window & {
  tabWechsel?: (name: string, ziel?: string) => void;
  K4Vorlage?: { journalStand(): { aufgaben: { n: number; titel: string; code: number; notizen: number }[]; frei: number; leer: boolean }; download(art: 'qmd' | 'html'): void };
};
const w = window as Fenster;

/** Verweis auf eine Karte in „Verstehen“. */
function Nachlesen({ k, children }: { k: string; children: ReactNode }) {
  return <a className="m-nachlesen" href={`#${k}`} onClick={e => { e.preventDefault(); w.tabWechsel?.('verstehen', k); }}>{children}</a>;
}

const { wichtig: WICHTIG, selbstKarte: SELBST_KARTE, workshop } = MITNEHMEN;
// Selbsttest und Skript: aus content.ts (SELF_TEST, SCRIPT, SCRIPT_FILE) oder vom Kapitel in mitnehmen.tsx überschrieben.
// Antwortmöglichkeiten dürfen Text sein oder { text, why } (eigene Begründung je Möglichkeit).
type Option = string | { text: string; why?: string };
type SelbstItem = { question: string; options: Option[]; answer: number; why?: string };
const Cx = C as unknown as { SELF_TEST?: SelbstItem[]; SCRIPT?: string; SCRIPT_FILE?: string };
const SELF_TEST: SelbstItem[] = MITNEHMEN.selbsttest ?? Cx.SELF_TEST ?? [];
const SCRIPT: string = MITNEHMEN.skript ?? Cx.SCRIPT ?? '';
const SCRIPT_FILE: string = MITNEHMEN.skriptDatei ?? Cx.SCRIPT_FILE ?? 'sitzung.R';
const optText = (o: Option) => typeof o === 'string' ? o : o.text;
const ohneVerweis = (t: string) => t.replace(/\s*\((Grundlage|Überblick|Vorweg)[^)]*\)\.?$/, '.').replace(/\.\.$/, '.');

function SelbstFrage({ n, item, karte }: { n: number; item: SelbstItem; karte?: [string, string] }) {
  const [wahl, setWahl] = useState<number | null>(null);
  const [rueck, setRueck] = useState<{ ok: boolean | null; text: string }>({ ok: null, text: '' });
  const name = `selbst-${n}`;
  function pruefen(e: FormEvent) {
    e.preventDefault();
    if (wahl === null) { setRueck({ ok: false, text: 'Wähl zuerst eine Antwort.' }); return; }
    const ok = wahl === item.answer;
    const gewaehlt = item.options[wahl]; const eigen = typeof gewaehlt === 'object' ? gewaehlt.why : undefined;
    setRueck({ ok, text: `${ok ? 'Richtig. ' : 'Noch nicht. '}${ohneVerweis(eigen ?? item.why ?? '')}` });
  }
  return <form className="frage selbst" onSubmit={pruefen}>
    <fieldset>
      <legend>{`${n}. ${item.question}`}</legend>
      <div className="radios">{item.options.map((o, k) => <label key={k}>
        <input type="radio" name={name} value={k} checked={wahl === k} onChange={() => setWahl(k)} /> {optText(o)}
      </label>)}</div>
    </fieldset>
    <div className="reihe-knoepfe"><button type="submit" className="knopf hell">Prüfen</button></div>
    <div className={`rueck${rueck.ok === null ? '' : rueck.ok ? ' ok' : ' no'}`} aria-live="polite">
      {rueck.text}{rueck.text && karte && wahl !== null ? <> <Nachlesen k={karte[0]}>{`Nachlesen: ${karte[1]} →`}</Nachlesen></> : null}
    </div>
  </form>;
}

function Lernjournal() {
  const panel = document.getElementById('p-mitnehmen')!;
  const [stand, setStand] = useState(() => w.K4Vorlage?.journalStand());
  useEffect(() => {
    const neu = () => { if (!panel.hidden) setStand(w.K4Vorlage?.journalStand()); };
    const mo = new MutationObserver(neu); mo.observe(panel, { attributes: true, attributeFilter: ['hidden'] }); neu();
    return () => mo.disconnect();
  }, [panel]);
  if (!stand) return null;
  return <section className="karte" id="m-journal" aria-labelledby="m-journal-h">
    <div className="karte-kopf"><span className="st m c7" aria-hidden="true">J</span><h3 id="m-journal-h">Dein Lernjournal</h3></div>
    {stand.leer
      ? <p>Dein Lernjournal ist noch leer. In den Aufgaben holst du Vorlagen mit <b>→ Journal</b> hinein, passt sie an und schreibst deine Ergebnisse dazu.</p>
      : <>
        <p>Das hast du in dieser Sitzung festgehalten:</p>
        <ul className="m-journal-liste">{stand.aufgaben.map(a => <li key={a.n}><span className="st s c7" aria-hidden="true">{`A${a.n}`}</span><span>{a.titel}</span><small>{[a.code ? `${a.code} Code-${a.code === 1 ? 'Block' : 'Blöcke'}` : '', a.notizen ? `${a.notizen} ${a.notizen === 1 ? 'Notiz' : 'Notizen'}` : ''].filter(Boolean).join(', ') || 'noch leer'}</small></li>)}</ul>
        {stand.frei ? <p className="m-klein">{`Davon ${stand.frei} ${stand.frei === 1 ? 'eigener Versuch' : 'eigene Versuche'}.`}</p> : null}
      </>}
    <div className="reihe-knoepfe">
      <button type="button" className="knopf" onClick={() => w.K4Vorlage?.download('qmd')} disabled={stand.leer}>Als .qmd für RStudio</button>
      <button type="button" className="knopf hell" onClick={() => w.K4Vorlage?.download('html')} disabled={stand.leer}>Als HTML mit Grafiken</button>
    </div>
    <details className="genauer"><summary>Genauer erklärt: So wird aus der .qmd ein Dokument</summary>
      <ol>
        <li>Leg die .qmd in denselben Ordner wie die ALLBUS-Datei (<code>ZA8831_v1-3-0.sav</code>).</li>
        <li>Öffne sie in RStudio und trag oben bei <code>author</code> deinen Namen ein.</li>
        <li>Klick auf <b>Render</b>. Es entsteht eine HTML-Datei mit Code, Ergebnissen und Grafiken.</li>
      </ol>
      <p>Läuft ein Block nicht, bricht das Rendern nicht ab: Die Fehlermeldung steht dann im Dokument unter dem Block. Befehle, die nur in der Konsole Sinn ergeben (<code>?fre</code>, <code>View()</code>), sind auskommentiert.</p>
    </details>
  </section>;
}

export function Mitnehmen() {
  const href = `data:text/plain;charset=utf-8,${encodeURIComponent(SCRIPT)}`;
  return <div className="chapter v-wurzel m-wurzel">
    <section className="wichtig" id="wichtig" aria-labelledby="wichtig-h">
      <h3 id="wichtig-h">Das Wichtigste aus dieser Sitzung</h3>
      <ul>{WICHTIG.map(([p, k, t], i) => <li key={i}>{p} <Nachlesen k={k}>{`${t} →`}</Nachlesen></li>)}</ul>
    </section>

    <section className="karte" id="selbsttest" aria-labelledby="selbsttest-h">
      <div className="karte-kopf">
        <span className="st m c7" aria-hidden="true">✓</span>
        <h3 id="selbsttest-h">Prüf dich selbst</h3>
        <span className="art deuten">{`${SELF_TEST.length} ${SELF_TEST.length === 1 ? 'Frage' : 'Fragen'}`}</span>
      </div>
      <p className="m-klein">Kurze Fragen zu allen Aufgaben. Nach dem Prüfen führt ein Verweis zur passenden Erklärung.</p>
      {SELF_TEST.map((item, i) => <SelbstFrage key={i} n={i + 1} item={item} karte={SELBST_KARTE[i]} />)}
    </section>

    <Lernjournal />

    <section className="karte" id="skript" aria-labelledby="skript-h">
      <div className="karte-kopf"><span className="st m c7" aria-hidden="true">R</span><h3 id="skript-h">Alle Vorlagen als Skript</h3></div>
      <p>Alle Vorlagen dieser Sitzung in einer Datei, mit Kommentaren und mit den Beispielwerten an den markierten Stellen. Öffne sie in RStudio und führe sie Block für Block aus. Dein Lernjournal ist deine eigene Fassung davon.</p>
      <div className="reihe-knoepfe">
        <a className="knopf hell" href={href} download={SCRIPT_FILE}>{`Skript herunterladen (${SCRIPT_FILE})`}</a>
        <a className="mehr" href="https://rloesung.github.io/RWorkshop/" target="_blank" rel="noreferrer">{`→ Nachlesen im R-Workshop${workshop ? `, ${workshop}` : ''}`}</a>
      </div>
    </section>
  </div>;
}
