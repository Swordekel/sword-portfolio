"""Download a Google Font's Latin woff2 files and write a self-hosted @font-face stylesheet.

    python -I -X utf8 alat/font.py "<Family Name>" <folder> [axis spec] [--italic]

    examples:
      python -I -X utf8 alat/font.py "Geist" gambar "wght@400..800"
      python -I -X utf8 alat/font.py "Geist Mono" gambar "wght@400..600"

Writes public/font/<folder>/<slug>-<n>.woff2 and prints the @font-face CSS (also saved as <slug>.css beside them)
with url(/font/<folder>/...). Only the "latin" subset is kept (covers English and Indonesian, dashes and quotes).
"""
import re, sys, pathlib, urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36'

fam, folder = sys.argv[1], sys.argv[2]
spec = next((a for a in sys.argv[3:] if not a.startswith('--')), '')
italic = '--italic' in sys.argv
q = fam.replace(' ', '+')
if spec:
    axis, rng = spec.split('@')
    q += f':{"ital," if italic else ""}{axis}@' + (f'0,{rng};1,{rng}' if italic else rng)
url = f'https://fonts.googleapis.com/css2?family={q}&display=swap'
css = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA})).read().decode()

out = ROOT / 'public' / 'font' / folder
out.mkdir(parents=True, exist_ok=True)
slug = re.sub(r'[^a-z0-9]+', '-', fam.lower()).strip('-')
blocks = re.findall(r'/\*\s*([\w-]+)\s*\*/\s*(@font-face\s*{[^}]*})', css)
res = []
n = 0
for subset, block in blocks:
    if subset != 'latin':
        continue
    src = re.search(r'url\((https://[^)]+\.woff2)\)', block).group(1)
    style = re.search(r'font-style:\s*(\w+)', block).group(1)
    name = f'{slug}-{style}-{n}.woff2'
    n += 1
    (out / name).write_bytes(urllib.request.urlopen(urllib.request.Request(src, headers={'User-Agent': UA})).read())
    block = block.replace(src, f'/font/{folder}/{name}').replace('format(\'woff2\')', "format('woff2')")
    block = re.sub(r'\n\s*unicode-range:[^;]+;', '', block)
    res.append(block.strip())
text = '\n'.join(res) + '\n'
(out / f'{slug}.css').write_text(text, encoding='utf-8')
print(text)
print('files', n, '->', out)
