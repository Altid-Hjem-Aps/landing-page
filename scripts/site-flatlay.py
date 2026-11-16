#!/usr/bin/env python3
"""Composites the final CTA's flat-lay into public/site/render/flatlay.webp (ALT-1420).

One-off tool, run by hand. Needs numpy and Pillow. The six household objects are generated
images on white (see the session notes), multiplied onto the page's cream so their soft
shadows stay. The phone is drawn here with the real hjem.top capture in it.

Usage: site-flatlay.py <folder with umbrella keys mug plate list bulb .png>
"""
import os
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SIM = Path(os.path.expanduser("~/altid-worktrees/site-captures/2026-11-04/sim"))
SCALE = 1.5
WIDTH, HEIGHT = round(1440 * SCALE), round(613 * SCALE)
CREAM = np.array((253, 250, 244), dtype=np.float32)

# name: (centre x, centre y, width of the object's box, rotation), in page pixels of 1440 x 613.
PLACES = {
    "umbrella": (46, 296, 186, 3),
    "mug": (392, 152, 232, 0),
    "list": (332, 398, 236, -6),
    "keys": (1000, 196, 204, 0),
    "bulb": (945, 455, 184, 72),
    "plate": (1420, 322, 600, 0),
}


def object_layer(path: Path, width: int, angle: float) -> Image.Image:
    im = Image.open(path).convert("RGB")
    a = np.array(im).astype(np.float32)
    # The generated white is slightly off: bring the corners' colour up to pure white, so
    # multiplying leaves no box on the page.
    corners = np.concatenate([a[:24, :24], a[:24, -24:], a[-24:, :24], a[-24:, -24:]]).reshape(-1, 3)
    a = np.clip(a / np.median(corners, axis=0) * 255, 0, 255)
    # Soft shadows fade out to exact white instead of ending on the canvas's edge.
    im = Image.fromarray(a.astype(np.uint8))
    # Trim the white margin first, so `width` is about the object and not its canvas.
    mask = (a.min(-1) < 240)
    rows, cols = np.where(mask.any(1))[0], np.where(mask.any(0))[0]
    pad = 40
    box = (max(cols[0] - pad, 0), max(rows[0] - pad, 0), min(cols[-1] + pad, im.width), min(rows[-1] + pad, im.height))
    im = im.crop(box)
    target = round(width * SCALE)
    im = im.resize((target, round(im.height * target / im.width)), Image.LANCZOS)
    return im.rotate(angle, resample=Image.BICUBIC, expand=True, fillcolor=(255, 255, 255))


def phone(capture: Image.Image, width: int) -> Image.Image:
    """A flat phone from above with the real screen, in the page's phone proportions."""
    height = round(width * 2.0402)
    ss = 3
    big = Image.new("RGBA", (width * ss, height * ss), (0, 0, 0, 0))
    draw = ImageDraw.Draw(big)
    draw.rounded_rectangle((0, 0, width * ss - 1, height * ss - 1), radius=round(0.158 * width * ss), fill=(58, 62, 62, 255))
    inset = round(0.012 * width * ss)
    draw.rounded_rectangle((inset, inset, width * ss - inset - 1, height * ss - inset - 1), radius=round(0.146 * width * ss), fill=(8, 9, 9, 255))
    out = big.resize((width, height), Image.LANCZOS)
    screen_w = round(width * 0.928)
    screen_h = round(screen_w * capture.height / capture.width)
    screen = capture.resize((screen_w, screen_h), Image.LANCZOS).convert("RGBA")
    corners = Image.new("L", (screen_w * ss, screen_h * ss), 0)
    ImageDraw.Draw(corners).rounded_rectangle((0, 0, screen_w * ss - 1, screen_h * ss - 1), radius=round(0.127 * width * ss), fill=255)
    screen.putalpha(corners.resize((screen_w, screen_h), Image.LANCZOS))
    out.alpha_composite(screen, ((width - screen_w) // 2, (height - screen_h) // 2))
    return out


def main(folder: Path) -> None:
    canvas = np.ones((HEIGHT, WIDTH, 3), dtype=np.float32)
    for name, (cx, cy, width, angle) in PLACES.items():
        layer = np.array(object_layer(folder / f"{name}.png", width, angle)).astype(np.float32) / 255
        h, w = layer.shape[:2]
        x = round(cx * SCALE - w / 2)
        y = round(cy * SCALE - h / 2)
        x0, y0, x1, y1 = max(x, 0), max(y, 0), min(x + w, WIDTH), min(y + h, HEIGHT)
        canvas[y0:y1, x0:x1] *= layer[y0 - y : y1 - y, x0 - x : x1 - x]
    out = Image.fromarray(np.clip(canvas * CREAM, 0, 255).astype(np.uint8)).convert("RGBA")
    device = phone(Image.open(SIM / "hjem" / "hjem.top.png").convert("RGB"), round(208 * SCALE))
    px, py = round(720 * SCALE - device.width / 2), round(104 * SCALE)
    shadow = Image.new("RGBA", out.size, (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle((px + 10, py + 22, px + device.width + 6, py + device.height + 16), radius=round(0.158 * device.width), fill=(0, 30, 10, 96))
    out = Image.alpha_composite(out, shadow.filter(ImageFilter.GaussianBlur(20)))
    out.alpha_composite(device, (px, py))
    target = ROOT / "public" / "site" / "render" / "flatlay.webp"
    out.convert("RGB").save(target, "WEBP", quality=80, method=6)
    print(target, target.stat().st_size, out.size)


if __name__ == "__main__":
    main(Path(sys.argv[1]))
