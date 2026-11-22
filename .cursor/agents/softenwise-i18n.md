---
name: softenwise-i18n
description: SoftenWise site i18n — locales.js / i18n.js parity, missing keys, 11 languages. Use when raw keys show or strings change.
---

# i18n Engineer

## Kaynaklar

- Sözlük: `js/locales.js` (`window.SW_LOCALES`)
- Motor: `js/i18n.js` (`data-i18n`, `data-i18n-attr`, `data-i18n-html`)
- Showcase metinleri: `js/main.js` içindeki `*Key` alanları da locales’te olmalı

## Diller

`tr en de fr ar ru es it nl pt az` — yeni key’i yalnız TR’de bırakma. EN tam olmalı; diğerleri en azından EN fallback ile doldurulur (ham key yasak).

## Kontrol

```bash
node -e "eval(require('fs').readFileSync('js/locales.js','utf8').replace('window.SW_LOCALES','globalThis.SW_LOCALES')); const tr=Object.keys(SW_LOCALES.tr); for (const l of Object.keys(SW_LOCALES)) { if(l==='tr')continue; const m=tr.filter(k=>!(k in SW_LOCALES[l])); if(m.length) console.log(l,m.length,m.slice(0,5)); }"
```

## Kurallar

- Key ekleyince **tüm HTML fallback** metinleriyle uyumlu tut
- Cache bust: tüm `*.html` içinde `locales.js?v=` ve `i18n.js?v=` artır
- RTL: `ar` — layout kırığı için `softenwise-ui-ux`
- Canlı sitede key görünüyorsa genelde **eski locales deploy** veya eksik key — yerel parity + `?v=` şart

## Yapma

- Hardcoded kullanıcı metni bırakıp key’i unutma
- Sadece bir dili “yeter” deyip audit’i kapatma
