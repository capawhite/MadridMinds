#!/usr/bin/env python3
"""
Convert and lightly enhance selected event photos into photos/web/.
Uses sips for HEIC → JPEG, Pillow for crop / color / export.

Run from repo root:
  python3 scripts/process_event_photos.py
"""
from __future__ import annotations

import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent.parent
PHOTOS = ROOT / "photos"
WEB = PHOTOS / "web"


def load_rgb(src: Path) -> Image.Image:
    path = src
    if src.suffix.lower() in {".heic", ".heif"}:
        tmp = Path(tempfile.mkdtemp()) / (src.stem + ".jpg")
        subprocess.run(
            ["sips", "-s", "format", "jpeg", str(src), "--out", str(tmp)],
            check=True,
            capture_output=True,
        )
        path = tmp
    return Image.open(path).convert("RGB")


def enhance(im: Image.Image) -> Image.Image:
    # Mild cool-down of indoor yellow + local contrast.
    out = ImageOps.autocontrast(im, cutoff=1)
    out = Image.blend(im, out, 0.35)
    r, g, b = out.split()
    r = ImageEnhance.Brightness(r).enhance(0.97)
    b = ImageEnhance.Brightness(b).enhance(1.04)
    out = Image.merge("RGB", (r, g, b))
    out = ImageEnhance.Contrast(out).enhance(1.06)
    out = ImageEnhance.Color(out).enhance(1.03)
    out = ImageEnhance.Sharpness(out).enhance(1.12)
    out = out.filter(ImageFilter.UnsharpMask(radius=1.2, percent=80, threshold=3))
    return out


def fit_cover(im: Image.Image, tw: int, th: int, focus=(0.5, 0.55)) -> Image.Image:
    w, h = im.size
    scale = max(tw / w, th / h)
    nw, nh = int(w * scale + 0.5), int(h * scale + 0.5)
    resized = im.resize((nw, nh), Image.Resampling.LANCZOS)
    cx, cy = focus
    left = int(cx * nw - tw / 2)
    top = int(cy * nh - th / 2)
    left = max(0, min(left, nw - tw))
    top = max(0, min(top, nh - th))
    return resized.crop((left, top, left + tw, top + th))


def fit_max(im: Image.Image, max_w: int, max_h: int) -> Image.Image:
    out = im.copy()
    out.thumbnail((max_w, max_h), Image.Resampling.LANCZOS)
    return out


def save(im: Image.Image, name: str) -> None:
    WEB.mkdir(parents=True, exist_ok=True)
    dst = WEB / name
    im.save(dst, quality=82, optimize=True, progressive=True)
    print(f"wrote {dst.relative_to(ROOT)} ({im.size[0]}x{im.size[1]})")


def job(src_rel: str, name: str, mode: str, **kwargs) -> None:
    src = ROOT / src_rel
    if not src.exists():
        raise FileNotFoundError(src)
    im = enhance(load_rgb(src))
    if mode == "cover":
        out = fit_cover(im, kwargs["w"], kwargs["h"], kwargs.get("focus", (0.5, 0.55)))
    elif mode == "max":
        out = fit_max(im, kwargs["max_w"], kwargs["max_h"])
    else:
        raise ValueError(mode)
    save(out, name)


def main() -> None:
    # Homepage mobile hero — vertical boards + wine, no clear faces
    job(
        "photos/PHOTO-2026-11-10-09-30-56.jpg",
        "hero-gathering-mobile.jpg",
        "cover",
        w=1080,
        h=1620,
        focus=(0.48, 0.42),
    )

    # Teams hero — mid-game + madridminds.com on screen (faces down at boards)
    job(
        "photos/MadridMinds Chess and Wine Evening.png",
        "teams-competition.jpg",
        "cover",
        w=1600,
        h=1200,
        focus=(0.5, 0.58),
    )

    # Homepage atmosphere mosaic main
    job(
        "photos/PHOTO-2026-11-10-00-46-24 2.jpg",
        "atmo-nov-boards.jpg",
        "cover",
        w=1152,
        h=864,
        focus=(0.5, 0.62),
    )

    # Teams secondary atmosphere — three boards facing wall artwork (no faces)
    job(
        "photos/IMG_1958 2.HEIC",
        "teams-atmo-setup.jpg",
        "cover",
        w=1152,
        h=864,
        focus=(0.52, 0.48),
    )

    # Events — November feature + supports
    job(
        "photos/PHOTO-2026-11-10-09-30-56 4.jpg",
        "events-nov-feature.jpg",
        "cover",
        w=1400,
        h=933,
        focus=(0.5, 0.42),
    )
    job("photos/PHOTO-2026-11-10-00-46-24 2.jpg", "events-nov-03.jpg", "max", max_w=1080, max_h=1440)
    job(
        "photos/PHOTO-2026-11-10-01-50-04 2.jpg",
        "events-nov-05.jpg",
        "cover",
        w=1400,
        h=900,
        focus=(0.5, 0.72),
    )

    # Events — May feature + supports
    job(
        "photos/PHOTO-2026-05-19-12-43-21 10.jpg",
        "events-may-feature.jpg",
        "cover",
        w=1400,
        h=933,
        focus=(0.5, 0.5),
    )
    job("photos/PHOTO-2026-05-18-22-30-08.jpg", "events-may-06.jpg", "max", max_w=1080, max_h=1440)
    job(
        "photos/PHOTO-2026-05-18-22-30-05.jpg",
        "events-may-04.jpg",
        "cover",
        w=1080,
        h=1350,
        focus=(0.5, 0.85),
    )


if __name__ == "__main__":
    main()
