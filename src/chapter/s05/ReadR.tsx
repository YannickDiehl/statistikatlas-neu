// Sitzung 5 „Kreuztabellen“: Vorweg R lesen (#r1 Startblock, #r2 neue Variable mit mutate() und rec(), #r3 Kreuztabelle).
import { Badge, Card, InShort, Mixup, MoreDetail } from '../blocks/Card';
import { RecFigure } from './figures/Towers';
import { CrosstabOutputFigure, RuleFigure } from './figures/Tables';
import { Workshop } from './Workshop';

const BRICKS: [string, string][] = [
  ['allbus %>%', 'nimm allbus, und dann'],
  ['mutate(', 'füge eine Variable hinzu'],
  ['teilzeit =', 'Name der neuen Variable'],
  ['rec(work,', 'umkodieren: aus der Variable work'],
  ['rules = "…"', 'nach diesen Regeln'],
  [') %>%', 'und dann'],
  ['frequency(teilzeit)', 'zähle die neue Variable aus'],
];

/** Vorweg: R lesen, three cards (h4): #r1, #r2, #r3. */
export function ReadR() {
  return <>
    <Card id="r1" stone="R" title={<>Erinnerung: Startblock und <code>&lt;-</code></>}
      badge={<Badge>Startblock und <code>&lt;-</code>: kennst du aus Sitzung 1, Kette: kennst du aus Sitzung 4</Badge>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Den Startblock kennst du aus Sitzung 1. Er lädt die Werkzeuge und legt den ALLBUS unter dem Namen <code>allbus</code> ab. In RStudio führst du ihn zu Beginn aus, in der Code-Werkstatt hier ist das schon erledigt.</p>
      <Workshop k="start" />
      <p className="absatz"><code>&lt;-</code> legt ein Ergebnis unter einem Namen ab. Ketten aus mehreren Schritten liest du wie in Sitzung 4 von oben nach unten, <code>%&gt;%</code> sprichst du „und dann“. Heute kommt in der Kette ein neuer Schritt dazu: eine neue Variable bauen.</p>
    </Card>

    <Card id="r2" stone="R" title={<>Neu heute: eine neue Variable mit <code>mutate()</code> und <code>rec()</code></>} badge={<Badge>neu heute</Badge>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Im ALLBUS steht bei <code>work</code>, ob jemand Vollzeit arbeitet (Code 1), Teilzeit (2), nebenher (3) oder nicht erwerbstätig ist (4). Für die Frage „Wer arbeitet Teilzeit?“ brauchst du nur zwei Gruppen. Dafür baust du eine neue Variable. Warum man das tut und was dabei zu entscheiden ist, steht in <a href="#g1">Grundlage 1</a>. Hier geht es nur darum, den Code zu lesen.</p>
      <Workshop k="r2_rec" live />
      <p className="absatz"><b>So liest du die Vorlage</b>, Teil für Teil:</p>
      <div className="lesehilfe s5-lesehilfe" role="img" aria-label={BRICKS.map(([code, say]) => `${code}: ${say}`).join('. ')}>
        {BRICKS.map(([code, say]) => <span key={code}><b>{code}</b><small>{say}</small></span>)}
      </div>
      <RuleFigure />
      <RecFigure caption={<><code>rec()</code> liest jeden Stein von <code>work</code> und gibt nach der Regel einen neuen Stein zurück: aus 2 und 3 wird 1, aus 1 wird 0, alles andere wird leer. <code>mutate()</code> stellt den neuen Turm <code>teilzeit</code> zusätzlich auf die Bauplatte; <code>work</code> bleibt, wie es war. <code>%&gt;%</code> reicht die größere Bauplatte gleich weiter an <code>frequency()</code>. R schreibt Tausender mit Komma: 5,246 heißt 5.246. <span>Die Steine sind ein Beispiel mit sechs Befragten; die Größe der Bauplatte stammt aus dem ALLBUS 2023.</span></>} />
      <InShort><b>Umkodieren</b> (auch <b>Rekodieren</b>) heißt: aus den Codes einer Variable nach festen Regeln neue Codes machen. <code>rec()</code> macht das, <code>mutate()</code> stellt das Ergebnis als <b>neue Variable</b> in den Datensatz, und <code>%&gt;%</code> reicht ihn weiter, etwa an <code>frequency()</code> oder <code>crosstab()</code>. Die alte Variable bleibt unverändert.</InShort>
      <MoreDetail summary="Regeln schreiben und prüfen">
        <p>Eine Regel hat immer die Form <b>alte Codes = neuer Code [Aufkleber]</b>. Mehrere alte Codes schreibst du von bis mit Doppelpunkt (<code>2:3</code>) oder einzeln mit Komma (<code>1,3</code>). Regeln trennt ein Semikolon <code>;</code>. <code>else</code> steht für alle Codes, die in keiner Regel vorkommen; <code>else=NA</code> macht sie leer. Fehlende Werte wie „keine Angabe“ bleiben mit <code>else=NA</code> leer. Vorsicht: <code>else=0</code> macht auch sie zu 0 (<a href="#g1">Grundlage 1</a>, Kurz überlegen). Codes für fehlende Werte wie −8 kannst du in einer Regel nicht ansprechen: <code>rec()</code> sieht sie nur als leer, eine Regel wie <code>-8=2</code> ändert nichts.</p>
        <p>Die Codes findest du in der Ausgabe von <code>frequency()</code> in der Spalte <b>Value</b> (kennst du aus Sitzung 3). Links vom <code>=</code> stehen immer Codes, nie die Wörter.</p>
        <p>Nach jedem Umkodieren prüfst du mit <code>frequency()</code>, ob die Gruppen stimmen: Hier sind es 2.193 in Vollzeit und 1.169 in Teilzeit, zusammen 3.362. Leer sind 1.884: die 1.849 nicht Erwerbstätigen und 35 ohne gültige Angabe. Bei neuen Variablen fasst <code>frequency()</code> alle Leeren in der Zeile <b>System</b> zusammen.</p>
        <p>Hier auf der Seite beginnt jede Code-Werkstatt mit dem frisch geladenen <code>allbus</code>. Darum bildet jede Vorlage ihre neuen Variablen selbst, am Anfang ihrer Kette. In RStudio kannst du eine neue Variable auch einmal ablegen und dann in vielen Auswertungen nutzen: <code>allbus &lt;- allbus %&gt;% mutate(…)</code>. So ist das Skript zum Mitnehmen gebaut. Mehr dazu im R-Workshop, Kapitel 5.</p>
      </MoreDetail>
      <Mixup><code>=</code> in einer Regel und <code>==</code> in <code>filter()</code>. In <code>rules</code> steht ein einfaches <code>=</code> („wird zu“). Das doppelte <code>==</code> aus Sitzung 2 fragt dagegen „ist gleich?“ und gehört in <code>filter()</code>.</Mixup>
    </Card>

    <Card id="r3" stone="R" title={<>Neu heute: eine Kreuztabelle mit <code>crosstab()</code> lesen</>} badge={<Badge>neu heute</Badge>} tag={{ kind: 'picture', label: 'Code lesen' }}>
      <p className="lead">Eine <b>Kreuztabelle</b> zählt, wie oft jede Kombination zweier Variablen vorkommt. <code>crosstab()</code> aus mariposa nimmt zuerst die Variable für die Zeilen, dann die für die Spalten. Mit <code>percentages =</code> stellst du ein, welche Prozent darunter stehen. Was die Prozent bedeuten, ist Thema der <a href="#g2">Grundlagen 2</a> und <a href="#g3">3</a>.</p>
      <p className="absatz">Die ersten Zeilen bilden <code>teilzeit</code> wie in der Vorlage darüber. Neu ist nur die letzte Zeile.</p>
      <Workshop k="r3_ct" live />
      <CrosstabOutputFigure caption={<>Jede Zelle hat zwei Zeilen: oben die Anzahl, darunter die Prozent, die du mit <code>percentages =</code> gewählt hast. Die Ränder (Total) sind die Summen. R schreibt Kommazahlen mit Punkt: 51.7% heißt 51,7 %.</>} />
      <InShort>Eine <b>Kreuztabelle</b> (auch <b>Kontingenztabelle</b>) zeigt zwei Variablen zugleich: Jede <b>Zelle</b> zählt die Befragten mit genau dieser Kombination. Die Summen am Rand heißen <b>Randhäufigkeiten</b>. <code>percentages = "row"</code>, <code>"col"</code> oder <code>"total"</code> wählt, worauf sich die Prozent beziehen, <code>"all"</code> zeigt alle drei.</InShort>
      <MoreDetail summary="Wer steht in der Tabelle?">
        <p>In einer Kreuztabelle stehen nur Befragte, die bei <b>beiden</b> Variablen eine gültige Angabe haben. Hier sind es 3.359. Bei <code>frequency(teilzeit)</code> waren es 1.169 in Teilzeit, in der Tabelle sind es 1.167: Zwei Teilzeitkräfte haben beim Geschlecht keine gültige Angabe und fallen heraus. Darum nennst du zu jeder Tabelle das N, das R unter <code>N (valid)</code> angibt.</p>
        <p>Lässt du <code>percentages</code> weg, zeigt <code>crosstab()</code> Zeilenprozente. Schreib es trotzdem hin, dann sieht jede, worauf sich die Prozent beziehen. Mehr dazu im R-Workshop, Kapitel 7.</p>
      </MoreDetail>
      <Mixup>Die Reihenfolge in <code>crosstab(sex, teilzeit)</code> ist nicht egal. Die erste Variable kommt in die Zeilen, die zweite in die Spalten. Tauschst du sie, tauschen auch Zeilen- und Spaltenprozente ihre Namen.</Mixup>
    </Card>
  </>;
}
