from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
ICON_DIR = ROOT / "icons"
ICON_DIR.mkdir(exist_ok=True)


def make_icon(size: int) -> None:
    scale = size / 128
    image = Image.new("RGBA", (size, size), "#101416")
    draw = ImageDraw.Draw(image)

    def box(values):
        return tuple(round(v * scale) for v in values)

    draw.rectangle(box((16, 20, 112, 108)), fill="#171d20", outline="#f0c75e", width=max(4, round(4 * scale)))
    line_width = max(8, round(8 * scale))
    draw.line(box((34, 54, 54, 54)), fill="#d8f3dc", width=line_width)
    draw.line(box((34, 74, 72, 74)), fill="#d8f3dc", width=line_width)
    draw.line(box((82, 76, 100, 76)), fill="#f0c75e", width=line_width)

    image.save(ICON_DIR / f"icon-{size}.png")


for icon_size in (192, 512):
    make_icon(icon_size)
