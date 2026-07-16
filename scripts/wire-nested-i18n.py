# -*- coding: utf-8 -*-
"""Wire nested HTML gaps with data-i18n-html and merge translations."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GAPS = ROOT / "scripts" / "_i18n_nested_gaps.json"
TRANS = ROOT / "scripts" / "_i18n_nested_translations.json"
LOCALES = ROOT / "js" / "locales.js"


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


def flex_pattern(html: str) -> str:
    """Escape HTML but allow flexible whitespace."""
    parts = re.split(r"(\s+)", html.strip())
    out = []
    for part in parts:
        if part.isspace() or part == "":
            out.append(r"\s+")
        else:
            out.append(re.escape(part))
    # collapse multiple \s+
    pat = "".join(out)
    pat = re.sub(r"(?:\\s\+){2,}", r"\\s+", pat)
    return pat


def main() -> None:
    items = json.loads(GAPS.read_text(encoding="utf-8"))
    trans = json.loads(TRANS.read_text(encoding="utf-8"))
    data = load_locales()
    langs = ["en", "de", "fr", "ar", "ru", "es", "it", "nl", "pt", "az"]

    pairs = []
    for i, it in enumerate(items, start=1):
        html = it["html"]
        key = f"nest.{i:04d}"
        if html not in trans:
            raise SystemExit(f"missing translation for nest item {i}: {html[:80]}")
        pairs.append((html, key, it["tag"]))
        data["tr"][key] = html
        for lang in langs:
            val = trans[html].get(lang)
            if not val:
                raise SystemExit(f"missing {lang} for nest.{i:04d}")
            data[lang][key] = val

    pairs.sort(key=lambda x: len(x[0]), reverse=True)
    save_locales(data)
    print("locales keys", len(data["tr"]))

    total = 0
    for path in sorted(ROOT.glob("*.html")):
        text = path.read_text(encoding="utf-8")
        hits = 0
        for html, key, tag in pairs:
            inner = flex_pattern(html)
            pat = re.compile(
                rf"(<{tag}(?![^>]*\bdata-i18n=)([^>]*)>)({inner})</{tag}>",
                re.IGNORECASE | re.DOTALL,
            )

            def repl(m: re.Match, _key=key, _tag=tag) -> str:
                return m.group(1)[:-1] + f' data-i18n="{_key}" data-i18n-html>' + m.group(3) + f"</{_tag}>"

            text2, n = pat.subn(repl, text)
            if n:
                text = text2
                hits += n
        text = re.sub(r"js/locales\.js\?v=\d+", "js/locales.js?v=202607176", text)
        text = re.sub(r"js/i18n\.js\?v=\d+", "js/i18n.js?v=202607176", text)
        path.write_text(text, encoding="utf-8", newline="\n")
        print(f"{path.name}: {hits}")
        total += hits
    print("TOTAL", total)


if __name__ == "__main__":
    main()
