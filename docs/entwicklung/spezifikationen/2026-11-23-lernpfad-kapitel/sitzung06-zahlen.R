# Sitzung 6 „Gewichtung und Zusammenhang“: alle Zahlen des Kapitels und jede Codevorlage einmal ausgeführt.
# Daten: ALLBUS 2023, ZA8831 v1.3.0, gewichtet mit wghtpew (Vergleichszahlen ungewichtet), nur Aggregate.
# Konstruierte Beispiele (100 Befragte, fünf Personen, acht Personen) sind eigene Zahlen, keine ALLBUS-Fälle.
# Pakete: tidyverse, mariposa 0.7.4.
# Aufruf:  Rscript sitzung06-zahlen.R
#   oder:  ALLBUS_SAV=/pfad/ZA8831_v1-3-0.sav Rscript sitzung06-zahlen.R
# Bricht mit Fehler ab, sobald eine Zahl nicht zum Plan (sitzung06.md) passt.
# Am Ende: Jeder ```r-Block aus sitzung06.md muss wörtlich eine der Vorlagen unten sein; alle laufen einmal.

pdf(NULL)

suppressMessages({
  library(tidyverse)
  library(mariposa)
})
stopifnot(as.character(packageVersion("mariposa")) == "0.7.4")

pfad <- Sys.getenv(
  "ALLBUS_SAV",
  "/Users/yannickdiehl/Documents/Universität Marburg/Lehre/Methoden Ib B.A./Methoden1bSeminarMontag/ZA8831_v1-3-0.sav"
)
allbus <- read_spss(pfad)
stopifnot(nrow(allbus) == 5246)
# Unveränderte Kopie: Jede Vorlage läuft in einer frischen Umgebung, in der nur dieser allbus liegt
allbus_frisch <- allbus

# Ordner dieses Skripts (für sitzung06.md)
skript_datei <- sub("^--file=", "", grep("^--file=", commandArgs(FALSE), value = TRUE))
ordner <- if (length(skript_datei)) dirname(normalizePath(skript_datei)) else getwd()

# ---------------------------------------------------------------------------------------------
# Hilfsfunktionen
# ---------------------------------------------------------------------------------------------
ok <- function(name, ist, soll, tol = 0) {
  if (is.na(ist) || abs(ist - soll) > tol + 1e-9) stop(sprintf("%s: ist %s, soll %s", name, ist, soll))
  cat(sprintf("  ok  %-66s %s\n", name, format(soll, decimal.mark = ",")))
}
abschnitt <- function(titel) cat("\n==== ", titel, " ====\n", sep = "")

# Gedruckte frequency()-Ausgabe: Zeile mit Label -> Zahlen (Code, N, Raw %, Valid %, Cum. %)
zeile <- function(text, label) {
  z <- text[grepl(label, text, fixed = TRUE)][1]
  if (is.na(z)) stop("Zeile nicht gefunden: ", label)
  teile <- trimws(strsplit(z, "|", fixed = TRUE)[[1]])
  zahlen <- suppressWarnings(as.numeric(teile))
  zahlen[!is.na(zahlen)]
}
druck <- function(expr) capture.output(suppressWarnings(print(expr)))

# Gedruckte crosstab()-Ausgabe: Zeilenprozente der Zeile mit diesem Label (Zahlen ohne %)
ct_row <- function(text, label) {
  i <- which(grepl(paste0("| ", label, " "), text, fixed = TRUE))[1]
  if (is.na(i)) stop("Kreuztabellenzeile nicht gefunden: ", label)
  j <- i + which(grepl("row %", text[(i + 1):length(text)], fixed = TRUE))[1]
  teile <- trimws(strsplit(text[j], "|", fixed = TRUE)[[1]])
  zahlen <- suppressWarnings(as.numeric(sub("%", "", teile[grepl("^[0-9.]+%$", teile)], fixed = TRUE)))
  zahlen[!is.na(zahlen)]
}
ct_n <- function(text, label) {
  z <- text[grepl(paste0("| ", label, " "), text, fixed = TRUE)][1]
  teile <- trimws(strsplit(z, "|", fixed = TRUE)[[1]])
  zahlen <- suppressWarnings(as.numeric(teile))
  zahlen[!is.na(zahlen)]
}

# Gedruckte Koeffizienten der kurzen Ausgaben (kendall_tau, spearman_rho, pearson_cor)
koeff <- function(text, name) {
  z <- text[grepl(paste0("^\\s*", name, " = "), text)][1]
  as.numeric(sub(paste0("^\\s*", name, " = (-?[0-9.]+),.*$"), "\\1", z))
}
n_aus <- function(text) as.numeric(sub("^.*N = ([0-9]+).*$", "\\1", text[grepl("N = ", text)][1]))

# =============================================================================================
# Vorlagen (wörtlich wie in sitzung06.md; ⟦…⟧ markiert anzupassende Stellen mit Beispielwert)
# =============================================================================================
V <- list()
V$start <- '# Pakete laden und Daten einlesen
library(tidyverse)
library(mariposa)

allbus <- read_spss("ZA8831_v1-3-0.sav")'

V$lesen_gewicht <- '# Wohnort West oder Ost: erst ungewichtet, dann gewichtet
allbus %>%
  frequency(eastwest)

allbus %>%
  frequency(eastwest, weights = wghtpew)'

V$lesen_mass <- '# Ein Zusammenhangsmaß: zwei Variablen und das Gewicht in einer Klammer
allbus %>%
  kendall_tau(hs01, id02, weights = wghtpew)'

V$a1a <- '# Zufriedenheit mit der Demokratie: erst ungewichtet, dann gewichtet
allbus %>%
  frequency(ps03)

allbus %>%
  frequency(ps03, weights = wghtpew)'

V$a1b <- '# Nur ein Landesteil (1 = West, 2 = Ost): erst ungewichtet, dann gewichtet
allbus %>%
  filter(eastwest == ⟦2⟧) %>%
  frequency(ps03)

allbus %>%
  filter(eastwest == ⟦2⟧) %>%
  frequency(ps03, weights = wghtpew)'

V$frei_a1 <- '# Eine Idee: Ändert die Gewichtung auch Mittelwert und Median?
allbus %>%
  describe(ps03)

allbus %>%
  describe(ps03, weights = wghtpew)'

V$a2b <- '# Zufriedenheit in zwei Gruppen (1 bis 3 zufrieden, 4 bis 6 unzufrieden),
# dann Anteil Zufriedener je Wahlabsicht (Zeilenprozente), gewichtet
allbus %>%
  mutate(
    zufrieden = rec(ps03, rules = "1:3=1 [zufrieden]; 4:6=0 [unzufrieden]; else=NA")
  ) %>%
  crosstab(pv01, zufrieden, percentages = "row", weights = wghtpew)'

V$a2c <- '# Cramér-V für Wahlabsicht und Zufriedenheit, gewichtet
# (zwei Gruppen bilden: kennst du aus Schritt 2)
allbus %>%
  mutate(
    zufrieden = rec(ps03, rules = "1:3=1 [zufrieden]; 4:6=0 [unzufrieden]; else=NA")
  ) %>%
  cramers_v(pv01, zufrieden, weights = wghtpew)'

V$frei_a2 <- '# Eine Idee: Zufriedenheit nach Landesteil, eine Vierfeldertafel mit Phi
allbus <- allbus %>%
  mutate(
    zufrieden = rec(ps03, rules = "1:3=1 [zufrieden]; 4:6=0 [unzufrieden]; else=NA")
  )

allbus %>%
  crosstab(eastwest, zufrieden, percentages = "row", weights = wghtpew)

allbus %>%
  phi(eastwest, zufrieden, weights = wghtpew)'

V$a3a <- '# Zufriedenheit umpolen: höher heißt jetzt zufriedener
allbus <- allbus %>%
  mutate(
    zufriedenheit = rec(ps03, rules = "rev")
  )

# Kontrolle: Welches Wort steht jetzt bei Code 6?
allbus %>%
  frequency(zufriedenheit)'

V$a3b <- '# Zufriedenheit umpolen: kennst du aus Schritt 1
allbus <- allbus %>%
  mutate(
    zufriedenheit = rec(ps03, rules = "rev")
  )

# Gamma für Zufriedenheit und Wirtschaftslage, gewichtet
allbus %>%
  goodman_gamma(zufriedenheit, ep01, weights = wghtpew)

# Tau-b für dieselben Variablen, gewichtet
allbus %>%
  kendall_tau(zufriedenheit, ep01, weights = wghtpew)'

V$frei_a3 <- '# Eine Idee: die eigene wirtschaftliche Lage (ep03) statt der Lage in Deutschland
allbus <- allbus %>%
  mutate(
    zufriedenheit = rec(ps03, rules = "rev")
  )

allbus %>%
  kendall_tau(zufriedenheit, ep03, weights = wghtpew)'

V$a4a <- '# Zufriedenheit umpolen (kennst du aus Aufgabe 3), dann die Punktwolke
allbus <- allbus %>%
  mutate(
    zufriedenheit = rec(ps03, rules = "rev")
  )

allbus %>%
  drop_na(ls01, zufriedenheit) %>%
  ggplot(aes(x = ls01, y = zufriedenheit)) +
  geom_jitter(alpha = 0.2)'

V$a4b <- '# Zufriedenheit umpolen: kennst du aus Aufgabe 3
allbus <- allbus %>%
  mutate(
    zufriedenheit = rec(ps03, rules = "rev")
  )

# Pearson r, gewichtet
allbus %>%
  pearson_cor(zufriedenheit, ls01, weights = wghtpew)

# Spearman rho zum Vergleich (rechnet ohne Gewicht)
allbus %>%
  spearman_rho(zufriedenheit, ls01)'

V$a4c <- '# Pearson r in einem Landesteil (1 = West, 2 = Ost), gewichtet
# (Zufriedenheit umpolen: kennst du aus Aufgabe 3)
allbus %>%
  mutate(
    zufriedenheit = rec(ps03, rules = "rev")
  ) %>%
  filter(eastwest == ⟦1⟧) %>%
  pearson_cor(zufriedenheit, ls01, weights = wghtpew)'

V$frei_a4 <- '# Eine Idee: Links-rechts-Einstufung (pa01: 1 = links, 10 = rechts) und Zufriedenheit
allbus <- allbus %>%
  mutate(
    zufriedenheit = rec(ps03, rules = "rev")
  )

allbus %>%
  pearson_cor(zufriedenheit, pa01, weights = wghtpew)'

# Vorlage ausführen: ⟦x⟧ -> x (oder ersetzt), read_spss-Zeile übersprungen (Datei ist geladen).
# Wie in der Code-Werkstatt: frische Umgebung, nur der unveränderte allbus, keine Objekte anderer Vorlagen.
lauf <- function(code, ersatz = NULL) {
  umgebung <- new.env(parent = parent.env(globalenv()))
  assign("allbus", allbus_frisch, envir = umgebung)
  if (!is.null(ersatz)) for (k in names(ersatz)) code <- gsub(paste0("⟦", k, "⟧"), ersatz[[k]], code, fixed = TRUE)
  code <- gsub("⟦([^⟧]*)⟧", "\\1", code)
  code <- gsub('allbus <- read_spss\\("ZA8831_v1-3-0.sav"\\)', "invisible(NULL)", code)
  ausdruecke <- parse(text = code)
  out <- character(0)
  for (e in ausdruecke) {
    out <- c(out, capture.output(suppressWarnings(wert <- withVisible(eval(e, envir = umgebung)))))
    if (wert$visible) out <- c(out, capture.output(suppressWarnings(print(wert$value))))
  }
  invisible(out)
}

# =============================================================================================
abschnitt("Vorweg: R lesen")
# =============================================================================================
out <- lauf(V$lesen_gewicht)
ok("eastwest ungewichtet: West N", zeile(out, "ALTE BUNDESLAENDER")[2], 3567)
ok("eastwest ungewichtet: Ost N", zeile(out, "NEUE BUNDESLAENDER")[2], 1679)
ok("eastwest ungewichtet: Ost Valid %", zeile(out, "NEUE BUNDESLAENDER")[4], 32.01)
ok("eastwest ungewichtet: West Valid %", zeile(out, "ALTE BUNDESLAENDER")[4], 67.99)
gew <- out[which(grepl("Weighted Frequency", out))[1]:length(out)]
ok("eastwest gewichtet: West N (Summe der Gewichte)", zeile(gew, "ALTE BUNDESLAENDER")[2], 4363)
ok("eastwest gewichtet: Ost N (Summe der Gewichte)", zeile(gew, "NEUE BUNDESLAENDER")[2], 883)
ok("eastwest gewichtet: West Valid %", zeile(gew, "ALTE BUNDESLAENDER")[4], 83.16)
ok("eastwest gewichtet: Ost Valid %", zeile(gew, "NEUE BUNDESLAENDER")[4], 16.84)

out <- lauf(V$lesen_mass)
ok("Vorweg: kendall_tau(hs01, id02) gewichtet, gedruckt", koeff(out, "tau"), -0.241)
ok("Vorweg: N in der Ausgabe", n_aus(out), 5151)
stopifnot(any(grepl("[Weighted]", out, fixed = TRUE)))

# =============================================================================================
abschnitt("Grundlage 1: Gewichtung (eastwest, wghtpew, rd01 konfessionslos)")
# =============================================================================================
w <- as.numeric(allbus$wghtpew)
ost <- as.numeric(allbus$eastwest) == 2
ok("wghtpew Mittelwert", round(mean(w), 3), 1.000)
ok("wghtpew Ost kleinster Wert", round(min(w[ost]), 2), 0.50)
ok("wghtpew Ost größter Wert", round(max(w[ost]), 2), 0.54)
ok("wghtpew Ost größter Wert, auf 0,05 gerundet nach oben (0,545)", round(max(w[ost]), 3), 0.545)
ok("wghtpew West kleinster Wert", round(min(w[!ost]), 2), 1.20)
ok("wghtpew West größter Wert", round(max(w[!ost]), 2), 1.25)
ok("wghtpew: drei verschiedene Werte im Osten", length(unique(round(w[ost], 6))), 3)
ok("wghtpew: drei verschiedene Werte im Westen", length(unique(round(w[!ost], 6))), 3)
ok("Summe der Gewichte gesamt = 5246", round(sum(w)), 5246)
ok("Summe der Gewichte West", round(sum(w[!ost])), 4363)
ok("Summe der Gewichte Ost", round(sum(w[ost])), 883)
# Formel: Gewicht = Anteil in Deutschland / Anteil in der Stichprobe
ok("Gewicht West = 83,16 / 67,99", round(83.16 / 67.99, 2), 1.22)
ok("Gewicht Ost = 16,84 / 32,01", round(16.84 / 32.01, 2), 0.53)
ok("Probe West: 3567 x 1,2231 ≈ 4363", round(3567 * 83.16 / 67.99), 4363)
ok("Probe Ost: 1679 x 0,5261 ≈ 883", round(1679 * 16.84 / 32.01), 883)
ok("Kurz überlegen 1b: 17 / 50", 17 / 50, 0.34)
ok("Beispiel 100 Steine: Ost in der Stichprobe (gerundet)", round(32.01), 32)
ok("Beispiel 100 Steine: Ost in Deutschland (gerundet)", round(16.84), 17)

allbus <- allbus %>%
  mutate(konfessionslos = rec(rd01, rules = "6=1 [keine]; 1:5=0 [Mitglied]; else=NA"))
ku <- druck(allbus %>% crosstab(eastwest, konfessionslos, percentages = "row"))
kw <- druck(allbus %>% crosstab(eastwest, konfessionslos, percentages = "row", weights = wghtpew))
ok("Konfessionslos West, ungewichtet %", ct_row(ku, "ALTE BUNDESLAENDER")[2], 33.7)
ok("Konfessionslos Ost, ungewichtet %", ct_row(ku, "NEUE BUNDESLAENDER")[2], 77.4)
ok("Konfessionslos alle, ungewichtet %", ct_row(ku, "Total")[2], 47.7)
ok("Konfessionslos West, gewichtet %", ct_row(kw, "ALTE BUNDESLAENDER")[2], 33.7)
ok("Konfessionslos Ost, gewichtet %", ct_row(kw, "NEUE BUNDESLAENDER")[2], 77.5)
ok("Konfessionslos alle, gewichtet %", ct_row(kw, "Total")[2], 41.0)
ok("Konfession gültig ungewichtet: West", ct_n(ku, "ALTE BUNDESLAENDER")[3], 3497)
ok("Konfession gültig ungewichtet: Ost", ct_n(ku, "NEUE BUNDESLAENDER")[3], 1644)
ok("Konfession gültig gewichtet: West", ct_n(kw, "ALTE BUNDESLAENDER")[3], 4278)
ok("Konfession gültig gewichtet: Ost", ct_n(kw, "NEUE BUNDESLAENDER")[3], 864)
ok("Konfessionslos gewichtet: West keine", ct_n(kw, "ALTE BUNDESLAENDER")[2], 1440)
ok("Konfessionslos gewichtet: Ost keine", ct_n(kw, "NEUE BUNDESLAENDER")[2], 670)
ok("Konfessionslos gewichtet: alle", ct_n(kw, "Total")[3], 5142)
ok("Konfessionslos gewichtet: alle keine", ct_n(kw, "Total")[2], 2110)
# Mischung: Gesamtanteil = Anteil West an allen x Quote West + Anteil Ost an allen x Quote Ost
ok("Mischung ungewichtet: Ost-Anteil an allen (%)", round(1644 / 5141 * 100), 32)
ok("Mischung gewichtet: Ost-Anteil an allen (%)", round(864 / 5142 * 100), 17)
ok("Mischung ungewichtet: 0,68 x 33,7 + 0,32 x 77,4", round(0.68 * 33.7 + 0.32 * 77.4, 1), 47.7)
ok("Mischung gewichtet: 0,83 x 33,7 + 0,17 x 77,5", round(0.83 * 33.7 + 0.17 * 77.5, 1), 41.1)
ok("Mischung gewichtet, genau: 4278/5142 x 33,66 + 864/5142 x 77,55",
   round(4278 / 5142 * 1440 / 4278 * 100 + 864 / 5142 * 670 / 864 * 100, 1), 41.0)
ok("Mischung Summanden gewichtet: 0,83 x 33,7", round(0.83 * 33.7, 1), 28.0)
ok("Mischung Summanden gewichtet: 0,17 x 77,5", round(0.17 * 77.5, 1), 13.2)
ok("Mischung Summanden ungewichtet: 0,68 x 33,7", round(0.68 * 33.7, 1), 22.9)
ok("Mischung Summanden ungewichtet: 0,32 x 77,4", round(0.32 * 77.4, 1), 24.8)
# Mischpult (Interaktion): Gesamtanteil bei Ost-Anteil p = (1 - p) x 33,7 + p x 77,5
mischpult <- function(p) round((1 - p) * 1440 / 4278 * 100 + p * 670 / 864 * 100, 1)
ok("Bausteine gewichtet: 0,832 x 33,66", round(0.832 * 33.66, 1), 28.0)
ok("Bausteine gewichtet: 0,168 x 77,55", round(0.168 * 77.55, 1), 13.0)
ok("Bausteine gewichtet: Summe", round(0.832 * 33.66 + 0.168 * 77.55, 1), 41.0)
ok("Quote West gewichtet genau", round(1440 / 4278 * 100, 2), 33.66)
ok("Quote Ost gewichtet genau", round(670 / 864 * 100, 2), 77.55)
ok("Ost-Anteil gewichtet genau", round(864 / 5142 * 100, 1), 16.8)
ok("Mischpult: Ost-Anteil 0 %", mischpult(0), 33.7)
ok("Mischpult: Ost-Anteil 16,8 %", mischpult(0.168), 41.0)
ok("Mischpult: Ost-Anteil 32 %", mischpult(0.32), 47.7)
ok("Mischpult: Ost-Anteil 50 %", mischpult(0.50), 55.6)
ok("Mischpult: Ost-Anteil 100 %", mischpult(1), 77.5)

# =============================================================================================
abschnitt("Aufgabe 1: ps03 ungewichtet und gewichtet")
# =============================================================================================
out <- lauf(V$a1a)
un <- out[1:(which(grepl("Weighted Frequency", out))[1] - 1)]
ge <- out[which(grepl("Weighted Frequency", out))[1]:length(out)]
ok("ps03 ungewichtet: Cum. % bei 3 (a1-ungewichtet)", zeile(un, "ETWAS ZUFRIEDEN ")[5], 70.73)
ok("ps03 gewichtet: Cum. % bei 3 (a1-gewichtet)", zeile(ge, "ETWAS ZUFRIEDEN ")[5], 73.58)
ok("ps03 ungewichtet: Valid % sehr zufrieden", zeile(un, "SEHR ZUFRIEDEN ")[4], 7.32)
ok("ps03 ungewichtet: Valid % ziemlich zufrieden", zeile(un, "ZIEMLICH ZUFRIEDEN")[4], 41.23)
ok("ps03 ungewichtet: Valid % etwas zufrieden", zeile(un, "ETWAS ZUFRIEDEN ")[4], 22.18)
ok("ps03 ungewichtet: Total valid", zeile(un, "Total valid")[1], 3621)
ok("ps03 ungewichtet: TNZ SPLIT", zeile(un, "TNZ: SPLIT")[2], 1596)
ok("ps03 ungewichtet: Total missing", zeile(un, "Total missing")[1], 1625)
ok("ps03 gewichtet: Total valid", zeile(ge, "Total valid")[1], 3619)
ok("ps03 gewichtet: Cum. % bei 2", zeile(ge, "ZIEMLICH ZUFRIEDEN")[5], 52.03)
ok("ps03 ungewichtet: Cum. % bei 2", zeile(un, "ZIEMLICH ZUFRIEDEN")[5], 48.55)
ok("ps03 ungewichtet: unzufrieden (4 bis 6) = 100 - 70,73", round(100 - 70.73, 2), 29.27)
ok("ps03 gewichtet: unzufrieden (4 bis 6) = 100 - 73,58", round(100 - 73.58, 2), 26.42)

out_o <- lauf(V$a1b)
un_o <- out_o[1:(which(grepl("Weighted Frequency", out_o))[1] - 1)]
ge_o <- out_o[which(grepl("Weighted Frequency", out_o))[1]:length(out_o)]
ok("Ost ungewichtet: Cum. % bei 3", zeile(un_o, "ETWAS ZUFRIEDEN ")[5], 58.45)
ok("Ost gewichtet: Cum. % bei 3", zeile(ge_o, "ETWAS ZUFRIEDEN ")[5], 58.56)
ok("Ost ungewichtet: Total valid", zeile(un_o, "Total valid")[1], 1177)
ok("Ost gewichtet: Total valid", zeile(ge_o, "Total valid")[1], 611)
out_w <- lauf(V$a1b, list("2" = "1"))
un_w <- out_w[1:(which(grepl("Weighted Frequency", out_w))[1] - 1)]
ge_w <- out_w[which(grepl("Weighted Frequency", out_w))[1]:length(out_w)]
ok("West ungewichtet: Cum. % bei 3", zeile(un_w, "ETWAS ZUFRIEDEN ")[5], 76.64)
ok("West gewichtet: Cum. % bei 3", zeile(ge_w, "ETWAS ZUFRIEDEN ")[5], 76.63)
ok("West ungewichtet: Total valid", zeile(un_w, "Total valid")[1], 2444)
ok("West gewichtet: Total valid", zeile(ge_w, "Total valid")[1], 3008)
# Antwortprüfung: Zielwerte und Toleranzen
ok("a1-ungewichtet Ziel 70,73 (Toleranz 0,1)", 70.73, 70.73)
ok("a1-gewichtet Ziel 73,58 (Toleranz 0,1)", 73.58, 73.58)
stopifnot(abs(58.45 - 58.5) <= 0.1, abs(58.56 - 58.5) <= 0.1, abs(76.64 - 76.6) <= 0.1, abs(76.63 - 76.6) <= 0.1)
stopifnot(abs(70.73 - 73.58) > 0.2)
cat("  ok  a1-ost Ziel 58,5 ±0,1 trifft 58,45 und 58,56; a1-west Ziel 76,6 ±0,1 trifft 76,64 und 76,63\n")
# Mischung in der Lösung: Anteil West und Ost an den gültigen ps03-Antworten
ok("Lösung: West-Anteil an gültigen ps03, ungewichtet (%)", round(2444 / 3621 * 100), 67)
ok("Lösung: Ost-Anteil an gültigen ps03, ungewichtet (%)", round(1177 / 3621 * 100), 33)
ok("Lösung: West-Anteil an gültigen ps03, gewichtet (%)", round(3008 / 3619 * 100), 83)
ok("Lösung: Ost-Anteil an gültigen ps03, gewichtet (%)", round(611 / 3619 * 100), 17)
ok("Lösung: 0,83 x 76,6 + 0,17 x 58,6", round(0.83 * 76.6 + 0.17 * 58.6, 1), 73.5)
ok("Lösung: 0,67 x 76,6 + 0,33 x 58,5", round(0.67 * 76.6 + 0.33 * 58.5, 1), 70.6)
ok("Lösung genau gewichtet: 3008/3619 x 76,63 + 611/3619 x 58,56",
   round(3008 / 3619 * 76.63 + 611 / 3619 * 58.56, 1), 73.6)
ok("Lösung genau ungewichtet: 2444/3621 x 76,64 + 1177/3621 x 58,45",
   round(2444 / 3621 * 76.64 + 1177 / 3621 * 58.45, 1), 70.7)
ok("Lösung Text: Ost-Anteil gültige ps03 ungewichtet (%), eine Stelle", round(1177 / 3621 * 100, 1), 32.5)
ok("Lösung Text: Ost-Anteil gültige ps03 gewichtet (%), eine Stelle", round(611 / 3619 * 100, 1), 16.9)
ok("Lösung Text: 0,831 x 76,63 + 0,169 x 58,56", round(0.831 * 76.63 + 0.169 * 58.56, 1), 73.6)
ok("Lösung Text: 3008 / 3619", round(3008 / 3619, 3), 0.831)
ok("Abstand West - Ost (gewichtet), Prozentpunkte", round(76.63 - 58.56, 1), 18.1)

out <- lauf(V$frei_a1)
ok("Probier A1: Mittelwert ungewichtet", as.numeric(sub("^\\s*ps03\\s+([0-9.]+).*$", "\\1", out[grepl("^\\s*ps03 ", out)][1])), 2.938)
ok("Probier A1: Mittelwert gewichtet", as.numeric(sub("^\\s*ps03\\s+([0-9.]+).*$", "\\1", out[grepl("^\\s*ps03 ", out)][2])), 2.840)
ok("Probier A1: Median ungewichtet", as.numeric(strsplit(trimws(out[grepl("^\\s*ps03 ", out)][1]), " +")[[1]][3]), 3)
ok("Probier A1: Median gewichtet", as.numeric(strsplit(trimws(out[grepl("^\\s*ps03 ", out)][2]), " +")[[1]][3]), 2)

# =============================================================================================
abschnitt("Grundlage 2: Chi-Quadrat, Phi, Cramér-V")
# =============================================================================================
# Konstruiertes Beispiel: 100 Befragte, 80 West (28 ohne Konfession), 20 Ost (16 ohne Konfession)
tafel <- tibble(
  region = rep(c(1, 1, 2, 2), c(52, 28, 4, 16)),
  keine  = rep(c(0, 1, 0, 1), c(52, 28, 4, 16))
)
beob <- c(west_mitglied = 52, west_keine = 28, ost_mitglied = 4, ost_keine = 16)
erw <- c(west_mitglied = 80 * 56 / 100, west_keine = 80 * 44 / 100, ost_mitglied = 20 * 56 / 100, ost_keine = 20 * 44 / 100)
ok("erwartet West keine = 80 x 44 / 100", erw[["west_keine"]], 35.2)
ok("erwartet West Mitglied = 80 x 56 / 100", erw[["west_mitglied"]], 44.8)
ok("erwartet Ost keine = 20 x 44 / 100 (Kurz überlegen 2a)", erw[["ost_keine"]], 8.8)
ok("erwartet Ost Mitglied = 20 x 56 / 100", erw[["ost_mitglied"]], 11.2)
ok("Abweichung West keine = 28 - 35,2", round(28 - 35.2, 1), -7.2)
ok("Abweichung Ost keine = 16 - 8,8", round(16 - 8.8, 1), 7.2)
ok("Quadrat 7,2²", round(7.2^2, 2), 51.84)
ok("Beitrag West Mitglied 51,84 / 44,8", round(51.84 / 44.8, 2), 1.16)
ok("Beitrag West keine 51,84 / 35,2", round(51.84 / 35.2, 2), 1.47)
ok("Beitrag Ost Mitglied 51,84 / 11,2", round(51.84 / 11.2, 2), 4.63)
ok("Beitrag Ost keine 51,84 / 8,8", round(51.84 / 8.8, 2), 5.89)
chi <- sum((beob - erw)^2 / erw)
ok("Chi-Quadrat (Summe der Beiträge)", round(chi, 2), 13.15)
ok("Beiträge gerundet addiert: 1,16 + 1,47 + 4,63 + 5,89", 1.16 + 1.47 + 4.63 + 5.89, 13.15)
ok("Phi = Wurzel(13,15 / 100)", round(sqrt(chi / 100), 2), 0.36)
ok("Phi aus mariposa (Beispiel)", round(tafel %>% phi(region, keine), 3), 0.363)
ok("V aus mariposa (Beispiel)", round(tafel %>% cramers_v(region, keine), 3), 0.363)
chi_out <- druck(tafel %>% chi_square(region, keine))
ok("chi_square() druckt chi2(1) = 13.149", as.numeric(sub("^.*chi2\\(1\\) = ([0-9.]+),.*$", "\\1", chi_out[grepl("chi2\\(", chi_out)][1])), 13.149)
tafel2 <- bind_rows(tafel, tafel)
chi_out2 <- druck(tafel2 %>% chi_square(region, keine))
ok("doppelt so viele Befragte: chi2 = 26.299", as.numeric(sub("^.*chi2\\(1\\) = ([0-9.]+),.*$", "\\1", chi_out2[grepl("chi2\\(", chi_out2)][1])), 26.299)
ok("doppelt so viele Befragte: Phi bleibt 0,363", round(tafel2 %>% phi(region, keine), 3), 0.363)
ok("Prozent ohne Konfession im Beispiel West = 28/80", 28 / 80 * 100, 35)
ok("Prozent ohne Konfession im Beispiel Ost = 16/20", 16 / 20 * 100, 80)
ok("Prozent ohne Konfession im Beispiel alle = 44/100", 44, 44)
# Echte Zahlen
allbus <- allbus %>%
  mutate(konf = rec(rd01, rules = "1:2=1 [evangelisch]; 3=2 [katholisch]; 4:5=3 [andere]; 6=4 [keine]; else=NA"))
ok("Phi konfessionslos x Region, gewichtet", round(allbus %>% phi(eastwest, konfessionslos, weights = wghtpew), 2), 0.33)
ok("Phi konfessionslos x Region, ungewichtet", round(allbus %>% phi(eastwest, konfessionslos), 2), 0.41)
ok("V Konfession (4 Gruppen) x Region, gewichtet", round(suppressWarnings(allbus %>% cramers_v(eastwest, konf, weights = wghtpew)), 2), 0.34)
ok("V Konfession (4 Gruppen) x Region, ungewichtet", round(suppressWarnings(allbus %>% cramers_v(eastwest, konf)), 2), 0.42)
kk <- druck(allbus %>% crosstab(eastwest, konf, percentages = "row", weights = wghtpew))
ok("Konfession West: evangelisch %", ct_row(kk, "ALTE BUNDESLAENDER")[1], 28.4)
ok("Konfession West: katholisch %", ct_row(kk, "ALTE BUNDESLAENDER")[2], 31.0)
ok("Konfession West: andere %", ct_row(kk, "ALTE BUNDESLAENDER")[3], 7.0)
ok("Konfession West: keine %", ct_row(kk, "ALTE BUNDESLAENDER")[4], 33.7)
ok("Konfession Ost: evangelisch %", ct_row(kk, "NEUE BUNDESLAENDER")[1], 14.7)
ok("Konfession Ost: katholisch %", ct_row(kk, "NEUE BUNDESLAENDER")[2], 4.7)
ok("Konfession Ost: andere %", ct_row(kk, "NEUE BUNDESLAENDER")[3], 3.0)
ok("Konfession Ost: keine %", ct_row(kk, "NEUE BUNDESLAENDER")[4], 77.5)

# =============================================================================================
abschnitt("Aufgabe 2: pv01 x zufrieden")
# =============================================================================================
# Für die Prüfzahlen unten: dieselben Variablen im Prüf-allbus (die Vorlagen bilden sie selbst)
allbus <- allbus %>%
  mutate(
    zufrieden     = rec(ps03, rules = "1:3=1 [zufrieden]; 4:6=0 [unzufrieden]; else=NA"),
    zufriedenheit = rec(ps03, rules = "rev")
  )
out <- lauf(V$a2b)
parteien <- c("CDU-CSU" = 79.5, "SPD" = 87.2, "FDP" = 80.7, "DIE GRUENEN" = 92.9, "DIE LINKE" = 61.6,
              "AFD" = 22.8, "ANDERE PARTEI" = 51.6, "WUERDE NICHT WAEHLEN" = 50.7, "Total" = 74.8)
for (p in names(parteien)) ok(paste("A2 zufrieden % bei", p), ct_row(out, p)[2], parteien[[p]])
gruppen_n <- c("CDU-CSU" = 716, "SPD" = 562, "FDP" = 243, "DIE GRUENEN" = 574, "DIE LINKE" = 146,
               "AFD" = 268, "ANDERE PARTEI" = 124, "WUERDE NICHT WAEHLEN" = 142)
for (p in names(gruppen_n)) ok(paste("A2 Gruppengröße (gewichtet) bei", p), ct_n(out, p)[3], gruppen_n[[p]])
ok("A2 N (valid, gewichtet)", as.numeric(sub("^.*N \\(valid\\): ([0-9]+).*$", "\\1", out[grepl("N (valid)", out, fixed = TRUE)][1])), 2775)
out <- lauf(V$a2c)
ok("A2 Cramér-V gewichtet (a2-v, Ziel 0,478 ±0,005)", round(allbus %>% cramers_v(pv01, zufrieden, weights = wghtpew), 4), 0.4783)
stopifnot(any(grepl("0.4783119", out, fixed = TRUE)))
ok("A2 Cramér-V ungewichtet", round(allbus %>% cramers_v(pv01, zufrieden), 3), 0.484)
ok("A2 V mit sechs Stufen statt zwei (Entscheidung)", round(suppressWarnings(allbus %>% cramers_v(pv01, ps03, weights = wghtpew)), 3), 0.248)
ok("A2 V vertauschte Reihenfolge der Variablen", round(allbus %>% cramers_v(zufrieden, pv01, weights = wghtpew), 4), 0.4783)
ok("A2 Abstand Grüne - AfD in Prozentpunkten", round(92.9 - 22.8, 1), 70.1)
out <- lauf(V$frei_a2)
ok("Probier A2: West zufrieden %", ct_row(out, "ALTE BUNDESLAENDER")[2], 76.6)
ok("Probier A2: Ost zufrieden %", ct_row(out, "NEUE BUNDESLAENDER")[2], 58.6)
ok("Probier A2: Phi (mit Vorzeichen)", round(allbus %>% phi(eastwest, zufrieden, weights = wghtpew), 3), -0.153)
ok("Probier A2: Cramér-V = Betrag von Phi", round(allbus %>% mutate(zufrieden = rec(ps03, rules = "1:3=1 [zufrieden]; 4:6=0 [unzufrieden]; else=NA")) %>% cramers_v(eastwest, zufrieden, weights = wghtpew), 3), 0.153)
ok("Probier A2: Phi mit getauschten Codes von zufrieden", round(allbus %>% mutate(unzufrieden = rec(ps03, rules = "1:3=0; 4:6=1; else=NA")) %>% phi(eastwest, unzufrieden, weights = wghtpew), 3), 0.153)
ok("Probier A2: Phi ungewichtet", round(allbus %>% phi(eastwest, zufrieden), 3), -0.187)

# =============================================================================================
abschnitt("Grundlage 3: Paare, Gamma, Tau-b (konstruiert; hs01 x id02)")
# =============================================================================================
paare <- tibble(person = c("A", "B", "C", "D", "E"), schicht = c(1, 2, 3, 3, 4), gesundheit = c(1, 3, 2, 4, 3))
klasse <- character(0)
for (i in 1:4) for (j in (i + 1):5) {
  dx <- sign(paare$schicht[j] - paare$schicht[i]); dy <- sign(paare$gesundheit[j] - paare$gesundheit[i])
  k <- if (dx == 0 && dy == 0) "beide gleich" else if (dx == 0) "gleich Schicht" else if (dy == 0) "gleich Gesundheit" else if (dx == dy) "gleichläufig" else "gegenläufig"
  klasse <- c(klasse, setNames(k, paste0(paare$person[i], paare$person[j])))
}
print(klasse)
stopifnot(identical(unname(klasse), c("gleichläufig", "gleichläufig", "gleichläufig", "gleichläufig",
  "gegenläufig", "gleichläufig", "gleich Gesundheit", "gleich Schicht", "gleichläufig", "gegenläufig")))
K <- sum(klasse == "gleichläufig"); D <- sum(klasse == "gegenläufig")
Tx <- sum(klasse == "gleich Schicht"); Ty <- sum(klasse == "gleich Gesundheit")
ok("gleichläufige Paare", K, 6); ok("gegenläufige Paare", D, 2)
ok("Gleichstand nur bei Schicht", Tx, 1); ok("Gleichstand nur bei Gesundheit", Ty, 1)
ok("Gamma = (6 - 2) / (6 + 2)", (K - D) / (K + D), 0.5)
ok("Tau-b = 4 / Wurzel(9 x 9)", round((K - D) / sqrt((K + D + Tx) * (K + D + Ty)), 3), 0.444)
ok("Gamma aus mariposa (Beispiel)", suppressWarnings(paare %>% goodman_gamma(schicht, gesundheit)), 0.5)
ok("Tau-b aus mariposa (Beispiel), gedruckt", koeff(druck(paare %>% kendall_tau(schicht, gesundheit)), "tau"), 0.444)
ok("Kurz überlegen 3b: (30 - 10) / (30 + 10)", (30 - 10) / (30 + 10), 0.5)
ok("Kurz überlegen 3b, Tau-b-Teil: 20 / Wurzel((40 + 12) x (40 + 8))", round(20 / sqrt(52 * 48), 2), 0.40)

allbus <- allbus %>%
  mutate(gesundheit = rec(hs01, rules = "rev"))
g_w <- suppressWarnings(allbus %>% goodman_gamma(gesundheit, id02, weights = wghtpew))
ok("Gamma Gesundheit (umgepolt) x Schicht, gewichtet", round(g_w, 2), 0.36)
ok("Gamma Gesundheit (umgepolt) x Schicht, gewichtet, 3 Stellen", round(g_w, 3), 0.357)
ok("Gamma Gesundheit (Original hs01) x Schicht, gewichtet", round(suppressWarnings(allbus %>% goodman_gamma(hs01, id02, weights = wghtpew)), 3), -0.357)
ok("Tau-b Gesundheit (umgepolt) x Schicht, gewichtet", koeff(druck(allbus %>% kendall_tau(gesundheit, id02, weights = wghtpew)), "tau"), 0.241)
ok("Tau-b Gesundheit (Original) x Schicht, gewichtet", koeff(druck(allbus %>% kendall_tau(hs01, id02, weights = wghtpew)), "tau"), -0.241)
ok("Spearman Gesundheit (umgepolt) x Schicht", koeff(druck(allbus %>% spearman_rho(gesundheit, id02)), "rho"), 0.275)
gs <- druck(allbus %>% crosstab(id02, gesundheit, percentages = "row", weights = wghtpew))
schichten <- list(
  "UNTERSCHICHT" = c(17.6, 34.6, 24.9, 14.1, 8.8),
  "ARBEITERSCHI" = c(5.6, 17.0, 32.2, 34.2, 11.1),
  "MITTELSCHICH" = c(2.3, 9.9, 28.9, 42.7, 16.2),
  "OBERE" = c(1.4, 3.7, 18.1, 46.8, 30.0),
  "OBERSCHICHT" = c(0.0, 3.2, 24.2, 33.9, 38.7)
)
for (s in names(schichten)) {
  ist <- ct_row(gs, s)[1:5]
  stopifnot(all(abs(ist - schichten[[s]]) < 1e-9))
  cat("  ok  Schicht", s, "Gesundheit schlecht … sehr gut (%):", paste(schichten[[s]], collapse = " / "), "\n")
}
ok("gut oder sehr gut: Unterschicht", round(14.1 + 8.8, 1), 22.9)
ok("gut oder sehr gut: Arbeiterschicht", round(34.2 + 11.1, 1), 45.3)
ok("gut oder sehr gut: Mittelschicht", round(42.7 + 16.2, 1), 58.9)
ok("gut oder sehr gut: obere Mittelschicht", round(46.8 + 30.0, 1), 76.8)
ok("gut oder sehr gut: Oberschicht", round(33.9 + 38.7, 1), 72.6)
ok("Gruppengröße Unterschicht (gewichtet)", ct_n(gs, "UNTERSCHICHT")[6], 205)
ok("Gruppengröße Oberschicht (gewichtet)", ct_n(gs, "OBERSCHICHT")[6], 62)
ok("Gruppengröße Mittelschicht (gewichtet)", ct_n(gs, "MITTELSCHICH")[6], 2862)
ok("Gruppengröße Arbeiterschicht (gewichtet)", ct_n(gs, "ARBEITERSCHI")[6], 1153)
ok("Gruppengröße obere Mittelschicht (gewichtet)", ct_n(gs, "OBERE")[6], 871)
# Reihenfolge der Kategorien: Konfession x Gesundheit
allbus <- allbus %>%
  mutate(
    konf_a = rec(rd01, rules = "1:2=1; 3=2; 4:5=3; 6=4; else=NA"),
    konf_b = rec(rd01, rules = "6=1; 1:2=2; 3=3; 4:5=4; else=NA"),
    konf_c = rec(rd01, rules = "3=1; 6=2; 4:5=3; 1:2=4; else=NA")
  )
ok("Gamma Konfession (ev., kath., andere, keine) x Gesundheit", round(suppressWarnings(allbus %>% goodman_gamma(konf_a, gesundheit, weights = wghtpew)), 2), 0.04)
ok("Gamma Konfession (keine, ev., kath., andere) x Gesundheit", round(suppressWarnings(allbus %>% goodman_gamma(konf_b, gesundheit, weights = wghtpew)), 2), 0.01)
ok("Gamma Konfession (kath., keine, andere, ev.) x Gesundheit", round(suppressWarnings(allbus %>% goodman_gamma(konf_c, gesundheit, weights = wghtpew)), 2), -0.03)
for (k in c("konf_a", "konf_b", "konf_c")) {
  ok(paste("V Konfession x Gesundheit bleibt gleich:", k), round(suppressWarnings(allbus %>% cramers_v(!!sym(k), gesundheit, weights = wghtpew)), 3), 0.045)
}

# =============================================================================================
abschnitt("Aufgabe 3: zufriedenheit x ep01")
# =============================================================================================
out <- lauf(V$a3a)
ok("A3 Kontrolle: Code 6 heißt jetzt SEHR ZUFRIEDEN (N)", zeile(out, "SEHR ZUFRIEDEN ")[2], 265)
stopifnot(zeile(out, "SEHR ZUFRIEDEN ")[1] == 6, zeile(out, "SEHR UNZUFRIEDEN")[1] == 1)
cat("  ok  A3 Kontrolle: Code 1 = SEHR UNZUFRIEDEN, Code 6 = SEHR ZUFRIEDEN\n")
t0 <- Sys.time()
out <- lauf(V$a3b)
cat(sprintf("  (Laufzeit goodman_gamma + kendall_tau mit Labels: %.2f s)\n", as.numeric(Sys.time() - t0, units = "secs")))
g3 <- suppressWarnings(allbus %>% goodman_gamma(zufriedenheit, ep01, weights = wghtpew))
ok("A3 Gamma gewichtet (a3-gamma)", round(g3, 3), -0.544)
stopifnot(any(grepl("-0.5444373", out, fixed = TRUE)))
ok("A3 Tau-b gewichtet, gedruckt (a3-tau)", koeff(out, "tau"), -0.387)
ok("A3 N in der Tau-Ausgabe", n_aus(out[grepl("tau =", out) | grepl("N = ", out)]), 3593)
w3 <- capture.output(invisible(withCallingHandlers(allbus %>% goodman_gamma(zufriedenheit, ep01, weights = wghtpew),
  warning = function(w) { cat(conditionMessage(w), "\n"); invokeRestart("muffleWarning") })))
stopifnot(any(grepl("2 cells (6.7%) has expected count < 5", w3, fixed = TRUE)))
cat("  ok  A3 Warnung „2 cells (6.7%) has expected count < 5“ erscheint bei goodman_gamma()\n")
ok("A3 Gamma ungewichtet", round(suppressWarnings(allbus %>% goodman_gamma(zufriedenheit, ep01)), 3), -0.553)
ok("A3 Tau-b ungewichtet", koeff(druck(allbus %>% kendall_tau(zufriedenheit, ep01)), "tau"), -0.393)
ok("A3 Gamma mit ps03 im Original (ohne Umpolen)", round(suppressWarnings(allbus %>% goodman_gamma(ps03, ep01, weights = wghtpew)), 3), 0.544)
ok("A3 Tau-b mit ps03 im Original (ohne Umpolen)", koeff(druck(allbus %>% kendall_tau(ps03, ep01, weights = wghtpew)), "tau"), 0.387)
ok("A3 Reihenfolge vertauscht: Tau-b gleich", koeff(druck(allbus %>% kendall_tau(ep01, zufriedenheit, weights = wghtpew)), "tau"), -0.387)
zw <- druck(allbus %>% crosstab(ep01, zufrieden, percentages = "row", weights = wghtpew))
lage <- c("SEHR GUT" = 95.7, "GUT" = 90.1, "TEILS/TEILS" = 76.9, "SCHLECHT" = 45.6, "SEHR SCHLECHT" = 14.0)
for (l in names(lage)) ok(paste("Fürs Plenum/Lösung: zufrieden % bei Wirtschaftslage", l), ct_row(zw, l)[2], lage[[l]])
ok("Wirtschaftslage gewichtet: Gruppe sehr gut (N)", ct_n(zw, "SEHR GUT")[3], 69)
ok("Wirtschaftslage gewichtet: Gruppe sehr schlecht (N)", ct_n(zw, "SEHR SCHLECHT")[3], 107)
out <- lauf(V$frei_a3)
ok("Probier A3: Tau-b eigene Lage ep03", koeff(out, "tau"), -0.249)

# =============================================================================================
abschnitt("Grundlage 4: Pearson, Spearman, Drittvariable")
# =============================================================================================
pk <- tibble(person = LETTERS[1:8], alter = c(22, 29, 35, 41, 48, 56, 63, 71), minuten = c(45, 50, 48, 60, 58, 66, 70, 75))
ok("Punkte: Mittelwert Alter", mean(pk$alter), 45.625)
ok("Punkte: Mittelwert Minuten", mean(pk$minuten), 59)
ok("Punkte: SD Alter", round(sd(pk$alter), 1), 17.0)
ok("Punkte: SD Minuten", round(sd(pk$minuten), 1), 10.9)
zx <- round(as.numeric(scale(pk$alter)), 2); zy <- round(as.numeric(scale(pk$minuten)), 2)
stopifnot(identical(zx, c(-1.39, -0.98, -0.62, -0.27, 0.14, 0.61, 1.02, 1.49)))
stopifnot(identical(zy, c(-1.29, -0.83, -1.01, 0.09, -0.09, 0.64, 1.01, 1.47)))
prod_z <- round(as.numeric(scale(pk$alter)) * as.numeric(scale(pk$minuten)), 2)
stopifnot(identical(prod_z, c(1.79, 0.81, 0.63, -0.03, -0.01, 0.39, 1.03, 2.20)))
cat("  ok  z-Werte Alter, Minuten und Produkte wie im Plan\n")
ok("Summe der Produkte", round(sum(as.numeric(scale(pk$alter)) * as.numeric(scale(pk$minuten))), 2), 6.81)
ok("r = 6,81 / 7", round(6.81 / 7, 2), 0.97)
ok("r Punkte (mariposa, gedruckt)", koeff(druck(pk %>% pearson_cor(alter, minuten)), "r"), 0.974)
ok("rho Punkte (mariposa, gedruckt)", koeff(druck(pk %>% spearman_rho(alter, minuten)), "rho"), 0.952)
pk2 <- pk %>% mutate(minuten = if_else(person == "B", 1500, minuten))
ok("Ausreißer (B: 1500 Minuten): r", koeff(druck(pk2 %>% pearson_cor(alter, minuten)), "r"), -0.377)
ok("Ausreißer (B: 1500 Minuten): rho", koeff(druck(pk2 %>% spearman_rho(alter, minuten)), "rho"), 0.476)
# Labor-Zustände (Interaktion): B auf 50, 100, 200, 500 Minuten
for (m in c(100, 200, 500)) {
  pkm <- pk %>% mutate(minuten = if_else(person == "B", m, minuten))
  cat(sprintf("  Labor B = %4d Minuten: r = %.3f, rho = %.3f\n", m, cor(pkm$alter, pkm$minuten), cor(pkm$alter, pkm$minuten, method = "spearman")))
}
ok("Labor B = 100: r", round(cor(pk$alter, replace(pk$minuten, 2, 100)), 3), 0.207)
ok("Labor B = 200: r", round(cor(pk$alter, replace(pk$minuten, 2, 200)), 3), -0.205)
ok("Labor B = 500: r", round(cor(pk$alter, replace(pk$minuten, 2, 500)), 3), -0.335)
ok("Labor B = 100, 200, 500, 1500: rho bleibt", round(cor(pk$alter, replace(pk$minuten, 2, 100), method = "spearman"), 3), 0.476)
ok("Labor B = 76 (knapp über allen anderen): r", round(cor(pk$alter, replace(pk$minuten, 2, 76)), 3), 0.597)
# Echte Zahlen: Alter x Bearbeitungsdauer
ok("Alter x xt10: r gewichtet", koeff(druck(allbus %>% pearson_cor(age, xt10, weights = wghtpew)), "r"), 0.003)
ok("Alter x xt10: rho", koeff(druck(allbus %>% spearman_rho(age, xt10)), "rho"), 0.238)
ok("Alter x xt10 bis 180 Minuten: r gewichtet", koeff(druck(allbus %>% filter(xt10 <= 180) %>% pearson_cor(age, xt10, weights = wghtpew)), "r"), 0.245)
ok("Alter x xt10 bis 180 Minuten: rho", koeff(druck(allbus %>% filter(xt10 <= 180) %>% spearman_rho(age, xt10)), "rho"), 0.267)
ok("spearman_rho mit weights = wghtpew: gleicher Wert", koeff(druck(allbus %>% spearman_rho(age, xt10, weights = wghtpew)), "rho"), 0.238)
ok("xt10 Median (Grundlage 4b)", median(as.numeric(allbus$xt10), na.rm = TRUE), 65)
ok("xt10 größter Wert (aus Sitzung 4)", max(as.numeric(allbus$xt10), na.rm = TRUE), 61895)
# Drittvariable: Internet und Gesundheit, Alter
allbus <- allbus %>%
  mutate(
    gesund       = rec(hs01, rules = "1:2=1 [gut]; 3:5=0 [nicht gut]; else=NA"),
    internet     = rec(xr19, rules = "1=1 [ja]; 2=0 [nein]; else=NA"),
    altersgruppe = rec(age, rules = "18:59=1 [18 bis 59]; 60:74=2 [60 bis 74]; 75:99=3 [75 und älter]; else=NA")
  )
ig <- druck(allbus %>% crosstab(internet, gesund, percentages = "row", weights = wghtpew))
ok("Internet ja: gute Gesundheit %", ct_row(ig, "ja")[2], 59.0)
ok("Internet nein: gute Gesundheit %", ct_row(ig, "nein")[2], 24.0)
ok("Internet x Gesundheit: Phi gesamt", round(allbus %>% phi(internet, gesund, weights = wghtpew), 2), 0.22)
ok("Internet: nur Teil der Befragten (gewichtet gültig)", ct_n(ig, "Total")[3], 3603)
for (g in list(list(2, "60 bis 74", 48.3, 29.6, 0.11, 867, 98), list(3, "75 und älter", 35.5, 20.4, 0.17, 310, 255))) {
  d <- allbus %>% filter(altersgruppe == g[[1]])
  t <- druck(d %>% crosstab(internet, gesund, percentages = "row", weights = wghtpew))
  ok(paste("Alter", g[[2]], ": Internet ja, gute Gesundheit %"), ct_row(t, "ja")[2], g[[3]])
  ok(paste("Alter", g[[2]], ": Internet nein, gute Gesundheit %"), ct_row(t, "nein")[2], g[[4]])
  ok(paste("Alter", g[[2]], ": Phi"), round(d %>% phi(internet, gesund, weights = wghtpew), 2), g[[5]])
  ok(paste("Alter", g[[2]], ": n Internet ja (gewichtet)"), ct_n(t, "ja")[3], g[[6]])
  ok(paste("Alter", g[[2]], ": n Internet nein (gewichtet)"), ct_n(t, "nein")[3], g[[7]])
}
d1 <- allbus %>% filter(altersgruppe == 1)
t1 <- druck(d1 %>% crosstab(internet, gesund, percentages = "row", weights = wghtpew))
ok("Alter 18 bis 59: n Internet nein (gewichtet, zu klein)", ct_n(t1, "nein")[3], 31)
ok("Alter 18 bis 59: Phi", round(d1 %>% phi(internet, gesund, weights = wghtpew), 2), 0.08)
ai <- druck(allbus %>% crosstab(altersgruppe, internet, percentages = "row", weights = wghtpew))
ok("18 bis 59: nutzen Internet %", ct_row(ai, "18 bis 59")[2], 98.5)
ok("60 bis 74: nutzen Internet %", ct_row(ai, "60 bis 74")[2], 89.8)
ok("75 und älter: nutzen Internet %", ct_row(ai, "75 und älter")[2], 54.9)
ag <- druck(allbus %>% crosstab(altersgruppe, gesund, percentages = "row", weights = wghtpew))
ok("18 bis 59: gute Gesundheit %", ct_row(ag, "18 bis 59")[2], 67.2)
ok("60 bis 74: gute Gesundheit %", ct_row(ag, "60 bis 74")[2], 47.7)
ok("75 und älter: gute Gesundheit %", ct_row(ag, "75 und älter")[2], 29.1)
ok("Abstand gesamt (Prozentpunkte)", round(59.0 - 24.0, 1), 35.0)
ok("Abstand 60 bis 74 (Prozentpunkte)", round(48.3 - 29.6, 1), 18.7)
ok("Abstand 75 und älter (Prozentpunkte)", round(35.5 - 20.4, 1), 15.1)

# =============================================================================================
abschnitt("Aufgabe 4: zufriedenheit x ls01")
# =============================================================================================
out <- lauf(V$a4a)
p <- last_plot()
stopifnot(inherits(p, "ggplot"))
invisible(ggplot_build(p))
cat("  ok  A4 Punktwolke gezeichnet\n")
out <- lauf(V$a4b)
ok("A4 Pearson r gewichtet (a4-r)", koeff(out, "r"), 0.265)
ok("A4 Spearman rho (a4-rho)", koeff(out, "rho"), 0.268)
ok("A4 r ungewichtet", koeff(druck(allbus %>% pearson_cor(zufriedenheit, ls01)), "r"), 0.260)
out_w <- lauf(V$a4c)
ok("A4 West r gewichtet (a4-west)", koeff(out_w, "r"), 0.267)
out_o <- lauf(V$a4c, list("1" = "2"))
ok("A4 Ost r gewichtet (a4-ost)", koeff(out_o, "r"), 0.239)
# Toleranz 0,0005: Kein Zielwert akzeptiert einen der anderen Werte (r, rho, West, Ost, r ungewichtet)
a4_ziele <- c(r = 0.265, rho = 0.268, west = 0.267, ost = 0.239)
a4_andere <- c(0.265, 0.268, 0.267, 0.239, 0.260)
for (z in names(a4_ziele)) {
  treffer <- a4_andere[abs(a4_andere - a4_ziele[[z]]) <= 0.0005 + 1e-9]
  stopifnot(length(treffer) == 1, treffer == a4_ziele[[z]])
}
cat("  ok  Toleranz 0,0005: r (0,265), rho (0,268), West-r (0,267), Ost-r (0,239) und r ungewichtet (0,260) sind unterscheidbar\n")
out <- lauf(V$frei_a4)
ok("Probier A4: r Links-rechts, gewichtet", koeff(out, "r"), -0.193)
ok("Probier A4: r Links-rechts West", koeff(druck(allbus %>% filter(eastwest == 1) %>% pearson_cor(zufriedenheit, pa01, weights = wghtpew)), "r"), -0.191)
ok("Probier A4: r Links-rechts Ost", koeff(druck(allbus %>% filter(eastwest == 2) %>% pearson_cor(zufriedenheit, pa01, weights = wghtpew)), "r"), -0.283)

# =============================================================================================
abschnitt("Überblick: dieselben Daten, fünf Maße (zufriedenheit x ep01, gewichtet)")
# =============================================================================================
ok("V", round(suppressWarnings(allbus %>% cramers_v(zufriedenheit, ep01, weights = wghtpew)), 2), 0.28)
ok("Gamma", round(g3, 2), -0.54)
ok("Tau-b", round(koeff(druck(allbus %>% kendall_tau(zufriedenheit, ep01, weights = wghtpew)), "tau"), 2), -0.39)
ok("Spearman rho", koeff(druck(allbus %>% spearman_rho(zufriedenheit, ep01)), "rho"), -0.449)
ok("Pearson r", koeff(druck(allbus %>% pearson_cor(zufriedenheit, ep01, weights = wghtpew)), "r"), -0.463)

# =============================================================================================
abschnitt("Hilfe bei R-Fehlermeldungen: die Meldungen dieser Sitzung")
# =============================================================================================
fehler <- function(expr) conditionMessage(tryCatch(expr, error = function(e) e))
m1 <- fehler(allbus %>% frequency(ps03, weight = wghtpew))
stopifnot(grepl("Unknown argument `weight` of `frequency()`", m1, fixed = TRUE))
m2 <- fehler(allbus %>% cramers_v(pv01, zufrieden, weights = wghtpwe))
stopifnot(grepl("Weights variable `wghtpwe` not found in data.", m2, fixed = TRUE))
m3 <- fehler(allbus %>% select(-zufriedenheit) %>% pearson_cor(zufriedenheit, ls01, weights = wghtpew))
stopifnot(grepl("Column `zufriedenheit` doesn't exist", m3, fixed = TRUE))
m4 <- tryCatch(parse(text = "allbus %>% kendall_tau(zufriedenheit ep01)"), error = function(e) conditionMessage(e))
stopifnot(grepl("unexpected symbol|unerwartetes Symbol", m4))
cat("  ok  vier Fehlermeldungen wie im Plan zitiert\n")

# =============================================================================================
abschnitt("Alle ```r-Blöcke aus sitzung06.md sind Vorlagen dieses Skripts und laufen")
# =============================================================================================
md_datei <- file.path(ordner, "sitzung06.md")
if (file.exists(md_datei)) {
  md <- readLines(md_datei, encoding = "UTF-8")
  anfang <- which(md == "```r"); ende <- which(md == "```")
  bloecke <- vapply(anfang, function(a) paste(md[(a + 1):(min(ende[ende > a]) - 1)], collapse = "\n"), "")
  vorlagen <- vapply(V, identity, "")
  fehlend <- bloecke[!bloecke %in% vorlagen]
  if (length(fehlend)) stop("Block in sitzung06.md ist keine Vorlage des Skripts:\n", fehlend[1])
  cat(sprintf("  ok  %d ```r-Blöcke in sitzung06.md, alle wörtlich hier enthalten\n", length(bloecke)))
  for (b in bloecke) invisible(lauf(b))
  cat("  ok  alle Blöcke laufen\n")
} else {
  cat("  (sitzung06.md nicht gefunden, Abgleich übersprungen)\n")
}
for (n in names(V)) invisible(lauf(V[[n]]))
cat("  ok  alle", length(V), "Vorlagen laufen mit ihren Beispielwerten\n")

cat("\nAlle Zahlen und Vorlagen von Sitzung 6 geprüft.\n")
