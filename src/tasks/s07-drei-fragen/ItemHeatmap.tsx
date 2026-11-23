import { ArrowUpDown } from 'lucide-react';
import { useMemo, useState, type CSSProperties } from 'react';
import { de } from '../kit/numbers';
import { CAT, CAT_DARK, lighten, ROLE, scaleAt } from '../kit/palette';
import { RBlock } from '../kit/RBlock';
import { FR_IDS, FR_ITEMS, FR_SCALE, type FrId } from './content';
import { frChanged, frCode, frCorrelations, frReliability, frStart, shortR, shownCorrelation, toggleFrFlip, toggleFrOn, type FrData, type FrSetup } from './domain';

/** Rot = negative, Grün = positive Korrelation (Enden der geordneten Skala), je kräftiger, desto enger. Weiß = kein Zusammenhang. */
const NEG = scaleAt(0), POS = scaleAt(1);
export const cellColor = (r: number) => (Number.isFinite(r) ? lighten(r < 0 ? NEG : POS, 1 - 0.9 * Math.min(1, Math.abs(r))) : ROLE.empty);
/** Lila = umgepolt (keine Rollenfarbe), Türkis = α als R-Ergebnis (Rolle Modell). */
const VARS = {
  '--s07-flip': CAT_DARK[4], '--s07-flip-bg': lighten(CAT[4], 0.78), '--s07-alpha': ROLE.model, '--s07-alpha-dark': CAT_DARK[5],
  '--s07-neg': NEG, '--s07-pos': POS,
} as CSSProperties;
const count = (x: number) => x.toLocaleString('de-DE');

/** Einstieg Sitzung 8: echte Items einer anderen Batterie (Rollenbilder) als Heatmap. Wer Items herausnimmt oder umpolt,
 *  sieht die Farben kippen und Cronbachs α live mitgehen – mit Trennschärfe und „α ohne dieses Item“ wie in summary(). */
export function ItemHeatmap({ data }: { data: FrData }) {
  const cor = useMemo(() => frCorrelations(data), [data]);
  const [setup, setSetup] = useState<FrSetup>(frStart);
  const [hot, setHot] = useState<FrId | null>(null);
  const res = useMemo(() => frReliability(data, setup), [data, setup]);
  const stats = new Map(res.items.map(s => [s.id, s]));
  const isOn = (id: FrId) => setup.on.includes(id), isFlipped = (id: FrId) => setup.flipped.includes(id);
  const alphaOk = Number.isFinite(res.alpha);
  const head = (id: FrId) => [isFlipped(id) ? 'flip' : '', isOn(id) ? '' : 'off', hot === id ? 'hot' : ''].filter(Boolean).join(' ') || undefined;

  return <div className="s07-rel" style={VARS}>
    <div className="s07-rel-top">
      <div className="s07-rel-mapbox">
        <div className="s07-rel-scroll" tabIndex={0} role="region" aria-label="Heatmap: Korrelationen der acht Items">
          <table className="s07-rel-map">
            <caption>Korrelation r je zwei Items, wie <code>pearson_cor()</code> sie zeigt</caption>
            <thead><tr>
              <td className="s07-rel-corner" aria-hidden="true" />
              {FR_IDS.map(id => <th key={id} scope="col" className={head(id)}>{id}</th>)}
            </tr></thead>
            <tbody>{FR_IDS.map((a, i) => <tr key={a}>
              <th scope="row" className={head(a)}>{a}</th>
              {FR_IDS.map((b, j) => {
                if (i === j) return <td key={b} className="s07-rel-diag" />;
                const r = shownCorrelation(cor, i, j, setup.flipped), off = !isOn(a) || !isOn(b);
                const cls = [off ? 'off' : '', hot === a || hot === b ? 'hot' : ''].filter(Boolean).join(' ') || undefined;
                return <td key={b} className={cls} style={off ? undefined : { background: cellColor(r) }}
                  title={`${a} und ${b}: r = ${de(r, 3)}${off ? ' (nicht in der Skala)' : ''}`}>{shortR(r)}</td>;
              })}
            </tr>)}</tbody>
          </table>
        </div>
        <div className="s07-rel-legend">
          <span className="s07-rel-ramp" aria-hidden="true"><i style={{ background: `linear-gradient(90deg, ${NEG}, ${ROLE.empty}, ${POS})` }} /><span><span>−1</span><span>0</span><span>1</span></span></span>
          <span>rot: gegenläufig · grün: gleichläufig · je kräftiger, desto enger</span>
          <span><i className="s07-rel-chip flip" aria-hidden="true" />umgepolt</span>
          <span><i className="s07-rel-chip off" aria-hidden="true" />nicht in der Skala</span>
        </div>
      </div>

      <div className="s07-rel-panel" aria-live="polite">
        <p className="task-prompt">Wie stimmig messen die Items dasselbe?</p>
        <p className="s07-rel-alpha"><span>Cronbachs α</span><strong>{alphaOk ? de(res.alpha, 3) : '–'}</strong></p>
        <span className="s07-rel-bar" role="img" aria-label={`Cronbachs α: ${alphaOk ? de(res.alpha, 3) : 'nicht berechenbar'}`}>
          <i style={{ width: `${alphaOk ? Math.max(0, Math.min(1, res.alpha)) * 100 : 0}%` }} />
        </span>
        <span className="s07-rel-scale" aria-hidden="true"><span>0</span><span>0,5</span><span>1</span></span>
        <p className="task-field-help">{res.k >= 2
          ? <>{res.k} Items · {count(res.n)} Befragte haben alle {res.k} beantwortet</>
          : <>Nimm mindestens zwei Items in die Skala, dann gibt es ein α.</>}</p>
        <p className="task-field-help">Nahe 1: Die Befragten antworten auf alle Items einheitlich. Um 0 oder darunter: Die Items laufen gegeneinander.</p>
      </div>
    </div>

    <ul className="s07-rel-items" aria-label="Die acht Items: in die Skala nehmen und umpolen">
      {FR_IDS.map(id => {
        const on = isOn(id), flipped = isFlipped(id), s = stats.get(id);
        const up = s && alphaOk && s.alphaIfDeleted > res.alpha + 0.0005;
        return <li key={id} className={[on ? '' : 'off', flipped ? 'flip' : '', hot === id ? 'hot' : ''].filter(Boolean).join(' ') || undefined}
          onMouseEnter={() => setHot(id)} onMouseLeave={() => setHot(null)} onFocus={() => setHot(id)} onBlur={() => setHot(null)}>
          <label className="s07-rel-in">
            <input type="checkbox" checked={on} onChange={() => setSetup(prev => toggleFrOn(prev, id))} aria-label={`${id} in die Skala nehmen`} />
            <code>{id}</code>
          </label>
          <span className="s07-rel-text">{FR_ITEMS[id]}
            <small>{!on ? 'nicht in der Skala'
              : res.k < 2 || !s ? '–'
                : <>Trennschärfe <b className={s.corrected < 0 ? 'neg' : undefined}>{de(s.corrected, 3)}</b> · α ohne dieses Item <b className={up ? 'up' : undefined}>{de(s.alphaIfDeleted, 3)}{up ? ' ↑' : ''}</b></>}</small>
          </span>
          <button type="button" className="s07-rel-flip" aria-pressed={flipped} onClick={() => setSetup(prev => toggleFrFlip(prev, id))}
            aria-label={`${id} umpolen`}><ArrowUpDown size={14} aria-hidden="true" /> {flipped ? 'umgepolt' : 'umpolen'}</button>
        </li>;
      })}
    </ul>
    <p className="task-field-help">Antwortskala aller acht Items: {FR_SCALE}. Umpolen dreht sie um: Aus 1 wird 4, aus 4 wird 1. Die Items sind gekürzt; den genauen Wortlaut zeigt der ALLBUS-Fragebogen. Trennschärfe: wie eng ein Item mit der Summe der übrigen zusammenhängt (wie in <code>summary()</code>). ↑ heißt: Ohne dieses Item wäre α höher als jetzt.</p>
    <div className="sandbox-chips">
      <button type="button" disabled={!frChanged(setup)} onClick={() => setSetup(frStart())}>Zurück zum Datensatz</button>
    </div>
    <details className="s07-rel-code">
      <summary>So sähe deine Auswahl in R aus</summary>
      <RBlock code={frCode(setup)} />
    </details>
  </div>;
}
