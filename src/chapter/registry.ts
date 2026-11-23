import type { ReactNode } from 'react';
import { Session1, session1Status } from './s01/Session1';
import { Session10, session10Status } from './s10/Session10';
import { Session11, session11Status } from './s11/Session11';
import { Session2, session2Status } from './s02/Session2';
import { Session3, session3Status } from './s03/Session3';
import { Session4, session4Status } from './s04/Session4';
import { Session5, session5Status } from './s05/Session5';
import { Session6, session6Status } from './s06/Session6';
import { Session7, session7Status } from './s07/Session7';
import { Session8, session8Status } from './s08/Session8';
import { Session9, session9Status } from './s09/Session9';
import type { ChapterState } from './state';

export type ChapterEntry = {
  Component: () => ReactNode;
  status: (state: ChapterState) => 'open' | 'running' | 'done';
  /** false: shows only with ?vorschau=kapitel; true: replaces the mission for everyone. */
  live: boolean;
};

/** Chapters by curriculum session id. A new chapter is one import and one entry. */
export const chapterRegistry: Partial<Record<number, ChapterEntry>> = {
  1: { Component: Session1, status: session1Status, live: false },
  10: { Component: Session10, status: session10Status, live: false },
  11: { Component: Session11, status: session11Status, live: false },
  2: { Component: Session2, status: session2Status, live: false },
  3: { Component: Session3, status: session3Status, live: false },
  4: { Component: Session4, status: session4Status, live: false },
  5: { Component: Session5, status: session5Status, live: false },
  6: { Component: Session6, status: session6Status, live: false },
  7: { Component: Session7, status: session7Status, live: false },
  8: { Component: Session8, status: session8Status, live: false },
  9: { Component: Session9, status: session9Status, live: false },
};

/** The chapter to show for a session: live chapters for everyone, the others only in preview mode. */
export function activeChapter(registry: Partial<Record<number, ChapterEntry>>, id: number, preview: boolean): ChapterEntry | undefined {
  const chapter = registry[id];
  return chapter && (chapter.live || preview) ? chapter : undefined;
}
