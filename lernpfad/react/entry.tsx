// Lernpfad-Kapitel, React-Teil: Reiter „Verstehen“ (THEMEN aus kapitel/kNN/inhalt.tsx), „Mitnehmen“ und Bausteine in Aufgaben.
// Gebündelt je Kapitel von scripts/build-lernpfad.mjs zu verstehen.js und verstehen.css. Atlas-Code bleibt unverändert.
import { useEffect, useState, useCallback, type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { ChapterStateProvider } from '@atlas/chapter/ChapterContext';
import { THEMEN } from '@kapitel/inhalt';
import * as Inhalt from '@kapitel/inhalt';
import * as Bausteine from '@kapitel/bausteine';
import { Mitnehmen } from './mitnehmen';
import { judgeWithFeedback } from '@atlas/chapter/answers';

// Antwortprüfung des Atlas für die Fragen in den Aufgaben (Engine).
// Ein Kapitel kann in bausteine.tsx eine eigene Prüfung exportieren (PRUEFEN), etwa für eigene Sonderfälle.
const { BAUSTEINE } = Bausteine as unknown as { BAUSTEINE: Record<string, import('./typen').Baustein> };
(window as unknown as { LernpfadPruefen: typeof judgeWithFeedback }).LernpfadPruefen = (Bausteine as unknown as { PRUEFEN?: typeof judgeWithFeedback }).PRUEFEN ?? judgeWithFeedback;
import type { Thema } from './typen';
import '@atlas/chapter/chapter.css';
import './verstehen.css';

const NR: number = (window as unknown as { KMETA: { nr: number } }).KMETA.nr;
const ALLE_KARTEN = THEMEN.flatMap(t => t.karten.map(([id]) => id));

/* ---------- Speicher: welches Thema, welche Karten schon angeschaut ---------- */
const SCHLUESSEL = `k${String(NR).padStart(2, '0')}-verstehen-v1`;
type Stand = { thema: string; gesehen: Record<string, true> };
function lesen(): Stand {
  try { const s = JSON.parse(localStorage.getItem(SCHLUESSEL) || 'null'); if (s && s.thema && THEMEN.some(t => t.id === s.thema)) return { thema: s.thema, gesehen: s.gesehen || {} }; } catch { /* leer */ }
  return { thema: THEMEN[0].id, gesehen: {} };
}
function sichern(s: Stand) { try { localStorage.setItem(SCHLUESSEL, JSON.stringify(s)); } catch { /* egal */ } }

/** Von außen (app.js): zu einem Thema oder einer Karte springen. */
let springen: (ziel?: string) => void = () => {};
(window as unknown as { Verstehen: object }).Verstehen = { zeige: (ziel?: string) => springen(ziel) };

const themaVon = (id?: string) => {
  if (!id) return undefined;
  if (id === 'ueberblick') return 'g5';
  const t = THEMEN.find(x => x.id === id || x.karten.some(([k]) => k === id));
  if (t) return t.id;
  const el = document.getElementById(id)?.closest<HTMLElement>('[data-thema]');
  return el?.dataset.thema;
};
const blitz = (el: Element) => { el.classList.remove('blitz'); void (el as HTMLElement).offsetWidth; el.classList.add('blitz'); };

function Verstehen() {
  const [stand, setStand] = useState<Stand>(lesen);
  const [jetzt, setJetzt] = useState<string>('');
  const panel = document.getElementById('p-verstehen')!;
  useEffect(() => sichern(stand), [stand]);

  // Scrollen erst, wenn das Thema sichtbar ist: Ziel merken, nach dem Rendern anfahren.
  const [ziel, setZiel] = useState<{ id?: string; nr: number }>({ nr: 0 });
  const waehlen = useCallback((thema: string, id?: string) => {
    setStand(s => ({ ...s, thema }));
    setZiel(z => ({ id: id && id !== thema ? id : undefined, nr: z.nr + 1 }));
  }, []);
  useEffect(() => {
    if (!ziel.nr) return;
    const el = ziel.id ? document.getElementById(ziel.id) : null;
    if (el) { el.scrollIntoView({ block: 'start' }); blitz(el); }
    else { const kopf = document.querySelector('.kapitel'); (kopf || panel).scrollIntoView({ block: 'start' }); }
  }, [ziel, panel]);

  useEffect(() => { springen = ziel => waehlen(themaVon(ziel) ?? stand.thema, ziel); }, [waehlen, stand.thema]);

  // Verweise innerhalb von Verstehen auf Karten in einem anderen (verborgenen) Thema: erst das Thema zeigen, dann hinspringen.
  useEffect(() => {
    const klick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a || !panel.contains(a)) return;
      const id = a.getAttribute('href')!.slice(1); const ziel = document.getElementById(id);
      if (!ziel || !panel.contains(ziel)) return;
      const th = themaVon(id); if (!th) return;
      e.preventDefault(); waehlen(th, id);
    };
    document.addEventListener('click', klick);
    return () => document.removeEventListener('click', klick);
  }, [waehlen, panel]);

  // Angeschaut: Das Ende der Karte war im Bild. Aktuell: die letzte Karte, deren Kopf über 35 % der Höhe liegt.
  useEffect(() => {
    let raf = 0;
    const pruefen = () => {
      raf = 0; if (panel.hidden) return;
      const t = THEMEN.find(x => x.id === stand.thema)!; const h = innerHeight; let akt = t.karten[0][0]; const neu: string[] = [];
      for (const [id] of t.karten) {
        const r = document.getElementById(id)?.getBoundingClientRect(); if (!r) continue;
        if (r.top < h * 0.35) akt = id;
        if (r.bottom < h * 0.98 && r.bottom > 0) neu.push(id);
      }
      setJetzt(akt);
      if (neu.some(id => !stand.gesehen[id])) setStand(s => ({ ...s, gesehen: { ...s.gesehen, ...Object.fromEntries(neu.map(id => [id, true as const])) } }));
    };
    const plan = () => { if (!raf) raf = requestAnimationFrame(pruefen); };
    addEventListener('scroll', plan, { passive: true }); addEventListener('resize', plan);
    const mo = new MutationObserver(plan); mo.observe(panel, { attributes: true, attributeFilter: ['hidden'] });
    plan();
    return () => { removeEventListener('scroll', plan); removeEventListener('resize', plan); mo.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, [stand, panel]);

  const i = THEMEN.findIndex(t => t.id === stand.thema), vor = THEMEN[i - 1], nach = THEMEN[i + 1], akt = THEMEN[i];
  const fertig = (t: Thema) => t.karten.filter(([id]) => stand.gesehen[id]).length;
  const rail = document.getElementById('f-verstehen');
  const gesehenZahl = ALLE_KARTEN.filter(id => stand.gesehen[id]).length;

  return <>
    <nav className="v-themen" aria-label="Themen in „Verstehen“">
      <ol>{THEMEN.map(t => {
        const f = fertig(t), alle = f === t.karten.length;
        return <li key={t.id}><button type="button" aria-current={t.id === stand.thema ? 'step' : undefined} onClick={() => waehlen(t.id)}>
          <span className="st s c7" aria-hidden="true">{t.n}</span><span>{t.kurz}</span>{alle ? <span className="v-haken" aria-label="angeschaut">✓</span> : null}
        </button></li>;
      })}</ol>
    </nav>

    <div className="chapter v-wurzel">
      {THEMEN.map(t => <div key={t.id} data-thema={t.id} hidden={t.id !== stand.thema}><t.Inhalt /></div>)}
    </div>

    <nav className="v-weiter" aria-label="Weiterblättern">
      {vor ? <button type="button" className="v-zurueck" onClick={() => waehlen(vor.id)}>← {vor.kurz}</button> : <span />}
      {akt.aufgabe ? <a className="v-zur-aufgabe" href={`#a${akt.aufgabe}`}>Zur Aufgabe {akt.aufgabe} →</a> : null}
      {nach ? <button type="button" className="v-vor" onClick={() => waehlen(nach.id)}>Weiter: {nach.kurz} →</button> : <a className="v-vor" href="#p-mitnehmen" data-tab="mitnehmen">Weiter: Mitnehmen →</a>}
    </nav>

    {rail ? createPortal(<>
      <h2>Verstehen</h2>
      <div className="balken" role="progressbar" aria-label="Angeschaute Karten" aria-valuemin={0} aria-valuemax={ALLE_KARTEN.length} aria-valuenow={gesehenZahl}><div style={{ width: `${gesehenZahl / ALLE_KARTEN.length * 100}%` }} /></div>
      <p className="f-zahl">{gesehenZahl} von {ALLE_KARTEN.length} Karten angeschaut</p>
      <ol className="r-liste">{THEMEN.map(t => {
        const f = fertig(t), alle = f === t.karten.length, an = t.id === stand.thema;
        return <li key={t.id} className={`r-aufgabe${an ? ' aktiv' : ''}${alle ? ' komplett' : ''}`}>
          <a href={`#${t.id}`} aria-current={an ? 'location' : undefined} onClick={e => { e.preventDefault(); waehlen(t.id); }}>
            <span className="st c7" aria-hidden="true">{t.n}</span><span>{t.titel}</span><small>{alle ? '✓' : `${t.minuten} min`}</small>
            <span className="punkte" aria-hidden="true">{t.karten.map(([id]) => <span key={id} className={stand.gesehen[id] ? 'f' : ''} />)}</span>
          </a>
          {an ? <ol className="r-schritte">{t.karten.map(([id, titel]) => <li key={id} className={`${stand.gesehen[id] ? 'f' : ''}${id === jetzt ? ' jetzt' : ''}`}>
            <a href={`#${id}`} aria-current={id === jetzt ? 'step' : undefined} onClick={e => { e.preventDefault(); waehlen(t.id, id); }}>{titel}<span className="sr-only">{stand.gesehen[id] ? ', angeschaut' : ''}</span></a>
          </li>)}</ol> : null}
        </li>;
      })}</ol>
      <div className="r-mehr"><a href="#p-aufgaben" data-tab="aufgaben">← Zurück zu den Aufgaben</a><a href="#p-mitnehmen" data-tab="mitnehmen">Mitnehmen: Wichtigstes, Selbsttest, Lernjournal, Skript</a></div>
    </>, rail) : null}
  </>;
}

createRoot(document.getElementById('p-verstehen')!).render(<ChapterStateProvider sessionId={NR}><Verstehen /></ChapterStateProvider>);
createRoot(document.getElementById('p-mitnehmen')!).render(<ChapterStateProvider sessionId={NR}><Mitnehmen /></ChapterStateProvider>);

/* Bausteine in Aufgaben: Platzhalter <div data-baustein="Name" data-schritt="id"> aus der Engine bekommen ihre React-Komponente. */
type Fertig = { K4Vorlage?: { fertig(id: string): void } };
document.querySelectorAll<HTMLElement>('[data-baustein]').forEach(el => {
  const B = BAUSTEINE[el.dataset.baustein!]; if (!B) return;
  const id = el.dataset.schritt!;
  createRoot(el).render(<ChapterStateProvider sessionId={NR}><div className="chapter v-wurzel baustein-wurzel"><B fertig={() => (window as unknown as Fertig).K4Vorlage?.fertig(id)} /></div></ChapterStateProvider>);
});

/* Bilder aus „Verstehen“ für die ausgebauten „?“-Fenster der Aufgaben: inhalt.tsx exportiert optional BILDER = { Name: Komponente }.
   Die Engine ruft LernpfadBild.zeige(el, name) beim Öffnen und die zurückgegebene Funktion beim Schließen. */
const BILDER = (Inhalt as unknown as { BILDER?: Record<string, ComponentType> }).BILDER ?? {};
(window as unknown as { LernpfadBild: object }).LernpfadBild = {
  zeige(el: HTMLElement, name: string) {
    const B = BILDER[name]; if (!B) return null;
    const root = createRoot(el);
    root.render(<ChapterStateProvider sessionId={NR}><div className="chapter v-wurzel d-wurzel"><B /></div></ChapterStateProvider>);
    return () => root.unmount();
  },
};
