# Sitzung 7 „Mittelwerte vergleichen“: alle Zahlen des Kapitels und jede Codevorlage einmal ausgeführt.
# Daten: ALLBUS 2023, ZA8831 v1.3.0, gewichtet mit wghtpew (wie ab Sitzung 6), nur Aggregate.
# Pakete: tidyverse, mariposa 0.7.4.
# Aufruf:  Rscript sitzung07-zahlen.R
#   oder:  ALLBUS_SAV=/pfad/ZA8831_v1-3-0.sav Rscript sitzung07-zahlen.R
# Bricht mit Fehler ab, sobald eine Zahl nicht zum Plan (sitzung07.md) passt.
# Laufzeit etwa 20 Sekunden (die Stichproben-Maschine zieht 2 x 1.000 Stichproben).

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
# Hilfsfunktionen
# ---------------------------------------------------------------------------------------------
ok <- function(name, ist, soll, tol = 0) {
  if (is.na(ist) || abs(ist - soll) > tol + 1e-9) stop(sprintf("%s: ist %s, soll %s", name, ist, soll))
  cat(sprintf("  ok  %-66s %s\n", name, format(soll, big.mark = ".", decimal.mark = ",")))
}

# Gedruckte Ausgabe als Text (genau das, was Studierende sehen)
ausgabe <- function(x) capture.output(print(x))

# Prüft, ob eine Zeile der Ausgabe alle Stücke in dieser Reihenfolge enthält (Leerraum dazwischen egal)
zeile <- function(text, ...) {
  teile <- c(...)
  muster <- paste(vapply(teile, function(s) gsub("([][{}()+*^$|\\\\?.])", "\\\\\\1", s), ""), collapse = "\\s+")
  if (!any(grepl(muster, text, perl = TRUE))) {
    stop("In der Ausgabe nicht gefunden: ", paste(teile, collapse = " | "))
  }
  cat(sprintf("  ok  Zeile: %s\n", paste(teile, collapse = "  ")))
}

# Fehlermeldung einer Vorlage (für „Hilfe bei R-Fehlermeldungen“)
meldung <- function(expr) tryCatch({ force(expr); "KEIN FEHLER" }, error = function(e) conditionMessage(e))
meldet <- function(text, stueck) {
  if (!grepl(stueck, text, fixed = TRUE)) stop("Fehlermeldung enthält nicht: ", stueck, "\n", text)
  cat(sprintf("  ok  Meldung enthält: %s\n", stueck))
}

ungewichtet_n <- function(data, var, gruppe) {
  data %>% filter(!is.na({{ var }}), !is.na({{ gruppe }})) %>% count({{ gruppe }}) %>% pull(n)
}

# =============================================================================================
cat("\n== Vorweg: R lesen (Vorlage r_ttest) ==\n")
# =============================================================================================
# Vorlage r_ttest (Code-Werkstatt in „R lesen“)
r_ttest <- allbus %>%
  mutate(
    geschlecht = rec(sex, rules = "1=1 [Mann]; 2=2 [Frau]; else=NA")
  ) %>%
  t_test(dw15, group = geschlecht, weights = wghtpew) %>%
  summary()
txt <- ausgabe(r_ttest)
zeile(txt, "Groups compared: Mann vs. Frau")
zeile(txt, "Mann", "1530", "41.609", "8.443", "0.216")
zeile(txt, "Frau", "1427", "33.620", "10.287", "0.272")
zeile(txt, "Equal variances assumed", "23.144", "2955", "<.001", "7.988", "0.345", "7.311", "8.665")
zeile(txt, "Equal variances not assumed", "22.988", "2763.588", "<.001", "7.988", "0.348", "7.307", "8.670")
zeile(txt, "dw15", "0.852", "0.851", "0.946", "large")
# Kurzfassung ohne summary()
txt_kurz <- ausgabe(allbus %>%
  mutate(geschlecht = rec(sex, rules = "1=1 [Mann]; 2=2 [Frau]; else=NA")) %>%
  t_test(dw15, group = geschlecht, weights = wghtpew))
zeile(txt_kurz, "t(2763.6) = 22.988, p < 0.001 ***, g = 0.851 (large), N = 2957")
# sex hat drei Ausprägungen: 18 „divers“, 10 fehlend
sex_tab <- table(as.numeric(allbus$sex), useNA = "ifany")
ok("sex: Männer", sex_tab[["1"]], 2546)
ok("sex: Frauen", sex_tab[["2"]], 2672)
ok("sex: divers", sex_tab[["3"]], 18)
ok("sex: fehlend", sum(is.na(allbus$sex)), 10)
# Gewichtete gegen gezählte Fallzahl (Männer/Frauen mit Arbeitsstunden)
mf <- allbus %>% mutate(geschlecht = rec(sex, rules = "1=1 [Mann]; 2=2 [Frau]; else=NA"))
n_dw <- ungewichtet_n(mf, dw15, geschlecht)
ok("dw15: gezählte Männer", n_dw[1], 1491)
ok("dw15: gezählte Frauen", n_dw[2], 1442)
ok("dw15: gezählte Männer und Frauen zusammen (Bericht in Ü2)", sum(n_dw), 2933)

# =============================================================================================
cat("\n== Grundlage 1: Stichproben-Maschine, t, p, Konfidenzintervall, Effektstärke ==\n")
# =============================================================================================
# „Bevölkerung“ = gewichteter ALLBUS; je Stichprobe 50 Männer und 50 Frauen, gezogen mit
# Wahrscheinlichkeit proportional zu wghtpew (mit Zurücklegen); 1.000 Stichproben je Variable.
pop <- allbus %>%
  transmute(sex = as.numeric(sex), dw15 = as.numeric(dw15), ls01 = as.numeric(ls01), w = as.numeric(wghtpew)) %>%
  filter(sex %in% 1:2)
ziehen <- function(v, n = 50, reps = 1000, seed = 2026) {
  set.seed(seed)
  d <- pop %>% filter(!is.na(.data[[v]]))
  m <- d %>% filter(sex == 1)
  f <- d %>% filter(sex == 2)
  map_dfr(1:reps, function(i) {
    a <- sample(m[[v]], n, replace = TRUE, prob = m$w)
    b <- sample(f[[v]], n, replace = TRUE, prob = f$w)
    tt <- t.test(a, b)
    tibble(i = i, maenner = mean(a), frauen = mean(b), diff = mean(a) - mean(b),
           lo = tt$conf.int[1], hi = tt$conf.int[2], t = unname(tt$statistic), p = tt$p.value)
  })
}
s_dw <- ziehen("dw15")
s_ls <- ziehen("ls01")
wahr_dw <- with(pop %>% filter(!is.na(dw15)),
  weighted.mean(dw15[sex == 1], w[sex == 1]) - weighted.mean(dw15[sex == 2], w[sex == 2]))
wahr_ls <- with(pop %>% filter(!is.na(ls01)),
  weighted.mean(ls01[sex == 1], w[sex == 1]) - weighted.mean(ls01[sex == 2], w[sex == 2]))
ok("wahrer Unterschied Arbeitsstunden", round(wahr_dw, 2), 7.99)
ok("wahrer Unterschied Lebenszufriedenheit", round(wahr_ls, 2), -0.01)

# Die ersten 20 Stichproben (für „Neue Stichprobe ziehen“), gerundet wie im Plan
erste_dw <- s_dw %>% slice(1:20) %>% transmute(i, maenner = round(maenner, 1), frauen = round(frauen, 1),
  diff = round(diff, 1), lo = round(lo, 1), hi = round(hi, 1), t = round(t, 2), p = round(p, 3))
erste_ls <- s_ls %>% slice(1:20) %>% transmute(i, maenner = round(maenner, 2), frauen = round(frauen, 2),
  diff = round(diff, 2), lo = round(lo, 2), hi = round(hi, 2), t = round(t, 2), p = round(p, 2))
print(as.data.frame(erste_dw))
print(as.data.frame(erste_ls))
plan_dw_diff <- c(8.4, 8.1, 8.8, 6.0, 5.9, 6.8, 8.4, 11.3, 8.4, 8.1, 7.1, 5.9, 8.4, 7.1, 7.2, 6.1, 10.8, 8.7, 8.0, 6.1)
plan_dw_lo   <- c(5.1, 4.5, 5.2, 2.3, 1.5, 2.9, 4.7, 7.5, 4.9, 4.1, 3.7, 1.8, 4.8, 4.2, 3.8, 2.0, 6.7, 4.5, 4.0, 2.3)
plan_dw_hi   <- c(11.6, 11.6, 12.4, 9.7, 10.2, 10.7, 12.2, 15.1, 11.9, 12.2, 10.6, 10.0, 11.9, 10.0, 10.5, 10.2, 14.9, 12.8, 12.1, 9.9)
plan_ls_diff <- c(-0.50, 0.24, -0.16, -0.34, -0.02, -0.32, -0.14, -0.10, -0.08, 0.16, -0.42, -0.60, 0.50, -0.08, -0.38, 0.24, 0.10, -0.30, 0.28, -0.28)
plan_ls_p    <- c(0.16, 0.47, 0.66, 0.40, 0.96, 0.43, 0.73, 0.81, 0.83, 0.66, 0.24, 0.11, 0.11, 0.82, 0.36, 0.52, 0.77, 0.44, 0.46, 0.49)
stopifnot(all(abs(erste_dw$diff - plan_dw_diff) < 1e-9), all(abs(erste_dw$lo - plan_dw_lo) < 1e-9),
          all(abs(erste_dw$hi - plan_dw_hi) < 1e-9), all(abs(erste_ls$diff - plan_ls_diff) < 1e-9),
          all(abs(erste_ls$p - plan_ls_p) < 1e-9))
cat("  ok  die ersten 20 Stichproben stimmen mit dem Plan überein\n")
stopifnot(all(erste_dw$p < 0.05))
ok("Arbeitsstunden: Stichproben 1-20 mit p < 0,05", sum(erste_dw$p < 0.05), 20)
ok("Arbeitsstunden: größtes p der ersten 20 (gerundet)", max(round(s_dw$p[1:20], 3)), 0.009)
ok("Lebenszufriedenheit: Stichproben 1-20 mit p < 0,05", sum(erste_ls$p < 0.05), 0)

# 1.000 Stichproben: Stapel (Histogramm) der Unterschiede
h_dw <- table(cut(round(s_dw$diff, 2), breaks = seq(1, 14, 1), right = FALSE))
plan_h_dw <- c(1, 3, 5, 33, 95, 163, 196, 214, 149, 89, 41, 9, 2)
stopifnot(all(as.integer(h_dw) == plan_h_dw), sum(h_dw) == 1000)
cat("  ok  Stapel Arbeitsstunden (Kisten 1 Stunde, 1 bis 14):", paste(plan_h_dw, collapse = " "), "\n")
# Lebenszufriedenheit: Kisten symmetrisch um 0 (nach Betrag), Unterschiede sind Vielfache von 0,02.
# Ein Unterschied genau auf einer Grenze (z. B. -0,80 oder 0,60) kommt in die äußere Kiste, 0 in die Kiste 0 bis 0,2.
# So enthalten die hervorgehobenen Kisten in Bild 1c-1 genau die Stichproben mit |Unterschied| >= 0,6.
d_ls <- round(s_ls$diff, 2)
stopifnot(all(abs(d_ls * 50 - round(d_ls * 50)) < 1e-6))
kiste_ls <- (-1)^(d_ls < 0) * (floor(abs(d_ls) / 0.2 + 1e-9) + 1)
h_ls <- table(factor(kiste_ls, levels = c(-6:-1, 1:6)))
plan_h_ls <- c(4, 16, 43, 101, 165, 176, 185, 159, 87, 42, 18, 4)
stopifnot(all(as.integer(h_ls) == plan_h_ls), sum(h_ls) == 1000)
cat("  ok  Stapel Lebenszufriedenheit (Kisten 0,2 nach Betrag, -1,2 bis 1,2):", paste(plan_h_ls, collapse = " "), "\n")
ok("Lebenszufriedenheit: Steine in den Kisten jenseits von -0,6 und 0,6", sum(plan_h_ls[c(1:3, 10:12)]), 127)
ok("Lebenszufriedenheit: größter Abstand von 0", max(abs(d_ls)), 1.14)
ok("Arbeitsstunden: Mittel der 1.000 Unterschiede", round(mean(s_dw$diff), 2), 7.99)
ok("Arbeitsstunden: Streuung der 1.000 Unterschiede (SD)", round(sd(s_dw$diff), 2), 1.83)
ok("Arbeitsstunden: kleinster Unterschied", round(min(s_dw$diff), 1), 1.5)
ok("Arbeitsstunden: größter Unterschied", round(max(s_dw$diff), 1), 13.8)
ok("Arbeitsstunden: Unterschied 0 oder kleiner", sum(s_dw$diff <= 0), 0)
ok("Arbeitsstunden: Stichproben mit p < 0,05", sum(s_dw$p < 0.05), 993)
ok("Arbeitsstunden: Intervalle, die 7,99 enthalten", sum(s_dw$lo <= wahr_dw & s_dw$hi >= wahr_dw), 963)
ok("Lebenszufriedenheit: Mittel der 1.000 Unterschiede", round(mean(s_ls$diff), 2), -0.01)
ok("Lebenszufriedenheit: Streuung der 1.000 Unterschiede (SD)", round(sd(s_ls$diff), 2), 0.38)
ok("Lebenszufriedenheit: Stichproben mit p < 0,05 (Fehlalarme)", sum(s_ls$p < 0.05), 54)
ok("Lebenszufriedenheit: |Unterschied| >= 0,5", sum(abs(round(s_ls$diff, 2)) >= 0.5), 199)
ok("Lebenszufriedenheit: |Unterschied| >= 0,6 (wie Stichprobe 12)", sum(abs(d_ls) >= 0.6), 127)
ok("Lebenszufriedenheit: |Unterschied| >= 0,8", sum(abs(round(s_ls$diff, 2)) >= 0.8), 42)
ok("Stichprobe 12: Unterschied", d_ls[12], -0.60)
ok("Stichprobe 12: p (gerundet)", round(s_ls$p[12], 2), 0.11)
ok("Lebenszufriedenheit: Intervalle, die -0,01 enthalten", sum(s_ls$lo <= wahr_ls & s_ls$hi >= wahr_ls), 945)

# Formel als Bausteine (ganze Stichprobe, Zahlen aus r_ttest)
se_dw <- sqrt(8.443^2 / 1530 + 10.287^2 / 1427)
ok("Standardfehler Arbeitsstunden: Wurzel aus 0,0466 + 0,0742", round(sqrt(0.0466 + 0.0742), 3), 0.348)
ok("Summe der Bausteine", 0.0466 + 0.0742, 0.1208)
ok("t Arbeitsstunden: 7,988 / 0,348", round(7.988 / 0.348, 2), 22.95)
ok("Quadrat 8,443^2 / 1530", round(8.443^2 / 1530, 4), 0.0466)
ok("Quadrat 10,287^2 / 1427", round(10.287^2 / 1427, 4), 0.0742)
se_50 <- sqrt(8.443^2 / 50 + 10.287^2 / 50)
ok("Baustein 8,443^2 / 50", round(8.443^2 / 50, 4), 1.4257)
ok("Baustein 10,287^2 / 50", round(10.287^2 / 50, 4), 2.1164)
ok("Standardfehler bei 50 je Gruppe", round(se_50, 2), 1.88)
ok("t bei 50 je Gruppe und 7,99 Stunden", round(7.988 / se_50, 1), 4.2)

# Lebenszufriedenheit Männer/Frauen, ganze Stichprobe
txt_ls <- ausgabe(mf %>% t_test(ls01, group = geschlecht, weights = wghtpew) %>% summary())
zeile(txt_ls, "Mann", "2519", "7.399", "1.913")
zeile(txt_ls, "Frau", "2619", "7.409", "1.925")
zeile(txt_ls, "Equal variances not assumed", "-0.187", "5130.525", ".852", "-0.010", "0.054", "-0.115", "0.095")
zeile(txt_ls, "ls01", "-0.005", "-0.005", "-0.005", "negligible")
ok("Standardfehler Lebenszufriedenheit (Bausteine)", round(sqrt(1.913^2 / 2519 + 1.925^2 / 2619), 3), 0.054)

# Effektstärke: Unterschied / gemeinsame Streuung (Arbeitsstunden)
sd_pool <- sqrt((1529 * 8.443^2 + 1426 * 10.287^2) / 2955)
ok("gemeinsame Streuung Arbeitsstunden", round(sd_pool, 2), 9.38)
ok("d = 7,988 / 9,38", round(7.988 / sd_pool, 2), 0.85)

# =============================================================================================
cat("\n== Grundlage 2: signifikant oder wichtig, Voraussetzungen, Welch ==\n")
# =============================================================================================
txt_li <- ausgabe(mf %>% t_test(li07, group = geschlecht, weights = wghtpew) %>% summary())
zeile(txt_li, "Mann", "2533", "4.519", "1.477")
zeile(txt_li, "Frau", "2620", "4.414", "1.488")
zeile(txt_li, "Equal variances not assumed", "2.555", "5147.565", ".011", "0.106", "0.041", "0.025", "0.186")
zeile(txt_li, "li07", "0.071", "0.071", "0.071", "negligible")

# n-Regler: Unterschied 0,3 Punkte, Streuung 2 in beiden Gruppen (konstruiert)
n_tab <- tibble(n = c(25, 50, 100, 200, 400, 800, 1600, 2500)) %>%
  mutate(se = 2 * sqrt(2 / n), t = 0.3 / se, df = 2 * n - 2, p = 2 * pt(-t, df),
         lo = 0.3 - qt(0.975, df) * se, hi = 0.3 + qt(0.975, df) * se)
print(as.data.frame(n_tab %>% mutate(across(c(se, t, lo, hi), ~ round(.x, 2)), p = round(p, 3))))
stopifnot(all(round(n_tab$t, 2) == c(0.53, 0.75, 1.06, 1.50, 2.12, 3.00, 4.24, 5.30)))
stopifnot(all(round(n_tab$p, 3) == c(0.598, 0.455, 0.290, 0.134, 0.034, 0.003, 0.000, 0.000)))
stopifnot(all(round(n_tab$lo, 2) == c(-0.84, -0.49, -0.26, -0.09, 0.02, 0.10, 0.16, 0.19)))
stopifnot(all(round(n_tab$hi, 2) == c(1.44, 1.09, 0.86, 0.69, 0.58, 0.50, 0.44, 0.41)))
cat("  ok  n-Regler: t, p und Intervalle wie im Plan\n")
ok("n-Regler: d bleibt 0,3 / 2", 0.3 / 2, 0.15)

# Welch gegen Student (konstruiert): A 400 Personen, SD 1; B 40 Personen, SD 3; Unterschied 0,8
n1 <- 400; n2 <- 40; s1 <- 1; s2 <- 3; dd <- 0.8
sp <- sqrt(((n1 - 1) * s1^2 + (n2 - 1) * s2^2) / (n1 + n2 - 2))
se_s <- sp * sqrt(1 / n1 + 1 / n2)
se_w <- sqrt(s1^2 / n1 + s2^2 / n2)
df_w <- se_w^4 / ((s1^2 / n1)^2 / (n1 - 1) + (s2^2 / n2)^2 / (n2 - 1))
ok("Student: Standardfehler", round(se_s, 2), 0.22)
ok("Student: t", round(dd / se_s, 2), 3.69)
ok("Student: p", round(2 * pt(-dd / se_s, n1 + n2 - 2), 4), 0.0003)
ok("Welch: Standardfehler", round(se_w, 2), 0.48)
ok("Welch: t", round(dd / se_w, 2), 1.68)
ok("Welch: df", round(df_w, 0), 40)
ok("Welch: p", round(2 * pt(-dd / se_w, df_w), 2), 0.10)
ok("Welch: Baustein 1^2/400", 1 / 400, 0.0025)
ok("Welch: Baustein 3^2/40", 9 / 40, 0.225)

# =============================================================================================
cat("\n== Grundlage 3: viele Paare, F, Tukey (Alter nach Erhebungsweg) ==\n")
# =============================================================================================
alarm <- tibble(k = 2:6, paare = choose(k, 2), risiko = round(100 * (1 - 0.95^paare), 1))
print(as.data.frame(alarm))
stopifnot(all(alarm$paare == c(1, 3, 6, 10, 15)), all(alarm$risiko == c(5.0, 14.3, 26.5, 40.1, 53.7)))
cat("  ok  Paare und Fehlalarm-Risiko wie im Plan\n")

# F-Labor: drei Gruppen à 6 Steine, Abweichungen (-2,-1,0,0,1,2) * s, Mittelwerte 5-a, 5, 5+a
labor <- expand_grid(s = c(0.5, 1, 2), a = c(0, 0.5, 1, 2)) %>%
  mutate(qs_z = 6 * 2 * a^2, qs_i = 3 * 10 * s^2, ms_z = qs_z / 2, ms_i = qs_i / 15,
         F = ms_z / ms_i, p = pf(F, 2, 15, lower.tail = FALSE), eta2 = qs_z / (qs_z + qs_i))
print(as.data.frame(labor %>% mutate(across(c(F, eta2), ~ round(.x, 3)), p = round(p, 3))))
stopifnot(all(round(labor$F, 2) == c(0, 3, 12, 48, 0, 0.75, 3, 12, 0, 0.19, 0.75, 3)))
stopifnot(all(round(labor$p, 3) == c(1, 0.080, 0.001, 0, 1, 0.489, 0.080, 0.001, 1, 0.831, 0.489, 0.080)))
stopifnot(all(round(labor$eta2, 2) == c(0, 0.29, 0.62, 0.86, 0, 0.09, 0.29, 0.62, 0, 0.02, 0.09, 0.29)))
cat("  ok  F-Labor: F, p und eta² wie im Plan\n")
# Kontrolle des F-Labors mit oneway_anova (Zustand s = 1, a = 1)
lab_d <- tibble(y = c(4 + c(-2, -1, 0, 0, 1, 2), 5 + c(-2, -1, 0, 0, 1, 2), 6 + c(-2, -1, 0, 0, 1, 2)),
                g = rep(1:3, each = 6))
zeile(ausgabe(lab_d %>% oneway_anova(y, group = g)), "F(2, 15) = 3.000, p = 0.080")

txt_am <- ausgabe(allbus %>% oneway_anova(age, group = mode, weights = wghtpew) %>% summary())
zeile(txt_am, "CAPI", "2002", "51.772", "18.258", "0.408", "50.972", "52.572")
zeile(txt_am, "CAWI", "1623", "46.749", "16.587", "0.412", "45.941", "47.556")
zeile(txt_am, "MAIL", "1599", "57.953", "18.250", "0.456", "57.058", "58.848")
zeile(txt_am, "Between Groups", "101483.969", "2", "50741.984", "160.989", "<.001")
zeile(txt_am, "Within Groups", "1645598.339", "5221", "315.188")
zeile(txt_am, "Total", "1747082.307", "5223")
zeile(txt_am, "Welch", "166.127", "2", "3415.671", "<.001")
zeile(txt_am, "age", "0.058", "0.058", "0.058", "small")
ok("F = 50741,984 / 315,188", round(50741.984 / 315.188, 2), 160.99)
ok("eta² = 101484 / 1747082", round(101483.969 / 1747082.307, 3), 0.058)
txt_amt <- ausgabe(allbus %>% oneway_anova(age, group = mode, weights = wghtpew) %>% tukey_test() %>% summary())
zeile(txt_amt, "CAPI - CAWI", "5.023", "0.593", "<.001", "3.633", "6.413")
zeile(txt_amt, "CAPI - MAIL", "-6.181", "0.595", "<.001", "-7.577", "-4.785")
zeile(txt_amt, "CAWI - MAIL", "-11.204", "0.626", "<.001", "-12.671", "-9.738")
zeile(ausgabe(allbus %>% oneway_anova(age, group = mode, weights = wghtpew)),
  "F(2, 5221) = 160.989, p < 0.001 ***, eta2 = 0.058 (small), N = 5224")
ok("größte durch kleinste SD (Alter nach Weg)", round(18.258 / 16.587, 2), 1.10)

# =============================================================================================
cat("\n== Grundlage 4: Korrelationsmatrix (age, dw15, ls01, hs01) ==\n")
# =============================================================================================
txt_g4 <- ausgabe(allbus %>% pearson_cor(age, dw15, ls01, hs01, weights = wghtpew) %>% summary())
zeile(txt_g4, "age", "1", "-0.036", "0.075***", "0.331***")
zeile(txt_g4, "dw15", "-0.036", "1", "0.025", "-0.031")
zeile(txt_g4, "ls01", "0.075***", "0.025", "1", "-0.380***")
zeile(txt_g4, "hs01", "0.331***", "-0.031", "-0.380***", "1")
zeile(txt_g4, "age", "5224", "2957", "5142", "5189")
zeile(txt_g4, "dw15", "2957", "2968", "2945", "2963")
zeile(txt_g4, "age x dw15", "-0.036", ".051")
zeile(txt_g4, "dw15 x ls01", "0.025", ".180")
zeile(txt_g4, "dw15 x hs01", "-0.031", ".087")
zeile(txt_g4, "ls01 x hs01", "-0.380", "<.001", "[-0.403, -0.357]", "5148")
ok("Paare bei 4 Variablen", choose(4, 2), 6)
ok("Paare bei 10 Variablen", choose(10, 2), 45)
ok("erwartete Fehlalarme bei 45 Paaren ohne Zusammenhang", 45 * 0.05, 2.25)

# =============================================================================================
cat("\n== Aufgabe 1 (Pflicht): Vertrauen in den Bundestag mit und ohne Abitur ==\n")
# =============================================================================================
# Vorlage a1_kurz, wie sie startet (markierte Stelle: age)
txt <- ausgabe(allbus %>%
  mutate(
    abitur = rec(educ, rules = "1:3=0 [ohne Abitur]; 4:5=1 [mit Abitur]; else=NA")
  ) %>%
  t_test(age, group = abitur, weights = wghtpew))
zeile(txt, "t(5059.1) = 22.239, p < 0.001 ***, g = 0.625 (medium), N = 5067")
# Vorlage a1_kurz, angepasst (age -> pt03)
txt <- ausgabe(allbus %>%
  mutate(
    abitur = rec(educ, rules = "1:3=0 [ohne Abitur]; 4:5=1 [mit Abitur]; else=NA")
  ) %>%
  t_test(pt03, group = abitur, weights = wghtpew))
zeile(txt, "t(3482.2) = -12.432, p < 0.001 ***, g = -0.419 (small), N = 3505")
# Vorlage a1_tabelle
a1 <- allbus %>%
  mutate(
    abitur = rec(educ, rules = "1:3=0 [ohne Abitur]; 4:5=1 [mit Abitur]; else=NA")
  ) %>%
  t_test(pt03, group = abitur, weights = wghtpew) %>%
  summary()
txt <- ausgabe(a1)
zeile(txt, "Groups compared: ohne Abitur vs. mit Abitur")
zeile(txt, "ohne Abitur", "1793", "3.688", "1.667", "0.039")
zeile(txt, "mit Abitur", "1712", "4.348", "1.474", "0.036")
zeile(txt, "Equal variances assumed", "-12.396", "3503", "<.001", "-0.660", "0.053", "-0.765", "-0.556")
zeile(txt, "Equal variances not assumed", "-12.432", "3482.193", "<.001", "-0.660", "0.053", "-0.764", "-0.556")
zeile(txt, "pt03", "-0.419", "-0.419", "-0.396", "small")
ok("A1: größte durch kleinste SD", round(1.667 / 1.474, 2), 1.13)
# Zahlen für Texte: pt03 nur in einer Fragebogenhälfte; gezählte Fälle je Gruppe
pt <- table(as.numeric(haven::read_sav(pfad, user_na = TRUE, col_select = "pt03")$pt03))
ok("pt03: gültig", sum(pt[as.numeric(names(pt)) > 0]), 3592)
ok("pt03: TNZ Split (-11)", pt[["-11"]], 1596)
ab <- allbus %>% mutate(abitur = rec(educ, rules = "1:3=0 [ohne Abitur]; 4:5=1 [mit Abitur]; else=NA"))
n_ab <- ungewichtet_n(ab, pt03, abitur)
ok("A1: gezählte Befragte ohne Abitur", n_ab[1], 1832)
ok("A1: gezählte Befragte mit Abitur", n_ab[2], 1681)
ed <- table(as.numeric(allbus$educ))
ok("educ 4 Fachhochschulreife", ed[["4"]], 625)
ok("educ 5 Hochschulreife", ed[["5"]], 1847)

# =============================================================================================
cat("\n== Aufgabe 2 (Zusatz): Lebenszufriedenheit mit und ohne Abitur ==\n")
# =============================================================================================
# Vorlage a2_alle
txt <- ausgabe(allbus %>%
  mutate(
    abitur = rec(educ, rules = "1:3=0 [ohne Abitur]; 4:5=1 [mit Abitur]; else=NA")
  ) %>%
  t_test(ls01, group = abitur, weights = wghtpew) %>%
  summary())
zeile(txt, "ohne Abitur", "2539", "7.239", "2.117", "0.042")
zeile(txt, "mit Abitur", "2487", "7.582", "1.682", "0.034")
zeile(txt, "Equal variances not assumed", "-6.361", "4820.264", "<.001", "-0.343", "0.054", "-0.448", "-0.237")
zeile(txt, "ls01", "-0.179", "-0.179", "-0.162", "negligible")
# Vorlage a2_jung
txt <- ausgabe(allbus %>%
  filter(age < 30) %>%
  mutate(
    abitur = rec(educ, rules = "1:3=0 [ohne Abitur]; 4:5=1 [mit Abitur]; else=NA")
  ) %>%
  t_test(ls01, group = abitur, weights = wghtpew) %>%
  summary())
zeile(txt, "ohne Abitur", "178", "6.449", "2.433", "0.182")
zeile(txt, "mit Abitur", "491", "7.435", "1.596", "0.072")
zeile(txt, "Equal variances assumed", "-6.077", "668", "<.001", "-0.986", "0.162", "-1.304", "-0.667")
zeile(txt, "Equal variances not assumed", "-5.033", "235.165", "<.001", "-0.986", "0.196", "-1.371", "-0.600")
zeile(txt, "ls01", "-0.531", "-0.530", "-0.405", "medium")
ok("A2: Breite Student-Intervall", round(-0.667 - -1.304, 3), 0.637)
ok("A2: Breite Welch-Intervall", round(-0.600 - -1.371, 3), 0.771)
ok("A2: größte durch kleinste SD (unter 30)", round(2.433 / 1.596, 2), 1.52)

# =============================================================================================
cat("\n== Aufgabe 3 (Pflicht): Links-rechts nach Wohnort ==\n")
# =============================================================================================
# Vorlage a3_anova, wie sie startet (markierte Stellen: age, mode) – siehe Grundlage 3 (gleiche Zahlen)
txt <- ausgabe(allbus %>%
  oneway_anova(age, group = mode, weights = wghtpew) %>%
  summary())
zeile(txt, "Between Groups", "101483.969", "2", "50741.984", "160.989", "<.001")
# Vorlage a3_anova, angepasst
txt <- ausgabe(allbus %>%
  oneway_anova(pa01, group = gs01, weights = wghtpew) %>%
  summary())
zeile(txt, "GROSSSTADT", "1053", "4.453", "1.855", "0.057", "4.341", "4.565")
zeile(txt, "VORORT GROSSSTADT", "643", "4.846", "1.680", "0.066", "4.715", "4.976")
zeile(txt, "MITTEL-, KLEINSTADT", "1719", "5.043", "1.747", "0.042", "4.960", "5.126")
zeile(txt, "LAENDL. DORF", "1452", "5.120", "1.697", "0.045", "5.033", "5.208")
zeile(txt, "EINZELHAUS, LAND", "62", "5.053", "1.905", "0.242", "4.568", "5.537")
zeile(txt, "Between Groups", "318.601", "4", "79.650", "26.015", "<.001")
zeile(txt, "Within Groups", "15069.633", "4922", "3.062")
zeile(txt, "Welch", "24.149", "4", "433.570", "<.001")
zeile(txt, "pa01", "0.021", "0.020", "0.020", "small")
ok("A3: größte durch kleinste SD", round(1.905 / 1.680, 2), 1.13)
ok("A3: eta² als Prozent", round(100 * 318.601 / 15388.234, 1), 2.1)
# Vorlage a3_tukey
a3t <- allbus %>%
  oneway_anova(pa01, group = gs01, weights = wghtpew) %>%
  tukey_test() %>%
  summary()
txt <- ausgabe(a3t)
zeile(txt, "GROSSSTADT - VORORT GROSSSTADT", "-0.393", "0.088", "<.001", "-0.632", "-0.154")
zeile(txt, "GROSSSTADT - MITTEL-, KLEINSTADT", "-0.590", "0.068", "<.001", "-0.777", "-0.403")
zeile(txt, "GROSSSTADT - LAENDL. DORF", "-0.668", "0.071", "<.001", "-0.861", "-0.474")
zeile(txt, "GROSSSTADT - EINZELHAUS, LAND", "-0.600", "0.229", ".067", "-1.225", "0.025")
zeile(txt, "VORORT GROSSSTADT - MITTEL-, KLEINSTADT", "-0.197", "0.081", ".105", "-0.418", "0.023")
zeile(txt, "VORORT GROSSSTADT - LAENDL. DORF", "-0.275", "0.083", ".008", "-0.501", "-0.048")
zeile(txt, "VORORT GROSSSTADT - EINZELHAUS, LAND", "-0.207", "0.233", ".901", "-0.843", "0.429")
zeile(txt, "MITTEL-, KLEINSTADT - LAENDL. DORF", "-0.077", "0.062", ".728", "-0.247", "0.093")
zeile(txt, "MITTEL-, KLEINSTADT - EINZELHAUS, LAND", "-0.010", "0.227", "1.000", "-0.628", "0.609")
zeile(txt, "LAENDL. DORF - EINZELHAUS, LAND", "0.068", "0.227", ".998", "-0.552", "0.688")
zeile(ausgabe(allbus %>% oneway_anova(pa01, group = gs01, weights = wghtpew) %>% tukey_test()),
  "pa01: 10 comparisons, 4 significant (p < .05)")
n_gs <- allbus %>% filter(!is.na(pa01), !is.na(gs01)) %>% count(gs01) %>% pull(n)
ok("A3: gezählte Befragte im Einzelhaus (mit pa01)", n_gs[5], 55)

# =============================================================================================
cat("\n== Aufgabe 4 (Zusatz): Vertrauen als Korrelationsmatrix ==\n")
# =============================================================================================
# Vorlage a4_matrix
txt <- ausgabe(allbus %>%
  pearson_cor(pt03, pt12, pt14, pt11, age, weights = wghtpew) %>%
  summary())
zeile(txt, "pt03", "1", "0.790***", "0.464***", "0.461***", "0.076***")
zeile(txt, "pt12", "0.790***", "1", "0.476***", "0.516***", "-0.007")
zeile(txt, "pt14", "0.464***", "0.476***", "1", "0.442***", "0.071***")
zeile(txt, "pt11", "0.461***", "0.516***", "0.442***", "1", "-0.080***")
zeile(txt, "pt03", "3589", "3574", "3578", "3492", "3577")
zeile(txt, "age", "3577", "3592", "3610", "3510", "5224")
zeile(txt, "pt12 x age", "-0.007", ".680")
zeile(txt, "pt03 x pt12", "0.790", "<.001", "[0.777, 0.802]", "3574")
zeile(txt, "pt03 x age", "0.076", "<.001", "[0.043, 0.108]", "3577")
r4 <- allbus %>% pearson_cor(pt03, pt12, pt14, pt11, age, weights = wghtpew)
zeile(ausgabe(r4), "9/10 pairs significant (p < .05), N = 3492-3610")

# =============================================================================================
cat("\n== Probier-Werkstätten (Weiterdenken) ==\n")
# =============================================================================================
# frei_a1: Vertrauen in die Polizei mit und ohne Abitur
zeile(ausgabe(allbus %>%
  mutate(
    abitur = rec(educ, rules = "1:3=0 [ohne Abitur]; 4:5=1 [mit Abitur]; else=NA")
  ) %>%
  t_test(pt14, group = abitur, weights = wghtpew)),
  "t(3525.5) = -2.833, p = 0.005 **, g = -0.095 (negligible), N = 3538")
# frei_a2: Befragte ab 65
zeile(ausgabe(allbus %>%
  filter(age >= 65) %>%
  mutate(
    abitur = rec(educ, rules = "1:3=0 [ohne Abitur]; 4:5=1 [mit Abitur]; else=NA")
  ) %>%
  t_test(ls01, group = abitur, weights = wghtpew)),
  "t(947.3) = -0.115, p = 0.908, g = -0.006 (negligible), N = 1392")
# frei_a3: Lebenszufriedenheit nach Familienstand
txt <- ausgabe(allbus %>%
  oneway_anova(ls01, group = mstat, weights = wghtpew) %>%
  tukey_test() %>%
  summary())
zeile(txt, "VERHEIRAT.ZUSAM.LEB. - LEDIG", "0.653", "0.061", "<.001")
zeile(txt, "GESCHIEDEN - LEDIG", "-0.059", "0.103", ".979")
zeile(ausgabe(allbus %>% oneway_anova(ls01, group = mstat, weights = wghtpew)),
  "F(4, 5142) = 39.756, p < 0.001 ***, eta2 = 0.030 (small), N = 5147")
# frei_a4: neun Vertrauensfragen
zeile(ausgabe(allbus %>%
  pearson_cor(pt01, pt02, pt03, pt08, pt09, pt10, pt12, pt14, pt15, weights = wghtpew)),
  "36/36 pairs significant (p < .05)")
ok("Paare bei 9 Variablen", choose(9, 2), 36)

# =============================================================================================
cat("\n== Hilfe bei R-Fehlermeldungen (Wortlaut mariposa 0.7.4) ==\n")
# =============================================================================================
m <- meldung(allbus %>% t_test(pt03, group = mode, weights = wghtpew))
meldet(m, "must have exactly 2 groups")
meldet(m, "For 3 or more groups use `oneway_anova()`")
m <- meldung(allbus %>% t_test(dw15, group = sex, weights = wghtpew))
meldet(m, "Found 3: \"MANN\", \"FRAU\", and \"DIVERS\"")
m <- meldung(allbus %>% t_test(pt03, group = abitur, weights = wghtpew))
meldet(m, "Column `abitur` doesn't exist")
m <- meldung(allbus %>% to_label(pa01) %>% oneway_anova(pa01, group = gs01, weights = wghtpew))
meldet(m, "is not numeric")
m <- meldung(allbus %>% oneway_anova(pa01, gs01, weights = wghtpew))
meldet(m, "Argument `group` is missing")
m <- meldung(allbus %>% oneway_anova(pa01, group = gs01, weight = wghtpew))
meldet(m, "Did you mean `weights` instead of `weight`?")
m <- meldung(allbus %>% t_test(ls01, group = eastwest, weights = wghtpew) %>% tukey_test())
meldet(m, "is not available for objects of class <t_test>")
m <- meldung(allbus %>% oneway_anova(pa01, group = gs01, weights = wghtpew) %>% summary() %>% tukey_test())
meldet(m, "summary.oneway_anova")
# to_label() bei der Gruppe ist dagegen kein Fehler
zeile(ausgabe(allbus %>% to_label(gs01) %>% oneway_anova(pa01, group = gs01, weights = wghtpew)),
  "F(4, 4922) = 26.015")
# t_test() ohne „group =“: keine Fehlermeldung, sondern je Variable ein Test gegen 0 (riesiges t)
txt <- ausgabe(allbus %>%
  mutate(
    abitur = rec(educ, rules = "1:3=0 [ohne Abitur]; 4:5=1 [mit Abitur]; else=NA")
  ) %>%
  t_test(pt03, abitur, weights = wghtpew))
zeile(txt, "t-Test: pt03 [Weighted]")
zeile(txt, "t-Test: abitur [Weighted]")
stopifnot(!any(grepl("Groups compared", txt, fixed = TRUE)))
cat("  ok  t_test() ohne group = rechnet ohne Meldung zwei Tests gegen 0\n")

# =============================================================================================
cat("\n== Überblick und Prüf dich selbst ==\n")
# =============================================================================================
ok("Prüf dich: Paare bei 4 Gruppen", choose(4, 2), 6)
ok("Prüf dich: Fehlalarm-Risiko bei 6 Paaren (%)", round(100 * (1 - 0.95^6), 1), 26.5)


# =============================================================================================
cat("\n== Jede Vorlage für sich: Wortlaut aus sitzung07.md, frische Umgebung nur mit allbus ==\n")
# =============================================================================================
# Die Code-Werkstatt setzt allbus vor jedem Ausführen zurück. Darum läuft hier jede Vorlage in einer
# eigenen Umgebung, die nur allbus kennt (Pakete über den Suchpfad, keine Objekte aus diesem Skript).
# Der Code-Text ist aus den ```r-Blöcken des Plans übernommen (⟦ ⟧ entfernt); *_angepasst = nach dem Tausch.
frisch_ausfuehren <- function(name, code, erwartet) {
  env <- new.env(parent = parent.env(globalenv()))
  assign("allbus", read_spss(pfad), envir = env)
  text <- capture.output(for (ausdruck in parse(text = code)) print(eval(ausdruck, envir = env)))
  stopifnot(identical(ls(env), "allbus"))
  for (e in erwartet) {
    teile <- strsplit(e, "  ", fixed = TRUE)[[1]]
    zeile(text, teile)
  }
  cat(sprintf("  ok  Vorlage %s läuft für sich\n", name))
}
vorlagen <- list(
  r_ttest = list(code = r"(# t-Test: Arbeitsstunden von Männern und Frauen, gewichtet
allbus %>%
  mutate(
    geschlecht = rec(sex, rules = "1=1 [Mann]; 2=2 [Frau]; else=NA")
  ) %>%
  t_test(dw15, group = geschlecht, weights = wghtpew) %>%
  summary())", erwartet = c("Equal variances not assumed  22.988  2763.588")),
  a1_kurz = list(code = r"(# t-Test: Unterschied zwischen ohne und mit Abitur, gewichtet
allbus %>%
  mutate(
    abitur = rec(educ, rules = "1:3=0 [ohne Abitur]; 4:5=1 [mit Abitur]; else=NA")
  ) %>%
  t_test(age, group = abitur, weights = wghtpew))", erwartet = c("t(5059.1) = 22.239, p < 0.001 ***, g = 0.625 (medium), N = 5067")),
  a1_kurz_angepasst = list(code = r"(# t-Test: Unterschied zwischen ohne und mit Abitur, gewichtet
allbus %>%
  mutate(
    abitur = rec(educ, rules = "1:3=0 [ohne Abitur]; 4:5=1 [mit Abitur]; else=NA")
  ) %>%
  t_test(pt03, group = abitur, weights = wghtpew))", erwartet = c("t(3482.2) = -12.432, p < 0.001 ***, g = -0.419 (small), N = 3505")),
  a1_tabelle = list(code = r"(# Dieselbe Rechnung mit der ganzen Tabelle
# abitur bilden: wie in Schritt 1
allbus %>%
  mutate(
    abitur = rec(educ, rules = "1:3=0 [ohne Abitur]; 4:5=1 [mit Abitur]; else=NA")
  ) %>%
  t_test(pt03, group = abitur, weights = wghtpew) %>%
  summary())", erwartet = c("Equal variances not assumed  -12.432  3482.193  <.001  -0.660")),
  frei_a1 = list(code = r"(# Eine Idee: Vertrauen in die Polizei (pt14) mit und ohne Abitur
# abitur bilden: wie in Schritt 1
allbus %>%
  mutate(
    abitur = rec(educ, rules = "1:3=0 [ohne Abitur]; 4:5=1 [mit Abitur]; else=NA")
  ) %>%
  t_test(pt14, group = abitur, weights = wghtpew))", erwartet = c("t(3525.5) = -2.833, p = 0.005 **, g = -0.095 (negligible), N = 3538")),
  a2_alle = list(code = r"(# Lebenszufriedenheit ohne und mit Abitur, alle Befragten
# abitur bilden: wie in Aufgabe 1
allbus %>%
  mutate(
    abitur = rec(educ, rules = "1:3=0 [ohne Abitur]; 4:5=1 [mit Abitur]; else=NA")
  ) %>%
  t_test(ls01, group = abitur, weights = wghtpew) %>%
  summary())", erwartet = c("ls01  -0.179  -0.179  -0.162  negligible")),
  a2_jung = list(code = r"(# Dasselbe nur für Befragte unter 30 Jahren
# abitur bilden: wie in Aufgabe 1
allbus %>%
  filter(age < 30) %>%
  mutate(
    abitur = rec(educ, rules = "1:3=0 [ohne Abitur]; 4:5=1 [mit Abitur]; else=NA")
  ) %>%
  t_test(ls01, group = abitur, weights = wghtpew) %>%
  summary())", erwartet = c("Equal variances not assumed  -5.033  235.165  <.001  -0.986")),
  frei_a2 = list(code = r"(# Eine Idee: Befragte ab 65 Jahren
# abitur bilden: wie in Aufgabe 1
allbus %>%
  filter(age >= 65) %>%
  mutate(
    abitur = rec(educ, rules = "1:3=0 [ohne Abitur]; 4:5=1 [mit Abitur]; else=NA")
  ) %>%
  t_test(ls01, group = abitur, weights = wghtpew))", erwartet = c("t(947.3) = -0.115, p = 0.908, g = -0.006 (negligible), N = 1392")),
  a3_anova = list(code = r"(# ANOVA: Mittelwerte von mehr als zwei Gruppen vergleichen, gewichtet
allbus %>%
  oneway_anova(age, group = mode, weights = wghtpew) %>%
  summary())", erwartet = c("Between Groups  101483.969  2  50741.984  160.989")),
  a3_anova_angepasst = list(code = r"(# ANOVA: Mittelwerte von mehr als zwei Gruppen vergleichen, gewichtet
allbus %>%
  oneway_anova(pa01, group = gs01, weights = wghtpew) %>%
  summary())", erwartet = c("Between Groups  318.601  4  79.650  26.015")),
  a3_tukey = list(code = r"(# Tukey: Welche Paare unterscheiden sich?
allbus %>%
  oneway_anova(pa01, group = gs01, weights = wghtpew) %>%
  tukey_test() %>%
  summary())", erwartet = c("GROSSSTADT - EINZELHAUS, LAND  -0.600  0.229  .067")),
  frei_a3 = list(code = r"(# Eine Idee: Lebenszufriedenheit nach Familienstand
allbus %>%
  oneway_anova(ls01, group = mstat, weights = wghtpew) %>%
  tukey_test() %>%
  summary())", erwartet = c("GESCHIEDEN - LEDIG  -0.059  0.103  .979")),
  a4_matrix = list(code = r"(# Korrelationsmatrix: Vertrauen in vier Institutionen und Alter, gewichtet
allbus %>%
  pearson_cor(pt03, pt12, pt14, pt11, age, weights = wghtpew) %>%
  summary())", erwartet = c("pt12 x age  -0.007  .680")),
  frei_a4 = list(code = r"(# Eine Idee: neun Vertrauensfragen auf einmal
allbus %>%
  pearson_cor(pt01, pt02, pt03, pt08, pt09, pt10, pt12, pt14, pt15, weights = wghtpew))", erwartet = c("36/36 pairs significant (p < .05)"))
)
for (k in names(vorlagen)) frisch_ausfuehren(k, vorlagen[[k]]$code, vorlagen[[k]]$erwartet)

# =============================================================================================
cat("\n== Jeder ```r-Block aus sitzung07.md ist wörtlich eine Vorlage oben ==\n")
# =============================================================================================
skript_datei <- sub("^--file=", "", grep("^--file=", commandArgs(FALSE), value = TRUE))
ordner <- if (length(skript_datei)) dirname(normalizePath(skript_datei)) else getwd()
md_datei <- file.path(ordner, "sitzung07.md")
if (file.exists(md_datei)) {
  md <- readLines(md_datei, encoding = "UTF-8")
  start <- which(md == "```r")
  ende <- vapply(start, function(i) i + which(md[(i + 1):length(md)] == "```")[1], numeric(1))
  bloecke <- map2_chr(start, ende, function(i, j) paste(md[(i + 1):(j - 1)], collapse = "\n"))
  bloecke <- gsub("[⟦⟧]", "", bloecke)
  startblock <- "# Startblock: Pakete laden, Daten einlesen\nlibrary(tidyverse)\nlibrary(mariposa)\n\nallbus <- read_spss(\"ZA8831_v1-3-0.sav\")"
  erlaubt <- c(startblock, map_chr(vorlagen, "code"))
  fehlend <- bloecke[!bloecke %in% erlaubt]
  if (length(fehlend)) stop("Block in sitzung07.md ist keine geprüfte Vorlage:\n", fehlend[1])
  stopifnot(all(map_chr(vorlagen[!grepl("_angepasst$", names(vorlagen))], "code") %in% bloecke))
  cat(sprintf("  ok  %d ```r-Blöcke in sitzung07.md, alle wörtlich geprüft; jede Vorlage steht im Plan\n", length(bloecke)))
} else {
  cat("  (sitzung07.md nicht neben dem Skript gefunden, Abgleich übersprungen)\n")
}

cat("\nAlle Zahlen und Vorlagen von Sitzung 7 geprüft.\n")
