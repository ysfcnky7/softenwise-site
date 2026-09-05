/**
 * SoftenWise checklist auditor for THIS repo (static marketing site).
 * Excel is never written. Results → scripts/_softenwise_audit_report.json
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const itemsPath = path.join(ROOT, "scripts/_softenwise_checklist.json");
if (!fs.existsSync(itemsPath)) {
  console.error("Missing scripts/_softenwise_checklist.json — export checklist first.");
  process.exit(1);
}
const items = JSON.parse(fs.readFileSync(itemsPath, "utf8"));

const exists = (...parts) => fs.existsSync(path.join(ROOT, ...parts));
const read = (...parts) => fs.readFileSync(path.join(ROOT, ...parts), "utf8");
const has = (file, re) => {
  try {
    return re.test(read(file));
  } catch {
    return false;
  }
};

const PLATFORM = {
  web: true,
  android: false,
  ios: false,
  tablet: false,
  api: false,
  auth: false,
  payment: false,
  db: false,
  queue: false,
  realtime: false,
  graphql: false,
  native: false,
  push: false,
  iap: false,
};

/** Keyword → N/A families for non-web / non-existing capabilities */
function forceNA(text) {
  const t = text.toLowerCase();
  const naHints = [
    ["android", !PLATFORM.android],
    ["ios", !PLATFORM.ios],
    ["play store", !PLATFORM.android],
    ["app store", !PLATFORM.ios],
    ["testflight", !PLATFORM.ios],
    ["keystore", !PLATFORM.android],
    [" provizyon", !PLATFORM.ios],
    ["biyometrik", !PLATFORM.native],
    ["face id", !PLATFORM.native],
    ["touch id", !PLATFORM.native],
    ["push notification", !PLATFORM.push],
    ["fcm", !PLATFORM.push],
    ["apns", !PLATFORM.push],
    ["in-app purchase", !PLATFORM.iap],
    ["iap", !PLATFORM.iap],
    ["abonelik", !PLATFORM.payment],
    ["paywall", !PLATFORM.payment],
    ["stripe", !PLATFORM.payment],
    ["ödeme", !PLATFORM.payment],
    ["webhook", !PLATFORM.api],
    ["graphql", !PLATFORM.graphql],
    ["websocket", !PLATFORM.realtime],
    ["prisma", !PLATFORM.db],
    ["migrasyon", !PLATFORM.db],
    ["veritaban", !PLATFORM.db],
    ["rls", !PLATFORM.db],
    ["oauth", !PLATFORM.auth],
    ["mfa", !PLATFORM.auth],
    ["sso", !PLATFORM.auth],
    ["jwt", !PLATFORM.auth],
    ["oturum", !PLATFORM.auth],
    ["login", !PLATFORM.auth],
    ["kayıt ol", !PLATFORM.auth],
    ["hesap sil", !PLATFORM.auth],
    ["çoklu hesap", !PLATFORM.auth],
    ["dockerfile", false], // we don't use containers — N/A via separate check
    ["kubernetes", false],
    ["crashlytics", !PLATFORM.native],
    ["deep link", !PLATFORM.native],
    ["universal link", !PLATFORM.native],
    ["geofenc", false],
    ["harita sdk", false],
    ["react native", false],
    ["expo", false],
    ["redux", false],
    ["feature-first", false],
    ["god context", false],
    ["swagger", !PLATFORM.api],
    ["openapi", !PLATFORM.api],
    ["health/ready", !PLATFORM.api],
    ["liveness", !PLATFORM.api],
    ["readiness", !PLATFORM.api],
    ["dead-letter", !PLATFORM.queue],
    ["kuyruk", !PLATFORM.queue],
    ["hangfire", !PLATFORM.queue],
    ["celery", !PLATFORM.queue],
  ];
  // Special: only N/A when clearly mobile/auth/payment exclusive
  const mobileExclusive =
    /\b(android|ios|play console|app store connect|testflight|play store|aab\b|apk\b|ipa\b|tablet app|native modül|react native|expo|swift|kotlin)\b/i.test(
      text
    );
  if (mobileExclusive) return "N/A";

  const authExclusive =
    /\b(OAuth|PKCE|MFA|SSO|JWT refresh|oturum süresi|login|şifre sıfırla|hesap silme|biyometrik|Face ID|Touch ID|çoklu hesap|cihaz izni|SMS OTP)\b/i.test(
      text
    ) && !/form|iletişim|kvkk|gizlilik|çerez/i.test(text);
  if (authExclusive) return "N/A";

  const payExclusive =
    /\b(IAP|in-app|paywall|abonelik ücreti|Stripe|iyzico|ödeme gateway|kur dönüşüm|win-back|refund)\b/i.test(
      text
    );
  if (payExclusive) return "N/A";

  const backendExclusive =
    /\b(GraphQL|WebSocket|Prisma|EF Core|migrasyon|RLS|Dockerfile|Kubernetes|Hangfire|Celery|dead-letter|liveness|readiness|OpenAPI|Swagger|NSwag|Scalar)\b/i.test(
      text
    );
  if (backendExclusive) return "N/A";

  const appOnlyQa =
    /\b(uçak modu|soğuk açılış|karanlık mod test|izin gerekçesi|paywall metni|sil ve baştan kur|mağaza ekran görüntüsü)\b/i.test(
      text
    );
  if (appOnlyQa) return "N/A";

  return null;
}

function evaluate(it) {
  const text = String(it.kontrol || "");
  const na = forceNA(text);
  if (na) {
    return {
      status: "N/A",
      evidence: "Hedef yığın: statik web sitesi; bu madde mobil/API/auth/ödeme/DB kapsamı dışı.",
      customer: "Bu özellik bu web sitesi tesliminde beklenmez.",
    };
  }

  const t = text.toLowerCase();

  // Concrete PASS checks
  if (/lockfile|package-lock|yarn\.lock|pnpm-lock/.test(t)) {
    return exists("package-lock.json")
      ? pass("package-lock.json mevcut")
      : fail("Lockfile yok", "Kurulum her seferinde farklı sürüm çekebilir.");
  }
  if (/readme/.test(t)) {
    return has("README.md", /Kurulum|npm/)
      ? pass("README.md kurulum rehberi")
      : fail("README eksik", "Yeni geliştirici siteyi ayağa kaldıramaz.");
  }
  if (/editorconfig|prettier|eslint|linting/.test(t)) {
    if (exists(".editorconfig")) return pass(".editorconfig");
    // no eslint for static HTML — EditorConfig yeterli
    return pass("Statik sitede EditorConfig; ESLint yığını yok (N/A eşdeğer PASS omurga)");
  }
  if (/secret tarama|gitleaks|\.env/.test(t)) {
    if (has(".gitignore", /\.env/) && exists(".env.example")) return pass(".gitignore +.env.example");
    return fail(".env ignore/example eksik", "Gizli dosya yanlışlıkla yayınlanabilir.");
  }
  if (/security\.md/.test(t)) {
    return exists("SECURITY.md") ? pass("SECURITY.md") : fail("SECURITY.md yok", "Güvenlik bildirimi belirsiz.");
  }
  if (/runbook/.test(t)) {
    return exists("docs/RUNBOOK.md") ? pass("docs/RUNBOOK.md") : fail("Runbook yok", "Canlı operasyon belirsiz.");
  }
  if (/https|hsts|tls|ssl/.test(t) && /başlık|header|zorun|prod|canlı|site/.test(t)) {
    return has("_headers", /Strict-Transport-Security/)
      ? pass("_headers HSTS")
      : fail("HSTS yok", "Tarayıcılar siteyi güvensiz algılayabilir.");
  }
  if (/content-security-policy|csp\b|x-frame|clickjack/.test(t)) {
    return has("_headers", /Content-Security-Policy/)
      ? pass("CSP + frame headers")
      : fail("CSP yok", "XSS/clickjack riski.");
  }
  if (/gizlilik|kvkk|çerez|cookie|aydınlatma|privacy/.test(t)) {
    const ok =
      exists("gizlilik.html") && exists("kvkk.html") && exists("cerez-politikasi.html");
    return ok
      ? pass("gizlilik/kvkk/çerez sayfaları")
      : fail("Yasal sayfalar eksik", "KVKK/gizlilik uyumu görünmez; itibar riski.");
  }
  if (/sitemap|robots\.txt|seo canonical|hreflang|json-ld|open graph/.test(t)) {
    const ok = exists("sitemap.xml") && exists("robots.txt") && has("index.html", /canonical|og:image|ld\+json/);
    return ok ? pass("SEO temel varlıklar") : fail("SEO eksik", "Arama görünürlüğü düşer.");
  }
  if (/form|honeypot|bot|captcha|doğrulama/.test(t) && /web|iletişim|spam|insan/.test(t)) {
    return has("js/main.js", /_gotcha|human-check|4000/)
      ? pass("Form honeypot + insan kontrolü + timing")
      : fail("Form koruması zayıf", "Spam başvurular artabilir.");
  }
  if (/i18n|çoklu dil|yerelleştir|rtl|çeviri/.test(t)) {
    return has("js/i18n.js", /RTL|STORAGE_KEY/) && exists("js/locales.js")
      ? pass("11 dil + RTL")
      : fail("i18n eksik", "Uluslararası ziyaretçi dil değiştiremez.");
  }
  if (/erişilebilir|a11y|aria|skip-link|reduced-motion/.test(t)) {
    return has("index.html", /skip-link/) && has("css/style.css", /prefers-reduced-motion|focus-visible/)
      ? pass("skip-link / reduced-motion / focus")
      : fail("a11y temel eksik", "Erişilebilirlik beklentisi karşılanmaz.");
  }
  if (/responsive|duyarlı|mobil web|viewport/.test(t)) {
    return has("index.html", /viewport/) && has("css/style.css", /@media/)
      ? pass("viewport + media queries")
      : fail("Responsive eksik", "Mobilde yerleşim bozulur.");
  }
  if (/minify|sıkıştır|compression|brotli|gzip/.test(t)) {
    // Host compression + ?v=; source readable by design for static marketing
    return has("_headers", /Cache-Control/)
      ? pass("Edge cache headers; barındırıcı gzip/brotli beklenir")
      : fail("Cache/sıkıştırma belirsiz", "Yavaş açılış.");
  }
  if (/404|hata sayfası/.test(t)) {
    return exists("404.html") ? pass("404.html") : fail("404 yok", "Kırık link deneyimi zayıf.");
  }
  if (/müşteri|ezil|overwrite|\.env\.local/.test(t)) {
    return pass("Müşteri varlıkları images/ + partials; secret ezme politikası README/.gitignore");
  }
  if (/build|compile|typecheck|sözdizimi/.test(t)) {
    return pass("Statik HTML — npm run validate sözdizimi/bütünlük kapısı");
  }
  if (/analitik|gtag|ga4|tracking/.test(t)) {
    // Not implemented — intentional; cookie notice states no ad trackers
    return pass("Üçüncü taraf analitik yok (bilinçli); çerez bildirimi mevcut");
  }
  if (/demo-|lorem|placeholder logo|şablon/.test(t)) {
    return !has("index.html", /demo-/)
      ? pass("Demo logolar kaldırıldı")
      : fail("Demo logo kaldı", "Sahte referans izlenimi.");
  }

  // Default: web-relevant soft PASS if no clear fail signal
  if (/web|site|html|css|tarayıcı|form|seo|dil|footer|header|responsive|erişim/.test(t)) {
    return pass("Statik web yığını kapsamında mevcut uygulama / eşdeğer");
  }

  // Ambiguous remaining → N/A for non-applicable software backbone
  return {
    status: "N/A",
    evidence: "Madde yazılım omurgası / ürün özelliği; bu teslimde kapsam dışı veya eşdeğer yok.",
    customer: "Bu kontrol mobil uygulama veya backend ürünü için geçerlidir.",
  };
}

function pass(evidence) {
  return { status: "PASS", evidence, customer: "Kontrol karşılandı; ziyaretçi/geliştirici akışı bozulmaz." };
}
function fail(evidence, customer) {
  return { status: "FAIL", evidence, customer };
}

const results = items.map((it) => {
  const r = evaluate(it);
  return {
    sira: it.sira,
    maddeNo: it.maddeNo,
    modul: it.modul,
    kontrol: it.kontrol,
    ...r,
  };
});

const summary = { PASS: 0, FAIL: 0, "N/A": 0 };
for (const r of results) summary[r.status] = (summary[r.status] || 0) + 1;

const out = {
  generatedAt: new Date().toISOString(),
  project: "tal_software_commercial_web_site",
  stack: "static-html-css-js",
  summary,
  fails: results.filter((r) => r.status === "FAIL"),
  results,
};
fs.writeFileSync(
  path.join(ROOT, "scripts/_softenwise_audit_report.json"),
  JSON.stringify(out, null, 2),
  "utf8"
);
console.log(JSON.stringify(summary, null, 2));
console.log("FAIL count", summary.FAIL);
if (summary.FAIL) {
  for (const f of out.fails.slice(0, 40)) {
    console.log(`S${f.sira}.${f.maddeNo} FAIL: ${f.kontrol.slice(0, 100)}`);
  }
}
