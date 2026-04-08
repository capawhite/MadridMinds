#!/usr/bin/env python3
"""
Regenerate hero + split images with consistent exposure/contrast.
Requires: pip install Pillow

Run from repo root:
  python3 scripts/retouch_images.py
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageChops, ImageEnhance, ImageOps

ROOT = Path(__file__).resolve().parent.parent


def mean_luminance(rgb: Image.Image) -> float:
    g = rgb.convert("L")
    px = g.getdata()
    n = g.size[0] * g.size[1]
    return sum(px) / n


def retouch_hero(src: Path, dst: Path) -> None:
    im = Image.open(src).convert("RGB")
    auto = ImageOps.autocontrast(im, cutoff=1)
    out = ImageChops.blend(im, auto, 0.42)
    out = ImageEnhance.Brightness(out).enhance(1.05)
    out = ImageEnhance.Contrast(out).enhance(1.04)
    out = ImageEnhance.Color(out).enhance(1.02)
    out.save(dst, quality=90, optimize=True, progressive=True)
    print(f"hero: {src.name} -> {dst.name} mean_L {mean_luminance(im):.1f} -> {mean_luminance(out):.1f}")


def retouch_chess(src: Path, dst: Path) -> None:
    im = Image.open(src).convert("RGB")
    out = ImageEnhance.Brightness(im).enhance(1.12)
    out = ImageEnhance.Contrast(out).enhance(1.1)
    out.save(dst, optimize=True)
    print(f"chess: mean_L {mean_luminance(im):.1f} -> {mean_luminance(out):.1f}")


def retouch_wine(src: Path, dst: Path) -> None:
    im = Image.open(src).convert("RGB")
    out = ImageEnhance.Brightness(im).enhance(0.98)
    out = ImageEnhance.Contrast(out).enhance(1.02)
    out.save(dst, optimize=True)
    print(f"wine: mean_L {mean_luminance(im):.1f} -> {mean_luminance(out):.1f}")


def main() -> None:
    retouch_hero(ROOT / "abya-privados-05.jpg", ROOT / "abya-privados-05.jpg")
    retouch_chess(ROOT / "chess.png", ROOT / "chess.png")
    retouch_wine(ROOT / "wine.png", ROOT / "wine.png")


if __name__ == "__main__":
    main()
