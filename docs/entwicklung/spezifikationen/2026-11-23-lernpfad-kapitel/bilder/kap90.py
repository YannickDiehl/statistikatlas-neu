"""Abbildungen für den Lernpfad, Sitzung 4 „Daten sehen“ (Prototyp v7). Bildsprache wie BILDER.md.

Jedes Bild zeigt genau den Schritt, neben dem es steht, mit dessen Variablen und Code.
Steine je Person sind konstruierte Beispielwerte („zum Beispiel“), keine echten Befragten.
Gesamtzahlen (Reihen, Häufigkeiten von hs01) stammen aus ALLBUS 2023 (ZA8831_v1-3-0.sav),
geprüft mit R und mariposa 0.7.4: hs01 gültig 5.209, fehlend 37 (SEHR GUT 864, GUT 2.071,
ZUFRIEDENSTELLEND 1.470, WENIGER GUT 616, SCHLECHT 188); xt10: 220 ohne Dauer, 497 über 180,
4.529 bis 180 Minuten.
"""
from lego import (Canvas, R, P, text, rect, label_box, tokens, stein, schild, arrow, down_arrow, outline, connector,
                  eyebrow, text_width, INK, GRAY, GREEN, ORANGE, CARDLINE, WHITE, DARKORANGE, STEIN, MONO, SANS,
                  C, L, RT)
from kap03 import mono, notiz, platte
from kap04 import kopf, punkte, lstein, lstein_breite, codezeile
from kap06 import achsentext

GGGRAU = "#EBEBEB"          # Hintergrund der Zeichenfläche in ggplot2
BALKEN = "#595959"          # Standardfarbe von geom_bar()
STUFEN = ["SEHR GUT", "GUT", "ZUFRIEDENSTELLEND", "WENIGER GUT", "SCHLECHT"]
HS01_N = [864, 2071, 1470, 616, 188]          # frequency(hs01), Spalte N


def code_zeilen(zeilen, size=11):
    """Code-Zeilen untereinander; %>% und + am Zeilenende grün."""
    ps = []
    for z in zeilen:
        runs = []
        for ende in (" %>%", " +"):
            if z.endswith(ende):
                runs = [R(z[: -len(ende)], font=MONO, size=size, bold=True),
                        R(ende, font=MONO, size=size, bold=True, color=GREEN)]
                break
        if not runs:
            runs = [R(z, font=MONO, size=size, bold=True)]
        ps.append(P(*runs, ls=size * 1.4))
    return ps


def gestaffelt(s, mitten, y, labels, size=10):
    """Achsenbeschriftung wie in ggplot2 (grau, Systemschrift), abwechselnd in zwei Zeilen, damit lange Wörter
    nicht übereinanderliegen."""
    for k, (m, t) in enumerate(zip(mitten, labels)):
        w = text_width(t, SANS, size) + 0.1
        text(s, m - w / 2, y + (0.22 if k % 2 else 0), w, 0.22, [P(R(t, size=size, color=GRAY), align=C)],
             anchor="middle")


# A1, Schritt 2: to_label(hs01) macht aus Zahlen mit Aufkleber Wörter; der leere Stein wird zum Balken NA ----------
def to_label_hs01():
    s = Canvas(7.6, 5.75)
    text(s, 0.15, 0.1, 4.0, 0.25, notiz("zum Beispiel sechs Befragte", size=10.5, align="start"))
    reihen = [("2", "GUT"), ("1", "SEHR GUT"), ("2", "GUT"), ("", "KEINE ANGABE"), ("3", "ZUFRIEDENSTELLEND"),
              ("4", "WENIGER GUT")]
    h, pitch, top = 0.28, 0.34, 0.98
    lw = lstein_breite("ZUFRIEDENSTELLEND")
    lx = 0.3
    kopf(s, lx, lw, 0.42, "hs01", "<dbl+lbl>")
    for i, (wert, label) in enumerate(reihen):
        lstein(s, lx, top + i * pitch, lw, h, "num" if wert else "na", wert, label, size=11)
    unten = top + 5 * pitch + h
    platte(s, lx - 0.1, unten + 0.07, lw + 0.2)
    mitte = (top + unten) / 2
    ax = lx + lw + 0.25
    text(s, ax - 0.2, mitte - 0.45, 1.3, 0.28, mono("to_label()", size=11, color=GREEN))
    arrow(s, ax, mitte - 0.14, w=0.9, h=0.28, color=GREEN)
    rx, rw = ax + 1.15, text_width("ZUFRIEDENSTELLEND", MONO, 11, True) + 0.22
    kopf(s, rx, rw, 0.42, "hs01", "<fct>")
    for i, (wert, label) in enumerate(reihen):
        y = top + i * pitch
        if wert:
            stein(s, rx, y, rw, h, "txt", label, size=11)
        else:
            stein(s, rx, y, rw, h, "na", "")
            text(s, rx, y, rw, h, mono("NA", size=11, color=GRAY), anchor="middle")
    platte(s, rx - 0.1, unten + 0.07, rw + 0.2)
    leer_y = top + 3 * pitch
    outline(s, rx - 0.06, leer_y - 0.1, rw + 0.12, h + 0.15, color=ORANGE, lw=1.75)
    # darunter: geom_bar() stapelt gleiche Wörter zu Balken, der leere Stein bekommt einen eigenen Balken
    dx = rx + rw / 2 - 0.16
    down_arrow(s, dx, unten + 0.22, w=0.32, h=0.42, color=GREEN)
    text(s, dx - 3.35, unten + 0.27, 3.25, 0.3, mono("ggplot(aes(x = hs01)) + geom_bar()", size=10.5, color=GREEN,
                                                    align=RT), anchor="middle")
    base, sw, sh, sp = 4.62, 0.78, 0.24, 0.29
    pitch_x = 1.2
    x0 = 0.55
    anzahl = {"SEHR GUT": 1, "GUT": 2, "ZUFRIEDENSTELLEND": 1, "WENIGER GUT": 1, "SCHLECHT": 0, "NA": 1}
    mitten = []
    for k, stufe in enumerate(STUFEN + ["NA"]):
        cx = x0 + k * pitch_x
        mitten.append(cx + sw / 2)
        for j in range(anzahl[stufe]):
            stein(s, cx, base - (j + 1) * sp, sw, sh, "na" if stufe == "NA" else "txt", "")
    connector(s, x0 - 0.2, base + 0.02, x0 + 5 * pitch_x + sw + 0.2, base + 0.02, color=GRAY, width=1.0)
    gestaffelt(s, mitten, base + 0.17, STUFEN + ["NA"], size=10)
    nx = x0 + 5 * pitch_x
    outline(s, nx - 0.07, base - sp - 0.1, sw + 0.14, sp + 0.08, color=ORANGE, lw=1.75)
    text(s, 0.15, 5.4, 7.3, 0.28, codezeile("allbus %>% to_label(hs01) %>% ggplot(aes(x = hs01)) + geom_bar()",
                                             size=10.5))
    return s


# A1, Schritt 3: drop_na(hs01) lässt nur die Reihen weg, in denen hs01 leer ist ---------------------------------------
def drop_na_hs01():
    s = Canvas(7.6, 3.95)
    text(s, 0.15, 0.1, 4.0, 0.25, notiz("zum Beispiel fünf Befragte", size=10.5, align="start"))
    reihen = [("GUT", "34"), ("", "61"), ("SEHR GUT", ""), ("ZUFRIEDENSTELLEND", "72"), ("GUT", "45")]
    h, pitch, top = 0.28, 0.36, 1.02
    hw, aw = text_width("ZUFRIEDENSTELLEND", MONO, 11, True) + 0.22, 0.6

    def platte_mit(x0, zeilen, links):
        kopf(s, x0, hw, 0.44, "hs01", "<fct>")
        kopf(s, x0 + hw + 0.12, aw, 0.44, "age", "<dbl+lbl>")
        for i, (stufe, alter) in enumerate(zeilen):
            y = top + i * pitch
            weg = links and stufe == ""
            if stufe:
                stein(s, x0, y, hw, h, "txt", stufe, size=11)
            else:
                stein(s, x0, y, hw, h, "na", "")
                text(s, x0, y, hw, h, mono("NA", size=11, color=GRAY), anchor="middle")
            if alter:
                stein(s, x0 + hw + 0.12, y, aw, h, "dim" if weg else "num", alter, size=11)
            else:
                stein(s, x0 + hw + 0.12, y, aw, h, "na", "")
        ende = x0 + hw + 0.12 + aw
        punkte(s, ende + 0.02, top + (len(zeilen) - 1) / 2 * pitch - 0.02, w=0.3)
        unten = top + (len(zeilen) - 1) * pitch + h
        platte(s, x0 - 0.1, unten + 0.07, ende + 0.35 - (x0 - 0.1))
        return ende, unten

    x0 = 0.25
    text(s, x0 - 0.1, 0.14, 3.0, 0.25, mono("5,246 × 579", size=10.5, color=GRAY, align=RT))
    ende, unten = platte_mit(x0, reihen, True)
    # Reihe 2: hs01 leer, fällt weg; Reihe 3: nur age leer, bleibt
    outline(s, x0 - 0.06, top + pitch - 0.08, hw + 0.12, h + 0.14, color=GRAY, lw=1.5)
    outline(s, x0 + hw + 0.06, top + 2 * pitch - 0.08, aw + 0.12, h + 0.14, color=ORANGE, lw=1.75)
    mitte = (top + unten) / 2
    ax = ende + 0.55
    text(s, ax - 0.35, mitte - 0.5, 1.45, 0.28, mono("drop_na(hs01)", size=11, color=GREEN))
    arrow(s, ax, mitte - 0.14, w=0.72, h=0.28, color=GREEN)
    rx = ax + 0.95
    text(s, rx - 0.1, 0.14, 3.0, 0.25, mono("5,209 × 579", size=10.5, color=GRAY, align=RT))
    platte_mit(rx, [r for r in reihen if r[0]], False)
    ly = unten + 0.2
    rect(s, 0.2, ly + 0.04, 0.22, 0.17, WHITE, GRAY, 1.5)
    text(s, 0.5, ly, 3.4, 0.25, [P(R("hs01 leer: Reihe fällt weg", size=10.5, color=GRAY))], anchor="middle")
    rect(s, 0.2, ly + 0.32, 0.22, 0.17, WHITE, ORANGE, 1.75)
    text(s, 0.5, ly + 0.28, 3.4, 0.25, [P(R("nur age leer: Reihe bleibt", size=10.5, color=DARKORANGE))],
         anchor="middle")
    text(s, 0.15, 3.58, 7.3, 0.28, codezeile("allbus %>% to_label(hs01) %>% drop_na(hs01)", size=10.5))
    return s


def mini_platte(s, x, base, kinds, n, w=0.13, gap=0.03, hoehe=0.09):
    """Kleine Bauplatte ohne Werte: Türme der Datentypen kinds mit n Steinen; gibt die Breite zurück."""
    for j, kind in enumerate(kinds):
        for i in range(n):
            rect(s, x + j * (w + gap), base - (i + 1) * (hoehe + 0.02), w, hoehe, STEIN[kind][0], STEIN[kind][1], 0.5)
    breite = len(kinds) * w + (len(kinds) - 1) * gap
    rect(s, x - 0.03, base, breite + 0.06, 0.04, GRAY)
    return breite


def leinwand(s, x, y, w, h, balken):
    """Zeichenfläche wie ggplot2: grau mit weißen Gitterlinien; x-Achse mit den Stufen von hs01.
    Die y-Achse (count) mit Zahlen und waagrechten Gitterlinien entsteht erst mit geom_bar(),
    darum zeigt die leere Leinwand (balken=False) nur die x-Achse."""
    rect(s, x, y, w, h, GGGRAU)
    n = len(STUFEN)
    X = lambda k: x + (k + 0.5) / n * w           # noqa: E731
    Y = lambda v: y + h - 0.05 - v / 2200 * (h - 0.12)   # noqa: E731
    if balken:
        for v in (0, 500, 1000, 1500, 2000):
            connector(s, x, Y(v), x + w, Y(v), color=WHITE, width=0.75)
            achsentext(s, str(v), x - 0.06, Y(v), 0.5, align=RT)
    for k in range(n):
        connector(s, X(k), y, X(k), y + h, color=WHITE, width=0.75)
    if balken:
        bw = 0.9 / n * w
        for k, anz in enumerate(HS01_N):
            rect(s, X(k) - bw / 2, Y(anz), bw, Y(0) - Y(anz), BALKEN)
    gestaffelt(s, [X(k) for k in range(n)], y + h + 0.13, STUFEN, size=10)


# A1, Schritt 4: die ganze Kette Zeile für Zeile; bis ggplot() reicht %>% die Bauplatte weiter, danach legt + auf ----
def kette_hs01():
    s = Canvas(7.6, 5.65)
    zeilen = [("allbus %>%", 0.35), ("  to_label(hs01) %>%", 1.05), ("  drop_na(hs01) %>%", 1.75),
              ("  ggplot(aes(x = hs01)) +", 2.45), ("  geom_bar()", 4.5)]
    for z, y in zeilen:
        text(s, 0.15, y, 3.2, 0.3, code_zeilen([z], size=11.5), anchor="middle")
    rx = 3.95
    # 1 bis 3: die Bauplatte
    blau = ["num"] * 5
    schild(s, rx, 0.15, "allbus", w=0.95)
    mini_platte(s, rx + 1.1, 0.62, blau, 4)
    text(s, rx + 2.05, 0.25, 1.5, 0.3, mono("5,246 × 579", size=10.5, color=GRAY, align="start"), anchor="middle")
    mini_platte(s, rx + 1.1, 1.32, ["txt"] + blau[1:], 4)
    text(s, rx + 2.05, 0.95, 1.6, 0.3, notiz("hs01 in Wörtern", size=10.5, align="start"), anchor="middle")
    mini_platte(s, rx + 1.1, 2.02, ["txt"] + blau[1:], 3)
    text(s, rx + 2.05, 1.65, 1.5, 0.3, mono("5,209 × 579", size=10.5, color=GRAY, align="start"), anchor="middle")
    # Pfeile: %>% reicht das Ergebnis in die nächste Zeile
    px = 3.3
    for y in (0.62, 1.32, 2.02):
        down_arrow(s, px, y - 0.08, w=0.26, h=0.38, color=GREEN)
    text(s, px - 0.15, 3.83, 0.56, 0.3, mono("+", size=18, color=GREEN), anchor="middle")
    # 4: leere Leinwand, 5: Balken als Schicht darauf
    lx, lw = rx + 0.05, 3.35
    leinwand(s, lx, 2.38, lw, 1.05, False)
    leinwand(s, lx, 4.08, lw, 1.05, True)
    connector(s, 0.15, 3.98, px - 0.08, 3.98, color=CARDLINE, width=0.75)
    connector(s, px + 0.34, 3.98, 7.45, 3.98, color=CARDLINE, width=0.75)
    text(s, 0.15, 3.66, 3.1, 0.25, notiz("bis hier: Daten weiterreichen mit %>%", size=10.5, align="start"))
    text(s, 0.15, 4.04, 3.1, 0.25, notiz("ab der Leinwand: Schichten mit +", size=10.5, align="start"))
    return s


# A3, Schritt 3: filter(xt10 <= 180) behält nur Reihen mit TRUE; über 180 und leere Steine fallen weg ---------------
def filter_xt10():
    s = Canvas(7.6, 3.85)
    text(s, 0.15, 0.1, 4.0, 0.25, notiz("zum Beispiel sechs Bögen", size=10.5, align="start"))
    reihen = [("52", "TRUE"), ("75", "TRUE"), ("240", "FALSE"), ("", ""), ("61", "TRUE"), ("3105", "FALSE")]
    h, pitch, top = 0.28, 0.36, 0.98
    sw = lstein_breite("NICHT GENERIERBAR", wert=False)
    sx = 0.3
    lx, lw = sx + sw + 0.2, 0.85
    kopf(s, sx, sw, 0.4, "xt10", "<dbl+lbl>")
    text(s, lx - 0.3, 0.4, lw + 0.6, 0.25, mono("xt10 <= 180", size=11))
    for i, (wert, vergleich) in enumerate(reihen):
        y = top + i * pitch
        if wert:
            stein(s, sx, y, sw, h, "num" if vergleich == "TRUE" else "dim", wert, size=11)
            stein(s, lx, y, lw, h, "log", vergleich, size=11)
        else:
            lstein(s, sx, y, sw, h, "na", "", "NICHT GENERIERBAR", blass=True)
            stein(s, lx, y, lw, h, "na", "")
            text(s, lx, y, lw, h, mono("NA", size=11, color=GRAY), anchor="middle")
    unten = top + 5 * pitch + h
    platte(s, sx - 0.1, unten + 0.07, lx + lw + 0.1 - (sx - 0.1))
    mitte = (top + unten) / 2
    ax, aw = lx + lw + 0.25, 0.75
    text(s, ax - 0.2, mitte - 0.47, aw + 0.4, 0.28, mono("filter()", size=11, color=GREEN))
    arrow(s, ax, mitte - 0.14, w=aw, h=0.28, color=GREEN)
    rx = ax + aw + 0.3
    kopf(s, rx, sw, 0.4, "xt10", "<dbl+lbl>")
    for i, wert in enumerate(["52", "75", "61"]):
        stein(s, rx, top + i * pitch, sw, h, "num", wert, size=11)
    u2 = top + 2 * pitch + h
    platte(s, rx - 0.1, u2 + 0.07, sw + 0.2)
    punkte(s, rx, u2 + 0.17, w=sw)
    text(s, rx - 0.1, u2 + 0.55, sw + 0.4, 0.5, [P(R("übrig: 4.529 Bögen", size=10.5, bold=True, color=INK),
                                                  align=L),
                                                P(R("weg: 497 über 180,", size=10.5, color=GRAY), align=L, sb=2),
                                                P(R("220 ohne Dauer", size=10.5, color=GRAY), align=L)])
    text(s, 0.15, unten + 0.22, 7.3, 0.28, codezeile("allbus %>% filter(xt10 <= 180)", size=10.5))
    return s


# A3, Schritt 4: binwidth ist ein Argument von geom_histogram(); es legt die Breite der Kisten fest --------------------
def binwidth_fig():
    s = Canvas(7.6, 4.15)
    mids, ende = tokens(s, 0.15, 0.15, [("geom_histogram", "fun"), ("(", "sym"), ("binwidth = 5", "arg"), (",", "sym"),
                                        ("boundary = 0", "arg"), (")", "sym")], size=12, h=0.36)
    for i, t in ((2, "Breite jeder Kiste"), (4, "erste Kante bei 0")):
        text(s, mids[i] - 0.9, 0.56, 1.8, 0.25, notiz(t, size=10.5))
    text(s, ende + 0.2, 0.15, 7.45 - ende - 0.2, 0.36, notiz("ohne Angabe: 30 Kisten", size=10.5,
                                                         align="start"), anchor="middle")
    werte = [41, 43, 52, 57, 58, 63, 71]
    text(s, 0.15, 0.95, 7.3, 0.25, notiz("zum Beispiel sieben Bögen: " + ", ".join(map(str, werte)) + " Minuten",
                                        size=10.5, align="start"))
    sw, sh, sp = 0.4, 0.22, 0.26
    skala = 0.09                                   # Zoll je Minute
    x30 = 1.45                                     # x-Position der Minute 30

    def X(m):
        return x30 + (m - 30) * skala

    def panel(base, breite, von, bis, name):
        eyebrow(s, 0.15, base - 0.4, 1.2, name, size=10.5)
        kanten = list(range(von, bis + 1, breite))
        for k in kanten:
            connector(s, X(k), base - 0.05, X(k), base + 0.08, color=GRAY, width=0.75)
            text(s, X(k) - 0.3, base + 0.08, 0.6, 0.22, [P(R(str(k), size=10, color=GRAY), align=C)])
        connector(s, X(von), base, X(bis), base, color=GRAY, width=1.0)
        for a in kanten[:-1]:
            drin = [w for w in werte if a < w <= a + breite]
            rect(s, X(a) + 0.02, base - len(drin) * sp - 0.06, X(a + breite) - X(a) - 0.04, len(drin) * sp + 0.06,
                 None, CARDLINE, 1.0) if drin else None
            for j, w in enumerate(drin):
                stein(s, (X(a) + X(a + breite)) / 2 - sw / 2, base - (j + 1) * sp, sw, sh, "num", str(w), size=10)

    panel(1.95, 5, 40, 75, "binwidth = 5")
    panel(3.7, 30, 30, 90, "binwidth = 30")
    return s


# A4, Schritt 2: Hineinzoomen rechnet mit allen Bögen, Abschneiden wirft vorher welche hinaus ------------------------
def zoom_filter():
    s = Canvas(7.6, 4.3)
    werte = [30, 45, 55, 70, 110, 400, 2600]       # von unten nach oben sortiert
    h, sp = 0.3, 0.37
    base = 3.35

    def turm_y(i):
        return base - (i + 1) * sp

    teile = [(0.15, "HINEINZOOMEN", "coord_cartesian(ylim = c(0, 180))", False, 3, "Median 70, aus 7 Bögen"),
             (3.95, "ABSCHNEIDEN", "filter(xt10 <= 180)", True, 2, "Median 55, aus 5 Bögen")]
    for x0, titel, zeile, filtern, med, med_text in teile:
        eyebrow(s, x0, 0.1, 3.4, titel, size=10.5)
        text(s, x0, 0.38, 3.5, 0.28, mono(zeile, size=10.5, color=GREEN, align="start"))
        tx, tw = x0 + 0.35, 0.8
        for i, w in enumerate(werte):
            kind = "dim" if (filtern and w > 180) else "num"
            stein(s, tx, turm_y(i), tw, h, kind, str(w), size=11)
        platte(s, tx - 0.1, base + 0.0, tw + 0.2)
        outline(s, tx - 0.06, turm_y(med) - 0.07, tw + 0.12, h + 0.12, color=ORANGE, lw=1.75)
        text(s, tx + tw + 0.2, turm_y(med) - 0.02, 2.4, h + 0.04,
             [P(R(med_text, size=10.5, bold=True, color=DARKORANGE))], anchor="middle")
        oben5 = turm_y(4) - 0.1
        if not filtern:
            rect(s, tx - 0.17, oben5, tw + 0.34, base - oben5 + 0.02, None, INK, 1.25, dash=True)
            text(s, tx + tw + 0.25, oben5 + 0.06, 2.4, 0.3, notiz("sichtbar: 0 bis 180", size=10.5, align="start"))
            text(s, tx + tw + 0.2, turm_y(6), 2.4, 2 * sp, [P(R("außerhalb des Bilds,", size=10.5, color=GRAY)),
                                                           P(R("rechnen aber mit", size=10.5, color=GRAY))],
                 anchor="middle")
        else:
            text(s, tx + tw + 0.2, turm_y(6), 2.4, 2 * sp, [P(R("fallen vorher weg", size=10.5, color=GRAY))],
                 anchor="middle")
    connector(s, 3.75, 0.15, 3.75, base + 0.1, color=CARDLINE, width=0.75)
    text(s, 0.15, base + 0.25, 7.3, 0.5, notiz("zum Beispiel sieben Papierbögen, nach Dauer in Minuten sortiert; "
                                               "der Median ist der mittlere Stein", size=10.5, align="start"))
    return s


FIGUREN = {
    "s4-to-label": to_label_hs01,
    "s4-drop-na": drop_na_hs01,
    "s4-kette": kette_hs01,
    "s4-filter-180": filter_xt10,
    "s4-binwidth": binwidth_fig,
    "s4-zoom-filter": zoom_filter,
}
