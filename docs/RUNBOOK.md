# SoftenWise site runbook (canlı operasyon)

## Yayın

1. Değişiklikleri gözden geçir; müşteri medyasını ezme.
2. `npm run validate`
3. Statik dosyaları barındırmaya (Natro / Codeflare / eşdeğer) yükle.
4. HTTPS ve `_headers` uygulandığını doğrula.
5. Ana sayfa + bir form sayfası + 404 duman testi.

## Kesinti / bakım

- Statik site: barındırıcı panelinden bakım sayfası veya DNS.
- Formlar çalışmıyorsa Formspree durumunu ve CORS/CSP `connect-src` / `form-action` kurallarını kontrol et.

## Sertifika

- Barındırıcı TLS / Let’s Encrypt yenilemesini izle.
- HSTS `_headers` içinde açıktır; HTTP→HTTPS yönlendirmesini panelden doğrula.

## Geri alma

- Önceki sürüm dosyalarını yeniden yükle (statik artifact).
- `?v=` asset sürümünü geri alarak cache bust’u yönet.

## İletişim

info@softenwise.com · +90 542 184 65 95
