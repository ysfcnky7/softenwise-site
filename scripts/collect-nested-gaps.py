# -*- coding: utf-8 -*-
"""Collect remaining nested Turkish HTML fragments needing data-i18n-html."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "scripts" / "_i18n_nested_gaps.json"
TR = re.compile(r"[ğüşıöçĞÜŞİÖÇ]")

# Force UTF-8 stdout on Windows
sys.stdout.reconfigure(encoding="utf-8")


def main() -> None:
    items = []
    seen = set()
    for path in sorted(ROOT.glob("*.html")):
        raw = path.read_text(encoding="utf-8")
        m = re.search(r"<main[\s\S]*?</main>", raw, flags=re.I)
        if not m:
            continue
        main = m.group(0)
        for el in re.finditer(
            r"<(?P<tag>p|h2|h3|li|button|label|a)(?P<attrs>\s[^>]*)?>(?P<inner>[\s\S]*?)</(?P=tag)>",
            main,
        ):
            attrs = el.group("attrs") or ""
            inner = el.group("inner")
            if "data-i18n" in attrs:
                continue
            if "<" not in inner:
                continue
            plain = re.sub(r"<[^>]+>", " ", inner)
            plain = re.sub(r"\s+", " ", plain).strip()
            if not TR.search(plain) or len(plain) < 10:
                continue
            # normalize whitespace in inner for key stability
            norm = re.sub(r"\s+", " ", inner.strip())
            if norm in seen:
                continue
            seen.add(norm)
            items.append({"page": path.name, "tag": el.group("tag"), "html": norm, "plain": plain[:160]})
    OUT.write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{len(items)} nested fragments -> {OUT.name}")
    for it in items[:8]:
        print("-", it["page"], it["plain"][:90])


if __name__ == "__main__":
    main()
