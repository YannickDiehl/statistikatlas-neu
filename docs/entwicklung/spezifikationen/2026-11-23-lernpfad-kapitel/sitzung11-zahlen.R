# Sitzung 11 „Logistische Regression“: alle Zahlen des Kapitels und jede Codevorlage einmal ausgeführt.
# Daten: ALLBUS 2023, ZA8831 v1.3.0, gewichtet mit wghtpew (wie ab Sitzung 6), nur Aggregate.
# Pakete: tidyverse, mariposa 0.7.4.
# Aufruf:  Rscript sitzung11-zahlen.R
#   oder:  ALLBUS_SAV=/pfad/ZA8831_v1-3-0.sav Rscript sitzung11-zahlen.R
# Bricht mit Fehler ab, sobald eine Zahl nicht zum Plan (sitzung11.md) passt.
# Jede Vorlage läuft in einer frischen Umgebung, in der nur `allbus` (frisch geladen) existiert,
# genau wie in der Code-Werkstatt; das Skript prüft außerdem, dass jede Vorlage wörtlich im Plan steht.

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
allbus_datei <- read_spss(pfad)
stopifnot(nrow(allbus_datei) == 5246)

# ---------------------------------------------------------------------------------------------
# Hilfsfunktionen
# ---------------------------------------------------------------------------------------------
ok <- function(name, ist, soll, tol = 0) {
  if (is.na(ist) || abs(ist - soll) > tol + 1e-9) stop(sprintf("%s: ist %s, soll %s", name, ist, soll))
  cat(sprintf("  ok  %-70s %s\n", name, format(soll, big.mark = ".", decimal.mark = ",")))
}
ausgabe <- function(x) capture.output(print(x))
# Prüft, ob eine Zeile der Ausgabe alle Stücke in dieser Reihenfolge enthält (Leerraum dazwischen egal)
zeile <- function(text, ...) {
  teile <- trimws(gsub("|", " ", c(...), fixed = TRUE))
  text <- gsub("|", " ", text, fixed = TRUE)
  muster <- paste(vapply(teile, function(s) gsub("([][{}()+*^$|\\\\?.])", "\\\\\\1", s), ""), collapse = "\\s+")
  if (!any(grepl(muster, text, perl = TRUE))) stop("In der Ausgabe nicht gefunden: ", paste(teile, collapse = " | "))
  cat(sprintf("  ok  Zeile: %s\n", paste(teile, collapse = "  ")))
}
meldung <- function(expr) tryCatch({ force(expr); "KEIN FEHLER" }, error = function(e) conditionMessage(e))
meldet <- function(text, stueck) {
  if (!grepl(stueck, text, fixed = TRUE)) stop("Fehlermeldung enthält nicht: ", stueck, "\n", text)
  cat(sprintf("  ok  Meldung enthält: %s\n", stueck))
}
# Code in frischer Umgebung ausführen: nur Pakete und ein frisch geladenes allbus
frisch <- function(code) {
  env <- new.env(parent = parent.env(globalenv()))
  assign("allbus", allbus_datei, envir = env)
  # wie in der Konsole: jeder Ausdruck einzeln, sichtbare Ergebnisse werden gedruckt
  out <- capture.output(for (ausdruck in parse(text = code, encoding = "UTF-8")) {
    r <- withVisible(eval(ausdruck, envir = env))
    if (r$visible) print(r$value)
  })
  list(out = out, env = env)
}

allbus <- allbus_datei
rec_alle <- function(d) d %>%
  mutate(
    waehlen   = rec(pv01, rules = "1:90=1 [würde wählen]; 91=0 [würde nicht wählen]; else=NA"),
    pflicht   = rec(pe09, rules = "rev"),
    interesse = rec(pa02a, rules = "rev")
  )
num <- function(x) as.numeric(haven::zap_missing(haven::zap_labels(x)))

# =============================================================================================
cat("\n== Vorweg R lesen: Smartphone-Modell (lm30 ~ age) ==\n")
# =============================================================================================
smartphone <- allbus %>% logistic_regression(lm30 ~ age, weights = wghtpew)
txt_k <- ausgabe(smartphone)
zeile(txt_k, "Logistic Regression: lm30 ~ age [P(lm30 = GENANNT)] [Weighted]")
zeile(txt_k, "Nagelkerke R2 = 0.203, chi2(1) = 453.95, p < 0.001 ***, Accuracy = 91.4%, N = 4813")
txt_s <- ausgabe(summary(smartphone))
zeile(txt_s, "- N: 4813")
zeile(txt_s, "0 (NICHT GENANNT)", "0")
zeile(txt_s, "1 (GENANNT)", "1")
zeile(txt_s, "Model", "453.950", "1", "<.001", "***")
zeile(txt_s, "-2 Log Likelihood", "2370.945")
zeile(txt_s, "Cox & Snell R Square", "0.090")
zeile(txt_s, "Nagelkerke R Square", "0.203")
zeile(txt_s, "McFadden R Square", "0.161")
zeile(txt_s, "8.586", "8", ".378")
zeile(txt_s, "NICHT GENANNT", "4", "411", "0.9")
zeile(txt_s, "GENANNT", "5", "4393", "99.9")
zeile(txt_s, "Overall Percentage", "91.4")
zeile(txt_s, "(Intercept)", "6.774", "0.276", "604.222", "1", "<.001", "874.684")
zeile(txt_s, "age", "-0.076", "0.004", "328.394", "1", "<.001", "0.927", "0.919", "0.935")
ok("exp(-0.076)", round(exp(-0.076), 7), 0.9268162)
ok("Exp(B) hoch 10 (zehn Jahre): 0.927^10", round(0.927^10, 2), 0.47)
ok("Prozentänderung der Chance je Jahr (0.927 - 1) * 100", round((0.927 - 1) * 100, 1), -7.3)
pr <- predict(smartphone, newdata = tibble(age = c(30, 80)), type = "response")
ok("predict 30 Jahre", round(pr[[1]], 7), 0.9890025)
ok("predict 80 Jahre", round(pr[[2]], 7), 0.6698802)
txt_ame <- ausgabe(summary(marginal_effects(smartphone)))
zeile(txt_ame, "age", "-0.005", "3.04e-04", "-17.529", "<.001", "-0.006", "-0.005", "***")
ame_age <- marginal_effects(smartphone)$results$AME
ok("AME Alter ungerundet (je Jahr)", round(ame_age, 5), -0.00532)
# gewichtete Fälle: N = round(Σw); gezählte Fälle
d_sm <- allbus %>% transmute(v = num(lm30), a = num(age), w = num(wghtpew)) %>% filter(!is.na(v), !is.na(a))
ok("Smartphone-Modell: gezählte Fälle", nrow(d_sm), 4777)
ok("Smartphone-Modell: gezählte ohne Smartphone", sum(d_sm$v == 0), 417)
ok("Smartphone-Modell: Mittelwert lm30 (gewichtet, = Anteil)", round(weighted.mean(d_sm$v, d_sm$w), 3), 0.914)

# =============================================================================================
cat("\n== Grundlage 1: Anteile je Altersgruppe, Gerade, drei Sprachen ==\n")
# =============================================================================================
grp <- d_sm %>%
  mutate(g = cut(a, c(17, 29, 39, 49, 59, 69, 79, 99))) %>%
  group_by(g) %>%
  summarise(n = n(), p = round(100 * weighted.mean(v == 1, w), 1), .groups = "drop")
soll_p <- c(99.2, 98.5, 96.8, 94.0, 85.4, 77.7, 59.3)
soll_n <- c(692, 791, 712, 974, 902, 550, 156)
for (i in 1:7) {
  ok(paste("Altersgruppe", grp$g[i], "Anteil %"), grp$p[i], soll_p[i])
  ok(paste("Altersgruppe", grp$g[i], "gezählte Befragte"), grp$n[i], soll_n[i])
}
# Drei Sprachen für die Gruppe 70 bis 79 (77,7 %)
ok("Chance 77,7 %: 77.7 / 22.3", round(77.7 / 22.3, 2), 3.48)
ok("Logit 77,7 %: ln(3,48)", round(log(77.7 / 22.3), 2), 1.25)
ok("Chance 99,2 %", round(99.2 / 0.8), 124)
ok("Logit 99,2 %", round(log(99.2 / 0.8), 2), 4.82)
ok("Chance 59,3 %", round(59.3 / 40.7, 2), 1.46)
ok("Logit 59,3 %", round(log(59.3 / 40.7), 2), 0.38)
# Übersetzer-Tabelle
p_tab <- c(1, 5, 10, 20, 25, 50, 75, 80, 90, 95, 99)
ch_tab <- c(0.01, 0.05, 0.11, 0.25, 0.33, 1, 3, 4, 9, 19, 99)
lo_tab <- c(-4.60, -2.94, -2.20, -1.39, -1.10, 0, 1.10, 1.39, 2.20, 2.94, 4.60)
for (i in seq_along(p_tab)) {
  q <- p_tab[i] / 100
  ok(sprintf("Übersetzer p = %d %%: Chance", p_tab[i]), round(q / (1 - q), 2), ch_tab[i])
  ok(sprintf("Übersetzer p = %d %%: Logit", p_tab[i]), round(log(q / (1 - q)), 2), lo_tab[i])
}
ok("Übersetzer Start 78 %: Chance", round(0.78 / 0.22, 2), 3.55)
ok("Übersetzer Start 78 %: Logit", round(log(0.78 / 0.22), 2), 1.27)
ok("Kurz überlegen: Chance 4 in Prozent", 100 * 4 / (1 + 4), 80)
ok("Kurz überlegen 2b: Chance 1 mal 2 in Prozent", round(100 * 2 / 3), 67)
ok("Prüf dich 2: exp(-0.5)", round(exp(-0.5), 2), 0.61)
ok("Prüf dich 3: 60/40 * 2 = 3 → %", 100 * (60 / 40 * 2) / (1 + 60 / 40 * 2), 75)
# Gerade (lineare Regression, gewichtet) – kennst du aus Sitzung 9
lin <- allbus %>% linear_regression(lm30 ~ age, weights = wghtpew)
txt_lin <- ausgabe(summary(lin))
zeile(txt_lin, "(Intercept)", "1.151")
zeile(txt_lin, "age", "-0.005")
zeile(txt_lin, "R Square", "0.084")
pl <- predict(lin, newdata = tibble(age = c(18, 30, 95)))
ok("Gerade sagt für 18-Jährige voraus (%)", round(100 * pl[[1]], 1), 106.6)
ok("Gerade sagt für 30-Jährige voraus (%)", round(100 * pl[[2]], 1), 100.9)
ok("Gerade sagt für 95-Jährige voraus (%)", round(100 * pl[[3]], 1), 70.1)
ok("Gerade über 100 % bis zum Alter", round((coef(lin)[[1]] - 1) / -coef(lin)[[2]], 1), 31.9)
ok("B der Geraden mit mehr Stellen", round(coef(lin)[[2]], 5), -0.00474)
ok("Gerade von Hand, 18 Jahre: 1.151 - 0.00474 * 18 (%)", round(100 * (1.151 - 0.00474 * 18), 1), 106.6)
ok("Gerade von Hand, 95 Jahre: 1.151 - 0.00474 * 95 (%)", round(100 * (1.151 - 0.00474 * 95), 1), 70.1)
ok("Gerade mit gerundetem B, 18 Jahre: 1.151 - 0.005 * 18 (%)", round(100 * (1.151 - 0.005 * 18), 1), 106.1)
# S-Kurve für dieselben Alter (predict, ungerundete Koeffizienten)
ps <- predict(smartphone, newdata = tibble(age = c(18, 95)), type = "response")
ok("S-Kurve 18 Jahre (%)", round(100 * ps[[1]], 1), 99.6)
ok("S-Kurve 95 Jahre (%)", round(100 * ps[[2]], 1), 39.4)
# Modellwerte an den Gruppenmitten (für die Textfassung „die Kurve trifft die Punkte“)
mitte <- d_sm %>% mutate(g = cut(a, c(17, 29, 39, 49, 59, 69, 79, 99))) %>% group_by(g) %>%
  summarise(m = weighted.mean(a, w), .groups = "drop")
ok("Gruppenmitten (gewichtetes Mittel des Alters, ganze Jahre)", sum(abs(round(mitte$m) - c(24, 35, 44, 55, 64, 74, 83))), 0)
pm <- round(100 * predict(smartphone, newdata = tibble(age = mitte$m), type = "response"), 1)
ok("Kurve an den Gruppenmitten, Abstand zum Anteil höchstens 1,7 Prozentpunkte", max(abs(pm - soll_p)), 1.7, 0.05)

# =============================================================================================
cat("\n== Grundlage 2 und 3: Rechnen mit den gerundeten Zahlen aus der Ausgabe ==\n")
# =============================================================================================
hand <- function(a) {
  l <- 6.774 - 0.076 * a
  c(logit = l, chance = exp(l), p = 100 * exp(l) / (1 + exp(l)))
}
tab_alter <- list(
  `20` = c(5.254, 191.3, 99.5), `30` = c(4.494, 89.5, 98.9), `40` = c(3.734, 41.8, 97.7),
  `50` = c(2.974, 19.6, 95.1), `60` = c(2.214, 9.15, 90.1), `70` = c(1.454, 4.28, 81.1),
  `80` = c(0.694, 2.00, 66.7), `90` = c(-0.066, 0.94, 48.4)
)
for (a in names(tab_alter)) {
  h <- hand(as.numeric(a)); s <- tab_alter[[a]]
  ok(sprintf("Alter %s: Logit", a), round(h[["logit"]], 3), s[1])
  ok(sprintf("Alter %s: Chance", a), round(h[["chance"]], if (s[2] > 100) 1 else 2), s[2], 0.051)
  ok(sprintf("Alter %s: Wahrscheinlichkeit %%", a), round(h[["p"]], 1), s[3])
}
ok("30 → 40: Prozentpunkte", round(hand(40)[["p"]] - hand(30)[["p"]], 1), -1.2)
ok("70 → 80: Prozentpunkte", round(hand(80)[["p"]] - hand(70)[["p"]], 1), -14.4)
ok("30 → 40: Chance mal", round(hand(40)[["chance"]] / hand(30)[["chance"]], 2), 0.47)
ok("70 → 80: Chance mal", round(hand(80)[["chance"]] / hand(70)[["chance"]], 2), 0.47)
ok("Logit sinkt je zehn Jahre um 0,76", round(hand(40)[["logit"]] - hand(30)[["logit"]], 2), -0.76)
ok("Odds Ratio zehn Jahre aus den Kästen: 41.8 / 89.5", round(41.8 / 89.5, 2), 0.47)
ok("Alter, ab dem p unter 50 % fällt (Logit 0)", round(-coef(smartphone)[[1]] / coef(smartphone)[[2]], 1), 89.3)
ok("AME über zehn Jahre (Prozentpunkte)", round(1000 * ame_age, 1), -5.3)
pe <- predict(smartphone, newdata = tibble(age = c(30, 40, 70, 80)), type = "response")
ok("predict 40 Jahre (%)", round(100 * pe[[2]], 1), 97.7)
ok("predict 70 Jahre (%)", round(100 * pe[[3]], 1), 81.2)
ok("predict 80 Jahre (%)", round(100 * pe[[4]], 1), 67.0)

# =============================================================================================
cat("\n== Grundlage 4: Modellgüte Smartphone ==\n")
# =============================================================================================
ok("Regel „alle ja“: (5 + 4393) / 4813 * 100", round((5 + 4393) / 4813 * 100, 2), 91.38)
ok("Modell richtig: (4 + 4393) / 4813 * 100", round((4 + 4393) / 4813 * 100, 2), 91.36)
ok("−2LL Nullmodell: 2370.945 + 453.950", 2370.945 + 453.950, 2824.895)
ok("McFadden = 453.950 / 2824.895", round(453.950 / 2824.895, 3), 0.161)

# =============================================================================================
cat("\n== Aufgabe 1: Wahlabsicht und Pflichtgefühl ==\n")
# =============================================================================================
a <- rec_alle(allbus)
txt_f <- ausgabe(a %>% frequency(waehlen, weights = wghtpew))
zeile(txt_f, "# total N=5246 valid N=3977 mean=0.94 sd=0.23 skewness=-3.77")
zeile(txt_f, "0 | würde nicht wählen |  232 |   4.42 |    5.83")
zeile(txt_f, "1 | würde wählen       | 3745 |  71.38 |   94.17")
zeile(txt_f, "System", "1269")
txt_c <- ausgabe(a %>% crosstab(pflicht, waehlen, percentages = "row", weights = wghtpew))
zeile(txt_c, "N (valid): 2759 (weighted)")
zeile(txt_c, "STIMME GAR NICHT ZU", "39", "62", "101")
zeile(txt_c, "row %", "38.6%", "61.4%", "100.0%")
zeile(txt_c, "STIMME EHER NICHT ZU", "48", "173", "221")
zeile(txt_c, "row %", "21.7%", "78.3%", "100.0%")
zeile(txt_c, "STIMME EHER ZU", "34", "623", "657")
zeile(txt_c, "row %", "5.2%", "94.8%", "100.0%")
zeile(txt_c, "STIMME VOLL ZU", "21", "1759", "1780")
zeile(txt_c, "row %", "1.2%", "98.8%", "100.0%")
zeile(txt_c, "Total", "142", "2617", "2759")
ok("Stufe 1 → 2 (Prozentpunkte)", round(78.3 - 61.4, 1), 16.9)
ok("Stufe 2 → 3 (Prozentpunkte)", round(94.8 - 78.3, 1), 16.5)
ok("Stufe 3 → 4 (Prozentpunkte)", round(98.8 - 94.8, 1), 4.0)
ok("Gerade weitergedacht: 61.4 + 3 * 16.9", round(61.4 + 3 * 16.9, 1), 112.1)
ok("Chance gar nicht zu: 61.4 / 38.6", round(61.4 / 38.6, 2), 1.59)
ok("Chance eher nicht zu: 78.3 / 21.7", round(78.3 / 21.7, 2), 3.61)
ok("Chance eher zu: 94.8 / 5.2", round(94.8 / 5.2, 2), 18.23)
ok("Chance voll zu: 98.8 / 1.2", round(98.8 / 1.2, 2), 82.33)
ok("Chance voll zu aus Anzahlen: 1759 / 21", round(1759 / 21, 2), 83.76)
# Probier-Werkstatt A1: Gerade
lp <- a %>% linear_regression(waehlen ~ pflicht, weights = wghtpew)
txt_lp <- ausgabe(summary(lp))
zeile(txt_lp, "(Intercept)", "0.596")
zeile(txt_lp, "pflicht", "0.101")
ok("Gerade bei Stufe 4: 0.596 + 0.101 * 4", round(0.596 + 0.101 * 4, 3), 1.000)
ok("Gerade bei Stufe 1: 0.596 + 0.101 * 1 (Prozent)", round(100 * (0.596 + 0.101), 1), 69.7)

# =============================================================================================
cat("\n== Aufgabe 2: das Modell ==\n")
# =============================================================================================
m1 <- a %>% logistic_regression(waehlen ~ pflicht, weights = wghtpew)
txt_m1 <- ausgabe(summary(m1))
zeile(txt_m1, "- N: 2759")
zeile(txt_m1, "pflicht", "1.358", "0.089", "233.933", "1", "<.001", "3.888", "3.267", "4.628")
zeile(txt_m1, "(Intercept)", "-1.160")
modell <- a %>% logistic_regression(waehlen ~ pflicht + interesse, weights = wghtpew)
zeile(ausgabe(modell), "Nagelkerke R2 = 0.275, chi2(2) = 265.83, p < 0.001 ***, Accuracy = 95.1%, N = 2758")
txt_m <- ausgabe(summary(modell))
zeile(txt_m, "- N: 2758")
zeile(txt_m, "0 (würde nicht wählen)", "0")
zeile(txt_m, "1 (würde wählen)", "1")
zeile(txt_m, "Model", "265.831", "2", "<.001", "***")
zeile(txt_m, "-2 Log Likelihood", "856.448")
zeile(txt_m, "Cox & Snell R Square", "0.092")
zeile(txt_m, "Nagelkerke R Square", "0.275")
zeile(txt_m, "McFadden R Square", "0.237")
zeile(txt_m, "16.271", "8", ".039")
zeile(txt_m, "würde nicht wählen", "18", "125", "12.8")
zeile(txt_m, "würde wählen", "12", "2603", "99.5")
zeile(txt_m, "Overall Percentage", "95.1")
zeile(txt_m, "(Intercept)", "-2.154", "0.371", "33.682", "1", "<.001", "0.116")
zeile(txt_m, "pflicht", "1.326", "0.090", "214.993", "1", "<.001", "3.765", "3.154", "4.495")
zeile(txt_m, "interesse", "0.340", "0.096", "12.513", "1", "<.001", "1.405", "1.164", "1.696")
ok("Interesse: (1.405 - 1) * 100", round((1.405 - 1) * 100, 1), 40.5)
ok("Kehrwert bei falscher Richtung: 1 / 3.765", round(1 / 3.765, 2), 0.27)
d_m <- a %>% transmute(y = num(waehlen), p = num(pflicht), i = num(interesse), w = num(wghtpew)) %>%
  filter(!is.na(y), !is.na(p), !is.na(i))
ok("Modell: gezählte Fälle", nrow(d_m), 2778)
ok("Modell: gezählte Nichtwählende", sum(d_m$y == 0), 146)
ok("Modell: Summe der Gewichte", round(sum(d_m$w), 1), 2757.7)
ok("pe09 gültig (ungewichtet)", sum(!is.na(num(allbus$pe09))), 3602)
zeile(ausgabe(allbus %>% frequency(pe09)), "-11", "TNZ: SPLIT", "1596")
# Ungewichtet zum Vergleich
mu <- a %>% logistic_regression(waehlen ~ pflicht + interesse)
zeile(ausgabe(summary(mu)), "pflicht", "1.309", "0.089", "216.542", "1", "<.001", "3.703")
# Probier-Werkstatt A2: mit Alter
m3 <- a %>% logistic_regression(waehlen ~ pflicht + interesse + age, weights = wghtpew)
txt_m3 <- ausgabe(summary(m3))
zeile(txt_m3, "- N: 2751")
zeile(txt_m3, "pflicht", "1.315", "0.091", "208.683", "1", "<.001", "3.724")
zeile(txt_m3, "age", "0.008", "0.005", "2.113", "1", ".146", "1.008")

# =============================================================================================
cat("\n== Aufgabe 3: Wahrscheinlichkeiten ==\n")
# =============================================================================================
ok("Person A: Logit -2.154 + 1.326 * 2 + 0.340 * 2", round(-2.154 + 1.326 * 2 + 0.340 * 2, 3), 1.178)
ok("Person A: Chance exp(1.178)", round(exp(1.178), 3), 3.248)
ok("Person A: Wahrscheinlichkeit (%)", round(100 * exp(1.178) / (1 + exp(1.178)), 1), 76.5)
ok("Vorlage (1, 1): Logit", round(-2.154 + 1.326 + 0.340, 3), -0.488)
pp <- predict(modell, newdata = tibble(pflicht = c(2, 3, 3, 4), interesse = c(2, 2, 4, 4)), type = "response")
ok("predict A", round(pp[[1]], 7), 0.7644409)
ok("predict A + 1", round(pp[[2]], 7), 0.9243475)
ok("predict B", round(pp[[3]], 7), 0.9601851)
ok("predict B + 1", round(pp[[4]], 7), 0.9891065)
ok("A: Prozentpunkte", round(100 * (pp[[2]] - pp[[1]]), 1), 16.0)
ok("B: Prozentpunkte", round(100 * (pp[[4]] - pp[[3]]), 1), 2.9)
ok("A: 92.4 - 76.4 (gerundet abgelesen)", round(92.4 - 76.4, 1), 16.0)
ok("B: 98.9 - 96.0 (gerundet abgelesen)", round(98.9 - 96.0, 1), 2.9)
chA <- pp[[1]] / (1 - pp[[1]]); chA1 <- pp[[2]] / (1 - pp[[2]])
chB <- pp[[3]] / (1 - pp[[3]]); chB1 <- pp[[4]] / (1 - pp[[4]])
ok("Chance A (predict)", round(chA, 2), 3.25)
ok("Chance A + 1", round(chA1, 1), 12.2)
ok("Chance B", round(chB, 1), 24.1)
ok("Chance B + 1", round(chB1, 1), 90.8)
ok("Chance A mal", round(chA1 / chA, 3), 3.765)
ok("Chance B mal", round(chB1 / chB, 3), 3.765)
ok("Logit A", round(log(chA), 2), 1.18)
ok("Logit A + 1", round(log(chA1), 2), 2.50)
ok("Logit B", round(log(chB), 2), 3.18)
ok("Logit B + 1", round(log(chB1), 2), 4.51)
ok("Probe falsch gelesen: 76.4 * 3.765", round(76.4 * 3.765), 288)
ok("Probe A2: 61.4 * 3.8", round(61.4 * 3.8), 233)
ok("Sonderfall a2d Pflicht: (3.765 - 1) * 100", round((3.765 - 1) * 100, 1), 276.5)

txt_me <- ausgabe(summary(marginal_effects(modell)))
zeile(txt_me, "pflicht", "0.054", "0.004", "13.344", "<.001", "0.046", "0.062", "***")
zeile(txt_me, "interesse", "0.014", "0.004", "3.521", "<.001", "0.006", "0.021", "***")
# Karte 3c: AME ist die mittlere Steigung (dydx); eine ganze Stufe mehr bringt im Mittel weniger
stopifnot(all(marginal_effects(modell)$results$Type == "dydx"))
d_ame <- a %>% transmute(waehlen, pflicht, interesse, wghtpew) %>% drop_na()
p0 <- predict(modell, newdata = d_ame, type = "response")
p1 <- predict(modell, newdata = mutate(d_ame, pflicht = as.numeric(pflicht) + 1), type = "response")
diskret <- weighted.mean(p1 - p0, as.numeric(d_ame$wghtpew))
if (!(diskret < marginal_effects(modell)$results$AME[[1]])) stop("ganze Stufe bringt nicht weniger als der AME")
cat(sprintf("  ok  ganze Stufe mehr im Mittel %.3f < AME %.3f (Karte 3c, ohne Zahl im Text)\n", diskret, marginal_effects(modell)$results$AME[[1]]))
# Probier-Werkstatt A3
ps4 <- predict(modell, newdata = tibble(pflicht = 1:4, interesse = c(3, 3, 3, 3)), type = "response")
ok("Stufen bei Interesse 3: pflicht 1 (%)", round(100 * ps4[[1]], 1), 54.8)
ok("Stufen bei Interesse 3: pflicht 2 (%)", round(100 * ps4[[2]], 1), 82.0)
ok("Stufen bei Interesse 3: pflicht 3 (%)", round(100 * ps4[[3]], 1), 94.5)
ok("Stufen bei Interesse 3: pflicht 4 (%)", round(100 * ps4[[4]], 1), 98.5)
ok("Zuwächse 1→2, 2→3, 3→4", sum(abs(diff(round(100 * ps4, 1)) - c(27.2, 12.5, 4.0))), 0, 1e-6)

# =============================================================================================
cat("\n== Aufgabe 4: Modellgüte ==\n")
# =============================================================================================
ok("Regel „alle wählen“: (12 + 2603) / 2758 * 100", round((12 + 2603) / 2758 * 100, 2), 94.82)
ok("Nichtwählende in der Tabelle: 18 + 125", 18 + 125, 143)
ok("−2LL Nullmodell: 856.448 + 265.831", 856.448 + 265.831, 1122.279)
ok("McFadden = 265.831 / 1122.279", round(265.831 / 1122.279, 3), 0.237)
mi <- a %>% logistic_regression(waehlen ~ interesse, weights = wghtpew)
zeile(ausgabe(mi), "Nagelkerke R2 = 0.050, chi2(1) = 72.45, p < 0.001 ***, Accuracy = 94.2%, N = 3970")
# Interesse nicht gleichmäßig: Zeilenprozent
txt_ci <- ausgabe(a %>% crosstab(interesse, waehlen, percentages = "row", weights = wghtpew))
zeile(txt_ci, "row %", "29.8%", "70.2%")
zeile(txt_ci, "row %", "2.5%", "97.5%")
zeile(txt_ci, "row %", "5.9%", "94.1%")

# =============================================================================================
cat("\n== Fehlermeldungen (deutsche R-Meldungen, wo R übersetzt) ==\n")
# =============================================================================================
meldet(meldung(allbus %>% logistic_regression(waehlen ~ pflicht, weights = wghtpew)),
       "Variables not found in data")
meldet(meldung(allbus %>% logistic_regression(pv01 ~ age, weights = wghtpew)),
       "must be binary: it has 8 distinct values")
meldet(meldung(tibble(pflicht = c(2, 3, 3), interesse = c(2, 2, 4, 4))),
       "Tibble columns must have compatible sizes")
meldet(meldung(predict(smartphone, newdata = tibble(alter = 30), type = "response")), "age")
meldet(meldung(eval(parse(text = "marginal_effect(smartphone)"))), "marginal_effect")
meldet(meldung(eval(parse(text = "Exp(1)"))), "Exp")
meldet(meldung(parse(text = "3,248 * 3.765")), "','")
stopifnot(round(predict(smartphone, newdata = tibble(age = 30))[[1]], 3) == 4.499)
cat("  ok  predict() ohne type = \"response\" gibt Logits: 4.499 statt 0.989\n")

# =============================================================================================
cat("\n== Alle Codevorlagen, jede in einer frischen Umgebung (Marken ⟦…⟧ mit Beispielwert) ==\n")
# =============================================================================================
V_REC3 <- '    waehlen   = rec(pv01, rules = "1:90=1 [würde wählen]; 91=0 [würde nicht wählen]; else=NA"),
    pflicht   = rec(pe09, rules = "rev"),
    interesse = rec(pa02a, rules = "rev")'
vorlagen <- c(
  start = '# Pakete laden und Daten einlesen
library(tidyverse)
library(mariposa)

allbus <- read_spss("ZA8831_v1-3-0.sav")',
  r_modell = '# Logistisches Modell: Internet mit dem Smartphone (lm30) nach Alter, gewichtet
smartphone <- allbus %>%
  logistic_regression(lm30 ~ age, weights = wghtpew)

# Kurz: eine Zeile mit den wichtigsten Zahlen
smartphone

# Ausführlich: alle Tabellen
smartphone %>%
  summary()',
  r_exp = '# Aus B wird Exp(B): e hoch B
exp(-0.076)',
  r_predict = '# Modell wie oben, dann zwei Beispielpersonen: 30 und 80 Jahre alt
smartphone <- allbus %>%
  logistic_regression(lm30 ~ age, weights = wghtpew)

leute <- tibble(
  age = c(30, 80)
)

smartphone %>%
  predict(newdata = leute, type = "response")',
  r_ame = '# Durchschnittlicher marginaler Effekt (AME) des Alters
allbus %>%
  logistic_regression(lm30 ~ age, weights = wghtpew) %>%
  marginal_effects() %>%
  summary()',
  a1f = '# Wählen als 0/1 bilden und auszählen, gewichtet
allbus %>%
  mutate(
    waehlen = rec(pv01, rules = "1:90=1 [würde wählen]; 91=0 [würde nicht wählen]; else=NA")
  ) %>%
  frequency(waehlen, weights = wghtpew)',
  a1k = '# Wählen als 0/1 und Pflichtgefühl umgepolt; Kreuztabelle mit Zeilenprozent, gewichtet
allbus %>%
  mutate(
    waehlen = rec(pv01, rules = "1:90=1 [würde wählen]; 91=0 [würde nicht wählen]; else=NA"),
    pflicht = rec(pe09, rules = "rev")
  ) %>%
  crosstab(pflicht, waehlen, percentages = "row", weights = wghtpew)',
  a1r = '# Wie viele Prozentpunkte bringt eine Stufe? Hier die erste Stufe
⟦78.3⟧ - ⟦61.4⟧',
  a1c = '# Chance = Prozent „wählen“ geteilt durch Prozent „nicht wählen“, hier „stimme gar nicht zu“
⟦61.4⟧ / ⟦38.6⟧',
  frei_a1 = '# Eine Idee: Was sagt eine Gerade (lineare Regression) für die vier Stufen voraus?
allbus %>%
  mutate(
    waehlen = rec(pv01, rules = "1:90=1 [würde wählen]; 91=0 [würde nicht wählen]; else=NA"),
    pflicht = rec(pe09, rules = "rev")
  ) %>%
  linear_regression(waehlen ~ pflicht, weights = wghtpew) %>%
  summary()',
  a2 = paste0('# Variablen wie in Aufgabe 1, dazu Interesse umgepolt; dann das logistische Modell, gewichtet
modell <- allbus %>%
  mutate(
', V_REC3, '
  ) %>%
  logistic_regression(waehlen ~ ⟦pflicht⟧, weights = wghtpew)

modell %>%
  summary()'),
  a2r = '# Exp(B) als Veränderung der Chance in Prozent, hier das Alter aus Grundlage 2
(⟦0.927⟧ - 1) * 100',
  frei_a2 = paste0('# Eine Idee: Bleibt Exp(B) des Pflichtgefühls, wenn auch das Alter im Modell ist?
allbus %>%
  mutate(
', V_REC3, '
  ) %>%
  logistic_regression(waehlen ~ pflicht + interesse + age, weights = wghtpew) %>%
  summary()'),
  a3h = '# Von Hand: Logit, Chance, Wahrscheinlichkeit (Konstante und B aus Aufgabe 2, Spalte B)
logit <- -2.154 + 1.326 * ⟦1⟧ + 0.340 * ⟦1⟧

logit

chance <- exp(logit)

chance

chance / (1 + chance)',
  a3p = paste0('# Modell wie in Aufgabe 2
modell <- allbus %>%
  mutate(
', V_REC3, '
  ) %>%
  logistic_regression(waehlen ~ pflicht + interesse, weights = wghtpew)

# Vier Beispielpersonen: A, A mit einer Stufe mehr Pflichtgefühl, B, B mit einer Stufe mehr
profile <- tibble(
  pflicht   = c(2, 3, ⟦2⟧, ⟦3⟧),
  interesse = c(2, 2, ⟦2⟧, ⟦2⟧)
)

modell %>%
  predict(newdata = profile, type = "response")'),
  a3m = paste0('# Modell wie in Aufgabe 2, dann der durchschnittliche marginale Effekt (AME)
allbus %>%
  mutate(
', V_REC3, '
  ) %>%
  logistic_regression(waehlen ~ pflicht + interesse, weights = wghtpew) %>%
  marginal_effects() %>%
  summary()'),
  frei_a3 = paste0('# Eine Idee: Modell wie in Aufgabe 2; alle vier Stufen Pflichtgefühl bei mittlerem Interesse
modell <- allbus %>%
  mutate(
', V_REC3, '
  ) %>%
  logistic_regression(waehlen ~ pflicht + interesse, weights = wghtpew)

stufen <- tibble(
  pflicht   = c(1, 2, 3, 4),
  interesse = c(3, 3, 3, 3)
)

modell %>%
  predict(newdata = stufen, type = "response")'),
  a4 = paste0('# Modell wie in Aufgabe 2, ausführliche Ausgabe
allbus %>%
  mutate(
', V_REC3, '
  ) %>%
  logistic_regression(waehlen ~ pflicht + interesse, weights = wghtpew) %>%
  summary()'),
  a4r = '# Wie oft läge die Regel „alle Ja“ richtig? Hier das Smartphone-Beispiel aus Grundlage 4
(⟦5⟧ + ⟦4393⟧) / ⟦4813⟧ * 100',
  a4l = '# −2LL des Nullmodells = −2LL des Modells + Chi-square; hier das Smartphone-Beispiel
⟦2370.945⟧ + ⟦453.950⟧',
  frei_a4 = '# Eine Idee: Wie gut ist ein Modell nur mit dem Interesse?
allbus %>%
  mutate(
    waehlen   = rec(pv01, rules = "1:90=1 [würde wählen]; 91=0 [würde nicht wählen]; else=NA"),
    interesse = rec(pa02a, rules = "rev")
  ) %>%
  logistic_regression(waehlen ~ interesse, weights = wghtpew)'
)

skript <- grep("^--file=", commandArgs(FALSE), value = TRUE)[1]
plan <- if (!is.na(skript)) file.path(dirname(normalizePath(sub("^--file=", "", skript))), "sitzung11.md") else "sitzung11.md"
plan_text <- if (file.exists(plan)) paste(readLines(plan, encoding = "UTF-8"), collapse = "\n") else NA
if (is.na(plan_text)) cat("  (sitzung11.md nicht gefunden, Abgleich übersprungen)\n")

ausgaben <- list()
for (k in names(vorlagen)) {
  code <- vorlagen[[k]]
  if (!is.na(plan_text) && !grepl(paste0("```r\n", code, "\n```"), plan_text, fixed = TRUE)) {
    stop("Vorlage ", k, " steht nicht wörtlich als ```r-Block in sitzung11.md")
  }
  if (grepl("|>", code, fixed = TRUE)) stop("Vorlage ", k, " nutzt |>")
  ausfuehrbar <- gsub("⟦|⟧", "", code)
  ausfuehrbar <- sub('read_spss("ZA8831_v1-3-0.sav")', "read_spss(pfad)", ausfuehrbar, fixed = TRUE)
  if (k == "start") {
    env <- new.env(parent = globalenv())
    out <- capture.output(eval(parse(text = ausfuehrbar, encoding = "UTF-8"), envir = env))
    stopifnot(nrow(env$allbus) == 5246)
  } else {
    out <- frisch(ausfuehrbar)$out
    stopifnot(length(out) > 0)
  }
  ausgaben[[k]] <- out
  cat(sprintf("  ok  Vorlage %-10s %3d Zeilen Ausgabe (frische Umgebung)\n", k, length(out)))
}

# Gedruckte Ergebnisse der Vorlagen mit Beispielwert
stopifnot(identical(ausgaben$r_exp, "[1] 0.9268162"))
zeile(ausgaben$r_predict, "0.9890025", "0.6698802")
zeile(ausgaben$r_modell, "age", "-0.076", "0.004", "328.394")
zeile(ausgaben$r_ame, "age", "-0.005")
zeile(ausgaben$r_ame, "Factor rows show the average discrete change vs. the reference level.")
zeile(ausgaben$a1f, "# total N=5246 valid N=3977 mean=0.94")
zeile(ausgaben$a1k, "row %", "38.6%", "61.4%", "100.0%")
stopifnot(identical(ausgaben$a1r, "[1] 16.9"))
stopifnot(identical(ausgaben$a1c, "[1] 1.590674"))
zeile(ausgaben$frei_a1, "pflicht", "0.101")
zeile(ausgaben$a2, "pflicht", "1.358", "0.089", "233.933", "1", "<.001", "3.888")
stopifnot(identical(ausgaben$a2r, "[1] -7.3"))
zeile(ausgaben$frei_a2, "age", "0.008", "0.005", "2.113", "1", ".146", "1.008")
stopifnot(identical(ausgaben$a3h, c("[1] -0.488", "[1] 0.6138529", "[1] 0.3803648")))
zeile(ausgaben$a3p, "0.7644409", "0.9243475", "0.7644409", "0.9243475")
zeile(ausgaben$a3m, "pflicht", "0.054")
zeile(ausgaben$frei_a3, "0.5477045", "0.8201193", "0.9449511", "0.9847629")
zeile(ausgaben$a4, "Overall Percentage", "95.1")
stopifnot(identical(ausgaben$a4r, "[1] 91.37752"))
stopifnot(identical(ausgaben$a4l, "[1] 2824.895"))
zeile(ausgaben$frei_a4, "Nagelkerke R2 = 0.050")
cat("  ok  Ausgaben der Vorlagen mit Beispielwert wie im Plan\n")

# Getauschte Fassungen (so, wie Studierende sie anpassen), wieder je frisch
tausch <- list(
  a1r = "98.8 - 94.8",
  a1c = "98.8 / 1.2",
  a2 = sub("⟦pflicht⟧", "pflicht + interesse", vorlagen[["a2"]], fixed = TRUE),
  a2r = "(1.405 - 1) * 100",
  a3h = gsub("⟦1⟧", "2", vorlagen[["a3h"]], fixed = TRUE),
  a3p = sub("c(2, 3, ⟦2⟧, ⟦3⟧)", "c(2, 3, 3, 4)",
            sub("c(2, 2, ⟦2⟧, ⟦2⟧)", "c(2, 2, 4, 4)", vorlagen[["a3p"]], fixed = TRUE), fixed = TRUE),
  a4r = "(12 + 2603) / 2758 * 100",
  a4l = "856.448 + 265.831"
)
g <- lapply(tausch, function(code) frisch(gsub("⟦|⟧", "", code))$out)
stopifnot(identical(g$a1r, "[1] 4"))
stopifnot(identical(g$a1c, "[1] 82.33333"))
zeile(g$a2, "pflicht", "1.326", "0.090", "214.993", "1", "<.001", "3.765")
zeile(g$a2, "interesse", "0.340", "0.096", "12.513", "1", "<.001", "1.405")
stopifnot(identical(g$a2r, "[1] 40.5"))
stopifnot(identical(g$a3h, c("[1] 1.178", "[1] 3.247872", "[1] 0.764588")))
zeile(g$a3p, "0.7644409", "0.9243475", "0.9601851", "0.9891065")
stopifnot(identical(g$a4r, "[1] 94.81508"))
stopifnot(identical(g$a4l, "[1] 1122.279"))
cat("  ok  Getauschte Fassungen: 4, 82.33333, 3.765, 40.5, 0.764588, 0.9601851/0.9891065, 94.81508, 1122.279\n")

cat("\nFertig: alle Zahlen von Sitzung 11 stimmen.\n")
