// Kapitel 1: Bausteine in Aufgaben. „Umgebung“ zeigt in Aufgabe 1, Schritt 5, das Environment von RStudio (Atlas-Bild mit Textfassung).
import type { Baustein } from '../../react/typen';
import { EnvironmentPicture } from '@atlas/chapter/s01/figures/Pictures';
import '@atlas/chapter/s01/s01.css';

export const BAUSTEINE: Record<string, Baustein> = {
  Umgebung: () => <EnvironmentPicture caption={<>So taucht dein Objekt <code>allbus</code> in RStudio auf. Die Zahlen siehst du bei dir; sie sind dieselben wie bei <code>dim(allbus)</code>.</>} />,
};
