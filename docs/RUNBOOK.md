# SoftenWise site runbook (canlı operasyon)

## Kesinti bildirimi

Müşteri / ziyaretçi bilgilendirme kanalı: `info@softenwise.com` ve site ana sayfa / WhatsApp hattı (+90 542 184 65 95). Status page yok; kesintide e-posta + WhatsApp ile haber verilir (SEV benzeri: kritik form/HTTPS / DNS).

## Korunan yollar (toplu yazım)

Scaffold, `generate:legal`, `sync:layout`, prettier-all veya dosya yeniden kurmadan önce bu yolları elleme; çakışmada mevcut dosyayı rename etme, üzerine yazma veya silme — atla veya yanına yaz.

| Yol | Neden |
|-----|--------|
| `images/`, `fonts/`, `icons/`, `svg/` | Site / referans medyası (koddan ayrı varlık) |
| `.env`, `.env.local`, `*.pem`, `*.key` | Secret; yalnız `.env.example` şablondur |
| `CNAME`, `humans.txt` | Barındırma ve yazarlık |
| `docs/OPS_NOTES.local.md` | Yerel operasyon notu |

`sync:layout` yalnızca `header` / `footer` / `quick-contact` bloklarını değiştirir. `generate:legal` yalnız `gizlilik.html` / `kvkk.html` / `cerez-politikasi.html` yasal şablonunu üretir (upload değil).

## Yayın

1. Değişiklikleri gözden geçir; yukarıdaki korunan yolları ezme.
2. `npm run validate`
3. Statik dosyaları barındırmaya (Natro / Codeflare / eşdeğer) yükle.
4. HTTPS ve `_headers` uygulandığını doğrula.
5. Ana sayfa + bir form sayfası + 404 duman testi.

## Tek teslim / kill switch

Statik tek paket yeter: ayrı remote-config veya kill-switch yok (uydurulmaz). Kritik yol kapanışı barındırıcı panel, DNS veya geçici bakım sayfası iledir.

## Kesinti / bakım

- Statik site: barındırıcı panelinden bakım sayfası veya DNS.
- Formlar çalışmıyorsa Formspree durumunu ve CORS/CSP `connect-src` / `form-action` kurallarını kontrol et.

## E-posta DNS (Natro)

Site kendi SMTP’sini çalıştırmaz; form iletimi Formspree. `softenwise.com` SPF kaydı Natro’dadır. DKIM ve DMARC barındırıcı panelinden açılır; bu depoda zone dosyası yoktur.

## Sertifika

- Barındırıcı TLS / Let’s Encrypt yenilemesini izle.
- HSTS `_headers` içinde açıktır; HTTP→HTTPS yönlendirmesini panelden doğrula.

## Geri alma

- Önceki sürüm dosyalarını yeniden yükle (statik artifact).
- `?v=` asset sürümünü geri alarak cache bust’u yönet.

## İletişim

info@softenwise.com · +90 542 184 65 95
