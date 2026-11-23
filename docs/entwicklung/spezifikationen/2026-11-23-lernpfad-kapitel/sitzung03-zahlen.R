# Sitzung 3 „Erste Auszählung“: alle Zahlen des Kapitels und jede Codevorlage einmal ausgeführt.
# Daten: ALLBUS 2023, ZA8831 v1.3.0, ungewichtet (eine Vergleichszahl gewichtet), nur Aggregate.
# Pakete: tidyverse, mariposa 0.7.4.
# Aufruf:  Rscript sitzung03-zahlen.R
#   oder:  ALLBUS_SAV=/pfad/ZA8831_v1-3-0.sav Rscript sitzung03-zahlen.R
# Bricht mit Fehler ab, sobald eine Zahl nicht zum Plan (sitzung03.md) passt.

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

# ---------------------------------------------------------------------------------------------
# Hilfsfunktionen: Zahlen genau so prüfen, wie mariposa sie druckt
# ---------------------------------------------------------------------------------------------
ok <- function(name, ist, soll, tol = 0) {
  if (abs(ist - soll) > tol + 1e-9) stop(sprintf("%s: ist %s, soll %s", name, ist, soll))
  cat(sprintf("  ok  %-62s %s\n", name, format(soll, big.mark = ".", decimal.mark = ",")))
}

# Gedruckte Ausgabe von frequency(); Zeile mit einem Label als Zahlen (N, Raw %, Valid %, Cum. %)
freq_text <- function(var) capture.output(allbus %>% frequency({{ var }}))
zeile <- function(text, label) {
  z <- text[grepl(label, text, fixed = TRUE)][1]
  if (is.na(z)) stop("Zeile nicht gefunden: ", label)
  teile <- trimws(strsplit(z, "|", fixed = TRUE)[[1]])
  zahlen <- suppressWarnings(as.numeric(teile))
  zahlen[!is.na(zahlen)]
}
kopf <- function(text) text[grepl("^# total N=", text)][1]

# Gedruckte Ausgabe von describe(); Spalten nach Namen
desc_text <- function(data, var) capture.output(data %>% describe({{ var }}))
desc_wert <- function(text, spalte) {
  kopfzeile <- text[grepl("Variable", text)][1]
  datenzeile <- text[which(grepl("Variable", text))[1] + 2]
  namen <- strsplit(trimws(kopfzeile), " +")[[1]]
  werte <- strsplit(trimws(datenzeile), " +")[[1]]
  as.numeric(werte[match(spalte, namen)])
}

# Fehlende Codes je Grund (mariposa liest sie als NA mit Aufkleber; haven zeigt die Codes)
roh <- haven::read_sav(pfad, user_na = TRUE)
codes <- function(var) {
  x <- as.numeric(unclass(roh[[var]]))
  t <- table(x[x < 0])
  setNames(as.integer(t), names(t))
}

# =============================================================================================
cat("\nVorweg: R lesen\n")
# =============================================================================================
ok("1041 / 5223 * 100 (Bücher täglich, Valid %)", round(1041 / 5223 * 100, 2), 19.93)
ok("Tausenderpunkt-Falle 1.041 / 5223 * 100", round(1.041 / 5223 * 100, 5), 0.01993)

# =============================================================================================
cat("\nGrundlage 1: la01 (Freizeit: Bücher lesen)\n")
# =============================================================================================
la <- freq_text(la01)
stopifnot(kopf(la) == "# total N=5246 valid N=5223 mean=3.08 sd=1.42 skewness=-0.17")
la_zeilen <- list(
  c("TAEGLICH", 1041, 19.84, 19.93, 19.93),
  c("MIND. 1X PRO WOCHE", 973, 18.55, 18.63, 38.56),
  c("MIND. 1X PRO MONAT", 704, 13.42, 13.48, 52.04),
  c("SELTENER", 1551, 29.57, 29.70, 81.73),
  c("NIE", 954, 18.19, 18.27, 100.00)
)
for (z in la_zeilen) {
  ist <- zeile(la, paste0("| ", z[1], " "))
  soll <- as.numeric(z[2:5])
  stopifnot(all(abs(ist[-1] - soll) < 1e-9))
  cat("  ok  la01", z[1], paste(soll, collapse = " / "), "\n")
}
ok("la01 Total valid", zeile(la, "Total valid")[1], 5223)
ok("la01 -42 DATENFEHLER: MFN", zeile(la, "DATENFEHLER: MFN")[2], 4)
ok("la01 -9 KEINE ANGABE", zeile(la, "KEINE ANGABE")[2], 19)
ok("la01 Total missing", zeile(la, "Total missing")[1], 23)
ok("la01 Raw % Total valid", zeile(la, "Total valid")[2], 99.56)
ok("la01 Raw % Total missing", zeile(la, "Total missing")[2], 0.44)
# Modus und Median aus der Tabelle
ok("la01 Modus: SELTENER (Code 4)", as.numeric(names(which.max(table(as.numeric(allbus$la01))))), 4)
ok("la01 Median (Code 3)", median(as.numeric(allbus$la01), na.rm = TRUE), 3)
ok("la01 Formel Valid % TAEGLICH: 1041 / 5223 * 100", round(1041 / 5223 * 100, 2), 19.93)
ok("la01 Formel Raw % TAEGLICH: 1041 / 5246 * 100", round(1041 / 5246 * 100, 2), 19.84)
ok("la01 Cum. % bis Woche = 19.93 + 18.63", round(19.93 + 18.63, 2), 38.56)
ok("la01 seltener oder nie (Valid %) = 29.70 + 18.27", round(29.70 + 18.27, 2), 47.97)
ok("la01 mean (Kopfzeile)", round(mean(as.numeric(allbus$la01), na.rm = TRUE), 2), 3.08)

# Konstruiertes Beispiel 1a: zwölf Befragte (Turm la01), ein leerer Stein mit Aufkleber KEINE ANGABE
turm_la <- c(4, 1, 3, 4, 2, NA, 1, 4, 5, 2, 4, 1)
t12 <- table(turm_la)
stopifnot(identical(as.integer(t12), c(3L, 2L, 1L, 4L, 1L)))
ok("Beispiel 12 Steine: gültig", sum(!is.na(turm_la)), 11)
ok("Beispiel: Raw % Wert 4 = 4 / 12 * 100", round(4 / 12 * 100, 1), 33.3)
ok("Beispiel: Valid % Wert 4 = 4 / 11 * 100", round(4 / 11 * 100, 1), 36.4)
ok("Beispiel: Cum. % bis 1", round(3 / 11 * 100, 1), 27.3)
ok("Beispiel: Cum. % bis 2", round(5 / 11 * 100, 1), 45.5)
ok("Beispiel: Cum. % bis 3", round(6 / 11 * 100, 1), 54.5)
ok("Beispiel: Cum. % bis 4", round(10 / 11 * 100, 1), 90.9)
ok("Beispiel: Median (6. von 11 Steinen)", median(turm_la, na.rm = TRUE), 3)
ok("Beispiel: Modus", as.numeric(names(which.max(t12))), 4)
ok("Beispiel: Valid % Wert 1 = 3 / 11", round(3 / 11 * 100, 1), 27.3)
ok("Beispiel: Valid % Wert 2 = 2 / 11", round(2 / 11 * 100, 1), 18.2)
ok("Beispiel: Valid % Wert 3 = 1 / 11", round(1 / 11 * 100, 1), 9.1)
ok("Beispiel: Valid % Wert 5 = 1 / 11", round(1 / 11 * 100, 1), 9.1)
ok("Beispiel: Raw % fehlender Stein = 1 / 12", round(1 / 12 * 100, 1), 8.3)

# =============================================================================================
cat("\nAufgabe 1: ep04 (Wirtschaftslage in Deutschland in einem Jahr)\n")
# =============================================================================================
ep <- freq_text(ep04)
stopifnot(kopf(ep) == "# total N=5246 valid N=5188 mean=3.40 sd=0.87 skewness=-0.16")
ep_zeilen <- list(
  c("WESENTLICH BESSER", 34, 0.65, 0.66, 0.66),
  c("ETWAS BESSER", 813, 15.50, 15.67, 16.33),
  c("GLEICHBLEIBEND", 1836, 35.00, 35.39, 51.72),
  c("ETWAS SCHLECHTER", 2067, 39.40, 39.84, 91.56),
  c("WESENTL. SCHLECHTER", 438, 8.35, 8.44, 100.00)
)
for (z in ep_zeilen) {
  ist <- zeile(ep, paste0("| ", z[1], " "))
  soll <- as.numeric(z[2:5])
  stopifnot(all(abs(ist[-1] - soll) < 1e-9))
  cat("  ok  ep04", z[1], paste(soll, collapse = " / "), "\n")
}
stopifnot(grepl("mean=3.40", kopf(ep), fixed = TRUE))
cat("  ok  ep04 Kopfzeile mean=3.40 (Aufgabe 3, a3f)\n")
ok("ep04 Total valid (a1a)", zeile(ep, "Total valid")[1], 5188)
ok("ep04 Total missing (a1b)", zeile(ep, "Total missing")[1], 58)
ok("ep04 -42", zeile(ep, "DATENFEHLER: MFN")[2], 5)
ok("ep04 -9", zeile(ep, "KEINE ANGABE")[2], 37)
ok("ep04 -8", zeile(ep, "WEISS NICHT")[2], 16)
ok("ep04 Modus: ETWAS SCHLECHTER (a1c)", as.numeric(names(which.max(table(as.numeric(allbus$ep04))))), 4)
ok("ep04 Median: GLEICHBLEIBEND (a1d)", median(as.numeric(allbus$ep04), na.rm = TRUE), 3)
ok("ep04 besser = 0.66 + 15.67 (Vorlage a1r, a1e)", round(0.66 + 15.67, 2), 16.33)
ok("ep04 schlechter = 39.84 + 8.44 (a1f)", round(39.84 + 8.44, 2), 48.28)
ok("ep04 schlechter = 100 - 51.72", round(100 - 51.72, 2), 48.28)
ok("ep04 schlechter aus N: (2067 + 438) / 5188 * 100", round((2067 + 438) / 5188 * 100, 2), 48.28)
ok("ep04 besser aus N: (34 + 813) / 5188 * 100", round((34 + 813) / 5188 * 100, 2), 16.33)
ok("ep04 schlechter, Personen", 2067 + 438, 2505)
ok("ep04 besser, Personen", 34 + 813, 847)

cat("\n  Probier-Werkstatt A1: ep06 (eigene Wirtschaftslage in einem Jahr)\n")
e6 <- freq_text(ep06)
ok("ep06 GLEICHBLEIBEND Valid %", zeile(e6, "| GLEICHBLEIBEND ")[4], 60.68)
ok("ep06 Cum. % bis ETWAS BESSER", zeile(e6, "| ETWAS BESSER ")[5], 20.03)
ok("ep06 schlechter = 16.86 + 2.42", round(16.86 + 2.42, 2), 19.28)

# =============================================================================================
cat("\nGrundlage 2: st01 (Vertrauen zu Mitmenschen) und Missing-Codes\n")
# =============================================================================================
st <- freq_text(st01)
stopifnot(kopf(st) == "# total N=5246 valid N=3560 mean=2.17 sd=0.80 skewness=-0.29")
ok("st01 MAN KANN TRAUEN N", zeile(st, "MAN KANN TRAUEN")[2], 865)
ok("st01 MUSS VORSICHTIG SEIN N", zeile(st, "MUSS VORSICHTIG SEIN")[2], 1225)
ok("st01 KOMMT DARAUF AN N", zeile(st, "KOMMT DARAUF AN")[2], 1463)
ok("st01 KOMMT DARAUF AN Raw %", zeile(st, "KOMMT DARAUF AN")[3], 27.89)
ok("st01 KOMMT DARAUF AN Valid %", zeile(st, "KOMMT DARAUF AN")[4], 41.10)
ok("st01 SONSTIGES N", zeile(st, "SONSTIGES")[2], 7)
ok("st01 Total valid", zeile(st, "Total valid")[1], 3560)
ok("st01 Total missing", zeile(st, "Total missing")[1], 1686)
ok("st01 -11 TNZ: SPLIT", zeile(st, "TNZ: SPLIT")[2], 1647)
ok("st01 -42", zeile(st, "DATENFEHLER: MFN")[2], 22)
ok("st01 -9", zeile(st, "KEINE ANGABE")[2], 12)
ok("st01 -8", zeile(st, "WEISS NICHT")[2], 5)
ok("st01 Formel Raw %: 1463 / 5246 * 100", round(1463 / 5246 * 100, 2), 27.89)
ok("st01 Formel Valid %: 1463 / 3560 * 100", round(1463 / 3560 * 100, 2), 41.10)
ok("st01 eigene Basis mit weiß nicht: 1463 / (3560 + 5) * 100", round(1463 / (3560 + 5) * 100, 2), 41.04)
ok("st01 gefragt (alle minus Split): 5246 - 1647", 5246 - 1647, 3599)
ok("st01 Raw % aller Missing", zeile(st, "Total missing")[2], 32.14)
ok("st01 Raw % Split", zeile(st, "TNZ: SPLIT")[3], 31.40)
ok("st01 MAN KANN TRAUEN Raw %", zeile(st, "MAN KANN TRAUEN")[3], 16.49)
ok("st01 MAN KANN TRAUEN Valid %", zeile(st, "MAN KANN TRAUEN")[4], 24.30)
ok("st01 MUSS VORSICHTIG SEIN Raw %", zeile(st, "MUSS VORSICHTIG SEIN")[3], 23.35)
ok("st01 MUSS VORSICHTIG SEIN Valid %", zeile(st, "MUSS VORSICHTIG SEIN")[4], 34.41)
ok("st01 SONSTIGES Valid % (unter 1 %, kein eigener Stein)", zeile(st, "SONSTIGES")[4], 0.20)

# 100 Steine nach größten Resten (Bild 2b)
groesste_reste <- function(p) {
  b <- floor(p)
  rest <- order(p - b, decreasing = TRUE)[seq_len(100 - sum(b))]
  b[rest] <- b[rest] + 1
  b
}
alle <- groesste_reste(c(16.49, 23.35, 27.89, 0.13, 32.14))
gueltig <- groesste_reste(c(24.30, 34.41, 41.10, 0.20))
stopifnot(identical(alle, c(17, 23, 28, 0, 32)), identical(gueltig, c(24, 35, 41, 0)))
cat("  ok  100 Steine, Basis alle: 17 / 23 / 28 / 0 / 32 (fehlt)\n")
cat("  ok  100 Steine, Basis gültige: 24 / 35 / 41 / 0\n")

# Codes, die in Grundlage 2a genannt werden (Beispiele mit Variable)
stopifnot(codes("dw19")[["-10"]] == 4709, codes("dh04")[["-32"]] == 102, codes("id02")[["-50"]] == 15)
cat("  ok  Beispiele: dw19 -10 TNZ: FILTER 4709; dh04 -32 NICHT GENERIERBAR 102; id02 -50 KEINER DER SCHICHTEN 15\n")

# =============================================================================================
cat("\nAufgabe 2: pv01 (Wahlabsicht)\n")
# =============================================================================================
pv <- freq_text(pv01)
stopifnot(kopf(pv) == "# total N=5246 valid N=3984 mean=16.14 sd=27.91 skewness=1.90")
ok("pv01 CDU-CSU N", zeile(pv, "| CDU-CSU ")[2], 988)
ok("pv01 CDU-CSU Raw % (a2c)", zeile(pv, "| CDU-CSU ")[3], 18.83)
ok("pv01 CDU-CSU Valid % (a2d)", zeile(pv, "| CDU-CSU ")[4], 24.80)
ok("pv01 SPD Valid %", zeile(pv, "| SPD ")[4], 19.60)
ok("pv01 Total valid", zeile(pv, "Total valid")[1], 3984)
ok("pv01 Total missing (a2b)", zeile(pv, "Total missing")[1], 1262)
ok("pv01 Total missing Raw %", zeile(pv, "Total missing")[2], 24.06)
ok("pv01 -50 NICHT WAHLBERECHTIGT", zeile(pv, "NICHT WAHLBERECHTIGT")[2], 186)
ok("pv01 -42 DATENFEHLER: MFN", zeile(pv, "DATENFEHLER: MFN")[2], 18)
ok("pv01 -9 KEINE ANGABE", zeile(pv, "KEINE ANGABE")[2], 149)
ok("pv01 -8 WEISS NICHT (a2a)", zeile(pv, "WEISS NICHT")[2], 603)
ok("pv01 -8 WEISS NICHT Raw %", zeile(pv, "WEISS NICHT")[3], 11.49)
ok("pv01 -7 VERWEIGERT", zeile(pv, "VERWEIGERT")[2], 306)
ok("pv01 Formel Raw %: 988 / 5246 * 100", round(988 / 5246 * 100, 2), 18.83)
ok("pv01 Formel Valid %: 988 / 3984 * 100", round(988 / 3984 * 100, 2), 24.80)
ok("pv01 Basis mit weiß nicht: 3984 + 603", 3984 + 603, 4587)
ok("pv01 CDU/CSU mit weiß nicht: 988 / (3984 + 603) * 100 (Vorlage a2r)", round(988 / (3984 + 603) * 100, 2), 21.54)
ok("pv01 weiß nicht mit weiß nicht: 603 / (3984 + 603) * 100 (a2e)", round(603 / (3984 + 603) * 100, 2), 13.15)
ok("pv01 mean in der Kopfzeile (Grundlage 3b, gerundet 16,1)", round(mean(as.numeric(allbus$pv01), na.rm = TRUE), 2), 16.14)
pvw <- capture.output(allbus %>% frequency(pv01, weights = wghtpew))
ok("pv01 CDU-CSU Valid % gewichtet (Hinweis)", zeile(pvw, "| CDU-CSU ")[4], 25.81)

cat("\n  Probier-Werkstatt A2: vm21 (Sterbehilfe bei psychischer Krankheit)\n")
vm <- freq_text(vm21)
ok("vm21 -8 WEISS NICHT", zeile(vm, "WEISS NICHT")[2], 494)
ok("vm21 Total valid", zeile(vm, "Total valid")[1], 3030)
ok("vm21 -11 TNZ: SPLIT", zeile(vm, "TNZ: SPLIT")[2], 1647)

# =============================================================================================
cat("\nGrundlage 3: konstruiertes Beispiel, dh04, rd01, la01\n")
# =============================================================================================
haushalt <- c(2, 1, 4, 2, 3, 2, 5, 1, 2)
ok("Beispiel 9 Haushalte: Summe", sum(haushalt), 22)
ok("Beispiel: Mittelwert 22 / 9", round(mean(haushalt), 2), 2.44)
ok("Beispiel: Median (5. von 9)", median(haushalt), 2)
ok("Beispiel: Modus", as.numeric(names(which.max(table(haushalt)))), 2)
mit_wg <- c(haushalt, 12)
ok("Beispiel + WG mit 12: Summe", sum(mit_wg), 34)
ok("Beispiel + WG: Mittelwert 34 / 10", mean(mit_wg), 3.4)
ok("Beispiel + WG: Median (5. und 6. von 10)", median(mit_wg), 2)

dh <- desc_text(allbus, dh04)
ok("dh04 Mean", desc_wert(dh, "Mean"), 2.342)
ok("dh04 Median", desc_wert(dh, "Median"), 2)
ok("dh04 SD", desc_wert(dh, "SD"), 1.177)
ok("dh04 Range", desc_wert(dh, "Range"), 11)
ok("dh04 IQR", desc_wert(dh, "IQR"), 1)
ok("dh04 Skewness", desc_wert(dh, "Skewness"), 1.209)
ok("dh04 N", desc_wert(dh, "N"), 5144)
ok("dh04 Missing", desc_wert(dh, "Missing"), 102)
dhf <- freq_text(dh04)
ok("dh04 Valid % 1 Person", zeile(dhf, "|     1 |")[4], 22.96)
ok("dh04 Valid % 2 Personen", zeile(dhf, "|     2 |")[4], 44.46)
ok("dh04 Cum. % bis 2 Personen (Grundlage 4)", zeile(dhf, "|     2 |")[5], 67.42)
ok("dh04 über dem Mittelwert: 100 - 67.42 (Grundlage 4)", round(100 - 67.42, 2), 32.58)
# Nur zur Begründung (Einzelfall, steht NICHT im Kapitel): der größte Haushalt hat 12 Personen
ok("dh04 größter Haushalt (nicht im Text)", max(as.numeric(allbus$dh04), na.rm = TRUE), 12)
ok("dh04 Haushalte mit 12 Personen (nicht im Text)", sum(as.numeric(allbus$dh04) == 12, na.rm = TRUE), 1)
# Bild B11 (Grundlage 4): Valid % und Cum. % je Haushaltsgröße
ok("dh04 Valid % 3 Personen", zeile(dhf, "|     3 |")[4], 15.01)
ok("dh04 Valid % 4 Personen", zeile(dhf, "|     4 |")[4], 12.58)
ok("dh04 Valid % 5 Personen", zeile(dhf, "|     5 |")[4], 3.79)
ok("dh04 Cum. % bis 1 Person", zeile(dhf, "|     1 |")[5], 22.96)
ok("dh04 Cum. % bis 3 Personen", zeile(dhf, "|     3 |")[5], 82.43)
ok("dh04 Cum. % bis 4 Personen", zeile(dhf, "|     4 |")[5], 95.00)
ok("dh04 Cum. % bis 5 Personen", zeile(dhf, "|     5 |")[5], 98.79)
ok("dh04 6 und mehr: 100 - 98.79", round(100 - 98.79, 2), 1.21)
ok("dh04 über dem Median 2 (= über dem Mittelwert): 100 - 67.42", round(100 - 67.42, 2), 32.58)

rd <- freq_text(rd01)
stopifnot(kopf(rd) == "# total N=5246 valid N=5141 mean=4.06 sd=2.06 skewness=-0.37")
ok("rd01 KEINER RELIGIONSGEM. Valid % (Modus)", zeile(rd, "KEINER RELIGIONSGEM.")[4], 47.68)
ok("rd01 ROEMISCH-KATHOLISCH Valid %", zeile(rd, "ROEMISCH-KATHOLISCH")[4], 22.58)
ok("rd01 EVANG.OHNE FREIKIRCH Valid %", zeile(rd, "EVANG.OHNE FREIKIRCH")[4], 22.08)
ok("rd01 Code 1 = EVANG.OHNE FREIKIRCH", zeile(rd, "EVANG.OHNE FREIKIRCH")[1], 1)
ok("rd01 Code 3 = ROEMISCH-KATHOLISCH", zeile(rd, "ROEMISCH-KATHOLISCH")[1], 3)
ok("rd01 Code 6 = KEINER RELIGIONSGEM.", zeile(rd, "KEINER RELIGIONSGEM.")[1], 6)
ok("rd01 Cum. % bei Code 4 (Grundlage 3b, Schein-Median)", zeile(rd, "AND.CHRISTL.RELIGION")[5], 49.31)
ok("rd01 Cum. % bei Code 5 AND.NICHT-CHRISTLICH", zeile(rd, "AND.NICHT-CHRISTLICH")[5], 52.32)

# =============================================================================================
cat("\nAufgabe 3: dw19 (Dauer der Arbeitslosigkeit in Wochen)\n")
# =============================================================================================
dw <- desc_text(allbus, dw19)
ok("dw19 Mean (a3a), gedruckt 54.708", desc_wert(dw, "Mean"), 54.708)
ok("dw19 Median (a3b), gedruckt 26.000", desc_wert(dw, "Median"), 26)
ok("dw19 SD", desc_wert(dw, "SD"), 75.402)
ok("dw19 Range", desc_wert(dw, "Range"), 519)
ok("dw19 N (a3c)", desc_wert(dw, "N"), 514)
ok("dw19 Missing", desc_wert(dw, "Missing"), 4732)
dwf <- freq_text(dw19)
stopifnot(kopf(dwf) == "# total N=5246 valid N=514 mean=54.71 sd=75.40 skewness=3.15")
ok("dw19 -10 TNZ: FILTER (a3d)", zeile(dwf, "TNZ: FILTER")[2], 4709)
ok("dw19 -9 KEINE ANGABE", zeile(dwf, "KEINE ANGABE")[2], 16)
ok("dw19 -41 DATENFEHLER", zeile(dwf, "| DATENFEHLER ")[2], 7)
ok("dw19 Total missing", zeile(dwf, "Total missing")[1], 4732)
ok("dw19 kleinster Wert", min(as.numeric(allbus$dw19), na.rm = TRUE), 1)
ok("dw19 größter Wert (10 Jahre)", max(as.numeric(allbus$dw19), na.rm = TRUE), 520)
ok("dw19 Personen mit 520 Wochen", zeile(dwf, "|   520 |")[2], 3)
ok("dw19 häufigster Wert 52 Wochen, N", zeile(dwf, "|    52 |")[2], 62)
ok("dw19 26 Wochen, N", zeile(dwf, "|    26 |")[2], 48)
ok("dw19 Mittelwert / Median", round(54.708 / 26, 1), 2.1)
# Wer wurde gefragt? dw18 (Berufstätige: arbeitslos in den letzten 10 Jahren?)
d18 <- freq_text(dw18)
ok("dw18 JA", zeile(d18, "| JA ")[2], 531)
ok("dw18 -10 TNZ: FILTER (nicht berufstätig)", zeile(d18, "TNZ: FILTER")[2], 2263)
ok("dw18 NEIN", zeile(d18, "| NEIN ")[2], 2426)

cat("\n  Probier-Werkstatt A3: Frauen und Männer\n")
frauen_text <- capture.output({
  frauen <- allbus %>% filter(sex == 2)
  frauen %>% describe(dw19)
})
ok("dw19 Frauen Mean", desc_wert(frauen_text, "Mean"), 55.936)
ok("dw19 Frauen Median", desc_wert(frauen_text, "Median"), 29.5)
ok("dw19 Frauen N", desc_wert(frauen_text, "N"), 236)
maenner_text <- capture.output(allbus %>% filter(sex == 1) %>% describe(dw19))
ok("dw19 Männer Mean", desc_wert(maenner_text, "Mean"), 53.61)
ok("dw19 Männer Median", desc_wert(maenner_text, "Median"), 26)
ok("dw19 Männer N", desc_wert(maenner_text, "N"), 272)

# =============================================================================================
cat("\nGrundlage 4 und Aufgabe 4: über dem Mittelwert\n")
# =============================================================================================
ok("dw19 Cum. % bei 52 Wochen", zeile(dwf, "|    52 |")[5], 74.71)
ok("dw19 Cum. % bei 53 Wochen (Sonderfall a4a)", zeile(dwf, "|    53 |")[5], 75.10)
ok("dw19 Cum. % bei 54 Wochen (a4a)", zeile(dwf, "|    54 |")[5], 75.29)
ok("dw19 Cum. % bei 55 Wochen", zeile(dwf, "|    55 |")[5], 75.49)
ok("dw19 über dem Mittelwert: 100 - 75.29 (a4b)", round(100 - 75.29, 2), 24.71)
x19 <- as.numeric(allbus$dw19)
ok("dw19 Personen bis 54 Wochen", sum(x19 <= 54, na.rm = TRUE), 387)
ok("dw19 Personen über dem Mittelwert (a4c)", sum(x19 > 54.708, na.rm = TRUE), 127)
ok("dw19 Kontrolle 127 / 514 * 100", round(127 / 514 * 100, 2), 24.71)
ok("dw19 Cum. % bei 104 Wochen (zwei Jahre)", zeile(dwf, "|   104 |")[5], 88.33)
ok("dw19 Cum. % bei 95 Wochen", zeile(dwf, "|    95 |")[5], 83.07)
ok("dw19 zwei Jahre oder länger: 100 - 83.07", round(100 - 83.07, 2), 16.93)
ok("dw19 Cum. % bei 23 Wochen", zeile(dwf, "|    23 |")[5], 41.25)
ok("dw19 Cum. % bei 26 Wochen (Median)", zeile(dwf, "|    26 |")[5], 50.58)

cat("\n  Probier-Werkstatt A4: dw19c (kategorisiert)\n")
dwc <- freq_text(dw19c)
ok("dw19c 12 BIS 25 WOCHEN Cum. %", zeile(dwc, "12 BIS 25 WOCHEN")[5], 41.25)
ok("dw19c 26 BIS 51 WOCHEN Cum. % (Median-Stufe)", zeile(dwc, "26 BIS 51 WOCHEN")[5], 62.65)
ok("dw19c 26 BIS 51 WOCHEN N (Modus-Stufe)", zeile(dwc, "26 BIS 51 WOCHEN")[2], 110)

# =============================================================================================
cat("\nÜberblick und Prüf dich selbst: keine neuen ALLBUS-Zahlen außer den oben geprüften\n")
# =============================================================================================

# =============================================================================================
cat("\nSonderfälle in den Rückmeldungen und weitere zitierte Zahlen\n")
# =============================================================================================
ok("G1b Kurz überlegen: seltener oder nie = 29.70 + 18.27", round(29.70 + 18.27, 2), 47.97)
ok("G1b von oben: 100 - Cum. % MIND. 1X PRO MONAT", round(100 - 52.04, 2), 47.96)
ok("G1b Sonderfall Raw %: 29.57 + 18.19", round(29.57 + 18.19, 2), 47.76)
ok("G1b Sonderfall Cum. % SELTENER", zeile(la, "| SELTENER ")[5], 81.73)
ok("a1e Sonderfall Raw %: 39.40 + 8.35", round(39.40 + 8.35, 2), 47.75)
ok("Ü1 ep04 ETWAS SCHLECHTER Raw %", zeile(ep, "| ETWAS SCHLECHTER ")[3], 39.40)
ok("a2e Sonderfall 603 / 3984 * 100", round(603 / 3984 * 100, 2), 15.14)
ok("a2e AfD auf Basis 4587: 480 / 4587 * 100", round(480 / 4587 * 100, 2), 10.46)
ok("a2e FDP auf Basis 4587", round(325 / 4587 * 100, 2), 7.09)
ok("a2e Linke auf Basis 4587", round(260 / 4587 * 100, 2), 5.67)
ok("a2e Grüne auf Basis 4587", round(752 / 4587 * 100, 2), 16.39)
ok("pv01 AfD N", zeile(pv, "| AFD ")[2], 480)
ok("pv01 FDP N", zeile(pv, "| FDP ")[2], 325)
ok("pv01 DIE LINKE N", zeile(pv, "| DIE LINKE ")[2], 260)
ok("pv01 DIE GRUENEN N", zeile(pv, "| DIE GRUENEN ")[2], 752)
# dw19 nur bei Voll- und Teilzeit berufstätigen (work 1 und 2) gültig
w <- as.numeric(allbus$work); d <- !is.na(allbus$dw19)
ok("dw19 gültig bei work == 1 (Vollzeit)", sum(d & w == 1, na.rm = TRUE), 365)
ok("dw19 gültig bei work == 2 (Teilzeit)", sum(d & w == 2, na.rm = TRUE), 149)
ok("dw19 gültig bei work 3 oder 4", sum(d & w %in% 3:4, na.rm = TRUE), 0)
# a3d, Hilfe 3, Plenum: Wer nicht in Voll- oder Teilzeit arbeitet (auch wer gerade arbeitslos ist), bekam dw18 nicht
ok("dw18 gültig bei work 3 oder 4 (nicht gefragt)", sum(!is.na(allbus$dw18) & w %in% 3:4, na.rm = TRUE), 0)
ok("dw19 über dem Median: 100 - 50.58", round(100 - 50.58, 2), 49.42)
ok("dw19 gültig nur bei dw18 == 1 (ja)", sum(d & as.numeric(allbus$dw18) != 1, na.rm = TRUE), 0)
ok("dw18 nein plus nicht berufstätig", 2426 + 2263, 4689)

# =============================================================================================
cat("\nAlle Codevorlagen einmal ausführen (Marken ⟦…⟧ mit ihrem Beispielwert)\n")
# =============================================================================================
# Jede Vorlage steht hier genau so wie im Plan sitzung03.md; das Skript prüft das.
vorlagen <- c(
  start = '# Pakete laden und Daten einlesen
library(tidyverse)
library(mariposa)

allbus <- read_spss("ZA8831_v1-3-0.sav")',
  r_frequency = '# Häufigkeitstabelle: Wie oft lesen die Befragten Bücher?
allbus %>%
  frequency(la01)',
  r_describe = '# Kennzahlen: Wie viele Personen leben im Haushalt?
allbus %>%
  describe(dh04)',
  r_rechnen = '# R als Taschenrechner: 1041 von 5223 gültigen Antworten in Prozent
1041 / 5223 * 100',
  a1 = '# Häufigkeitstabelle: Wirtschaftslage in Deutschland in einem Jahr
allbus %>%
  frequency(ep04)',
  a1r = '# Zwei Zeilen zusammenzählen (Valid %): hier „wesentlich besser“ und „etwas besser“
⟦0.66⟧ + ⟦15.67⟧',
  frei_a1 = '# Eine Idee: die eigene wirtschaftliche Lage in einem Jahr
allbus %>%
  frequency(ep06)',
  a2 = '# Häufigkeitstabelle: Wahlabsicht bei der nächsten Bundestagswahl
allbus %>%
  frequency(pv01)',
  a2r = '# Eigene Basis: gültige Antworten plus „weiß nicht“
# N der Gruppe geteilt durch (3984 gültige + 603 „weiß nicht“), mal 100
⟦988⟧ / (3984 + 603) * 100',
  frei_a2 = '# Eine Idee: Sterbehilfe bei psychischer Krankheit, eine Frage mit vielen „weiß nicht“
allbus %>%
  frequency(vm21)',
  a3 = '# Kennzahlen: Dauer der Arbeitslosigkeit in Wochen
allbus %>%
  describe(dw19)',
  a3f = '# Häufigkeitstabelle derselben Variable: Wer fehlt, steht ganz unten
allbus %>%
  frequency(dw19)',
  frei_a3 = '# Eine Idee: nur Frauen (sex == 2), Befragte auswählen wie in Sitzung 2
frauen <- allbus %>%
  filter(sex == 2)

frauen %>%
  describe(dw19)',
  a4 = '# Häufigkeitstabelle der Wochen mit Cum. %
allbus %>%
  frequency(dw19)',
  a4r = '# Anteil über dem Mittelwert: 100 minus Cum. % der letzten Zeile darunter
100 - ⟦67.42⟧',
  frei_a4 = '# Eine Idee: dieselbe Dauer in sechs Stufen zusammengefasst
allbus %>%
  frequency(dw19c)'
)

plan <- file.path(dirname(normalizePath(sub("^--file=", "", grep("^--file=", commandArgs(FALSE), value = TRUE)[1]))),
                  "sitzung03.md")
plan_text <- if (file.exists(plan)) paste(readLines(plan, encoding = "UTF-8"), collapse = "\n") else NA
if (is.na(plan_text)) cat("  (sitzung03.md nicht gefunden, Abgleich übersprungen)\n")

ausgaben <- list()
allbus_original <- allbus
# Globale Hilfsobjekte dürfen keine Vorlage stützen: nur Pakete und allbus sind sichtbar
for (k in names(vorlagen)) {
  code <- vorlagen[[k]]
  if (!is.na(plan_text) && !grepl(paste0("```r\n", code, "\n```"), plan_text, fixed = TRUE)) {
    stop("Vorlage ", k, " steht nicht wörtlich als ```r-Block in sitzung03.md")
  }
  # Marken mit ihrem Beispielwert; read_spss mit dem Pfad dieses Skripts
  ausfuehrbar <- gsub("⟦|⟧", "", code)
  ausfuehrbar <- sub('read_spss("ZA8831_v1-3-0.sav")', "read_spss(pfad)", ausfuehrbar, fixed = TRUE)
  # Wie in der Code-Werkstatt: jede Vorlage für sich, in einer frischen Umgebung, in der nur allbus liegt
  frisch <- new.env(parent = as.environment("package:mariposa"))
  frisch$allbus <- allbus_original
  frisch$pfad <- pfad
  out <- capture.output(eval(parse(text = ausfuehrbar, encoding = "UTF-8"), envir = frisch))
  stopifnot(setequal(setdiff(ls(frisch), c("allbus", "pfad")), switch(k, frei_a3 = "frauen", character(0))))
  if (k != "start") stopifnot(length(out) > 0)
  ausgaben[[k]] <- out
  cat(sprintf("  ok  Vorlage %-12s %3d Zeilen Ausgabe\n", k, length(out)))
}
stopifnot(nrow(allbus) == 5246)

# Gedruckte Ergebnisse der Taschenrechner-Vorlagen (mit Beispielwert) und der getauschten Fassungen
stopifnot(ausgaben$r_rechnen == "[1] 19.93107")
stopifnot(ausgaben$a1r == "[1] 16.33")
stopifnot(ausgaben$a2r == "[1] 21.53913")
stopifnot(ausgaben$a4r == "[1] 32.58")
stopifnot(capture.output(print(39.84 + 8.44)) == "[1] 48.28")
stopifnot(capture.output(print(603 / (3984 + 603) * 100)) == "[1] 13.14585")
stopifnot(capture.output(print(100 - 75.29)) == "[1] 24.71")
cat("  ok  Taschenrechner: Vorlagen 19.93107, 16.33, 21.53913, 32.58; getauscht 48.28, 13.14585, 24.71\n")

# Werte aus den Vorlagen-Ausgaben, die das Kapitel zitiert
stopifnot(any(grepl("dh04      2.342   2.000  1.177  11.000  1.000     1.209  5144      102", ausgaben$r_describe, fixed = TRUE)))
stopifnot(any(grepl("dw19      54.708  26.000  75.402  519.000  40.250     3.148  514     4732", ausgaben$a3, fixed = TRUE)))
stopifnot(any(grepl("|    54 |              |    1 |   0.02 |    0.19 |  75.29 |", ausgaben$a4, fixed = TRUE)))
cat("  ok  describe(dh04), describe(dw19) und Zeile 54 von frequency(dw19) wie im Plan\n")

cat("\nFertig: alle Zahlen von Sitzung 3 stimmen.\n")
