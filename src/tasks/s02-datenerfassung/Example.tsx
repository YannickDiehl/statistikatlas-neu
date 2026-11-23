import type { SavFile } from '../../sandbox/readSav';
import { exampleNotes, questions, S02_VARS, sheets } from './content';
import { resolve } from './domain';
import { describe } from './PaperSheet';

/** Bogen 1 vorgemacht: Kreuz → Codebuch → Code. Codes und Wertelabels kommen aus der geladenen Datei. */
export function Example({ sav }: { sav: SavFile }) {
  const sheet = sheets[0];
  return <div className="task-card s02-example">
    <h4>Vorgemacht: Bogen 1 (Version A)</h4>
    <p className="sandbox-note">So wird ein Bogen erfasst. Trag die fett gedruckten Codes aus der rechten Spalte unten in die Tabelle ein, Spalte „Bogen 1“. Die Bögen 2 und 3 erfasst du danach genauso, aber selbst.</p>
    <table className="sandbox-table s02-example-table" lang="de" style={{ hyphens: 'auto' }}>
      <thead><tr><th scope="col">Variable</th><th scope="col">Auf dem Bogen</th><th scope="col">Im Codebuch: Code</th></tr></thead>
      <tbody>{S02_VARS.map(v => {
        const cell = sheet.cells[v];
        const code = resolve(sav, v, cell.soll);
        const label = code === null ? null : sav.byName.get(v)?.valueLabels.get(code);
        const q = questions.find(x => x.variable === v)!;
        return <tr key={v}>
          <th scope="row"><code>{v}</code></th>
          <td>{cell.mark.kind === 'absent' ? <em>Frage fehlt auf dem Bogen</em> : describe(cell.mark)}<small>{q.text.replace(/\s*\(.*\)$/, '')}</small></td>
          <td><strong>{code ?? '–'}</strong>{code !== null && (label && label !== '..' ? ` = ${label}` : ' (Zahl auf der Skala)')}<small>{exampleNotes[v]}</small></td>
        </tr>;
      })}</tbody>
    </table>
  </div>;
}
