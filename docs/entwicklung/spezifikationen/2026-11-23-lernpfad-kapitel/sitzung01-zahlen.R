# Sitzung 1 „Einstieg“: alle Zahlen des Kapitels und jede Vorlage einmal ausgeführt.
# ALLBUS 2023 (ZA8831 v1.3.0), ungewichtet, nur Aggregate. mariposa 0.7.4, tidyverse 2.0.0.
# Aufruf: Rscript sitzung01-zahlen.R            (Pfad zur Datei unten oder über ALLBUS_SAV)
# Jede Zahl, die im Kapitel steht, wird hier mit stopifnot() gegen die Datei geprüft.

suppressMessages({
  library(tidyverse)
  library(mariposa)
})
pdf(NULL)

pfad <- Sys.getenv(
  "ALLBUS_SAV",
  "/Users/yannickdiehl/Documents/Universität Marburg/Lehre/Methoden Ib B.A./Methoden1bSeminarMontag/ZA8831_v1-3-0.sav"
)
allbus <- read_spss(pfad)
# Rohcodes (fehlende Werte als negative Zahlen) für eine unabhängige Gegenprüfung
roh <- haven::read_sav(pfad, user_na = TRUE)

# ---- Hilfsfunktionen ---------------------------------------------------------------
# Anzahl je Code aus den Rohdaten
n_code <- function(var, code) sum(as.numeric(roh[[var]]) == code, na.rm = TRUE)
# Zeile aus der Ausgabe von frequency() (so, wie sie in der Werkstatt erscheint)
f_zeile <- function(var, label) {
  r <- frequency(allbus, all_of(var))$results
  r$freq[r$label == label][1]
}
f_valid <- function(var) frequency(allbus, all_of(var))$stats$valid_n
treffer <- function(muster) nrow(suppressMessages(find_var(allbus, muster)))
treffer_namen <- function(muster) suppressMessages(find_var(allbus, muster))$name
zeige <- function(titel) cat("\n\n==== ", titel, " ====\n", sep = "")

# ---- Grundlage 1: ALLBUS-Steckbrief --------------------------------------------------
zeige("Grundlage 1")
n_befragte <- nrow(allbus)
n_variablen <- ncol(allbus)
stopifnot(n_befragte == 5246, n_variablen == 579)
ost <- sum(as.numeric(allbus$eastwest) == 2)
stopifnot(ost == 1679, round(100 * ost / n_befragte) == 32)
# Prüfung 23.11.: Code 2 heißt NEUE BUNDESLAENDER
stopifnot(names(attr(roh$eastwest, "labels"))[attr(roh$eastwest, "labels") == 2] == "NEUE BUNDESLAENDER")
cat("Osten:", ost, "von", n_befragte, "=", round(100 * ost / n_befragte, 1), "%\n")

# ---- Vorweg R1: die Beispielzeilen ---------------------------------------------------
zeige("Vorweg: Startblock (in RStudio; hier mit vollem Pfad)")
# Vorlage „start“ (im Kapitel: read_spss("ZA8831_v1-3-0.sav"))
allbus <- read_spss(pfad)
stopifnot(identical(dim(allbus), c(5246L, 579L)))
# Argument mit Namen: read_spss(path = ...) ist dasselbe
stopifnot(identical(dim(read_spss(path = pfad)), c(5246L, 579L)))
# Beispielzeile 2
print(find_var(allbus, "klima"))
stopifnot(identical(treffer_namen("klima"), "pi08"))

# ---- Aufgabe 1 -------------------------------------------------------------------------
zeige("A1 Schritt 2: dim")
# Vorlage a1_dim
dim(allbus)
print(dim(allbus))

zeige("A1 Schritt 3: Zellen")
# Vorlage a1_zellen, markierte Stellen mit 5246 und 579 gefüllt
zellen <- 5246 * 579

zellen

zellen / 60 / 60 / 24
print(zellen)
print(zellen / 60 / 60 / 24)
stopifnot(zellen == 3037434, round(zellen / 60 / 60 / 24) == 35)
# Unverändert ausgeführt (Marken entfernt): Befragte * Variablen -> Fehler
fehler_a1 <- tryCatch(eval(parse(text = "zellen <- Befragte * Variablen")), error = function(e) conditionMessage(e))
cat("Unverändert:", fehler_a1, "\n")
stopifnot(grepl("Befragte", fehler_a1))
# Prüfung 23.11.: wer 5.246 mit Tausenderpunkt einsetzt, bekommt etwa 0.0351 Tage (Hinweis in a1-tage)
stopifnot(round(5.246 * 579 / 60 / 60 / 24, 4) == 0.0352)

zeige("A1 Weiterdenken: names")
# Vorlage frei_a1
names(allbus)
stopifnot(length(names(allbus)) == 579, identical(names(allbus)[17:24], paste0("lm", 27:34)))
print(head(names(allbus), 30))

# ---- Grundlage 2: Suchwort-Labor -------------------------------------------------------
zeige("Grundlage 2: Suchwort-Labor")
for (w in c("bücher", "buecher", "handy", "smartphone", "tier", "internet", "klima")) {
  cat("\n> find_var(allbus, \"", w, "\")\n", sep = "")
  print(find_var(allbus, w))
}
stopifnot(
  treffer("bücher") == 0, identical(treffer_namen("buecher"), "la01"),
  treffer("handy") == 0, identical(treffer_namen("smartphone"), "lm30"),
  identical(treffer_namen("tier"), "vi01"),
  treffer("internet") == 10, identical(treffer_namen("internet"), c("xr19", "xr20", paste0("lm", 27:34))),
  treffer("sport") == 0, identical(treffer_namen("freizeit"), c("la01", "li03")),
  identical(treffer_namen("HOROSKOP"), "rh08b"),
  # Prüfung 23.11.: Genauer erklärt „fernseh“ findet FERNSEHER und FERNSEHEN
  identical(treffer_namen("fernseh"), c("lm31", "pt09"))
)

# ---- Grundlage 3: pi08 lesen ------------------------------------------------------------
zeige("Grundlage 3: frequency(allbus, pi08)")
print(frequency(allbus, pi08))
stopifnot(
  n_code("pi08", 1) == 70, n_code("pi08", 2) == 270, n_code("pi08", 3) == 1355, n_code("pi08", 4) == 1812,
  n_code("pi08", -42) == 20, n_code("pi08", -11) == 1647, n_code("pi08", -9) == 52, n_code("pi08", -8) == 20,
  f_valid("pi08") == 3507, f_zeile("pi08", "Total Missing") == 1739,
  n_befragte - n_code("pi08", -11) == 3599,
  n_befragte - 1739 == 3507
)
# Genauer erklärt: Filter und Modus
print(frequency(allbus, lm30))
print(frequency(allbus, xr19))
print(frequency(allbus, mode))
stopifnot(
  n_code("lm30", -10) == 436, f_valid("lm30") == 4799,
  n_code("xr19", -15) == 1587, sum(as.numeric(allbus$mode) == 3) == 1587
)

# ---- Aufgabe 2: Schon gefragt? -----------------------------------------------------------
zeige("A2 Idee 1")
# Vorlage a2_idee1
find_var(allbus, "horoskop")
stopifnot(identical(treffer_namen("horoskop"), "rh08b"))

zeige("A2 Idee 2")
# Vorlage a2_idee2 unverändert, dann mit Lösung
find_var(allbus, "flüchtling")
find_var(allbus, "fluecht")
print(find_var(allbus, "fluecht"))
stopifnot(
  treffer("flüchtling") == 0, treffer("angst") == 0,
  identical(treffer_namen("fluecht"), c("mi05", "mp16", "mp17", "mp18", "mp19")),
  identical(treffer_namen("fluechtling"), "mi05")
)

zeige("A2 Idee 3")
# Vorlage a2_idee3 unverändert, dann mit Lösung
print(find_var(allbus, "politik"))
print(find_var(allbus, "vertrauen"))
stopifnot(
  treffer("politik") == 8, !any(grepl("VERTRAUEN", find_var(allbus, "politik")$label)),
  treffer("vertrauen") == 16, all(c("pt03", "pt12", "pt15", "st01") %in% treffer_namen("vertrauen"))
)

zeige("A2 Idee 4")
# Vorlage a2_idee4 unverändert, dann weitere Suchwörter
print(find_var(allbus, "einsam"))
print(find_var(allbus, "allein"))
print(find_var(allbus, "freund"))
stopifnot(
  identical(treffer_namen("einsam"), "dp03"), identical(treffer_namen("allein"), "xs01"),
  identical(treffer_namen("freund"), c("li04", "mc04"))
)

zeige("A2 Weiterdenken")
# Vorlage frei_a2
find_var(allbus, "tarot")
stopifnot(identical(treffer_namen("tarot"), "rh09b"))

# ---- Aufgabe 3: Belegen ------------------------------------------------------------------
zeige("A3 Schritt 1: codebook (in RStudio öffnet sich der Viewer; hier nur die Kurzfassung)")
# Vorlage a3_codebuch
codebook(allbus)

codebook(allbus, rh08b)
# Prüfung 23.11.: Textfassung (Hülle aus Sitzung 2) zeigt fehlende Werte mit n, aber keine Zahl gültiger Antworten
cb_text <- capture.output(summary(codebook(allbus, rh08b, view = FALSE)))
stopifnot(any(grepl("KENNE ICH NICHT \\(n = 178\\)", cb_text)), !any(grepl("5030", cb_text)))

zeige("A3 Schritt 2: rh08b")
# Vorlage a3_rh08b
frequency(allbus, rh08b)
print(frequency(allbus, rh08b))
stopifnot(
  n_code("rh08b", 1) == 169, n_code("rh08b", 2) == 1321, n_code("rh08b", 3) == 3540,
  n_code("rh08b", -6) == 178, n_code("rh08b", -9) == 34, n_code("rh08b", -42) == 4,
  f_valid("rh08b") == 5030, f_zeile("rh08b", "Total Missing") == 216,
  f_zeile("rh08b", "VIEL") == 169
)

zeige("A3 Schritt 3: pt03")
# Vorlage a3_pt03, markierte Stelle mit pt03 gefüllt
frequency(allbus, pt03)
print(frequency(allbus, pt03))
stopifnot(
  n_code("pt03", -11) == 1596, n_code("pt03", -9) == 55, n_code("pt03", -42) == 3,
  f_valid("pt03") == 3592, f_zeile("pt03", "Total Missing") == 1654,
  n_befragte - 1596 == 3650, round(100 * 3650 / n_befragte) == 70,
  n_code("pt03", 7) == 156
)

zeige("A3 Weiterdenken: pt15")
# Vorlage frei_a3
frequency(allbus, pt15)
print(frequency(allbus, pt15))
stopifnot(f_valid("pt15") == 3586, n_code("pt15", 7) == 28, n_code("pt15", 1) == 539, n_code("pt03", 1) == 365)

# Für Rückmeldungen zu Idee 2 und 4 (nur Zählungen, nicht im Kapitel abgefragt)
stopifnot(n_code("mp17", -11) == 1647, f_valid("mi05") == 3607, n_code("dp03", -10) == 4223)

# ---- Grundlage 4: Fehlermeldungen (Beispiele) ---------------------------------------------
zeige("Grundlage 4: Beispielmeldungen")
fehler <- function(code) tryCatch({
  eval(parse(text = code))
  "kein Fehler"
}, error = function(e) conditionMessage(e))
g4 <- c(
  'codebuch(allbus)',
  'find_var(Allbus, "klima")',
  'frequency(allbus, Pi08)',
  'find_var(allbus, klima)',
  'find_var(allbus, "klima"',
  'read_spss("gibt-es-nicht.sav")',
  'library(mariposas)'
)
for (z in g4) cat("\n> ", z, "\n", fehler(z), "\n", sep = "")
stopifnot(
  grepl("codebuch", fehler(g4[1])), grepl("Allbus", fehler(g4[2])), grepl("Pi08", fehler(g4[3])),
  grepl("pattern", fehler(g4[4])), grepl("does not exist", fehler(g4[6])), grepl("mariposas", fehler(g4[7]))
)

# ---- Aufgabe 4: Reparieren ----------------------------------------------------------------
zeige("A4: kaputte Zeilen, wie sie in den Vorlagen stehen")
a4 <- c('frequenzy(allbus, rh09b)', 'find_var(allbus, nachbar)', 'frequency(allbus, Li04)', 'find_var(allbus, "kirche"')
for (z in a4) cat("\n> ", z, "\n", fehler(z), "\n", sep = "")
stopifnot(all(vapply(a4, fehler, "") != "kein Fehler"))

zeige("A4: repariert")
frequency(allbus, rh09b)
find_var(allbus, "nachbar")
frequency(allbus, li04)
find_var(allbus, "kirche")
print(frequency(allbus, rh09b))
print(find_var(allbus, "nachbar"))
print(frequency(allbus, li04))
print(find_var(allbus, "kirche"))
stopifnot(
  n_code("rh09b", -6) == 248, f_valid("rh09b") == 4962,
  treffer("nachbar") == 2, n_code("li04", 7) == 1534, f_valid("li04") == 5218, treffer("kirche") == 11,
  identical(treffer_namen("nachbar"), c("li08", "mc03")),
  identical(treffer_namen("kirche"), c("li09", "mn06", "rd04", "rd08", "rd11", "rd13", "rd15", "rd20", "rd21", "pt06", "pt07")),
  identical(treffer_namen("politik"), c("li07", "lp05", "pe01", "pe04", "pe05", "pe06", "pa30", "pa35"))
)

zeige("A4 Weiterdenken")
# Vorlage frei_a4
find_var(allbus, "pt", search = "name")
print(find_var(allbus, "pt", search = "name"))
stopifnot(nrow(find_var(allbus, "pt", search = "name")) == 15)
cat("search = \"titel\":", fehler('find_var(allbus, "klima", search = "titel")'), "\n")
stopifnot(grepl("name_label", fehler('find_var(allbus, "pt", search = "titel")')))

# ---- Prüf dich selbst ----------------------------------------------------------------------
zeige("Selbsttest")
stopifnot(treffer("ärztl") == 0, identical(treffer_namen("aerzt"), "ca04"))

# ---- Jede Vorlage für sich: frische Umgebung, nur allbus (wie in der Code-Werkstatt) ----------
zeige("Vorlagen einzeln")
solo <- list(
  a1_dim = 'dim(allbus)',
  a1_zellen = 'zellen <- 5246 * 579\n\nzellen\n\nzellen / 60 / 60 / 24',
  frei_a1 = 'names(allbus)',
  a2_idee1 = 'find_var(allbus, "horoskop")',
  a2_idee2 = 'find_var(allbus, "fluecht")',
  a2_idee3 = 'find_var(allbus, "vertrauen")',
  a2_idee4 = 'find_var(allbus, "einsam")',
  frei_a2 = 'find_var(allbus, "tarot")',
  a3_codebuch = 'codebook(allbus)\n\ncodebook(allbus, rh08b)',
  a3_rh08b = 'frequency(allbus, rh08b)',
  a3_pt03 = 'frequency(allbus, pt03)',
  frei_a3 = 'frequency(allbus, pt15)',
  a4_1 = 'frequency(allbus, rh09b)',
  a4_2 = 'find_var(allbus, "nachbar")',
  a4_3 = 'frequency(allbus, li04)',
  a4_4 = 'find_var(allbus, "kirche")',
  frei_a4 = 'find_var(allbus, "pt", search = "name")'
)
datei <- allbus
for (n in names(solo)) {
  env <- new.env(parent = asNamespace("mariposa"))
  assign("allbus", datei, envir = env)
  invisible(capture.output(suppressMessages(for (e in parse(text = solo[[n]])) print(eval(e, env)))))
  cat("ok:", n, "\n")
}

cat("\n\nAlle Zahlen geprüft.\n")
