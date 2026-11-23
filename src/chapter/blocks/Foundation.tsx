import type { ReactNode } from 'react';
import { HeadingLevel } from './level';

/** „Thema n: …“ line with a stone (h3). `n` may also be a sign such as „✓“ for the overview. */
export function TopicHeading({ id, n, title }: { id: string; n: number | string; title: ReactNode }) {
  return <div className="thema" id={id}><span className="st m c7" aria-hidden="true">{n}</span><h3>{title}</h3></div>;
}

/**
 * Foundation block before its task (h4); cards inside are h5.
 * Without `taskHref` (overview) there is no skip link; `eyebrow` replaces „Grundlage zu Aufgabe n“.
 */
export function Foundation({ id, n, title, intro, taskHref, eyebrow, children }: {
  id: string;
  n: number | string;
  title: ReactNode;
  intro?: ReactNode;
  taskHref?: string;
  eyebrow?: string;
  children?: ReactNode;
}) {
  return <section className="grund-block" id={id} aria-labelledby={`${id}-h`}>
    <div className="g-kopf">
      <span className="st m c7" aria-hidden="true">{n}</span>
      <div><div className="ueber">{eyebrow ?? `Grundlage zu Aufgabe ${n}`}</div><h4 id={`${id}-h`}>{title}</h4></div>
      {taskHref ? <a className="zur" href={taskHref}>{`Schon klar? Direkt zu Aufgabe ${n} ↓`}</a> : null}
    </div>
    {intro ? <p className="g-intro">{intro}</p> : null}
    <HeadingLevel.Provider value={5}>{children}</HeadingLevel.Provider>
  </section>;
}
