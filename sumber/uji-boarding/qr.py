# Writes src/arah/boarding/qr-cv.svg: a real QR code to the CV PDF, one path, viewBox in modules, currentColor ink.
import re, pathlib, segno
URL = 'https://sword-portfolio.vercel.app/CV_Sword_Christ_Imanuel_Ekel.pdf'
qr = segno.make(URL, error='m', micro=False)
svg = qr.svg_inline(scale=1, border=0, dark='#000')
w, h = qr.symbol_size(scale=1, border=0)
path = re.search(r'<path[^>]*/>', svg).group(0).replace('"#000"', '"currentColor"')
out = f'<svg class="qr" viewBox="0 0 {w} {h}" width="{w}" height="{h}" shape-rendering="crispEdges" role="img" aria-label="QR code that opens Sword Ekel’s CV">{path}</svg>'
pathlib.Path('src/arah/boarding/qr-cv.svg').write_text(out, encoding='utf-8')
qr.save('sumber/uji-boarding/qr-cek.png', scale=10, border=4)
print('version', qr.version, 'error', qr.error, 'modules', w, 'bytes', len(out))
