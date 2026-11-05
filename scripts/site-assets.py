#!/usr/bin/env python3
"""Builds public/site/ image assets for the new altidhjem.dk front page (ALT-1420).

One-off tool, run by hand, not part of the build. Needs Pillow, numpy, scipy;
the qr step also needs qrcode (a throwaway venv is enough, no package.json change).

Usage: site-assets.py <screens|cutouts|crops|pieces|icons|plates|brand|qr|all>

Inputs live outside this repo: the captures in ~/altid-worktrees/site-captures,
the app worktree ~/altid-hjem-app-worktrees/site-captures (read only), and the
brand folder in the work folder. Plates are read with an anonymous GET from the
public catalog-images bucket; the ids below are the dishes' card pictures.
"""
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "site"
SIM = Path(os.path.expanduser("~/altid-worktrees/site-captures/2026-11-04/sim"))
APP = Path(os.path.expanduser("~/altid-hjem-app-worktrees/site-captures"))
WORK = Path(os.path.expanduser("~/Library/Mobile Documents/com~apple~CloudDocs/Altid Hjem/Claude Code/Altid Hjem"))

SCREENS = {
    "hjem": ["hjem.top", "hjem.scrolled"],
    "okonomi": ["okonomi.top", "okonomi.category_transport", "droemme.detail", "regninger.top", "regninger.chart"],
    "mad": ["mad.meal_plan", "mad.recipe", "mad.trip", "mad.trip.in_progress", "mad.flow.1_tastes"],
    "energi": ["energi.home", "energi.usage", "energi.balance"],
    "forsikring": ["b.flow.3_insurances_chosen", "b.forlob.waiting"],
}
SCREEN_WIDTH = 900
SCREEN_QUALITY = 82

# name -> (frame, seed x, seed y). The seed sits on the element's flat fill, with
# text-free pixels straight left, right, up and down of it.
CHIPS = {
    "chip-bil": ("forsikring/b.flow.3_insurances_chosen", 350, 1322),
    "chip-hus": ("forsikring/b.flow.3_insurances_chosen", 830, 890),
}

# Dishes for the week of plates: slug, real catalogue name, image id of the dish's
# "card" picture. Its w800 file has the plate about 695 px across on a cream ground.
# The card_alpha cut-out has the plate only 528 px across and a shadow cut off in a hard line.
PLATES = [
    ("pizza", "Hjemmelavet pizza med tomat og mozzarella", "01a0e34b-4c42-7707-8c22-9ab9df5a5d60"),
    ("butter-chicken", "Butter chicken med ris og naan", "01a0e34b-4c3a-7cd2-b9ea-cba85015f024"),
    ("kyllingewok", "Kyllingewok med æggenudler, broccoli og spidskål", "01a0e34b-4c56-7c5b-b2c3-367db0b01090"),
    ("stegt-flaesk", "Stegt flæsk med kartofler og persillesovs", "01a0e34b-4c51-7b9e-ba5e-be0522e37c86"),
    ("svamperisotto", "Svamperisotto med brune champignon", "01a0e34b-4c52-7243-9c05-354a3b029622"),
    ("tacos", "Klassiske tacos med oksefars", "01a0e34b-4c52-74a1-a4df-e2d91e3cf427"),
    ("kylling-i-karry", "Kylling i karry med æble, gulerod og ris", "01a140ff-42e7-7bc5-8e9e-c6940223c7f9"),
]
BUCKET = "https://smzxcmmjmmhzvrmcoxte.supabase.co/storage/v1/object/public/catalog-images"

STORE_LINKS = {
    "app-store": "https://apps.apple.com/dk/app/altid-hjem/id6794330094?pt=129212732&ct=ah_1_altidhjem_dk&mt=8",
    "google-play": "https://play.google.com/store/apps/details?id=dk.altidhjem.app&referrer=utm_source%3Daltidhjem_dk%26utm_campaign%3Dah_1_altidhjem_dk",
}
DEEP_FOREST = "#003C16"


def web_name(frame: str) -> str:
    return frame.lower().replace(".", "-")


def load_frame(frame: str) -> np.ndarray:
    return np.array(Image.open(SIM / f"{frame}.png").convert("RGB")).astype(np.int32)


# Captures scrolled past the dark panel: the panel's last sliver sits grey behind the
# status bar and reads as a mistake on a page. Only the rows above STATUS_BAND_END change.
STATUS_BAND_FRAMES = {"hjem.scrolled"}
STATUS_BAND_END = 150  # px at 1179 wide: below the status glyphs, above the first content


def clean_status_band(im: Image.Image) -> Image.Image:
    """Flat cream behind the status bar, with the time, island, signal, wifi and battery kept.

    The glyphs are black, so each pixel's coverage is how far it falls below the local
    background, which a closing wider than any stroke recovers. The island is wider than
    the closing, so anything near black counts as fully covered. Every pixel then becomes
    (1 - coverage) x cream, cream being the capture's own colour on the first row below
    the band, so no step shows there.
    """
    rgb = np.array(im).astype(np.float64)
    band = rgb[:STATUS_BAND_END]
    cream = rgb[STATUS_BAND_END, 6]
    lum = band.mean(-1)
    background = ndimage.grey_closing(lum, size=(45, 45))
    coverage = np.clip((background - lum) / np.maximum(background, 1), 0, 1)
    coverage[lum < 40] = 1
    rgb[:STATUS_BAND_END] = (1 - coverage[..., None]) * cream
    return Image.fromarray(np.round(rgb).astype(np.uint8))


# regninger.chart is scrolled so a row runs under the clock. Replaces the rows above the
# heading with the clean status bar from okonomi.mod_normal over the screen's own cream.
CHART_TOP_END = 262


def clean_chart_top(im: Image.Image) -> Image.Image:
    rgb = np.array(im).astype(np.float64)
    status = np.array(clean_status_band(Image.open(SIM / "okonomi" / "okonomi.mod_normal.png").convert("RGB"))).astype(np.float64)
    rgb[:STATUS_BAND_END] = status[:STATUS_BAND_END]
    start, end = status[STATUS_BAND_END, 6], rgb[CHART_TOP_END, 6]
    steps = np.linspace(0, 1, CHART_TOP_END - STATUS_BAND_END)[:, None, None]
    rgb[STATUS_BAND_END:CHART_TOP_END] = (1 - steps) * start + steps * end
    return Image.fromarray(np.round(rgb).astype(np.uint8))


def build_screens() -> None:
    target = OUT / "app"
    target.mkdir(parents=True, exist_ok=True)
    for folder, frames in SCREENS.items():
        for frame in frames:
            im = Image.open(SIM / folder / f"{frame}.png").convert("RGB")
            if frame in STATUS_BAND_FRAMES:
                im = clean_status_band(im)
            if frame == "regninger.chart":
                im = clean_chart_top(im)
            height = round(im.height * SCREEN_WIDTH / im.width)
            im = im.resize((SCREEN_WIDTH, height), Image.LANCZOS)
            im.save(target / f"{web_name(frame)}.webp", "WEBP", quality=SCREEN_QUALITY, method=6)


def rrect_mask(width: int, height: int, radius: float, scale: int = 8) -> np.ndarray:
    big = Image.new("L", (width * scale, height * scale), 0)
    ImageDraw.Draw(big).rounded_rectangle((0, 0, width * scale - 1, height * scale - 1), radius=radius * scale, fill=255)
    return np.array(big.resize((width, height), Image.BOX)).astype(np.float64) / 255


def decontaminate(rgb: np.ndarray, alpha: np.ndarray) -> np.ndarray:
    """Edge pixels carry the screen behind them; give them the nearest solid pixel's colour."""
    _, (ys, xs) = ndimage.distance_transform_edt(alpha < 1, return_indices=True)
    return rgb[ys, xs]


def walk(rgb: np.ndarray, x: int, y: int, dx: int, dy: int, fill: np.ndarray) -> int:
    """Steps from (x, y) until the pixel stops being fill; returns the last fill coordinate."""
    while True:
        nx, ny = x + dx, y + dy
        if np.abs(rgb[ny, nx] - fill).sum() > 24:
            return x if dx else y
        x, y = nx, ny


def cut_flat_element(name: str, frame: str, seed_x: int, seed_y: int) -> None:
    rgb = load_frame(frame)
    fill = rgb[seed_y, seed_x]
    x0 = walk(rgb, seed_x, seed_y, -1, 0, fill)
    x1 = walk(rgb, seed_x, seed_y, 1, 0, fill)
    y0 = walk(rgb, seed_x, seed_y, 0, -1, fill)
    y1 = walk(rgb, seed_x, seed_y, 0, 1, fill)
    width, height = x1 - x0 + 1, y1 - y0 + 1
    crop = rgb[y0 : y1 + 1, x0 : x1 + 1]
    behind = rgb[(y0 + y1) // 2, x0 - 3]
    corner_scores = {}
    for radius in range(24, 91, 3):
        coverage = rrect_mask(width, height, radius)
        expected = coverage[..., None] * fill + (1 - coverage[..., None]) * behind
        size = radius + 2
        corners = [(0, 0), (0, width - size), (height - size, 0), (height - size, width - size)]
        corner_scores[radius] = sum(np.abs(expected[r : r + size, c : c + size] - crop[r : r + size, c : c + size]).sum() for r, c in corners)
    radius = min(corner_scores, key=corner_scores.get)
    alpha = rrect_mask(width, height, radius)
    pixels = decontaminate(crop, alpha)
    out = np.dstack([pixels, np.round(alpha * 255)]).astype(np.uint8)
    (OUT / "app").mkdir(parents=True, exist_ok=True)
    Image.fromarray(out).save(OUT / "app" / f"{name}.webp", "WEBP", lossless=True, method=6)
    print(f"{name}: box x {x0}-{x1} y {y0}-{y1} ({width}x{height}), radius {radius} px, fill {tuple(int(v) for v in fill)}")


def painting_rebuild(width: int, height: int, level: float) -> np.ndarray:
    """The app's DreamPicture for the coast painting, from its own layers and formula."""
    scale = max(width / 960, height / 1280)
    size = (round(960 * scale), round(1280 * scale))
    left, top = (size[0] - width) // 2, (size[1] - height) // 2
    box = (left, top, left + width, top + height)
    folder = APP / "assets/images/hjem/dreams/3.0x"
    colour = Image.open(folder / "coast_colour.png").convert("RGB").resize(size, Image.LANCZOS).crop(box)
    line = Image.open(folder / "coast_line.png").convert("RGB").resize(size, Image.LANCZOS).crop(box)
    ss = 4
    height_pt, width_pt = height / 3, width / 3
    line_y = (height_pt + 5) * (1 - level) - 2.5
    wave = [(width_pt * i / 48, line_y + 2.5 * np.sin(2 * np.pi * 3 * i / 48)) for i in range(49)]
    wave_px = [(x * 3 * ss, y * 3 * ss) for x, y in wave]
    above = Image.new("L", (width * ss, height * ss), 0)
    ImageDraw.Draw(above).polygon([(0, 0), (width * ss, 0)] + wave_px[::-1], fill=255)
    above = above.resize((width, height), Image.BOX)
    picture = Image.composite(line, colour, above)
    stroke = Image.new("L", (width * ss, height * ss), 0)
    ImageDraw.Draw(stroke).line(wave_px, fill=round(255 * 0.9), width=round(2.1 * 3 * ss), joint="curve")
    picture.paste((255, 255, 255), mask=stroke.resize((width, height), Image.BOX))
    return np.array(picture).astype(np.int32)


def cut_painting() -> None:
    rgb = load_frame("okonomi/droemme.detail")
    paper = rgb[1500, 100]
    x0, x1, y0, y1 = 274, 904, 1059, 1730  # the frame's 1 pt border, read from the capture
    width, height = x1 - x0 + 1, y1 - y0 + 1
    crop = rgb[y0 : y1 + 1, x0 : x1 + 1]

    # The 62 % chip: pure white, centred on the water line, overhanging the right edge.
    white = (rgb[y0 : y1 + 1, x1 - 120 : x1 + 90] >= 254).all(-1)
    labels, _ = ndimage.label(white)
    sizes = ndimage.sum(white, labels, range(1, labels.max() + 1))
    chip = labels == int(np.argmax(sizes)) + 1
    cy, cx = np.where(chip)
    chip_x0, chip_y0, chip_y1 = int(cx.min()) + x1 - 120 - x0, int(cy.min()), int(cy.max())

    rebuilt = painting_rebuild(width, height, 15500 / 25000)
    # Prove the rebuild against the screen everywhere the chip does not cover.
    check = np.ones((height, width), dtype=bool)
    check[max(chip_y0 - 6, 0) : chip_y1 + 7, chip_x0 - 6 :] = False
    inset = 12
    check[:inset] = check[-inset:] = False
    check[:, :inset] = check[:, -inset:] = False
    error = np.abs(rebuilt - crop)[check].mean()
    if error > 3:
        raise SystemExit(f"painting rebuild does not match the screen: mean error {error:.2f}")

    border = np.array([0x16, 0x32, 0x23])
    out = crop.copy()
    pad = 3
    r0, r1, c0 = chip_y0 - pad, chip_y1 + pad + 1, chip_x0 - pad
    patch = rebuilt[r0:r1, c0:].astype(np.float64)
    # The 1 pt ink border the app draws over the picture, as the columns above the chip read.
    patch[:, -4] = patch[:, -4] * (1 - 0.157) + border * 0.157
    patch[:, -3:-1] = patch[:, -3:-1] * 0.68 + border * 0.32
    out[r0:r1, c0:] = np.round(patch).astype(np.int32)
    # The first and last columns are half paper on the screen: leave them out.
    out = out[:, 1:-1]
    width -= 2

    # Radius: walk the diagonal in from the corner to the first pixel of the border.
    t = next(i for i in range(1, 80) if np.abs(rgb[y0 + i, x0 + i] - paper).sum() > 12)
    radius = round(t / 0.2929 / 3) * 3
    alpha = rrect_mask(width, height, radius)
    pixels = decontaminate(out, alpha)
    (OUT / "app").mkdir(parents=True, exist_ok=True)
    result = Image.fromarray(np.dstack([pixels, np.round(alpha * 255)]).astype(np.uint8))
    result.save(OUT / "app" / "painting.webp", "WEBP", quality=90, alpha_quality=100, method=6)
    print(f"painting: box x {x0}-{x1} y {y0}-{y1} ({width}x{height}), radius {radius} px, chip rows {r0}-{r1} from col {c0} rebuilt, mean error elsewhere {error:.2f}")


def cut_umbrella() -> None:
    rgb = load_frame("forsikring/b.welcome.1")
    bg = np.array([22, 50, 35])
    x0, y0, x1, y1 = 250, 720, 930, 1370
    area = rgb[y0:y1, x0:x1]
    near_bg = np.abs(area - bg).sum(-1) < 8
    labels, _ = ndimage.label(near_bg)
    outside = labels == labels[0, 0]
    # Whole shapes only: the two sparkles are decoration, not the umbrella.
    shape_labels, _ = ndimage.label(~outside, structure=np.ones((3, 3)))
    sizes = ndimage.sum(~outside, shape_labels, range(1, shape_labels.max() + 1))
    keep = np.isin(shape_labels, [i + 1 for i, s in enumerate(sizes) if s > 2000])
    solid = ndimage.binary_erosion(keep, iterations=2)
    _, (ys, xs) = ndimage.distance_transform_edt(~solid, return_indices=True)
    fg = area[ys, xs].astype(np.float64)
    offset = area - bg
    towards = fg - bg
    coverage = np.clip((offset * towards).sum(-1) / np.maximum((towards**2).sum(-1), 1), 0, 1)
    alpha = np.where(solid, 1.0, np.where(ndimage.binary_dilation(keep, iterations=1), coverage, 0.0))
    pixels = np.where(solid[..., None], area, fg)
    rows = np.where(alpha.max(1) > 0)[0]
    cols = np.where(alpha.max(0) > 0)[0]
    box = (rows.min(), rows.max() + 1, cols.min(), cols.max() + 1)
    out = np.dstack([pixels, np.round(alpha * 255)])[box[0] : box[1], box[2] : box[3]].astype(np.uint8)
    (OUT / "brand").mkdir(parents=True, exist_ok=True)
    Image.fromarray(out).save(OUT / "brand" / "umbrella.webp", "WEBP", lossless=True, method=6)
    print(f"umbrella: box x {x0 + box[2]}-{x0 + box[3] - 1} y {y0 + box[0]}-{y0 + box[1] - 1}")


def build_cutouts() -> None:
    for name, (frame, x, y) in CHIPS.items():
        cut_flat_element(name, frame, x, y)
    cut_painting()
    cut_umbrella()


# Focal crops for break-outs and marquee tiles, straight from the 1179 px captures.
# name -> (frame, (x0, y0, x1, y1), corner radius in source px, output width or None).
# Radius 0 means the page draws the corners; a radius cuts the corners to alpha, for
# elements that float over something else on the page.
CROPS = {
    "crop-foran-card": ("hjem/hjem.top", (192, 891, 1107, 1176), 51, None),
}


def build_crops() -> None:
    (OUT / "app").mkdir(parents=True, exist_ok=True)
    for name, (frame, (x0, y0, x1, y1), radius, width) in CROPS.items():
        crop = load_frame(frame)[y0:y1, x0:x1]
        if radius:
            alpha = rrect_mask(x1 - x0, y1 - y0, radius)
            picture = Image.fromarray(np.dstack([decontaminate(crop, alpha), np.round(alpha * 255)]).astype(np.uint8))
        else:
            picture = Image.fromarray(crop.astype(np.uint8))
        if width:
            upscaling = width > picture.width
            picture = picture.resize((width, round(picture.height * width / picture.width)), Image.LANCZOS)
            if upscaling:
                picture = picture.filter(ImageFilter.UnsharpMask(radius=2, percent=90, threshold=2))
        picture.save(OUT / "app" / f"{name}.webp", "WEBP", quality=88, alpha_quality=100, method=6)
        print(f"{name}: {picture.size}, background {tuple(int(v) for v in crop[3, 3])}")


def fit_plate(rgb: np.ndarray) -> tuple[int, int, int]:
    """Finds the plate's rim: the circle with the strongest step from plate to ground."""
    lum = ndimage.gaussian_filter(rgb.astype(np.float64).mean(-1), 1)
    angles = np.linspace(0, 2 * np.pi, 720, endpoint=False)
    best = (-1.0, 400, 400, 345)
    # The catalogue's plates are all about 348 in radius near the centre; a wider search finds the inner rim instead.
    for cx in range(397, 407):
        for cy in range(397, 407):
            for r in range(342, 354):
                inner = ndimage.map_coordinates(lum, [cy + (r - 3) * np.sin(angles), cx + (r - 3) * np.cos(angles)], order=1)
                outer = ndimage.map_coordinates(lum, [cy + (r + 3) * np.sin(angles), cx + (r + 3) * np.cos(angles)], order=1)
                score = float(np.median(inner - outer))
                if score > best[0]:
                    best = (score, cx, cy, r)
    return best[1], best[2], best[3]


def circle_mask(size: int, radius: float, scale: int = 8) -> np.ndarray:
    big = Image.new("L", (size * scale, size * scale), 0)
    centre = size * scale / 2
    ImageDraw.Draw(big).ellipse((centre - radius * scale, centre - radius * scale, centre + radius * scale, centre + radius * scale), fill=255)
    return np.array(big.resize((size, size), Image.BOX)).astype(np.float64) / 255


def build_plates() -> None:
    target = OUT / "plates"
    target.mkdir(parents=True, exist_ok=True)
    listing = []
    with tempfile.TemporaryDirectory() as folder:
        for slug, name, image_id in PLATES:
            local = Path(folder) / f"{slug}.webp"
            subprocess.run(["curl", "-sS", "-f", "-m", "30", "-o", str(local), f"{BUCKET}/{image_id}/w800.webp"], check=True)
            rgb = np.array(Image.open(local).convert("RGB"))
            cx, cy, rim = fit_plate(rgb)
            radius = rim - 3  # just inside the rim, so no ground or shadow comes along
            half = radius + 2
            crop = rgb[cy - half : cy + half, cx - half : cx + half]
            alpha = circle_mask(2 * half, radius)
            pixels = decontaminate(crop, alpha)
            out = np.dstack([pixels, np.round(alpha * 255)]).astype(np.uint8)
            Image.fromarray(out).save(target / f"{slug}.webp", "WEBP", quality=84, alpha_quality=100, method=6)
            print(f"{slug}: centre {cx},{cy}, rim {rim}, file {2 * half} px")
            listing.append({"slug": slug, "name": name, "source": f"catalog-images/{image_id}/w800.webp"})
    (target / "plates.json").write_text(json.dumps(listing, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def build_brand() -> None:
    target = OUT / "brand"
    target.mkdir(parents=True, exist_ok=True)
    pack = WORK / "brand" / "logo-pack"
    copies = [
        (pack / "lockup/altid-hjem-lockup-white.svg", "lockup-white.svg"),
        (pack / "lockup/altid-hjem-lockup-deep-forest.svg", "lockup-deep-forest.svg"),
        (APP / "assets/svg/hjem_payday_stack_large.svg", "coin-stack.svg"),
    ]
    for source, name in copies:
        shutil.copyfile(source, target / name)


def qr_svg(url: str) -> str:
    import qrcode

    code = qrcode.QRCode(version=8, error_correction=qrcode.constants.ERROR_CORRECT_M, border=4)
    code.add_data(url)
    code.make(fit=True)
    matrix = code.get_matrix()
    size = len(matrix)
    runs = []
    for y, row in enumerate(matrix):
        x = 0
        while x < size:
            if row[x]:
                start = x
                while x < size and row[x]:
                    x += 1
                runs.append(f"M{start} {y}h{x - start}v1h-{x - start}z")
            else:
                x += 1
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" shape-rendering="crispEdges"><path fill="{DEEP_FOREST}" d="{"".join(runs)}"/></svg>\n'


def build_qr() -> None:
    target = OUT / "qr"
    target.mkdir(parents=True, exist_ok=True)
    for name, url in STORE_LINKS.items():
        (target / f"{name}.svg").write_text(qr_svg(url), encoding="utf-8")


# Real crops for the floating cards. name -> (frame, box, corner radius in source px, output width).
PIECES = {
    "piece-bars": ("hjem/hjem.top", (40, 590, 1140, 890), 44, 520),
    "piece-1076": ("okonomi/okonomi.top", (40, 390, 1000, 640), 44, 460),
    "piece-148": ("energi/energi.home", (40, 290, 960, 520), 44, 460),
    "piece-bilka": ("mad/mad.trip", (64, 1152, 480, 1236), 40, 340),
    "piece-week": ("mad/mad.meal_plan", (20, 960, 1160, 1250), 44, 800),
    "piece-ingredients": ("mad/mad.recipe", (60, 1690, 1130, 2520), 44, 960),
    "piece-bilka-section": ("mad/mad.trip", (40, 1130, 1150, 2060), 44, 800),
    "piece-ticked": ("mad/mad.trip.in_progress", (40, 1370, 1150, 2060), 44, 800),
}

# Tiles stacked into two tall columns for the Altid Energi card, at 2x of 392 px.
ENERGI_COLUMNS = {
    "energi-col-1": [
        ("energi/energi.home.full", (30, 250, 1150, 1130)),
        ("energi/energi.home.full", (30, 1375, 1150, 2060)),
        ("energi/energi.usage.full", (30, 2258, 1150, 2640)),
    ],
    "energi-col-2": [
        ("energi/energi.balance", (30, 700, 1150, 1210)),
        ("energi/energi.usage.full", (30, 1590, 1150, 2210)),
        ("energi/energi.home.full", (40, 1060, 1000, 1200)),
        ("energi/energi.usage.full", (30, 270, 1150, 960)),
    ],
}
COLUMN_WIDTH = 784
COLUMN_GAP = 32
COLUMN_RADIUS = 48


def on_white(rgb: np.ndarray, background: np.ndarray) -> np.ndarray:
    """Turns a capture's flat cream or sand ground into white, keeping the ink on it."""
    return np.clip(rgb.astype(np.float64) / background * 255, 0, 255)


def white_tile(parts: list[tuple[str, tuple[int, int, int, int]]], name: str) -> None:
    """A 376 x 198 white tile (2x of 188 x 99) of real crops, stacked and left aligned."""
    width, height, pad = 376, 198, 24
    tile = np.full((height, width, 3), 255, dtype=np.float64)
    rows = []
    for frame, (x0, y0, x1, y1) in parts:
        rgb = load_frame(frame)
        crop = on_white(rgb[y0:y1, x0:x1], rgb[y0, x0].astype(np.float64))
        scale = min(1.0, (width - 2 * pad) / (x1 - x0)) * 0.8
        rows.append(np.array(Image.fromarray(crop.astype(np.uint8)).resize((round((x1 - x0) * scale), round((y1 - y0) * scale)), Image.LANCZOS)))
    y = (height - sum(r.shape[0] for r in rows) - 8) // 2
    for small in rows:
        tile[y : y + small.shape[0], pad : pad + small.shape[1]] = small
        y += small.shape[0] + 8
    Image.fromarray(tile.astype(np.uint8)).save(OUT / "app" / f"{name}.webp", "WEBP", quality=90, method=6)
    print(name, "last row at", y)


def build_pieces() -> None:
    target = OUT / "app"
    target.mkdir(parents=True, exist_ok=True)
    for name, (frame, (x0, y0, x1, y1), radius, width) in PIECES.items():
        crop = load_frame(frame)[y0:y1, x0:x1]
        alpha = rrect_mask(x1 - x0, y1 - y0, radius)
        picture = Image.fromarray(np.dstack([decontaminate(crop, alpha), np.round(alpha * 255)]).astype(np.uint8))
        picture = picture.resize((width, round(picture.height * width / picture.width)), Image.LANCZOS)
        picture.save(target / f"{name}.webp", "WEBP", quality=84, alpha_quality=90, method=6)
    # The blue "2 ting til dig" card, cut along its own edges.
    cut_flat_element("piece-ting", "hjem/hjem.top", 880, 1515)
    # The Restaurant og takeaway tile, its fill carried on down to the tile's box.
    rgb = load_frame("okonomi/okonomi.top")
    tile = rgb[692:1049, 720:1100]
    width = tile.shape[1]
    tall = round(width * 213 / 161)
    fill = tile[-20, width // 2]
    extended = np.ones((tall, width, 3), dtype=np.int32) * fill
    extended[: tile.shape[0]] = tile
    extended[tile.shape[0] - 24 :] = fill
    Image.fromarray(extended.astype(np.uint8)).save(target / "piece-takeaway.webp", "WEBP", quality=88, method=6)
    white_tile([("okonomi/regninger.top", (66, 1880, 560, 1940)), ("okonomi/regninger.top", (130, 1995, 620, 2140))], "piece-regning")
    white_tile([("okonomi/regninger.chart", (66, 1110, 420, 1170)), ("okonomi/regninger.chart", (100, 1810, 560, 1940))], "piece-fast")
    for name, tiles in ENERGI_COLUMNS.items():
        rows = []
        for frame, (x0, y0, x1, y1) in tiles:
            crop = load_frame(frame)[y0:y1, x0:x1]
            height = round((y1 - y0) * COLUMN_WIDTH / (x1 - x0))
            rows.append(np.array(Image.fromarray(crop.astype(np.uint8)).resize((COLUMN_WIDTH, height), Image.LANCZOS)))
        total = sum(r.shape[0] for r in rows) + COLUMN_GAP * (len(rows) - 1)
        out = np.zeros((total, COLUMN_WIDTH, 4), dtype=np.uint8)
        y = 0
        for row in rows:
            alpha = rrect_mask(COLUMN_WIDTH, row.shape[0], COLUMN_RADIUS)
            out[y : y + row.shape[0]] = np.dstack([decontaminate(row, alpha), np.round(alpha * 255)]).astype(np.uint8)
            y += row.shape[0] + COLUMN_GAP
        Image.fromarray(out).save(target / f"{name}.webp", "WEBP", quality=82, alpha_quality=90, method=6)
        print(name, out.shape)


def build_icons() -> None:
    target = OUT / "icons"
    target.mkdir(parents=True, exist_ok=True)
    folder = APP / "assets/svg/category"
    for source in sorted(folder.glob("*_filled.svg")):
        shutil.copyfile(source, target / source.name.replace("_filled", ""))


STEPS = {"pieces": build_pieces, "icons": build_icons, "screens": build_screens, "cutouts": build_cutouts, "crops": build_crops, "plates": build_plates, "brand": build_brand, "qr": build_qr}

if __name__ == "__main__":
    step = sys.argv[1]
    for run in STEPS.values() if step == "all" else [STEPS[step]]:
        run()
