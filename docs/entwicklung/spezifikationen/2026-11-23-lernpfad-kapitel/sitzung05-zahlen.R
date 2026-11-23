# Sitzung 5 „Kreuztabellen“: alle Zahlen des Kapitels und jede Codevorlage einmal ausgeführt.
# Daten: ALLBUS 2023, ZA8831 v1.3.0, ungewichtet (zwei Vergleichszahlen gewichtet), nur Aggregate.
# Pakete: tidyverse, mariposa 0.7.4.
# Aufruf:  Rscript sitzung05-zahlen.R
#   oder:  ALLBUS_SAV=/pfad/ZA8831_v1-3-0.sav Rscript sitzung05-zahlen.R
# Bricht mit Fehler ab, sobald eine Zahl nicht zum Plan (sitzung05.md) passt.
# Vorlagen stehen hier wörtlich wie im Plan; ⟦…⟧ markiert anzupassende Stellen.
# Jede Vorlage läuft einmal so, wie sie dasteht (Platzhalter), und einmal gelöst.
# Wie in der Code-Werkstatt läuft jede Vorlage in einer frischen Umgebung, in der nur der frisch
# geladene allbus existiert: Keine Vorlage kann von Variablen oder Objekten einer anderen leben.

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
stopifnot(nrow(allbus) == 5246, ncol(allbus) == 579)
FRISCH <- allbus

# ---------------------------------------------------------------------------------------------
# Hilfsfunktionen: Zahlen genau so prüfen, wie mariposa sie druckt
# ---------------------------------------------------------------------------------------------
ok <- function(name, ist, soll, tol = 0) {
  if (length(ist) != 1 || is.na(ist) || abs(ist - soll) > tol + 1e-9) {
    stop(sprintf("%s: ist %s, soll %s", name, paste(ist, collapse = "/"), soll))
  }
  cat(sprintf("  ok  %-66s %s\n", name, format(soll, big.mark = ".", decimal.mark = ",")))
}
abschnitt <- function(t) cat("\n==== ", t, " ====\n", sep = "")

# Vorlage ausführen: Text wie im Plan, ⟦…⟧ entfernt (Platzhalter bleiben stehen) oder ersetzt
plain <- function(code) gsub("⟦|⟧", "", code)
loesen <- function(code, ersatz) {
  for (alt in names(ersatz)) code <- sub(paste0("⟦", alt, "⟧"), ersatz[[alt]], code, fixed = TRUE)
  stopifnot(!grepl("⟦", code))
  code
}
# Frische Umgebung: Eltern sind nur die Pakete (Suchpfad unterhalb von globalenv), darin nur allbus
laufen <- function(name, code) {
  cat("\n---- Vorlage:", name, "----\n")
  umgebung <- new.env(parent = parent.env(globalenv()))
  umgebung$allbus <- FRISCH
  out <- capture.output({
    ausdruecke <- parse(text = code)
    for (a in ausdruecke) {
      wert <- withVisible(eval(a, envir = umgebung))
      if (wert$visible) print(wert$value)
    }
  })
  # Die Vorlage darf die Daten der anderen nicht verändern
  stopifnot(identical(FRISCH, allbus), ncol(FRISCH) == 579)
  invisible(out)
}

# Gedruckte Ausgabe von frequency(): Zeile mit genau diesem Label (N, Raw %, Valid %, Cum. %)
freq_zeile <- function(text, label) {
  for (z in text[startsWith(trimws(text), "|")]) {
    teile <- trimws(strsplit(z, "|", fixed = TRUE)[[1]])
    if (label %in% teile) {
      zahlen <- suppressWarnings(as.numeric(teile[(match(label, teile) + 1):length(teile)]))
      return(zahlen[!is.na(zahlen)])
    }
  }
  stop("Zeile nicht gefunden: ", label)
}
freq_code <- function(text, label) {
  for (z in text[startsWith(trimws(text), "|")]) {
    teile <- trimws(strsplit(z, "|", fixed = TRUE)[[1]])
    if (label %in% teile) return(as.numeric(teile[match(label, teile) - 1]))
  }
  stop("Zeile nicht gefunden: ", label)
}
freq_kopf <- function(text, feld) {
  k <- text[grepl("^# total N=", text)][1]
  as.numeric(sub(paste0(".*", feld, "=(-?[0-9.]+).*"), "\\1", k))
}

# Gedruckte Ausgabe von crosstab(): je Zeilenkategorie Anzahlen und Prozentzeilen
ct_lesen <- function(text) {
  n <- list(); pct <- list(); cur <- NULL
  for (z in text[startsWith(text, "|")]) {
    teile <- trimws(strsplit(z, "|", fixed = TRUE)[[1]])[-1]
    erst <- teile[1]; rest <- teile[-1]
    if (erst == "") next
    zahlen <- suppressWarnings(as.numeric(sub("%", "", rest, fixed = TRUE)))
    if (any(is.na(zahlen))) next
    if (erst %in% c("row %", "col %", "total %")) {
      pct[[cur]][[sub(" %", "", erst, fixed = TRUE)]] <- zahlen
    } else {
      cur <- erst; n[[cur]] <- zahlen; pct[[cur]] <- list()
    }
  }
  nv <- as.numeric(sub(".*N \\(valid\\): *([0-9]+).*", "\\1", text[grepl("N \\(valid\\)", text)][1]))
  ms <- as.numeric(sub(".*Missing: *([0-9]+).*", "\\1", text[grepl("- Missing:", text)][1]))
  list(n = n, pct = pct, valid = nv, missing = ms)
}

# =============================================================================================
# Vorlagen (wörtlich wie in sitzung05.md); jede für sich lauffähig
# =============================================================================================
V <- list()

V$start <- '# Pakete laden und Daten einlesen
library(tidyverse)
library(mariposa)

allbus <- read_spss("ZA8831_v1-3-0.sav")'

V$r2_rec <- '# Neue Variable teilzeit aus work bilden und gleich prüfen
allbus %>%
  mutate(
    teilzeit = rec(work, rules = "2:3=1 [Teilzeit]; 1=0 [Vollzeit]; else=NA")
  ) %>%
  frequency(teilzeit)'

V$r3_ct <- '# Kreuztabelle: Geschlecht in den Zeilen, Teilzeit in den Spalten
# teilzeit bilden: wie in der Vorlage darüber
allbus %>%
  mutate(
    teilzeit = rec(work, rules = "2:3=1 [Teilzeit]; 1=0 [Vollzeit]; else=NA")
  ) %>%
  crosstab(sex, teilzeit, percentages = "row")'

V$a1_freq <- '# Welche Codes hat pe01?
allbus %>%
  frequency(pe01)'

V$a1_misstrauen <- '# Neue Variable misstrauen bilden und gleich prüfen
allbus %>%
  mutate(
    misstrauen = rec(pe01, rules = "⟦1⟧=1 [misstraut]; ⟦2:4⟧=0 [misstraut nicht]; else=NA")
  ) %>%
  frequency(misstrauen)'

V$a1_nichtwahl <- '# Neue Variable nichtwahl bilden und gleich prüfen
allbus %>%
  mutate(
    nichtwahl = rec(pv01, rules = "91=1 [würde nicht wählen]; 1:90=0 [würde wählen]; else=NA")
  ) %>%
  frequency(nichtwahl)'

V$frei_a1 <- '# Eine Idee: pe01 nur bei denen, die bei der Wahlabsicht eine gültige Angabe haben
# nichtwahl bilden: wie in Schritt 3
allbus %>%
  mutate(
    nichtwahl = rec(pv01, rules = "91=1 [würde nicht wählen]; 1:90=0 [würde wählen]; else=NA")
  ) %>%
  drop_na(nichtwahl) %>%
  frequency(pe01)
'

V$a2_ct <- '# Kreuztabelle: Welche Prozentbasis ergibt die 87 %?
# misstrauen und nichtwahl bilden: kennst du aus Aufgabe 1
allbus %>%
  mutate(
    misstrauen = rec(pe01, rules = "1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA"),
    nichtwahl  = rec(pv01, rules = "91=1 [würde nicht wählen]; 1:90=0 [würde wählen]; else=NA")
  ) %>%
  crosstab(misstrauen, nichtwahl, percentages = "⟦row⟧")'

V$a2_all <- '# Dieselbe Tabelle mit allen drei Prozentbasen
# misstrauen und nichtwahl bilden: kennst du aus Aufgabe 1
allbus %>%
  mutate(
    misstrauen = rec(pe01, rules = "1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA"),
    nichtwahl  = rec(pv01, rules = "91=1 [würde nicht wählen]; 1:90=0 [würde wählen]; else=NA")
  ) %>%
  crosstab(misstrauen, nichtwahl, percentages = "all")'

V$frei_a2 <- '# Eine Idee: Misstrauen in West und Ost
# misstrauen bilden: kennst du aus Aufgabe 1
allbus %>%
  mutate(
    misstrauen = rec(pe01, rules = "1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA")
  ) %>%
  crosstab(eastwest, misstrauen, percentages = "row")
'

V$a3_ct <- '# Misstrauende und übrige vergleichen
# misstrauen und nichtwahl bilden: kennst du aus Aufgabe 1
allbus %>%
  mutate(
    misstrauen = rec(pe01, rules = "1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA"),
    nichtwahl  = rec(pv01, rules = "91=1 [würde nicht wählen]; 1:90=0 [würde wählen]; else=NA")
  ) %>%
  crosstab(misstrauen, nichtwahl, percentages = "⟦col⟧")'

V$frei_a3 <- '# Eine Idee: die Zeilenprozente als Balken auf 100 %
# misstrauen und nichtwahl bilden: kennst du aus Aufgabe 1
allbus %>%
  mutate(
    misstrauen = rec(pe01, rules = "1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA"),
    nichtwahl  = rec(pv01, rules = "91=1 [würde nicht wählen]; 1:90=0 [würde wählen]; else=NA")
  ) %>%
  drop_na(misstrauen, nichtwahl) %>%
  to_label(misstrauen, nichtwahl) %>%
  ggplot(aes(x = misstrauen, fill = nichtwahl)) +
  geom_bar(position = "fill")
'

V$a4_um <- '# pe05 umpolen und gleich prüfen: Welches Wort steht jetzt bei Code 1?
allbus %>%
  mutate(
    pe05_um = rec(pe05, rules = "rev")
  ) %>%
  frequency(pe05_um)'

V$a4_mutate <- '# pe05 umpolen, Misstrauen daraus bilden und mit der Nichtwahl kreuzen
# nichtwahl bilden: kennst du aus Aufgabe 1
allbus %>%
  mutate(
    pe05_um         = rec(pe05, rules = "rev"),
    misstrauen_pe05 = rec(pe05_um, rules = "⟦1⟧=1 [misstraut]; ⟦2:4⟧=0 [misstraut nicht]; else=NA"),
    nichtwahl       = rec(pv01, rules = "91=1 [würde nicht wählen]; 1:90=0 [würde wählen]; else=NA")
  ) %>%
  crosstab(misstrauen_pe05, nichtwahl, percentages = "row")'

V$a4_ohne <- '# Zum Vergleich: die Regel aus Aufgabe 1 ohne Umpolen auf pe05
# nichtwahl bilden: kennst du aus Aufgabe 1
allbus %>%
  mutate(
    misstrauen_ohne = rec(pe05, rules = "1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA"),
    nichtwahl       = rec(pv01, rules = "91=1 [würde nicht wählen]; 1:90=0 [würde wählen]; else=NA")
  ) %>%
  crosstab(misstrauen_ohne, nichtwahl, percentages = "row")'

V$frei_a4 <- '# Eine Idee: Gegenprobe mit pa35 („Politiker vertreten nur die Reichen“)
# 3 = teils/teils zählt hier als „misstraut nicht“. Probier auch 1:3=1 und 4:5=0.
allbus %>%
  mutate(
    misstrauen_pa35 = rec(pa35, rules = "1:2=1 [misstraut]; 3:5=0 [misstraut nicht]; else=NA"),
    nichtwahl       = rec(pv01, rules = "91=1 [würde nicht wählen]; 1:90=0 [würde wählen]; else=NA")
  ) %>%
  crosstab(misstrauen_pa35, nichtwahl, percentages = "row")
'

V$ueb_chi <- '# Wiederholung: Ist der Unterschied größer, als der Zufall erwarten lässt?
# misstrauen und nichtwahl bilden: kennst du aus Aufgabe 1
allbus %>%
  mutate(
    misstrauen = rec(pe01, rules = "1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA"),
    nichtwahl  = rec(pv01, rules = "91=1 [würde nicht wählen]; 1:90=0 [würde wählen]; else=NA")
  ) %>%
  chi_square(misstrauen, nichtwahl)'

# Skript zum Mitnehmen (für RStudio): eine Datei, Variablen einmal oben gebildet und abgelegt.
# Läuft hier als Ganzes in einer frischen Umgebung; die read_spss-Zeile ist durch den Startblock ersetzt.
V$skript <- '# Sitzung 5: Kreuztabellen
# Statistikatlas, Methoden Ib, ALLBUS 2023 (ZA8831 v1.3.0), ungewichtet
# Angepasste Stellen stehen hier in ihrer gelösten Form.

# ---- Startblock ----
library(tidyverse)
library(mariposa)

allbus <- read_spss("ZA8831_v1-3-0.sav")

# ---- Alle neuen Variablen dieser Sitzung einmal bilden und ablegen ----
# teilzeit: R lesen; misstrauen, nichtwahl: Aufgabe 1; pe05_um bis misstrauen_ohne: Aufgabe 4
allbus <- allbus %>%
  mutate(
    teilzeit        = rec(work, rules = "2:3=1 [Teilzeit]; 1=0 [Vollzeit]; else=NA"),
    misstrauen      = rec(pe01, rules = "1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA"),
    nichtwahl       = rec(pv01, rules = "91=1 [würde nicht wählen]; 1:90=0 [würde wählen]; else=NA"),
    pe05_um         = rec(pe05, rules = "rev"),
    misstrauen_pe05 = rec(pe05_um, rules = "1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA"),
    misstrauen_ohne = rec(pe05, rules = "1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA")
  )

# ---- R lesen: die neue Variable prüfen ----
allbus %>%
  frequency(teilzeit)

# ---- R lesen: eine Kreuztabelle ----
allbus %>%
  crosstab(sex, teilzeit, percentages = "row")

# ---- Aufgabe 1: Codes von pe01 ----
allbus %>%
  frequency(pe01)

# ---- Aufgabe 1: Gruppen prüfen ----
allbus %>%
  frequency(misstrauen)

allbus %>%
  frequency(nichtwahl)

# ---- Aufgabe 2: Spaltenprozente, die 87 % ----
allbus %>%
  crosstab(misstrauen, nichtwahl, percentages = "col")

# ---- Aufgabe 2: alle drei Prozentbasen ----
allbus %>%
  crosstab(misstrauen, nichtwahl, percentages = "all")

# ---- Aufgabe 3: Zeilenprozente, Gruppen vergleichen ----
allbus %>%
  crosstab(misstrauen, nichtwahl, percentages = "row")

# ---- Aufgabe 4: pe05 umgepolt prüfen ----
allbus %>%
  frequency(pe05_um)

# ---- Aufgabe 4: Gegenprobe ----
allbus %>%
  crosstab(misstrauen_pe05, nichtwahl, percentages = "row")

# ---- Aufgabe 4: zum Vergleich ohne Umpolen ----
allbus %>%
  crosstab(misstrauen_ohne, nichtwahl, percentages = "row")

# ---- Wiederholung: Chi-Quadrat ----
allbus %>%
  chi_square(misstrauen, nichtwahl)
'

stopifnot(grepl("library(tidyverse)\nlibrary(mariposa)", V$start, fixed = TRUE))

# Unabhängigkeit: Keine Vorlage außer dem Skript legt etwas mit <- ab
for (k in setdiff(names(V), c("start", "skript"))) stopifnot(!grepl("<-", V[[k]], fixed = TRUE))

# Hilfen für Prüfungen außerhalb der Vorlagen (gleiche Regeln wie in den Vorlagen)
mit_gruppen <- function(daten) {
  daten %>%
    mutate(
      teilzeit   = rec(work, rules = "2:3=1 [Teilzeit]; 1=0 [Vollzeit]; else=NA"),
      misstrauen = rec(pe01, rules = "1:2=1 [misstraut]; 3:4=0 [misstraut nicht]; else=NA"),
      nichtwahl  = rec(pv01, rules = "91=1 [würde nicht wählen]; 1:90=0 [würde wählen]; else=NA")
    )
}

# =============================================================================================
abschnitt("Vorweg R lesen: rec() in mutate() und crosstab()")
# =============================================================================================
out <- laufen("r2_rec", V$r2_rec)
ok("R2 teilzeit: Vollzeit (0) N", freq_zeile(out, "Vollzeit")[1], 2193)
ok("R2 teilzeit: Teilzeit (1) N", freq_zeile(out, "Teilzeit")[1], 1169)
ok("R2 teilzeit: Vollzeit Valid %", freq_zeile(out, "Vollzeit")[3], 65.23, 0.005)
ok("R2 teilzeit: Teilzeit Valid %", freq_zeile(out, "Teilzeit")[3], 34.77, 0.005)
ok("R2 teilzeit: Total valid", freq_zeile(out, "Total valid")[1], 3362)
ok("R2 teilzeit: System (leer)", freq_zeile(out, "System")[1], 1884)
ok("R2 teilzeit: mean im Kopf", freq_kopf(out, "mean"), 0.35, 0.005)
ok("R2 Bild: Bauplatte nach mutate() hat 580 Spalten", ncol(mit_gruppen(allbus) %>% select(-misstrauen, -nichtwahl)), 580)

out <- laufen("r3_ct", V$r3_ct)
ct <- ct_lesen(out)
ok("R3 N (valid)", ct$valid, 3359)
ok("R3 Missing", ct$missing, 1887)
ok("R3 MANN Vollzeit", ct$n$MANN[1], 1379)
ok("R3 MANN Teilzeit", ct$n$MANN[2], 301)
ok("R3 MANN Total", ct$n$MANN[3], 1680)
ok("R3 FRAU Vollzeit", ct$n$FRAU[1], 805)
ok("R3 FRAU Teilzeit", ct$n$FRAU[2], 860)
ok("R3 FRAU Total", ct$n$FRAU[3], 1665)
ok("R3 DIVERS Vollzeit", ct$n$DIVERS[1], 8)
ok("R3 DIVERS Teilzeit", ct$n$DIVERS[2], 6)
ok("R3 DIVERS Total", ct$n$DIVERS[3], 14)
ok("R3 Total Vollzeit", ct$n$Total[1], 2192)
ok("R3 Total Teilzeit", ct$n$Total[2], 1167)
ok("R3 row % MANN Vollzeit", ct$pct$MANN$row[1], 82.1)
ok("R3 row % MANN Teilzeit", ct$pct$MANN$row[2], 17.9)
ok("R3 row % FRAU Vollzeit", ct$pct$FRAU$row[1], 48.3)
ok("R3 row % FRAU Teilzeit", ct$pct$FRAU$row[2], 51.7)
ok("R3 row % DIVERS Vollzeit", ct$pct$DIVERS$row[1], 57.1)
ok("R3 row % DIVERS Teilzeit", ct$pct$DIVERS$row[2], 42.9)
ok("R3 row % Total Vollzeit", ct$pct$Total$row[1], 65.3)
ok("R3 row % Total Teilzeit", ct$pct$Total$row[2], 34.7)
ok("R3 Teilzeit ohne Geschlechtsangabe (1.169 - 1.167)", 1169 - ct$n$Total[2], 2)

# =============================================================================================
abschnitt("Grundlage 1: Gruppen zuschneiden (work)")
# =============================================================================================
out <- capture.output(allbus %>% frequency(work))
w <- c(
  voll = freq_zeile(out, "VOLLZEIT, GANZTAGS")[1],
  teil = freq_zeile(out, "TEILZEIT")[1],
  neben = freq_zeile(out, "NEBENHER BERUFSTAE.")[1],
  nicht = freq_zeile(out, "NICHT ERWERBSTAETIG")[1],
  fehlt = freq_zeile(out, "Total missing")[1]
)
ok("G1 work: Vollzeit, ganztags", w[["voll"]], 2193)
ok("G1 work: Teilzeit", w[["teil"]], 784)
ok("G1 work: nebenher berufstätig", w[["neben"]], 385)
ok("G1 work: nicht erwerbstätig", w[["nicht"]], 1849)
ok("G1 work: ohne gültige Angabe (Total missing)", w[["fehlt"]], 35)
ok("G1 leer im Beispiel: 1.849 + 35", w[["nicht"]] + w[["fehlt"]], 1884)

anteil <- function(eins, null) round(100 * sum(w[eins]) / sum(w[c(eins, null)]), 1)
ok("G1 Zuschnitt A (Beispiel): 2+3 -> 1, 1 -> 0", anteil(c("teil", "neben"), "voll"), 34.8)
ok("G1 Zuschnitt B: nebenher leer", anteil("teil", "voll"), 26.3)
ok("G1 Zuschnitt C: nebenher -> Vollzeit", anteil("teil", c("voll", "neben")), 23.3)
ok("G1 Zuschnitt D: nicht erwerbstätig -> 0", anteil(c("teil", "neben"), c("voll", "nicht")), 22.4)
ok("G1 Zuschnitt E: wie else=0 (auch ohne Angabe -> 0)",
   anteil(c("teil", "neben"), c("voll", "nicht", "fehlt")), 22.3)
ok("G1 Zuschnitt F: nicht erwerbstätig -> 1", anteil(c("teil", "neben", "nicht"), "voll"), 57.9)

x <- allbus %>%
  mutate(
    b = rec(work, rules = "2=1 [Teilzeit]; 1=0 [Vollzeit]; else=NA"),
    c = rec(work, rules = "2=1 [Teilzeit]; 1,3=0 [Vollzeit]; else=NA"),
    d = rec(work, rules = "2:3=1 [Teilzeit]; 1=0 [Vollzeit]; 4=0; else=NA"),
    e = rec(work, rules = "2:3=1 [Teilzeit]; 1=0 [Vollzeit]; else=0")
  )
ok("G1 rec B Valid % Teilzeit", freq_zeile(capture.output(x %>% frequency(b)), "Teilzeit")[3], 26.34, 0.005)
ok("G1 rec C Valid % Teilzeit", freq_zeile(capture.output(x %>% frequency(c)), "Teilzeit")[3], 23.32, 0.005)
ok("G1 rec D Valid % Teilzeit", freq_zeile(capture.output(x %>% frequency(d)), "Teilzeit")[3], 22.43, 0.005)
out <- capture.output(x %>% frequency(e))
ok("G1 rec E (else=0) Valid % Teilzeit", freq_zeile(out, "Teilzeit")[3], 22.28, 0.005)
ok("G1 rec E (else=0) Vollzeit N (inkl. ohne Angabe)", freq_zeile(out, "Vollzeit")[1], 4077)
ok("G1 Kurz überlegen: else=0 -> Teilzeit-Anteil (Ziel 22,3)", freq_zeile(out, "Teilzeit")[3], 22.3, 0.1)
rm(x)

# =============================================================================================
abschnitt("Aufgabe 1: Gruppen bilden (pe01, pv01)")
# =============================================================================================
out <- laufen("a1_freq", V$a1_freq)
ok("A1 pe01 STIMME VOLL ZU", freq_zeile(out, "STIMME VOLL ZU")[1], 1144)
ok("A1 pe01 STIMME EHER ZU", freq_zeile(out, "STIMME EHER ZU")[1], 1486)
ok("A1 pe01 STIMME EHER NICHT ZU", freq_zeile(out, "STIMME EHER NICHT ZU")[1], 868)
ok("A1 pe01 STIMME GAR NICHT ZU", freq_zeile(out, "STIMME GAR NICHT ZU")[1], 100)
ok("A1 pe01 TNZ: SPLIT", freq_zeile(out, "TNZ: SPLIT")[1], 1596)
ok("A1 pe01 Total missing", freq_zeile(out, "Total missing")[1], 1648)

out <- laufen("a1_misstrauen (Platzhalter)", plain(V$a1_misstrauen))
ok("A1 Platzhalter: misstraut N", freq_zeile(out, "misstraut")[1], 1144)
ok("A1 Platzhalter: misstraut nicht N", freq_zeile(out, "misstraut nicht")[1], 2454)
out <- laufen("a1_misstrauen (gelöst)", loesen(V$a1_misstrauen, c("1" = "1:2", "2:4" = "3:4")))
ok("A1 Frage a1a: misstraut N", freq_zeile(out, "misstraut")[1], 2630)
ok("A1 misstraut nicht N", freq_zeile(out, "misstraut nicht")[1], 968)
ok("A1 misstraut Valid %", freq_zeile(out, "misstraut")[3], 73.10, 0.005)
ok("A1 misstrauen: Total valid", freq_zeile(out, "Total valid")[1], 3598)
ok("A1 misstrauen: System", freq_zeile(out, "System")[1], 1648)
ok("A1 Frage a1d: mean im Kopf von misstrauen", freq_kopf(out, "mean"), 0.73, 0.005)

out <- laufen("a1_nichtwahl", V$a1_nichtwahl)
ok("A1 Frage a1b: würde nicht wählen N", freq_zeile(out, "würde nicht wählen")[1], 236)
ok("A1 würde wählen N", freq_zeile(out, "würde wählen")[1], 3748)
ok("A1 würde nicht wählen Valid %", freq_zeile(out, "würde nicht wählen")[3], 5.92, 0.005)
ok("A1 nichtwahl: System", freq_zeile(out, "System")[1], 1262)
ok("A1 nichtwahl: mean im Kopf", freq_kopf(out, "mean"), 0.06, 0.005)

out <- laufen("a1_freq (Valid % für den Vergleich in der Probier-Werkstatt)", V$a1_freq)
ok("A1 pe01 Valid % STIMME VOLL ZU", freq_zeile(out, "STIMME VOLL ZU")[3], 31.80, 0.005)
ok("A1 pe01 Valid % STIMME EHER ZU", freq_zeile(out, "STIMME EHER ZU")[3], 41.30, 0.005)
ok("A1 pe01 Valid % STIMME EHER NICHT ZU", freq_zeile(out, "STIMME EHER NICHT ZU")[3], 24.12, 0.005)
ok("A1 pe01 Valid % STIMME GAR NICHT ZU", freq_zeile(out, "STIMME GAR NICHT ZU")[3], 2.78, 0.005)
ok("A1 Festlegen: 73,1 % ist mehr als zwei Drittel", as.numeric(2630 / 3598 > 2 / 3), 1)

out <- laufen("frei_a1", V$frei_a1)
ok("A1 frei: Kopf total N nach drop_na(nichtwahl)", freq_kopf(out, "total N"), 3984)
ok("A1 frei: Kopf valid N", freq_kopf(out, "valid N"), 2785)
ok("A1 frei: Valid % STIMME VOLL ZU", freq_zeile(out, "STIMME VOLL ZU")[3], 29.91, 0.005)
ok("A1 frei: Valid % STIMME EHER ZU", freq_zeile(out, "STIMME EHER ZU")[3], 40.32, 0.005)
ok("A1 frei: Valid % STIMME EHER NICHT ZU", freq_zeile(out, "STIMME EHER NICHT ZU")[3], 26.89, 0.005)
ok("A1 frei: Valid % STIMME GAR NICHT ZU", freq_zeile(out, "STIMME GAR NICHT ZU")[3], 2.87, 0.005)

out <- capture.output(allbus %>% frequency(pv01))
ok("A1 pv01 WUERDE NICHT WAEHLEN", freq_zeile(out, "WUERDE NICHT WAEHLEN")[1], 236)
ok("A1 pv01 NICHT WAHLBERECHTIGT", freq_zeile(out, "NICHT WAHLBERECHTIGT")[1], 186)
ok("A1 pv01 WEISS NICHT", freq_zeile(out, "WEISS NICHT")[1], 603)
ok("A1 pv01 VERWEIGERT", freq_zeile(out, "VERWEIGERT")[1], 306)
ok("A1 pv01 KEINE ANGABE", freq_zeile(out, "KEINE ANGABE")[1], 149)
ok("A1 pv01 DATENFEHLER: MFN", freq_zeile(out, "DATENFEHLER: MFN")[1], 18)
ok("A1 pv01 Total missing", freq_zeile(out, "Total missing")[1], 1262)

# =============================================================================================
abschnitt("Grundlage 2 und 3: drei Prozentbasen (sex x teilzeit), alle Zellwerte")
# =============================================================================================
ct <- ct_lesen(capture.output(mit_gruppen(allbus) %>% crosstab(sex, teilzeit, percentages = "all")))
soll <- list(
  MANN   = list(n = c(1379, 301, 1680), row = c(82.1, 17.9, 100), col = c(62.9, 25.8, 50.0), total = c(41.1, 9.0, 50.0)),
  FRAU   = list(n = c(805, 860, 1665), row = c(48.3, 51.7, 100), col = c(36.7, 73.7, 49.6), total = c(24.0, 25.6, 49.6)),
  DIVERS = list(n = c(8, 6, 14), row = c(57.1, 42.9, 100), col = c(0.4, 0.5, 0.4), total = c(0.2, 0.2, 0.4)),
  Total  = list(n = c(2192, 1167, 3359), row = c(65.3, 34.7, 100), col = c(100, 100, 100), total = c(65.3, 34.7, 100))
)
for (z in names(soll)) {
  for (s in 1:3) {
    ok(sprintf("G2 %s Spalte %d N", z, s), ct$n[[z]][s], soll[[z]]$n[s])
    for (b in c("row", "col", "total")) ok(sprintf("G2 %s Spalte %d %s %%", z, s, b), ct$pct[[z]][[b]][s], soll[[z]][[b]][s])
  }
}
ok("G2 Formel 860 / 1.665", round(100 * 860 / 1665, 1), 51.7)
ok("G2 Formel 860 / 1.167", round(100 * 860 / 1167, 1), 73.7)
ok("G2 Formel 860 / 3.359", round(100 * 860 / 3359, 1), 25.6)
ok("G2 Divers: eine Person anders = 1/14 in Prozentpunkten", round(100 / 14, 1), 7.1)
ok("G3 Prozentpunkte Frauen - Männer (Teilzeit, row %)", 51.7 - 17.9, 33.8, 0.001)
ok("G3 Verhältnis Frauen / Männer (gerundet auf 1 Stelle)", round(51.7 / 17.9, 1), 2.9)
ok("G3 Divers: 7 von 14", 100 * 7 / 14, 50)
ct <- ct_lesen(capture.output(mit_gruppen(allbus) %>% crosstab(teilzeit, sex, percentages = "col")))
ok("G3 Tauschprobe: col % Frau in Teilzeit", ct$pct$Teilzeit$col[2], 51.7)
ok("G3 Tauschprobe: col % Mann in Teilzeit", ct$pct$Teilzeit$col[1], 17.9)
ct <- ct_lesen(capture.output(mit_gruppen(allbus) %>% crosstab(sex, teilzeit, percentages = "row", weights = wghtpew)))
ok("G2 gewichtet: row % Frau Teilzeit", ct$pct$FRAU$row[2], 53.5)
ok("G2 gewichtet: row % Mann Teilzeit", ct$pct$MANN$row[2], 17.8)

# =============================================================================================
abschnitt("Aufgabe 2: Stimmt die 87 %?")
# =============================================================================================
ct <- ct_lesen(laufen("a2_ct (Platzhalter row)", plain(V$a2_ct)))
ok("A2 Platzhalter row: misstraut / nicht wählen", ct$pct$misstraut$row[2], 6.5)
ct <- ct_lesen(laufen("a2_ct (total)", loesen(V$a2_ct, c("row" = "total"))))
ok("A2 total %: misstraut / nicht wählen", ct$pct$misstraut$total[2], 4.6)
ct <- ct_lesen(laufen("a2_ct (gelöst col)", loesen(V$a2_ct, c("row" = "col"))))
ok("A2 Frage a2a (Wahl col): col % misstraut / nicht wählen", ct$pct$misstraut$col[2], 87.0)
ok("A2 Frage a2b: Zelle misstraut / nicht wählen", ct$n$misstraut[2], 127)
ok("A2 Frage a2c: Nichtwählende in der Tabelle (Total)", ct$n$Total[2], 146)
ok("A2 col % misstraut nicht / nicht wählen", ct$pct$`misstraut nicht`$col[2], 13.0)
ok("A2 N (valid)", ct$valid, 2785)
ok("A2 Missing", ct$missing, 2461)

ct <- ct_lesen(laufen("a2_all", V$a2_all))
ok("A2 all: row % misstraut / nicht wählen", ct$pct$misstraut$row[2], 6.5)
ok("A2 all: col % misstraut / nicht wählen", ct$pct$misstraut$col[2], 87.0)
ok("A2 all: total % misstraut / nicht wählen", ct$pct$misstraut$total[2], 4.6)
ok("A2 all: Misstrauende gesamt", ct$n$misstraut[3], 1956)
ok("A2 all: Misstrauende würden wählen", ct$n$misstraut[1], 1829)
ok("A2 all: misstraut nicht gesamt", ct$n$`misstraut nicht`[3], 829)
ok("A2 all: Zelle misstraut nicht / nicht wählen", ct$n$`misstraut nicht`[2], 19)
ok("A2 all: Tabelle gesamt", ct$n$Total[3], 2785)
ok("A2 all: misstraut nicht row %", ct$pct$`misstraut nicht`$row[1], 97.7)
ok("A2 all: misstraut nicht col % würde wählen", ct$pct$`misstraut nicht`$col[1], 30.7)
ok("A2 all: misstraut nicht col % Total", ct$pct$`misstraut nicht`$col[3], 29.8)
ok("A2 all: misstraut nicht total % würde wählen", ct$pct$`misstraut nicht`$total[1], 29.1)
ok("A2 all: misstraut nicht total % nicht wählen", ct$pct$`misstraut nicht`$total[2], 0.7)
ok("A2 all: misstraut col % würde wählen", ct$pct$misstraut$col[1], 69.3)
ok("A2 all: misstraut col % Total", ct$pct$misstraut$col[3], 70.2)
ok("A2 all: misstraut total % würde wählen", ct$pct$misstraut$total[1], 65.7)
ok("A2 all: Total row % nicht wählen", ct$pct$Total$row[2], 5.2)
ok("A2 Nenner-Bild 127/146", round(100 * 127 / 146, 1), 87.0)
ok("A2 Nenner-Bild 127/1956", round(100 * 127 / 1956, 1), 6.5)
ok("A2 Nenner-Bild 127/2785", round(100 * 127 / 2785, 1), 4.6)
ct <- ct_lesen(capture.output(mit_gruppen(allbus) %>% crosstab(misstrauen, nichtwahl, percentages = "all", weights = wghtpew)))
ok("A2 gewichtet: col % misstraut / nicht wählen", ct$pct$misstraut$col[2], 86.6)

ct <- ct_lesen(laufen("frei_a2", V$frei_a2))
ok("A2 frei: West misstraut row %", ct$pct$`ALTE BUNDESLAENDER`$row[2], 70.6)
ok("A2 frei: Ost misstraut row %", ct$pct$`NEUE BUNDESLAENDER`$row[2], 78.3)

# =============================================================================================
abschnitt("Aufgabe 3: Gehen Misstrauende nicht mehr wählen?")
# =============================================================================================
ct <- ct_lesen(laufen("a3_ct (Platzhalter col)", plain(V$a3_ct)))
ok("A3 Platzhalter col: misstraut / nicht wählen", ct$pct$misstraut$col[2], 87.0)
ok("A3 Platzhalter col: misstraut nicht / nicht wählen", ct$pct$`misstraut nicht`$col[2], 13.0)
ct <- ct_lesen(laufen("a3_ct (gelöst row)", loesen(V$a3_ct, c("col" = "row"))))
ok("A3 Frage a3b: row % misstraut / nicht wählen", ct$pct$misstraut$row[2], 6.5)
ok("A3 Frage a3c: row % misstraut nicht / nicht wählen", ct$pct$`misstraut nicht`$row[2], 2.3)
ok("A3 row % misstraut / würde wählen", ct$pct$misstraut$row[1], 93.5)
ok("A3 row % misstraut nicht / würde wählen", ct$pct$`misstraut nicht`$row[1], 97.7)
ok("A3 row % Total / würde wählen", ct$pct$Total$row[1], 94.8)
ok("A3 row % Total / nicht wählen", ct$pct$Total$row[2], 5.2)
ok("A3 Frage a3d: Prozentpunkte 6,5 - 2,3", ct$pct$misstraut$row[2] - ct$pct$`misstraut nicht`$row[2], 4.2, 0.001)
ok("A3 Verhältnis 6,5 / 2,3 (gerundet)", round(6.5 / 2.3, 1), 2.8)
out <- laufen("frei_a3", V$frei_a3)
p <- eval(parse(text = V$frei_a3), envir = list2env(list(allbus = FRISCH), parent = parent.env(globalenv())))
ok("A3 frei: Balken auf 100 % zählt 2.785 Befragte", nrow(p$data), 2785)

# =============================================================================================
abschnitt("Grundlage 4: Umpolen (ep01)")
# =============================================================================================
out <- capture.output(allbus %>% frequency(ep01))
ok("G4 ep01 SEHR GUT (1)", freq_zeile(out, "SEHR GUT")[1], 95)
ok("G4 ep01 GUT (2)", freq_zeile(out, "GUT")[1], 1338)
ok("G4 ep01 TEILS/TEILS (3)", freq_zeile(out, "TEILS/TEILS")[1], 2684)
ok("G4 ep01 SCHLECHT (4)", freq_zeile(out, "SCHLECHT")[1], 919)
ok("G4 ep01 SEHR SCHLECHT (5)", freq_zeile(out, "SEHR SCHLECHT")[1], 158)
ok("G4 ep01 gültig", freq_zeile(out, "Total valid")[1], 5194)
ok("G4 ep01 mean vorher", freq_kopf(out, "mean"), 2.94, 0.005)
out <- capture.output(allbus %>% mutate(wirtschaft_um = rec(ep01, rules = "rev")) %>% frequency(wirtschaft_um))
ok("G4 nach rev: Code von GUT (Kurz überlegen, Ziel 4)", freq_code(out, "GUT"), 4)
ok("G4 nach rev: Code von SEHR GUT", freq_code(out, "SEHR GUT"), 5)
ok("G4 nach rev: GUT N unverändert", freq_zeile(out, "GUT")[1], 1338)
ok("G4 nach rev: Code von SEHR SCHLECHT", freq_code(out, "SEHR SCHLECHT"), 1)
ok("G4 mean nachher", freq_kopf(out, "mean"), 3.06, 0.005)
ok("G4 Formel: 6 - 2,94 = 3,06", 6 - 2.94, 3.06, 0.001)

# =============================================================================================
abschnitt("Aufgabe 4: Gegenprobe mit pe05 (Umpolen)")
# =============================================================================================
out <- laufen("a4_um", V$a4_um)
ok("A4 Frage a4a: Code 1 nach rev = STIMME GAR NICHT ZU", freq_code(out, "STIMME GAR NICHT ZU"), 1)
ok("A4 nach rev: STIMME GAR NICHT ZU N", freq_zeile(out, "STIMME GAR NICHT ZU")[1], 578)
ok("A4 nach rev: STIMME EHER NICHT ZU N", freq_zeile(out, "STIMME EHER NICHT ZU")[1], 1476)
ok("A4 nach rev: STIMME EHER ZU N", freq_zeile(out, "STIMME EHER ZU")[1], 1399)
ok("A4 nach rev: Code 4 = STIMME VOLL ZU", freq_code(out, "STIMME VOLL ZU"), 4)
ok("A4 nach rev: STIMME VOLL ZU N", freq_zeile(out, "STIMME VOLL ZU")[1], 149)
ok("A4 nach rev: TNZ: SPLIT bleibt", freq_zeile(out, "TNZ: SPLIT")[1], 1596)

ct <- ct_lesen(laufen("a4_mutate (Platzhalter)", plain(V$a4_mutate)))
ok("A4 Platzhalter (nur 1): row % misstraut / nicht wählen", ct$pct$misstraut$row[2], 10.6)
ok("A4 Platzhalter (nur 1): row % misstraut nicht / nicht wählen", ct$pct$`misstraut nicht`$row[2], 4.2)
ok("A4 Platzhalter (nur 1): row % misstraut / würde wählen", ct$pct$misstraut$row[1], 89.4)
ok("A4 Platzhalter (nur 1): row % misstraut nicht / würde wählen", ct$pct$`misstraut nicht`$row[1], 95.8)
ct <- ct_lesen(laufen("a4_mutate (gelöst)", loesen(V$a4_mutate, c("1" = "1:2", "2:4" = "3:4"))))
ok("A4 Frage a4b: row % misstraut / nicht wählen", ct$pct$misstraut$row[2], 6.9)
ok("A4 Frage a4c: row % misstraut nicht / nicht wählen", ct$pct$`misstraut nicht`$row[2], 3.2)
ok("A4 Zelle misstraut / nicht wählen", ct$n$misstraut[2], 104)
ok("A4 Misstrauende gesamt", ct$n$misstraut[3], 1512)
ok("A4 übrige gesamt", ct$n$`misstraut nicht`[3], 1267)
ok("A4 row % misstraut / würde wählen", ct$pct$misstraut$row[1], 93.1)
ok("A4 row % misstraut nicht / würde wählen", ct$pct$`misstraut nicht`$row[1], 96.8)
ok("A4 N (valid)", ct$valid, 2779)

ct <- ct_lesen(laufen("a4_ohne", V$a4_ohne))
ok("A4 ohne Umpolen: row % „misstraut“ / nicht wählen", ct$pct$misstraut$row[2], 3.2)
ok("A4 ohne Umpolen: row % „misstraut nicht“ / nicht wählen", ct$pct$`misstraut nicht`$row[2], 6.9)
ok("A4 ohne Umpolen: „misstraut“ gesamt (eigentlich Vertrauende)", ct$n$misstraut[3], 1267)

ct <- ct_lesen(laufen("frei_a4", V$frei_a4))
ok("A4 frei pa35: row % misstraut / nicht wählen", ct$pct$misstraut$row[2], 8.3)
ok("A4 frei pa35: row % misstraut nicht / nicht wählen", ct$pct$`misstraut nicht`$row[2], 3.5)
ct <- ct_lesen(laufen("frei_a4 (Variante 1:3=1)",
                      sub('"1:2=1 [misstraut]; 3:5=0 [misstraut nicht]; else=NA"',
                          '"1:3=1 [misstraut]; 4:5=0 [misstraut nicht]; else=NA"', V$frei_a4, fixed = TRUE)))
ok("A4 frei pa35 mit 1:3=1: row % misstraut / nicht wählen", ct$pct$misstraut$row[2], 6.6)
ok("A4 frei pa35 mit 1:3=1: row % misstraut nicht / nicht wählen", ct$pct$`misstraut nicht`$row[2], 1.8)

# =============================================================================================
abschnitt("Überblick: Chi-Quadrat (Wiederholung)")
# =============================================================================================
out <- laufen("ueb_chi", V$ueb_chi)
z <- out[grepl("chi2\\(", out)][1]
ok("Ü chi2", as.numeric(sub(".*= ([0-9.]+),.*", "\\1", z)), 20.685, 0.0005)
ok("Ü df", as.numeric(sub(".*chi2\\(([0-9]+)\\).*", "\\1", z)), 1)
stopifnot(grepl("p < 0.001", z, fixed = TRUE))
ok("Ü N", as.numeric(sub(".*N = ([0-9]+).*", "\\1", z)), 2785)
ok("Ü V im Text", as.numeric(sub(".*V = ([0-9.]+).*", "\\1", z)), 0.086, 0.0005)
stopifnot(grepl("(negligible)", z, fixed = TRUE), grepl("p < 0.001 ***", z, fixed = TRUE))
tab <- table(mit_gruppen(allbus)$misstrauen, mit_gruppen(allbus)$nichtwahl)
erwartet <- outer(rowSums(tab), colSums(tab)) / sum(tab)
ok("Ü kleinste erwartete Häufigkeit (gut 43)", round(min(erwartet), 1), 43.5)
ok("Ü Split-Anteil (1.596 von 5.246, gerundet)", round(100 * 1596 / 5246), 30)

# =============================================================================================
abschnitt("Skript zum Mitnehmen (als Ganzes, frische Umgebung)")
# =============================================================================================
skript <- sub('allbus <- read_spss("ZA8831_v1-3-0.sav")', "allbus <- FRISCH_KOPIE", V$skript, fixed = TRUE)
stopifnot(!identical(skript, V$skript))
FRISCH_KOPIE <- FRISCH
umgebung <- new.env(parent = parent.env(globalenv()))
umgebung$FRISCH_KOPIE <- FRISCH
out <- capture.output({
  for (a in parse(text = skript)) {
    wert <- withVisible(eval(a, envir = umgebung))
    if (wert$visible) print(wert$value)
  }
})
ok("Skript: allbus hat danach 585 Spalten (6 neue)", ncol(umgebung$allbus), 585)
ok("Skript: Spaltenprozent 87,0 kommt vor", sum(grepl("87.0%", out, fixed = TRUE)) >= 1, 1)
ok("Skript: Gegenprobe 6.9% kommt vor", sum(grepl("6.9%", out, fixed = TRUE)) >= 1, 1)
stopifnot(identical(FRISCH, allbus))

# =============================================================================================
abschnitt("Fehlermeldungen dieser Sitzung (Wortlaut für die Fehlerhilfe)")
# =============================================================================================
fehler <- function(name, ausdruck, muster) {
  m <- tryCatch({ force(ausdruck); "kein Fehler" }, error = function(e) conditionMessage(e))
  if (!grepl(muster, m, fixed = TRUE)) stop(name, ": unerwartete Meldung: ", m)
  cat(sprintf("  ok  Fehler %-34s enthält: %s\n", name, muster))
}
fehler("Variable nicht gebildet (frequency)", capture.output(allbus %>% frequency(misstrauen)), "doesn't exist")
fehler("Variable nicht gebildet (crosstab)", capture.output(allbus %>% crosstab(misstrauen, nichtwahl)), "not found in data")
fehler("%>% nach mutate() fehlt",
       eval(parse(text = 'allbus %>% mutate(misstrauen = rec(pe01, rules = "1:2=1; 3:4=0; else=NA"))
                          crosstab(misstrauen, pv01, percentages = "row")'),
            envir = list2env(list(allbus = FRISCH), parent = parent.env(globalenv()))),
       "nicht gefunden")
fehler("Komma statt Semikolon",
       allbus %>% mutate(m = rec(pe01, rules = "1:2=1 [misstraut], 3:4=0 [misstraut nicht], else=NA")),
       "Invalid new value")
fehler("Wörter statt Codes", allbus %>% mutate(m = rec(pe01, rules = "STIMME VOLL ZU=1; else=NA")), "Invalid old value")
fehler("== in der Regel", allbus %>% mutate(m = rec(pe01, rules = "1:2==1; 3:4=0; else=NA")), "Invalid new value")
fehler("rules ohne Namen", allbus %>% mutate(m = rec(pe01, "1:2=1; 3:4=0; else=NA")), "`rules` is required")
fehler("Regel ohne Anführungszeichen", allbus %>% mutate(m = rec(pe01, rules = misstraut)), "nicht gefunden")
out <- capture.output(allbus %>% mutate(m = rec(pv01, rules = "91=1 [nicht]; 1:90=0 [wählen]; -8=2 [weiß nicht]; else=NA")) %>% frequency(m))
stopifnot(!any(grepl("weiß nicht", out, fixed = TRUE)), freq_zeile(out, "System")[1] == 1262)
cat("  ok  Fehlerhilfe: Regel -8=2 erzeugt still keine Gruppe (System bleibt 1.262)\n")
fehler("percentages falsch geschrieben", capture.output(allbus %>% crosstab(pe01, sex, percentages = "column")), "row")

cat("\nAlle Zahlen und Vorlagen von Sitzung 5 geprüft; jede Vorlage lief in frischer Umgebung.\n")
