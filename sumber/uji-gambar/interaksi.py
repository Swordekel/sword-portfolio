"""Interaction checks for /gambar/: hero blade drag + keyboard, sheet grip drag, register preview swap,
matrix filter, copy email, sound toggle; Chromium desktop + WebKit phone. Serves public/ on port 4688.

    python -I -X utf8 sumber/uji-gambar/interaksi.py
"""
import asyncio, functools, http.server, socketserver, threading, pathlib
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / '.impeccable' / 'review' / 'gambar'
PORT = 4688


class Diam(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def server():
    socketserver.TCPServer.allow_reuse_address = True
    s = socketserver.ThreadingTCPServer(('127.0.0.1', PORT), functools.partial(Diam, directory=str(ROOT / 'public')))
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s

hasil = []
def cek(nama, ok, info=''):
    hasil.append(f"{'PASS' if ok else 'FAIL'} {nama} {info}")


async def desktop(p):
    b = await p.chromium.launch()
    ctx = await b.new_context(viewport={'width': 1440, 'height': 900}, permissions=['clipboard-read', 'clipboard-write'])
    pg = await ctx.new_page()
    err = []
    pg.on('pageerror', lambda e: err.append(str(e)))
    pg.on('console', lambda m: err.append(m.text) if m.type == 'error' else None)
    await pg.goto(f'http://127.0.0.1:{PORT}/gambar/')
    await pg.wait_for_timeout(2200)
    ki0 = await pg.evaluate("parseFloat(getComputedStyle(document.querySelector('[data-sampul]')).getPropertyValue('--ki'))")
    h = await pg.query_selector('[data-gagang]')
    bb = await h.bounding_box()
    await pg.mouse.move(bb['x'] + bb['width'] / 2, bb['y'] + bb['height'] / 2)
    await pg.mouse.down()
    for i in range(12):
        await pg.mouse.move(bb['x'] + bb['width'] / 2, bb['y'] + bb['height'] / 2 + 8 * (i + 1))
        await pg.wait_for_timeout(16)
    await pg.mouse.up()
    await pg.wait_for_timeout(200)
    ki1 = await pg.evaluate("parseFloat(getComputedStyle(document.querySelector('[data-sampul]')).getPropertyValue('--ki'))")
    cek('hero drag moves the line down', ki1 > ki0 + 30, f'{ki0:.0f} -> {ki1:.0f}')
    await h.focus()
    await pg.keyboard.press('Home')
    await pg.wait_for_timeout(120)
    now = await h.get_attribute('aria-valuenow')
    cek('hero keyboard Home', now == '0', now)
    await pg.screenshot(path=str(OUT / 'uji-garis-atas.png'))
    await pg.keyboard.press('End')
    await pg.wait_for_timeout(120)
    await pg.screenshot(path=str(OUT / 'uji-garis-bawah.png'))
    # lembar pertama: seret gagang
    await pg.evaluate("document.querySelector('#lembar-pos').scrollIntoView({block:'center'})")
    await pg.wait_for_timeout(500)
    fr = await pg.query_selector('#lembar-pos [data-bingkai]')
    a0 = await fr.evaluate("e => e.style.getPropertyValue('--ka')")
    g = await pg.query_selector('#lembar-pos .gagang')
    gb = await g.bounding_box()
    await pg.mouse.move(gb['x'] + 17, gb['y'] + 17)
    await pg.mouse.down()
    for i in range(10):
        await pg.mouse.move(gb['x'] + 17, gb['y'] + 17 - 12 * (i + 1))
        await pg.wait_for_timeout(16)
    await pg.mouse.up()
    a1 = await fr.evaluate("e => e.style.getPropertyValue('--ka')")
    cek('sheet grip drag', a0 != a1, f'{a0} -> {a1}')
    await pg.screenshot(path=str(OUT / 'uji-lembar.png'))
    # daftar: hover baris lain mengganti pratinjau
    await pg.evaluate("document.querySelector('#daftar').scrollIntoView()")
    await pg.wait_for_timeout(400)
    await pg.hover('.reg-baris[data-kunci="teassence"] .reg-buka')
    await pg.wait_for_timeout(700)
    teks = await pg.inner_text('[data-pra-teks]')
    cek('register preview swaps', 'Teassence' in teks, teks[:60])
    await pg.screenshot(path=str(OUT / 'uji-daftar.png'))
    # matriks menyaring daftar
    await pg.click('.jad-tombol[data-tekno="d1"]')
    await pg.wait_for_timeout(900)
    tampak = await pg.evaluate("[...document.querySelectorAll('.reg-baris')].filter(b => !b.hidden).length")
    filt = await pg.inner_text('[data-filter-teks]')
    cek('matrix filter', tampak == 4, f'{tampak} rows; {filt}')
    await pg.click('[data-filter-hapus]')
    tampak = await pg.evaluate("[...document.querySelectorAll('.reg-baris')].filter(b => !b.hidden).length")
    cek('filter cleared', tampak == 18, str(tampak))
    # salin email
    await pg.click('[data-salin]')
    await pg.wait_for_timeout(200)
    clip = await pg.evaluate('navigator.clipboard.readText()')
    cek('copy email', clip == 'swordekel@gmail.com', clip)
    # tombol suara
    await pg.click('.tombol-suara')
    await pg.wait_for_timeout(300)
    st = await pg.get_attribute('.tombol-suara', 'aria-pressed')
    cek('sound toggle off', st == 'false', st)
    await pg.click('.tombol-suara')
    await pg.wait_for_timeout(300)
    st = await pg.get_attribute('.tombol-suara', 'aria-pressed')
    cek('sound toggle on', st == 'true', st)
    cek('no page errors (desktop)', not err, '; '.join(err)[:300])
    await b.close()


async def hp(p):
    b = await p.webkit.launch()
    ctx = await b.new_context(**p.devices['iPhone 15'])
    pg = await ctx.new_page()
    err = []
    pg.on('pageerror', lambda e: err.append(str(e)))
    await pg.goto(f'http://127.0.0.1:{PORT}/gambar/')
    await pg.wait_for_timeout(2400)
    await pg.screenshot(path=str(OUT / 'uji-hp-sampul.png'))
    await pg.evaluate("document.querySelector('#daftar').scrollIntoView()")
    await pg.wait_for_timeout(300)
    await pg.tap('.reg-baris[data-kunci="javaloom"] .reg-buka')
    await pg.wait_for_timeout(600)
    buka = await pg.get_attribute('.reg-baris[data-kunci="javaloom"] .reg-buka', 'aria-expanded')
    cek('phone row expands', buka == 'true', buka)
    await pg.screenshot(path=str(OUT / 'uji-hp-daftar.png'))
    cek('no page errors (webkit phone)', not err, '; '.join(err)[:300])
    await b.close()


async def main():
    s = server()
    async with async_playwright() as p:
        await desktop(p)
        await hp(p)
    s.shutdown()
    print('\n'.join(hasil))

asyncio.run(main())
