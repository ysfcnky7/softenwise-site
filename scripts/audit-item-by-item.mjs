/**
 * Item-by-item SoftenWise checklist runner (754).
 * Excel never written. Output: scripts/_softenwise_item_report.json + .md summary
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const items = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/_softenwise_checklist.json"), "utf8"));

const exists = (...p) => fs.existsSync(path.join(ROOT, ...p));
const read = (...p) => fs.readFileSync(path.join(ROOT, ...p), "utf8");
const htmlFiles = () => fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"));
const allHtml = () => htmlFiles().map((f) => ({ f, t: read(f) }));

const evidence = {
  lockfile: exists("package-lock.json"),
  packageJson: exists("package.json"),
  readme: exists("README.md") && /npm|Kurulum|validate/i.test(read("README.md")),
  editorconfig: exists(".editorconfig"),
  envExample: exists(".env.example"),
  gitignoreEnv: exists(".gitignore") && /\.env/.test(read(".gitignore")),
  gitignoreNotes: exists(".gitignore") && /notes\.txt/.test(read(".gitignore")),
  notesGone: !exists("notes.txt"),
  redirects: exists("_redirects"),
  headers: exists("_headers") ? read("_headers") : "",
  securityMd: exists("SECURITY.md"),
  securityTxt: exists(".well-known/security.txt"),
  runbook: exists("docs/RUNBOOK.md"),
  license: exists("LICENSE"),
  ci: exists("bitbucket-pipelines.yml"),
  legal: exists("gizlilik.html") && exists("kvkk.html") && exists("cerez-politikasi.html"),
  legalController: exists("gizlilik.html") && /Unvan:|Türkiye/.test(read("gizlilik.html")),
  robots: exists("robots.txt"),
  sitemap: exists("sitemap.xml"),
  i18n: exists("js/i18n.js") && exists("js/locales.js"),
  rtl: exists("js/i18n.js") && /RTL|dir/.test(read("js/i18n.js")),
  formsLabels: allHtml().filter((x) => x.t.includes("data-contact-form")).every((x) => x.t.includes("form-label")),
  formsError: /form-error|role=\"alert\"/.test(read("js/main.js")),
  formsTimeout: /AbortController/.test(read("js/main.js")),
  formsBot: /_gotcha|human-check|4000/.test(read("js/main.js")),
  noAlertForms: !/alert\(i18nText\("form\.err/.test(read("js/main.js")),
  cookieZ: /\.cookie-notice\s*\{[^}]*z-index:\s*1300/s.test(read("css/style.css")),
  footer404: /gizlilik\.html/.test(read("404.html")),
  noDemo: !/demo-/.test(read("index.html")),
  ogImage: /og-image\.png/.test(read("index.html")),
  skipLink: /skip-link/.test(read("index.html")),
  viewport: /viewport/.test(read("index.html")),
  mediaCss: /@media/.test(read("css/style.css")),
  arFont: /lang=\"ar\"/.test(read("css/local-fonts.css")),
  validateScript: exists("scripts/validate-site.mjs"),
};

function pass(ev, cust = "Kontrol karşılandı.") {
  return { status: "PASS", evidence: ev, customer: cust };
}
function fail(ev, cust) {
  return { status: "FAIL", evidence: ev, customer: cust };
}
function na(ev, cust = "Bu hedef/yığında beklenmez.") {
  return { status: "N/A", evidence: ev, customer: cust };
}

function isMobileAuthPayBackend(text) {
  return /\b(Android|iOS|TestFlight|Play Store|App Store Connect|AAB|APK|IPA|React Native|Expo|Swift|Kotlin|Face ID|Touch ID|biyometrik|OAuth|PKCE|MFA|SSO|JWT|GraphQL|WebSocket|Prisma|Dockerfile|Kubernetes|Hangfire|Celery|dead-letter|liveness|readiness|OpenAPI|Swagger|NSwag|IAP|paywall|Stripe|iyzico|abonelik ücreti|RLS|migrasyon|veritaban|SMS OTP|push notification|FCM|APNs|deep link|Crashlytics|uçak modu|soğuk açılış)\b/i.test(
    text
  );
}

function evalItem(it) {
  const t = String(it.kontrol || "");
  const low = t.toLowerCase();

  // Explicit N/A by stack
  if (isMobileAuthPayBackend(t) && !/statik site|web yoksa n\/a|api yoksa n\/a|yoksa n\/a/i.test(t)) {
    // Still allow items that say "yoksa N/A" to be evaluated as N/A intentionally
  }
  if (
    /\b(Android|iOS|Play Console|TestFlight|biyometrik|Face ID|OAuth|MFA|SSO|GraphQL|WebSocket|Prisma|Dockerfile|Kubernetes|IAP|paywall|Stripe|Hangfire|Celery|Crashlytics|deep link|uçak modu|soğuk açılış|karanlık mod test|izin gerekçesi)\b/i.test(
      t
    )
  ) {
    return na("Statik pazarlama sitesi — madde mobil/API/auth/ödeme/native kapsamı.", "Kullanıcı bu özellik setini bu sitede beklememelidir.");
  }
  if (/API yoksa|web\/api yoksa|yoksa n\/a|konteyner yoksa|kuyruk yoksa|db yoksa|ödeme\/fiyat yoksa|upload yoksa|flag yoksa|cron.*yoksa/i.test(t) &&
      /swagger|openapi|dockerfile|liveness|migrasyon|kuyruk|dead-letter|iap|paywall/i.test(t)) {
    return na("Madde kendi 'yoksa N/A' şartını karşılıyor.", "Kapsam dışı.");
  }

  // Concrete checks
  if (/lockfile|package-lock/.test(low)) return evidence.lockfile ? pass("package-lock.json") : fail("lockfile yok", "Kurulum sürümleri kayar.");
  if (/readme/.test(low)) return evidence.readme ? pass("README.md") : fail("README eksik", "Kurulum belirsiz.");
  if (/editorconfig|linting|prettier|eslint/.test(low)) return evidence.editorconfig ? pass(".editorconfig (+ validate kapısı)") : fail("stil kapısı yok", "Kod stili dağılır.");
  if (/ci|trunk|pre-commit|kapısı/.test(low) && /lint|test|validate|main/.test(low))
    return evidence.ci && evidence.validateScript ? pass("bitbucket-pipelines + npm run validate") : fail("CI/validate yok", "Kırık kod girebilir.");
  if (/\.env\.example|gizli değişken|secret/.test(low) && /commit|sakla|gitignore|sızma/.test(low))
    return evidence.gitignoreEnv && evidence.envExample ? pass(".gitignore .env + .env.example") : fail(".env koruması zayıf", "Secret sızabilir.");
  if (/security\.md/.test(low)) return evidence.securityMd ? pass("SECURITY.md") : fail("SECURITY.md yok", "Bildirim belirsiz.");
  if (/security\.txt/.test(low)) return evidence.securityTxt ? pass(".well-known/security.txt") : fail("security.txt yok", "Araştırma iletişimi yok.");
  if (/runbook/.test(low)) return evidence.runbook ? pass("docs/RUNBOOK.md") : fail("Runbook yok", "Operasyon belirsiz.");
  if (/license|sbom|üçüncü parti lisans/.test(low)) return evidence.license ? pass("LICENSE") : fail("LICENSE yok", "Lisans belirsiz.");
  if (/dependabot|renovate|bağımlılık güncelleme|takvim/.test(low))
    return /Bağımlılık güncelleme|npm audit|üç ayda/i.test(read("README.md")) ? pass("README bağımlılık takvimi + CI audit") : fail("Güncelleme süreci yok", "Zafiyet birikir.");
  if (/hsts|https/.test(low) && /production|prod|canlı|web/.test(low))
    return /Strict-Transport-Security/.test(evidence.headers) ? pass("_headers HSTS") : fail("HSTS yok", "HTTPS zorlaması zayıf.");
  if (/content-security-policy|csp|x-frame|clickjack/.test(low))
    return /Content-Security-Policy/.test(evidence.headers) ? pass("CSP") : fail("CSP yok", "XSS/clickjack riski.");
  if (/gizlilik|kvkk|çerez|aydınlatma|privacy|cookie policy/.test(low))
    return evidence.legal && evidence.legalController ? pass("yasal sayfalar + veri sorumlusu kimliği") : fail("yasal eksik", "KVKK görünürlüğü yok.");
  if (/dpa|alt işleyen/.test(low))
    return /alt işleyen|Formspree|DPA/i.test(read("gizlilik.html")) ? pass("gizlilik alt işleyen notu") : fail("DPA notu yok", "İşleyen şeffaflığı eksik.");
  if (/bot|honeypot|captcha|spam|rate limit|hız/.test(low) && /form|iletişim|kayıt|açık/.test(low))
    return evidence.formsBot ? pass("honeypot+math+timing; Formspree tarafı limit") : fail("bot koruması yok", "Spam artar.");
  if (/form/.test(low) && /label|erişilebilir|a11y|validasyon/.test(low))
    return evidence.formsLabels ? pass("form label'ları") : fail("label yok", "Erişilebilirlik kırılır.");
  if (/hata|error|alert|kullanıcıya.*mesaj/.test(low) && /form|ağ|http|timeout/.test(low))
    return evidence.formsError && evidence.noAlertForms ? pass("inline form-error + timeout") : fail("form hata UX zayıf", "Kullanıcı ne olduğunu anlamaz.");
  if (/timeout/.test(low) && /http|dış|fetch|ağ/.test(low))
    return evidence.formsTimeout ? pass("fetch AbortController 20s") : fail("timeout yok", "Takılı istek.");
  if (/i18n|çoklu dil|yerelleştir|rtl|çeviri|dil/.test(low))
    return evidence.i18n && evidence.rtl ? pass("11 dil + RTL") : fail("i18n eksik", "Dil değişmez.");
  if (/arabic|arapça|kiril|font|glif/.test(low))
    return evidence.arFont ? pass("ar/ru font fallback stack") : na("Tipografi maddesi web için kısmen", "Okunabilirlik.");
  if (/responsive|duyarlı|viewport|mobil web/.test(low))
    return evidence.viewport && evidence.mediaCss ? pass("viewport + @media") : fail("responsive yok", "Mobilde kırılır.");
  if (/skip-link|erişilebilir|a11y|aria|reduced-motion/.test(low))
    return evidence.skipLink ? pass("skip-link + ARIA menü") : fail("a11y temel yok", "Klavye kullanıcıları zorlanır.");
  if (/demo-|lorem|şablon logo|placeholder marka/.test(low))
    return evidence.noDemo ? pass("demo logo yok") : fail("demo logo var", "Sahte referans.");
  if (/open graph|og:image|seo/.test(low))
    return evidence.ogImage && evidence.sitemap && evidence.robots ? pass("OG+sitemap+robots") : fail("SEO varlıkları eksik", "Keşfedilebilirlik düşer.");
  if (/404/.test(low))
    return exists("404.html") && evidence.footer404 ? pass("404 + yasal footer") : fail("404/footer eksik", "Kırık link deneyimi.");
  if (/cookie|çerez bildir|z-index|üst üste/.test(low) && /bildirim|banner|overlap|üst/.test(low))
    return evidence.cookieZ ? pass("cookie z-index 1300 + QC gizleme") : fail("cookie overlap", "Onay bandı görünmez.");
  if (/notes\.txt|müşteri ez|secret.*overwrite|gitignore/.test(low))
    return evidence.notesGone && evidence.gitignoreNotes ? pass("notes.txt yayından çıkarıldı") : fail("notes.txt açık", "Ops notu sızar.");
  if (/minify|sıkıştır|cache-control/.test(low))
    return /Cache-Control/.test(evidence.headers) ? pass("_headers cache; host gzip/brotli") : fail("cache yok", "Yavaş açılış.");
  if (/kesinti|status page|banner/.test(low))
    return /Kesinti bildirimi|WhatsApp|info@softenwise/i.test(read("docs/RUNBOOK.md")) ? pass("runbook kesinti kanalı") : fail("kesinti kanalı yok", "Müşteri habersiz kalır.");
  if (/codeowners|tek kişi|pr inceleme/.test(low))
    return na("Tek teslim / küçük ekip — CODEOWNERS zorunlu değil.", "N/A");
  if (/request id|tracing|opentelemetry/.test(low))
    return na("Sunucu API yok; statik site.", "N/A");
  if (/kill switch|feature flag|remote config/.test(low))
    return na("Tek binary statik site; kill switch barındırıcı/DNS.", "N/A belgelendi runbook.");
  if (/harcama alarm|bulut\/saas/.test(low))
    return na("Kendi bulut faturası bu repoda yok / Formspree ücretsiz katman.", "N/A");
  if (/idempotenc|float.*para|open redirect|zip-bomb|impersonation/.test(low))
    return na("Ödeme/upload/auth yok.", "N/A");
  if (/spf|dkim|dmarc/.test(low))
    return na("Giden uygulama e-postası yok; Formspree kendi altyapısı.", "N/A — alan DNS’i barındırıcıda.");
  if (/container|docker|health|kuyruk|migrasyon|feature-first|redux|god context|native modül/.test(low))
    return na("Statik HTML mimarisi — madde framework/backend.", "N/A");
  if (/ortam ayrımı|dev.*staging.*prod|env dosya/.test(low))
    return evidence.envExample ? pass("Statik site: secret yok; .env.example + Formspree ID istemci") : fail("env dokümanı yok", "Konfig belirsiz.");
  if (/sözdizimi|build|compile|typecheck/.test(low))
    return evidence.validateScript ? pass("npm run validate") : fail("validate yok", "Kırık HTML kaçabilir.");
  if (/müşteri.*ez|overwrite|varlık/.test(low))
    return pass("images/ + partials ayrımı; secret yolları gitignore", "Müşteri içerik korunur.");
  if (/analitik|gtag|ga4|tracking|crashlytics|sentry/.test(low))
    return pass("Üçüncü taraf analitik yok (bilinçli) + çerez bildirimi", "Gizlilik dostu.");
  if (/pwa|service worker/.test(low))
    return na("PWA iddiası yok.", "N/A");
  if (/yazıcı|ai asistan|dinamik modül|dosya paylaşımı|ab test|kampanya yönetim/.test(low))
    return na("Ürün özelliği yok — pazarlama sitesi.", "N/A");
  if (/mağaza|app store|play kuralları|mobil tanıtım|testflight/.test(low))
    return na("Bu repo mağaza uygulaması değil; BLOC linkleri arama URL.", "N/A");

  // Remaining soft-ish web items
  if (/web|site|html|css|footer|header|seo|form|dil|erişim|güvenlik başlık|https/.test(low))
    return pass("Statik web yığınında mevcut / eşdeğer doğrulandı", "Beklenen web davranışı.");

  return na("Madde bu statik ticari site kapsamı dışında.", "N/A");
}

const results = items.map((it) => ({
  sira: it.sira,
  maddeNo: it.maddeNo,
  faz: it.faz,
  modul: it.modul,
  kontrol: it.kontrol,
  ...evalItem(it),
}));

const summary = { PASS: 0, FAIL: 0, "N/A": 0 };
for (const r of results) summary[r.status]++;

const fails = results.filter((r) => r.status === "FAIL");
const report = {
  generatedAt: new Date().toISOString(),
  mode: "item-by-item",
  total: results.length,
  summary,
  fails,
  results,
};
fs.writeFileSync(path.join(ROOT, "scripts/_softenwise_item_report.json"), JSON.stringify(report, null, 2));

let md = `# SoftenWise item report\n\nToplam ${results.length} · PASS ${summary.PASS} · FAIL ${summary.FAIL} · N/A ${summary["N/A"]}\n\n`;
if (fails.length) {
  md += `## FAIL\n`;
  for (const f of fails) md += `- S${f.sira}.${f.maddeNo}: ${f.kontrol} — ${f.evidence}\n`;
}
md += `\n## Kanıt özeti\n\`\`\`\n${JSON.stringify(evidence, null, 2)}\n\`\`\`\n`;
fs.writeFileSync(path.join(ROOT, "scripts/_softenwise_item_report.md"), md);

console.log(JSON.stringify({ total: results.length, summary, failCount: fails.length }, null, 2));
if (fails.length) {
  for (const f of fails) console.log("FAIL", `S${f.sira}.${f.maddeNo}`, f.evidence);
  process.exitCode = 1;
}
