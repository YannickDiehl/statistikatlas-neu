// Sitzung 10: formulas as building blocks (R1 Zeilenbild, B2, B3, B9, B11). Static HTML; each has role="img" with its text version.
import type { ReactNode } from 'react';

type Piece = { text: ReactNode; note?: string; tone?: 'gray' | 'blue' | 'green' | 'orange' | 'op' | 'new' | 'code'; ring?: boolean };

function Row({ pieces, className = '' }: { pieces: Piece[]; className?: string }) {
  return <div className={`s10-bausteine ${className}`}>
    {pieces.map((p, i) => <span key={i} className={`bs ${p.tone ?? 'op'}${p.ring ? ' ring' : ''}`}><b>{p.text}</b>{p.note ? <small>{p.note}</small> : null}</span>)}
  </div>;
}

export const R1_LINE_TEXT = 'ls01, die abhängige Variable: was vorhergesagt wird. Tilde: wird vorhergesagt aus. age, Prädiktor 1. Plus: und. gesund, Prädiktor 2. Komma, weights gleich wghtpew: gewichtet, kennst du aus Sitzung 6.';

/** Karte R1: the formula `ls01 ~ age + gesund, weights = wghtpew` read piece by piece. */
export function FormulaLine() {
  return <div className="lesehilfe s10-zeile" role="img" aria-label={R1_LINE_TEXT}>
    <span><b style={{ background: '#FFE3D2' }}>ls01</b><small>abhängige Variable: was vorhergesagt wird</small></span>
    <span><b style={{ background: 'var(--gelbh)' }}>~</b><small>wird vorhergesagt aus</small></span>
    <span><b style={{ background: 'var(--blauh)' }}>age</b><small>Prädiktor 1</small></span>
    <span><b style={{ background: 'var(--gelbh)' }}>+</b><small>und</small></span>
    <span><b style={{ background: 'var(--gruenh)' }}>gesund</b><small>Prädiktor 2</small></span>
    <span><b style={{ background: '#E5E9EE' }}>, weights = wghtpew</b><small>gewichtet, kennst du aus Sitzung 6</small></span>
  </div>;
}

export const B2_TEXT = 'Vorhersage gleich Konstante 3,095 plus 0,024 mal Alter plus 0,861 mal Gesundheit. Frau A, 40 Jahre, Gesundheit 4: 3,095 plus 0,96 plus 3,444 ergibt 7,50. Herr B, 50 Jahre, Gesundheit 4: 3,095 plus 1,20 plus 3,444 ergibt 7,74. Weil die Gesundheit gleich ist, kommt der Unterschied von 0,24 nur vom Alter: 10 Jahre mal 0,024.';

/** Bild B2 `s10-formel-zwei`: the prediction with two predictors for two persons. */
export function FormulaTwo() {
  return <div className="formel s10-formel" role="img" aria-label={B2_TEXT}>
    <Row pieces={[
      { text: 'Vorhersage', tone: 'orange' }, { text: '=' }, { text: 'Konstante 3,095', note: 'Vorhersage bei 0', tone: 'gray' }, { text: '+' },
      { text: 'B Alter 0,024', note: 'pro Jahr', tone: 'blue' }, { text: '×' }, { text: 'Alter', tone: 'blue' }, { text: '+' },
      { text: 'B Gesundheit 0,861', note: 'pro Stufe', tone: 'green' }, { text: '×' }, { text: 'Gesundheit', tone: 'green' },
    ]} />
    <div className="s10-rechnung">
      <div className="s10-reihen">
        <Row className="klein" pieces={[{ text: 'Frau A:', tone: 'op' }, { text: '3,095', tone: 'gray' }, { text: '+' }, { text: '0,024 × 40', tone: 'blue' }, { text: '+' }, { text: '0,861 × 4', tone: 'green' }, { text: '=' }, { text: '3,095 + 0,96 + 3,444' }, { text: '=' }, { text: '7,50', tone: 'orange' }]} />
        <Row className="klein" pieces={[{ text: 'Herr B:', tone: 'op' }, { text: '3,095', tone: 'gray' }, { text: '+' }, { text: <>0,024 × <span className="s10-ring">50</span></>, tone: 'blue' }, { text: '+' }, { text: '0,861 × 4', tone: 'gray' }, { text: '=' }, { text: <>3,095 + <span className="s10-ring">1,20</span> + 3,444</> }, { text: '=' }, { text: '7,74', tone: 'orange' }]} />
      </div>
      <div className="s10-klammer">Unterschied 0,24 = 10 Jahre × 0,024</div>
    </div>
  </div>;
}

export const B3_TEXT = 'Oben das Modell demo aus lage. Sein B beantwortet: Wie hängt die eigene Lage mit der Zufriedenheit zusammen? Unten das Modell demo aus lage plus dlage. Jetzt beantwortet B von lage: Wie hängt die eigene Lage mit der Zufriedenheit zusammen, wenn die Einschätzung der Lage Deutschlands gleich ist?';

/** Bild B3 `s10-formel-waechst` (Aufgabe 1, Schritt 2): the formula gets one more predictor. */
export function FormulaGrows() {
  return <div className="formel s10-formel" role="img" aria-label={B3_TEXT}>
    <Row pieces={[{ text: 'demo', tone: 'code' }, { text: '~' }, { text: 'lage', tone: 'code' }]} />
    <p className="s10-schild-text">B von lage: Wie hängt die eigene Lage mit der Zufriedenheit zusammen?</p>
    <p className="s10-pfeil" aria-hidden="true">↓ ein Prädiktor mehr</p>
    <Row pieces={[{ text: 'demo', tone: 'code' }, { text: '~' }, { text: 'lage', tone: 'code' }, { text: '+' }, { text: 'dlage', tone: 'new', ring: true, note: 'neu' }]} />
    <p className="s10-schild-text">B von lage: … bei gleicher Einschätzung der Lage Deutschlands</p>
  </div>;
}

export const B9_TEXT = 'Beta gleich B mal Standardabweichung des Prädiktors geteilt durch Standardabweichung der abhängigen Variable. Für die Gesundheit: 0,861 mal 1,012 geteilt durch 1,919 ergibt 0,454. Alle drei Zahlen stehen in der Ausgabe von summary().';

/** Bild B9 `s10-formel-beta`. */
export function FormulaBeta() {
  return <div className="formel s10-formel" role="img" aria-label={B9_TEXT}>
    <Row pieces={[
      { text: 'Beta', tone: 'orange' }, { text: '=' }, { text: 'B', note: 'was R in Spalte B ausgibt', tone: 'gray' }, { text: '×' },
      { text: 'SD des Prädiktors', note: 'aus Descriptive Statistics', tone: 'blue' }, { text: '÷' },
      { text: 'SD der abhängigen Variable', note: 'aus Descriptive Statistics', tone: 'green' },
    ]} />
    <p className="s10-eingesetzt">Gesundheit: 0,861 × 1,012 ÷ 1,919 = 0,454</p>
  </div>;
}

export const B11_TEXT = 'Korrigiertes R² gleich 1 minus den nicht erklärten Anteil, mal n minus 1, geteilt durch n minus k minus 1. n ist die Zahl der Befragten, k die Zahl der Prädiktoren. Bei 30 Befragten und 5 Prädiktoren: 1 minus 0,69 mal 29 geteilt durch 24 ergibt 0,17. Bei 5.128 Befragten und 2 Prädiktoren ist der Bruch fast 1, und das korrigierte R² bleibt 0,190.';

/** Bild B11 `s10-formel-r2korr`. */
export function FormulaAdjR2() {
  return <div className="formel s10-formel" role="img" aria-label={B11_TEXT}>
    <Row pieces={[
      { text: 'korrigiertes R²', tone: 'orange' }, { text: '=' }, { text: '1' }, { text: '−' },
      { text: '(1 − R²)', note: 'was nicht erklärt ist', tone: 'gray' }, { text: '×' },
      { text: '(n − 1)', note: 'Befragte minus 1', tone: 'blue' }, { text: '÷' },
      { text: '(n − k − 1)', note: 'Befragte minus Prädiktoren minus 1', tone: 'green' },
    ]} />
    <p className="s10-eingesetzt">4 Würfel, n = 30, k = 5: 1 − (1 − 0,31) × 29 ÷ 24 = 1 − 0,69 × 1,21 = 0,17</p>
    <p className="s10-eingesetzt">ALLBUS, R lesen: n = 5.128, k = 2, R² 0,190: 1 − 0,810 × 5.127 ÷ 5.125 = 0,190</p>
  </div>;
}
