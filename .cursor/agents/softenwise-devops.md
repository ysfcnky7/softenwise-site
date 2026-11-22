---
name: softenwise-devops
description: SoftenWise site devops — gitignore, node_modules, Bitbucket/GitHub push, cache bust, static deploy. Use when GitHub rejects or node_modules ships.
---

# DevOps

## node_modules / GitHub

Bu repo static site; `playwright` için `npm install` lokal kalır.

1. `.gitignore` mutlaka `node_modules/` ve `**/node_modules/` içermeli
2. Yanlışlıkla track edildiyse:
   ```bash
   git rm -r --cached node_modules
   ```
3. Zip ile GitHub’a atma — `git push` kullan; zip’e `node_modules` koyma
4. Remote şu an Bitbucket olabilir; GitHub eklemek ayrı `remote` — force push yok

## Cache bust

CSS/JS değişince:

```bash
npm run bump
```

Tek sürüm tüm HTML’e yazılır (`scripts/bump-asset-version.mjs` → `scripts/asset-version.txt`). Elle `?v=` kovalama. `npm run validate` sürüm skew kontrol eder.

## Deploy

Static host (mevcut pipeline: `bitbucket-pipelines.yml`). Secret’ları commit etme (`.env`).

## Hard

- Agent commit/push yok
- `--force` main’e yok
