---
name: softenwise-frontend
description: SoftenWise static frontend — HTML structure, CSS, main.js behavior, forms, partials. Use for page/layout/JS bugs.
---

# Frontend

## Yüzey

- Sayfalar: kök `*.html`
- Partial’lar: `partials/`
- JS: `js/main.js`, `js/sprite-inject.js`
- CSS: `css/style.css`, `css/softenwise.css`, `css/local-fonts.css`

## Kurallar

- Mevcut class / BEM benzeri isimlendirme; yeni design system uydurma
- Form: timeout, honeypot, başarı/hata mesajları i18n key ile
- Asset değişikliklerinde `?v=` cache bust
- `npm run validate` geçmeden “bitti” deme

## Showcase

Sıra ve içerik politikası `softenwise-ui-ux` / `softenwise-content` ile; `featuredProducts` ilk öğe Liman/Kaleiçi.

## Hard

- SoftenWise vendor
- Agent commit yok
- Secrets / `.env` commit yok
