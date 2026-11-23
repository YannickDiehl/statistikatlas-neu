import { createContext, useContext, type HTMLAttributes } from 'react';

/**
 * Heading levels inside a chapter. LearningPath owns the h2 (session title);
 * topics and parts are h3, foundations and tasks h4, cards inside a foundation h5.
 * Cards outside a foundation (Vorweg) are h4.
 */
export type Level = 3 | 4 | 5 | 6;
export const HeadingLevel = createContext<Level>(4);
export const useHeadingLevel = () => useContext(HeadingLevel);

export function Heading({ level, ...props }: { level: Level } & HTMLAttributes<HTMLHeadingElement>) {
  const Tag = `h${level}` as 'h3' | 'h4' | 'h5' | 'h6';
  return <Tag {...props} />;
}
