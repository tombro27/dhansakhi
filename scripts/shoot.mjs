import puppeteer from "puppeteer";
import { mkdirSync } from "fs";

const OUT = "/home/imart/indiamart/hackathons/IDBI_Innovate_26/deck/screenshots";
mkdirSync(OUT, { recursive: true });
const BASE = "http://localhost:3000";

const STATE = { personaId: "meena", aaConnected: true, customRiskAnswers: null, language: "en" };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

async function newPage() {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.evaluateOnNewDocument((state) => {
    localStorage.setItem("dhansakhi.demo.v1", JSON.stringify(state));
  }, STATE);
  return page;
}

async function shoot(name, path, { fullPage = false, before } = {}) {
  const page = await newPage();
  await page.goto(BASE + path, { waitUntil: "networkidle2", timeout: 30000 });
  await sleep(1200); // let recharts/animations settle
  if (before) await before(page);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage });
  console.log("✓", name);
  await page.close();
}

await shoot("01-landing", "/", { fullPage: true });

await shoot("02-onboarding-consent", "/onboarding", {
  before: async (page) => {
    await page.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find((x) => /Continue/i.test(x.textContent || ""));
      if (b) b.click();
    });
    await sleep(700);
  },
});

await shoot("03-dashboard", "/dashboard");
await shoot("04-advice", "/advice");

await shoot("05-advisor", "/advisor", {
  before: async (page) => {
    await page.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find((x) => /retirement goal/i.test(x.textContent || ""));
      if (b) b.click();
    });
    await sleep(2000); // wait for advisor reply
  },
});

await shoot("06-goals", "/goals");
await shoot("07-cross-sell", "/cross-sell");
await shoot("08-compliance", "/compliance");

// Risk-profiling quiz (click through identity -> consent -> aggregate)
await shoot("09-onboarding-risk", "/onboarding", {
  before: async (page) => {
    const clickByText = (re) =>
      page.evaluate((src) => {
        const rx = new RegExp(src, "i");
        const b = [...document.querySelectorAll("button")].find((x) => rx.test(x.textContent || ""));
        if (b) b.click();
      }, re.source ?? re);
    await clickByText("Continue");
    await sleep(600);
    await clickByText("Approve consent");
    await sleep(4400); // aggregation animation completes, advances to risk quiz
  },
});

await browser.close();
console.log("done");
