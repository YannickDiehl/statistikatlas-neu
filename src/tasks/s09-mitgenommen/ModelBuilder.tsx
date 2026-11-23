import { useMemo, useState, type CSSProperties } from 'react';
import { de } from '../kit/numbers';
import { CAT, CAT_DARK, lighten, ROLE } from '../kit/palette';
import {
  BUILDER_BYS, BUILDER_CODES, BUILDER_HEALTH_LABEL, BUILDER_HEALTH_VAR, BUILDER_HEALTHS, BUILDER_VARS, HEALTH_CODES,
  type BuilderBy, type BuilderCode, type BuilderHealth, type HealthCode,
} from './content';
import { builderHeights, builderModel, ghostFit, termBefore, type BuilderCell, type BuilderData, type BuilderModel, type BuilderTerm } from './domain';

/** Farben der Stücke: Konstante türkis wie jedes Modellergebnis (und wie die Bauklötze in Schritt 4), je Gruppe eine eigene Farbe
 *  ohne Rollenfarbe, Gesundheit rosa, Interaktion gestreift aus Gruppe und Gesundheit. */
const GROUP_FILL = [CAT[2], CAT[4], CAT[8]], GROUP_DARK = [CAT_DARK[2], CAT_DARK[4], CAT_DARK[8]];
const HEALTH_FILL = CAT[7], HEALTH_DARK = CAT_DARK[7];
const MAX = 10;
const TICKS = [0, 2, 4, 6, 8, 10];
const pct = (v: number) => `${(Math.max(0, Math.min(MAX, v)) / MAX) * 100}%`;
/** Die Rechnung eines Balkens: „7,371 (Konstante) + 0,542 (schicht_2) − 1,330 (gesundheit_2) = 6,96“. */
const sum = (c: BuilderCell) => `${c.parts.map((t, i) => (i === 0 ? `${de(t.b, 3)} (Konstante)` : `${t.b < 0 ? '−' : '+'} ${de(Math.abs(t.b), 3)} (${t.name})`)).join(' ')} = ${de(c.fit, 2)}`;

export type Setting = { health: BuilderHealth; ref: BuilderCode | null; refH: HealthCode | null };
const complete = (s: Setting) => s.ref !== null && (s.health === 'ohne' || s.refH !== null);

function termColors(t: BuilderTerm): { fill: string; dark: string; background: string } {
  if (t.kind === 'const') return { fill: ROLE.modelLight, dark: ROLE.model, background: ROLE.modelLight };
  if (t.kind === 'health') return { fill: HEALTH_FILL, dark: HEALTH_DARK, background: HEALTH_FILL };
  const fill = GROUP_FILL[t.g! - 1], dark = GROUP_DARK[t.g! - 1];
  if (t.kind === 'group') return { fill, dark, background: fill };
  return { fill, dark, background: `repeating-linear-gradient(135deg, ${fill} 0 6px, ${HEALTH_FILL} 6px 12px)` };
}

function segmentStyle(t: BuilderTerm, from: number): CSSProperties {
  const lo = Math.min(from, from + t.b), hi = Math.max(from, from + t.b), c = termColors(t);
  const neg = t.b < 0;
  return {
    bottom: pct(lo), height: `calc(${pct(hi)} - ${pct(lo)})`,
    background: neg ? (t.kind === 'inter' ? `repeating-linear-gradient(135deg, ${lighten(c.fill, 0.55)} 0 6px, ${lighten(HEALTH_FILL, 0.55)} 6px 12px)` : lighten(c.fill, 0.55)) : c.background,
    borderColor: c.dark, borderStyle: neg ? 'dashed' : 'solid',
  };
}

/** Wofür ein Koeffizient steht, in Worten. */
function termMeaning(t: BuilderTerm, by: BuilderBy): string {
  const v = BUILDER_VARS[by];
  if (t.kind === 'const') return 'Konstante';
  if (t.kind === 'group') return v.short[t.g! - 1];
  if (t.kind === 'health') return `Gesundheit ${BUILDER_HEALTH_VAR.short[t.h! - 1]}`;
  return `${v.short[t.g! - 1]} und Gesundheit ${BUILDER_HEALTH_VAR.short[t.h! - 1]} zusammen`;
}

const cellName = (by: BuilderBy, c: Pick<BuilderCell, 'g' | 'h'>) =>
  `${BUILDER_VARS[by].long[c.g - 1]}${c.h ? `, ${BUILDER_HEALTH_VAR.long[c.h - 1]}` : ''}`;

/** Einstieg Sitzung 10: ein Regressionsmodell mit Dummies auf echten ALLBUS-Zahlen selbst einstellen. Jeder Balken ist die
 *  Vorhersage einer Gruppe, gebaut aus Konstante + B. Referenzgruppe wechseln, Gesundheit als Kontrolle (+) oder Interaktion (*)
 *  dazunehmen – und sehen, welche Stücke sich verschieben. Gestrichelt: die Oberkante vor der letzten Änderung. */
export function ModelBuilder({ data, start }: { data: BuilderData; start?: { by?: BuilderBy; now?: Setting; before?: Setting } }) {
  // start: nur für Tests (ein eingestellter Zustand); im Lernpfad beginnt alles offen.
  const [by, setBy] = useState<BuilderBy>(start?.by ?? 'schicht');
  const [now, setNow] = useState<Setting>(start?.now ?? { health: 'ohne', ref: null, refH: null });
  const [before, setBefore] = useState<Setting | null>(start?.before ?? null);
  /** Der Balken unter dem Zeiger bzw. mit dem Fokus: seine Rechnung steht unter der Grafik. */
  const [pointed, setPointed] = useState<string | null>(null);
  const change = (patch: Partial<Setting>) => {
    const next = { ...now, ...patch };
    if (next.health === now.health && next.ref === now.ref && next.refH === now.refH) return;
    setBefore(now); setNow(next);
  };
  const chooseBy = (b: BuilderBy) => { if (b === by) return; setBy(b); setBefore(null); setNow({ ...now, ref: null }); };
  const reset = () => { setBy('schicht'); setNow({ health: 'ohne', ref: null, refH: null }); setBefore(null); };

  const v = BUILDER_VARS[by];
  const heights = useMemo(() => builderHeights(data, by, now.health), [data, by, now.health]);
  const model = useMemo(() => (complete(now) ? builderModel(data, { by, health: now.health, ref: now.ref!, refH: now.refH ?? 1 }) : null), [data, by, now]);
  const prevHeights = useMemo(() => (before ? builderHeights(data, by, before.health) : null), [data, by, before]);
  const prevModel = useMemo(() => (before && complete(before) ? builderModel(data, { by, health: before.health, ref: before.ref!, refH: before.refH ?? 1 }) : null), [data, by, before]);
  const changed = by !== 'schicht' || now.health !== 'ohne' || now.ref !== null || now.refH !== null;

  if (!heights) return <p className="sandbox-note">Mit dieser Datei lässt sich das Modell nicht schätzen – eine Gruppe ist leer.</p>;
  const cells = (model ?? heights).cells;
  const withHealth = now.health !== 'ohne';
  const pickCell = (c: BuilderCell) => change(c.h === null ? { ref: c.g } : { ref: c.g, refH: c.h });

  return <div className="s09-mb">
    <div className="s09-mb-controls">
      <p className="task-prompt">Wonach teilst du die Befragten ein?</p>
      <div className="sandbox-chips" role="group" aria-label="Gruppenvariable">
        {BUILDER_BYS.map(b => <button key={b} type="button" aria-pressed={by === b} onClick={() => chooseBy(b)}>{BUILDER_VARS[b].title}</button>)}
      </div>
      <p className="task-prompt">Welche Gruppe ist die Referenzgruppe?</p>
      <div className="sandbox-chips" role="group" aria-label={`Referenzgruppe ${v.title}`}>
        {BUILDER_CODES.map(g => <button key={g} type="button" aria-pressed={now.ref === g} onClick={() => change({ ref: g })}>
          <i className="s09-mb-swatch" style={{ background: GROUP_FILL[g - 1], borderColor: GROUP_DARK[g - 1] }} aria-hidden="true" />{v.short[g - 1]}
        </button>)}
      </div>
      <p className="task-prompt">Kommt die Gesundheit ins Modell?</p>
      <div className="sandbox-chips" role="group" aria-label="Gesundheit im Modell">
        {BUILDER_HEALTHS.map(h => <button key={h} type="button" aria-pressed={now.health === h} onClick={() => change({ health: h })}>{BUILDER_HEALTH_LABEL[h]}</button>)}
      </div>
      {withHealth && <>
        <p className="task-prompt">Welche Gesundheit ist die Referenz?</p>
        <div className="sandbox-chips" role="group" aria-label="Referenz Gesundheit">
          {HEALTH_CODES.map(h => <button key={h} type="button" aria-pressed={now.refH === h} onClick={() => change({ refH: h })}>{BUILDER_HEALTH_VAR.short[h - 1]}</button>)}
        </div>
      </>}
      <p className="s09-mb-formula" aria-live="polite">
        {model
          ? <>Formel in R: <code>{model.formula}</code></>
          : now.ref === null ? 'Wähl eine Referenzgruppe – mit den Knöpfen oder mit einem Klick auf einen Balken.' : 'Wähl auch bei der Gesundheit eine Referenz.'}
      </p>
      <button type="button" className="s09-mb-reset" disabled={!changed} onClick={reset}>Zurück zum Anfang</button>
    </div>

    <figure className="s09-mb-view">
      <figcaption>Lebenszufriedenheit (<code>ls01</code>, 0 = ganz unzufrieden, 10 = ganz zufrieden): Vorhersage je Gruppe, gewichtet</figcaption>
      <div className="s09-mb-plot">
        <div className="s09-mb-axis" aria-hidden="true">{TICKS.map(t => <span key={t} style={{ bottom: pct(t) }}>{t}</span>)}</div>
        <div className="s09-mb-area">
          <div className="s09-mb-grid" aria-hidden="true">{TICKS.map(t => <i key={t} style={{ bottom: pct(t) }} />)}</div>
          {BUILDER_CODES.map(g => <div key={g} className="s09-mb-group">
            <div className="s09-mb-bars">
              {cells.filter(c => c.g === g).map(c => {
                const ghost = ghostFit(prevHeights, c);
                let from = 0;
                const story = model ? `Vorhersage ${sum(c)}` : `Vorhersage ${de(c.fit, 2)}`;
                return <button key={`${c.g}-${c.h}`} type="button" className="s09-mb-bar" title={story}
                  aria-label={`${cellName(by, c)}: ${story}. Als Referenz wählen.`} onClick={() => pickCell(c)}
                  onMouseEnter={() => setPointed(`${c.g}-${c.h}`)} onFocus={() => setPointed(`${c.g}-${c.h}`)}>
                  {model
                    ? c.parts.map(t => { const s = segmentStyle(t, from); from += t.b; return <i key={t.kind} className={`s09-mb-seg${t.b < 0 ? ' neg' : ''}`} style={s} />; })
                    : <i className="s09-mb-seg whole" style={{ bottom: 0, height: pct(c.fit) }} />}
                  {ghost !== null && <i className="s09-mb-ghost" style={{ bottom: pct(ghost) }} />}
                  <i className="s09-mb-top" style={{ bottom: pct(c.fit) }} />
                  <span className="s09-mb-value" style={{ bottom: pct(c.fit) }}>{de(c.fit, 2)}</span>
                </button>;
              })}
            </div>
          </div>)}
        </div>
      </div>
      <div className="s09-mb-xlabels" aria-hidden="true">
        {BUILDER_CODES.map(g => <div key={g} className="s09-mb-group">
          {withHealth && <span className="s09-mb-hlabels">{HEALTH_CODES.map(h => <span key={h} className={model && model.spec.refH === h ? 'ref' : undefined}>{BUILDER_HEALTH_VAR.short[h - 1]}</span>)}</span>}
          <strong style={{ color: GROUP_DARK[g - 1] }}>{v.short[g - 1]}</strong>
          {model && model.spec.ref === g && <small>Referenz</small>}
        </div>)}
      </div>
      {model && <p className="s09-mb-sum" aria-hidden="true">{(() => {
        const c = model.cells.find(x => `${x.g}-${x.h}` === pointed);
        return c ? <><strong>{cellName(by, c)}:</strong> {sum(c)}</> : 'Zeig auf einen Balken: Dann steht hier, wie sich seine Höhe zusammensetzt.';
      })()}</p>}
      <p className="task-field-help">Jeder Balken ist ein Knopf: Ein Klick macht ihn zur Referenz. Helle, gestrichelte Stücke sind negative B – sie ziehen vom Balken ab. {before ? 'Die graue gestrichelte Linie zeigt, wo die Oberkante vor deiner letzten Änderung lag.' : ''}</p>

      {model
        ? <div className="s09-scroll" tabIndex={0} role="region" aria-label="Koeffizienten des Modells">
          <table className="s09-table s09-mb-coefs">
            <caption>Wie in der Tabelle Coefficients von R{prevModel ? ', daneben der Wert vor deiner letzten Änderung' : ''}</caption>
            <thead><tr><th scope="col">Zeile</th><th scope="col">B</th>{prevModel && <th scope="col">vorher</th>}</tr></thead>
            <tbody>{model.terms.map(t => {
              const c = termColors(t), b0 = termBefore(prevModel, t.name);
              return <tr key={t.name}>
                <th scope="row"><i className="s09-mb-swatch" style={{ background: c.background, borderColor: c.dark }} aria-hidden="true" /><code>{t.name}</code><small> · {termMeaning(t, by)}</small></th>
                <td>{de(t.b, 3)}</td>
                {prevModel && <td className="s09-mb-before">{b0 === null ? '–' : de(b0, 3)}</td>}
              </tr>;
            })}</tbody>
          </table>
        </div>
        : <p className="sandbox-note">Sobald die Referenzen gewählt sind, zerlegt das Modell jeden Balken in die Konstante und die B.</p>}
      <p className="task-field-help">Alle Modelle rechnen mit denselben {(model?.n ?? heights.n).toLocaleString('de-DE')} Befragten: gültige Angaben bei Lebenszufriedenheit, {v.title} und Gesundheit (<code>hs01</code>: gut = sehr gut oder gut). {by === 'schicht' ? 'Schicht nach eigener Einstufung (id02): untere = Unter- oder Arbeiterschicht, obere = obere Mittel- oder Oberschicht.' : ''}</p>
    </figure>
  </div>;
}
