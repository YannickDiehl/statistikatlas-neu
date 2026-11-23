import type { ReactNode } from 'react';
import { Companion, type CompanionName } from '../companions/Companion';
import { Heading, useHeadingLevel } from './level';

export type TagKind = 'estimate' | 'picture' | 'adapt' | 'interpret';
const TAG_CLASS: Record<TagKind, string> = { estimate: 'schaetzen', picture: 'bild', adapt: 'anpassen', interpret: 'deuten' };

/** Small coloured label in a card head, e.g. „Schätzen“, „Im Bild“, „Code lesen“, „Deuten“. */
export function Tag({ kind, label }: { kind: TagKind; label: string }) {
  return <span className={`art ${TAG_CLASS[kind]}`}>{label}</span>;
}

/** Gray badge for repetitions and „neu heute“. */
export function Badge({ children }: { children?: ReactNode }) {
  return <span className="wdh">{children}</span>;
}

/**
 * Gray badge „kennst du aus Sitzung n“, optionally with what is known („Startblock: kennst du aus Sitzung 1“).
 * `label` replaces „kennst du aus Sitzung n“ with free text („kennst du aus Methoden Ia“).
 */
export function Known({ session, what, label }: { session?: number; what?: string; label?: string }) {
  return <Badge>{`${what ? `${what}: ` : ''}${label ?? `kennst du aus Sitzung ${session}`}`}</Badge>;
}

/**
 * A card: inside a Foundation with a step number („1a“, h5), in „Vorweg“ with a stone („R“, h4).
 * The step number is part of the heading and read as „Schritt 1a“.
 */
export function Card({ id, step, stone, title, tag, badge, companion, children }: {
  id: string;
  step?: string;
  stone?: string;
  title: ReactNode;
  tag?: { kind: TagKind; label: string };
  badge?: ReactNode;
  companion?: CompanionName;
  children?: ReactNode;
}) {
  const level = useHeadingLevel();
  return <section className="karte" id={id} aria-labelledby={`${id}-h`}>
    {companion ? <Companion name={companion} className="figur" /> : null}
    <div className="karte-kopf">
      {stone ? <span className="st m c7" aria-hidden="true">{stone}</span> : null}
      <Heading level={level} id={`${id}-h`}>
        {step ? <span className="g-schritt"><span className="sr-only">Schritt </span>{step}</span> : null}
        {title}
      </Heading>
      {badge}
      {tag ? <Tag {...tag} /> : null}
    </div>
    {children}
  </section>;
}

/** „Kurz gesagt:“ box with the tip companion. */
export function InShort({ children }: { children?: ReactNode }) {
  return <div className="kurz"><Companion name="tipp" /><p><b className="t">Kurz gesagt:</b> {children}</p></div>;
}

/** Native details „Genauer erklärt: …“. */
export function MoreDetail({ summary, children }: { summary: string; children?: ReactNode }) {
  return <details className="genauer"><summary>{`Genauer erklärt: ${summary}`}</summary>{children}</details>;
}

/** „Häufige Verwechslung:“ note. */
export function Mixup({ children }: { children?: ReactNode }) {
  return <p className="verwechslung"><b>Häufige Verwechslung:</b> {children}</p>;
}
