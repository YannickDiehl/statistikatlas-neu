# Sitzung 10 „Regression vertiefen“: alle Zahlen des Kapitels und jede Codevorlage einmal ausgeführt.
# Daten: ALLBUS 2023, ZA8831 v1.3.0, gewichtet mit wghtpew (wie ab Sitzung 6), nur Aggregate.
# Konstruierte Beispiele (Einfluss: zwölf Punkte; korrigiertes R²: 30 Befragte mit Würfeln) werden hier nachgerechnet.
# Pakete: tidyverse, mariposa 0.7.4.
# Aufruf:  Rscript sitzung10-zahlen.R
#   oder:  ALLBUS_SAV=/pfad/ZA8831_v1-3-0.sav Rscript sitzung10-zahlen.R
# Bricht mit Fehler ab, sobald eine Zahl nicht zum Plan (sitzung10.md) passt.
# Vorlagen stehen hier wörtlich wie im Plan; ⟦…⟧ markiert anzupassende Stellen.
# Jede Vorlage läuft in einer frischen Umgebung, in der nur `allbus` (frisch eingelesen) existiert,
# so wie in der Code-Werkstatt; einmal so, wie sie dasteht, und, wo es eine Änderung gibt, gelöst.

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

# Ordner dieses Skripts (für den Abgleich mit sitzung10.md)
.args <- commandArgs(trailingOnly = FALSE)
.datei <- sub("^--file=", "", .args[grepl("^--file=", .args)])
.ordner <- if (length(.datei)) dirname(normalizePath(.datei)) else getwd()
.plan <- paste(readLines(file.path(.ordner, "sitzung10.md"), encoding = "UTF-8"), collapse = "\n")

# ---------------------------------------------------------------------------------------------
# Hilfsfunktionen
# ---------------------------------------------------------------------------------------------
ok <- function(name, ist, soll, tol = 0) {
  if (length(ist) != 1 || is.na(ist) || abs(ist - soll) > tol + 1e-9) {
    stop(sprintf("%s: ist %s, soll %s", name, paste(ist, collapse = "/"), soll))
  }
  cat(sprintf("  ok  %-72s %s\n", name, format(soll, big.mark = ".", decimal.mark = ",")))
}
abschnitt <- function(t) cat("\n==== ", t, " ====\n", sep = "")

# Prüft, ob eine Zeile der Ausgabe alle Stücke in dieser Reihenfolge enthält (Leerraum dazwischen egal)
zeile <- function(text, ...) {
  text <- gsub("|", " ", text, fixed = TRUE)
  teile <- c(...)
  muster <- paste(vapply(teile, function(s) gsub("([][{}()+*^$|\\\\?.])", "\\\\\\1", s), ""),
                  collapse = "\\s+")
  if (!any(grepl(muster, text, perl = TRUE))) {
    stop("In der Ausgabe nicht gefunden: ", paste(teile, collapse = " | "))
  }
  cat(sprintf("  ok  Zeile: %s\n", paste(teile, collapse = "  ")))
}
# Prüft, dass ein Textstück wörtlich im Plan steht
im_plan <- function(stueck) {
  if (!grepl(stueck, .plan, fixed = TRUE)) stop("Nicht wörtlich im Plan: ", stueck)
  cat(sprintf("  ok  im Plan: %s\n", substr(gsub("\n", " ", stueck), 1, 70)))
}

# Vorlagen: Text wie im Plan; ⟦…⟧ entfernt oder ersetzt
vorlagen <- list()
plain <- function(code) gsub("⟦|⟧", "", code)
loesen <- function(code, ersatz) {
  for (alt in names(ersatz)) code <- sub(paste0("⟦", alt, "⟧"), ersatz[[alt]], code, fixed = TRUE)
  stopifnot(!grepl("⟦", code))
  code
}
vorlage <- function(name, code) {
  im_plan(paste0("```r\n", code, "\n```"))
  vorlagen[[name]] <<- code
  code
}
# Führt Code in einer frischen Umgebung aus, in der nur `allbus` existiert (wie die Werkstatt);
# Meldungen (message) werden mit aufgefangen.
laufen <- function(name, code) {
  cat("\n---- Vorlage:", name, "----\n")
  umgebung <- new.env(parent = globalenv())
  assign("allbus", .za, envir = umgebung)
  meld <- character()
  out <- withCallingHandlers(
    capture.output({
      for (a in parse(text = code)) {
        wert <- withVisible(eval(a, envir = umgebung))
        if (wert$visible) print(wert$value)
      }
    }),
    message = function(m) { meld <<- c(meld, conditionMessage(m)); invokeRestart("muffleMessage") }
  )
  out <- c(meld, out)
  cat(out, sep = "\n")
  invisible(out)
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
num <- function(x) as.numeric(x)
# B aus einem Modell (ungerundet)
koef <- function(m, term) unname(coef(m)[term])

# Zeilen von summary() einer Formel auf einem vorbereiteten Datensatz
ausgabe <- function(daten, formel) capture.output(print(summary(linear_regression(daten, formel, weights = wghtpew))))

# =============================================================================================
abschnitt("Vorweg: R lesen")
# =============================================================================================
start <- vorlage("start", '# Pakete laden und Daten einlesen
library(tidyverse)
library(mariposa)

allbus <- read_spss("ZA8831_v1-3-0.sav")')
stopifnot(nrow(read_spss(pfad)) == 5246)

r_modell <- vorlage("r_modell", '# Lebenszufriedenheit aus Alter und Gesundheit (gesund umgepolt: höher = gesünder)
allbus %>%
  mutate(
    gesund = rec(hs01, rules = "rev")
  ) %>%
  linear_regression(ls01 ~ age + gesund, weights = wghtpew) %>%
  summary()')
txt <- laufen("r_modell", r_modell)
zeile(txt, "Weighted Linear Regression Results")
zeile(txt, "- Formula: ls01 ~ age + gesund")
zeile(txt, "- N: 5128")
zeile(txt, "- Weights: wghtpew")
zeile(txt, "ls01", "7.407", "1.919", "5128")
zeile(txt, "age", "52.032", "18.212", "5128")
zeile(txt, "gesund", "3.573", "1.012", "5128")
zeile(txt, "R", "0.436")
zeile(txt, "R Square", "0.190")
zeile(txt, "Adjusted R Square", "0.190")
zeile(txt, "Std. Error of the Estimate", "1.728")
zeile(txt, "(Intercept)", "3.095", "0.135", "22.854", "<.001", "2.830", "3.361", "***")
zeile(txt, "age", "0.024", "0.001", "0.225", "16.931", "<.001", "0.021", "0.026", "***")
zeile(txt, "gesund", "0.861", "0.025", "0.454", "34.124", "<.001", "0.811", "0.910", "***")
zeile(txt, "age", "0.893", "1.120")
zeile(txt, "gesund", "0.893", "1.120")
zeile(txt, "VIF > 10 (Tolerance < 0.1) indicates problematic collinearity.")
# Die Notiz im Kopf, wörtlich wie im Bild R2
notiz <- grep("Note:", txt, value = TRUE)
cat("  Notiz:", notiz, "\n")
im_plan(trimws(notiz))
im_plan(trimws(grep("Use to_label", txt, value = TRUE)))
# Reihenfolge der Prädiktoren egal
txt2 <- capture.output(print(summary(linear_regression(.za %>% mutate(gesund = rec(hs01, rules = "rev")),
  ls01 ~ gesund + age, weights = wghtpew))))
zeile(txt2, "age", "0.024", "0.001", "0.225")
zeile(txt2, "gesund", "0.861", "0.025", "0.454")

# Komma statt Plus: kein Fehler, aber nur ein Prädiktor
d_a1 <- .za %>% mutate(demo = rec(ps03, rules = "rev"), lage = rec(ep03, rules = "rev"), dlage = rec(ep01, rules = "rev"))
txt <- capture.output(print(d_a1 %>% linear_regression(demo ~ lage, dlage, weights = wghtpew)))
zeile(txt, "Linear Regression: demo ~ lage [Weighted]")

r_dummy <- vorlage("r_dummy", '# Aus dem Familienstand fünf 0/1-Variablen machen, eine davon auszählen
allbus %>%
  to_dummy(mstat) %>%
  frequency(mstat_1, weights = wghtpew)')
txt <- laufen("r_dummy", r_dummy)
zeile(txt, "0", "2343", "44.67", "45.01")
zeile(txt, "1", "2863", "54.58", "54.99")
zeile(txt, "System", "40")
stopifnot(all(paste0("mstat_", 1:5) %in% names(to_dummy(.za, mstat))))
cat("  ok  to_dummy(mstat) bildet mstat_1 bis mstat_5\n")

# =============================================================================================
abschnitt("Grundlage 1: Alter, Gesundheit, konstant halten")
# =============================================================================================
g <- .za %>% mutate(gesund = rec(hs01, rules = "rev"))
txt <- ausgabe(g, ls01 ~ age)
zeile(txt, "- N: 5142")
zeile(txt, "age", "0.008", "0.001", "0.075")
zeile(txt, "R Square", "0.006")
m_age <- linear_regression(g, ls01 ~ age, weights = wghtpew)
m_ag <- linear_regression(g, ls01 ~ age + gesund, weights = wghtpew)
ok("B Alter allein (ungerundet, 4 Stellen)", round(koef(m_age, "age"), 4), 0.0079)
ok("B Alter mit Gesundheit (ungerundet, 4 Stellen)", round(koef(m_ag, "age"), 4), 0.0237)
ok("dreimal so groß: 0,024 / 0,008", 0.024 / 0.008, 3)

# Bild B1: Mittelwerte je Altersgruppe, gesamt und je Gesundheitsgruppe (gleiche Personen)
b1 <- .za %>%
  transmute(ls01 = num(ls01), age = num(age), hs01 = num(hs01), w = num(wghtpew)) %>%
  filter(!is.na(ls01), !is.na(age), !is.na(hs01)) %>%
  mutate(
    ag = cut(age, c(17, 29, 44, 59, 74, 120), labels = c("18-29", "30-44", "45-59", "60-74", "75+")),
    gg = case_when(hs01 <= 2 ~ "gut", hs01 == 3 ~ "mittel", hs01 >= 4 ~ "schlecht")
  )
alle <- b1 %>% group_by(ag) %>% summarise(m = round(weighted.mean(ls01, w), 2))
print(alle)
soll_alle <- c(7.15, 7.33, 7.36, 7.55, 7.65)
for (i in 1:5) ok(paste("B1 alle,", alle$ag[i]), alle$m[i], soll_alle[i])
ok("B1 alle: Anstieg", soll_alle[5] - soll_alle[1], 0.50)
je <- b1 %>% group_by(gg, ag) %>% summarise(m = round(weighted.mean(ls01, w), 2), n = n(), .groups = "drop")
soll_je <- list(gut = c(7.56, 7.76, 7.94, 8.24, 8.41),
                mittel = c(6.25, 6.59, 7.05, 7.42, 7.74),
                schlecht = c(4.78, 5.26, 5.71, 6.01, 6.73))
for (k in names(soll_je)) {
  ist <- je %>% filter(gg == k) %>% pull(m)
  for (i in 1:5) ok(paste("B1", k, levels(b1$ag)[i]), ist[i], soll_je[[k]][i])
}
ok("B1 Anstieg gut", 8.41 - 7.56, 0.85)
ok("B1 Anstieg mittel", 7.74 - 6.25, 1.49)
ok("B1 Anstieg schlecht", 6.73 - 4.78, 1.95)
ok("B1 kleinste Zelle (18-29, schlecht)", min(je$n), 46)
stopifnot(je$n[je$gg == "schlecht" & je$ag == "18-29"] == 46)
# Anteile je Altersgruppe, nach größten Resten auf 100
anteile <- b1 %>% group_by(ag) %>%
  summarise(gut = 100 * sum(w * (gg == "gut")) / sum(w), mittel = 100 * sum(w * (gg == "mittel")) / sum(w),
            schlecht = 100 * sum(w * (gg == "schlecht")) / sum(w))
groesste_reste <- function(x) { f <- floor(x); r <- 100 - sum(f); f[order(x - f, decreasing = TRUE)[seq_len(r)]] <- f[order(x - f, decreasing = TRUE)[seq_len(r)]] + 1; f }
soll_ant <- list(c(76, 17, 7), c(73, 19, 8), c(57, 28, 15), c(48, 34, 18), c(29, 42, 29))
for (i in 1:5) {
  ist <- groesste_reste(unlist(anteile[i, 2:4]))
  if (!identical(as.numeric(ist), soll_ant[[i]])) stop("B1 Anteile ", i, ": ", paste(ist, collapse = "/"))
  cat(sprintf("  ok  B1 Anteile %s: %s\n", anteile$ag[i], paste(ist, collapse = " | ")))
}

# Bild B2: Vorhersagen mit den gedruckten Zahlen
ok("B2 Frau A (40, gesund 4)", round(3.095 + 0.024 * 40 + 0.861 * 4, 2), 7.50)
ok("B2 Herr B (50, gesund 4)", round(3.095 + 0.024 * 50 + 0.861 * 4, 2), 7.74)
ok("B2 Unterschied", round(0.024 * 10, 2), 0.24)
ok("Kurz überlegen 1b: 2 Stufen", 2 * 0.861, 1.722)
ok("Gesundheit 36-mal so groß (gerundet)", round(0.861 / 0.024), 36)

# =============================================================================================
abschnitt("Aufgabe 1: demo ~ lage (+ dlage)")
# =============================================================================================
a1 <- vorlage("a1", '# Demokratiezufriedenheit aus der eigenen wirtschaftlichen Lage
# umgepolt, damit höher = zufriedener bzw. besser (dlage brauchst du in Schritt 2)
allbus %>%
  mutate(
    demo  = rec(ps03, rules = "rev"),
    lage  = rec(ep03, rules = "rev"),
    dlage = rec(ep01, rules = "rev")
  ) %>%
  linear_regression(demo ~ ⟦lage⟧, weights = wghtpew) %>%
  summary()')
stopifnot(grepl("⟦lage⟧", strsplit(a1, "\n")[[1]][9], fixed = TRUE))
txt <- laufen("a1 wie sie dasteht", plain(a1))
zeile(txt, "- Formula: demo ~ lage")
zeile(txt, "- N: 3603")
zeile(txt, "R Square", "0.084")
zeile(txt, "(Intercept)", "2.500")
zeile(txt, "lage", "0.461", "0.025", "0.290")
txt <- laufen("a1 gelöst", loesen(a1, list(lage = "lage + dlage")))
zeile(txt, "- Formula: demo ~ lage + dlage")
zeile(txt, "- N: 3589")
zeile(txt, "R Square", "0.228")
zeile(txt, "lage", "0.198", "0.025", "0.124")
zeile(txt, "dlage", "0.668", "0.026", "0.415")
zeile(txt, "lage", "0.844", "1.185")
ok("Rückgang auf weniger als die Hälfte", as.numeric(0.198 < 0.461 / 2), 1)
# ungewichtete Fälle, die zwischen den Modellen wegfallen (nur zur Information)
n1 <- d_a1 %>% filter(!is.na(demo), !is.na(lage)) %>% nrow()
n2 <- d_a1 %>% filter(!is.na(demo), !is.na(lage), !is.na(dlage)) %>% nrow()
cat(sprintf("  Info: gezählt %d bzw. %d Befragte\n", n1, n2))

frei_a1 <- vorlage("frei_a1", '# Eine Idee: Kommt die erwartete Lage Deutschlands in einem Jahr noch dazu?
# demo, lage und dlage wie in Aufgabe 1, dazu zukunft (ep04 umgepolt: höher = besser)
allbus %>%
  mutate(
    demo    = rec(ps03, rules = "rev"),
    lage    = rec(ep03, rules = "rev"),
    dlage   = rec(ep01, rules = "rev"),
    zukunft = rec(ep04, rules = "rev")
  ) %>%
  linear_regression(demo ~ lage + dlage + zukunft, weights = wghtpew) %>%
  summary()')
txt <- laufen("frei_a1", frei_a1)
zeile(txt, "- N: 3565")
zeile(txt, "R Square", "0.270")
zeile(txt, "Adjusted R Square", "0.269")
zeile(txt, "lage", "0.188"); zeile(txt, "dlage", "0.561"); zeile(txt, "zukunft", "0.312")

# =============================================================================================
abschnitt("Grundlage 2: Dummies, Referenz, Dummyfalle")
# =============================================================================================
gv <- .za %>% mutate(verheiratet = rec(mstat, rules = "1=1 [verheiratet]; 2:5=0 [nicht verheiratet]; else=NA"))
txt <- ausgabe(gv, ls01 ~ verheiratet)
zeile(txt, "(Intercept)", "7.042")
zeile(txt, "verheiratet", "0.652")
zeile(txt, "R Square", "0.028")
ok("2a Vorhersage Verheiratete", 7.042 + 0.652, 7.694)
mw <- .za %>% filter(!is.na(ls01), !is.na(mstat)) %>% group_by(m = num(mstat)) %>%
  summarise(mw = weighted.mean(num(ls01), num(wghtpew)), wn = sum(num(wghtpew)))
print(mw)
ok("Mittelwert verheiratet (2 Stellen)", round(mw$mw[1], 2), 7.69)
ok("Mittelwert nicht verheiratet (2 Stellen)",
   round(with(.za %>% filter(!is.na(ls01), num(mstat) %in% 2:5), weighted.mean(num(ls01), num(wghtpew))), 2), 7.04)
ok("gewichtet getrennt lebend", round(mw$wn[2]), 85)
ok("gewichtet verheiratet", round(mw$wn[1]), 2823)
ok("gewichtet ledig", round(mw$wn[5]), 1459)

gd <- .za %>% to_dummy(mstat)
# Je Referenz: Konstante und B (Reihenfolge verheiratet, getrennt, verwitwet, geschieden, ledig)
soll_ref <- list(
  `1` = c(7.695, NA, -1.085, -0.462, -0.712, -0.653),
  `2` = c(6.610, 1.085, NA, 0.623, 0.373, 0.432),
  `3` = c(7.233, 0.462, -0.623, NA, -0.250, -0.191),
  `4` = c(6.983, 0.712, -0.373, 0.250, NA, 0.059),
  `5` = c(7.042, 0.653, -0.432, 0.191, -0.059, NA)
)
for (ref in 1:5) {
  pr <- setdiff(1:5, ref)
  f <- as.formula(paste("ls01 ~", paste0("mstat_", pr, collapse = " + ")))
  txt <- ausgabe(gd, f)
  s <- soll_ref[[as.character(ref)]]
  zeile(txt, "(Intercept)", sprintf("%.3f", s[1]))
  for (j in pr) zeile(txt, paste0("mstat_", j), sprintf("%.3f", s[j + 1]))
  zeile(txt, "R Square", "0.030")
  # Vorhersagen bleiben gleich
  vorh <- s[1] + ifelse(is.na(s[-1]), 0, s[-1])
  stopifnot(all(abs(vorh - c(7.695, 6.610, 7.233, 6.983, 7.042)) <= 0.0011))
}
cat("  ok  B6: Vorhersagen 7,695 | 6,610 | 7,233 | 6,983 | 7,042 bei jeder Referenz\n")
# Dummyfalle: alle fünf Dummies
txt <- capture.output(print(summary(linear_regression(gd, ls01 ~ mstat_1 + mstat_2 + mstat_3 + mstat_4 + mstat_5,
  weights = wghtpew))), type = "message")
meldet(paste(txt, collapse = " "), "Excluded due to perfect collinearity (matching SPSS): `mstat_5`")
# Codes als Zahl
txt <- ausgabe(.za, ls01 ~ mstat)
zeile(txt, "mstat", "-0.171")
zeile(txt, "Note: labelled predictor mstat entered with its numeric codes, as SPSS REGRESSION does.")

# =============================================================================================
abschnitt("Aufgabe 2: demo nach dg03")
# =============================================================================================
a2 <- vorlage("a2", '# Demokratiezufriedenheit nach Herkunft und Wohnort
# demo wie in Aufgabe 1; to_dummy() macht aus dg03 vier 0/1-Variablen
# Referenz ist die Gruppe, die in der Formel fehlt (hier dg03_4, West-Bleibende)
allbus %>%
  mutate(
    demo = rec(ps03, rules = "rev")
  ) %>%
  to_dummy(dg03) %>%
  linear_regression(demo ~ ⟦dg03_1⟧ + dg03_2 + dg03_3, weights = wghtpew) %>%
  summary()')
stopifnot(grepl("⟦dg03_1⟧", strsplit(a2, "\n")[[1]][9], fixed = TRUE))
txt <- laufen("a2 wie sie dasteht", plain(a2))
zeile(txt, "- Formula: demo ~ dg03_1 + dg03_2 + dg03_3")
zeile(txt, "- N: 3222")
zeile(txt, "demo", "4.122", "1.283", "3222")
zeile(txt, "R Square", "0.041")
zeile(txt, "(Intercept)", "4.243", "0.025")
zeile(txt, "dg03_1", "-0.705", "0.060", "-0.202", "-11.658", "<.001", "-0.824", "-0.587")
zeile(txt, "dg03_2", "-0.166", "0.121", "-0.024", "-1.365", ".172", "-0.404", "0.072")
zeile(txt, "dg03_3", "-0.034", "0.179", "-0.003", "-0.189", ".850", "-0.385", "0.317")
stopifnot(!any(grepl("Note:", txt)))
cat("  ok  keine Notiz bei Dummies aus to_dummy()\n")
a2_rechnen <- vorlage("a2_rechnen", '# Vorhersage einer Gruppe: Konstante plus B ihres Dummys
# (hier noch das Beispiel aus Grundlage 2a: Verheiratete)
⟦7.042⟧ + ⟦0.652⟧')
txt <- laufen("a2_rechnen wie sie dasteht", plain(a2_rechnen))
zeile(txt, "[1] 7.694")
txt <- laufen("a2_rechnen gelöst", loesen(a2_rechnen, list("7.042" = "4.243", "0.652" = "-0.166")))
zeile(txt, "[1] 4.077")
txt <- laufen("a2_rechnen gelöst, Referenz Ost", loesen(a2_rechnen, list("7.042" = "3.537", "0.652" = "0.540")))
zeile(txt, "[1] 4.077")
txt <- laufen("a2 gelöst", loesen(a2, list(dg03_1 = "dg03_4")))
zeile(txt, "- Formula: demo ~ dg03_4 + dg03_2 + dg03_3")
zeile(txt, "(Intercept)", "3.537")
zeile(txt, "dg03_4", "0.705")
zeile(txt, "dg03_2", "0.540")
zeile(txt, "dg03_3", "0.671")
ok("a2f Vorhersage Ost→West mit Referenz Ost", 3.537 + 0.540, 4.077)
# gezählte Gruppen mit Demokratiefrage
tab <- table(num(.za$dg03[!is.na(.za$ps03)]))
ok("gezählt Ost-Bleibende", tab[["1"]], 1003)
ok("gezählt Ost→West", tab[["2"]], 91)
ok("gezählt West→Ost", tab[["3"]], 97)
ok("gezählt West-Bleibende", tab[["4"]], 2063)
ok("gezählt zusammen", sum(tab), 3254)
# Dummyfalle mit dg03
txt <- capture.output(print(linear_regression(.za %>% mutate(demo = rec(ps03, rules = "rev")) %>% to_dummy(dg03),
  demo ~ dg03_1 + dg03_2 + dg03_3 + dg03_4, weights = wghtpew)), type = "message")
meldet(paste(txt, collapse = " "), "Excluded due to perfect collinearity (matching SPSS): `dg03_4`")

frei_a2 <- vorlage("frei_a2", '# Eine Idee: das Abitur konstant halten (Modell wie in Aufgabe 2, dazu abitur)
allbus %>%
  mutate(
    demo   = rec(ps03, rules = "rev"),
    abitur = rec(educ, rules = "1:3=0 [kein Abitur]; 4:5=1 [Abitur]; else=NA")
  ) %>%
  to_dummy(dg03) %>%
  linear_regression(demo ~ dg03_1 + dg03_2 + dg03_3 + abitur, weights = wghtpew) %>%
  summary()')
txt <- laufen("frei_a2", frei_a2)
zeile(txt, "(Intercept)", "4.017")
zeile(txt, "dg03_1", "-0.666"); zeile(txt, "dg03_2", "-0.135"); zeile(txt, "dg03_3", "-0.170")
zeile(txt, "abitur", "0.465")
zeile(txt, "R Square", "0.075")

# =============================================================================================
abschnitt("Grundlage 3: Beta, korrigiertes R², Multikollinearität")
# =============================================================================================
ok("B8 Alter pro SD (ungerundetes B)", round(koef(m_ag, "age") * 18.212, 2), 0.43)
ok("B8 Gesundheit pro SD", round(0.861 * 1.012, 2), 0.87)
ok("B9 Beta Gesundheit nachgerechnet", round(0.861 * 1.012 / 1.919, 3), 0.454)
ok("Beta Alter mit gerundetem B", round(0.024 * 18.212 / 1.919, 3), 0.228)
ok("ungerundetes B Alter", round(koef(m_ag, "age"), 4), 0.0237)

# B10: konstruiertes Beispiel, 30 Befragte, Würfel als Prädiktoren
set.seed(107)
n <- 30
gesundheit <- sample(1:5, n, replace = TRUE, prob = c(.07, .15, .25, .33, .2))
zufriedenheit <- round(pmin(10, pmax(0, 4.6 + 0.75 * gesundheit + rnorm(n, 0, 1.6))))
wuerfel <- matrix(sample(1:6, n * 4, replace = TRUE), n, 4)
r2 <- sapply(0:4, function(k) {
  d <- data.frame(zufriedenheit, gesundheit, wuerfel[, seq_len(k), drop = FALSE])
  s <- summary(lm(zufriedenheit ~ ., d))
  c(s$r.squared, s$adj.r.squared)
})
soll_r2 <- c(0.27, 0.28, 0.29, 0.30, 0.31)
soll_korr <- c(0.25, 0.23, 0.21, 0.19, 0.17)
for (k in 0:4) {
  ok(sprintf("B10 %d Würfel: R²", k), round(r2[1, k + 1], 2), soll_r2[k + 1])
  ok(sprintf("B10 %d Würfel: korrigiertes R²", k), round(r2[2, k + 1], 2), soll_korr[k + 1])
}
ok("B11 Formel: 1 - (1 - 0,31) * 29 / 24", round(1 - (1 - 0.31) * 29 / 24, 2), 0.17)
ok("B11 Bruch 29 / 24", round(29 / 24, 2), 1.21)
ok("B11 ALLBUS: 1 - 0,810 * 5127 / 5125", round(1 - 0.810 * 5127 / 5125, 3), 0.190)
ok("Prüf dich 4: n = 40, k = 8, R² 0,30", round(1 - 0.70 * 39 / 31, 2), 0.12)

# B12: Alter und Altersgruppe
txt <- ausgabe(g, ls01 ~ age + agec + gesund)
zeile(txt, "age", "0.016", "0.006", "0.149", "2.724", ".006")
zeile(txt, "agec", "0.121", "0.084", "0.078", "1.431", ".153")
zeile(txt, "gesund", "0.862", "0.025", "0.455")
zeile(txt, "age", "0.053", "18.995")
zeile(txt, "agec", "0.053", "18.963")
zeile(txt, "gesund", "0.892", "1.121")
ok("Standardfehler sechsmal so groß", round(0.006 / 0.001), 6)
txt <- ausgabe(g, ls01 ~ agec + gesund)
zeile(txt, "agec", "0.344", "0.020", "0.223", "16.763", "<.001")
zeile(txt, "agec", "0.894", "1.118")

# =============================================================================================
abschnitt("Aufgabe 3: vier Prädiktoren, Beta, korrigiertes R², VIF")
# =============================================================================================
a3 <- vorlage("a3", '# Demokratiezufriedenheit aus vier Prädiktoren
# demo, lage und dlage wie in Aufgabe 1; ost und abitur als 0/1-Variablen
allbus %>%
  mutate(
    demo   = rec(ps03, rules = "rev"),
    lage   = rec(ep03, rules = "rev"),
    dlage  = rec(ep01, rules = "rev"),
    ost    = rec(eastwest, rules = "1=0 [West]; 2=1 [Ost]"),
    abitur = rec(educ, rules = "1:3=0 [kein Abitur]; 4:5=1 [Abitur]; else=NA")
  ) %>%
  linear_regression(demo ~ lage + dlage + ost + abitur, weights = wghtpew) %>%
  summary()')
txt <- laufen("a3", a3)
zeile(txt, "- Formula: demo ~ lage + dlage + ost + abitur")
zeile(txt, "- N: 3503")
zeile(txt, "ost", "0.170", "0.375", "3503")
zeile(txt, "R Square", "0.259")
zeile(txt, "Adjusted R Square", "0.258")
zeile(txt, "(Intercept)", "1.557")
zeile(txt, "lage", "0.176", "0.025", "0.110")
zeile(txt, "dlage", "0.635", "0.026", "0.394")
zeile(txt, "ost", "-0.521", "0.050", "-0.154")
zeile(txt, "abitur", "0.216", "0.038", "0.085")
zeile(txt, "lage", "0.835", "1.198")
zeile(txt, "dlage", "0.828", "1.208")
zeile(txt, "ost", "0.995", "1.005")
zeile(txt, "abitur", "0.948", "1.055")

a3_ost <- vorlage("a3_ost", '# Zum Vergleich: der Ost-West-Unterschied ohne weitere Prädiktoren
# demo wie in Aufgabe 1, ost wie oben
allbus %>%
  mutate(
    demo = rec(ps03, rules = "rev"),
    ost  = rec(eastwest, rules = "1=0 [West]; 2=1 [Ost]")
  ) %>%
  linear_regression(demo ~ ⟦ost⟧, weights = wghtpew) %>%
  summary()')
stopifnot(grepl("⟦ost⟧", strsplit(a3_ost, "\n")[[1]][8], fixed = TRUE))
txt <- laufen("a3_ost", plain(a3_ost))
zeile(txt, "(Intercept)", "4.265")
zeile(txt, "ost", "-0.624", "0.056", "-0.183")
zeile(txt, "R Square", "0.034")
ok("Anteil der Lücke, der bleibt (2 Stellen)", round(0.521 / 0.624, 2), 0.83)

frei_a3 <- vorlage("frei_a3", '# Eine Idee: dasselbe Modell ohne die Lage Deutschlands (dlage)
allbus %>%
  mutate(
    demo   = rec(ps03, rules = "rev"),
    lage   = rec(ep03, rules = "rev"),
    ost    = rec(eastwest, rules = "1=0 [West]; 2=1 [Ost]"),
    abitur = rec(educ, rules = "1:3=0 [kein Abitur]; 4:5=1 [Abitur]; else=NA")
  ) %>%
  linear_regression(demo ~ lage + ost + abitur, weights = wghtpew) %>%
  summary()')
txt <- laufen("frei_a3", frei_a3)
zeile(txt, "R Square", "0.131"); zeile(txt, "Adjusted R Square", "0.130")
zeile(txt, "lage", "0.408"); zeile(txt, "ost", "-0.573"); zeile(txt, "abitur", "0.348")

# =============================================================================================
abschnitt("Grundlage 4: Einfluss (konstruiert) und Interaktion")
# =============================================================================================
x <- c(22, 28, 33, 38, 44, 49, 53, 58, 63, 68, 74)
y <- c(6, 8, 6, 7, 8, 6, 8, 7, 8, 7, 8)
gerade <- function(xx, yy) round(coef(lm(yy ~ xx)), c(2, 3))
e0 <- gerade(x, y); e1 <- gerade(c(x, 48), c(y, 1)); e2 <- gerade(c(x, 95), c(y, 1)); e3 <- gerade(c(x, 95), c(y, 8))
ok("B13 ohne L: Konstante", e0[[1]], 6.14); ok("B13 ohne L: B", e0[[2]], 0.022)
ok("B13 L Mitte: Konstante", e1[[1]], 5.61); ok("B13 L Mitte: B", e1[[2]], 0.022)
ok("B13 L Rand weit weg: Konstante", e2[[1]], 8.85); ok("B13 L Rand weit weg: B", e2[[2]], -0.042)
ok("B13 L Rand auf Gerade: Konstante", e3[[1]], 6.21); ok("B13 L Rand auf Gerade: B", e3[[2]], 0.020)

gi <- .za %>% mutate(
  erwerb = rec(work, rules = "1:3=1 [erwerbstätig]; 4=0 [nicht erwerbstätig]; else=NA"),
  ab60   = rec(age, rules = "18:59=0 [unter 60]; 60:max=1 [60 und älter]; else=NA")
)
txt <- ausgabe(gi, ls01 ~ erwerb * ab60)
zeile(txt, "(Intercept)", "6.339")
zeile(txt, "erwerb", "1.091")
zeile(txt, "ab60", "1.233")
zeile(txt, "erwerb:ab60", "-1.035", "0.140", "-0.165", "-7.378", "<.001")
ok("4b Abstand ab 60", 1.091 - 1.035, 0.056)
zellen <- .za %>% transmute(ls01 = num(ls01), work = num(work), age = num(age), w = num(wghtpew)) %>%
  filter(!is.na(ls01), !is.na(work), !is.na(age)) %>%
  group_by(ab60 = age >= 60, erw = work <= 3) %>% summarise(m = round(weighted.mean(ls01, w), 2), .groups = "drop")
print(zellen)
ok("B14 unter 60, nicht erwerbstätig", zellen$m[1], 6.34)
ok("B14 unter 60, erwerbstätig", zellen$m[2], 7.43)
ok("B14 ab 60, nicht erwerbstätig", zellen$m[3], 7.57)
ok("B14 ab 60, erwerbstätig", zellen$m[4], 7.63)

# =============================================================================================
abschnitt("Aufgabe 4 (Zusatz): demo ~ ost * abitur")
# =============================================================================================
a4 <- vorlage("a4", '# Ost-West-Unterschied und Abitur
# demo wie in Aufgabe 1, ost und abitur wie in Aufgabe 3
allbus %>%
  mutate(
    demo   = rec(ps03, rules = "rev"),
    ost    = rec(eastwest, rules = "1=0 [West]; 2=1 [Ost]"),
    abitur = rec(educ, rules = "1:3=0 [kein Abitur]; 4:5=1 [Abitur]; else=NA")
  ) %>%
  linear_regression(demo ~ ost ⟦+⟧ abitur, weights = wghtpew) %>%
  summary()')
stopifnot(grepl("⟦+⟧", strsplit(a4, "\n")[[1]][9], fixed = TRUE))
txt <- laufen("a4 wie sie dasteht", plain(a4))
zeile(txt, "- Formula: demo ~ ost + abitur")
zeile(txt, "ost", "-0.604"); zeile(txt, "abitur", "0.460")
txt <- laufen("a4 gelöst", loesen(a4, list("+" = "*")))
zeile(txt, "- Formula: demo ~ ost * abitur")
zeile(txt, "(Intercept)", "4.042")
zeile(txt, "ost", "-0.631", "0.074")
zeile(txt, "abitur", "0.450", "0.045")
zeile(txt, "ost:abitur", "0.060", "0.111", "0.012", "0.539", ".590", "-0.158", "0.277")
zeile(txt, "R Square", "0.067")
a4_rechnen <- vorlage("a4_rechnen", '# Unterschied in der zweiten Gruppe: B des Prädiktors plus B der Interaktion
# (hier noch das Beispiel aus Grundlage 4b: Erwerbstätige ab 60)
⟦1.091⟧ + ⟦-1.035⟧')
txt <- laufen("a4_rechnen wie sie dasteht", plain(a4_rechnen))
zeile(txt, "[1] 0.056")
txt <- laufen("a4_rechnen gelöst", loesen(a4_rechnen, list("1.091" = "-0.631", "-1.035" = "0.060")))
zeile(txt, "[1] -0.571")

frei_a4 <- vorlage("frei_a4", '# Eine Idee: Ist der Ost-West-Unterschied bei Menschen, die sich links einstufen, anders?
# links: pa01 1 bis 4 = links, 5 bis 10 = Mitte oder rechts
allbus %>%
  mutate(
    demo  = rec(ps03, rules = "rev"),
    ost   = rec(eastwest, rules = "1=0 [West]; 2=1 [Ost]"),
    links = rec(pa01, rules = "1:4=1 [links]; 5:10=0 [Mitte oder rechts]; else=NA")
  ) %>%
  linear_regression(demo ~ ost * links, weights = wghtpew) %>%
  summary()')
txt <- laufen("frei_a4", frei_a4)
zeile(txt, "(Intercept)", "4.128")
zeile(txt, "ost", "-0.757"); zeile(txt, "links", "0.411")
zeile(txt, "ost:links", "0.286", "0.113", "0.059", "2.535", ".011")
ok("Lücke bei Links-Eingestuften", -0.757 + 0.286, -0.471)
# Gesperrte Alternative (E3): ost × ab60 wäre signifikant
txt <- ausgabe(.za %>% mutate(demo = rec(ps03, rules = "rev"), ost = rec(eastwest, rules = "1=0 [West]; 2=1 [Ost]"),
  ab60 = rec(age, rules = "18:59=0; 60:max=1; else=NA")), demo ~ ost * ab60)
zeile(txt, "ost:ab60", "-0.317")

# =============================================================================================
abschnitt("Nachgetragen bei der Prüfung (23.11.2026)")
# =============================================================================================
ok("a4c Abitur-Abstand im Osten: 0,450 + 0,060", 0.450 + 0.060, 0.510)
ok("a4c Lücke höchstens kleiner um (KI oben, 2 Stellen)", round(0.277, 2), 0.28)
ok("a4c Lücke höchstens größer um (KI unten, 2 Stellen)", round(0.158, 2), 0.16)
m_a4 <- linear_regression(.za %>% mutate(demo = rec(ps03, rules = "rev"),
  ost = rec(eastwest, rules = "1=0 [West]; 2=1 [Ost]"),
  abitur = rec(educ, rules = "1:3=0 [kein Abitur]; 4:5=1 [Abitur]; else=NA")), demo ~ ost * abitur, weights = wghtpew)
ok("a4c Abitur-Abstand im Osten ungerundet (3 Stellen)",
   round(koef(m_a4, "abitur") + koef(m_a4, "ost:abitur"), 3), 0.510)
# B6-Fußnote: Konstante 7,042 in 2a (alle Nicht-Verheirateten) und mit Referenz ledig: Zufall, 4. Stelle verschieden
m_nv <- with(mw %>% filter(m %in% 2:5), sum(mw * wn) / sum(wn))
ok("2a Mittelwert Nicht-Verheiratete (3 Stellen)", round(m_nv, 3), 7.042)
ok("Ledige (3 Stellen)", round(mw$mw[5], 3), 7.042)
stopifnot(round(m_nv, 4) != round(mw$mw[5], 4))
cat("  ok  Nicht-Verheiratete und Ledige unterscheiden sich in der 4. Stelle\n")
# 2b: KI mit Referenz getrennt lebend viel breiter als mit Referenz verheiratet
breite <- function(ref) {
  pr <- setdiff(1:5, ref)
  m <- linear_regression(gd, as.formula(paste("ls01 ~", paste0("mstat_", pr, collapse = " + "))), weights = wghtpew)
  ci <- confint(m)[-1, ]
  mean(ci[, 2] - ci[, 1])
}
stopifnot(breite(2) > 1.5 * breite(1))
cat(sprintf("  ok  mittlere KI-Breite: Referenz getrennt %.2f, Referenz verheiratet %.2f\n", breite(2), breite(1)))
# A1: Demokratiefrage an etwa zwei Drittel (Rest TNZ: SPLIT, Code -11)
roh <- haven::read_sav(pfad, user_na = TRUE)
n_split <- sum(as.numeric(roh$ps03) == -11)
ok("ps03 TNZ: SPLIT", n_split, 1596)
ok("Anteil mit Demokratiefrage (Prozent, gerundet)", round(100 * (1 - n_split / nrow(roh))), 70)
# Antwortprüfung: kein Sonderfall liegt innerhalb der Toleranz seines Zielwerts
sonder <- tribble(
  ~id,   ~ziel,  ~tol,   ~sonderfall,
  "a1a",  0.461, 0.005,  c(2.5, 0.29),
  "a1b",  0.198, 0.005,  c(0.461),
  "a1c",  0.668, 0.005,  c(0.415),
  "a1d",  0.228, 0.005,  c(0.084),
  "a2a",  4.243, 0.005,  c(4.122, 3.537),
  "a2b", -0.705, 0.005,  c(0.705, -0.202),
  "a2c",  4.077, 0.01,   c(-0.166),
  "a2f",  3.537, 0.005,  c(4.243),
  "a3b",  0.110, 0.002,  c(0.176),
  "a3d",  0.258, 0.0004, c(0.259),
  "a3f", -0.624, 0.005,  c(-0.521),
  "a4a",  0.060, 0.005,  c(0.012),
  "a4b", -0.571, 0.01,   c(-0.604, -0.631),
  "k1b",  1.722, 0.01,   c(0.861),
  "k2a",  7.694, 0.01,   c(0.652),
  "k2b", -0.653, 0.005,  c(0.653),
  "k4b",  0.056, 0.01,   c(1.091)
)
for (i in seq_len(nrow(sonder))) {
  if (any(abs(sonder$sonderfall[[i]] - sonder$ziel[i]) <= sonder$tol[i] + 1e-9)) stop("Sonderfall in Toleranz: ", sonder$id[i])
}
cat("  ok  kein Sonderfall innerhalb der Toleranz (", nrow(sonder), "Fragen )\n")
im_plan("| a3d | number | Wie groß ist das korrigierte R² (Adjusted R Square)? | – | 0.258 | 0.0004 |")
im_plan("haben nur etwa zwei Drittel der Befragten bekommen")

# =============================================================================================
abschnitt("Überblick und Selbsttest")
# =============================================================================================
ok("Prüf dich 2: 7,042 - 0,059", 7.042 - 0.059, 6.983)

# =============================================================================================
abschnitt("Hilfe bei R-Fehlermeldungen")
# =============================================================================================
meldet(meldung('allbus %>% linear_regression(demo ~ lage, weights = wghtpew)'),
       "Variables not found in data: `demo` and `lage`.")
meldet(meldung('allbus %>% mutate(demo = rec(ps03, rules = "rev")) %>% to_dummy(dg03) %>%
  linear_regression(demo ~ dg03_5 + dg03_2, weights = wghtpew)'), "Variable not found in data: `dg03_5`.")
meldet(meldung('allbus %>% mutate(demo = rec(ps03, rules = "rev")) %>%
  linear_regression(demo ~ dg03_1 + dg03_2, weights = wghtpew)'), "Variables not found in data: `dg03_1` and `dg03_2`.")
meldet(meldung('allbus %>% mutate(demo = rec(ps03, rules = "rev"), lage = rec(ep03, rules = "rev"),
  dlage = rec(ep01, rules = "rev")) %>% linear_regression(demo ~ lage %>% dlage, weights = wghtpew)'),
  "konnte Funktion \"dlage\" nicht finden")
meldet(meldung('allbus %>% linear_regression(ls01 ~ age + , weights = wghtpew)'), "Unerwartete(s) ','")
meldet(meldung('allbus %>% linear_regresion(ls01 ~ age, weights = wghtpew)'),
       "konnte Funktion \"linear_regresion\" nicht finden")
txt <- capture.output(print(.za %>% linear_regression(ls01 ~ age) %>% summary()))
zeile(txt, "Linear Regression Results")
stopifnot(!any(grepl("Weighted", txt)))
cat("  ok  ohne weights: Kopf ohne „Weighted“\n")

# =============================================================================================
abschnitt("Skript zum Mitnehmen (sitzung10.R) am Stück")
# =============================================================================================
skript <- paste(
  "# Sitzung 10: Regression vertiefen\n# ALLBUS 2023, gewichtet mit wghtpew",
  start,
  "# --- R lesen ---", r_modell, r_dummy,
  "# --- Aufgabe 1 ---\n# Schritt 1 mit demo ~ lage, Schritt 2 mit demo ~ lage + dlage",
  loesen(a1, list(lage = "lage + dlage")),
  "# --- Aufgabe 2 ---", plain(a2),
  loesen(a2_rechnen, list("7.042" = "4.243", "0.652" = "-0.166")),
  "# Referenz Ost-Bleibende: dg03_1 fehlt", loesen(a2, list(dg03_1 = "dg03_4")),
  loesen(a2_rechnen, list("7.042" = "3.537", "0.652" = "0.540")),
  "# --- Aufgabe 3 ---", a3, plain(a3_ost),
  "# --- Aufgabe 4 (Zusatz) ---", loesen(a4, list("+" = "*")),
  loesen(a4_rechnen, list("1.091" = "-0.631", "-1.035" = "0.060")),
  "# --- Ideen zum Weiterdenken ---", frei_a1, frei_a2, frei_a3, frei_a4,
  sep = "\n\n"
)
# Startblock: read_spss mit echtem Pfad, sonst unverändert
skript_lauf <- sub('read_spss("ZA8831_v1-3-0.sav")', paste0('read_spss("', pfad, '")'), skript, fixed = TRUE)
umgebung <- new.env(parent = globalenv())
invisible(capture.output(suppressMessages(for (a in parse(text = skript_lauf)) eval(a, envir = umgebung))))
cat("  ok  sitzung10.R läuft am Stück ohne Fehler (", length(parse(text = skript)), "Anweisungen )\n")
stopifnot(!grepl("|>", skript, fixed = TRUE), !grepl("is.na", skript, fixed = TRUE), !grepl("ifelse", skript, fixed = TRUE))
cat("  ok  keine |>, kein is.na(), kein ifelse() im Skript\n")
# Zeilenlänge höchstens 100 (rules-Angaben ausgenommen)
lang <- strsplit(skript, "\n")[[1]]
lang <- lang[nchar(lang) > 100 & !grepl("rules =", lang)]
if (length(lang)) stop("Zeilen über 100 Zeichen: ", paste(lang, collapse = "\n"))
cat("  ok  alle Zeilen höchstens 100 Zeichen\n")

cat("\nAlle Prüfungen bestanden.\n")
