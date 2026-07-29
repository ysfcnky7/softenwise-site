/**
 * Mobile compatibility audit — extreme iOS/Android viewports.
 * Run: node scripts/mobile-compat-check.mjs
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, devices } from "playwright";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const PORT = 4173;
const BASE = `http://127.0.0.1:${PORT}`;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".woff2": "font/woff2",
};

const CUSTOM_PROFILES = [
  { name: "Legacy iPhone 5/SE width", width: 320, height: 568, isMobile: true },
  { name: "Galaxy S8 / common Android", width: 360, height: 740, isMobile: true },
  { name: "Galaxy Z Fold cover", width: 344, height: 882, isMobile: true },
  { name: "Extreme narrow (old fold)", width: 280, height: 653, isMobile: true },
  { name: "iPhone 14 Pro landscape", width: 852, height: 393, isMobile: true },
  { name: "Pixel 7 landscape", width: 915, height: 412, isMobile: true },
  { name: "Large Android font (1.3x)", width: 360, height: 800, isMobile: true, textScale: 1.3 },
];

const PRESET_DEVICES = [
  "iPhone SE",
  "iPhone 12",
  "iPhone 13 Pro Max",
  "iPhone 14 Pro Max",
  "Pixel 5",
  "Pixel 7",
  "Galaxy S9+",
  "Galaxy S24",
];

function startServer() {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      try {
        const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
        const rel = urlPath === "/" ? "/index.html" : urlPath;
        const filePath = normalize(join(ROOT, rel.replace(/^\//, "")));
        if (!filePath.startsWith(ROOT)) {
          res.writeHead(403);
          res.end("Forbidden");
          return;
        }
        const data = await readFile(filePath);
        res.writeHead(200, { "Content-Type": MIME[extname(filePath)] || "application/octet-stream" });
        res.end(data);
      } catch {
        res.writeHead(404);
        res.end("Not found");
      }
    });
    server.listen(PORT, "127.0.0.1", () => resolve(server));
  });
}

async function auditViewport(page, profile) {
  const issues = [];

  await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });
  await page.waitForTimeout(250);

  const layout = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const overflowX = Math.max(0, doc.scrollWidth - doc.clientWidth, body.scrollWidth - body.clientWidth);
    return {
      overflowX,
      clientWidth: doc.clientWidth,
      scrollWidth: doc.scrollWidth,
    };
  });

  if (layout.overflowX > 1) {
    issues.push(`Yatay taşma: ${layout.overflowX}px (scroll ${layout.scrollWidth} / viewport ${layout.clientWidth})`);
  }

  const menuBtn = page.locator("#menuBtn");
  const menuVisible = await menuBtn.isVisible();
  if (!menuVisible) {
    issues.push("Hamburger menü görünmüyor");
    return issues;
  }

  const menuBtnBox = await menuBtn.boundingBox();
  if (!menuBtnBox || menuBtnBox.width < 44 || menuBtnBox.height < 44) {
    issues.push(`Hamburger dokunma alanı küçük: ${menuBtnBox?.width ?? 0}x${menuBtnBox?.height ?? 0}px`);
  }

  await menuBtn.click();
  await page.waitForSelector("#nav.open", { timeout: 3000 });

  const navAudit = await page.evaluate(() => {
    const nav = document.getElementById("nav");
    const header = document.getElementById("header");
    const footer = nav?.querySelector(".nav-mobile-footer");
    const toggles = nav ? [...nav.querySelectorAll(".nav-parent-toggle")] : [];
    const problems = [];

    if (!nav?.classList.contains("open")) problems.push("Mobil menü açılmadı");

    const navRect = nav?.getBoundingClientRect();
    const headerRect = header?.getBoundingClientRect();
    const firstItem = nav?.querySelector(".nav-main-link, .nav-item");
    const firstRect = firstItem?.getBoundingClientRect();
    if (firstRect && headerRect && firstRect.top < headerRect.bottom - 4) {
      problems.push(
        `Menü içeriği header altına taşıyor (item.top=${Math.round(firstRect.top)}, header.bottom=${Math.round(headerRect.bottom)})`
      );
    }

    toggles.forEach((btn, i) => {
      const r = btn.getBoundingClientRect();
      if (r.width < 44 || r.height < 44) {
        problems.push(`Dropdown ok ${i + 1} küçük: ${Math.round(r.width)}x${Math.round(r.height)}px`);
      }
    });

    const footerRect = footer?.getBoundingClientRect();
    const vh = window.innerHeight;
    if (footerRect && footerRect.bottom > vh + 1) {
      problems.push(`Hızlı iletişim alanı viewport dışında (bottom=${Math.round(footerRect.bottom)}, vh=${vh})`);
    }

    const navStyle = nav ? getComputedStyle(nav) : null;
    if (navStyle && (navStyle.overflowY === "visible" || navStyle.overflowY === "hidden")) {
      problems.push(`Menü kaydırma riski: overflow-y=${navStyle.overflowY}`);
    }

    return problems;
  });
  issues.push(...navAudit);

  const firstToggle = page.locator(".nav-parent-toggle").first();
  if (await firstToggle.count()) {
    await firstToggle.click();
    await page.waitForTimeout(200);
    const dropdownVisible = await page.locator(".nav-item.open .nav-dropdown").first().isVisible();
    if (!dropdownVisible) {
      issues.push("Hizmetler alt menüsü açılmıyor");
    }
  }

  const waBtn = page.locator(".nav-mobile-btn--wa");
  if (await waBtn.count()) {
    const waStyle = await waBtn.evaluate((el) => {
      const s = getComputedStyle(el);
      const bg = s.backgroundColor;
      const color = s.color;
      const parse = (value) => value.match(/\d+/g)?.map(Number) || [0, 0, 0];
      const bgRgb = parse(bg);
      const textRgb = parse(color);
      const relLum = (rgb) => {
        const c = rgb.map((v) => {
          const x = v / 255;
          return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
      };
      const contrast = (Math.max(relLum(textRgb), relLum(bgRgb)) + 0.05) / (Math.min(relLum(textRgb), relLum(bgRgb)) + 0.05);
      return { bg, color, contrast, fontSize: s.fontSize };
    });
    if (waStyle.contrast < 3) {
      issues.push(`WhatsApp butonu düşük kontrast (${waStyle.contrast.toFixed(2)}:1)`);
    }
  }

  await menuBtn.click();
  return issues;
}

async function main() {
  const server = await startServer();
  const browser = await chromium.launch({ headless: true });
  const allIssues = [];

  try {
    for (const preset of PRESET_DEVICES) {
      const device = devices[preset];
      if (!device) continue;
      const context = await browser.newContext({ ...device });
      const page = await context.newPage();
      try {
        const issues = await auditViewport(page, preset);
        if (issues.length) allIssues.push({ profile: preset, issues });
      } catch (err) {
        allIssues.push({ profile: preset, issues: [err.message] });
      }
      await context.close();
    }

    for (const profile of CUSTOM_PROFILES) {
      const context = await browser.newContext({
        viewport: { width: profile.width, height: profile.height },
        isMobile: profile.isMobile,
        deviceScaleFactor: 2,
        userAgent:
          "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
      });
      if (profile.textScale) {
        await context.addInitScript((scale) => {
          document.documentElement.style.fontSize = `${scale * 100}%`;
        }, profile.textScale);
      }
      const page = await context.newPage();
      try {
        const issues = await auditViewport(page, profile.name);
        if (issues.length) allIssues.push({ profile: profile.name, issues });
      } catch (err) {
        allIssues.push({ profile: profile.name, issues: [err.message] });
      }
      await context.close();
    }
  } finally {
    await browser.close();
    server.close();
  }

  if (!allIssues.length) {
    console.log("OK — tüm test profillerinde sorun bulunamadı.");
    return;
  }

  console.log("MOBİL UYUMLULUK SORUNLARI:\n");
  for (const entry of allIssues) {
    console.log(`• ${entry.profile}`);
    entry.issues.forEach((issue) => console.log(`  - ${issue}`));
    console.log("");
  }
  process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
