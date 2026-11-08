"""Turn the capture masters (sumber/tangkap/<key>/) into shipping WebP files and build data.

    python -I -X utf8 alat/media.py [key ...]

Writes:
  public/media/karya/<key>-<shot>-<w>.webp   shot = desk, desk-1, desk-2 (widths 1600/960/560), hp (720/400)
  src/media.json        per key and shot: master size and the widths written
  src/geo/<key>-<shot>.json   layout geometry for the structure drawings (copied as captured)
  src/info/<key>.json   measured facts (title, fonts, WebGL contexts, transfer size, requests)
POS has no public screen without a login, so its shots come from the cashier guide's demo-outlet screenshots
(Dokumen/sumber/panduan/img): the owner name in the dashboard footer is painted out.
"""
import json, sys, shutil, pathlib
from PIL import Image, ImageDraw

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'sumber' / 'tangkap'
OUT = ROOT / 'public' / 'media' / 'karya'
GEO = ROOT / 'src' / 'geo'
INFO = ROOT / 'src' / 'info'
for d in (OUT, GEO, INFO):
    d.mkdir(parents=True, exist_ok=True)
MAN = ROOT / 'src' / 'media.json'
man = json.loads(MAN.read_text(encoding='utf-8')) if MAN.exists() else {}

LEBAR = {'desk': [1600, 960, 560, 400, 160], 'desk-1': [1600, 960, 560], 'desk-2': [1600, 960, 560], 'hp': [720, 400]}
PANDUAN = ROOT.parent / 'Dokumen' / 'sumber' / 'panduan' / 'img'


def simpan(img, key, shot):
    img = img.convert('RGB')
    w0, h0 = img.size
    ditulis = []
    for w in LEBAR[shot]:
        if w > w0 * 1.02:
            continue
        h = round(h0 * w / w0)
        im = img.resize((w, h), Image.LANCZOS) if w != w0 else img
        im.save(OUT / f'{key}-{shot}-{w}.webp', 'WEBP', quality=80 if w >= 900 else 78, method=6)
        ditulis.append(w)
    if not ditulis:  # master narrower than every target: keep it at its own width
        img.save(OUT / f'{key}-{shot}-{w0}.webp', 'WEBP', quality=80, method=6)
        ditulis.append(w0)
    man.setdefault(key, {})[shot] = {'w': w0, 'h': h0, 'lebar': ditulis}


def pos():
    kasir = Image.open(PANDUAN / 'kasir-05-layar-jual.jpg')
    simpan(kasir, 'pos', 'desk')
    dash = Image.open(PANDUAN / 'dash-02-ringkasan.jpg').convert('RGB')
    d = ImageDraw.Draw(dash)
    w, h = dash.size
    bg = dash.getpixel((140, h - 120))
    d.rectangle([0, int(h * 0.915), int(w * 0.175), h], fill=bg)  # the account footer (owner's name)
    simpan(dash, 'pos', 'desk-1')
    simpan(Image.open(PANDUAN / 'kasir-08-bayar.jpg'), 'pos', 'desk-2')
    info = {'key': 'pos', 'url': 'https://pos.arswordlab.com/', 'demo': True,
            'sumber': 'Cashier guide screenshots from the local demo outlet (test data), Sep 2026'}
    (INFO / 'pos.json').write_text(json.dumps(info, ensure_ascii=False, indent=1), encoding='utf-8')


def satu(key):
    d = SRC / key
    if not (d / 'info.json').exists():
        print(key, 'no capture yet')
        return
    for shot in ('desk', 'desk-1', 'desk-2', 'hp'):
        f = d / f'{shot}.png'
        if not f.exists():
            continue
        simpan(Image.open(f), key, shot)
        g = d / f'{shot}-geo.json'
        if g.exists():
            shutil.copyfile(g, GEO / f'{key}-{shot}.json')
    shutil.copyfile(d / 'info.json', INFO / f'{key}.json')
    print(key, 'ok', man[key].get('desk', {}).get('lebar'))


keys = sys.argv[1:] or sorted(p.name for p in SRC.iterdir() if p.is_dir()) + ['pos']
for k in keys:
    if k == 'pos':
        pos()
        print('pos ok (guide screenshots)')
    else:
        satu(k)
MAN.write_text(json.dumps(man, indent=1, sort_keys=True), encoding='utf-8')
