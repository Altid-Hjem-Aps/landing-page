#!/usr/bin/env python3
"""Renders the new front page's own backgrounds into public/site/render (ALT-1420).

One-off tool, run by hand, not part of the build. Needs numpy and Pillow.

Usage: site-render.py spotlight
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "site" / "render"


def build_spotlight() -> None:
    """A soft cone of light from the top edge. Alpha only, so it sits on Deep forest."""
    OUT.mkdir(parents=True, exist_ok=True)
    width, height = 688, 495
    y, x = np.mgrid[0:height, 0:width].astype(np.float64)
    u = (x + 0.5 - width / 2) / (width / 2)
    v = (y + 0.5) / height
    spread = 0.06 + 0.62 * v**1.1
    cone = np.exp(-((u / spread) ** 2))
    fall = (1 - v) ** 1.5
    core = np.exp(-((u / (0.02 + 0.16 * v)) ** 2)) * (1 - v) ** 3
    alpha = np.clip(0.42 * cone * fall + 0.3 * core, 0, 1)
    # Dithered and stored without loss: a smooth ramp this faint bands badly in 8 bits.
    noise = np.random.default_rng(7).random((height, width)) - 0.5
    channel = np.clip(np.round(alpha * 255 + noise * 1.5), 0, 255).astype(np.uint8)
    rgba = np.dstack([np.full((height, width), c, dtype=np.uint8) for c in (232, 240, 226)] + [channel])
    Image.fromarray(rgba).save(OUT / "spotlight.webp", "WEBP", lossless=True, method=6)
    print("spotlight.webp", (OUT / "spotlight.webp").stat().st_size)


STEPS = {"spotlight": build_spotlight}

if __name__ == "__main__":
    step = sys.argv[1]
    STEPS[step]()
