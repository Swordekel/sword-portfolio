"""Share image and app icons from the built site (run after `node bangun.mjs`).

    python -I -X utf8 alat/ikon_og.py

Writes into public/:
  og.jpg                1200x630 link preview: the first screen at 1600x840 without the header and the live chip
  apple-touch-icon.png  180x180, the S mark on a full square (iOS rounds the corners itself)
  favicon.ico           16/32/48, for browsers and crawlers that ask for /favicon.ico
Google Chrome (channel) with the real GPU; run it at below-normal priority so the PC stays responsive.
"""
import asyncio, functools, http.server, io, socketserver, threading, pathlib
from PIL import Image
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUB = ROOT / 'public'
PORT = 4691

S_MARK = ('<circle cx="23.5" cy="8.5" r="3.2" fill="#1C8F4D" stroke="#0C0D0F" stroke-width="1.6"/>'
          '<path d="M20.6 12.3c-.9-1.5-2.6-2.4-4.7-2.4-2.6 0-4.5 1.4-4.5 3.4 0 4.6 9.6 2.7 9.6 7.6 0 2.1-2 3.6-4.9 3.6-2.4 0-4.3-1-5.2-2.8" '
          'fill="none" stroke="#F2F3F5" stroke-width="2.4" stroke-linecap="round"/>')


class Diam(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


async def main():
    socketserver.TCPServer.allow_reuse_address = True
    srv = socketserver.ThreadingTCPServer(('127.0.0.1', PORT), functools.partial(Diam, directory=str(PUB)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    async with async_playwright() as p:
        b = await p.chromium.launch(channel='chrome', headless=True, args=['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'])

        # gambar pratinjau tautan
        pg = await b.new_page(viewport={'width': 1600, 'height': 840}, device_scale_factor=1)
        await pg.goto(f'http://127.0.0.1:{PORT}/', wait_until='load')
        await pg.add_style_tag(content='.kepala, .studio-chip { visibility: hidden !important; } .arus-isi { animation-play-state: paused !important; }')
        await pg.evaluate('document.fonts.ready')
        await pg.wait_for_function("[...document.querySelectorAll('.sampul img')].every((i) => i.complete && i.naturalWidth > 0)", timeout=20000)
        await pg.wait_for_timeout(600)
        png = await pg.screenshot(type='png')
        og = Image.open(io.BytesIO(png)).convert('RGB').resize((1200, 630), Image.LANCZOS)
        og.save(PUB / 'og.jpg', 'JPEG', quality=86, optimize=True, progressive=True)
        await pg.close()

        # ikon aplikasi: persegi penuh, tanda S sedikit diperkecil supaya lega setelah sudutnya dibulatkan iOS
        pg = await b.new_page(viewport={'width': 180, 'height': 180}, device_scale_factor=1)
        await pg.set_content('<html><body style="margin:0;background:#0C0D0F">'
                             '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="180" height="180">'
                             '<rect width="32" height="32" fill="#0C0D0F"/>'
                             f'<g transform="translate(16 16) scale(.84) translate(-16 -16)">{S_MARK}</g></svg></body></html>')
        Image.open(io.BytesIO(await pg.screenshot(type='png'))).convert('RGB').save(PUB / 'apple-touch-icon.png', optimize=True)
        await pg.close()

        # favicon.ico dari ikon bulat yang sama dengan ikon.svg
        pg = await b.new_page(viewport={'width': 96, 'height': 96}, device_scale_factor=1)
        await pg.set_content('<html><body style="margin:0;background:transparent">'
                             '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="96" height="96">'
                             f'<rect width="32" height="32" rx="16" fill="#0C0D0F"/>{S_MARK}</svg></body></html>')
        ikon = Image.open(io.BytesIO(await pg.screenshot(type='png', omit_background=True))).convert('RGBA')
        ikon.save(PUB / 'favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
        await b.close()
    srv.shutdown()
    for n in ('og.jpg', 'apple-touch-icon.png', 'favicon.ico'):
        print(n, (PUB / n).stat().st_size, 'bytes')

asyncio.run(main())
