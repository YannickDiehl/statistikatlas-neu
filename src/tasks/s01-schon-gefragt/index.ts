import type { TaskDef } from '../types';
import { initialS01, parseS01, statusS01, type S01State } from './domain';
import { SchonGefragt } from './SchonGefragt';

export const schonGefragt: TaskDef<S01State> = {
  id: 's01',
  title: 'Schon gefragt?',
  role: 'Referent:in im Abgeordnetenbüro',
  intro: 'Ein Abgeordnetenbüro plant eine eigene Umfrage. Du prüfst mit R, welche der geplanten Fragen der ALLBUS 2023 schon gestellt hat. Dafür lädst du einmal deine ALLBUS-Datei – sie gilt danach für alle Sitzungen.',
  requiredVariables: ['rh08b', 'pt03'],
  initial: initialS01,
  parse: parseS01,
  status: statusS01,
  Component: SchonGefragt,
};
