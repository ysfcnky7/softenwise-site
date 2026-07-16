# -*- coding: utf-8 -*-
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
idx = (ROOT / "index.html").read_text(encoding="utf-8")
hm = re.search(r'<header class="site-header" id="header">.*?</header>', idx, re.S)
fm = re.search(r'<footer class="site-footer">.*?</footer>', idx, re.S)
assert hm and fm
header = hm.group(0)
footer = fm.group(0)
(ROOT / "partials" / "site-header-index.html").write_text("  " + header + "\n", encoding="utf-8", newline="\n")
(ROOT / "partials" / "site-footer.html").write_text("  " + footer + "\n", encoding="utf-8", newline="\n")
sub = (
    header.replace('href="#solutions"', 'href="index.html#solutions"')
    .replace('href="#references"', 'href="index.html#references"')
    .replace('href="#contact"', 'href="index.html#contact"')
)
(ROOT / "partials" / "site-header-subpage.html").write_text("  " + sub + "\n", encoding="utf-8", newline="\n")
print("partials synced")
