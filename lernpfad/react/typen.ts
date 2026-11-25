import type { ComponentType, ReactNode } from 'react';

/** Ein Thema im Reiter „Verstehen“: Vorweg, je Aufgabe ein Abschnitt, Überblick. Karten = [id, Titel] für die rechte Leiste. */
export type Thema = { id: string; n: string; kurz: string; titel: string; karten: [string, string][]; Inhalt: ComponentType; aufgabe?: number; minuten: number };

/** Ein Baustein in einer Aufgabe (z. B. Rätsel, Prüfung): meldet sich mit fertig() als erledigt. */
export type Baustein = ComponentType<{ fertig: () => void }>;

/** Mitnehmen: das Wichtigste mit Verweis auf eine Karte, und zu jeder Selbsttest-Frage die Karte zum Nachlesen. */
export type MitnehmenDaten = {
  wichtig: [ReactNode, string, string][];
  selbstKarte: [string, string][];
  workshop?: string;
  /** Nur wenn content.ts keinen SELF_TEST/SCRIPT/SCRIPT_FILE im üblichen Format hat. */
  selbsttest?: { question: string; options: (string | { text: string; why?: string })[]; answer: number; why?: string }[];
  skript?: string;
  skriptDatei?: string;
};
