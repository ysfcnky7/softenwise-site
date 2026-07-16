# -*- coding: utf-8 -*-
"""Find main elements with Turkish text + child tags still lacking data-i18n."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TR = re.compile(r"[ğüşıöçĞÜŞİÖÇ]")


def main() -> None:
    for path in sorted(ROOT.glob("*.html")):
        raw = path.read_text(encoding="utf-8")
        m = re.search(r"<main[\s\S]*?</main>", raw, flags=re.I)
        if not m:
            continue
        main = m.group(0)
        hits = []
        for el in re.finditer(r"<(p|h2|h3|li|span|button|a|label)(\s[^>]*)?>([\s\S]*?)</\1>", main):
            tag, attrs, inner = el.group(1), el.group(2) or "", el.group(3)
            if "data-i18n" in attrs:
                continue
            if "<" not in inner:
                continue  # simple text handled already
            plain = re.sub(r"<[^>]+>", " ", inner)
            plain = re.sub(r"\s+", " ", plain).strip()
            if not TR.search(plain):
                continue
            if len(plain) < 12:
                continue
            hits.append((tag, plain[:100]))
        if hits:
            print(f"=== {path.name}: {len(hits)} nested")
            for tag, t in hits[:15]:
                print(f"  <{tag}> {t}")
            if len(hits) > 15:
                print(f"  ... +{len(hits)-15}")


if __name__ == "__main__":
    main()
