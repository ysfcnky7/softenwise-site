# SoftenWise Commercial Website

Statik kurumsal web sitesi: HTML, CSS, vanilla JS. Canlı: [softenwise.com](https://softenwise.com/)

## Gereksinimler

- Node.js 18+ (doğrulama / Playwright mobil kontrolü için)
- Statik barındırma (Natro / Codeflare / Netlify uyumlu `_headers`)

## Kurulum

```bash
npm ci
```

Statik önizleme (örnek):

```bash
npx --yes serve .
```

## Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run validate` | HTML bütünlüğü, yasal sayfalar, güvenlik başlıkları, form başarı mesajları |
| `npm run generate:legal` | Gizlilik / KVKK / çerez sayfalarını üretir |
| `npm run sync:layout` | Partial header/footer’ı tüm HTML’lere uygular |
| `npm run check:mobile` | Playwright mobil uyumluluk kontrolü |
| `npm run audit:checklist` | SoftenWise checklist PASS/FAIL/N/A raporu |

Asset cache bust: `scripts/apply-asset-version.ps1`

## Ortam

Bu site sunucu tarafı `.env` gerektirmez. Form uç noktası istemci tarafında Formspree ID’sidir (`js/main.js`). Gizli anahtar commit etmeyin; `.env` / `.env.local` yok sayılır.

## Yapı

- `*.html` — sayfalar
- `partials/` — ortak header/footer/quick-contact
- `css/`, `js/`, `images/`, `fonts/`, `icons/`
- `_headers` — cache + güvenlik başlıkları
- `.well-known/security.txt`

## Bağımlılık güncelleme

- `npm outdated` / `npm audit` en az üç ayda bir (veya PR öncesi).
- Bitbucket Pipeline `npm ci` + `npm run validate` kırık bağımlılıkta trunk’a düşmeyi engeller.
- Playwright yalnızca mobil kontrol scripti içindir; tarayıcı indirmeden validate çalışır.
