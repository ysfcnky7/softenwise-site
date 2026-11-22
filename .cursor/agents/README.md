# SoftenWise kurumsal site — proje ajanları

Bu repo: **SoftenWise** static commercial site (`softenwise.com`). Cursor **Proje ajanları**ndan seç veya `@softenwise-chief` diye çağır.

## Yönetim

| Ajan | Ne zaman |
|------|----------|
| **`softenwise-chief`** | Orkestratör — “bırak çalış”, tüm site hatalarını bitir, multi-domain |
| `softenwise-tech-lead` | Kısa triage / uzman atama |

## Çekirdek

| Ajan | Ne zaman |
|------|----------|
| `softenwise-frontend` | HTML / CSS / `js/main.js` |
| `softenwise-i18n` | `js/locales.js`, `js/i18n.js`, dil anahtarları |
| `softenwise-ui-ux` | Hero, showcase, tipografi, responsive |
| `softenwise-content` | Ürün / Liman / Marina / Clinic metinleri |
| `softenwise-seo` | meta, sitemap, llms.txt, JSON-LD |
| `softenwise-qa` | `npm run validate`, görsel/dil smoke |
| `softenwise-devops` | `.gitignore`, deploy, cache `?v=`, GitHub/Bitbucket |
| `softenwise-security` | form, headers, secrets, CSP |
| `softenwise-reviewer` | Diff / PR kalitesi |

## Nasıl kullan

1. **Uzun iş / “komple düzelt”** → **`softenwise-chief`**
2. **Ham i18n key görünüyor** → `@softenwise-i18n`
3. **Showcase / Marina sırası** → `@softenwise-ui-ux` + `@softenwise-content`
4. **GitHub’da node_modules** → `@softenwise-devops`

Kaynak: `AGENTS.md`, `.cursor/rules/softenwise-vendor.mdc`.
