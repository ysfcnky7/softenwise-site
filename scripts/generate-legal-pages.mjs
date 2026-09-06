/**
 * Generate legal pages (gizlilik, kvkk, cerez-politikasi) from shared chrome.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const header = fs.readFileSync(path.join(ROOT, "partials/site-header-subpage.html"), "utf8");
const footer = fs.readFileSync(path.join(ROOT, "partials/site-footer.html"), "utf8");
const quick = fs.readFileSync(path.join(ROOT, "partials/site-quick-contact.html"), "utf8");

const pages = [
  {
    file: "gizlilik.html",
    title: "Gizlilik Politikası | SoftenWise",
    desc: "SoftenWise web sitesi gizlilik politikası: toplanan veriler, amaçlar, saklama ve haklarınız.",
    canonical: "https://softenwise.com/gizlilik.html",
    brand: "Yasal",
    h1: "Gizlilik Politikası",
    lead: "Bu politika, softenwise.com üzerinde hangi kişisel verilerin nasıl işlendiğini açıklar.",
    body: `
        <h2>1. Veri sorumlusu</h2>
        <p>SoftenWise — iletişim: <a href="mailto:info@softenwise.com">info@softenwise.com</a>, telefon: <a href="tel:+905421846595">+90 542 184 65 95</a>.</p>
        <h2>2. Toplanan veriler</h2>
        <ul>
          <li>İletişim ve başvuru formları: ad-soyad, e-posta, mesaj ve ilgili alanlar (rol, fikir adı vb.).</li>
          <li>Dil tercihi: tarayıcıda yerel olarak saklanan dil kodu (<code>sw-lang</code>).</li>
          <li>Teknik günlükler: barındırma sağlayıcısı erişim günlükleri (IP, user-agent) — sunucu tarafı.</li>
        </ul>
        <h2>3. Amaçlar</h2>
        <p>Talebinize yanıt vermek, teklif/görüşme planlamak, site dilini hatırlamak ve güvenliği sağlamak.</p>
        <h2>4. Aktarım</h2>
        <p>Form gönderimleri HTTPS üzerinden Formspree altyapısına iletilir; e-posta SoftenWise ekibine düşer. Analitik çerez / reklam pikseli şu an kullanılmamaktadır.</p>
        <h2>5. Saklama</h2>
        <p>Form kayıtları iş ilişkisi ve yasal yükümlülükler için gerekli süre kadar tutulur; dil tercihi cihazınızda kalır, silebilirsiniz.</p>
        <h2>6. Haklarınız</h2>
        <p>KVKK kapsamındaki erişim, düzeltme, silme ve itiraz haklarınız için <a href="kvkk.html">KVKK Aydınlatma</a> metnine bakın veya <a href="mailto:info@softenwise.com">info@softenwise.com</a> yazın.</p>
        <h2>7. Güncelleme</h2>
        <p>Son güncelleme: 5 Eylül 2026. Değişiklikler bu sayfada yayınlanır.</p>
      `,
  },
  {
    file: "kvkk.html",
    title: "KVKK Aydınlatma Metni | SoftenWise",
    desc: "6698 sayılı KVKK kapsamında SoftenWise aydınlatma metni.",
    canonical: "https://softenwise.com/kvkk.html",
    brand: "Yasal",
    h1: "KVKK Aydınlatma Metni",
    lead: "6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca bilgilendirme.",
    body: `
        <h2>1. Veri sorumlusu</h2>
        <p>SoftenWise. Başvuru: <a href="mailto:info@softenwise.com">info@softenwise.com</a></p>
        <h2>2. İşlenen kişisel veriler</h2>
        <p>Kimlik (ad-soyad), iletişim (e-posta, telefon — mesajda paylaşılırsa), mesaj içeriği, başvuru alanları, işlem güvenliği verileri.</p>
        <h2>3. Hukuki sebepler</h2>
        <p>Açık rıza (form gönderimi), sözleşmenin kurulması/ifası öncesi adımlar, meşru menfaat (iletişim ve güvenlik), kanuni yükümlülükler.</p>
        <h2>4. Aktarım</h2>
        <p>Form altyapısı (Formspree) ve e-posta/barındırma hizmet sağlayıcıları; yurt dışı aktarım ilgili sağlayıcı politikalarına tabi olabilir.</p>
        <h2>5. Haklar (KVKK m.11)</h2>
        <p>Verilerinizin işlenip işlenmediğini öğrenme, düzeltme, silme/yok etme, itiraz ve şikayet haklarınız vardır. Başvurularınızı yazılı veya e-posta ile iletebilirsiniz. Gerekirse Kişisel Verileri Koruma Kurulu’na başvurabilirsiniz.</p>
        <h2>6. Çerezler</h2>
        <p>Detay: <a href="cerez-politikasi.html">Çerez Politikası</a>.</p>
      `,
  },
  {
    file: "cerez-politikasi.html",
    title: "Çerez Politikası | SoftenWise",
    desc: "SoftenWise sitesinde kullanılan çerezler ve yerel depolama.",
    canonical: "https://softenwise.com/cerez-politikasi.html",
    brand: "Yasal",
    h1: "Çerez Politikası",
    lead: "Zorunlu yerel tercihler ve isteğe bağlı bildirim hakkında kısa açıklama.",
    body: `
        <h2>1. Özet</h2>
        <p>Reklam veya üçüncü taraf analitik çerezi kullanılmaz. Dil tercihi tarayıcı <strong>localStorage</strong> alanında tutulur.</p>
        <h2>2. Yerel depolama</h2>
        <ul>
          <li><code>sw-lang</code> — seçtiğiniz arayüz dili.</li>
          <li><code>sw-cookie-ack</code> — çerez bilgilendirmesini kapattığınızı hatırlar.</li>
        </ul>
        <h2>3. Yönetim</h2>
        <p>Tarayıcı ayarlarından site verilerini temizleyerek tercihleri silebilirsiniz. Form gönderimi çerez gerektirmez; HTTPS ile Formspree’ye gider.</p>
        <h2>4. İlgili metinler</h2>
        <p><a href="gizlilik.html">Gizlilik Politikası</a> · <a href="kvkk.html">KVKK Aydınlatma</a></p>
      `,
  },
];

function shell(p) {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <meta name="referrer" content="strict-origin-when-cross-origin" />
  <title>${p.title}</title>
  <meta name="description" content="${p.desc}" />
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#0e3a46" />
  <meta name="author" content="SoftenWise" />
  <link rel="icon" href="icons/favicon.ico" />
  <link rel="canonical" href="${p.canonical}" />
  <link rel="sitemap" type="application/xml" title="Site haritası" href="https://softenwise.com/sitemap.xml" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="SoftenWise" />
  <meta property="og:title" content="${p.title}" />
  <meta property="og:description" content="${p.desc}" />
  <meta property="og:url" content="${p.canonical}" />
  <meta property="og:image" content="https://softenwise.com/images/og-image.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${p.title}" />
  <meta name="twitter:description" content="${p.desc}" />
  <meta name="twitter:image" content="https://softenwise.com/images/og-image.png" />
  <link rel="stylesheet" href="css/local-fonts.css?v=202607167" />
  <link rel="stylesheet" href="css/style.css?v=202607228" />
  <link rel="stylesheet" href="css/softenwise.css?v=202607228" />
</head>
<body class="page-legal">
  <a class="skip-link" href="#main">İçeriğe atla</a>
  <script src="js/sprite-inject.js?v=202607163"></script>
${header}
  <main id="main">
    <section class="page-hero">
      <div class="container">
        <p class="page-hero__brand">${p.brand}</p>
        <h1 class="page-hero__title">${p.h1}</h1>
        <p class="page-hero__lead">${p.lead}</p>
      </div>
    </section>
    <section class="section-editorial">
      <div class="container section-editorial__inner legal-prose">
${p.body}
      </div>
    </section>
  </main>
${footer}
${quick}
  <script src="js/locales.js?v=202607163"></script>
  <script src="js/i18n.js?v=202607163"></script>
  <script src="js/main.js?v=202607228" defer></script>
</body>
</html>
`;
}

for (const p of pages) {
  fs.writeFileSync(path.join(ROOT, p.file), shell(p).replace(/\r\n/g, "\n"), "utf8");
  console.log("wrote", p.file);
}
