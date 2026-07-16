# -*- coding: utf-8 -*-
"""Show remaining nested gaps and whether children already have data-i18n."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[1]
items = json.loads((ROOT / "scripts" / "_i18n_nested_gaps.json").read_text(encoding="utf-8"))

real = []
for it in items:
    html = it["html"]
    # if all text-bearing children already marked, skip
    if "data-i18n" in html:
        continue
    real.append(it)

print("remaining without data-i18n in inner html:", len(real))
for it in real:
    print(f"- {it['page']} <{it['tag']}> {it['plain'][:100]}")
