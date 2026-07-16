# -*- coding: utf-8 -*-
"""Audit Turkish text nodes missing data-i18n."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TR = re.compile(r"[ğüşıöçĞÜŞİÖÇ]|\b(için|olarak|nedir|nasıl|üzerinde|hakkında|gönder|incele|görüş|hizmet|ürün|süreç)\b", re.I)
SKIP_TEXT = re.compile(
    r"softenwise|whatsapp|linkedin|instagram|@|^\+90|http|www\.|\.com|\.html|©|v=\d|App Store|Google Play|Tramer|GeoJSON|REST|API|SaaS|OpenAPI|Redoc|WMS|WMTS|XYZ|OSRM|KML|iOS|Android|MVP|NDA|ERP|CRM|KVKK|SSL|CBS|GIS",
    re.I,
)


def has_i18n_on_tag(open_tag: str) -> bool:
    return "data-i18n" in open_tag


def main() -> None:
    for path in sorted(ROOT.glob("*.html")):
        raw = path.read_text(encoding="utf-8")
        body = re.sub(r"<script[\s\S]*?</script>", "", raw, flags=re.I)
        body = re.sub(r"<style[\s\S]*?</style>", "", body, flags=re.I)
        hits = []
        for m in re.finditer(r"<([a-zA-Z0-9]+)(\s[^>]*)?>([^<]{6,220})</\1>", body):
            tag, attrs, text = m.group(1).lower(), m.group(2) or "", m.group(3).strip()
            if tag in {"script", "style", "code", "pre", "svg", "path", "use", "meta", "title", "option"}:
                continue
            if not text or SKIP_TEXT.search(text):
                continue
            if not TR.search(text):
                continue
            if has_i18n_on_tag(attrs):
                continue
            # parent with data-i18n-html wrapping span already handled by attrs
            hits.append((tag, text[:110].replace("\n", " ")))
        if hits:
            print(f"=== {path.name}: {len(hits)}")
            for tag, text in hits[:20]:
                print(f"  <{tag}> {text}")
            if len(hits) > 20:
                print(f"  ... +{len(hits)-20}")


if __name__ == "__main__":
    main()
