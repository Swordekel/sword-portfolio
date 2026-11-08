"""Check that the project videos on /personal/ load only when visible and keep playing (Google Chrome, which has
H.264; Playwright's own Chromium has no H.264). Serves public/ on port 4694.

    python -I -X utf8 sumber/uji-personal/video.py
"""
import asyncio, functools, http.server, socketserver, threading, pathlib
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / '.impeccable' / 'review' / 'personal'
PORT = 4694


class Diam(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass

STATUS = """() => [...document.querySelectorAll('video.vid')].map(v => ({
  k: v.dataset.kecil.split('/').pop().split('?')[0], src: !!v.currentSrc, main: v.classList.contains('main'),
  paused: v.paused, t: +v.currentTime.toFixed(2), rs: v.readyState }))"""


async def main():
    socketserver.TCPServer.allow_reuse_address = True
    srv = socketserver.ThreadingTCPServer(('127.0.0.1', PORT), functools.partial(Diam, directory=str(ROOT / 'public')))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    async with async_playwright() as p:
        b = await p.chromium.launch(channel='chrome', headless=True, args=['--autoplay-policy=no-user-gesture-required'])
        for nama, opsi in (('desk', dict(viewport={'width': 1440, 'height': 900})),
                           ('hp', dict(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True))):
            ctx = await b.new_context(**opsi)
            pg = await ctx.new_page()
            err = []
            pg.on('pageerror', lambda e: err.append(str(e)))
            await pg.goto(f'http://127.0.0.1:{PORT}/personal/')
            await pg.wait_for_timeout(1500)
            awal = await pg.evaluate(STATUS)
            print(nama, 'loaded before scrolling:', sum(1 for v in awal if v['src']))
            await pg.evaluate("document.querySelector('#karya .karya').scrollIntoView({block: 'center'})")
            await pg.wait_for_timeout(2500)
            a = await pg.evaluate(STATUS)
            await pg.wait_for_timeout(1000)
            b2 = await pg.evaluate(STATUS)
            main = [x['k'] for x, y in zip(a, b2) if y['src'] and not y['paused'] and y['t'] > x['t']]
            print(nama, 'featured: loaded', sum(1 for v in b2 if v['src']), 'advancing', main)
            await pg.screenshot(path=str(OUT / f'video-{nama}-karya.png'))
            await pg.evaluate("document.querySelector('#semua .kisi-situs').scrollIntoView({block: 'start'})")
            await pg.wait_for_timeout(3000)
            a = await pg.evaluate(STATUS)
            await pg.wait_for_timeout(1000)
            b2 = await pg.evaluate(STATUS)
            main = [x['k'] for x, y in zip(a, b2) if y['src'] and not y['paused'] and y['t'] > x['t']]
            jeda = [y['k'] for y in b2 if y['src'] and y['paused']]
            print(nama, 'grid: loaded', sum(1 for v in b2 if v['src']), 'advancing', len(main), main[:8], 'paused-after-scroll', jeda[:6])
            await pg.screenshot(path=str(OUT / f'video-{nama}-kisi.png'))
            print(nama, 'errors', err)
            await ctx.close()
        await b.close()
    srv.shutdown()

asyncio.run(main())
