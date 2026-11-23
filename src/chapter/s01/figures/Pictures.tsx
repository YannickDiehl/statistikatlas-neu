// Sitzung 1: die festen Bilder (Werkstatt, Projekt, Environment, find_var, Fehlermeldung, Weg), je mit Textfassung aus ALT.
import type { ReactNode } from 'react';
import { ALT, FIND_VAR_ROWS } from '../content';
import { ArrowDefs, C, M, Num, SvgFigure, T } from './Svg';

/* ---------- s1-werkstatt ---------- */

const LEGEND: string[][] = [
  ['Name der Vorlage'], ['führt den Code aus'], ['holt die Vorlage zurück'], ['kopiert deinen Code für RStudio'],
  ['Zeilennummern'], ['markierte Stelle: hier anpassen'], ['Zeichen einfügen, die schwer', 'zu tippen sind'], ['Antwort von R: Text, Hinweise,', 'Fehler'],
];

function Button({ x, y, w, label, run }: { x: number; y: number; w: number; label: string; run?: boolean }) {
  return <g>
    <rect x={x} y={y} width={w} height={24} rx={7} fill={run ? C.gruend : '#fff'} stroke={run ? C.gruend : C.rand} strokeWidth={1.5} />
    <T x={x + w / 2} y={y + 16.5} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={run ? '#fff' : C.ink}>{label}</T>
  </g>;
}

/** Bild s1-werkstatt: Schema einer Code-Werkstatt mit acht nummerierten Teilen. */
export function WorkshopSchema() {
  const lineY = (i: number) => 98 + i * 24;
  return <SvgFigure viewBox="0 0 500 520" alt={ALT.werkstatt}>
    {/* Kopfleiste */}
    <rect x={10} y={34} width={480} height={40} rx={10} fill={C.gelbh} stroke={C.line} strokeWidth={2} />
    <Num x={28} y={54} n={1} />
    <T x={44} y={59} fontWeight={700}>Vorlage: Zellen zählen</T>
    <Button x={236} y={42} w={92} label="▶ Ausführen" run />
    <Button x={334} y={42} w={90} label="Zurücksetzen" />
    <Button x={430} y={42} w={54} label="Kopieren" />
    <Num x={282} y={20} n={2} /><Num x={379} y={20} n={3} /><Num x={457} y={20} n={4} />
    {/* Code */}
    <rect x={10} y={74} width={480} height={146} fill="#fff" stroke={C.line} strokeWidth={2} />
    <rect x={11} y={75} width={30} height={144} fill="#FBF6EE" />
    {[1, 2, 3, 4, 5].map(n => <M key={n} x={34} y={lineY(n - 1)} textAnchor="end" fill={C.mute}>{String(n)}</M>)}
    <M x={52} y={lineY(0)} fill={C.comment} fontStyle="italic">{'# Zellen zählen: Befragte mal Variablen'}</M>
    <M x={52} y={lineY(1)}>{'zellen <- '}</M>
    <rect x={124} y={lineY(1) - 14} width={62} height={19} rx={3} fill={C.mark} stroke={C.markd} strokeDasharray="4 3" />
    <M x={127} y={lineY(1)}>Befragte</M>
    <M x={190} y={lineY(1)}>*</M>
    <rect x={204} y={lineY(1) - 14} width={70} height={19} rx={3} fill={C.mark} stroke={C.markd} strokeDasharray="4 3" />
    <M x={207} y={lineY(1)}>Variablen</M>
    <M x={52} y={lineY(3)} fill={C.comment} fontStyle="italic"># zellen anzeigen</M>
    <M x={52} y={lineY(4)}>zellen</M>
    <Num x={26} y={208} n={5} />
    <Num x={292} y={lineY(1) - 5} n={6} />
    {/* Einfügen */}
    <rect x={10} y={220} width={480} height={34} fill="#FBF6EE" stroke={C.line} strokeWidth={2} />
    <T x={22} y={242} fontSize={12} fontWeight={700} fill={C.mute}>Einfügen:</T>
    {['%>%', '<-', '" "', '( )'].map((s, i) => <g key={s}>
      <rect x={90 + i * 52} y={227} width={44} height={20} rx={6} fill="#fff" stroke={C.rand} />
      <M x={112 + i * 52} y={241} textAnchor="middle" fontSize={11}>{s}</M>
    </g>)}
    <Num x={312} y={237} n={7} />
    {/* Ausgabe */}
    <rect x={10} y={264} width={480} height={84} rx={10} fill="#FBF8F3" stroke={C.line} strokeWidth={2} />
    <T x={24} y={284} fontSize={11.5} fontWeight={800} fill={C.mute} letterSpacing=".06em">AUSGABE</T>
    <T x={24} y={314} fill={C.mute}>Hier erscheint, was R ausgibt.</T>
    <Num x={110} y={280} n={8} />
    {/* Legende in zwei Spalten unter der Werkstatt */}
    {LEGEND.map((lines, i) => {
      const x = i < 4 ? 14 : 256, y = 378 + (i % 4) * 38;
      return <g key={i}>
        <Num x={x + 10} y={y} n={i + 1} />
        {lines.map((l, k) => <T key={k} x={x + 28} y={y + 4.5 + k * 16} fontSize={13}>{l}</T>)}
      </g>;
    })}
  </SvgFigure>;
}

/* ---------- s1-projekt ---------- */

function FileCard({ x, y, w, name, found }: { x: number; y: number; w: number; name: string; found?: boolean }) {
  return <g>
    <rect x={x} y={y} width={w} height={24} rx={5} fill="#fff" stroke={found ? C.gruend : C.rand} strokeWidth={found ? 2.5 : 1} />
    <M x={x + 8} y={y + 16} fontSize={11}>{name}</M>
  </g>;
}

function Folder({ x, y, w, h, label, gray }: { x: number; y: number; w: number; h: number; label: string; gray?: boolean }) {
  const fill = gray ? '#F2F2F0' : C.gelbh, stroke = gray ? '#9a9a96' : C.gelbd;
  return <g>
    <path d={`M${x},${y + 8} v-8 h${Math.min(90, w / 2)} l8,8 z`} fill={fill} stroke={stroke} strokeWidth={1.5} />
    <rect x={x} y={y + 8} width={w} height={h} rx={8} fill={fill} stroke={stroke} strokeWidth={1.5} />
    <T x={x + 10} y={y + 28} fontSize={12} fontWeight={700} fill={gray ? C.mute : C.gelbd}>{label}</T>
  </g>;
}

function CodeChip({ x, y, w, text }: { x: number; y: number; w: number; text: string }) {
  return <g>
    <rect x={x} y={y} width={w} height={26} rx={7} fill={C.gruenh} stroke={C.gruend} />
    <M x={x + w / 2} y={y + 17} textAnchor="middle" fontSize={11.5}>{text}</M>
  </g>;
}

/** Bild s1-projekt: links findet R die Datei im Projektordner, rechts liegt sie noch in Downloads. */
export function ProjectPicture() {
  const code = 'read_spss("ZA8831_v1-3-0.sav")';
  return <SvgFigure viewBox="0 0 520 340" alt={ALT.projekt}>
    <ArrowDefs id="s1-projekt-gruen" color={C.gruend} />
    <ArrowDefs id="s1-projekt-rot" color={C.rot} />
    {/* links */}
    <T x={128} y={18} textAnchor="middle" fontWeight={800} fill={C.gruend}>So findet R die Datei</T>
    <CodeChip x={10} y={30} w={236} text={code} />
    <line x1={128} y1={58} x2={128} y2={86} stroke={C.gruend} strokeWidth={2.5} markerEnd="url(#s1-projekt-gruen)" />
    <Folder x={10} y={90} w={236} h={136} label="methoden-ib (Projektordner)" />
    <FileCard x={22} y={132} w={212} name="methoden-ib.Rproj" />
    <FileCard x={22} y={162} w={212} name="sitzung1.R" />
    <FileCard x={22} y={192} w={212} name="ZA8831_v1-3-0.sav" found />
    <T x={128} y={256} textAnchor="middle" fontWeight={800} fill={C.gruend}>✓ gefunden</T>
    {/* rechts */}
    <line x1={260} y1={8} x2={260} y2={332} stroke={C.soft} strokeWidth={2} />
    <T x={392} y={18} textAnchor="middle" fontWeight={800} fill={C.rot}>So nicht</T>
    <CodeChip x={274} y={30} w={236} text={code} />
    <line x1={392} y1={58} x2={392} y2={86} stroke={C.rot} strokeWidth={2.5} markerEnd="url(#s1-projekt-rot)" />
    <Folder x={274} y={90} w={236} h={106} label="methoden-ib (Projektordner)" />
    <FileCard x={286} y={132} w={212} name="methoden-ib.Rproj" />
    <FileCard x={286} y={162} w={212} name="sitzung1.R" />
    <Folder x={330} y={214} w={180} h={66} label="Downloads" gray />
    <FileCard x={342} y={252} w={156} name="ZA8831_v1-3-0.sav" />
    <T x={274} y={312} fontWeight={800} fill={C.rot}>✗</T>
    <M x={290} y={312} fontSize={11} fill={C.rot}>{"File 'ZA8831_v1-3-0.sav'"}</M>
    <M x={290} y={328} fontSize={11} fill={C.rot}>does not exist.</M>
  </SvgFigure>;
}

/* ---------- s1-environment ---------- */

/** Bild s1-environment: allbus im Environment, die beiden Zahlen als Platzhalter. */
export function EnvironmentPicture({ caption }: { caption?: ReactNode }) {
  return <SvgFigure viewBox="0 0 480 170" alt={ALT.environment} caption={caption}>
    <ArrowDefs id="s1-env-pfeil" color={C.mute} />
    <rect x={6} y={6} width={468} height={96} rx={8} fill="#fff" stroke={C.line} strokeWidth={2} />
    <rect x={7} y={7} width={466} height={26} rx={7} fill={C.side} />
    <T x={18} y={25} fontSize={13} fontWeight={800}>Environment</T>
    <T x={116} y={25} fontSize={13} fill={C.mute}>History</T>
    <T x={176} y={25} fontSize={13} fill={C.mute}>Connections</T>
    <T x={18} y={52} fontSize={12.5} fontWeight={800} fill={C.mute}>Data</T>
    {/* Tabellensymbol */}
    <rect x={20} y={64} width={18} height={16} rx={2} fill={C.blauh} stroke={C.blaud} />
    <line x1={20} y1={70} x2={38} y2={70} stroke={C.blaud} /><line x1={29} y1={64} x2={29} y2={80} stroke={C.blaud} />
    <M x={48} y={77} fontSize={13} fontWeight={700}>allbus</M>
    <rect x={106} y={64} width={44} height={18} rx={4} fill="#E3E3E0" />
    <M x={158} y={77} fontSize={13}>obs. of</M>
    <rect x={222} y={64} width={34} height={18} rx={4} fill="#E3E3E0" />
    <M x={264} y={77} fontSize={13}>variables</M>
    <line x1={90} y1={142} x2={126} y2={88} stroke={C.mute} strokeWidth={1.5} markerEnd="url(#s1-env-pfeil)" />
    <line x1={300} y1={142} x2={242} y2={88} stroke={C.mute} strokeWidth={1.5} markerEnd="url(#s1-env-pfeil)" />
    <T x={10} y={160} fontSize={13} fontWeight={700}>obs. = Befragte (Zeilen)</T>
    <T x={232} y={160} fontSize={13} fontWeight={700}>variables = Variablen (Spalten)</T>
  </SvgFigure>;
}

/* ---------- s1-find-var ---------- */

const CW = 6.6; // Breite eines Zeichens in JetBrains Mono 11

/** Bild s1-find-var: das Suchwort wandert durch Namen und Variablenlabels und findet la01. */
export function FindVarPicture() {
  const top = 104, rowH = 24, x0 = 8, nameW = 46, tableW = 340;
  return <SvgFigure viewBox="0 0 520 290" alt={ALT.findVar}>
    <ArrowDefs id="s1-fv-gruen" color={C.gruend} />
    <ArrowDefs id="s1-fv-grau" color={C.mute} />
    {/* Suchwort und Funktion */}
    <rect x={8} y={8} width={92} height={28} rx={7} fill={C.arg} />
    <M x={54} y={27} textAnchor="middle" fontSize={13}>"buecher"</M>
    <T x={54} y={52} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.mute}>Suchwort</T>
    <line x1={106} y1={22} x2={196} y2={22} stroke={C.gruend} strokeWidth={2.5} markerEnd="url(#s1-fv-gruen)" />
    <M x={150} y={14} textAnchor="middle" fontSize={11} fill={C.gruend}>find_var()</M>
    <T x={204} y={27} fontSize={13} fontWeight={800}>Alle Variablen</T>
    {/* Hinweise auf die Spaltenköpfe */}
    <T x={x0} y={72} fontSize={12} fontWeight={700} fill={C.mute}>sucht im Namen</T>
    <line x1={x0 + 22} y1={77} x2={x0 + 22} y2={top - 22} stroke={C.mute} strokeWidth={1.2} markerEnd="url(#s1-fv-grau)" />
    <T x={x0 + 150} y={72} fontSize={12} fontWeight={700} fill={C.mute}>sucht im Variablenlabel</T>
    <line x1={x0 + 160} y1={77} x2={x0 + 120} y2={top - 22} stroke={C.mute} strokeWidth={1.2} markerEnd="url(#s1-fv-grau)" />
    {/* Tabelle */}
    <rect x={x0} y={top - 20} width={tableW} height={20 + rowH * 6} rx={6} fill="#fff" stroke={C.line} strokeWidth={1.5} />
    <rect x={x0 + 1} y={top - 19} width={tableW - 2} height={19} fill={C.side} />
    <T x={x0 + 8} y={top - 6} fontSize={12} fontWeight={800}>Name</T>
    <T x={x0 + nameW + 8} y={top - 6} fontSize={12} fontWeight={800}>Variablenlabel</T>
    {FIND_VAR_ROWS.map(([name, label], i) => {
      const y = top + i * rowH, hit = name === 'la01', at = label.indexOf('BUECHER');
      return <g key={name}>
        {hit ? <rect x={x0 + 2} y={y + 2} width={tableW - 4} height={rowH - 4} rx={4} fill="none" stroke={C.gruend} strokeWidth={2} /> : null}
        {hit ? <rect x={x0 + nameW + 8 + at * CW - 1} y={y + 5} width={7 * CW + 2} height={15} rx={2} fill={C.k} /> : null}
        <M x={x0 + 8} y={y + 16} fontSize={11}>{name}</M>
        <M x={x0 + nameW + 8} y={y + 16} fontSize={11}>{label}</M>
      </g>;
    })}
    <T x={x0 + 8} y={top + 6 * rowH + 18} fontSize={12} fill={C.mute}>… und viele weitere</T>
    {/* Ergebnis */}
    <line x1={x0 + tableW + 2} y1={top + rowH / 2} x2={392} y2={top + rowH / 2} stroke={C.gruend} strokeWidth={2.5} markerEnd="url(#s1-fv-gruen)" />
    <rect x={396} y={top - 14} width={118} height={104} rx={10} fill={C.gruenh} stroke={C.gruend} strokeWidth={2} />
    <T x={406} y={top + 6} fontWeight={800} fill={C.gruend}>1 Treffer:</T>
    <M x={406} y={top + 28} fontSize={11.5}>la01</M>
    <M x={406} y={top + 46} fontSize={11.5}>FREIZEIT:</M>
    <M x={406} y={top + 62} fontSize={11.5}>BUECHER</M>
    <M x={406} y={top + 78} fontSize={11.5}>LESEN</M>
  </SvgFigure>;
}

/* ---------- s1-fehler ---------- */

const NOTES: [string, string][] = [
  ['wo:', ' in welcher Funktion'],
  ['was:', ' Das Suchmuster (pattern) muss ein Text sein.'],
  ['Hinweis:', ' klima wurde als Name gelesen. Es fehlen'],
];

/** Bild s1-fehler: eine Fehlermeldung in der Konsole, in drei Teilen gelesen. */
export function ErrorConsole() {
  const lines = [
    { text: '> find_var(allbus, klima)', red: false },
    { text: 'Fehler in find_var(allbus, klima) :', red: true },
    { text: '  `pattern` must be a single character string.', red: true },
    { text: '✖ Object `klima` not found', red: true },
    { text: '  (a variable name is not accepted here).', red: true },
  ];
  const y = (i: number) => 32 + i * 24;
  return <SvgFigure viewBox="0 0 420 300" alt={ALT.fehler}>
    <rect x={4} y={8} width={412} height={132} rx={8} fill="#fff" stroke={C.line} strokeWidth={2} />
    {lines.map((l, i) => <M key={i} x={14} y={y(i)} fontSize={12} fill={l.red ? C.rot : C.ink}>{l.text}</M>)}
    {[1, 2, 3].map(n => <Num key={n} x={398} y={y(n) - 4} n={n} />)}
    {NOTES.map(([b, rest], i) => <g key={i}>
      <Num x={16} y={172 + i * 26} n={i + 1} />
      <T x={34} y={176.5 + i * 26} fontSize={13}><tspan fontWeight={800}>{b}</tspan>{rest}</T>
    </g>)}
    <T x={34} y={250} fontSize={13}>Anführungszeichen: "klima".</T>
    <T x={4} y={278} fontSize={12} fill={C.mute}>In der Werkstatt steht ‚Error in‘ statt ‚Fehler in‘;</T>
    <T x={4} y={294} fontSize={12} fill={C.mute}>der Rest ist gleich.</T>
  </SvgFigure>;
}

/* ---------- s1-weg ---------- */

const STEPS: { title: string; fns: string; sub: string }[] = [
  { title: 'Projekt öffnen', fns: '', sub: 'Datei im Projektordner' },
  { title: 'Startblock', fns: 'library(), read_spss()', sub: 'allbus im Environment, dim(allbus)' },
  { title: 'Suchen', fns: 'find_var()', sub: 'kurzer Wortanfang, ü als ue' },
  { title: 'Lesen', fns: 'frequency(), codebook()', sub: 'Codes, Wertelabels, fehlende Werte' },
  { title: 'Entscheiden', fns: '', sub: 'passt / nah dran / neu fragen' },
];

/** Bild s1-weg: fünf Schritte vom Rechner bis zur passenden Variable, darunter das Band für Fehlermeldungen. */
export function RoutePicture() {
  const x = 10, w = 200, h = 46, step = 64;
  const y = (i: number) => 8 + i * step;
  return <SvgFigure viewBox="0 0 520 364" alt={ALT.weg}>
    <ArrowDefs id="s1-weg-gruen" color={C.gruend} />
    {STEPS.map((s, i) => <g key={s.title}>
      <rect x={x} y={y(i)} width={w} height={h} rx={12} fill={C.blauh} stroke={C.blaud} strokeWidth={2} />
      <T x={x + w / 2} y={y(i) + (s.fns ? 19 : 28)} textAnchor="middle" fontWeight={800}>{`${i + 1} ${s.title}`}</T>
      {s.fns ? <M x={x + w / 2} y={y(i) + 37} textAnchor="middle" fontSize={11.5} fill={C.fn}>{s.fns}</M> : null}
      <T x={244} y={y(i) + 28} fontSize={13} fill={C.mute}>{s.sub}</T>
      {i < STEPS.length - 1 ? <line x1={x + w / 2} y1={y(i) + h + 1} x2={x + w / 2} y2={y(i + 1) - 3} stroke={C.gruend} strokeWidth={2.5} markerEnd="url(#s1-weg-gruen)" /> : null}
    </g>)}
    {/* Schleife an Schritt 3 */}
    <path d={`M${x + w},${y(2) + 34} C${x + w + 26},${y(2) + 34} ${x + w + 26},${y(2) + 12} ${x + w + 3},${y(2) + 12}`} fill="none" stroke={C.gruend} strokeWidth={2} strokeDasharray="4 3" markerEnd="url(#s1-weg-gruen)" />
    <T x={244} y={y(2) + 45} fontSize={12.5} fontWeight={700} fill={C.gruend}>kein Treffer? anders suchen</T>
    <rect x={10} y={326} width={500} height={30} rx={10} fill={C.roth} stroke={C.rot} strokeWidth={1.5} />
    <T x={260} y={346} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.rot}>Fehlermeldung? Lesen: wo, was, welcher Name</T>
  </SvgFigure>;
}
