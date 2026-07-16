# -*- coding: utf-8 -*-
from __future__ import annotations

import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[1]
TR = re.compile(r"[ğüşıöçĞÜŞİÖÇ]")


def main() -> None:
    for path in sorted(ROOT.glob("*.html")):
        text = path.read_text(encoding="utf-8")
        text = re.sub(r"<script[\s\S]*?</script>", "", text)
        hits = []
        for m in re.finditer(r'\b(placeholder|aria-label|alt)=\"([^\"]{3,140})\"', text):
            attr, val = m.group(1), m.group(2)
            if not TR.search(val):
                continue
            tag_start = text.rfind("<", 0, m.start())
            tag_end = text.find(">", m.end())
            tag = text[tag_start : tag_end + 1]
            if "data-i18n-attr" in tag and f"{attr}:" in tag:
                continue
            hits.append((attr, val))
        if hits:
            print(path.name, len(hits))
            for a, v in hits[:10]:
                print(f"  {a}={v}")


if __name__ == "__main__":
    main()
