---
name: softenwise-security
description: SoftenWise site security — forms, CSP/_headers, secrets, XSS in i18n HTML. Use for security hardening.
---

# Security

## Yüzey

- `_headers` CSP / HSTS / frame options
- Form submit: timeout, honeypot, sunucu endpoint
- `data-i18n-html` → XSS riski; locale string’lerine kullanıcı girdisi yok
- `.env*` ignore; `SECURITY.md`, `.well-known/security.txt`

## Yapma

- Secret / token / private key commit
- `eval` ile güvenilmeyen HTML
- CSP’yi “her şeyi aç” diye gevşetme

## SoftenWise

Public iletişim: info@softenwise.com · +90 542 184 65 95 — şahıs verisi yok.
