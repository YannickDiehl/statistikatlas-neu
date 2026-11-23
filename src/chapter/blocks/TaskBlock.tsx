import type { ReactNode } from 'react';
import { Heading, HeadingLevel, useHeadingLevel } from './level';

/** A task (h4) with guiding question, goal and link back to its foundation. Headings inside are h5. */
export function TaskBlock({ id, n, title, required, kind = 'adapt', question, goal, foundationHref, basis, children }: {
  id: string;
  n: number;
  title: ReactNode;
  required: boolean;
  /** Colour of the „Pflicht“/„Zusatz“ label: adapt (code) or interpret, as in the prototype. */
  kind?: 'adapt' | 'interpret';
  question: ReactNode;
  goal: ReactNode;
  foundationHref: string;
  /** Optional line under the goal: „Grundlage: …“ with links. */
  basis?: ReactNode;
  children?: ReactNode;
}) {
  return <section className="karte aufgabe" id={id} aria-labelledby={`${id}-h`}>
    <div className="karte-kopf">
      <span className="st m c7" aria-hidden="true">{`A${n}`}</span>
      <h4 id={`${id}-h`}>{`Aufgabe ${n}: `}{title}</h4>
      <span className={`art ${kind === 'interpret' ? 'deuten' : 'anpassen'}`}>{required ? 'Pflicht' : 'Zusatz'}</span>
    </div>
    <a className="zur-grund" href={foundationHref}>{`↑ Grundlage ${n} nachlesen`}</a>
    <p className="leitfrage">{question}</p>
    <div className="ziel">
      <span className="st s c7" aria-hidden="true"></span>
      <div><p><b>Ziel:</b> {goal}</p>{basis ? <p className="grundlage">Grundlage: {basis}</p> : null}</div>
    </div>
    <HeadingLevel.Provider value={5}>{children}</HeadingLevel.Provider>
  </section>;
}

/** Numbered steps of a task; children are `<li>` elements. */
export function Steps({ children }: { children?: ReactNode }) {
  return <ol className="schritte">{children}</ol>;
}

/** „Ohne Grafik lösbar:“ line (solution path for screen readers). */
export function NoGraphic({ children }: { children?: ReactNode }) {
  return <p className="ohne-grafik"><b>Ohne Grafik lösbar:</b> {children}</p>;
}

/** Green box „Fürs Plenum“. */
export function Plenum({ children }: { children?: ReactNode }) {
  const level = useHeadingLevel();
  return <div className="box-gruen plenum"><Heading level={level}>Fürs Plenum</Heading>{children}</div>;
}
