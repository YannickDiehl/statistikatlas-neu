import * as pictures from './index';

export type CompanionName = keyof typeof pictures;

/** A decorative companion figure from the R-Workshop e-book. Hidden from screen readers. */
export function Companion({ name, className }: { name: CompanionName; className?: string }) {
  return <span className={className ? `begleiter ${className}` : 'begleiter'} aria-hidden="true" dangerouslySetInnerHTML={{ __html: pictures[name] }} />;
}
