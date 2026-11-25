// Erklärfassungen von Atlas-Bildern aus Sitzung 2, die dort an einer Übung hingen oder eine Aufgabe verraten würden.
// - VierBoegen: die vier Bögen aus Grundlage 3a ohne Auswahlfragen; jeder Bogen zeigt gleich, was im Datensatz steht,
//   darunter das Bild der Türme (Luecken), das im Atlas erst nach allen vier Antworten erschien.
// - AblaufErklaert: „Vom Kreuz zur Zelle“ (Überblick Ü1) mit pa02a statt ep03, weil das Original die Zeile aus Aufgabe 2 zeigt.
import type { ReactNode } from 'react';
import { SHEETS } from '@atlas/chapter/s02/content';
import { Luecken, SmallSheet } from '@atlas/chapter/s02/figures/Pictures';
import { Brick, C, M, Plate, Sheet, Svg, TickBox } from '@atlas/chapter/s02/figures/bricks';

/* ---------- Vier Bögen, aufgelöst ---------- */
/** Was im Datensatz steht und warum, je Bogen (Texte aus den Rückmeldungen von g3_a … g3_d). */
const AUFGELOEST: Record<string, { code: string; text: ReactNode }> = {
  A: { code: '0 GANZ UNZUFRIEDEN', text: <>Die Person hat geantwortet: ganz unzufrieden. Die 0 ist ein gültiger Wert, kein Fehlen. Im ALLBUS 2023 haben 26 Befragte sie gegeben.</> },
  B: { code: '−9 KEINE ANGABE', text: <>0 hieße „ganz unzufrieden“, das hat die Person nicht gesagt. Leer lassen wäre schlechter: R wüsste dann nur „fehlt“, aber nicht warum. Bei 81 Befragten steht dieser Code.</> },
  C: { code: '−42 DATENFEHLER: MFN', text: <>MFN heißt Mehrfachnennung. 7,5 gibt es als Code nicht, und das erste Kreuz zu nehmen, wäre geraten. Der ALLBUS rät nicht, welches Kreuz gemeint war.</> },
  D: { code: '−11 TNZ: SPLIT', text: <>TNZ heißt „trifft nicht zu“: Die Person wurde nicht gefragt, die Frage stand nur in der anderen Fragebogenversion. −9 hieße dagegen, sie hat nicht geantwortet. 1.596 Befragte haben diese Frage nicht bekommen, alle mit Version B.</> },
};

export function VierBoegen() {
  return <>
    <div className="s2-vier">
      {SHEETS.map(s => <div key={s.id} className="v-bogen">
        <SmallSheet letter={s.letter} crosses={s.letter === 'A' ? [0] : s.letter === 'C' ? [7, 8] : []} missing={s.letter === 'D'} alt={`Fragebogen ${s.letter}: ${s.picture}.`} />
        <p className="erkl"><b>{`Fragebogen ${s.letter}, im Datensatz: ${AUFGELOEST[s.letter].code}.`}</b> {AUFGELOEST[s.letter].text}</p>
      </div>)}
    </div>
    <h6 className="zwischen">So stehen die vier Fragebögen in den Variablen</h6>
    <Luecken />
  </>;
}

/* ---------- Vom Kreuz zur Zelle, am Beispiel pa02a ---------- */
const STATIONEN: { titel: string; schild?: string; text: string; bild: ReactNode }[] = [
  { titel: 'Fragebogen', text: 'Kreuz bei „sehr stark“', bild: <Svg w={170} h={96}>
    <Sheet x={4} y={4} w={162} h={88} title="Interesse für Politik">
      {['sehr stark', 'stark', 'mittel'].map((o, i) => <TickBox key={o} x={16} y={30 + i * 19} label={o} checked={i === 0} />)}
    </Sheet>
  </Svg> },
  { titel: 'Codebuch', schild: 'Regel bei unklaren Kreuzen', text: 'pa02a: 1 = SEHR STARK', bild: <Svg w={170} h={96}>
    <rect x={4} y={4} width={162} height={88} rx={6} fill="#FBF8F3" stroke="#EFE6DA" />
    <M x={16} y={30} textAnchor="start" fontSize={12} fontWeight={700}>pa02a</M>
    <rect x={12} y={40} width={130} height={18} rx={3} fill={C.sticker} />
    <M x={16} y={53} textAnchor="start" fontSize={11.5} fontWeight={700}>1 = SEHR STARK</M>
    <M x={16} y={76} textAnchor="start" fontSize={11.5}>2 = STARK</M>
  </Svg> },
  { titel: 'Zeile', schild: 'fehlt? Grund als Code', text: 'sex 2 FRAU, ls01 8, pa02a 1 SEHR STARK', bild: <Svg w={200} h={96}>
    {['sex', 'ls01', 'pa02a'].map((n, i) => <g key={n}>
      <M x={36 + i * 62} y={26} fontSize={11} fontWeight={700}>{n}</M>
      <Brick x={12 + i * 62} y={44} w={48} kind="num" value={['2', '8', '1'][i]} studs={1} />
    </g>)}
    <Plate x={4} y={76} w={192} />
  </Svg> },
  { titel: 'Datensatz', text: '5,246 × 579', bild: <Svg w={170} h={96}>
    {Array.from({ length: 5 }, (_, r) => Array.from({ length: 5 }, (_, k) => <rect key={`${r}-${k}`} x={12 + k * 30} y={8 + r * 15} width={26} height={11}
      fill={C.blue} stroke={C.blueLine} strokeWidth={0.6} />))}
    <rect x={8} y={8 + 2 * 15 - 3} width={154} height={17} fill="none" stroke={C.orange} strokeWidth={2.5} rx={2} />
    <Plate x={6} y={86} w={158} />
  </Svg> },
];

const ABLAUF_TEXT = 'Vom Kreuz zur Zelle in vier Schritten. Erstens: Auf dem Fragebogen steht ein Kreuz bei „sehr stark“ (Interesse für Politik). Zweitens: Das Codebuch übersetzt es in einen Code, bei pa02a ist 1 = SEHR STARK; bei unklaren Kreuzen gilt eine aufgeschriebene Regel. Drittens: Die Codes einer Person bilden eine Zeile, zum Beispiel sex 2, ls01 8, pa02a 1; fehlende Antworten bekommen einen Code mit Grund. Viertens: Alle Zeilen zusammen sind der Datensatz, beim ALLBUS 5.246 Zeilen und 579 Variablen. Die Zeile ist ein Beispiel.';

export function AblaufErklaert() {
  return <figure className="ebild">
    <div className="ebild-bild s2-ablauf" role="img" aria-label={ABLAUF_TEXT}>
      {STATIONEN.map((s, i) => <div className="s2-station" key={s.titel}>
        <b><span>{i + 1}</span>{s.titel}</b>
        {s.bild}
        <small className="s2-st-text">{s.text}</small>
        {s.schild ? <small className="s2-st-schild">{s.schild}</small> : null}
      </div>)}
    </div>
    <figcaption>Vier Stationen vom Kreuz zur Zelle. <span>Die Zeile ist ein Beispiel.</span></figcaption>
  </figure>;
}
