import type { TaskDef } from '../types';
import { initialGrafik, parseGrafik, statusGrafik, type GrafikState } from './domain';
import { ErstZeichnen } from './ErstZeichnen';

export const erstZeichnen: TaskDef<GrafikState> = {
  id: 'grafik',
  title: 'Erst zeichnen, dann zeigen',
  role: 'Grafikredaktion eines Schulbuchverlags',
  intro: 'Ein Schulbuchverlag braucht Grafiken für die Doppelseite „Wie geht es Deutschland?“. Du zeichnest mit ggplot2 – und entscheidest, wie man ehrlich zeigt, was die Daten sagen.',
  requiredVariables: ['ls01', 'hs01', 'pa02a', 'pa01', 'dw15', 'age', 'eastwest', 'sex', 'ps03'],
  initial: initialGrafik,
  parse: parseGrafik,
  status: statusGrafik,
  Component: ErstZeichnen,
};
