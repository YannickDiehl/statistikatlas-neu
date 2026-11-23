import type { ReactNode } from 'react';

/** Eine Funktion, die in diesem Schritt zum ersten Mal vorkommt. */
export type NewFunction = { fn: string; text: ReactNode };

/** Führung für einen Arbeitsschritt: wozu er dient, welche Funktionen neu sind, was nacheinander zu tun ist und woran man merkt, dass man fertig ist. */
export function StepGuide({ why, introduces, steps, done, children }: { why?: ReactNode; introduces?: NewFunction[]; steps: ReactNode[]; done?: ReactNode; children?: ReactNode }) {
  return <div className="task-guide">
    {why && <p className="task-guide-why">{why}</p>}
    {introduces && introduces.length > 0 && <>
      <p className="task-guide-head">Neu in diesem Schritt</p>
      <ul className="task-guide-new">{introduces.map(f => <li key={f.fn}><code>{f.fn}</code> {f.text}</li>)}</ul>
    </>}
    <p className="task-guide-head">So gehst du vor</p>
    <ol className="task-guide-steps">{steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
    {children}
    {done && <p className="task-guide-done"><strong>Fertig, wenn</strong> {done}</p>}
  </div>;
}
