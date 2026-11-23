/** Gemeinsame Farben für alle Grafiken im Lernpfad: bunt, aber ruhig genug für Text daneben.
 *  Parteien bekommen ihre offiziellen Parteifarben (PARTY). Gruppen ohne Reihenfolge bekommen CAT in dieser Reihenfolge; geordnete Antwortskalen ORDERED (rot = wenig/schlecht, grün = viel/gut).
 *  Feste Rollen (ROLE) bedeuten in jeder Sitzung dasselbe: Tipp = blau, echte Daten = orange, Mittelwert = rot, Modell = türkis. */
export const CAT = ['#4e79a7', '#f28e2b', '#59a14f', '#e15759', '#b07aa1', '#76b7b2', '#edc948', '#ff9da7', '#9c755f'];

/** Dunklere Fassung derselben Farben für Linien und Text auf Weiß. */
export const CAT_DARK = ['#2f5a85', '#c2650c', '#3b7d33', '#b8343a', '#8a5480', '#3f8a84', '#a8860f', '#d0606d', '#76523e'];

export const ROLE = {
  guess: '#3266b8', guessLight: '#9db8e6',
  data: '#e8732a', dataLight: '#f7c6a3',
  mean: '#d1495b',
  model: '#1f9e89', modelLight: '#a7dcd2',
  ink: '#242822', muted: '#62695e', grid: '#e8e6dd', missing: '#d9d6ce', empty: '#ffffff',
};

/** Offizielle Parteifarben, nach den Codes der Wahlabsicht im ALLBUS (pv01). Sobald Parteien in einer Grafik stehen, gelten diese Farben.
 *  „andere Partei“ und „würde nicht wählen“ sind keine Parteien: mittelgrau bzw. schiefergrau, klar unterscheidbar von den hellgrauen fehlenden Werten. */
export const PARTY: Record<number, string> = {
  1: '#000000', // CDU/CSU
  2: '#e3000f', // SPD
  3: '#ffed00', // FDP
  4: '#46962b', // Bündnis 90/Die Grünen
  6: '#be3075', // Die Linke
  42: '#009ee0', // AfD
  90: '#a0a0a0', // andere Partei
  91: '#5f6b7a', // würde nicht wählen
};

/** Rot → Gelb → Grün, für Skalen mit Reihenfolge. */
const SCALE = ['#d73027', '#f46d43', '#fdae61', '#fee08b', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850'];

const hex = (h: string) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => `#${hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, '0')).join('')}`;

/** Farbe an Position t (0 = rot, 1 = grün) auf der Skala. */
export const scaleAt = (t: number) => {
  const x = Math.min(1, Math.max(0, t)) * (SCALE.length - 1), i = Math.min(SCALE.length - 2, Math.floor(x));
  return mix(SCALE[i], SCALE[i + 1], x - i);
};

/** n Farben für eine geordnete Skala; `reverse`, wenn der erste Code das Gute meint (z. B. 1 = sehr zufrieden). */
export const ordered = (n: number, reverse = false) => Array.from({ length: n }, (_, i) => scaleAt(n === 1 ? 1 : (reverse ? n - 1 - i : i) / (n - 1)));

/** n Gruppenfarben: CAT der Reihe nach. */
export const categorical = (n: number) => Array.from({ length: n }, (_, i) => CAT[i % CAT.length]);

/** Hellere Fassung einer Farbe (t = 0 bleibt, t = 1 wird weiß). */
export const lighten = (color: string, t: number) => mix(color, '#ffffff', t);
