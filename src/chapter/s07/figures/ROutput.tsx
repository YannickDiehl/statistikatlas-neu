import type { ReactNode } from 'react';
import {
  AGE_MODE, AGE_MODE_TUKEY, DW15_SEX, type AnovaOut, type TestRow, type TTestOut,
} from '../content';
import { padL, padR, r } from '../format';

/* Nachgebaute R-Ausgaben mit hervorgehobenen Stellen und nummerierten Marken. Kein <pre> und kein Bild:
 * Die Zeilen sind Text, den auch ein Screenreader liest; die Legende darunter erklärt jede Marke in Worten. */

export type Hl = 'mean' | 'result' | 'box';
export type Seg = string | { t: string; k?: Hl; mark?: number };
export type OutLine = { segs: Seg[]; cls?: 'frame' | 'dim' | 'result' | 'head'; mark?: number };

const CIRCLED = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨'];

/** A numbered mark: circled number on screen, „Marke n“ for screen readers. */
export function Mark({ n }: { n: number }) {
  return <span className="s07-marke"><span aria-hidden="true">{CIRCLED[n - 1]}</span><span className="sr-only">{`Marke ${n}`}</span></span>;
}

function seg(s: Seg, i: number) {
  if (typeof s === 'string') return <span key={i}>{s}</span>;
  return <span key={i} className={s.k ? `hl-${s.k}` : undefined}>{s.t}{s.mark ? <Mark n={s.mark} /> : null}</span>;
}

/** R output (lines of segments) with a legend; `label` names the output for screen readers. */
export function ROutput({ id, label, lines, legend, after }: { id: string; label: string; lines: OutLine[]; legend: ReactNode[]; after?: ReactNode }) {
  return <figure className="s07-raus-bild" id={id}>
    <div className="s07-raus" role="group" aria-label={label} tabIndex={0}>
      {lines.map((l, i) => <div key={i} className={`z${l.cls ? ` ${l.cls}` : ''}`}>{l.segs.map(seg)}{l.mark ? <>{'  '}<Mark n={l.mark} /></> : null}</div>)}
    </div>
    <figcaption>
      <ol className="s07-legende">{legend.map((x, i) => <li key={i}><Mark n={i + 1} /> {x}</li>)}</ol>
      {after}
    </figcaption>
  </figure>;
}

/* ---------- t-Test (Bild R2) ---------- */

const testCells = (row: TestRow) => [padL(r(row.t), 8), padL(r(row.df, Number.isInteger(row.df) ? 0 : 3), 10), padL(row.p, 7), padL(r(row.diff), 12), padL(r(row.se), 10), padL(r(row.lo), 14), padL(r(row.hi), 14)];

/** Lines of `t_test(…) %>% summary()`, shortened to what the legend needs. */
export function tTestLines(out: TTestOut, group: string, variable: string): OutLine[] {
  const [a, b] = out.groups;
  const w = Math.max(group.length, a.label.length, b.label.length) + 2;
  const groupRow = (g: TTestOut['groups'][0]): OutLine => ({ segs: [`  ${padR(g.label, w)}`, { t: padL(g.n, 4), k: 'mean' }, { t: padL(r(g.mean), 8), k: 'mean' }, padL(r(g.sd), 16), padL(r(g.se), 17)] });
  const s = out.student ? testCells(out.student) : null, wl = testCells(out.welch);
  return [
    { segs: [{ t: `- Groups compared: ${a.label} vs. ${b.label}`, k: 'box' }], cls: 'frame', mark: 1 },
    { segs: ['Weighted Group Statistics:'], cls: 'head' },
    { segs: [`  ${padR(group, w)}`, '   N', '    Mean', '  Std. Deviation', '  Std. Error Mean'] },
    { ...groupRow(a), mark: 2 },
    groupRow(b),
    { segs: ['Weighted Independent Samples Test:'], cls: 'head' },
    { segs: [`  ${padR('', 27)}`, padL('t', 8), padL('df', 10), padL('p', 7), padL('Mean Diff.', 12), padL('SE Diff.', 10), padL('95% CI Lower', 14), padL('95% CI Upper', 14)] },
    ...(s ? [{ segs: [`  ${padR('Equal variances assumed', 27)}`, ...s, '  ***'], cls: 'dim' as const }] : []),
    {
      segs: [`  ${padR('Equal variances not assumed', 27)}`, { t: wl[0], k: 'box', mark: 4 }, wl[1], { t: wl[2], k: 'box', mark: 5 },
        { t: wl[3], k: 'box', mark: 6 }, wl[4], { t: wl[5] + wl[6], k: 'box' }, '  ***'],
      cls: 'result', mark: 3,
    },
    { segs: ['Effect Sizes:'], cls: 'head' },
    { segs: ['  Variable', "  Cohen's d", "  Hedges' g", "  Glass' Delta", '  Magnitude'] },
    { segs: [`  ${padR(variable, 8)}`, padL(r(out.effect.d), 11), { t: padL(r(out.effect.g), 11), k: 'box' }, padL(r(out.effect.glass), 14), { t: padL(out.effect.magnitude, 11), k: 'box' }], mark: 7 },
  ];
}

/** Bild R2 „Die Ausgabe lesen“: dw15 by geschlecht, seven marks. */
export function ReadTTest() {
  const out = DW15_SEX;
  return <ROutput id="bild-r2" label="Nachgebaute R-Ausgabe des t-Tests: Arbeitsstunden von Männern und Frauen, gekürzt" lines={tTestLines(out, 'geschlecht', 'dw15')}
    legend={[
      <><b>Groups compared:</b> Reihenfolge der Gruppen. R rechnet immer erste minus zweite Gruppe, hier Mann minus Frau.</>,
      <><b>N und Mean:</b> Männer 1.530, im Mittel 41,6 Stunden; Frauen 1.427, im Mittel 33,6 Stunden. N ist hier die gewichtete Zahl.</>,
      <><b>Die Zeile „Equal variances not assumed“</b> (Welch-Test) liest du. Warum, steht in <a href="#k2c">Grundlage 2c</a>. Die Kurzfassung ohne <code>summary()</code> zeigt genau diese Zeile.</>,
      <><b>t:</b> 22,988. Je weiter weg von 0, desto deutlicher hebt sich der Unterschied vom Zufall ab (<a href="#k1b">Grundlage 1b</a>).</>,
      <><b>p:</b> „&lt;.001“ heißt kleiner als 0,001 (<a href="#k1c">Grundlage 1c</a>). Die Sterne rechts sagen dasselbe: *** heißt p &lt; 0,001.</>,
      <><b>Mean Diff. und 95-%-Konfidenzintervall:</b> Männer arbeiten im Mittel 7,99 Stunden mehr; plausibel sind 7,31 bis 8,67 Stunden.</>,
      <><b>Hedges&apos; g:</b> 0,85, „large“: ein großer Unterschied (<a href="#k1d">Grundlage 1d</a>).</>,
    ]} />;
}

/* ---------- ANOVA (Aufgabe 3, Schritt 1) ---------- */

export function anovaLines(out: AnovaOut, group: string, variable: string): OutLine[] {
  const w = Math.max(group.length, ...out.groups.map(g => g.label.length)) + 2;
  return [
    { segs: ['Weighted Descriptive Statistics:'], cls: 'head', mark: 1 },
    { segs: [`  ${padR(group, w)}`, '   N', '    Mean', '  Std. Deviation', '  Std. Error', '  95% CI Lower', '  95% CI Upper'] },
    ...out.groups.map((g): OutLine => ({ segs: [`  ${padR(g.label, w)}`, padL(g.n, 4), { t: padL(r(g.mean), 8), k: 'mean' }, padL(r(g.sd), 16), padL(r(g.se), 12), padL(r(g.lo), 14), padL(r(g.hi), 14)] })),
    { segs: ['Weighted ANOVA Results:'], cls: 'head' },
    { segs: [padR('', 16), padL('Sum of Squares', 16), padL('df', 6), padL('Mean Square', 13), padL('F', 9), padL('Sig', 7)] },
    { segs: [padR('  Between Groups', 16), padL(r(out.between.ss), 16), padL(out.between.df, 6), padL(r(out.between.ms), 13), { t: padL(r(out.between.F), 9), k: 'result' }, { t: padL(out.between.p, 7), k: 'box' }, '  ***'], mark: 2 },
    { segs: [padR('  Within Groups', 16), padL(r(out.within.ss), 16), padL(out.within.df, 6), padL(r(out.within.ms), 13)] },
    { segs: ['Robust Tests of Equality of Means:'], cls: 'head' },
    { segs: ['  Welch', padL(r(out.welch.F), 11), padL(out.welch.df1, 5), padL(r(out.welch.df2), 10), padL(out.welch.p, 7), '  ***'], mark: 3 },
    { segs: ['Effect Sizes:'], cls: 'head' },
    { segs: ['  Variable', '  Eta Squared', '  Epsilon Squared', '  Omega Squared', '  Magnitude'] },
    { segs: [`  ${padR(variable, 8)}`, { t: padL(r(out.effect.eta2), 13), k: 'box' }, padL(r(out.effect.epsilon2), 17), padL(r(out.effect.omega2), 15), padL(out.effect.magnitude, 11)], mark: 4 },
  ];
}

/** Aufgabe 3, Schritt 1: the output of the template as it starts (age by mode), so nothing is given away. */
export function ReadAnova() {
  return <ROutput id="bild-a3" label="Nachgebaute R-Ausgabe der ANOVA: Alter nach Erhebungsweg, gekürzt" lines={anovaLines(AGE_MODE, 'mode', 'age')}
    legend={[
      <>Gruppen mit N, Mittelwert (rot), Standardabweichung (Streuung prüfen) und Intervall.</>,
      <>Zeile „Between Groups“: F (türkis) und p (Sig).</>,
      <>Welch-ANOVA: dieselbe Frage ohne Annahme gleicher Streuung.</>,
      <>Eta Squared: η².</>,
    ]}
    after={<p className="hilfe-zeile">Mit deinen Variablen stehen hier fünf Wohnorte und andere Zahlen.</p>} />;
}

/* ---------- Tukey (Bild 3c-2) ---------- */

export function ReadTukey({ after }: { after?: ReactNode }) {
  const lines: OutLine[] = [
    { segs: [{ t: '  (I) - (J)  ', k: 'box', mark: 1 }, padL('Mean Difference (I-J)', 23), padL('Std. Error', 12), { t: padL('p-value', 9), k: 'result', mark: 2 }, { t: padL('Lower CI', 10) + padL('Upper CI', 10), k: 'box', mark: 3 }] },
    ...AGE_MODE_TUKEY.map((t): OutLine => ({ segs: [`  ${padR(t.pair, 11)}`, padL(r(t.diff), 23), padL(r(t.se), 12), { t: padL(t.p, 9), k: 'result' }, padL(r(t.lo), 10) + padL(r(t.hi), 10), '  ***'] })),
  ];
  return <ROutput id="bild-3c2" label="Nachgebaute R-Ausgabe des Tukey-Tests: Alter nach Erhebungsweg" lines={lines}
    legend={[<>Spalte „(I) - (J)“: erste minus zweite Gruppe.</>, <>p-value: korrigiert für drei Vergleiche.</>, <>Lower CI und Upper CI: Enthält das Intervall die 0? Hier nie.</>]}
    after={after} />;
}
