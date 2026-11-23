import { questions, type Mark, type Sheet } from './content';

export function describe(mark: Mark): string {
  switch (mark.kind) {
    case 'cross': return mark.at.length > 1 ? `Kreuze bei „${mark.at.join('“ und „')}“` : `Kreuz bei „${mark.at[0]}“`;
    case 'struck': return `„${mark.struck}“ angekreuzt und durchgestrichen, Kreuz bei „${mark.at}“`;
    case 'between': return `Kreuz auf der Linie zwischen ${mark.a} und ${mark.b}`;
    case 'note': return `kein Kreuz, Randnotiz: ${mark.text}`;
    case 'empty': return 'kein Kreuz';
    case 'absent': return '';
  }
}

function Options({ options, mark }: { options: string[]; mark: Mark }) {
  const option = (o: string) => {
    const crossed = (mark.kind === 'cross' && mark.at.includes(o)) || (mark.kind === 'struck' && (mark.at === o || mark.struck === o));
    const struck = mark.kind === 'struck' && mark.struck === o;
    return <span key={o} className="s02-option">
      <span className="s02-box">{crossed ? '✕' : ''}</span>
      {struck ? <s>{o}</s> : o}
      {mark.kind === 'between' && mark.a === o && <span className="s02-between">✕</span>}
    </span>;
  };
  // Kreuz auf der Linie: Die beiden Nachbarn bleiben in einer Zeile, sonst sähe es aus wie ein Kreuz am Zeilenende.
  const pair = mark.kind === 'between' ? options.indexOf(mark.a) : -1;
  if (pair < 0 || options[pair + 1] !== (mark.kind === 'between' ? mark.b : '')) return <span className="s02-options">{options.map(option)}</span>;
  return <span className="s02-options">
    {options.slice(0, pair).map(option)}
    <span key="pair" style={{ display: 'inline-flex', gap: '4px 10px', whiteSpace: 'nowrap' }}>{option(options[pair])}{option(options[pair + 1])}</span>
    {options.slice(pair + 2).map(option)}
  </span>;
}

/** Nachgestellter Papierbogen. Fragen, die in einer Version fehlen, stehen nicht auf dem Bogen. */
export function PaperSheet({ sheet }: { sheet: Sheet }) {
  return <figure className="s02-paper" aria-label={`Bogen ${sheet.id}, Version ${sheet.version}`}>
    <figcaption>Fragebogen · Version {sheet.version} · Bogen {sheet.id}</figcaption>
    <ol>
      {questions.filter(q => sheet.cells[q.variable].mark.kind !== 'absent').map(q => {
        const mark = sheet.cells[q.variable].mark;
        return <li key={q.variable}>
          <p>{q.text}</p>
          <Options options={q.options} mark={mark} />
          {mark.kind === 'note' && <span className="s02-note">{mark.text}</span>}
          <span className="sr-only">{describe(mark)}</span>
        </li>;
      })}
    </ol>
  </figure>;
}
