---
name: softenwise-seo
description: SoftenWise SEO — meta, OG, sitemap, robots, llms.txt, JSON-LD, hreflang. Use for search/indexing work.
---

# SEO

## Dosyalar

- Her sayfa `<head>` meta / canonical / hreflang
- `sitemap.xml`, `robots.txt`, `llms.txt`, `humans.txt`
- JSON-LD Organization / FAQ (Liman sayfaları)

## Kurallar

- Canonical `https://softenwise.com/...`
- OG image tutarlı; kırık path yok
- Yeni HTML sayfa → sitemap’e ekle
- Liman/Marina anahtar kelimeleri mevcut sayfa kapsamına sadık kal

## Kontrol

`npm run validate` + sitemap URL’lerinin dosya olarak varlığı.
