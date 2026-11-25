// Sitzung 4 „Daten sehen“: Vorweg R lesen (#r1 Startblock, Zeile, Kette; #r2 Schichten) aus prototyp/sitzung4.html (v11).
import { useState, type ReactNode } from 'react';
import { Card, InShort, Known, Mixup, MoreDetail } from '../blocks/Card';
import { Begriff } from '../Begriff';
import { LS01 } from './content';
import { SvgText } from './figures/Bars';
import { Workshop } from './Workshop';

/* ---------- R2 Schichten ---------- */

const LINES: { step: number; text: string }[] = [
  { step: 1, text: 'allbus %>%' },
  { step: 4, text: '  drop_na(ls01) %>%' },
  { step: 2, text: '  ggplot(aes(x = ls01)) +' },
  { step: 3, text: '  geom_bar() +' },
  { step: 5, text: '  labs(title = "Lebenszufriedenheit",' },
  { step: 5, text: '       caption = "ALLBUS 2023, n = 5.164, ungewichtet")' },
];

const STEPS: [string, ReactNode][] = [
  ['Daten', <><code>allbus %&gt;%</code> nimmt den Datensatz und reicht ihn weiter: „und dann“. Noch ist nichts zu sehen.</>],
  ['Achsen', <><code>ggplot(aes(x = ls01))</code> legt die unterste Schicht an: eine leere Fläche mit Achsen, im Bild eine Leinwand. <code>aes()</code> sagt, welche Variable wohin kommt: <code>ls01</code> auf die x-Achse. Als Achsentitel nimmt R die Beschriftung aus dem Datensatz (bei älteren ggplot2-Versionen steht dort der Variablenname).</>],
  ['Form', <><code>+ geom_bar()</code> legt Balken darauf. Das Plus heißt: noch eine Schicht drauf. R zählt für jeden Wert die Personen. Und R meldet: 82 Zeilen ohne Wert wurden weggelassen – still, nur mit einer Warnung.</>],
  ['Fehlende weglassen', <><code>drop_na(ls01)</code> lässt alle ohne gültige Antwort ausdrücklich weg, bevor gezeichnet wird. Die Grafik sieht gleich aus, aber die Warnung ist weg, und du weißt genau, wie viele übrig sind: 5.164.</>],
  ['Beschriftung', <><code>labs()</code> gibt Titel und Bildunterschrift. Jetzt sagt die Grafik, was sie zeigt, woher die Daten kommen und wie viele es sind.</>],
];

const PICTURE = [
  'Bild: noch leer.',
  'Bild: eine leere graue Fläche, unten die Achse mit 0, 2.5, 5, 7.5 und 10 und dem Titel ALLGEMEINE LEBENSZUFRIEDENHEIT.',
  'Bild: elf graue Balken von 0 bis 10, der höchste bei 8. Darunter die gelbe Warnmeldung.',
  'Bild: dieselben elf Balken, die Warnung ist weg.',
  'Bild: dieselben Balken mit Titel Lebenszufriedenheit oben und Bildunterschrift unten rechts.',
];

/** The canvas after step `s` (port of `zeige` in the prototype); decorative, the text version is in PICTURE. */
function Canvas({ s }: { s: number }) {
  const w = 360, h = 230, pl = 34, pb = 40, top = s >= 5 ? 30 : 12, iw = w - pl - 10, ih = h - pb - top;
  const arial = { fontFamily: 'Arial' };
  const max = Math.max(...LS01);
  return <svg viewBox={`0 0 ${w} ${h}`} width="100%" aria-hidden="true" focusable="false">
    <rect x={pl} y={top} width={iw} height={ih} fill={s === 1 ? '#fff' : '#EBEBEB'} />
    {s >= 2 ? <>
      {[0, 2.5, 5, 7.5, 10].map(v => {
        const x = pl + (v + 0.5) / 11 * iw;
        return <g key={v}>
          <line x1={x} x2={x} y1={top} y2={top + ih} stroke="#fff" />
          <SvgText x={x} y={top + ih + 13} {...arial} fontSize={10} fill="#4d4d4d">{String(v)}</SvgText>
        </g>;
      })}
      <SvgText x={pl + iw / 2} y={h - 8} {...arial} fontSize={10.5} fill="#1a1a1a">ALLGEMEINE LEBENSZUFRIEDENHEIT</SvgText>
    </> : null}
    {s >= 3 ? LS01.map((a, i) => {
      const bh = a / max * (ih - 8), bw = iw / 11 * 0.9;
      return <rect key={i} x={pl + i / 11 * iw + iw / 11 * 0.05} y={top + ih - bh} width={bw} height={bh} fill="#595959" />;
    }) : null}
    {s >= 5 ? <>
      <SvgText x={pl} y={16} textAnchor="start" {...arial} fontSize={13} fill="#1a1a1a">Lebenszufriedenheit</SvgText>
      <SvgText x={w - 6} y={h - 22} textAnchor="end" {...arial} fontSize={9} fill="#333">ALLBUS 2023, n = 5.164, ungewichtet</SvgText>
    </> : null}
    {s === 1 ? <SvgText x={pl + iw / 2} y={top + ih / 2}>noch keine Grafik</SvgText> : null}
  </svg>;
}

/** „Eine Grafik entsteht in Schichten“: five steps, each adds a line of code and a layer to the canvas. */
function Layers() {
  const [s, setS] = useState(1);
  const shown = LINES.filter(l => l.step <= s);
  return <>
    <ul className="schritt-nav" aria-label="Schritte">
      {STEPS.map(([name], i) => <li key={name}>
        <button type="button" aria-current={i + 1 === s ? 'step' : 'false'} onClick={() => setS(i + 1)}>{`Schritt ${i + 1}: ${name}`}</button>
      </li>)}
    </ul>
    <div className="schichten">
      <div>
        <pre className="code solo schicht" tabIndex={0} aria-label="R-Code, aktueller Stand">{shown.map((l, i) => {
          const text = i === shown.length - 1 ? l.text.replace(/ (\+|%>%)$/, '') : l.text;
          return <span key={i} className={`z${l.step === s ? ' jetzt' : ''}`}>{text}</span>;
        })}</pre>
      </div>
      <div>
        <div className="leinwand" aria-hidden="true"><Canvas s={s} /></div>
        {s === 3 ? <div className="warnung" role="note" lang="en">Warnmeldung: Removed 82 rows containing non-finite outside the scale range (`stat_count()`).</div> : null}
      </div>
    </div>
    <p className="erkl" aria-live="polite">{STEPS[s - 1][1]}<span className="sr-only">{` ${PICTURE[s - 1]}`}</span></p>
  </>;
}

/** Vorweg: R lesen, two cards (h4): #r1 and #r2. */
export function ReadR() {
  return <>
    <Card id="r1" stone="R" title="R lesen: Startblock, Zeile, Pipe" badge={<Known session={1} what="Startblock" />} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Den Startblock kennst du aus Sitzung 1: Er lädt die Werkzeuge und legt den ALLBUS unter dem Namen <code>allbus</code> ab. <code>allbus</code> ist der ganze <Begriff id="datenmatrix">Datensatz</Begriff>: eine Tabelle mit einer Zeile je Fall und einer Spalte je Variable. In RStudio führst du ihn zu Beginn aus. In der Code-Werkstatt hier auf der Seite ist das schon erledigt.</p>
      <Workshop k="start" />
      <p className="hilfe-zeile">Rote Zeilen beim Laden, etwa „Attaching core tidyverse packages“, sind normal und kein Fehler. Öffne RStudio über dein Projekt. Findet R die Datei nicht, nimm wie in Sitzung 1 <code>allbus &lt;- read_spss(file.choose())</code>.</p>
      <p style={{ margin: '16px 0 0' }}><b>So liest du eine Zeile</b>, wie im Input heute: von links nach rechts, die Pipe <code>%&gt;%</code> sprichst du „und dann“.</p>
      <div className="lesehilfe" role="img" aria-label="allbus, das Objekt. Pipe, und dann. frequency, die Funktion. In Klammern ls01, das Argument: womit die Funktion arbeitet.">
        <span><b style={{ background: '#E5E9EE' }}>allbus</b><small>Objekt</small></span>
        <span><b style={{ background: 'var(--gelbh)' }}>%&gt;%</b><small>und dann</small></span>
        <span><b style={{ background: 'var(--gruenh)' }}>frequency(</b><small>Funktion: was passiert</small></span>
        <span><b style={{ background: '#FFE3D2' }}>ls01</b><small>Argument: womit</small></span>
        <span><b style={{ background: 'var(--gruenh)' }}>)</b><small>{' '}</small></span>
      </div>
      <p style={{ margin: '16px 0 0' }}><b>Neu heute: die Kette.</b> Die Pipe mit einem Schritt kennst du aus Sitzung 2. Jetzt stehen mehrere Schritte untereinander, und jede Zeile bekommt das Ergebnis der Zeile darüber in ihr erstes Feld. <code>allbus %&gt;% to_label(hs01) %&gt;% drop_na(hs01)</code> liest du so: Nimm <code>allbus</code>, und dann übersetze <code>hs01</code> in Wörter, und dann lass alle weg, die bei <code>hs01</code> nichts angegeben haben. Wie der Datensatz dabei Zeile für Zeile weiterwandert, zeigt das Bild in <a href="#a1">Aufgabe 1</a>, Schritt 4.</p>
      <InShort>Eine <Begriff id="funktion">Funktion</Begriff> sagt, was passiert, ihre <Begriff id="argument">Argumente</Begriff> sagen, womit und wie. Die <Begriff id="pipe">Pipe</Begriff> <code>%&gt;%</code> setzt das Ergebnis links als erstes Argument in die Funktion rechts. Mehrere solcher Schritte untereinander nennen wir eine <b>Pipe-Kette</b>.</InShort>
      <MoreDetail summary="Objekt, Funktion, Argument">
        <p>Ein <Begriff id="objekt">Objekt</Begriff> ist ein Name, unter dem R sich etwas merkt. <code>allbus</code> ist der ganze Datensatz mit all seinen Variablen. Mit <code>&lt;-</code> legst du etwas unter einem Namen ab: <code>allbus &lt;- read_spss(…)</code> heißt „lies die Datei und leg sie unter dem Namen allbus ab“.</p>
        <p>Eine <b>Funktion</b> ist ein Werkzeug: Sie bekommt etwas, tut etwas und gibt etwas zurück. In den Klammern stehen die <b>Argumente</b>: womit und wie. Was du nicht angibst, ist voreingestellt. Mit <code>=</code> stellst du ein Argument ein, etwa <code>binwidth = 5</code>.</p>
        <p>Die Pipe <code>%&gt;%</code> gibt das Ergebnis links als erstes Argument an die Funktion rechts weiter. <code>allbus %&gt;% frequency(ls01)</code> ist dasselbe wie <code>frequency(allbus, ls01)</code>. Darum steht der Datensatz in einer Pipe-Kette nur einmal ganz oben. Mehr dazu im R-Workshop, Kapitel 3.</p>
      </MoreDetail>
      <Mixup><code>=</code> und <code>&lt;-</code>. Mit <code>=</code> stellst du ein Argument ein (<code>binwidth = 5</code>), mit <code>&lt;-</code> legst du ein Objekt unter einem Namen ab (<code>allbus &lt;- read_spss(…)</code>).</Mixup>
    </Card>

    <Card id="r2" stone="R" title="Eine Grafik entsteht in Schichten" tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">So entsteht in R ein <Begriff id="balkendiagramm">Balkendiagramm</Begriff> der Lebenszufriedenheit, wie im Input heute beim Vertrauen in den Bundestag. Geh die Schritte durch: Bei jedem kommt eine Zeile dazu.</p>
      <Layers />
      <InShort>Bis <code>ggplot()</code> reichst du die Daten mit <code>%&gt;%</code> weiter („und dann“). Ab <code>ggplot()</code> legst du mit <code>+</code> Schicht auf Schicht; jede Schicht heißt in ggplot ein <Begriff id="layer">Layer</Begriff>. <code>aes()</code> sagt, welche Variable wohin kommt.</InShort>
      <Workshop k="schichten" />
      <Mixup><code>%&gt;%</code> statt <code>+</code> nach <code>ggplot()</code>. R meldet dann „`mapping` must be created by `aes()`“. Ab <code>ggplot()</code> kommen Schichten dazu, und die verbindet das Plus.</Mixup>
    </Card>
  </>;
}
