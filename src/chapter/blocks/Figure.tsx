import type { ReactNode } from 'react';

/**
 * Inline SVG picture (string from a generated `index.ts`) with an equivalent text version.
 * `alt` is required and checked at runtime: a picture without text fails loudly.
 */
export function Figure({ svg, alt, caption }: { svg: string; alt: string; caption?: ReactNode }) {
  if (typeof alt !== 'string' || !alt.trim()) throw new Error('Figure: alt text is required (equivalent text version of the picture).');
  return <figure className="ebild">
    <div className="ebild-bild" role="img" aria-label={alt} dangerouslySetInnerHTML={{ __html: svg }} />
    {caption ? <figcaption>{caption}</figcaption> : null}
  </figure>;
}
