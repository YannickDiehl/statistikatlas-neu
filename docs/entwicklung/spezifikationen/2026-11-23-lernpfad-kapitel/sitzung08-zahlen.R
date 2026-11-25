# Sitzung 8 „Index und Skala“: alle Zahlen des Kapitels und jede Codevorlage einmal ausgeführt.
# Daten: ALLBUS 2023, ZA8831 v1.3.0. Nur Aggregate.
# Gewichtung wie in der bisherigen Aufgabe s07: Cronbachs α und Personenzahlen ungewichtet,
# Aussagen über die Bevölkerung (Mittelwerte, Anteile) gewichtet mit wghtpew.
# Pakete: tidyverse, mariposa 0.7.4.
# Aufruf:  Rscript sitzung08-zahlen.R
#   oder:  ALLBUS_SAV=/pfad/ZA8831_v1-3-0.sav Rscript sitzung08-zahlen.R
# Bricht mit Fehler ab, sobald eine Zahl nicht zum Plan (sitzung08.md) passt.
# Vorlagen stehen hier wörtlich wie im Plan; ⟦…⟧ markiert anzupassende Stellen.
# Jede Vorlage läuft in einer frischen Umgebung, in der nur `allbus` existiert (wie die
# Code-Werkstatt, die allbus vor jedem Ausführen zurücksetzt): einmal so, wie sie dasteht
# (Platzhalter), und einmal gelöst.

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
roh <- read_spss(pfad)
stopifnot(nrow(roh) == 5246)

# ---------------------------------------------------------------------------------------------
# Hilfsfunktionen
# ---------------------------------------------------------------------------------------------
ok <- function(name, ist, soll, tol = 0) {
  if (length(ist) != 1 || is.na(ist) || abs(ist - soll) > tol + 1e-9) {
    meldung <- sprintf("%s: ist %s, soll %s", name, paste(ist, collapse = "/"), soll)
    if (Sys.getenv("SAMMELN") == "1") return(cat("  FEHLT", meldung, "\n"))
    stop(meldung)
  }
  cat(sprintf("  ok  %-70s %s\n", name, format(soll, big.mark = ".", decimal.mark = ",")))
}
ja <- function(name, bedingung) {
  if (!isTRUE(bedingung)) stop(name)
  cat(sprintf("  ok  %s\n", name))
}
abschnitt <- function(t) cat("\n==== ", t, " ====\n", sep = "")

plain <- function(code) gsub("⟦|⟧", "", code)
loesen <- function(code, ersatz) {
  for (alt in names(ersatz)) code <- sub(paste0("⟦", alt, "⟧"), ersatz[[alt]], code, fixed = TRUE)
  stopifnot(!grepl("⟦", code))
  code
}

# Vorlage in frischer Umgebung ausführen: nur allbus (frisch eingelesen) und die geladenen Pakete
laufen <- function(name, code) {
  cat("\n---- Vorlage:", name, "----\n")
  env <- new.env(parent = as.environment(2))
  assign("allbus", roh, envir = env)
  meldungen <- character()
  out <- withCallingHandlers(
    capture.output({
      for (a in parse(text = code)) {
        wert <- withVisible(eval(a, envir = env))
        if (wert$visible) print(wert$value)
      }
    }),
    warning = function(w) {
      meldungen <<- c(meldungen, conditionMessage(w))
      invokeRestart("muffleWarning")
    }
  )
  attr(out, "warnungen") <- meldungen
  out
}

# Zahlen aus einer gedruckten Zeile: alles nach dem Schlüssel
zahlen <- function(zeile, schluessel = NULL) {
  if (!is.null(schluessel)) zeile <- sub(paste0(".*?", schluessel), "", zeile, perl = TRUE)
  as.numeric(regmatches(zeile, gregexpr("-?[0-9]+(\\.[0-9]+)?", zeile))[[1]])
}
finde <- function(out, muster, nr = 1) {
  z <- out[grepl(muster, out, perl = TRUE)]
  if (length(z) < nr) stop("Zeile nicht gefunden: ", muster)
  z[nr]
}
# reliability() kurz: Cronbach's Alpha = 0.833 (Good), McDonald's Omega = 0.841, N = 3427
rel_kurz <- function(out, nr = 1) {
  z <- finde(out, "Cronbach's Alpha = ", nr)
  list(alpha = as.numeric(sub(".*Alpha = (-?[0-9.]+) .*", "\\1", z)),
       stufe = sub(".*\\((.*)\\), McDonald.*", "\\1", z),
       omega = as.numeric(sub(".*Omega = ([0-9.]+),.*", "\\1", z)),
       n = as.numeric(sub(".*N = ([0-9]+).*", "\\1", z)))
}
# summary(reliability()): Kennzahlen und Item-Total-Zeilen
rel_lang <- function(out) {
  wert <- function(k) zahlen(finde(out, paste0("^\\s*", k)), k)[1]
  items <- list()
  start <- grep("Item-Total Statistics", out)
  for (z in out[(start + 1):length(out)]) {
    teile <- strsplit(trimws(z), "\\s+")[[1]]
    if (length(teile) == 6 && !is.na(suppressWarnings(as.numeric(teile[2])))) {
      items[[teile[1]]] <- as.numeric(teile[2:6])
    }
  }
  list(alpha = wert("Cronbach's Alpha:"), std = wert("Alpha \\(standardized\\):"),
       omega = wert("McDonald's Omega:"), n = wert("N \\(listwise\\):"), items = items)
}
# describe(): Zeile der Variable -> Mean, Median, SD, Range, IQR, Skewness, N, Missing
beschr <- function(out, var) {
  z <- finde(out, paste0("^\\s*", var, "\\s"))
  w <- zahlen(z, var)
  setNames(w, c("mean", "median", "sd", "range", "iqr", "skew", "n", "missing"))
}
# frequency(): Zeile mit Code bzw. Wert -> N, Raw %, Valid %, Cum. %
freq <- function(out, wert) {
  for (z in out[startsWith(trimws(out), "|")]) {
    teile <- trimws(strsplit(z, "|", fixed = TRUE)[[1]])
    if (length(teile) > 2 && teile[2] == wert) {
      w <- suppressWarnings(as.numeric(teile[-(1:2)]))
      return(w[!is.na(w)])
    }
  }
  stop("Zeile nicht gefunden: ", wert)
}

# =============================================================================================
# Vorlagen (wörtlich wie in sitzung08.md)
# =============================================================================================
V <- list()

V$start <- '# Pakete laden und Daten einlesen
library(tidyverse)
library(mariposa)

allbus <- read_spss("ZA8831_v1-3-0.sav")'

V$r_rev <- '# Umpolen wie in Sitzung 5: aus 1 wird 4, aus 2 wird 3 und so weiter
allbus %>%
  mutate(
    fr03b_um = rec(fr03b, rules = "rev")
  ) %>%
  frequency(fr03b_um)'

V$r_rowmeans <- '# Ein Wert je Person: Mittelwert der vier Fragen zu Geflüchteten
allbus %>%
  mutate(
    fluechtlinge = row_means(pick(mp16, mp17, mp18, mp19), min_valid = 3)
  ) %>%
  describe(fluechtlinge, weights = wghtpew)'

V$r_reliability <- '# Wie zuverlässig messen die vier Fragen zur Verbundenheit zusammen? Kurz
allbus %>%
  reliability(pn12, pn13, pn16, pn17)

# Dasselbe ausführlich, mit einer Zeile je Item
allbus %>%
  reliability(pn12, pn13, pn16, pn17) %>%
  summary()'

V$a1 <- '# Populismus-Index: Mittelwert der sieben Aussagen je Person
# Wie viele Befragte bekommen einen Wert? Personen zählst du ohne Gewicht.
allbus %>%
  mutate(
    populismus = row_means(pick(pa29, pa30, pa31, pa32, pa33, pa34, pa35), min_valid = ⟦7⟧)
  ) %>%
  describe(populismus)'

V$a1w <- '# Populismus-Index wie in Schritt 1, mit mindestens fünf von sieben Antworten
# Wie populistisch sind die Befragten im Mittel? Aussage über alle: mit Gewicht
allbus %>%
  mutate(
    populismus = row_means(pick(pa29, pa30, pa31, pa32, pa33, pa34, pa35), min_valid = 5)
  ) %>%
  describe(populismus, weights = wghtpew)'

V$frei_a1 <- '# Eine Idee: Populismus-Index wie in Aufgabe 1, Westen und Osten im Vergleich
# (t-Test kennst du aus Sitzung 7)
allbus %>%
  mutate(
    populismus = row_means(pick(pa29, pa30, pa31, pa32, pa33, pa34, pa35), min_valid = 5)
  ) %>%
  t_test(populismus, group = eastwest, weights = wghtpew) %>%
  summary()
'

V$a2 <- '# Wie zuverlässig messen die sieben Populismus-Aussagen zusammen? Ausführlich mit summary()
allbus %>%
  reliability(pa29, pa30, pa31, pa32, pa33, pa34, pa35) %>%
  summary()'

V$a2ohne <- '# Gegenprobe: dieselbe Rechnung ohne ein Item
allbus %>%
  reliability(⟦pa29, ⟧pa30, pa31, pa32, pa33, pa34, pa35)'

V$frei_a2 <- '# Eine Idee: Wie zuverlässig messen nur drei der sieben Aussagen zusammen?
allbus %>%
  reliability(pa31, pa32, pa33)
'

V$a3 <- '# Wie zuverlässig messen die sechs Aussagen zum Islam zusammen, so wie sie im Datensatz stehen?
allbus %>%
  reliability(mm01, mm02, mm03, mm04, mm05, mm06) %>%
  summary()'

V$a3um <- '# Zwei Items umpolen: aus 1 wird 7, aus 2 wird 6 und so weiter
# Dann die Reliabilität mit den umgepolten Items statt der alten
allbus %>%
  mutate(
    mm02_um = rec(mm02, rules = "rev"),
    mm05_um = rec(mm05, rules = "rev")
  ) %>%
  reliability(mm01, ⟦mm02⟧, mm03, mm04, ⟦mm05⟧, mm06) %>%
  summary()'

V$frei_a3 <- '# Eine Idee: der Index mit und ohne Umpolen (umgepolt wie in Aufgabe 3)
allbus %>%
  mutate(
    mm02_um           = rec(mm02, rules = "rev"),
    mm05_um           = rec(mm05, rules = "rev"),
    vorbehalte        = row_means(pick(mm01, mm02_um, mm03, mm04, mm05_um, mm06), min_valid = 5),
    vorbehalte_falsch = row_means(pick(mm01, mm02, mm03, mm04, mm05, mm06), min_valid = 5)
  ) %>%
  describe(vorbehalte, vorbehalte_falsch, weights = wghtpew)
'

V$a4 <- '# Drei Aussagen, zwei Indizes: Zahl der Zustimmungen und Mittelwert
allbus %>%
  mutate(
    z31          = rec(pa31, rules = "1:2=1 [stimmt zu]; 3:5=0 [stimmt nicht zu]; else=NA"),
    z32          = rec(pa32, rules = "1:2=1 [stimmt zu]; 3:5=0 [stimmt nicht zu]; else=NA"),
    z33          = rec(pa33, rules = "1:2=1 [stimmt zu]; 3:5=0 [stimmt nicht zu]; else=NA"),
    zustimmungen = row_sums(pick(z31, z32, z33), min_valid = 3),
    kurz         = row_means(pick(pa31, pa32, pa33), min_valid = 3)
  ) %>%
  frequency(⟦zustimmungen⟧, weights = wghtpew)'

V$frei_a4 <- '# Eine Idee: Zahl der Zustimmungen wie in Aufgabe 4, Westen und Osten im Vergleich
allbus %>%
  mutate(
    z31          = rec(pa31, rules = "1:2=1 [stimmt zu]; 3:5=0 [stimmt nicht zu]; else=NA"),
    z32          = rec(pa32, rules = "1:2=1 [stimmt zu]; 3:5=0 [stimmt nicht zu]; else=NA"),
    z33          = rec(pa33, rules = "1:2=1 [stimmt zu]; 3:5=0 [stimmt nicht zu]; else=NA"),
    zustimmungen = row_sums(pick(z31, z32, z33), min_valid = 3)
  ) %>%
  crosstab(zustimmungen, eastwest, percentages = "col", weights = wghtpew)
'

# Startblock: im Skript ist die Datei schon über pfad eingelesen; nur die Form prüfen
stopifnot(grepl("library(tidyverse)\nlibrary(mariposa)", V$start, fixed = TRUE))

# Jede Vorlage im Pipe-Stil: %>% nie |>, keine Zwischenobjekte über Vorlagen hinweg
for (n in names(V)) {
  stopifnot(!grepl("|>", V[[n]], fixed = TRUE))
  stopifnot(!grepl("filter(!is.na", V[[n]], fixed = TRUE))
  stopifnot(!grepl("ifelse", V[[n]], fixed = TRUE))
}

# =============================================================================================
abschnitt("Vorweg R lesen")
# =============================================================================================
out <- laufen("r_rev", V$r_rev)
f <- freq(out, "1")
ja("R1 fr03b_um: Code 1 heißt jetzt STIMME GAR NICHT ZU", any(grepl("\\|\\s+1 \\| STIMME GAR NICHT ZU", out)))
ok("R1 fr03b_um: N bei Code 1", f[1], 1098)
ok("R1 fr03b_um: N bei Code 4 (vorher 1 STIMME VOLL ZU)", freq(out, "4")[1], 366)

out <- laufen("r_rowmeans", V$r_rowmeans)
d <- beschr(out, "fluechtlinge")
ok("R2 fluechtlinge gewichtet: Mean", d[["mean"]], 2.457)
ok("R2 fluechtlinge gewichtet: Median", d[["median"]], 2.5)
ok("R2 fluechtlinge gewichtet: SD", d[["sd"]], 0.838)
ok("R2 fluechtlinge gewichtet: Skewness", d[["skew"]], 0.094)
ok("R2 fluechtlinge gewichtet: N (Summe der Gewichte)", d[["n"]], 3473)
ok("R2 fluechtlinge gewichtet: Missing", d[["missing"]], 1773)

out <- laufen("r_reliability", V$r_reliability)
k <- rel_kurz(out)
ok("R2 pn: alpha", k$alpha, 0.726); ja("R2 pn: Stufe Acceptable", k$stufe == "Acceptable")
ok("R2 pn: omega", k$omega, 0.733); ok("R2 pn: N", k$n, 3521)
l <- rel_lang(out)
ok("R2 pn: alpha standardisiert", l$std, 0.731)
ok("R2 pn12 Trennschärfe", l$items$pn12[3], 0.457); ok("R2 pn12 alpha ohne", l$items$pn12[4], 0.700)
ok("R2 pn13 Trennschärfe", l$items$pn13[3], 0.620); ok("R2 pn13 alpha ohne", l$items$pn13[4], 0.603)
ok("R2 pn16 Trennschärfe", l$items$pn16[3], 0.603); ok("R2 pn16 alpha ohne", l$items$pn16[4], 0.617)
ok("R2 pn17 Trennschärfe", l$items$pn17[3], 0.402); ok("R2 pn17 alpha ohne", l$items$pn17[4], 0.733)

# =============================================================================================
abschnitt("Grundlage 1: Mittelwertindex (mp16 bis mp19)")
# =============================================================================================
mp <- roh %>% mutate(across(c(mp16, mp17, mp18, mp19), as.numeric))
nv <- rowSums(!is.na(select(mp, mp16, mp17, mp18, mp19)))
ok("G1 Personen mit allen vier Antworten", sum(nv == 4), 3424)
ok("G1 Personen mit drei Antworten", sum(nv == 3), 58)
ok("G1 Personen mit zwei Antworten", sum(nv == 2), 15)
ok("G1 Personen mit einer Antwort", sum(nv == 1), 7)
x <- roh %>%
  mutate(
    f4 = row_means(pick(mp16, mp17, mp18, mp19), min_valid = 4),
    f3 = row_means(pick(mp16, mp17, mp18, mp19), min_valid = 3),
    f0 = row_means(pick(mp16, mp17, mp18, mp19)),
    s0 = row_sums(pick(mp16, mp17, mp18, mp19))
  )
ok("G1 Indexwert mit min_valid = 4", sum(!is.na(x$f4)), 3424)
ok("G1 Indexwert mit min_valid = 3", sum(!is.na(x$f3)), 3482)
ok("G1 Indexwert ohne min_valid", sum(!is.na(x$f0)), 3504)
ok("G1 Summe ohne min_valid: kleinster Wert", min(x$s0, na.rm = TRUE), 2)
ok("G1 Summe ohne min_valid: größter Wert", max(x$s0, na.rm = TRUE), 20)

# Einzelne Fragen, gewichtet: Anteil „Risiko überwiegt“ oder „eher Risiko“ (Cum. % bei 2)
for (v in c("mp16", "mp17", "mp18", "mp19")) {
  o <- capture.output(roh %>% frequency(!!sym(v), weights = wghtpew))
  cat("  ", v, "Cum. % bei 2:", freq(o, "2")[4], "\n")
}
o <- capture.output(roh %>% frequency(mp16, weights = wghtpew)); ok("G1 mp16 Risiko (Cum.% 2)", freq(o, "2")[4], 64.87)
o <- capture.output(roh %>% frequency(mp17, weights = wghtpew)); ok("G1 mp17 Risiko (Cum.% 2)", freq(o, "2")[4], 69.16)
o <- capture.output(roh %>% frequency(mp18, weights = wghtpew)); ok("G1 mp18 Risiko (Cum.% 2)", freq(o, "2")[4], 49.44)
o <- capture.output(roh %>% frequency(mp19, weights = wghtpew)); ok("G1 mp19 Risiko (Cum.% 2)", freq(o, "2")[4], 38.71)

# Verteilung des Index (min_valid = 4, nur Viertelwerte), gewichtet: Valid % je Wert
o <- capture.output(x %>% frequency(f4, weights = wghtpew))
werte <- c("1", "1.25", "1.5", "1.75", "2", "2.25", "2.5", "2.75", "3", "3.25", "3.5", "3.75",
           "4", "4.25", "4.5", "4.75", "5")
soll_vp <- c(8.31, 3.73, 6.15, 6.52, 12.48, 9.33, 10.51, 8.87, 12.63, 7.36, 6.20, 4.25,
             2.11, 0.70, 0.25, 0.09, 0.51)
soll_cum <- c(8.31, 12.04, 18.19, 24.71, 37.19, 46.52, 57.03, 65.90, 78.54, 85.90, 92.10, 96.35,
              98.45, 99.16, 99.41, 99.49, 100.00)
for (i in seq_along(werte)) {
  ok(paste("G1 Index Valid % bei", werte[i]), freq(o, werte[i])[3], soll_vp[i])
  ok(paste("G1 Index Cum. % bei", werte[i]), freq(o, werte[i])[4], soll_cum[i])
}
ok("G1 Index über 3: 100 minus Cum. % bei 3", round(100 - freq(o, "3")[4], 2), 21.46)
ok("G1 Index N gewichtet (Total valid)", zahlen(finde(o, "Total valid"))[1], 3412)
d <- beschr(capture.output(x %>% describe(f4, weights = wghtpew)), "f4")
ok("G1 Index min_valid 4 gewichtet: Mean", d[["mean"]], 2.452)
ok("G1 Index min_valid 4 gewichtet: Median", d[["median"]], 2.5)
# Mit min_valid = 3 kommen Drittelwerte dazu (zusammen gewichtet 1,15 %)
o3 <- capture.output(x %>% frequency(f3, weights = wghtpew))
drittel <- c("1.33333333333333", "1.66666666666667", "2.33333333333333", "2.66666666666667",
             "3.33333333333333", "3.66666666666667", "4.66666666666667")
ok("G1 Drittelwerte mit min_valid = 3 (Valid % zusammen)", round(sum(sapply(drittel, function(w) freq(o3, w)[3])), 2), 1.15)

# =============================================================================================
abschnitt("Grundlage 2: Cronbachs alpha (pn12, pn13, pn16, pn17)")
# =============================================================================================
r <- roh %>% reliability(pn12, pn13, pn16, pn17)
cm <- r$inter_item_cor
ok("G2 r pn12-pn13", round(cm[1, 2], 3), 0.568); ok("G2 r pn12-pn16", round(cm[1, 3], 3), 0.340)
ok("G2 r pn12-pn17", round(cm[1, 4], 3), 0.190); ok("G2 r pn13-pn16", round(cm[2, 3], 3), 0.528)
ok("G2 r pn13-pn17", round(cm[2, 4], 3), 0.304); ok("G2 r pn16-pn17", round(cm[3, 4], 3), 0.495)
rquer <- mean(cm[upper.tri(cm)])
mk <- sapply(1:4, function(i) round(mean(cm[i, -i]), 3))
ok("G2 mittlere Korrelation Gemeinde", mk[1], 0.366); ok("G2 mittlere Korrelation Bundesland", mk[2], 0.467)
ok("G2 mittlere Korrelation Deutschland", mk[3], 0.454); ok("G2 mittlere Korrelation EU", mk[4], 0.330)
ok("G2 N listwise", r$n, 3521)
ok("G2 mittlere Korrelation", round(rquer, 3), 0.404)
astd <- function(k, r) k * r / (1 + (k - 1) * r)
ok("G2 Formel k = 4, r = 0,404 (gerundet eingesetzt)", round(astd(4, 0.404), 3), 0.731)
ok("G2 Zwischenschritt oben 4 mal 0,404", 4 * 0.404, 1.616, 1e-9)
ok("G2 Zwischenschritt unten 1 + 3 mal 0,404", 1 + 3 * 0.404, 2.212, 1e-9)
ok("G2 Kurz überlegen: k = 8, r = 0,404", round(astd(8, 0.404), 3), 0.844)
ok("G2 Rechner: k = 2, r = 0,404", round(astd(2, 0.404), 3), 0.575)
ok("G2 Rechner: k = 12, r = 0,404", round(astd(12, 0.404), 3), 0.891)
ok("G2 Rechner: k = 4, r = 0,2", round(astd(4, 0.2), 3), 0.5)
ok("G2 Rechner: k = 4, r = 0,6", round(astd(4, 0.6), 3), 0.857)
ok("G2 Rechner: k = 20, r = 0,2", round(astd(20, 0.2), 3), 0.833)
# Gewichtet: Anteil „stark“ oder „ziemlich verbunden“ (Cum. % bei 2)
for (v in c("pn12", "pn13", "pn16", "pn17")) {
  o <- capture.output(roh %>% frequency(!!sym(v), weights = wghtpew))
  cat("  ", v, "Cum. % bei 2:", freq(o, "2")[4], "\n")
}
o <- capture.output(roh %>% frequency(pn12, weights = wghtpew)); ok("G2 pn12 verbunden", freq(o, "2")[4], 65.74)
o <- capture.output(roh %>% frequency(pn13, weights = wghtpew)); ok("G2 pn13 verbunden", freq(o, "2")[4], 63.28)
o <- capture.output(roh %>% frequency(pn16, weights = wghtpew)); ok("G2 pn16 verbunden", freq(o, "2")[4], 70.89)
o <- capture.output(roh %>% frequency(pn17, weights = wghtpew)); ok("G2 pn17 verbunden", freq(o, "2")[4], 49.48)
# mariposa-Faustregel (Einstufung hinter alpha)
fi <- get(".alpha_interpretation", asNamespace("mariposa"))
ja("G2 Faustregel 0.9", fi(0.9) == "Excellent"); ja("G2 Faustregel 0.8", fi(0.8) == "Good")
ja("G2 Faustregel 0.7", fi(0.7) == "Acceptable"); ja("G2 Faustregel 0.6", fi(0.6) == "Questionable")
ja("G2 Faustregel 0.59", fi(0.59) == "Poor"); ja("G2 Faustregel negativ", fi(-0.1) == "negative; check item coding")

# =============================================================================================
abschnitt("Grundlage 3: Umpolen (fr07, fr08, fr03b, fr04b)")
# =============================================================================================
it <- c("fr07", "fr08", "fr03b", "fr04b")
b <- roh %>% mutate(across(all_of(it), ~ rec(.x, rules = "rev"), .names = "{.col}_um"))
zust <- sapply(it, function(v) {
  o <- capture.output(roh %>% frequency(!!sym(v), weights = wghtpew)); freq(o, "2")[4]
})
print(zust)
ok("G3 fr07 Zustimmung gewichtet", zust[["fr07"]], 68.88)
ok("G3 fr08 Zustimmung gewichtet", zust[["fr08"]], 66.91)
ok("G3 fr03b Zustimmung gewichtet", zust[["fr03b"]], 36.21)
ok("G3 fr04b Zustimmung gewichtet", zust[["fr04b"]], 20.06)
# Umpol-Labor: alle 16 Zustände (Reihenfolge fr07, fr08, fr03b, fr04b; U = umgepolt)
labor <- list(
  "----" = c(-0.210, -0.168, -0.019, -0.112, -0.017),
  "U---" = c(0.183, 0.168, -0.399, 0.465, 0.372),
  "-U--" = c(-0.158, -0.530, 0.019, 0.213, 0.347),
  "UU--" = c(0.696, 0.530, 0.399, 0.526, 0.470),
  "--U-" = c(0.071, 0.421, 0.308, 0.112, -0.470),
  "U-U-" = c(-1.610, -0.421, -0.337, -0.465, -0.347),
  "-UU-" = c(-0.926, -0.213, -0.308, -0.213, -0.372),
  "UUU-" = c(-0.165, 0.213, 0.337, -0.526, 0.017),
  "---U" = c(-0.165, 0.213, 0.337, -0.526, 0.017),
  "U--U" = c(-0.926, -0.213, -0.308, -0.213, -0.372),
  "-U-U" = c(-1.610, -0.421, -0.337, -0.465, -0.347),
  "UU-U" = c(0.071, 0.421, 0.308, 0.112, -0.470),
  "--UU" = c(0.696, 0.530, 0.399, 0.526, 0.470),
  "U-UU" = c(-0.158, -0.530, 0.019, 0.213, 0.347),
  "-UUU" = c(0.183, 0.168, -0.399, 0.465, 0.372),
  "UUUU" = c(-0.210, -0.168, -0.019, -0.112, -0.017)
)
for (s in names(labor)) {
  flip <- strsplit(s, "")[[1]] == "U"
  vars <- ifelse(flip, paste0(it, "_um"), it)
  rr <- suppressWarnings(reliability(b, !!!syms(vars)))
  ok(paste("G3 Labor", s, "alpha"), round(rr$alpha, 3), labor[[s]][1])
  for (j in 1:4) ok(paste("G3 Labor", s, "Trennschärfe", it[j]),
                    round(rr$item_total$corrected_item_total_r[j], 3), labor[[s]][j + 1])
  ok(paste("G3 Labor", s, "N"), rr$n, 3517)
}
rr <- b %>% reliability(fr07, fr08, fr03b_um, fr04b_um)
ja("G3 umgepolt: Stufe Questionable", fi(rr$alpha) == "Questionable")
ok("G3 umgepolt: alpha ohne fr08", round(rr$item_total$alpha_if_deleted[2], 3), 0.682)
ok("G3 umgepolt: r fr03b_um-fr04b_um", round(rr$inter_item_cor[3, 4], 3), 0.515)
# Grundlage 3a: rev nimmt die Skala aus den Wertelabels, nicht aus den beobachteten Werten
rv <- roh %>% filter(as.numeric(mm02) %in% 2:5) %>% mutate(m = rec(mm02, rules = "rev"))
ja("G3 rev: beobachtet 2 bis 5 auf Skala 1 bis 7 wird 3 bis 6",
   identical(sort(unique(as.numeric(rv$m))), c(3, 4, 5, 6)))
w <- tryCatch(withCallingHandlers(roh %>% reliability(fr07, fr08, fr03b, fr04b),
              warning = function(w) stop(conditionMessage(w))), error = function(e) conditionMessage(e))
ja("G3 ohne Umpolen: Warnung zu negativem alpha", grepl("Cronbach's alpha is negative", w))

# =============================================================================================
abschnitt("Grundlage 4: Kombinationsindex (Inglehart, ingle aus va01 bis va04)")
# =============================================================================================
o <- capture.output(roh %>% frequency(ingle, weights = wghtpew))
ok("G4 Postmaterialisten", freq(o, "1")[3], 18.18)
ok("G4 Postmat. Mischtyp", freq(o, "2")[3], 31.30)
ok("G4 Mat. Mischtyp", freq(o, "3")[3], 35.68)
ok("G4 Materialisten", freq(o, "4")[3], 14.84)
ok("G4 nicht generierbar (gewichtet N)", freq(o, "-32")[1], 136)
# Regel prüfen: Typ hängt nur an Platz 1 und 2 (postmateriell: va02, va04)
ig <- roh %>% mutate(across(c(va01, va02, va03, va04, ingle), as.numeric)) %>%
  filter(!is.na(ingle), !is.na(va01), !is.na(va02), !is.na(va03), !is.na(va04))
erst <- ifelse(ig$va02 == 1 | ig$va04 == 1, "P", "M")
zweit <- ifelse(ig$va02 == 2 | ig$va04 == 2, "P", "M")
typ <- c(PP = 1, PM = 2, MP = 3, MM = 4)[paste0(erst, zweit)]
ja("G4 Regel trifft ingle bei allen vollständigen Rangfolgen", all(typ == ig$ingle))
ok("G4 Mittel der vier Ränge (immer)", mean(rowMeans(select(ig, va01, va02, va03, va04))), 2.5, 1e-9)
# Häufige Verwechslung 4b: Mittelwert der Typ-Codes (sinnlos, aber R rechnet ihn)
ok("G4 Mittelwert der ingle-Codes gewichtet", beschr(capture.output(roh %>% describe(ingle, weights = wghtpew)), "ingle")[["mean"]], 2.472)

# =============================================================================================
abschnitt("Aufgabe 1: Populismus-Index")
# =============================================================================================
out <- laufen("a1 (min_valid = 7)", plain(V$a1))
d <- beschr(out, "populismus")
ok("A1 a1a N mit min_valid = 7", d[["n"]], 3427)
ok("A1 Mean ungewichtet min 7", d[["mean"]], 2.604)
out <- laufen("a1 (min_valid = 5)", loesen(V$a1, list("7" = "5")))
d <- beschr(out, "populismus")
ok("A1 a1b N mit min_valid = 5", d[["n"]], 3595)
ok("A1 Mean ungewichtet min 5 (Sonderfall)", d[["mean"]], 2.602)
ok("A1 Zusätzliche Personen", 3595 - 3427, 168)
out <- laufen("a1 (min_valid = 6)", loesen(V$a1, list("7" = "6")))
ok("A1 N mit min_valid = 6", beschr(out, "populismus")[["n"]], 3563)
out <- laufen("a1 (min_valid = 1)", loesen(V$a1, list("7" = "1")))
ok("A1 N mit min_valid = 1", beschr(out, "populismus")[["n"]], 3626)
out <- laufen("a1 (min_valid = 8)", loesen(V$a1, list("7" = "8")))
ja("A1 min_valid = 8 warnt", any(grepl("greater than the number of items", attr(out, "warnungen"))))
out <- laufen("a1w", V$a1w)
d <- beschr(out, "populismus")
ok("A1 a1d Mean gewichtet", d[["mean"]], 2.646)
ok("A1 Median gewichtet", d[["median"]], 2.714)
ok("A1 SD gewichtet", d[["sd"]], 0.760)
ok("A1 N gewichtet (Summe der Gewichte)", d[["n"]], 3591)
x <- roh %>% mutate(p7 = row_means(pick(pa29, pa30, pa31, pa32, pa33, pa34, pa35), min_valid = 7))
o <- capture.output(x %>% describe(p7, weights = wghtpew))
ok("A1 Mean gewichtet min 7 (wird angenommen)", beschr(o, "p7")[["mean"]], 2.648)
ok("A1 N gewichtet min 7 (Sonderfall a1a)", beschr(o, "p7")[["n"]], 3416)
out <- laufen("frei_a1", V$frei_a1)
z <- finde(out, "^\\s*ALTE BUNDESLAENDER\\s+[0-9]")
ok("A1 frei West Mean", zahlen(z, "LAENDER")[2], 2.694)
ok("A1 frei West N", zahlen(z, "LAENDER")[1], 2983)
z <- finde(out, "^\\s*NEUE BUNDESLAENDER\\s+[0-9]")
ok("A1 frei Ost Mean", zahlen(z, "LAENDER")[2], 2.412)
ok("A1 frei Ost N", zahlen(z, "LAENDER")[1], 608)
z <- finde(out, "Equal variances not assumed")
ok("A1 frei t (ungleiche Varianzen)", zahlen(z, "assumed")[1], 8.264)
ok("A1 frei df", zahlen(z, "assumed")[2], 856.071)
ok("A1 frei Cohen d", zahlen(finde(out, "^\\s*populismus\\s+0"), "populismus")[1], 0.375)
ok("A1 frei Hedges g", zahlen(finde(out, "^\\s*populismus\\s+0"), "populismus")[2], 0.375)

# =============================================================================================
abschnitt("Aufgabe 2: Reliabilität der Populismus-Aussagen")
# =============================================================================================
out <- laufen("a2", V$a2)
l <- rel_lang(out)
ok("A2 a2a alpha", l$alpha, 0.833); ok("A2 alpha standardisiert", l$std, 0.830)
ok("A2 omega", l$omega, 0.841); ok("A2 N listwise", l$n, 3427)
tr <- c(pa29 = 0.348, pa30 = 0.588, pa31 = 0.648, pa32 = 0.682, pa33 = 0.639, pa34 = 0.545, pa35 = 0.619)
ad <- c(pa29 = 0.842, pa30 = 0.811, pa31 = 0.800, pa32 = 0.794, pa33 = 0.801, pa34 = 0.817, pa35 = 0.805)
od <- c(pa29 = 0.844, pa30 = 0.821, pa31 = 0.809, pa32 = 0.804, pa33 = 0.813, pa34 = 0.827, pa35 = 0.815)
for (i in names(tr)) {
  ok(paste("A2", i, "Trennschärfe"), l$items[[i]][3], tr[[i]])
  ok(paste("A2", i, "Alpha if Deleted"), l$items[[i]][4], ad[[i]])
  ok(paste("A2", i, "Omega if Deleted"), l$items[[i]][5], od[[i]])
}
ja("A2 a2c schwächste Trennschärfe pa29", names(which.min(tr)) == "pa29")
ja("A2 Stufe Good", fi(0.833) == "Good")
out <- laufen("a2ohne (wie dasteht)", plain(V$a2ohne))
k <- rel_kurz(out); ok("A2 Vorlage wie dasteht: alpha", k$alpha, 0.833)
out <- laufen("a2ohne (gelöst)", loesen(V$a2ohne, list("pa29, " = "")))
k <- rel_kurz(out)
ok("A2 a2d alpha ohne pa29", k$alpha, 0.842); ok("A2 ohne pa29: N", k$n, 3441)
ja("A2 ohne pa29: Stufe Good", k$stufe == "Good")
o <- capture.output(roh %>% frequency(pa29, weights = wghtpew))
ok("A2 pa29 Zustimmung gewichtet (Cum. % bei 2)", freq(o, "2")[4], 78.01)
kw <- rel_kurz(capture.output(roh %>% reliability(pa29, pa30, pa31, pa32, pa33, pa34, pa35, weights = wghtpew)))
ok("A2 alpha gewichtet (Hinweis)", kw$alpha, 0.829)
out <- laufen("frei_a2", V$frei_a2)
k <- rel_kurz(out); ok("A2 frei alpha pa31-pa33", k$alpha, 0.759); ok("A2 frei N", k$n, 3478)

# =============================================================================================
abschnitt("Aufgabe 3: Umpolen der Aussagen zum Islam")
# =============================================================================================
out <- laufen("a3", V$a3)
l <- rel_lang(out)
ok("A3 a3b alpha vorher", l$alpha, 0.177); ok("A3 std vorher", l$std, 0.207)
ok("A3 omega vorher", l$omega, 0.508); ok("A3 N", l$n, 3069)
tr0 <- c(mm01 = 0.289, mm02 = -0.373, mm03 = 0.442, mm04 = 0.474, mm05 = -0.411, mm06 = 0.428)
for (i in names(tr0)) ok(paste("A3 vorher", i, "Trennschärfe"), l$items[[i]][3], tr0[[i]])
ok("A3 vorher mm02 Alpha if Deleted", l$items$mm02[4], 0.456)
ok("A3 vorher mm05 Alpha if Deleted", l$items$mm05[4], 0.550)
ja("A3 Stufe vorher Poor", rel_kurz(capture.output(roh %>% reliability(mm01, mm02, mm03, mm04, mm05, mm06)))$stufe == "Poor")
out <- laufen("a3um (wie dasteht)", plain(V$a3um))
ok("A3 Vorlage wie dasteht: alpha unverändert", rel_lang(out)$alpha, 0.177)
out <- laufen("a3um (gelöst)", loesen(V$a3um, list("mm02" = "mm02_um", "mm05" = "mm05_um")))
l <- rel_lang(out)
ok("A3 a3c alpha nachher", l$alpha, 0.840); ok("A3 std nachher", l$std, 0.842)
ok("A3 omega nachher", l$omega, 0.843); ok("A3 N nachher", l$n, 3069)
tr1 <- c(mm01 = 0.709, mm02_um = 0.535, mm03 = 0.633, mm04 = 0.654, mm05_um = 0.539, mm06 = 0.654)
for (i in names(tr1)) ok(paste("A3 nachher", i, "Trennschärfe"), l$items[[i]][3], tr1[[i]])
out <- laufen("a3um (nur mm02 getauscht)", loesen(V$a3um, list("mm02" = "mm02_um", "mm05" = "mm05")))
ok("A3 Sonderfall nur mm02_um: alpha", rel_lang(out)$alpha, 0.540)
out <- laufen("a3um (nur mm05 getauscht)", loesen(V$a3um, list("mm02" = "mm02", "mm05" = "mm05_um")))
ok("A3 Sonderfall nur mm05_um: alpha", rel_lang(out)$alpha, 0.620)
out <- laufen("frei_a3", V$frei_a3)
d1 <- beschr(out, "vorbehalte"); d2 <- beschr(out, "vorbehalte_falsch")
ok("A3 frei vorbehalte Mean", d1[["mean"]], 4.012); ok("A3 frei vorbehalte SD", d1[["sd"]], 1.516)
ok("A3 frei vorbehalte_falsch Mean", d2[["mean"]], 3.862); ok("A3 frei vorbehalte_falsch SD", d2[["sd"]], 0.902)
ok("A3 frei N", d1[["n"]], 3344)
# Entscheidung 5: Alternative Batterie zu Ausländern, wie gefragt
k <- rel_kurz(capture.output(suppressWarnings(roh %>% reliability(mp02, mp04, mp05, mp06, mp07, mp10, mp12))))
ok("Entscheidung 5: alpha mp-Batterie vorher", k$alpha, 0.134)
for (v in c("mm02", "mm05")) {
  o <- capture.output(roh %>% frequency(!!sym(v), weights = wghtpew))
  cat("  ", v, "gewichtet Valid % 7:", freq(o, "7")[3], "\n")
}

# =============================================================================================
abschnitt("Aufgabe 4: Mittelwert- oder Kombinationsindex")
# =============================================================================================
out <- laufen("a4 (zustimmungen)", plain(V$a4))
ok("A4 0 Zustimmungen", freq(out, "0")[3], 41.61)
ok("A4 1 Zustimmung", freq(out, "1")[3], 26.19)
ok("A4 2 Zustimmungen", freq(out, "2")[3], 18.00)
ok("A4 a4a alle drei", freq(out, "3")[3], 14.20)
ok("A4 N gewichtet", zahlen(finde(out, "Total valid"))[1], 3471)
out <- laufen("a4 (kurz)", loesen(V$a4, list("zustimmungen" = "kurz")))
ok("A4 a4b kurz höchstens 2 (Cum. % bei 2)", freq(out, "2")[4], 21.71)
ok("A4 kurz genau 2 (Sonderfall)", freq(out, "2")[3], 7.61)
ok("A4 kurz genau 1", freq(out, "1")[3], 4.69)
ok("A4 Unterschied in Prozentpunkten", round(21.71 - 14.20, 2), 7.51)
x <- roh %>%
  mutate(
    z31 = rec(pa31, rules = "1:2=1 [stimmt zu]; 3:5=0 [stimmt nicht zu]; else=NA"),
    z32 = rec(pa32, rules = "1:2=1 [stimmt zu]; 3:5=0 [stimmt nicht zu]; else=NA"),
    z33 = rec(pa33, rules = "1:2=1 [stimmt zu]; 3:5=0 [stimmt nicht zu]; else=NA"),
    zustimmungen = row_sums(pick(z31, z32, z33), min_valid = 3),
    kurz = row_means(pick(pa31, pa32, pa33), min_valid = 3)
  )
o <- capture.output(x %>% frequency(zustimmungen))
ok("A4 ungewichtet alle drei (Sonderfall)", freq(o, "3")[3], 15.44)
o <- capture.output(x %>% frequency(kurz))
ok("A4 ungewichtet kurz höchstens 2 (Sonderfall)", freq(o, "2")[4], 23.35)
# Kurz = 2 mit nur zwei Zustimmungen (Ausgleich): gewichtet aus der Kreuztabelle
ct <- capture.output(x %>% crosstab(kurz, zustimmungen, weights = wghtpew))
z <- finde(ct, "^\\|\\s+2\\s+\\|")
ok("A4 kurz = 2: davon zwei Zustimmungen (gewichtet N)", zahlen(z)[4], 174)
ok("A4 kurz = 2: davon drei Zustimmungen (gewichtet N)", zahlen(z)[5], 90)
# a4c: Woraus besteht der Unterschied 21,71 - 14,20? (Hilfsrechnung, gewichtet, Anteil an allen mit drei Antworten)
y <- roh %>%
  mutate(across(c(pa31, pa32, pa33), as.numeric)) %>%
  filter(!is.na(pa31), !is.na(pa32), !is.na(pa33)) %>%
  mutate(kurz = (pa31 + pa32 + pa33) / 3, n12 = (pa31 <= 2) + (pa32 <= 2) + (pa33 <= 2),
         hoechste = pmax(pa31, pa32, pa33), w = as.numeric(wghtpew))
anteil <- function(b) round(sum(y$w[b]) / sum(y$w) * 100, 2)
ok("A4 im Schnitt (Hilfsrechnung, wie a4b)", anteil(y$kurz <= 2), 21.71)
ok("A4 Unterschied: im Schnitt, aber nicht alle drei", anteil(y$kurz <= 2 & y$n12 < 3), 7.51)
ok("A4 davon dritte Antwort teils/teils (3)", round(anteil(y$kurz <= 2 & y$n12 < 3 & y$hoechste == 3), 1), 7.3)
ok("A4 davon dritte Antwort Ablehnung (4: 1, 1, 4)", round(anteil(y$kurz <= 2 & y$n12 < 3 & y$hoechste == 4), 1), 0.2)
ja("A4 teils/teils-Fälle haben mindestens eine volle Zustimmung (1)",
   all(with(filter(y, kurz <= 2, n12 < 3, hoechste == 3), pmin(pa31, pa32, pa33) == 1)))
out <- laufen("frei_a4", V$frei_a4)
z <- finde(out, "^\\|\\s+3\\s+\\|")
i <- which(grepl("^\\|\\s+3\\s+\\|", out))
zp <- out[i + 1]
ok("A4 frei West alle drei col %", zahlen(zp)[1], 12.9)
ok("A4 frei Ost alle drei col %", zahlen(zp)[2], 20.7)

# =============================================================================================
abschnitt("Fehlermeldungen dieser Sitzung (Wortlaut für die Fehlerhilfe)")
# =============================================================================================
fehler <- function(name, ausdruck, muster) {
  m <- tryCatch({ force(ausdruck); "kein Fehler" }, error = function(e) conditionMessage(e))
  if (!grepl(muster, m, fixed = TRUE)) stop(name, ": unerwartete Meldung: ", m)
  cat(sprintf("  ok  Fehler %-34s enthält: %s\n", name, muster))
}
fehler("umgepolte Variable fehlt", capture.output(roh %>% reliability(mm01, mm02_um)), "doesn't exist")
fehler("row_means ohne pick", roh %>% mutate(p = row_means(pa29, pa30, min_valid = 2)),
       "must be a data frame or tibble")
fehler("rev ohne Anführungszeichen", roh %>% mutate(x = rec(mm02, rules = rev)),
       "must be a single character string")
fehler("rules vertippt", roh %>% mutate(x = rec(mm02, rules = "reverse")), "Invalid rule")
fehler("nur ein Item", capture.output(roh %>% reliability(pa29)), "requires at least 2 items")
fehler("Variable vertippt", capture.output(roh %>% reliability(pa29, pa3)), "doesn't exist")
fehler("weight statt weights", capture.output(roh %>% describe(pa29, weight = wghtpew)), "Did you mean")
fehler("min_valid = 0", roh %>% mutate(p = row_means(pick(pa29, pa30), min_valid = 0)),
       "must be a positive whole number")
fehler("pick ohne mutate", capture.output(roh %>% row_means(pick(pa29, pa30))), "data-masking verbs")

# =============================================================================================
abschnitt("Vorlagen stehen wörtlich im Plan")
# =============================================================================================
plan <- file.path(dirname(normalizePath(sub("^--file=", "", grep("^--file=", commandArgs(FALSE), value = TRUE)[1]))),
                  "sitzung08.md")
if (file.exists(plan)) {
  md <- paste(readLines(plan, encoding = "UTF-8"), collapse = "\n")
  for (n in names(V)) {
    if (!grepl(V[[n]], md, fixed = TRUE) && !grepl(sub("\n$", "", V[[n]]), md, fixed = TRUE)) {
      stop("Vorlage nicht wörtlich im Plan: ", n)
    }
    cat(sprintf("  ok  Vorlage %-14s steht im Plan\n", n))
  }
} else {
  stop("sitzung08.md nicht gefunden neben dem Skript")
}

cat("\nAlle Zahlen und Vorlagen von Sitzung 8 geprüft.\n")
