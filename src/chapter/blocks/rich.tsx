import type { ReactNode } from 'react';

/** Renders `backtick` segments of a text as <code>; a lone backtick stays as it is. */
export function withCode(text: string): ReactNode {
  const parts = text.split(/`([^`]+)`/);
  if (parts.length === 1) return text;
  return parts.map((p, i) => (i % 2 ? <code key={i}>{p}</code> : p));
}
