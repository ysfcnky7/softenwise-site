"""
Replace site header/footer in root *.html from partials/.
Run from repo root: python scripts/sync-global-layout.py
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PARTIALS = ROOT / "partials"

HEADER_SUB = (PARTIALS / "site-header-subpage.html").read_text(encoding="utf-8")
HEADER_IDX = (PARTIALS / "site-header-index.html").read_text(encoding="utf-8")
FOOTER = (PARTIALS / "site-footer.html").read_text(encoding="utf-8")
QUICK = (PARTIALS / "site-quick-contact.html").read_text(encoding="utf-8")

HEADER_RE = re.compile(
    r"\s*<header\s+class=\"site-header\"\s+id=\"header\">.*?</header>",
    re.DOTALL | re.IGNORECASE,
)
FOOTER_RE = re.compile(
    r"\s*<footer\s+class=\"site-footer\">.*?</footer>",
    re.DOTALL | re.IGNORECASE,
)

QUICK_BLOCK_RE = re.compile(
    r"\s*<div\s+class=\"quick-contact\"[\s\S]*?</div>\s*\n",
    re.IGNORECASE,
)


def inject_quick_contact(html: str) -> str:
    """Sabit WhatsApp + ara; partial ile güncellenir (yeniden çalıştırılabilir)."""
    marker = '  <script src="js/main.js'
    if marker not in html:
        return html
    q = "\n" + QUICK.rstrip() + "\n"
    if "quick-contact" in html:
        return QUICK_BLOCK_RE.sub(q, html, count=1)
    return html.replace(marker, q + marker, 1)


def rebuild_404(full: str) -> str:
    m = re.search(r'(<main\s+class="err404"[^>]*>[\s\S]*?</main>)', full)
    if not m:
        return full
    main_el = m.group(1)
    body = (
        "<body>\n"
        '  <a class="skip-link" href="#main">İçeriğe atla</a>\n'
        '  <script src="js/sprite-inject.js?v=202604081"></script>\n'
        f"{HEADER_SUB}\n"
        f"  {main_el}\n"
        f"{FOOTER}\n"
        f"\n{QUICK.rstrip()}\n"
        '  <script src="js/main.js?v=202604224" defer></script>\n'
        "</body>"
    )
    return re.sub(r"<body>[\s\S]*?</body>", body, full, count=1, flags=re.IGNORECASE)


def main() -> None:
    for path in sorted(ROOT.glob("*.html")):
        text = path.read_text(encoding="utf-8")
        if path.name == "404.html":
            text = rebuild_404(text)
        header_new = HEADER_IDX if path.name == "index.html" else HEADER_SUB
        # Leading newline so HTML comments (<!-- HEADER -->) stay on their own line after \s* match
        text, c_h = HEADER_RE.subn("\n" + header_new, text, count=1)
        text, c_f = FOOTER_RE.subn("\n" + FOOTER, text, count=1)
        if c_h != 1:
            print(f"warn {path.name}: header matches {c_h}")
            continue
        if c_f != 1:
            print(f"warn {path.name}: footer matches {c_f}")
            continue
        text = inject_quick_contact(text)
        path.write_text(text, encoding="utf-8", newline="\n")
        print("ok", path.name)


if __name__ == "__main__":
    main()
