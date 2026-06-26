import puppeteer from "puppeteer";

const HTML = "file:///home/imart/indiamart/hackathons/IDBI_Innovate_26/deck/deck.html";
const OUT = "/home/imart/indiamart/hackathons/IDBI_Innovate_26/deck/DhanSakhi_IDBI_Innovate_Submission.pdf";

const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
const page = await browser.newPage();
await page.goto(HTML, { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 600));
await page.pdf({
  path: OUT,
  width: "1280px",
  height: "720px",
  printBackground: true,
  pageRanges: "",
});
await browser.close();
console.log("PDF written:", OUT);
