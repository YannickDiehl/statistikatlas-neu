import type { ReactNode } from 'react';

const LEVELS = ['Hilfe, Stufe 1: Denkanstoß', 'Hilfe, Stufe 2: Wo schaue ich?', 'Hilfe, Stufe 3: Lösung'] as const;

/** Help in three levels, each a closed native details. Strings become paragraphs. */
export function Hints({ steps }: { steps: [ReactNode, ReactNode, ReactNode] }) {
  return <>{steps.map((s, i) => <details className="hilfe" key={i}>
    <summary>{LEVELS[i]}</summary>
    {typeof s === 'string' ? <p>{s}</p> : s}
  </details>)}</>;
}
