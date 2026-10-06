"""Build /en and /es locale pages plus merged i18n JSON. Run from repo root."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def dump(path: Path, data: dict) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def merge(base: dict, over: dict) -> dict:
    out = dict(base)
    for key, val in over.items():
        if isinstance(val, dict) and isinstance(out.get(key), dict):
            out[key] = merge(out[key], val)
        else:
            out[key] = val
    return out


COMMON_EN = {
    "common": {
        "photoPlaceholder": "Photography placeholder",
        "forTwo": "for two",
        "duration": "About 2 hours",
        "englishLevel": "Comfortable following English",
        "english": "English",
        "madrid": "Madrid",
        "smallGroups": "Small groups",
        "guestIncluded": "Your guest is included",
        "getNotified": "Get notified of the next dates",
        "bookFirstMove": "Book The First Move",
        "aboutThisEvening": "About this evening",
        "whoFor": "Who this is for",
        "whatHappens": "What happens",
        "leaveKnowing": "What you leave knowing",
        "practical": "Practical information",
        "durationLabel": "Duration",
        "languageLabel": "Language",
        "whereLabel": "Where",
        "groupLabel": "Group",
        "priceLabel": "Price",
        "guestLabel": "Guest policy",
        "drinksLabel": "Drinks",
        "commitmentLabel": "Commitment",
        "book": "Book",
        "inEnglish": "In English",
    },
    "experiences": {
        "firstMoveName": "The First Move",
        "thinkAheadName": "Think Ahead",
        "gamePlanName": "Game Plan",
        "begin": "Begin",
        "think": "Think",
        "plan": "Plan",
    },
}

COMMON_ES = {
    "common": {
        "photoPlaceholder": "Espacio para fotografía",
        "forTwo": "para dos",
        "duration": "Unas 2 horas",
        "englishLevel": "Comodidad siguiendo el inglés",
        "english": "Inglés",
        "madrid": "Madrid",
        "smallGroups": "Grupos pequeños",
        "guestIncluded": "Tu invitado está incluido",
        "getNotified": "Avísame de las próximas fechas",
        "bookFirstMove": "Reservar The First Move",
        "aboutThisEvening": "Sobre esta velada",
        "whoFor": "Para quién es",
        "whatHappens": "Qué pasa",
        "leaveKnowing": "Con qué te vas",
        "practical": "Información práctica",
        "durationLabel": "Duración",
        "languageLabel": "Idioma",
        "whereLabel": "Dónde",
        "groupLabel": "Grupo",
        "priceLabel": "Precio",
        "guestLabel": "Invitado",
        "drinksLabel": "Bebidas",
        "commitmentLabel": "Compromiso",
        "book": "Reservar",
        "inEnglish": "En inglés",
    },
    "experiences": {
        "firstMoveName": "The First Move",
        "thinkAheadName": "Think Ahead",
        "gamePlanName": "Game Plan",
        "begin": "Begin",
        "think": "Think",
        "plan": "Plan",
    },
}


def extra_en() -> dict:
    return merge(COMMON_EN, json.loads((ROOT / "templates/locale/copy-en.json").read_text(encoding="utf-8")))


def extra_es() -> dict:
    return merge(COMMON_ES, json.loads((ROOT / "templates/locale/copy-es.json").read_text(encoding="utf-8")))


def chrome(page_id: str, title: str, description: str, og_title: str, og_desc: str, current: str, extra_head: str = "", filename: str = "index.html") -> tuple[str, str]:
    nav_current = {
        "experiences": ' aria-current="page"' if current == "experiences" else "",
        "teams": ' aria-current="page"' if current == "teams" else "",
        "about": ' aria-current="page"' if current == "about" else "",
        "book": ' aria-current="page"' if current == "book" else "",
        "learn": ' aria-current="page"' if current == "learn" else "",
    }
    head = f"""<!DOCTYPE html>
<html lang="en" data-i18n-page="{page_id}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script>
    (function () {{
      var locale = /\\/es(?:\\/|$)/.test(location.pathname) ? "es" : "en";
      document.documentElement.lang = locale;
      if (locale === "es") document.documentElement.classList.add("mm-i18n-pending");
    }})();
  </script>
  <title>{title}</title>
  <meta name="description" content="{description}" />
  <link rel="canonical" href="{'https://madridminds.com/en/' if page_id == 'home' else 'https://madridminds.com/en/' + filename}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="{og_title}" />
  <meta property="og:description" content="{og_desc}" />
  <meta property="og:image" content="https://madridminds.com/chess.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{og_title}" />
  <meta name="twitter:description" content="{og_desc}" />
  <meta name="twitter:image" content="https://madridminds.com/chess.png" />
  {extra_head}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/css/site.css" />
  <link rel="stylesheet" href="/nav-mobile.css" />
</head>
<body>
  <a class="skip-link" href="#main-content" data-i18n="nav.skip">Skip to main content</a>
  <nav class="site-nav mm-nav" aria-label="Primary">
    <a href="/index.html" class="site-nav-brand" data-i18n-aria="nav.brand" aria-label="Madrid Minds"><img src="/TopHeaderReadable.png" alt="Madrid Minds logo" class="site-nav-logo" data-i18n-alt="nav.logoAlt" /></a>
    <div class="site-nav-links" id="mm-primary-nav" data-nav-group="primary">
      <a href="/experiences.html" class="site-nav-link"{nav_current['experiences']} data-i18n="nav.experiences">Experiences</a>
      <div class="site-nav-dropdown">
        <button type="button" class="site-nav-link site-nav-dropdown-toggle" data-i18n-aria="nav.learnOpen" aria-label="Open Learn menu" aria-expanded="false"><span data-i18n="nav.learn">Learn</span> <span class="site-nav-caret">▾</span></button>
        <div class="site-nav-dropdown-menu" role="menu" aria-label="Learn pages">
          <a href="/learn.html" class="site-nav-dropdown-item" role="menuitem"{nav_current['learn']} data-i18n="nav.learnStart">Start here</a>
          <a href="/rules.html" class="site-nav-dropdown-item" role="menuitem" data-i18n="nav.howToPlay">How to play</a>
          <a href="/pieces.html" class="site-nav-dropdown-item" role="menuitem" data-i18n="nav.pieces">Pieces</a>
        </div>
      </div>
      <a href="/teams.html" class="site-nav-link"{nav_current['teams']} data-i18n="nav.forTeams">For Teams</a>
      <a href="/about.html" class="site-nav-link"{nav_current['about']} data-i18n="nav.about">About</a>
      <a href="/book.html" class="site-nav-link site-nav-cta"{nav_current['book']} data-i18n="nav.book">Book The First Move</a>
    </div>
    <div class="site-nav-end">
      <nav class="lang-switch" data-i18n-aria="nav.language" aria-label="Language">
        <a href="/en/" lang="en" hreflang="en" data-locale-link="en">EN</a>
        <a href="/es/" lang="es" hreflang="es" data-locale-link="es">ES</a>
      </nav>
      <button type="button" class="mm-nav-toggle" data-i18n-aria="nav.menu" aria-label="Open menu" aria-controls="mm-primary-nav" aria-expanded="false" data-i18n="nav.menu">Menu</button>
    </div>
    <div class="mm-nav-backdrop" aria-hidden="true"></div>
  </nav>
"""
    foot = """
  <footer class="site-footer">
    <img src="/TopHeaderReadable.png" alt="Madrid Minds logo" class="footer-logo" data-i18n-alt="nav.logoAlt" />
    <nav class="footer-nav" aria-label="Footer">
      <a href="/experiences.html" data-i18n="footer.experiences">Experiences</a>
      <a href="/learn.html" data-i18n="footer.learn">Learn</a>
      <a href="/teams.html" data-i18n="footer.forTeams">For Teams</a>
      <a href="/about.html" data-i18n="footer.about">About</a>
      <a href="/book.html" data-i18n="footer.book">Book</a>
      <a href="/chess-in-madrid.html" data-i18n="footer.chessInMadrid">Chess in Madrid</a>
    </nav>
    <div class="footer-links">
      <a href="https://instagram.com/madridminds" target="_blank" rel="noopener noreferrer">@madridminds</a>
      <a href="mailto:ruy@madridminds.com">ruy@madridminds.com</a>
    </div>
  </footer>
  <script src="/js/config.js"></script>
  <script src="/js/i18n.js"></script>
  <script src="/js/site.js"></script>
  <script src="/nav-mobile.js" defer></script>
</body>
</html>
"""
    return head, foot


def write_page(filename: str, head: str, main: str, foot: str) -> None:
    html = head + main + foot
    for loc in ("en", "es"):
        dest = ROOT / loc / filename
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(html, encoding="utf-8")


def redirect_file(target: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>MadridMinds</title>
  <link rel="canonical" href="https://madridminds.com{target}" />
  <meta http-equiv="refresh" content="0; url={target}" />
  <script>location.replace("{target}" + location.search + location.hash);</script>
</head>
<body>
  <p><a href="{target}">MadridMinds</a></p>
</body>
</html>
"""


def copy_learn_guides() -> None:
    cache = ROOT / "templates/locale/source"
    cache.mkdir(parents=True, exist_ok=True)
    for name in ("rules.html", "pieces.html"):
        cached = cache / name
        rootf = ROOT / name
        if not cached.exists():
            text = rootf.read_text(encoding="utf-8")
            if 'http-equiv="refresh"' in text:
                raise SystemExit(f"Need original {name} before it was turned into a redirect")
            cached.write_text(text, encoding="utf-8")
        src = cached.read_text(encoding="utf-8")
        src = src.replace("<html lang=\"en\">", '<html lang="en" data-i18n-page="learnGuide">')
        src = src.replace('href="css/site.css"', 'href="/css/site.css"')
        src = src.replace('href="nav-mobile.css"', 'href="/nav-mobile.css"')
        src = src.replace('src="TopHeaderReadable.png"', 'src="/TopHeaderReadable.png"')
        src = src.replace('src="nav-mobile.js"', 'src="/nav-mobile.js"')
        inject = """  <script>
    (function () {
      var locale = /\\/es(?:\\/|$)/.test(location.pathname) ? "es" : "en";
      document.documentElement.lang = locale;
      if (locale === "es") document.documentElement.classList.add("mm-i18n-pending");
    })();
  </script>
  <style>
    .site-nav-end{justify-self:end;display:flex;align-items:center;gap:.85rem}
    .lang-switch{display:inline-flex;align-items:center;gap:.45rem;font-size:.68rem;letter-spacing:.16em;text-transform:uppercase}
    .lang-switch a{color:var(--muted);text-decoration:none}
    .lang-switch a:hover,.lang-switch a[aria-current="true"]{color:var(--cream)}
    .lang-switch a[aria-current="true"]{text-decoration:underline;text-decoration-color:var(--terracotta);text-underline-offset:4px}
    .lang-switch a[data-locale-link="es"]{display:none}
  </style>
"""
        if "mm-i18n-pending" not in src:
            src = re.sub(r'<meta charset="UTF-8"\s*/?>', lambda m: m.group(0) + "\n" + inject, src, count=1, flags=re.I)
        if "/js/i18n.js" not in src:
            src = src.replace(
                '<script src="/nav-mobile.js" defer></script>',
                '<script src="/js/config.js"></script>\n  <script src="/js/i18n.js"></script>\n  <script src="/nav-mobile.js" defer></script>',
            )
            src = src.replace(
                '<script src="nav-mobile.js" defer></script>',
                '<script src="/js/config.js"></script>\n  <script src="/js/i18n.js"></script>\n  <script src="/nav-mobile.js" defer></script>',
            )
        if 'data-locale-link="en"' not in src:
            src = re.sub(
                r'<div class="site-nav-spacer"[^>]*></div>\s*<button type="button" class="mm-nav-toggle"',
                """<div class="site-nav-end">
      <nav class="lang-switch" aria-label="Language">
        <a href="/en/" lang="en" hreflang="en" data-locale-link="en">EN</a>
        <a href="/es/" lang="es" hreflang="es" data-locale-link="es">ES</a>
      </nav>
      <button type="button" class="mm-nav-toggle\"""",
                src,
                count=1,
            )
        for loc in ("en", "es"):
            (ROOT / loc / name).write_text(src, encoding="utf-8")


def main() -> None:
    en_path = ROOT / "i18n/en.json"
    es_path = ROOT / "i18n/es.json"
    en_extra = extra_en()
    es_extra = extra_es()
    en_data = merge(load(en_path), en_extra)
    es_data = merge(load(es_path), es_extra)
    en_data["home"] = en_extra["home"]
    es_data["home"] = es_extra["home"]
    en_data.pop("learnGuide", None)
    es_data.pop("learnGuide", None)
    dump(en_path, en_data)
    dump(es_path, es_data)

    pages = json.loads((ROOT / "templates/locale/pages.json").read_text(encoding="utf-8"))
    for spec in pages:
        main_html = (ROOT / "templates/locale" / spec["body"]).read_text(encoding="utf-8")
        extra = spec.get("extraHead", "")
        head, foot = chrome(
            spec["id"],
            spec["title"],
            spec["description"],
            spec["ogTitle"],
            spec["ogDescription"],
            spec["current"],
            extra,
            spec["file"],
        )
        sticky = spec.get("sticky")
        if sticky:
            foot = f"""
  <div class="sticky-cta" data-sticky-cta>
    <a class="btn btn-primary" href="{sticky['href']}" data-i18n="{sticky['i18n']}">{sticky['text']}</a>
  </div>
""" + foot
        write_page(spec["file"], head, main_html, foot)

    copy_learn_guides()

    redirects = {
        "index.html": "/en/",
        "the-first-move.html": "/en/the-first-move.html",
        "think-ahead.html": "/en/think-ahead.html",
        "game-plan.html": "/en/game-plan.html",
        "experiences.html": "/en/experiences.html",
        "book.html": "/en/book.html",
        "about.html": "/en/about.html",
        "learn.html": "/en/learn.html",
        "chess-in-madrid.html": "/en/chess-in-madrid.html",
        "rules.html": "/en/rules.html",
        "pieces.html": "/en/pieces.html",
        "wine.html": "/en/experiences.html",
        "social.html": "/en/experiences.html",
        "events.html": "/en/book.html",
        "your-host.html": "/en/about.html",
    }
    for name, target in redirects.items():
        (ROOT / name).write_text(redirect_file(target), encoding="utf-8")

    print("built locale pages")


if __name__ == "__main__":
    main()
