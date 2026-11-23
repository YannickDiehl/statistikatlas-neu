# Sitzung 9 „Lineare Regression“: alle Zahlen des Kapitels und jede Codevorlage einmal ausgeführt.
# Daten: ALLBUS 2023, ZA8831 v1.3.0, gewichtet mit wghtpew (wie ab Sitzung 6), nur Aggregate.
# Beispiele mit Einzelpersonen (8, 9 und 10 Punkte) sind konstruiert und werden hier nachgerechnet.
# Pakete: tidyverse, mariposa 0.7.4.
# Aufruf:  Rscript sitzung09-zahlen.R
#   oder:  ALLBUS_SAV=/pfad/ZA8831_v1-3-0.sav Rscript sitzung09-zahlen.R
# Bricht mit Fehler ab, sobald eine Zahl nicht zum Plan (sitzung09.md) passt.
# Vorlagen stehen hier wörtlich wie im Plan; ⟦…⟧ markiert anzupassende Stellen.
# Jede Vorlage läuft in einer frischen Umgebung, in der nur `allbus` (frisch eingelesen) existiert,
# so wie in der Code-Werkstatt; einmal so, wie sie dasteht, und einmal gelöst.

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
.za <- read_spss(pfad)
stopifnot(nrow(.za) == 5246)

# Ordner dieses Skripts (für den Abgleich mit sitzung09.md)
.args <- commandArgs(trailingOnly = FALSE)
.datei <- sub("^--file=", "", .args[grepl("^--file=", .args)])
.ordner <- if (length(.datei)) dirname(normalizePath(.datei)) else getwd()

# ---------------------------------------------------------------------------------------------
# Hilfsfunktionen
# ---------------------------------------------------------------------------------------------
ok <- function(name, ist, soll, tol = 0) {
  if (length(ist) != 1 || is.na(ist) || abs(ist - soll) > tol + 1e-9) {
    stop(sprintf("%s: ist %s, soll %s", name, paste(ist, collapse = "/"), soll))
  }
  cat(sprintf("  ok  %-70s %s\n", name, format(soll, big.mark = ".", decimal.mark = ",")))
}
abschnitt <- function(t) cat("\n==== ", t, " ====\n", sep = "")

# Prüft, ob eine Zeile der Ausgabe alle Stücke in dieser Reihenfolge enthält (Leerraum dazwischen egal)
zeile <- function(text, ...) {
  # Tabellenstriche von frequency() und crosstab() zählen als Leerraum
  text <- gsub("|", " ", text, fixed = TRUE)
  teile <- c(...)
  muster <- paste(vapply(teile, function(s) gsub("([][{}()+*^$|\\\\?.])", "\\\\\\1", s), ""),
                  collapse = "\\s+")
  if (!any(grepl(muster, text, perl = TRUE))) {
    stop("In der Ausgabe nicht gefunden: ", paste(teile, collapse = " | "))
  }
  cat(sprintf("  ok  Zeile: %s\n", paste(teile, collapse = "  ")))
}

# Vorlagen: Text wie im Plan; ⟦…⟧ entfernt (Platzhalter bleiben) oder ersetzt
vorlagen <- list()
plain <- function(code) gsub("⟦|⟧", "", code)
loesen <- function(code, ersatz) {
  for (alt in names(ersatz)) code <- sub(paste0("⟦", alt, "⟧"), ersatz[[alt]], code, fixed = TRUE)
  stopifnot(!grepl("⟦", code))
  code
}
# Führt Code in einer frischen Umgebung aus, in der nur `allbus` existiert (wie die Werkstatt)
laufen <- function(name, code) {
  cat("\n---- Vorlage:", name, "----\n")
  umgebung <- new.env(parent = globalenv())
  assign("allbus", .za, envir = umgebung)
  out <- capture.output({
    for (a in parse(text = code)) {
      wert <- withVisible(eval(a, envir = umgebung))
      if (wert$visible) print(wert$value)
    }
  })
  cat(out, sep = "\n")
  invisible(out)
}
vorlage <- function(name, code) {
  vorlagen[[name]] <<- code
  code
}
meldung <- function(code) {
  umgebung <- new.env(parent = globalenv())
  assign("allbus", .za, envir = umgebung)
  tryCatch({
    for (a in parse(text = code)) eval(a, envir = umgebung)
    "KEIN FEHLER"
  }, error = function(e) conditionMessage(e))
}
meldet <- function(text, stueck) {
  if (!grepl(stueck, text, fixed = TRUE)) stop("Fehlermeldung enthält nicht: ", stueck, "\n", text)
  cat(sprintf("  ok  Meldung enthält: %s\n", stueck))
}

# Gewichtete Kennzahlen direkt gerechnet (zur Gegenprobe der gedruckten Werte)
w_sd_mariposa <- function(x, w) sqrt(sum(w * (x - weighted.mean(x, w))^2) / (sum(w) - 1))

# =============================================================================================
abschnitt("Vorweg: R lesen")
# =============================================================================================
start <- vorlage("start", '# Pakete laden und Daten einlesen
library(tidyverse)
library(mariposa)

allbus <- read_spss("ZA8831_v1-3-0.sav")')
# Startblock: nur die read_spss-Zeile mit dem echten Pfad prüfen
stopifnot(nrow(read_spss(pfad)) == 5246)

r_kurz <- vorlage("r_kurz", '# Lineare Regression: Lebenszufriedenheit aus der wirtschaftlichen Lage vorhersagen
# (ep03 umpolen wie in Sitzung 5: hohe Zahl = gute Lage)
allbus %>%
  mutate(
    lage = rec(ep03, rules = "rev")
  ) %>%
  linear_regression(ls01 ~ lage, weights = wghtpew)')
txt <- laufen("r_kurz", r_kurz)
zeile(txt, "Linear Regression: ls01 ~ lage [Weighted]")
zeile(txt, "R2 = 0.203, adj.R2 = 0.203, F(1, 5131) = 1304.29, p < 0.001 ***, N = 5133")

r_summary <- vorlage("r_summary", '# Dieselbe Regression ausführlich: mit summary() wie in Sitzung 7
allbus %>%
  mutate(
    lage = rec(ep03, rules = "rev")
  ) %>%
  linear_regression(ls01 ~ lage, weights = wghtpew) %>%
  summary()')
txt <- laufen("r_summary", r_summary)
zeile(txt, "- Method: ENTER (all predictors)")
zeile(txt, "- N: 5133")
zeile(txt, "- Weights: wghtpew")
zeile(txt, "Use to_label() first to enter it as dummy-coded categories.")
zeile(txt, "Note: labelled predictor lage entered with its numeric codes, as SPSS REGRESSION does.")
zeile(txt, "ls01", "7.398", "1.926", "5133")
zeile(txt, "lage", "3.568", "0.808", "5133")
zeile(txt, "R", "0.450")
zeile(txt, "R Square", "0.203")
zeile(txt, "Adjusted R Square", "0.203")
zeile(txt, "Std. Error of the Estimate", "1.720")
zeile(txt, "Regression", "3858.902", "1", "3858.902", "1304.291", "<.001", "***")
zeile(txt, "Residual", "15182.029", "5131", "2.959")
zeile(txt, "Total", "19040.931", "5132")
zeile(txt, "(Intercept)", "3.570", "0.109", "32.839", "<.001", "3.357", "3.783", "***")
zeile(txt, "lage", "1.073", "0.030", "0.450", "36.115", "<.001", "1.015", "1.131", "***")
zeile(txt, "lage", "1.000", "1.000")

# Grundlage-Modell zum Weiterrechnen
ga <- .za %>% mutate(lage = rec(ep03, rules = "rev"))
gm <- ga %>% linear_regression(ls01 ~ lage, weights = wghtpew)
a_g <- unname(coef(gm)[1]); b_g <- unname(coef(gm)[2])
ok("Grundlage: Konstante (gerundet 3,570)", round(a_g, 3), 3.570)
ok("Grundlage: Steigung (gerundet 1,073)", round(b_g, 3), 1.073)
ok("Grundlage: r mal r = 0,450 x 0,450 = 0,2025 (etwa R² = 0,203)", 0.450^2, 0.2025)
txt <- capture.output(print(ga %>% pearson_cor(ls01, lage, weights = wghtpew)))
zeile(txt, "r = 0.450, p < 0.001 ***, N = 5133")
ok("Grundlage: Beta = r (ungerundet gleich)", round(gm$coef_table$Beta[2] - gm$model_summary$R, 10), 0)

# =============================================================================================
abschnitt("Grundlage 1: die Gerade (lage -> ls01)")
# =============================================================================================
# Vorhersagen je Stufe mit den gedruckten Koeffizienten 3.570 und 1.073
vor <- 3.570 + 1.073 * 1:5
ok("Vorhersage lage = 1 (sehr schlecht)", round(vor[1], 3), 4.643)
ok("Vorhersage lage = 2 (schlecht)", round(vor[2], 3), 5.716)
ok("Vorhersage lage = 3 (teils/teils)", round(vor[3], 3), 6.789)
ok("Vorhersage lage = 4 (gut)", round(vor[4], 3), 7.862)
ok("Vorhersage lage = 5 (sehr gut)", round(vor[5], 3), 8.935)
ok("Anstieg von Stufe 1 bis 5 (4 x 1,073)", round(vor[5] - vor[1], 2), 4.29)
ok("Vorhersage lage = 0 (gibt es nicht) = Konstante", 3.570 + 1.073 * 0, 3.570)

# Gewichtete Mittelwerte und SD der Lebenszufriedenheit je Stufe (Punkte im Bild, Textfassung)
txt <- capture.output(print(ga %>% drop_na(ls01, lage) %>% group_by(lage) %>%
  describe(ls01, weights = wghtpew, show = c("mean", "sd"))))
zeile(txt, "Group: lage = SEHR SCHLECHT")
zeile(txt, "ls01", "4.377", "2.715", "77")
zeile(txt, "ls01", "5.641", "2.228", "435")
zeile(txt, "ls01", "6.809", "1.816", "1491")
zeile(txt, "ls01", "7.905", "1.584", "2751")
zeile(txt, "ls01", "8.680", "1.269", "378")
# ungewichtete Fallzahlen je Stufe (nur zur Information im Plan)
nz <- ga %>% filter(!is.na(ls01), !is.na(lage)) %>% count(lage) %>% pull(n)
ok("ungewichtet n lage 1", nz[1], 75); ok("ungewichtet n lage 2", nz[2], 451)
ok("ungewichtet n lage 3", nz[3], 1533); ok("ungewichtet n lage 4", nz[4], 2706)
ok("ungewichtet n lage 5", nz[5], 368)

# Blasen im Bild: gewichtete Zellenzahlen aus crosstab(ls01, lage) (Aggregat, so gedruckt)
txt <- capture.output(print(ga %>% crosstab(ls01, lage, weights = wghtpew)))
txt <- gsub("|", " ", txt, fixed = TRUE)
zeile(txt, "GANZ UNZUFRIEDEN", "9", "6", "5", "8", "0", "28")
zeile(txt, "..", "2", "14", "5", "7", "1", "29")
zeile(txt, "..", "8", "22", "21", "24", "2", "77")
zeile(txt, "..", "11", "39", "49", "16", "1", "116")
zeile(txt, "..", "11", "36", "78", "48", "1", "174")
zeile(txt, "..", "11", "88", "187", "95", "2", "383")
zeile(txt, "..", "6", "59", "183", "140", "3", "391")
zeile(txt, "..", "10", "73", "372", "518", "26", "999")
zeile(txt, "..", "4", "70", "382", "908", "117", "1481")
zeile(txt, "..", "1", "14", "135", "620", "119", "889")
zeile(txt, "GANZ ZUFRIEDEN", "4", "15", "74", "367", "105", "565")
zeile(txt, "Total", "77", "436", "1491", "2751", "377", "5132")

# Mittelwerte minus Gerade (Grundlage 4: Linearität im echten Beispiel), exakte Koeffizienten
mw <- ga %>% filter(!is.na(ls01), !is.na(lage)) %>% group_by(lage = as.numeric(lage)) %>%
  summarise(m = weighted.mean(as.numeric(ls01), wghtpew), .groups = "drop") %>% pull(m)
abw <- round(mw - (a_g + b_g * 1:5), 3)
ok("Mittel minus Gerade, Stufe 1", abw[1], -0.266)
ok("Mittel minus Gerade, Stufe 2", abw[2], -0.074)
ok("Mittel minus Gerade, Stufe 3", abw[3], 0.020)
ok("Mittel minus Gerade, Stufe 4", abw[4], 0.043)
ok("Mittel minus Gerade, Stufe 5", abw[5], -0.255)
ok("Stufe 5 auf zwei Stellen", round(mw[5] - (a_g + b_g * 5), 2), -0.26)
ok("Stufe 1 auf zwei Stellen", round(mw[1] - (a_g + b_g * 1), 2), -0.27)

# =============================================================================================
abschnitt("Konstruiertes Beispiel: acht Befragte (Grundlagen 1 bis 3)")
# =============================================================================================
acht <- tibble(x = c(1, 2, 2, 3, 3, 4, 4, 5), y = c(4, 6, 7, 6, 8, 8, 9, 8))
ok("Schwerpunkt x", mean(acht$x), 3)
ok("Schwerpunkt y", mean(acht$y), 7)
f8 <- lm(y ~ x, acht)
ok("acht: Konstante", unname(coef(f8)[1]), 4)
ok("acht: Steigung", unname(coef(f8)[2]), 1)
ok("acht: Fehlerquadrate der besten Geraden", sum(resid(f8)^2), 6)
ok("acht: Fehlerquadrate der Mittelwert-Geraden (7)", sum((acht$y - 7)^2), 18)
ok("acht: R² = 1 - 6/18", round(summary(f8)$r.squared, 3), 0.667)
ok("acht: Residuum Person (3 | 8)", 8 - (4 + 1 * 3), 1)
ok("acht: Residuum Person (1 | 4)", 4 - (4 + 1 * 1), -1)
ok("acht: Residuum Person (2 | 6)", 6 - (4 + 1 * 2), 0)
# Regler: Gerade durch den Schwerpunkt (3 | 7), Steigung b, Konstante 7 - 3b
sse <- function(b) sum((acht$y - (7 - 3 * b) - b * acht$x)^2)
regler <- seq(-1, 3, by = 0.25)
soll_sse <- c(54, 42.75, 33, 24.75, 18, 12.75, 9, 6.75, 6, 6.75, 9, 12.75, 18, 24.75, 33, 42.75, 54)
for (i in seq_along(regler)) ok(sprintf("Regler b = %5.2f: Fehlerquadrate", regler[i]), sse(regler[i]), soll_sse[i])
ok("Regler: Formel 18 - 24b + 12b² bei b = 0,5", 18 - 24 * 0.5 + 12 * 0.25, 9)

# Ausreißer: neunte Person (5 | 2)
neun <- bind_rows(acht, tibble(x = 5, y = 2))
f9 <- lm(y ~ x, neun)
ok("neun: Konstante", round(unname(coef(f9)[1]), 3), 5.8)
ok("neun: Steigung", round(unname(coef(f9)[2]), 3), 0.2)
ok("neun: R²", round(summary(f9)$r.squared, 3), 0.015)
ok("neun: Residuum der neunten Person zur alten Geraden", 2 - (4 + 5), -7)
ok("neun: Quadrat dieses Residuums", (2 - 9)^2, 49)

# Linearität: zehn Räume (Temperatur, Wohlbefinden), konstruiert
zehn <- tibble(t = seq(14, 32, by = 2), w = c(2, 4, 6, 8, 9, 9, 8, 6, 4, 2))
f10 <- lm(w ~ t, zehn)
ok("zehn: Steigung", round(unname(coef(f10)[2]), 10), 0)
ok("zehn: Konstante = Mittelwert", round(unname(coef(f10)[1]), 10), 5.8)
ok("zehn: R²", round(summary(f10)$r.squared, 10), 0)

# =============================================================================================
abschnitt("Grundlage 2 und 3: R², typischer Fehler, Streuung je Stufe, Levene (lage)")
# =============================================================================================
ok("R² aus Quadratsummen 1 - 15182.029 / 19040.931", round(1 - 15182.029 / 19040.931, 3), 0.203)
ok("R² über typische Fehler 1 - (1.720/1.926)²", round(1 - (1.720 / 1.926)^2, 3), 0.202)
ok("R² in Prozent", round(100 * 3858.902 / 19040.931, 1), 20.3)
gr <- ga %>% mutate(rest = ls01 - (3.570 + 1.073 * lage))
txt <- capture.output(print(gr %>% levene_test(rest, group = lage, weights = wghtpew)))
zeile(txt, "F(4, 5128.5) = 67.176, p < 0.001 ***, variances unequal")
ok("Verhältnis größte/kleinste SD je Stufe 2.715/1.269", round(2.715 / 1.269, 1), 2.1)
stopifnot(2.715 / 1.269 > 2)
cat("  ok  Faustregel aus Sitzung 7 (mehr als doppelt): bei lage erfüllt\n")

# =============================================================================================
abschnitt("Aufgabe 1: demo ~ pt03")
# =============================================================================================
a1 <- vorlage("a1", '# Zufriedenheit mit der Demokratie umpolen (hohe Zahl = zufrieden),
# dann aus dem Vertrauen in den Bundestag vorhersagen
allbus %>%
  mutate(
    demo = rec(ps03, rules = "rev")
  ) %>%
  linear_regression(demo ~ pt03, weights = wghtpew) %>%
  summary()')
txt <- laufen("a1", a1)
zeile(txt, "- Formula: demo ~ pt03")
zeile(txt, "- N: 3575")
zeile(txt, "demo", "4.157", "1.274", "3575")
zeile(txt, "pt03", "4.017", "1.610", "3575")
zeile(txt, "R", "0.588")
zeile(txt, "R Square", "0.346")
zeile(txt, "Adjusted R Square", "0.346")
zeile(txt, "Std. Error of the Estimate", "1.031")
zeile(txt, "Regression", "2006.432", "1", "2006.432", "1887.772", "<.001", "***")
zeile(txt, "Residual", "3797.475", "3573", "1.063")
zeile(txt, "Total", "5803.907", "3574")
zeile(txt, "(Intercept)", "2.288", "0.046", "49.345", "<.001", "2.197", "2.378", "***")
zeile(txt, "pt03", "0.465", "0.011", "0.588", "43.448", "<.001", "0.444", "0.486", "***")
d1 <- .za %>% mutate(demo = rec(ps03, rules = "rev"))
m1 <- d1 %>% linear_regression(demo ~ pt03, weights = wghtpew)
a_1 <- unname(coef(m1)[1]); b_1 <- unname(coef(m1)[2])
# Split: ps03 und pt03 je 3.592/3.621 gültig, gemeinsam 3.575 (ungewichtet)
ok("ps03 gültig", sum(!is.na(.za$ps03)), 3621)
ok("pt03 gültig", sum(!is.na(.za$pt03)), 3592)
txt <- capture.output(print(.za %>% frequency(ps03)))
zeile(txt, "-11", "TNZ: SPLIT", "1596")
txt <- capture.output(print(.za %>% frequency(pt03)))
zeile(txt, "-11", "TNZ: SPLIT", "1596")

a1r <- vorlage("a1r", '# Vorhersage von Hand: Konstante + Steigung * Wert
# (hier noch das Beispiel aus Grundlage 1: lage = 4)
⟦3.570⟧ + ⟦1.073⟧ * ⟦4⟧')
txt <- laufen("a1r wie sie dasteht", plain(a1r))
zeile(txt, "[1] 7.862")
txt <- laufen("a1r gelöst", loesen(a1r, list("3.570" = "2.288", "1.073" = "0.465", "4" = "7")))
zeile(txt, "[1] 5.543")
ok("a1: Vorhersage pt03 = 7 mit exakten Koeffizienten", round(a_1 + 7 * b_1, 3), 5.545)
ok("a1: Vorhersage pt03 = 1", 2.288 + 0.465 * 1, 2.753)
ok("a1: Unterschied 1 bis 7 = 6 x 0,465", 6 * 0.465, 2.79)
# Diagnose-Varianten für die Rückmeldungen
txt <- capture.output(print(d1 %>% linear_regression(demo ~ pt03) %>% summary()))
zeile(txt, "(Intercept)", "2.168"); zeile(txt, "pt03", "0.479"); zeile(txt, "R Square", "0.354")
txt <- capture.output(print(.za %>% linear_regression(ps03 ~ pt03, weights = wghtpew) %>% summary()))
zeile(txt, "(Intercept)", "4.712"); zeile(txt, "pt03", "-0.465")

frei_a1 <- vorlage("frei_a1", '# Eine Idee: die Seiten tauschen und das Vertrauen aus der Zufriedenheit vorhersagen
allbus %>%
  mutate(
    demo = rec(ps03, rules = "rev")
  ) %>%
  linear_regression(pt03 ~ demo, weights = wghtpew) %>%
  summary()')
txt <- laufen("frei_a1", frei_a1)
zeile(txt, "(Intercept)", "0.929")
zeile(txt, "demo", "0.743", "0.017", "0.588")
zeile(txt, "R Square", "0.346")
ok("Produkt der beiden Steigungen = R² (0,465 x 0,743)", round(0.465 * 0.743, 3), 0.345)

# =============================================================================================
abschnitt("Aufgabe 2: R², typischer Fehler, Vergleich mit id02")
# =============================================================================================
a2 <- vorlage("a2", '# Wie gut sagt eine Frage die Zufriedenheit mit der Demokratie vorher?
# (umpolen wie in Aufgabe 1)
allbus %>%
  mutate(
    demo = rec(ps03, rules = "rev")
  ) %>%
  linear_regression(demo ~ ⟦pt03⟧, weights = wghtpew) %>%
  summary()')
txt <- laufen("a2 wie sie dasteht", plain(a2))
zeile(txt, "R Square", "0.346")
zeile(txt, "Std. Error of the Estimate", "1.031")
zeile(txt, "demo", "4.157", "1.274", "3575")
txt <- laufen("a2 gelöst", loesen(a2, list(pt03 = "id02")))
zeile(txt, "- Formula: demo ~ id02")
zeile(txt, "- N: 3575")
zeile(txt, "R Square", "0.060")
zeile(txt, "Std. Error of the Estimate", "1.233")
zeile(txt, "(Intercept)", "2.966")
zeile(txt, "id02", "0.412", "0.027", "0.246")
zeile(txt, "demo", "4.159", "1.272", "3575")
zeile(txt, "id02", "2.895", "0.759", "3575")
# Schicht: gut drei Viertel in Arbeiter- oder Mittelschicht (gewichtet, dieselben 3.575)
txt2 <- capture.output(print(.za %>% mutate(demo = rec(ps03, rules = "rev")) %>% drop_na(demo, id02) %>%
  frequency(id02, weights = wghtpew)))
zeile(txt2, "2", "ARBEITERSCHICHT", "793", "22.17")
zeile(txt2, "3", "MITTELSCHICHT", "2001", "55.98")
ok("Arbeiter- plus Mittelschicht in Prozent (78 %)", round(22.17 + 55.98), 78)
zeile(txt, "Residual", "5435.878", "3573")
ok("typischer Fehler: 1 - (1.031/1.274)²", round(1 - (1.031 / 1.274)^2, 3), 0.345)
ok("R² pt03 durch R² id02 (etwa sechsmal)", round(0.346 / 0.060, 1), 5.8)

frei_a2 <- vorlage("frei_a2", '# Eine Idee: die Wirtschaftslage in Deutschland (ep01, 1 = sehr gut) als Vorhersage
allbus %>%
  mutate(
    demo = rec(ps03, rules = "rev")
  ) %>%
  linear_regression(demo ~ ep01, weights = wghtpew) %>%
  summary()')
txt <- laufen("frei_a2", frei_a2)
zeile(txt, "- N: 3593")
zeile(txt, "R Square", "0.215")
zeile(txt, "ep01", "-0.746")

# =============================================================================================
abschnitt("Aufgabe 3: Residuen je Stufe von pt03, Levene")
# =============================================================================================
a3 <- vorlage("a3", '# Vorhersage und Residuum für jede Person (umpolen wie in Aufgabe 1)
allbus <- allbus %>%
  mutate(
    demo       = rec(ps03, rules = "rev"),
    vorhersage = ⟦3.570⟧ + ⟦1.073⟧ * pt03,
    residuum   = demo - vorhersage
  )

# Mittelwert und Streuung des Residuums, getrennt für jede Stufe des Vertrauens
allbus %>%
  drop_na(residuum) %>%
  group_by(pt03) %>%
  describe(residuum, weights = wghtpew, show = c("mean", "sd"))

# Test: Streut das Residuum in allen Stufen gleich stark?
allbus %>%
  levene_test(residuum, group = pt03, weights = wghtpew)')
txt <- laufen("a3 wie sie dasteht", plain(a3))
zeile(txt, "Group: pt03 = GAR KEIN VERTRAUEN")
zeile(txt, "residuum", "-2.179", "1.325", "329")
zeile(txt, "residuum", "-5.042", "0.713", "493")
zeile(txt, "residuum", "-5.943", "0.952", "166")
zeile(txt, "Levene's Test: residuum by pt03 [Weighted]")
zeile(txt, "F(6, 3567.9) = 74.860, p < 0.001 ***, variances unequal")
txt <- laufen("a3 gelöst", loesen(a3, list("3.570" = "2.288", "1.073" = "0.465")))
zeile(txt, "Group: pt03 = GAR KEIN VERTRAUEN")
zeile(txt, "residuum", "-0.289", "1.325", "329")
zeile(txt, "residuum", "-0.029", "1.250", "367")
zeile(txt, "residuum", "0.084", "1.165", "538")
zeile(txt, "residuum", "0.157", "0.988", "847")
zeile(txt, "residuum", "0.065", "0.853", "835")
zeile(txt, "residuum", "-0.112", "0.713", "493")
zeile(txt, "Group: pt03 = GROSSES VERTRAUEN")
zeile(txt, "residuum", "-0.405", "0.952", "166")
zeile(txt, "F(6, 3567.9) = 74.860, p < 0.001 ***, variances unequal")
ok("Verhältnis SD Stufe 1 / Stufe 6", round(1.325 / 0.713, 2), 1.86)
stopifnot(1.325 / 0.713 < 2)
cat("  ok  Faustregel aus Sitzung 7 (mehr als doppelt): bei pt03 knapp nicht erfüllt (1,86)\n")
# Gegenprobe: SD des Residuums je Stufe = SD der Zufriedenheit je Stufe
d3 <- d1 %>% filter(!is.na(demo), !is.na(pt03))
sd1 <- with(d3[as.numeric(d3$pt03) == 1, ], w_sd_mariposa(as.numeric(demo), wghtpew))
ok("SD demo in Stufe 1 = SD Residuum", round(sd1, 3), 1.325)
mw7 <- with(d3[as.numeric(d3$pt03) == 7, ], weighted.mean(as.numeric(demo), wghtpew))
ok("Mittelwert demo in Stufe 7", round(mw7, 3), 5.138)
ok("Stufe 7: Vorhersage 2,288 + 7 x 0,465", 2.288 + 7 * 0.465, 5.543)
# ungewichtete n je Stufe (Information)
ok("ungewichtet n Stufe 1", sum(as.numeric(d3$pt03) == 1), 362)
ok("ungewichtet n Stufe 7", sum(as.numeric(d3$pt03) == 7), 155)
# ausführliche Levene-Ausgabe (für die Erklärung)
txt <- capture.output(print(d1 %>% mutate(residuum = demo - (2.288 + 0.465 * pt03)) %>%
  levene_test(residuum, group = pt03, weights = wghtpew) %>% summary()))
zeile(txt, "residuum", "74.860", "6", "3567.893", "<.001", "***", "Variances unequal")

frei_a3 <- vorlage("frei_a3", '# Eine Idee: das Residuum je Stufe als Boxplots (wie in Sitzung 4)
allbus %>%
  mutate(
    demo       = rec(ps03, rules = "rev"),
    vorhersage = 2.288 + 0.465 * pt03,
    residuum   = demo - vorhersage
  ) %>%
  drop_na(residuum) %>%
  to_label(pt03) %>%
  ggplot(aes(x = pt03, y = residuum)) +
  geom_boxplot()')
txt <- laufen("frei_a3", frei_a3)
stopifnot(identical(levels(to_label(.za$pt03))[2], ".. (2)"))
cat("  ok  to_label(pt03) zeigt die Stufen 2 bis 6 als „.. (2)“ … „.. (6)“\n")

# =============================================================================================
abschnitt("Aufgabe 4 (Zusatz): demo ~ pa01, Linearität")
# =============================================================================================
a4 <- vorlage("a4", '# Links-rechts und Zufriedenheit mit der Demokratie (umpolen wie in Aufgabe 1)
allbus <- allbus %>%
  mutate(
    demo = rec(ps03, rules = "rev")
  )

# Die Gerade
allbus %>%
  linear_regression(demo ~ pa01, weights = wghtpew) %>%
  summary()

# Mittelwerte je Stufe der Links-rechts-Einstufung
allbus %>%
  drop_na(demo, pa01) %>%
  group_by(pa01) %>%
  describe(demo, weights = wghtpew, show = c("mean", "sd"))')
txt <- laufen("a4", a4)
zeile(txt, "- N: 3444")
zeile(txt, "R Square", "0.037")
zeile(txt, "(Intercept)", "4.857", "0.063")
zeile(txt, "pa01", "-0.140", "0.012", "-0.193")
zeile(txt, "Group: pa01 = LINKS")
zeile(txt, "demo", "3.864", "1.339", "106")
zeile(txt, "demo", "4.369", "1.141", "163")
zeile(txt, "demo", "4.549", "1.029", "508")
zeile(txt, "demo", "4.488", "1.051", "481")
zeile(txt, "demo", "4.175", "1.221", "945")
zeile(txt, "demo", "4.057", "1.317", "719")
zeile(txt, "demo", "3.811", "1.312", "286")
zeile(txt, "demo", "3.845", "1.470", "160")
zeile(txt, "demo", "2.776", "1.520", "37")
zeile(txt, "Group: pa01 = RECHTS")
zeile(txt, "demo", "2.536", "1.508", "38")

a4r <- vorlage("a4r", '# Vorhersage von Hand für „ganz links“ (pa01 = 1)
# (hier noch das Beispiel aus Grundlage 1: lage = 4)
⟦3.570⟧ + ⟦1.073⟧ * ⟦4⟧')
txt <- laufen("a4r wie sie dasteht", plain(a4r))
zeile(txt, "[1] 7.862")
txt <- laufen("a4r gelöst", loesen(a4r, list("3.570" = "4.857", "1.073" = "-0.140", "4" = "1")))
zeile(txt, "[1] 4.717")
txt <- laufen("a4r gelöst (mit Minus geschrieben)", "4.857 - 0.140 * 1")
zeile(txt, "[1] 4.717")
ok("a4: Vorhersage ganz rechts (pa01 = 10)", 4.857 - 0.140 * 10, 3.457)
ok("a4: Vorhersage pa01 = 3", 4.857 - 0.140 * 3, 4.437)
ok("a4: ganz links: Mittel minus Vorhersage", 3.864 - 4.717, -0.853)
ok("a4: ganz rechts: Mittel minus Vorhersage", 2.536 - 3.457, -0.921)
ok("a4: Stufe 9: Mittel minus Vorhersage", 2.776 - (4.857 - 0.140 * 9), -0.821)
mitte <- c(4.549, 4.488, 4.175, 4.057) - (4.857 - 0.140 * 3:6)
stopifnot(all(mitte > 0), all(mitte < 0.2))
cat("  ok  Stufen 3 bis 6: Mittelwerte knapp über der Geraden\n")
ok("a4: Stufe 2 liegt unter der Geraden", round(4.369 - (4.857 - 0.140 * 2), 3), -0.208)

frei_a4 <- vorlage("frei_a4", '# Eine Idee: die Lebenszufriedenheit nach Links-rechts
allbus %>%
  drop_na(ls01, pa01) %>%
  group_by(pa01) %>%
  describe(ls01, weights = wghtpew, show = c("mean", "sd"))')
txt <- laufen("frei_a4", frei_a4)
zeile(txt, "Group: pa01 = LINKS")
zeile(txt, "ls01", "7.050")
zeile(txt, "ls01", "7.570")
zeile(txt, "Group: pa01 = RECHTS")
zeile(txt, "ls01", "6.839")

# =============================================================================================
abschnitt("Hilfe bei R-Fehlermeldungen")
# =============================================================================================
m <- meldung('allbus %>%
  linear_regression(demo ~ pt03, weights = wghtpew)')
meldet(m, "Variable not found in data: `demo`")
m <- meldung("2,288 + 0.465 * 7")
meldet(m, "','")
m <- meldung('allbus %>%
  mutate(demo = rec(ps03, rules = "rev")) %>%
  linear_regression(demo ~ pt03, weight = wghtpew)')
meldet(m, "Unknown argument `weight`")
m <- meldung('allbus %>%
  mutate(demo = rec(ps03, rules = "rev")) %>%
  linear_regression(demo, pt03, weights = wghtpew)')
meldet(m, "`formula` must be a formula object")
m <- meldung('allbus %>%
  mutate(demo = rec(ps03, rules = "rev")) %>%
  levene_test(demo, weights = wghtpew)')
meldet(m, "`group` is required")
m <- meldung('allbus %>%
  mutate(demo = rec(ps03, rules = "rev")) %>%
  linear_regression(demo ~ pt3, weights = wghtpew)')
meldet(m, "Variable not found in data: `pt3`")
m <- meldung('allbus %>%
  describe(ls01, show = c("mean", "n"))')
meldet(m, "Unknown `show` value")
# Komma statt Punkt in mutate(): kein Fehler, aber eine falsche zusätzliche Spalte
x <- .za %>% mutate(vorhersage = 2,288 + 0.465 * pt03)
stopifnot("288 + 0.465 * pt03" %in% names(x), all(x$vorhersage == 2))
cat("  ok  Komma in mutate(): Spalte „288 + 0.465 * pt03“, vorhersage = 2 für alle\n")

# =============================================================================================
abschnitt("Abgleich: jede Vorlage steht wörtlich in sitzung09.md")
# =============================================================================================
plan_datei <- file.path(.ordner, "sitzung09.md")
if (file.exists(plan_datei)) {
  plan <- paste(readLines(plan_datei, encoding = "UTF-8"), collapse = "\n")
  for (n in names(vorlagen)) {
    if (!grepl(vorlagen[[n]], plan, fixed = TRUE)) stop("Vorlage nicht wörtlich im Plan: ", n)
    cat(sprintf("  ok  Vorlage %s steht im Plan\n", n))
  }
} else {
  stop("sitzung09.md nicht gefunden neben dem Skript: ", plan_datei)
}

cat("\nAlle Zahlen und Vorlagen von Sitzung 9 geprüft.\n")
