# -*- coding: utf-8 -*-
"""Collect unique untranslated Turkish strings from HTML mains."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "scripts" / "_i18n_gap_strings.json"
TR = re.compile(r"[ğüşıöçĞÜŞİÖÇ]|\b(için|olarak|nedir|nasıl|üzerinde|hakkında|gönder|incele|görüş|hizmet|ürün|süreç|adım|başvuru)\b", re.I)
SKIP = re.compile(
    r"softenwise|whatsapp|linkedin|instagram|@|^\+90|http|www\.|\.com|\.html|©|App Store|Google Play|Tramer|GeoJSON|REST|API|SaaS|OpenAPI|Redoc|WMS|WMTS|XYZ|OSRM|KML|iOS|Android|MVP|NDA|ERP|CRM|KVKK|SSL|CBS|GIS|Otomini|BLOC|Clinic|Maps|Point Croissant|Sharingo|Aytu|Jenesis|Dest Clinic",
    re.I,
)


def main() -> None:
    found: dict[str, list[str]] = {}
    for path in sorted(ROOT.glob("*.html")):
        raw = path.read_text(encoding="utf-8")
        body = re.sub(r"<script[\s\S]*?</script>", "", raw, flags=re.I)
        # only main if present
        mm = re.search(r"<main[\s\S]*?</main>", body, flags=re.I)
        if not mm:
            continue
        main_html = mm.group(0)
        texts = []
        for m in re.finditer(r"<([a-zA-Z0-9]+)(\s[^>]*)?>([^<]{4,300})</\1>", main_html):
            tag, attrs, text = m.group(1).lower(), m.group(2) or "", m.group(3).strip()
            if tag in {"script", "style", "code", "svg", "path", "use", "strong"} and "data-i18n" not in attrs:
                # still collect strong if Turkish
                pass
            if "data-i18n" in attrs:
                continue
            if not text or SKIP.search(text) and not TR.search(text):
                # if skip brand-only without Turkish letters, continue
                if not TR.search(text):
                    continue
            if not TR.search(text):
                continue
            # normalize whitespace
            norm = re.sub(r"\s+", " ", text)
            texts.append(norm)
        # also skip-link outside main
        for m in re.finditer(r'class="skip-link"[^>]*>([^<]+)<', body):
            if "data-i18n" not in m.group(0):
                texts.append(m.group(1).strip())
        if texts:
            # unique preserve order
            seen = set()
            uniq = []
            for t in texts:
                if t not in seen:
                    seen.add(t)
                    uniq.append(t)
            found[path.name] = uniq
    OUT.write_text(json.dumps(found, ensure_ascii=False, indent=2), encoding="utf-8")
    total = sum(len(v) for v in found.values())
    print(f"wrote {OUT.name}: {len(found)} pages, {total} strings")


if __name__ == "__main__":
    main()
