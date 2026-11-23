# Sitzung 2 „Vom Fragebogen zum Datensatz“: alle Zahlen des Kapitels und alle Vorlagen
# ALLBUS 2023, ZA8831 v1.3.0, mariposa 0.7.4, ungewichtet (es werden Zellen und Codes gezählt).
# Aufruf: Rscript sitzung02-zahlen.R   (Pfad zur Datei über die Umgebungsvariable ALLBUS_SAV änderbar)
# Jede Zahl, die im Kapitel steht, wird hier berechnet und mit stopifnot() gegen den Zielwert geprüft.
# Vorlagen (Abschnitte „VORLAGE …“) stehen wörtlich wie im Kapitel; markierte Stellen mit ihrem Beispielwert.
# Ausgegeben werden nur Aggregate. Im Kapitel zeigen die Vorlagen eine Bauplatte mit ihrem Namen (z. B. allbus),
# R druckt dann zehn Reihen; hier steht stattdessen print(..., n = 0), damit das Protokoll keine Einzelfälle enthält.
# Keine Zahl im Kapitel gehört zu einer einzelnen Person.

pdf(NULL)
options(width = 80)

datei <- Sys.getenv(
  "ALLBUS_SAV",
  "/Users/yannickdiehl/Documents/Universität Marburg/Lehre/Methoden Ib B.A./Methoden1bSeminarMontag/ZA8831_v1-3-0.sav"
)

# ---- VORLAGE start: Startblock (im Kapitel mit read_spss("ZA8831_v1-3-0.sav")) ----
# Pakete laden und Daten einlesen
library(tidyverse)
library(mariposa)

allbus <- read_spss(datei)

stopifnot(as.character(packageVersion("mariposa")) == "0.7.4")

# Hilfsfunktionen nur zum Nachrechnen (kein Teil des Kapitels):
# code_of() liefert den gespeicherten Code, auch für fehlende Werte (tagged NA -> -9, -11, -42 ...)
code_of <- function(x) {
  tm <- attr(x, "na_tag_map")
  v <- unclass(x)
  attributes(v) <- NULL
  if (!is.null(tm)) {
    tg <- haven::na_tag(x)
    i <- !is.na(tg)
    v[i] <- tm[tg[i]]
  }
  v
}
# n_code(): wie oft steht ein Code in einer Variable (so zeigt es codebook() unter „Missing values“ bzw. Freq.)
n_code <- function(data, var, code) sum(code_of(data[[var]]) == code, na.rm = TRUE)
# details(): die Textfassung, die die Code-Werkstatt für codebook() zeigen soll
details <- function(...) print(summary(codebook(..., view = FALSE)))
check <- function(name, wert, ziel) {
  cat(sprintf("%-28s %s\n", name, format(wert)))
  stopifnot(isTRUE(all.equal(wert, ziel)))
}

cat("\n==== Datensatz ====\n")
check("Reihen allbus", nrow(allbus), 5246)
check("Variablen allbus", ncol(allbus), 579)
check("Steine (Reihen x Türme)", nrow(allbus) * ncol(allbus), 3037434)

# =====================================================================
# Vorweg: R lesen
# =====================================================================
cat("\n==== Vorweg: R lesen ====\n")

# ---- VORLAGE rlesen ----
# Nachschlagen: Welcher Code steht für FRAU?
codebook(allbus, sex)

# Nur die Befragten behalten, bei denen sex gleich 2 ist
frauen <- allbus %>%
  filter(sex == 2)

# Die neue Bauplatte anzeigen
print(frauen, n = 0)   # im Kapitel: frauen
# ---- Ende Vorlage ----

details(allbus, sex)
check("sex: Code FRAU", unname(attr(allbus$sex, "labels")["FRAU"]), 2)
check("frauen Reihen", nrow(frauen), 2672)
check("frauen Variablen", ncol(frauen), 579)

# =====================================================================
# Grundlage 1: Datenmatrix (nur Aggregate; die Bauplatte im Bild ist konstruiert)
# =====================================================================
cat("\n==== Grundlage 1 ====\n")
# 5.246 x 579 = 3.037.434 Steine (oben geprüft)

# =====================================================================
# Aufgabe 1: Wer hat auf Papier geantwortet? (mode, filter)
# =====================================================================
cat("\n==== Aufgabe 1 ====\n")

# ---- VORLAGE a1a ----
# Die ganze Bauplatte anzeigen
print(allbus, n = 0)   # im Kapitel: allbus
# ---- Ende Vorlage ----

# ---- VORLAGE a1b ----
# Welcher Code steht für den Papierbogen?
codebook(allbus, mode)
# ---- Ende Vorlage ----
details(allbus, mode)

# ---- VORLAGE a1c (Beispielwert 2 an der markierten Stelle) ----
# Nur die Befragten mit einem Code in mode behalten
auswahl <- allbus %>%
  filter(mode == 2)

# Die neue Bauplatte anzeigen
print(auswahl, n = 0)   # im Kapitel: auswahl
# ---- Ende Vorlage ----
check("auswahl mode 2 (CAPI)", nrow(auswahl), 2003)

# a1c gelöst: markierte Stelle 4
auswahl <- allbus %>%
  filter(mode == 4)
print(auswahl, n = 0)

lab_mode <- attr(allbus$mode, "labels")
check("mode: Code MAIL", unname(lab_mode["MAIL"]), 4)
check("mode: Code CAPI", unname(lab_mode["CAPI"]), 2)
check("mode: Code CAWI", unname(lab_mode["CAWI"]), 3)
check("mode: Code PAPI (kommt nicht vor)", n_code(allbus, "mode", 1), 0)
check("A1 Reihen Papier", nrow(auswahl), 1656)
check("A1 Variablen Papier", ncol(auswahl), 579)
check("CAPI n", n_code(allbus, "mode", 2), 2003)
check("CAWI n", n_code(allbus, "mode", 3), 1587)
check("Anteil Papier in %", round(100 * 1656 / 5246, 1), 31.6)

# ---- Probier-Werkstatt A1 ----
# Eine Idee: nur die Online-Befragten (mode 3 = CAWI)
online <- allbus %>%
  filter(mode == 3)

print(online, n = 0)   # im Kapitel: online
check("Probier A1 online Reihen", nrow(online), 1587)

# Fehlerbeispiel: Code 1 (PAPI) kommt nicht vor -> 0 Reihen
check("filter(mode == 1) Reihen", nrow(allbus %>% filter(mode == 1)), 0)

# =====================================================================
# Grundlage 2: Codes und Labels (pa02a, pv01, ls01)
# =====================================================================
cat("\n==== Grundlage 2 ====\n")
details(allbus, pa02a, pv01, ls01)
lab_pa02a <- attr(allbus$pa02a, "labels")
check("pa02a: SEHR STARK", unname(lab_pa02a["SEHR STARK"]), 1)
check("pa02a: UEBERHAUPT NICHT", unname(lab_pa02a["UEBERHAUPT NICHT"]), 5)
check("pa02a -42", n_code(allbus, "pa02a", -42), 4)
check("pa02a -9", n_code(allbus, "pa02a", -9), 17)
lab_pv01 <- attr(allbus$pv01, "labels")
check("pv01: AFD", unname(lab_pv01["AFD"]), 42)
check("pv01: DIE LINKE", unname(lab_pv01["DIE LINKE"]), 6)
check("pv01: Code 5 vergeben?", sum(lab_pv01 == 5, na.rm = TRUE), 0)
check("pv01 AFD n", n_code(allbus, "pv01", 42), 480)
check("pv01 DIE LINKE n", n_code(allbus, "pv01", 6), 260)
pv <- code_of(allbus$pv01)
check("pv01 'Mittelwert' der Codes", round(mean(pv[pv > 0]), 1), 16.1)
lab_ls01 <- attr(allbus$ls01, "labels")
check("ls01: Label 0", names(lab_ls01)[which(lab_ls01 == 0)], "GANZ UNZUFRIEDEN")
check("ls01: Label 10", names(lab_ls01)[which(lab_ls01 == 10)], "GANZ ZUFRIEDEN")
check("ls01: Label 5", names(lab_ls01)[which(lab_ls01 == 5)], "..")

# =====================================================================
# Aufgabe 2: Ein Bogen wird zur Zeile (age, educ, ep03, id02)
# =====================================================================
cat("\n==== Aufgabe 2 ====\n")

# ---- VORLAGE a2 ----
# Codes und Wertelabels für die vier Fragen des Bogens
codebook(allbus, age, educ, ep03, id02)
# ---- Ende Vorlage ----
details(allbus, age, educ, ep03, id02)

lab_age <- attr(allbus$age, "labels")
check("age: Wertelabels für gültige Werte", sum(!is.na(lab_age) & lab_age > 0), 0)
check("age: kleinster Wert", min(code_of(allbus$age)[code_of(allbus$age) > 0]), 18)
check("age: größter Wert", max(code_of(allbus$age)[code_of(allbus$age) > 0]), 99)
lab_educ <- attr(allbus$educ, "labels")
check("educ: NOCH SCHUELER", unname(lab_educ["NOCH SCHUELER"]), 7)
check("educ: HOCHSCHULREIFE", unname(lab_educ["HOCHSCHULREIFE"]), 5)
lab_ep03 <- attr(allbus$ep03, "labels")
check("ep03: SCHLECHT", unname(lab_ep03["SCHLECHT"]), 4)
check("ep03: SEHR GUT", unname(lab_ep03["SEHR GUT"]), 1)
lab_id02 <- attr(allbus$id02, "labels")
check("id02: ARBEITERSCHICHT", unname(lab_id02["ARBEITERSCHICHT"]), 2)
nf_id02 <- na_frequencies(allbus$id02)
check("id02: Code KEINER DER SCHICHTEN", nf_id02$code[nf_id02$label == "KEINER DER SCHICHTEN"], -50)
check("id02 -50 n", n_code(allbus, "id02", -50), 15)

# Der Bogen in A2 ist ausgedacht: Keine befragte Person hat diese vier Angaben zugleich.
bogen <- allbus %>%
  filter(age == 19, educ == 7, ep03 == 4, id02 == 2)
check("A2-Bogen: echte Befragte mit dieser Zeile", nrow(bogen), 0)

# ---- Probier-Werkstatt A2 ----
# Eine Idee: Wie ist der Familienstand gespeichert?
codebook(allbus, mstat)
details(allbus, mstat)
check("mstat: LEDIG", unname(attr(allbus$mstat, "labels")["LEDIG"]), 5)

# =====================================================================
# Grundlage 3: Fehlende Werte haben Gründe (ls01, ps03, dw15, rh08b)
# =====================================================================
cat("\n==== Grundlage 3 ====\n")
details(allbus, ls01, ps03, dw15, rh08b)
check("ls01 Code 0 (gültig) n", n_code(allbus, "ls01", 0), 26)
check("ls01 -9 n", n_code(allbus, "ls01", -9), 81)
check("ls01 -42 n", n_code(allbus, "ls01", -42), 1)
check("ps03 -11 n", n_code(allbus, "ps03", -11), 1596)
check("dw15 -10 n", n_code(allbus, "dw15", -10), 2263)
check("rh08b -6 n", n_code(allbus, "rh08b", -6), 178)
alle_codes <- sort(unique(unlist(lapply(allbus, function(x) unname(attr(x, "na_tag_map"))))))
print(alle_codes)
check("verschiedene Missing-Codes", length(alle_codes), 17)

# =====================================================================
# Aufgabe 3: Was nur auf Papier passiert (pa01, st01, pt03)
# =====================================================================
cat("\n==== Aufgabe 3 ====\n")

# ---- VORLAGE a3 (Beispielwert papier an der markierten Stelle) ----
# Nur die Papierbögen behalten
papier <- allbus %>%
  filter(mode == 4)

# Codebuch für drei Fragen, nur Papierbögen
codebook(papier, pa01, st01, pt03)
# ---- Ende Vorlage ----
details(papier, pa01, st01, pt03)

# a3 nach dem Tausch: markierte Stelle allbus
codebook(allbus, pa01, st01, pt03)
details(allbus, pa01, st01, pt03)

check("A3 Papier pa01 -42", n_code(papier, "pa01", -42), 24)
check("A3 alle pa01 -42", n_code(allbus, "pa01", -42), 24)
check("pa01 -42 CAPI", n_code(allbus %>% filter(mode == 2), "pa01", -42), 0)
check("pa01 -42 CAWI", n_code(allbus %>% filter(mode == 3), "pa01", -42), 0)
check("A3 Papier st01 -11", n_code(papier, "st01", -11), 858)
check("A3 Papier pt03 -11", n_code(papier, "pt03", -11), 798)
check("A3 Summe = alle Papierbögen", 858 + 798, nrow(papier))
check("alle st01 -11", n_code(allbus, "st01", -11), 1647)
check("alle pt03 -11", n_code(allbus, "pt03", -11), 1596)
st <- code_of(papier$st01)
pt <- code_of(papier$pt03)
sp <- code_of(papier$splt23_1)
check("Papier: beide -11 zugleich", sum(st == -11 & pt == -11), 0)
check("Papier: keines von beiden -11", sum(st != -11 & pt != -11), 0)
check("Papier Version A (splt23_1 = 1)", sum(sp == 1), 858)
check("Papier Version B (splt23_1 = 2)", sum(sp == 2), 798)
check("Version A ohne st01", sum(sp == 1 & st == -11), 858)
check("Version B ohne pt03", sum(sp == 2 & pt == -11), 798)
check("st01 -8 auf Papier", n_code(papier, "st01", -8), 0)

# Auflösung: -42 im ganzen Datensatz
n42 <- vapply(allbus, function(x) if (is.numeric(x)) n_code(tibble(v = x), "v", -42) else 0L, numeric(1))
check("-42: Zellen gesamt", sum(n42), 638)
check("-42: Variablen", sum(n42 > 0), 202)
hat42 <- rowSums(sapply(allbus[, n42 > 0], function(x) code_of(x) == -42), na.rm = TRUE) > 0
m <- code_of(allbus$mode)
check("-42: Papierbögen mit mind. einer", sum(hat42 & m == 4), 357)
check("-42: andere Wege mit mind. einer", sum(hat42 & m != 4), 0)
check("Anteil 357/1656 in %", round(100 * 357 / 1656, 1), 21.6)

# ---- Probier-Werkstatt A3 ----
# Eine Idee: Gab es die zwei Versionen auch online? (mode 3 = CAWI)
online <- allbus %>%
  filter(mode == 3)

codebook(online, st01, pt03)
details(online, st01, pt03)
check("online st01 -11", n_code(online, "st01", -11), 789)
check("online pt03 -11", n_code(online, "pt03", -11), 798)
check("CAPI st01 -11", n_code(allbus %>% filter(mode == 2), "st01", -11), 0)

# =====================================================================
# Grundlage 4: Datentypen
# =====================================================================
cat("\n==== Grundlage 4 ====\n")
typ <- vapply(allbus, function(x) {
  if (inherits(x, "haven_labelled")) "dbl+lbl" else if (is.character(x)) "chr" else "dbl"
}, character(1))
print(table(typ))
check("Typ dbl+lbl", sum(typ == "dbl+lbl"), 576)
check("Typ chr", sum(typ == "chr"), 2)
check("Typ dbl", sum(typ == "dbl"), 1)
codebook(allbus)   # Kopf: Types: 2 chr, 1 dbl, 576 lbl+dbl

# =====================================================================
# Aufgabe 4 (Zusatz): Drei Typen auf einer Bauplatte
# =====================================================================
cat("\n==== Aufgabe 4 ====\n")

# ---- VORLAGE a4 ----
# Nur die Papierbögen behalten und anzeigen
papier <- allbus %>%
  filter(mode == 4)

print(papier, n = 0)   # im Kapitel: papier
# ---- Ende Vorlage ----
check("respid Typ", typ[["respid"]], "dbl")
check("doi Typ", typ[["doi"]], "chr")
check("version Typ", typ[["version"]], "chr")
check("mode Typ", typ[["mode"]], "dbl+lbl")
check("mode in papier immer 4", unique(code_of(papier$mode)), 4)
# Spaltenreihenfolge im Druck (bei Breite 80 sichtbar: za_nr bis eastwest)
check("erste neun Spalten", paste(names(allbus)[1:9], collapse = " "),
      "za_nr doi version respid substudy mode splt23_1 splt23_2 eastwest")

# ---- Probier-Werkstatt A4 ----
# Eine Idee: Wie viele verschiedene Werte hat die Kennnummer respid?
codebook(allbus, respid)
details(allbus, respid)
check("respid verschiedene Werte", length(unique(allbus$respid)), 5246)

# =====================================================================
# Überblick und Selbsttest: keine neuen Zahlen außer den oben geprüften
# =====================================================================
cat("\n==== Selbsttest ====\n")
check("filter(mode == 3) Reihen", nrow(allbus %>% filter(mode == 3)), 1587)
check("filter(mode == 3) Variablen", ncol(allbus %>% filter(mode == 3)), 579)

# Fehlermeldung „= statt ==“ (Hilfe bei R-Fehlermeldungen)
fehler <- tryCatch(allbus %>% filter(mode = 4), error = function(e) conditionMessage(e))
cat(fehler, "\n")
stopifnot(grepl("==", fehler))

# =====================================================================
# Nachträge aus der Prüfung (Agent, 23.11.2026)
# =====================================================================
cat("\n==== Prüfung 23.11.2026 ====\n")

# G1b: ein Turm hat so viele Steine wie Reihen, auch leere
check("Turm ls01: Steine", length(allbus$ls01), 5246)
check("Turm ls01: leere Steine (NA)", sum(is.na(allbus$ls01)), 82)

# G3b: Beispiel für -8 WEISS NICHT
check("pv01 -8 n", n_code(allbus, "pv01", -8), 603)

# G3a Bogen D: ps03 fehlt in Version B (splt23_1 = 2), nicht in Version A
v <- code_of(allbus$splt23_1)
ps <- code_of(allbus$ps03)
check("ps03 -11 in Version B", sum(v == 2 & ps == -11), 1596)
check("ps03 -11 in Version A", sum(v == 1 & ps == -11), 0)
check("Version B: alle ohne ps03", sum(v == 2), 1596)
check("Label splt23_1 = 2", names(attr(allbus$splt23_1, "labels"))[which(attr(allbus$splt23_1, "labels") == 2)], "SPLIT B")

# A1 Probier: drei Wege ergeben alle Befragten
check("2003 + 1587 + 1656", n_code(allbus, "mode", 2) + n_code(allbus, "mode", 3) + n_code(allbus, "mode", 4), 5246)

# A1 a1_wer: mittleres Alter nach Erhebungsweg (gerundet)
alter <- allbus %>%
  group_by(weg = as.numeric(mode)) %>%
  summarise(m = mean(age, na.rm = TRUE))
check("mittleres Alter Papier", round(alter$m[alter$weg == 4]), 58)
check("mittleres Alter online", round(alter$m[alter$weg == 3]), 47)

# A1 und A4: Kopf und Fuß des Ausdrucks bei Breite 80 (nur Namen und Typen, keine Zellen)
kopf <- function(d) {
  o <- capture.output(print(d))
  list(namen = strsplit(trimws(o[2]), " +")[[1]], fuss = grep("more variables", o, value = TRUE))
}
k1 <- kopf(allbus)
check("allbus: sichtbare Türme", length(k1$namen), 8)
stopifnot(grepl("571 more variables: eastwest", k1$fuss))
k2 <- kopf(allbus %>% filter(mode == 4))
check("papier: sichtbare Türme", length(k2$namen), 9)
stopifnot(grepl("570 more variables: german", k2$fuss))
zelle <- capture.output(print(allbus %>% filter(mode == 4) %>% select(za_nr:eastwest), n = 1))[4]
stopifnot(grepl("4 \\[MAI…", zelle))
cat("Ausdruck allbus/papier: Kopf und Fuß wie im Plan\n")

# G3b: read_spss() macht die als fehlend markierten Codes zu NA; einzige negative gültige Zahl: splt23_2 = -15
neg <- vapply(allbus, function(x) if (is.numeric(x)) sum(unclass(x) < 0, na.rm = TRUE) else 0, numeric(1))
check("Variablen mit negativen gültigen Werten", names(neg[neg > 0]), "splt23_2")

# G4b: to_label() und to_numeric() lassen den Grund fallen (nur NA)
check("to_label(sex): Klasse", class(to_label(allbus$sex)), "factor")
check("to_label(sex): NA", sum(is.na(to_label(allbus$sex))), 10)
check("to_numeric(sex): NA", sum(is.na(to_numeric(allbus$sex))), 10)

# Fehlermeldungen der Hilfe-Tabelle
f1 <- tryCatch(allbus %>% filter(mode == "MAIL"), error = function(e) conditionMessage(e))
stopifnot(grepl("Can't combine", f1))
f2 <- tryCatch(codebook(allbus, Age), error = function(e) conditionMessage(e))
stopifnot(grepl("Column `Age` doesn't exist", f2))

# Nachtrag „Jede Vorlage läuft für sich“: jede Vorlage in einer frischen Umgebung, die nur allbus kennt
vorlagen <- list(
  rlesen = "codebook(allbus, sex)\nfrauen <- allbus %>%\n  filter(sex == 2)\nfrauen",
  a1a = "allbus",
  a1b = "codebook(allbus, mode)",
  a1c = "auswahl <- allbus %>%\n  filter(mode == 2)\nauswahl",
  a2 = "codebook(allbus, age, educ, ep03, id02)",
  a3 = "papier <- allbus %>%\n  filter(mode == 4)\ncodebook(papier, pa01, st01, pt03)",
  a4 = "papier <- allbus %>%\n  filter(mode == 4)\npapier",
  probier_a1 = "online <- allbus %>%\n  filter(mode == 3)\nonline",
  probier_a2 = "codebook(allbus, mstat)",
  probier_a3 = "online <- allbus %>%\n  filter(mode == 3)\ncodebook(online, st01, pt03)",
  probier_a4 = "codebook(allbus, respid)"
)
for (nm in names(vorlagen)) {
  e <- new.env(parent = globalenv())
  e$allbus <- allbus
  invisible(capture.output(eval(parse(text = vorlagen[[nm]]), envir = e)))
  cat("Vorlage für sich:", nm, "ok\n")
}

cat("\nAlle Prüfungen bestanden.\n")
