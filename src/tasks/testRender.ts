import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LearningPath } from '../components/LearningPath';
import { fixtureSav } from '../sandbox/testData';
import { plainCode } from './kit/RCode';
import type { TaskStore } from './kit/storage';

/** Rendert eine Sitzung des Lernpfads mit der synthetischen Testdatei (nur für Tests). */
export const testData = () => ({ sav: fixtureSav(), fileName: 'ZA8831_v1-3-0.sav', version: 'v1.3.0', bytes: new ArrayBuffer(0) });
export const renderSession = (sessionIndex: number, withData = true, tasks: TaskStore = { tasks: {} }, preview = false) =>
  plainCode(renderToStaticMarkup(createElement(LearningPath, {
    onConcept: () => {}, sessionIndex, onSessionChange: () => {}, initialData: withData ? testData() : null, initialTasks: tasks, preview,
  })));
