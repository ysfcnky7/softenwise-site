# -*- coding: utf-8 -*-
"""
Wire all gap Turkish strings with data-i18n and merge 11-lang translations into locales.js.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GAPS = ROOT / "scripts" / "_i18n_gap_translations.json"
UNIQUE = ROOT / "scripts" / "_i18n_unique_tr.json"
LOCALES = ROOT / "js" / "locales.js"
MAP_OUT = ROOT / "scripts" / "_i18n_gap_key_map.json"


def load_locales() -> dict:
    raw = LOCALES.read_text(encoding="utf-8")
    return json.loads(raw.split("=", 1)[1].strip().rstrip(";"))


def save_locales(data: dict) -> None:
    LOCALES.write_text(
        "/* SoftenWise locales — full site coverage */\n"
        f"window.SW_LOCALES = {json.dumps(data, ensure_ascii=False, indent=2)};\n",
        encoding="utf-8",
        newline="\n",
    )


def slug_key(i: int) -> str:
    return f"gap.{i:04d}"


def add_i18n_to_open_tag(open_full: str, key: str, html_mode: bool) -> str:
    """open_full like '<p class=\"x\">' or '<p>' """
    if "data-i18n=" in open_full:
        return open_full
    extra = f' data-i18n="{key}"'
    if html_mode:
        extra += " data-i18n-html"
    if open_full.endswith("/>"):
        return open_full  # shouldn't happen
    return open_full[:-1] + extra + ">"


def wire_html(html: str, tr: str, key: str) -> tuple[str, int]:
    html_mode = ("&" in tr) or ("<" in tr)
    # Match opening tag + exact text + closing same tag
    # Allow attrs without data-i18n
    pat = re.compile(
        rf"(<(?P<tag>[a-zA-Z][\w:-]*)(?P<attrs>(?![^>]*\bdata-i18n=)[^>]*)>)(?P<text>{re.escape(tr)})</(?P=tag)>",
        re.DOTALL,
    )

    def repl(m: re.Match) -> str:
        open_tag = m.group(1)
        new_open = add_i18n_to_open_tag(open_tag, key, html_mode)
        return f"{new_open}{m.group('text')}</{m.group('tag')}>"

    new_html, n = pat.subn(repl, html)
    # skip-link special (may already have other attrs)
    if n == 0 and tr in {"İçeriğe atla"}:
        pat2 = re.compile(
            rf'(<a\s+class="skip-link"(?![^>]*\bdata-i18n=)[^>]*)>({re.escape(tr)})</a>'
        )
        new_html, n = pat2.subn(rf'\1 data-i18n="{key}">\2</a>', html)
    return new_html, n


def main() -> None:
    gaps = json.loads(GAPS.read_text(encoding="utf-8"))
    unique = json.loads(UNIQUE.read_text(encoding="utf-8"))
    # prefer unique order; include any extra keys from gaps
    ordered = list(unique)
    for k in gaps:
        if k not in ordered:
            ordered.append(k)

    # Longest first for safer replace
    ordered_by_len = sorted(ordered, key=len, reverse=True)

    key_map: dict[str, str] = {}
    for i, tr in enumerate(ordered, start=1):
        key_map[tr] = slug_key(i)

    MAP_OUT.write_text(json.dumps(key_map, ensure_ascii=False, indent=2), encoding="utf-8")

    # Merge locales
    data = load_locales()
    langs = ["tr", "en", "de", "fr", "ar", "ru", "es", "it", "nl", "pt", "az"]
    missing_tr = []
    for tr, key in key_map.items():
        pack = gaps.get(tr)
        if not pack:
            missing_tr.append(tr)
            continue
        data["tr"][key] = tr
        for lang in langs:
            if lang == "tr":
                continue
            val = pack.get(lang)
            if not val:
                raise SystemExit(f"missing {lang} for: {tr[:60]}")
            data[lang][key] = val

    if missing_tr:
        print("WARN missing gap translations:", len(missing_tr))
        for t in missing_tr[:10]:
            print(" ", t[:80])

    save_locales(data)
    print("locales keys/tr", len(data["tr"]))

    # Wire all HTML pages
    total_hits = 0
    for path in sorted(ROOT.glob("*.html")):
        html = path.read_text(encoding="utf-8")
        hits = 0
        for tr in ordered_by_len:
            key = key_map[tr]
            if tr not in gaps and tr not in missing_tr:
                continue
            if tr in missing_tr:
                continue
            html, n = wire_html(html, tr, key)
            hits += n
        # Always ensure skip link
        if 'class="skip-link"' in html and "data-i18n=" not in html[html.find("skip-link") : html.find("skip-link") + 120]:
            html = re.sub(
                r'(<a class="skip-link"[^>]*)>(İçeriğe atla)</a>',
                r'\1 data-i18n="skip">\2</a>',
                html,
                count=1,
            )
            hits += 1
        # bump script versions
        html = re.sub(r"js/locales\.js\?v=\d+", "js/locales.js?v=202607175", html)
        html = re.sub(r"js/i18n\.js\?v=\d+", "js/i18n.js?v=202607175", html)
        path.write_text(html, encoding="utf-8", newline="\n")
        print(f"{path.name}: wired {hits}")
        total_hits += hits

    print("TOTAL wired replacements", total_hits)

    # Re-audit quickly
    from subprocess import run
    import sys

    run([sys.executable, str(ROOT / "scripts" / "audit-i18n-gaps.py")], check=False)


if __name__ == "__main__":
    main()
