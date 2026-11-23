import type { ReactNode } from 'react';
import { Companion } from '../companions/Companion';

export type Link = { href: string; label: string };
export type TocGroup = { group: string; items: Link[] };

/** Section line „Vorweg: R lesen“ / „Zum Schluss: Mitnehmen“ (h3). */
export function Part({ id, tone, title }: { id: string; tone: 'blue' | 'yellow' | 'green'; title: ReactNode }) {
  const cls = { blue: 'v', yellow: 'a', green: 'm' }[tone];
  return <div className={`teil ${cls}`} id={id}><h3>{title}</h3><hr aria-hidden="true" /></div>;
}

/**
 * Frame of a chapter session. It does not render the session title: LearningPath keeps its h2,
 * so every heading inside starts at h3.
 */
export function ChapterLayout({ session, lead, route, goals, known, knownNote, howToExtra, jumps, toc, children }: {
  session: number;
  /** Guiding question in the speech bubble. */
  lead: ReactNode;
  /** Optional „Ablauf der Sitzung“ signposts. */
  route?: { href: string; title: string; note: string }[];
  goals: ReactNode[];
  /** Completes „Schon bekannt und hier nur kurz erinnert: …“. */
  known?: ReactNode;
  /** Replaces „Solche Stellen tragen ein graues Schild „kennst du aus Sitzung …“.“ after `known`. */
  knownNote?: ReactNode;
  /** Extra lines at the end of „So arbeitest du mit dieser Seite“. */
  howToExtra?: ReactNode[];
  jumps: Link[];
  toc: TocGroup[];
  children?: ReactNode;
}) {
  return <div className="chapter">
    <nav className="chapter-toc" aria-labelledby="chapter-toc-h">
      <h3 id="chapter-toc-h">Auf dieser Seite</h3>
      {toc.map((g, i) => <div className="toc-gruppe" key={g.group}>
        <p className="grp" id={`chapter-toc-g${i + 1}`}>{g.group}</p>
        <ul aria-labelledby={`chapter-toc-g${i + 1}`}>{g.items.map(it => <li key={it.href}><a href={it.href}>{it.label}</a></li>)}</ul>
      </div>)}
    </nav>
    <div className="chapter-body">
      <div className="kopf">
        <span className={`st l c${session}`} aria-hidden="true">{session}</span>
        <div className="leit"><Companion name="hallo" /><p className="bubble">{lead}</p></div>
      </div>

      {route?.length ? <nav aria-label="Ablauf der Sitzung"><ul className="weg">
        {route.map(r => <li key={r.href}><a href={r.href}><b>{r.title}</b><small>{r.note}</small></a></li>)}
      </ul></nav> : null}

      <section className="box-gruen" aria-labelledby="ziele-h">
        <h3 id="ziele-h">Was du nach dieser Sitzung kannst</h3>
        <ul>{goals.map((g, i) => <li key={i}>{g}</li>)}</ul>
        {known ? <p className="grundlage">Schon bekannt und hier nur kurz erinnert: {known} {knownNote ?? 'Solche Stellen tragen ein graues Schild „kennst du aus Sitzung …“.'}</p> : null}
      </section>

      <section className="so" aria-label="So arbeitest du mit dieser Seite">
        <div><i aria-hidden="true">+</i><span><b>Genauer erklärt</b> klappt Hintergründe auf. Lies sie, wenn dir etwas zu schnell geht.</span></div>
        <div><i aria-hidden="true">?</i><span><b>Kurz überlegen</b> heißt: erst selbst festlegen, dann auflösen. Danebenliegen gehört dazu.</span></div>
        <div><i aria-hidden="true">▶</i><span>In der <b>Code-Werkstatt</b> darfst du schreiben und ausprobieren. <b>Ausführen</b> zeigt sofort, was R ausgibt. Kaputt machen kannst du nichts: <b>Zurücksetzen</b> holt die Vorlage zurück. Die Tastenkürzel sind dieselben wie in RStudio, etwa für die Pipe <code>%&gt;%</code>.</span></div>
        <div><i aria-hidden="true">ab</i><span><mark className="stelle">Markierte Stellen</mark> passt du an. Sobald du eine geändert hast, verschwindet ihre Markierung. <b>Kopieren</b> nimmt deinen Code mit nach RStudio.</span></div>
        {howToExtra?.map((line, i) => <div key={i}><i aria-hidden="true">•</i><span>{line}</span></div>)}
      </section>

      {jumps.length ? <nav className="sprung" aria-label="Direkt zu den Aufgaben">
        <span><b>Im Seminar?</b> Jedes Thema beginnt mit seiner Grundlage zum Vertiefen der Folien. Wer sie schon kann, springt direkt zur Aufgabe:</span>
        {jumps.map(j => <a key={j.href} href={j.href}>{j.label}</a>)}
      </nav> : null}

      {children}
    </div>
  </div>;
}
