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
const assetVersion = (
  fs.existsSync(path.join(ROOT, "scripts/asset-version.txt"))
    ? fs.readFileSync(path.join(ROOT, "scripts/asset-version.txt"), "utf8")
    : ""
)
  .trim()
  .replace(/\D/g, "") || String(Date.now()).slice(0, 12);

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
        <p><strong>Unvan:</strong> SoftenWise<br />
        <strong>Ülke:</strong> Türkiye<br />
        <strong>Şehir:</strong> Antalya<br />
        <strong>İletişim:</strong> <a href="mailto:info@softenwise.com">info@softenwise.com</a> · <a href="tel:+905421846595">+90 542 184 65 95</a><br />
        Fiziki tebligat / KVKK başvuru adresi talep üzerine aynı kanallardan yazılı olarak bildirilir; kamu sayfasında cadde veya daire yayımlanmaz.</p>
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
        <h2>5. Saklama ve imha</h2>
        <p>Form kayıtları iş ilişkisi ve yasal yükümlülükler için gerekli süre kadar tutulur; süre bitince silinir veya anonimleştirilir. Dil tercihi cihazınızda kalır, silebilirsiniz. İmha talepleri <a href="mailto:info@softenwise.com">info@softenwise.com</a> üzerinden alınır.</p>
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
        <p><strong>Unvan:</strong> SoftenWise<br />
        <strong>Ülke:</strong> Türkiye<br />
        <strong>Şehir:</strong> Antalya<br />
        <strong>Başvuru:</strong> <a href="mailto:info@softenwise.com">info@softenwise.com</a> · <a href="tel:+905421846595">+90 542 184 65 95</a><br />
        Fiziki tebligat adresi KVKK başvurusunda yazılı olarak bildirilir; kamu sayfasında cadde veya daire yayımlanmaz.</p>
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
        <p><a href="gizlilik.html">Gizlilik Politikası</a> · <a href="kvkk.html">KVKK Aydınlatma</a> · <a href="kullanim.html">Kullanım Koşulları</a></p>
      `,
  },
  {
    file: "kullanim.html",
    title: "Kullanım Koşulları | SoftenWise",
    desc: "softenwise.com kullanım koşulları: site içeriği, formlar ve iletişim.",
    canonical: "https://softenwise.com/kullanim.html",
    brand: "Yasal",
    h1: "Kullanım Koşulları",
    lead: "Bu siteyi kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.",
    body: `
        <h2>1. Taraflar</h2>
        <p>Siteyi SoftenWise işletir. İletişim: <a href="mailto:info@softenwise.com">info@softenwise.com</a> · <a href="tel:+905421846595">+90 542 184 65 95</a> · Antalya, Türkiye.</p>
        <h2>2. Amaç</h2>
        <p>softenwise.com kurumsal tanıtım, hizmet ve ürün bilgisi ile iletişim formları sunar. Hesap kaydı veya ödeme bu sitede yoktur.</p>
        <h2>3. İçerik</h2>
        <p>Metin, marka ve görseller SoftenWise’a aittir; izinsiz kopyalanamaz. Ürün adları (Liman, Clinic, Maps, BLOC vb.) şirket adı değildir.</p>
        <h2>4. Formlar</h2>
        <p>Gönderdiğiniz bilgiler doğru ve hukuka uygun olmalıdır. Formlar HTTPS ile Formspree üzerinden SoftenWise’a iletilir. Kötüye kullanımda iletim durdurulabilir.</p>
        <h2>5. Sorumluluk</h2>
        <p>Site «olduğu gibi» sunulur. Üçüncü taraf bağlantılar (ör. ürün siteleri, Formspree) kendi koşullarına tabidir.</p>
        <h2>6. Uygulanacak hukuk</h2>
        <p>Türkiye hukuku; uyuşmazlıklarda Antalya mahkemeleri.</p>
        <h2>7. İlgili metinler</h2>
        <p><a href="gizlilik.html">Gizlilik</a> · <a href="kvkk.html">KVKK</a> · <a href="cerez-politikasi.html">Çerezler</a></p>
        <h2>8. Güncelleme</h2>
        <p>Son güncelleme: 23 Kasım 2026. Değişiklikler bu sayfada yayınlanır.</p>
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
  <link rel="icon" type="image/png" sizes="32x32" href="icons/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="icons/favicon-16x16.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="icons/apple-touch-icon.png" />
  <link rel="alternate" hreflang="tr" href="${p.canonical}" />
  <link rel="alternate" hreflang="x-default" href="${p.canonical}" />
  <link rel="canonical" href="${p.canonical}" />
  <link rel="sitemap" type="application/xml" title="Site haritası" href="https://softenwise.com/sitemap.xml" />
  <link rel="alternate" type="text/plain" href="https://softenwise.com/llms.txt" title="SoftenWise LLM indeksi" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="SoftenWise" />
  <meta property="og:locale" content="tr_TR" />
  <meta property="og:title" content="${p.title}" />
  <meta property="og:description" content="${p.desc}" />
  <meta property="og:url" content="${p.canonical}" />
  <meta property="og:image" content="https://softenwise.com/images/og-image.png?v=${assetVersion}" />
  <meta property="og:image:secure_url" content="https://softenwise.com/images/og-image.png?v=${assetVersion}" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${p.title}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${p.title}" />
  <meta name="twitter:description" content="${p.desc}" />
  <meta name="twitter:image" content="https://softenwise.com/images/og-image.png?v=${assetVersion}" />
  <meta name="twitter:url" content="${p.canonical}" />
  <meta name="twitter:image:alt" content="${p.title}" />
  <link rel="stylesheet" href="css/local-fonts.css?v=${assetVersion}" />
  <link rel="stylesheet" href="css/style.css?v=${assetVersion}" />
  <link rel="stylesheet" href="css/softenwise.css?v=${assetVersion}" />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://softenwise.com/#organization",
    "name": "SoftenWise",
    "alternateName": ["Soften", "Soften Wise", "SoftenWise Systems"],
    "url": "https://softenwise.com/",
    "logo": "https://softenwise.com/images/softenwise-wordmark.png?v=7cc4b530ef",
    "email": "info@softenwise.com",
    "telephone": "+90 542 184 65 95",
    "address": { "@type": "PostalAddress", "addressLocality": "Antalya", "addressCountry": "TR" }
  }
  </script>
</head>
<body class="page-legal">
  <a class="skip-link" href="#main">İçeriğe atla</a>
  <script src="js/sprite-inject.js?v=${assetVersion}"></script>
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
  <script src="js/softenwise-network.js?v=${assetVersion}"></script>
  <script src="js/locales.js?v=${assetVersion}"></script>
  <script src="js/i18n.js?v=${assetVersion}"></script>
  <script src="js/main.js?v=${assetVersion}" defer></script>
</body>
</html>
`;
}


for (const p of pages) {
  fs.writeFileSync(path.join(ROOT, p.file), shell(p).replace(/\r\n/g, "\n"), "utf8");
  console.log("wrote", p.file);
}
