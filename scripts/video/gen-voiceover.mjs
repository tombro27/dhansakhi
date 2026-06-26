// Generates per-scene voiceover with Gemini TTS, writing wav files + durations.json.
// Reads GEMINI_API_KEY from env or .env.local (so the key never has to be pasted).
//
//   node scripts/video/gen-voiceover.mjs            # default voice "Kore"
//   VOICE=Puck node scripts/video/gen-voiceover.mjs # pick another prebuilt voice

import { GoogleGenAI } from "@google/genai";
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { NARRATION } from "./narration.mjs";

const __dir = dirname(fileURLToPath(import.meta.url));
const AUDIO_DIR = join(__dir, "audio");
mkdirSync(AUDIO_DIR, { recursive: true });
const ENV_LOCAL = "/home/imart/indiamart/hackathons/IDBI_Innovate_26/.env.local";

function loadKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  if (existsSync(ENV_LOCAL)) {
    for (const line of readFileSync(ENV_LOCAL, "utf8").split("\n")) {
      const m = line.match(/^\s*GEMINI_API_KEY\s*=\s*(.+?)\s*$/);
      if (m) return m[1].replace(/^["']|["']$/g, "").trim();
    }
  }
  return null;
}
const apiKey = loadKey();
if (!apiKey) {
  console.error("No GEMINI_API_KEY found. Put it in .env.local:\n  echo 'GEMINI_API_KEY=YOUR_KEY' > .env.local");
  process.exit(1);
}

const VOICE = process.env.VOICE || "Kore";
const MODEL = process.env.TTS_MODEL || "gemini-2.5-flash-preview-tts";
const STYLE = "Read this product-demo narration in a warm, confident, clear professional voice at a measured, engaging pace:";
const ai = new GoogleGenAI({ apiKey });

function pcmToWav(pcm, sampleRate = 24000, channels = 1, bits = 16) {
  const byteRate = (sampleRate * channels * bits) / 8;
  const blockAlign = (channels * bits) / 8;
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + pcm.length, 4); h.write("WAVE", 8);
  h.write("fmt ", 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20);
  h.writeUInt16LE(channels, 22); h.writeUInt32LE(sampleRate, 24);
  h.writeUInt32LE(byteRate, 28); h.writeUInt16LE(blockAlign, 32); h.writeUInt16LE(bits, 34);
  h.write("data", 36); h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}

const durations = {};
for (const n of NARRATION) {
  process.stdout.write(`TTS ${n.id} … `);
  const res = await ai.models.generateContent({
    model: MODEL,
    contents: [{ parts: [{ text: `${STYLE} ${n.voice}` }] }],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } } },
    },
  });
  const part = res.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part) {
    console.error("\nNo audio returned for", n.id, "—", JSON.stringify(res).slice(0, 300));
    process.exit(1);
  }
  const pcm = Buffer.from(part.inlineData.data, "base64");
  const rate = parseInt((part.inlineData.mimeType || "").match(/rate=(\d+)/)?.[1] || "24000", 10);
  writeFileSync(join(AUDIO_DIR, `${n.id}.wav`), pcmToWav(pcm, rate));
  const sec = pcm.length / (2 * rate);
  durations[n.id] = +sec.toFixed(2);
  console.log(`${sec.toFixed(1)}s`);
}
writeFileSync(join(AUDIO_DIR, "durations.json"), JSON.stringify(durations, null, 2));
const total = Object.values(durations).reduce((a, b) => a + b, 0);
console.log(`\n✓ voiceover ready (voice=${VOICE}). narration total ≈ ${total.toFixed(0)}s`);
