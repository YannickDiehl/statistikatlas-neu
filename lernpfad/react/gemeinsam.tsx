// Gemeinsame Bausteine für den Reiter „Verstehen“ aller Kapitel (Muster aus Kapitel 4, siehe kapitel/k04/KONZEPT.md).
import { useEffect, useRef, type ReactNode } from 'react';
import { HeadingLevel } from '@atlas/chapter/blocks/level';

/** Verweis im Kartenkopf zurück in die Aufgabe. */
export const Bezug = ({ href, children }: { href: string; children: ReactNode }) => <a className="v-bezug" href={href}>{children}</a>;
/** Rhetorische Frage als Zwischenzeile, die direkt danach beantwortet wird. */
export const Frage = ({ children }: { children: ReactNode }) => <p className="v-frage">{children}</p>;
export const Leseart = ({ children }: { children: ReactNode }) => <div className="leseart"><p><b className="t">So liest du das:</b> {children}</p></div>;

export type Weg = [schritt: string, href: string, was: string, karte: string];

/** Kopf eines Abschnitts: Frage der Aufgabe und der Weg durch ihre Schritte, jeder Schritt mit seiner Karte. */
export function Abschnitt({ id, n, titel, frage, ziel, weg, children }: { id: string; n: number; titel: string; frage: string; ziel: string; weg: Weg[]; children: ReactNode }) {
  return <section className="grund-block v-abschnitt" id={id} aria-labelledby={`${id}-h`}>
    <div className="g-kopf">
      <span className="st m c7" aria-hidden="true">{n}</span>
      <div><div className="ueber">{`Verstehen zu Aufgabe ${n}`}</div><h4 id={`${id}-h`}>{titel}</h4></div>
      <a className="zur" href={`#a${n}`}>{`Zur Aufgabe ${n} →`}</a>
    </div>
    <p className="g-intro"><b>Die Frage der Aufgabe:</b> {frage} <b>Am Ende hast du</b> {ziel}</p>
    <nav className="v-weg" aria-label={`Der Weg durch Aufgabe ${n}`}>
      <p className="v-weg-titel">Der Weg durch die Aufgabe</p>
      <ol>{weg.map(([schritt, href, was, karte]) => <li key={href + karte}>
        <a href={href} className="v-weg-schritt">{schritt}</a><span>{was}</span><a href={`#${karte}`} className="v-weg-karte">erklärt ↓</a>
      </li>)}</ol>
    </nav>
    <HeadingLevel.Provider value={5}>{children}</HeadingLevel.Provider>
  </section>;
}


/** Ein Bild aus den Aufgaben (daten.js), mit Bildunterschrift aus app.js. */
export function AufgabenBild({ k }: { k: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { (window as unknown as { K4Vorlage?: { bild(el: HTMLElement, k: string): void } }).K4Vorlage?.bild(ref.current!, k); }, [k]);
  return <div className="v-bild" ref={ref} />;
}

/** Code nur zum Lesen (Vorlage aus daten.js, mit Kopieren). */
export function Code({ k }: { k: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { (window as unknown as { K4Vorlage?: { vorlage(el: HTMLElement, k: string): void } }).K4Vorlage?.vorlage(ref.current!, k); }, [k]);
  return <div className="v-vorlage" ref={ref} />;
}
