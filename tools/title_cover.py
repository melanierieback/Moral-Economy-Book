#!/usr/bin/env python3
"""Typeset the book title onto the cover artwork, in the NEC house style.

`attached_assets/moral-economy-cover.png` (the cover the reader uses) is the
raw illustration `attached_assets/moral-economy-cover-art.png` (a text-free
gold tree-from-a-book scene) with the title composited on top, so the lettering
is crisp and correct rather than AI-garbled. This matches the sibling readers.

Usage:
    python3 tools/title_cover.py            # re-typeset from the stored art
    python3 tools/title_cover.py --src NEW_ART.png
"""
import argparse
import pathlib
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
ASSETS = ROOT / "attached_assets"
ART = ASSETS / "moral-economy-cover-art.png"      # raw, text-free illustration
COVER = ASSETS / "moral-economy-cover.png"         # titled cover the reader uses

LORA = "/usr/share/fonts/truetype/google-fonts/Lora-Variable.ttf"
LORA_IT = "/usr/share/fonts/truetype/google-fonts/Lora-Italic-Variable.ttf"

GOLD = (240, 203, 108)
GLOW = (202, 154, 56)
SOFT = (233, 206, 150)

TITLE = ["MORAL", "ECONOMY"]
SUB1 = "Capital That Serves Life:"
SUB2 = "Recovering Moral Economy in an Age of Extraction"


def font(path, size, weight=400):
    f = ImageFont.truetype(path, size)
    try:
        f.set_variation_by_axes([weight])
    except Exception:
        pass
    return f


def build(src: pathlib.Path, out: pathlib.Path):
    im = Image.open(src).convert("RGBA")
    W, H = im.size
    cx = W / 2

    # very light feathered scrim in the title band (the nebula is already dark)
    mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(mask).rounded_rectangle([120, 235, W - 120, 660], radius=60, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(60)).point(lambda a: min(a, 70))
    im = Image.composite(Image.new("RGBA", (W, H), (6, 7, 26, 255)), im, mask)

    def tracked(dr, y, text, fnt, fill, tr):
        ws = [dr.textlength(c, font=fnt) for c in text]
        x = cx - (sum(ws) + tr * (len(text) - 1)) / 2
        for c, w in zip(text, ws):
            dr.text((x, y), c, font=fnt, fill=fill)
            x += w + tr

    def glow(base, y, text, fnt, tr, r=14, a=205):
        gl = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        tracked(ImageDraw.Draw(gl), y, text, fnt, GLOW + (a,), tr)
        base.alpha_composite(gl.filter(ImageFilter.GaussianBlur(r)))
        sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        tracked(ImageDraw.Draw(sh), y, text, fnt, GOLD + (255,), tr)
        base.alpha_composite(sh)

    def center(base, y, text, fnt, fill):
        layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        ImageDraw.Draw(layer).text((cx, y), text, font=fnt, fill=fill, anchor="mm")
        base.alpha_composite(layer)

    glow(im, 258, TITLE[0], font(LORA, 140, 700), 10)
    glow(im, 410, TITLE[1], font(LORA, 140, 700), 6)

    d = ImageDraw.Draw(im, "RGBA")
    dy = 576
    d.line([cx - 150, dy, cx - 22, dy], fill=GLOW + (180,), width=2)
    d.line([cx + 22, dy, cx + 150, dy], fill=GLOW + (180,), width=2)
    d.polygon([(cx, dy - 9), (cx + 9, dy), (cx, dy + 9), (cx - 9, dy)], fill=GOLD + (220,))

    center(im, 622, SUB1, font(LORA_IT, 44), GOLD + (240,))
    center(im, 674, SUB2, font(LORA_IT, 35), SOFT + (235,))

    im.convert("RGB").save(out, "PNG", optimize=True)
    print(f"wrote {out} ({out.stat().st_size:,} bytes, {im.size[0]}x{im.size[1]})")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", default=str(ART))
    ap.add_argument("--out", default=str(COVER))
    args = ap.parse_args()
    build(pathlib.Path(args.src), pathlib.Path(args.out))
