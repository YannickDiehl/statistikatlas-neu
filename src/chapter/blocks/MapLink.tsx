import { createContext, useContext, type ReactNode } from 'react';
import { conceptById } from '../../domain/concepts';

/** Links a chapter can follow out of itself. LearningPath sets `onConcept` from its own prop (opens the free map). */
export type ChapterLinks = { onConcept?: (id: string) => void };
export const ChapterLinksContext = createContext<ChapterLinks>({});
export const useChapterLinks = () => useContext(ChapterLinksContext);

/**
 * „→ In der freien Karte: …“. A button styled as a link that opens `concept` in the free map; plain text when the
 * chapter has no `onConcept` (tests, offline previews) or the free map does not know the id.
 */
export function MapLink({ concept, className = 'hilfe-zeile', children }: {
  /** Concept id of the free map (src/domain/concepts.ts). */
  concept: string;
  className?: string;
  children?: ReactNode;
}) {
  const { onConcept } = useChapterLinks();
  const text = typeof children === 'string' ? `→ In der freien Karte: ${children}` : <>→ In der freien Karte: {children}</>;
  const open = onConcept && conceptById[concept] ? onConcept : undefined;
  return <p className={className} data-concept={concept}>
    {open ? <button type="button" className="karte-link" onClick={() => open(concept)}>{text}</button> : text}
  </p>;
}
