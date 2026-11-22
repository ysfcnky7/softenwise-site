import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "images", "showcase");

const TARGETS = [
  { id: "otomini", url: "https://otomini.com/" },
  { id: "filter", url: "https://filter-date.com/" },
  { id: "puff", url: "https://puffsocial.net/" },
  { id: "viaguide", url: "https://viaguideapp.com/" },
  { id: "lokman", url: "https://lokmanapp.com/" },
  { id: "gavel", url: "https://gavelsale.com/" },
  { id: "xagent", url: "https://xagentweb.com/" },
  { id: "bloc", url: "https://bloc.app/" },
];

const WIDTH = 1440;
const HEIGHT = 900;

async function dismissOverlays(page) {
  const labels = ["Accept", "Anladım", "Got it", "Kabul", "Tamam", "OK", "Close", "Kapat"];
  for (const label of labels) {
    const btn = page.getByRole("button", { name: label, exact: false }).first();
    try {
      if (await btn.isVisible({ timeout: 400 })) await btn.click({ timeout: 800 });
    } catch {
      /* ignore */
    }
  }
}

async function shot(page, id, url) {
  const file = path.join(OUT, `${id}-ui.jpg`);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(2200);
  await dismissOverlays(page);
  await page.waitForTimeout(400);
  await page.screenshot({
    path: file,
    type: "jpeg",
    quality: 82,
    clip: { x: 0, y: 0, width: WIDTH, height: Math.round((WIDTH * 11) / 16) },
  });
  const size = fs.statSync(file).length;
  console.log(`${id} ${size} ${file}`);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 1,
  locale: "tr-TR",
});
page.setDefaultTimeout(12000);

for (const t of TARGETS) {
  try {
    await shot(page, t.id, t.url);
  } catch (err) {
    console.error(`FAIL ${t.id}: ${err.message}`);
  }
}

await browser.close();
