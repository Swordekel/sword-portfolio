"""Cut the blue studio backdrop out of the LinkedIn portrait with a border flood fill (no ComfyUI, owner's rule),
then write a grayscale cut-out for the about section.

    python -I -X utf8 alat/foto.py <portrait.jpg>

Writes sumber/foto/potret-alpha.png (colour, transparent) and potret-abu.png (grayscale, transparent).
"""
import sys, pathlib
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'sumber' / 'foto'
OUT.mkdir(parents=True, exist_ok=True)

src = Image.open(sys.argv[1]).convert('RGB')
a = np.asarray(src).astype(np.float32)
r, g, b = a[..., 0], a[..., 1], a[..., 2]

# the backdrop: saturated blue (B well above R, G above R). Score 0 = surely backdrop, 1 = surely subject.
blueness = (b - r) - 0.35 * np.abs(g - (r + b) / 2)
bg_core = (blueness > 95) & (b > 150)
# keep only backdrop connected to the border, so blue-ish pixels inside the subject survive
lab, _ = ndimage.label(bg_core)
border = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
border = border[border > 0]
bg = np.isin(lab, border)
bg = ndimage.binary_closing(bg, iterations=2)

# soft edge: a ramp over the blueness score near the boundary, limited to a thin band around the hard mask
band = ndimage.binary_dilation(bg, iterations=3) & ~ndimage.binary_erosion(bg, iterations=3)
soft = np.clip((95 - blueness) / 60.0, 0, 1)  # 0 at strong blue, 1 at no blue
alpha = np.where(bg, 0.0, 1.0)
alpha = np.where(band, np.minimum(alpha + soft * band, 1.0) * np.where(bg, soft, 1.0), alpha)
alpha = ndimage.gaussian_filter(alpha, 0.6)

# de-spill: pull the blue cast out of edge pixels
spill = np.clip(b - np.maximum(r, g), 0, None) * (1 - alpha) * 1.2
b2 = np.clip(b - spill, 0, 255)
rgb = np.stack([r, g, b2], -1)

col = np.dstack([rgb, alpha * 255]).astype(np.uint8)
Image.fromarray(col, 'RGBA').save(OUT / 'potret-alpha.png')

# grayscale with a gentle tone curve (lifted shadows, clean highlights)
lum = 0.299 * r + 0.587 * g + 0.114 * b2
lum = 255 * np.clip((lum / 255.0) ** 0.92 * 1.04 - 0.02, 0, 1)
grey = np.dstack([lum, lum, lum, alpha * 255]).astype(np.uint8)
Image.fromarray(grey, 'RGBA').save(OUT / 'potret-abu.png')
print('alpha mean', float(alpha.mean()), 'saved', OUT)
