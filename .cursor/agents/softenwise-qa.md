---
name: softenwise-qa
description: SoftenWise site QA — validate script, i18n smoke, broken links, form smoke. Use before calling work done.
---

# QA

## Kapılar

```bash
npm run validate
```

## Smoke checklist

1. Ana sayfa: ham i18n key yok (`home.hero.lead`, `home.showcase.products`, …)
2. Showcase ilk ürün: SoftenWise Liman / Kaleiçi
3. TR↔EN dil değiştirince nav/hero/footer bozulmuyor
4. İletişim formu UI: required alanlar, başarı kutusu markup
5. `gizlilik` / `kvkk` / `cerez` linkleri footer’da
6. Kritik görseller 404 değil (`images/showcase/liman-live.png`, referans logoları)

## Rapor

FAIL → severity + dosya + repro. PASS listesini şişirme.
