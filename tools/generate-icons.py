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


android_res = ROOT / "android" / "app" / "src" / "main" / "res"
if android_res.exists():
    source = Image.open(ICON_DIR / "icon-512.png").convert("RGBA")
    densities = {
        "mdpi": (48, 108),
        "hdpi": (72, 162),
        "xhdpi": (96, 216),
        "xxhdpi": (144, 324),
        "xxxhdpi": (192, 432),
    }

    for density, (launcher_size, foreground_size) in densities.items():
        folder = android_res / f"mipmap-{density}"
        folder.mkdir(parents=True, exist_ok=True)
        launcher = source.resize((launcher_size, launcher_size), Image.Resampling.LANCZOS)
        launcher.save(folder / "ic_launcher.png")
        launcher.save(folder / "ic_launcher_round.png")

        foreground = Image.new("RGBA", (foreground_size, foreground_size), (0, 0, 0, 0))
        inner_size = round(foreground_size * 0.66)
        inner = source.resize((inner_size, inner_size), Image.Resampling.LANCZOS)
        offset = (foreground_size - inner_size) // 2
        foreground.alpha_composite(inner, (offset, offset))
        foreground.save(folder / "ic_launcher_foreground.png")

    for splash_path in android_res.rglob("splash.png"):
        with Image.open(splash_path) as existing:
            splash_size = existing.size
        splash = Image.new("RGBA", splash_size, "#101416")
        mark_size = round(min(splash_size) * 0.28)
        mark = source.resize((mark_size, mark_size), Image.Resampling.LANCZOS)
        mark_offset = ((splash_size[0] - mark_size) // 2, (splash_size[1] - mark_size) // 2)
        splash.alpha_composite(mark, mark_offset)
        splash.convert("RGB").save(splash_path)
