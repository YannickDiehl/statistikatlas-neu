/** R im Browser über webR. Wird erst beim ersten Ausführen per CDN geladen (kein npm-Paket, keine wasm-Dateien im Build). */
import { forBrowser } from './editor';

export const WEBR_URL = 'https://webr.r-wasm.org/v0.6.1/webr.mjs';
export const PACKAGES = ['mariposa', 'haven', 'ggplot2', 'dplyr', 'tidyr'];
export const REPOS = ['https://yannickdiehl.r-universe.dev', 'https://repo.r-wasm.org'];
export const START_TIMEOUT_MS = 90_000;
export const MAX_LINES = 300;
export const START_ERROR = 'R konnte nicht gestartet werden. Prüfe die Internetverbindung oder kopiere den Code nach RStudio.';
export const FILE_ERROR = 'Die Datei konnte in R nicht gelesen werden. Lade sie bitte noch einmal.';
export const PACKAGES_TEXT = 'Pakete werden geladen …';
const SAV_PATH = '/home/web_user/ZA8831_v1-3-0.sav';

export type Message = { kind: 'warning' | 'error' | 'message'; text: string };
export type Output = { text: string; messages: Message[]; images: ImageBitmap[] };
type Item = { type: string; data: unknown };

/** Reine Umwandlung der captureR-Ausgabe (Bedingungen sind schon Text): Textzeilen, Meldungen, Bilder; Text auf `maxLines` gekürzt. */
export function toOutput(items: Item[], maxLines = MAX_LINES): Output {
  const lines: string[] = [];
  const messages: Message[] = [];
  const images: ImageBitmap[] = [];
  for (const { type, data } of items) {
    if (type === 'stdout') lines.push(String(data));
    else if (type === 'stderr') {
      const t = String(data);
      messages.push({ kind: /^Warning|Removed/.test(t) ? 'warning' : 'message', text: t });
    } else if (type === 'warning' || type === 'error' || type === 'message') messages.push({ kind: type, text: String(data) });
    else if (type === 'image') images.push(data as ImageBitmap);
  }
  const all = lines.join('\n').split('\n');
  const text = lines.length === 0 ? ''
    : all.length > maxLines ? all.slice(0, maxLines).join('\n') + `\n… gekürzt (${all.length - maxLines} weitere Zeilen)`
    : all.join('\n');
  return { text, messages, images };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type WebRModule = { WebR: new () => any };
let loader: () => Promise<WebRModule> = () => import(/* @vite-ignore */ WEBR_URL);
/** Für Tests: ersetzt das Laden von webR. */
export function setWebRLoader(l: () => Promise<WebRModule>) { loader = l; }

/** One boot at a time: `reached` = webR loaded and initialised (hard timeout applies), `ready` = packages installed too. */
type Booting = { reached: Promise<any>; ready: Promise<any> };
let booting: Booting | null = null;
let loadedBytes: ArrayBuffer | null = null;
let progress: (text: string) => void = () => {};

export function resetR(): void { booting = null; loadedBytes = null; }

function begin(): Booting {
  const reached = (async () => {
    const { WebR } = await loader();
    const w = new WebR();
    await w.init();
    return w;
  })();
  const ready = reached.then(async w => {
    try {
      progress(PACKAGES_TEXT);
      await w.evalRVoid(`options(repos = c(${REPOS.map(r => `"${r}"`).join(', ')}))`);
      await w.installPackages(PACKAGES, { quiet: true, repos: REPOS });
      await w.evalRVoid('suppressMessages({library(dplyr); library(tidyr); library(ggplot2); library(haven); library(mariposa)})');
      // Auto-printing a codebook shows only a compact header in webR; its summary lists the value labels.
      // Only defined when mariposa offers a summary method, so a package change cannot break every printout.
      await w.evalRVoid('if (!is.null(getS3method("summary", "codebook", optional = TRUE))) print.codebook <- function(x, ...) { print(summary(x)); invisible(x) }');
      // The chapter texts assume 80 columns (e.g. tibble and codebook printouts).
      await w.evalRVoid('options(width = 80)');
    } catch (e) {
      try { await w.close?.(); } catch { /* ignore */ }
      throw e;
    }
    return w;
  });
  const b = { reached, ready };
  reached.catch(() => {});
  ready.catch(() => { if (booting === b) { booting = null; loadedBytes = null; } });
  return b;
}

async function start(): Promise<any> {
  const b = booting ?? (booting = begin());
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, no) => { timer = setTimeout(() => no(new Error(START_ERROR)), START_TIMEOUT_MS); });
  try {
    await Promise.race([b.reached, timeout]);
  } catch {
    throw new Error(START_ERROR);
  } finally { clearTimeout(timer); }
  try { return await b.ready; } catch { throw new Error(START_ERROR); }
}

/** Colour and style codes from cli (`\x1b[1m` …) that a text output would show as garbage. */
// eslint-disable-next-line no-control-regex
const ANSI = /\u001b\[[0-9;?]*[A-Za-z]/g;
export const stripAnsi = (text: string) => text.replace(ANSI, '');

/**
 * The text of a captured condition. rlang/cli conditions often leave the `message` field empty and build their text
 * in a conditionMessage() method, so R is asked first; the `message` field and a placeholder are the fallbacks.
 */
async function conditionText(sh: any, data: any): Promise<string> {
  try {
    const r = await sh.evalR('paste(conditionMessage(cond), collapse = "\\n")', { env: { cond: data } });
    const text = stripAnsi(String(await r.toString())).trim();
    if (text) return text;
  } catch { /* fall back to the field */ }
  try {
    const text = stripAnsi(String(await (await data.get('message')).toString())).trim();
    if (text) return text;
  } catch { /* placeholder */ }
  return '(Meldung)';
}

/** Writes the file into webR and reads it into the hidden `.za8831`; `loadedBytes` marks which file is in there. */
async function readFile(w: any, file: { bytes: ArrayBuffer }): Promise<void> {
  loadedBytes = null;
  try {
    // Own copy: a transfer must not empty the buffer the context keeps. The file lives in a hidden object.
    await w.FS.writeFile(SAV_PATH, new Uint8Array(file.bytes.slice(0)));
    await w.evalRVoid('.za8831 <- read_spss("ZA8831_v1-3-0.sav")');
  } catch {
    throw new Error(FILE_ERROR);
  }
  loadedBytes = file.bytes;
}

export async function runR(code: string, file: { name: string; bytes: ArrayBuffer }, onProgress?: (text: string) => void): Promise<Output> {
  progress = onProgress ?? (() => {});
  const w = await start();
  if (loadedBytes !== file.bytes) await readFile(w, file);
  // User code may change or remove `allbus`; every run starts from the untouched file.
  try {
    await w.evalRVoid('allbus <- .za8831');
  } catch {
    // The user code removed the hidden copy too (e.g. rm(list = ls(all.names = TRUE))): read the file again, once.
    await readFile(w, file);
    try { await w.evalRVoid('allbus <- .za8831'); } catch { loadedBytes = null; throw new Error(FILE_ERROR); }
  }
  const sh = await new w.Shelter();
  try {
    const r = await sh.captureR(forBrowser(code), {
      withAutoprint: true, captureStreams: true, captureConditions: true, throwJsException: false,
      captureGraphics: { width: 700, height: 420 },
    });
    const items: Item[] = [];
    for (const x of r.output) {
      items.push({ type: x.type, data: typeof x.data === 'string' ? x.data : await conditionText(sh, x.data) });
    }
    const out = toOutput(items);
    out.images = r.images ?? [];
    return out;
  } catch (err) {
    let m = err instanceof Error ? err.message : String(err);
    try { m = stripAnsi(String(await (await w.evalR('geterrmessage()')).toString())).trim() || m; } catch { /* keep m */ }
    return { text: '', messages: [{ kind: 'error', text: m }], images: [] };
  } finally { sh.purge(); }
}
