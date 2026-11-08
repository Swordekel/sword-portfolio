"""Screenshot one portfolio variant for review: desktop 1440x900 and phone 390x844, Chromium and WebKit,
first viewport and full page, plus every console error and page error.

    python -I -X utf8 alat/cek.py <arah> [port] [--path /laporan/] [--gerak-kurang]

Serves public/ itself on the given port (default 4690 + a per-variant offset), so several variants can be checked
at the same time without sharing a server or the app's browser pane. Writes .impeccable/review/<arah>/:
desktop.png, desktop-full.png, mobile.png, mobile-full.png, webkit-desktop.png, webkit-mobile.png, log.txt
"""
import asyncio, sys, threading, functools, pathlib, http.server, socketserver
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
arah = sys.argv[1]
angka = [a for a in sys.argv[2:] if a.isdigit()]
PORT = int(angka[0]) if angka else 4690 + (sum(map(ord, arah)) % 50)
PATH = sys.argv[sys.argv.index('--path') + 1] if '--path' in sys.argv else f'/{arah}/'
KURANG = '--gerak-kurang' in sys.argv
OUT = ROOT / '.impeccable' / 'review' / arah
OUT.mkdir(parents=True, exist_ok=True)


class Diam(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def server():
    h = functools.partial(Diam, directory=str(ROOT / 'public'))
    socketserver.TCPServer.allow_reuse_address = True
    s = socketserver.ThreadingTCPServer(('127.0.0.1', PORT), h)
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s


async def gulir(page):
    # walk the page once so lazy images and scroll-driven states load before the full-page capture
    h = await page.evaluate('document.documentElement.scrollHeight')
    vh = await page.evaluate('innerHeight')
    y = 0
    while y < h:
        await page.evaluate(f'window.scrollTo(0, {y})')
        await page.wait_for_timeout(180)
        y += int(vh * 0.8)
        h = await page.evaluate('document.documentElement.scrollHeight')
    await page.evaluate('window.scrollTo(0, 0)')
    await page.wait_for_timeout(900)


async def jalan():
    srv = server()
    log = []
    url = f'http://127.0.0.1:{PORT}{PATH}'
    async with async_playwright() as p:
        kasus = [
            ('chromium', 'desktop', dict(viewport={'width': 1440, 'height': 900}, device_scale_factor=1)),
            ('chromium', 'mobile', dict(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True)),
            ('webkit', 'webkit-desktop', dict(viewport={'width': 1440, 'height': 900}, device_scale_factor=1)),
            ('webkit', 'webkit-mobile', dict(**p.devices['iPhone 15'])),
        ]
        for mesin, nama, opsi in kasus:
            b = await getattr(p, mesin).launch()
            ctx = await b.new_context(**opsi, reduced_motion='reduce' if KURANG else 'no-preference')
            page = await ctx.new_page()
            page.on('console', lambda m, n=nama: log.append(f'[{n}] console.{m.type}: {m.text}') if m.type in ('error', 'warning') else None)
            page.on('pageerror', lambda e, n=nama: log.append(f'[{n}] pageerror: {e}'))
            page.on('requestfailed', lambda r, n=nama: log.append(f'[{n}] requestfailed: {r.url} {r.failure}'))
            await page.goto(url, wait_until='load')
            await page.wait_for_timeout(3200)
            await page.screenshot(path=str(OUT / f'{nama}.png'))
            if mesin == 'chromium':
                await gulir(page)
                await page.screenshot(path=str(OUT / f'{nama}-full.png'), full_page=True)
            await b.close()
    srv.shutdown()
    (OUT / 'log.txt').write_text('\n'.join(log) or 'no console errors', encoding='utf-8')
    print('\n'.join(log) or 'no console errors')
    print('screens ->', OUT)

asyncio.run(jalan())
