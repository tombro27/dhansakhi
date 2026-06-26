// Automated demo-video recorder for DhanSakhi.
// Drives the live app through the golden path, burns in captions, and (if
// per-scene voiceover wavs exist) muxes them in at the right offsets.
//
//   node scripts/video/make-video.mjs            # records (silent if no audio yet)
//   BASE=http://localhost:3000 node ...          # record against local instead of live
//
// Voiceover wavs + durations.json are produced by scripts/video/gen-voiceover.mjs.

import { PuppeteerScreenRecorder } from "puppeteer-screen-recorder";
import puppeteer from "puppeteer";
import ffmpegPath from "ffmpeg-static";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { NARRATION } from "./narration.mjs";

const __dir = dirname(fileURLToPath(import.meta.url));
const AUDIO_DIR = join(__dir, "audio");
const OUT_DIR = "/home/imart/indiamart/hackathons/IDBI_Innovate_26/deck/video";
mkdirSync(OUT_DIR, { recursive: true });
const RAW = join(OUT_DIR, "_raw.mp4");
const FINAL = join(OUT_DIR, "DhanSakhi_Demo.mp4");

const BASE = process.env.BASE || "https://idbi-innovate-26.vercel.app";
const W = 1280, H = 720, FPS = 30, PAD = 0.7;
const PERSONA = { personaId: "meena", aaConnected: true, customRiskAnswers: null, language: "en" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- per-scene on-screen actions (navigation + interactions, not narrated) ----
const RUN = {
  "01-problem": async (p) => { await goto(p, "/"); await sleep(1500); await scroll(p, 420); },
  "02-aa-consent": async (p) => { await goto(p, "/onboarding"); await clickText(p, /continue/i); await sleep(1200); },
  "03-dashboard": async (p) => { await goto(p, "/dashboard"); await sleep(1600); await scroll(p, 360); },
  "04-explainable": async (p) => { await goto(p, "/advice"); await sleep(2500); },
  "05-advisor-hindi": async (p) => {
    await goto(p, "/advisor");
    await p.select("select", "hi").catch(() => {});
    await sleep(400);
    await clickText(p, /retirement goal/i);
    await sleep(5500); // wait for the live Gemini reply to render
  },
  "06-goals": async (p) => { await goto(p, "/goals"); await sleep(1600); await scroll(p, 300); },
  "07-crosssell": async (p) => { await goto(p, "/cross-sell"); await sleep(1600); await scroll(p, 320); },
  "08-close": async (p) => { await goto(p, "/compliance"); await sleep(1800); },
};
const SCENES = NARRATION.map((n) => ({ ...n, run: RUN[n.id] }));

// ---- helpers ----
let CURRENT_CAPTION = "";
async function goto(p, path) {
  await p.goto(BASE + path, { waitUntil: "networkidle2", timeout: 30000 });
  await caption(p, CURRENT_CAPTION);
}
async function scroll(p, px) { await p.evaluate((y) => window.scrollBy({ top: y, behavior: "smooth" }), px); }
async function clickText(p, re) {
  await p.evaluate((src) => {
    const rx = new RegExp(src, "i");
    const el = [...document.querySelectorAll("button")].find((b) => rx.test(b.textContent || ""));
    if (el) el.click();
  }, re.source);
}
async function caption(p, text) {
  await p.evaluate((t) => {
    let el = document.getElementById("vo-cap");
    if (!el) {
      el = document.createElement("div");
      el.id = "vo-cap";
      document.body.appendChild(el);
      Object.assign(el.style, {
        position: "fixed", left: "0", right: "0", bottom: "0", zIndex: "2147483647",
        padding: "26px 9% 24px", boxSizing: "border-box",
        background: "linear-gradient(0deg, rgba(6,24,46,0.94) 30%, rgba(6,24,46,0))",
        color: "#fff", font: "600 23px/1.45 -apple-system,'Segoe UI',Roboto,sans-serif",
        textAlign: "center", textShadow: "0 2px 10px rgba(0,0,0,0.6)", pointerEvents: "none",
      });
    }
    el.textContent = t;
  }, text).catch(() => {});
}

// ---- durations: real audio if present, else estimate from word count ----
function sceneDurations() {
  const durPath = join(AUDIO_DIR, "durations.json");
  if (existsSync(durPath)) return JSON.parse(readFileSync(durPath, "utf8"));
  const est = {};
  for (const s of SCENES) est[s.id] = Math.max(4, s.voice.split(/\s+/).length / 2.6);
  return est;
}

const durations = sceneDurations();
const haveAudio = existsSync(join(AUDIO_DIR, "durations.json"));
console.log(haveAudio ? "Using real voiceover durations." : "No voiceover yet — recording SILENT with estimated timing.");

const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
await page.evaluateOnNewDocument((s) => localStorage.setItem("dhansakhi.demo.v1", JSON.stringify(s)), PERSONA);

const rec = new PuppeteerScreenRecorder(page, { ffmpeg_Path: ffmpegPath, fps: FPS, videoFrame: { width: W, height: H } });
await rec.start(RAW);
const t0 = Date.now();
const offsets = [];

for (const s of SCENES) {
  CURRENT_CAPTION = s.caption;
  await s.run(page);
  await caption(page, s.caption);
  const offsetMs = Date.now() - t0;
  offsets.push({ id: s.id, offsetMs });
  const holdMs = Math.round((durations[s.id] + PAD) * 1000);
  console.log(`> ${s.id}  @${(offsetMs / 1000).toFixed(1)}s  hold ${(holdMs / 1000).toFixed(1)}s`);
  await sleep(holdMs);
}
await sleep(400);
await rec.stop();
await browser.close();
console.log("raw video:", RAW);

if (haveAudio) {
  const inputs = ["-i", RAW];
  const filters = [], labels = [];
  SCENES.forEach((s, i) => {
    const wav = join(AUDIO_DIR, `${s.id}.wav`);
    if (!existsSync(wav)) return;
    inputs.push("-i", wav);
    const off = offsets.find((o) => o.id === s.id).offsetMs;
    const idx = i + 1;
    filters.push(`[${idx}]adelay=${off}|${off}[a${idx}]`);
    labels.push(`[a${idx}]`);
  });
  const filterComplex = `${filters.join(";")};${labels.join("")}amix=inputs=${labels.length}:normalize=0[aout]`;
  const args = [...inputs, "-filter_complex", filterComplex, "-map", "0:v", "-map", "[aout]",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-shortest", "-y", FINAL];
  console.log("muxing voiceover…");
  execFileSync(ffmpegPath, args, { stdio: "inherit" });
  console.log("FINAL:", FINAL);
} else {
  execFileSync(ffmpegPath, ["-i", RAW, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-an", "-y", FINAL], { stdio: "inherit" });
  console.log("FINAL (silent preview):", FINAL);
}
