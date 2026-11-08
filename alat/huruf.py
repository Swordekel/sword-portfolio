"""Outline the name "Sword Ekel" in Mona Sans for the Gambar Kerja hero: one solid path plus the construction
(on-curve anchors and bezier handles), so the page can show the same letters as ink and as drawing.

    python -I -X utf8 alat/huruf.py [wght] [wdth]

Writes src/arah/gambar/nama.json. Quadratic TrueType curves are rebuilt as cubics (fontTools qu2cu) so the handles
read like a designer's outline instead of a chain of implied points. Shaping (kerning) with HarfBuzz.
"""
import io, json, sys, pathlib
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.qu2cuPen import Qu2CuPen
import uharfbuzz as hb

ROOT = pathlib.Path(__file__).resolve().parent.parent
FONT = ROOT / 'public' / 'font' / 'gambar' / 'mona-sans-normal-0.woff2'
OUT = ROOT / 'src' / 'arah' / 'gambar' / 'nama.json'

W = float(sys.argv[1]) if len(sys.argv) > 1 else 780
D = float(sys.argv[2]) if len(sys.argv) > 2 else 110

var = TTFont(FONT)
inst = instancer.instantiateVariableFont(var, {'wght': W, 'wdth': D})
buf = io.BytesIO()
inst.flavor = None
inst.save(buf)
data = buf.getvalue()
font = TTFont(io.BytesIO(data))
gs = font.getGlyphSet()
upm = font['head'].unitsPerEm
os2 = font['OS/2']
asc, desc = font['hhea'].ascent, font['hhea'].descent
cap, xh = getattr(os2, 'sCapHeight', 700), getattr(os2, 'sxHeight', 500)

hbface = hb.Face(data)
hbfont = hb.Font(hbface)
order = font.getGlyphOrder()

r = lambda v: round(v, 1)


def garis(teks):
    b = hb.Buffer()
    b.add_str(teks)
    b.guess_segment_properties()
    hb.shape(hbfont, b, {'kern': True, 'liga': False})
    x = 0
    d, jangkar, tuas = [], [], []
    huruf = []
    for info, pos in zip(b.glyph_infos, b.glyph_positions):
        name = order[info.codepoint]
        rec = RecordingPen()
        gs[name].draw(Qu2CuPen(rec, max_err=1.0, all_cubic=True))
        ox = x + pos.x_offset
        tx = lambda px: r(ox + px)
        ty = lambda py: r(cap - py)  # y down, cap height at 0, baseline at cap
        prev = None
        kiri, kanan = None, None
        for op, args in rec.value:
            if op == 'moveTo':
                (px, py), = args
                d.append(f'M{tx(px)} {ty(py)}')
                jangkar.append([tx(px), ty(py)])
                prev = (tx(px), ty(py))
            elif op == 'lineTo':
                (px, py), = args
                d.append(f'L{tx(px)} {ty(py)}')
                jangkar.append([tx(px), ty(py)])
                prev = (tx(px), ty(py))
            elif op == 'curveTo':
                (c1x, c1y), (c2x, c2y), (px, py) = args
                p1, p2, p = (tx(c1x), ty(c1y)), (tx(c2x), ty(c2y)), (tx(px), ty(py))
                d.append(f'C{p1[0]} {p1[1]} {p2[0]} {p2[1]} {p[0]} {p[1]}')
                if prev:
                    tuas.append([prev[0], prev[1], p1[0], p1[1]])
                tuas.append([p[0], p[1], p2[0], p2[1]])
                jangkar.append([p[0], p[1]])
                prev = p
            elif op == 'qCurveTo':  # left over when qu2cu keeps a quadratic: draw it as a cubic-equivalent Q
                *cs, (px, py) = args
                for (cx, cy) in cs:
                    tuas.append([prev[0], prev[1], tx(cx), ty(cy)]) if prev else None
                d.append('Q' + ' '.join(f'{tx(cx)} {ty(cy)}' for cx, cy in cs) + f' {tx(px)} {ty(py)}')
                jangkar.append([tx(px), ty(py)])
                prev = (tx(px), ty(py))
            elif op in ('closePath', 'endPath'):
                d.append('Z')
                prev = None
        huruf.append({'g': name, 'x': r(ox), 'w': pos.x_advance})
        x += pos.x_advance
    return {'teks': teks, 'lebar': r(x), 'd': ''.join(d), 'jangkar': jangkar, 'tuas': tuas, 'huruf': huruf}


out = {
    'font': 'Mona Sans', 'wght': W, 'wdth': D, 'upm': upm, 'cap': cap, 'xh': xh, 'asc': asc, 'desc': desc,
    # y = 0 at cap height, y = cap at the baseline; x-height line at cap - xh
    'satu': garis('Sword Ekel'),
    'dua': [garis('Sword'), garis('Ekel')],
}
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(out, separators=(',', ':')), encoding='utf-8')
print('cap', cap, 'xh', xh, 'width', out['satu']['lebar'], 'anchors', len(out['satu']['jangkar']), 'handles', len(out['satu']['tuas']))
