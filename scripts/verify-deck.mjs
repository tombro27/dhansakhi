import puppeteer from "puppeteer";
import { mkdirSync } from "fs";

const HTML = "file:///home/imart/indiamart/hackathons/IDBI_Innovate_26/deck/deck.html";
const OUT = "/tmp/claude-1000/-home-imart-indiamart-hackathons-IDBI-Innovate-26/796b5ab5-1afe-4d3a-926d-5f7a92fd8dbb/scratchpad/deckshots";
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
await page.goto(HTML, { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 500));

const sections = await page.$$("section");
let i = 0;
for (const s of sections) {
  i++;
  const overflow = await s.evaluate((el) => el.scrollHeight - el.clientHeight);
  await s.screenshot({ path: `${OUT}/slide-${String(i).padStart(2, "0")}.png` });
  console.log(`slide ${i}: overflowPx=${overflow}`);
}
await browser.close();
console.log("done", i, "slides ->", OUT);
