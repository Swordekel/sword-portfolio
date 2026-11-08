"""Interaction checks for /boarding/ (Chromium + WebKit, desktop + phone, reduced motion). Own server on :4685."""
import asyncio, functools, http.server, socketserver, threading, pathlib, sys
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parents[2]
PORT = 4685
URL = f'http://127.0.0.1:{PORT}/boarding/'


class Diam(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


socketserver.TCPServer.allow_reuse_address = True
srv = socketserver.ThreadingTCPServer(('127.0.0.1', PORT), functools.partial(Diam, directory=str(ROOT / 'public')))
threading.Thread(target=srv.serve_forever, daemon=True).start()
hasil = []


def cek(nama, ok, info=''):
    hasil.append((nama, ok))
    print(('PASS ' if ok else 'FAIL ') + nama + (f'  [{info}]' if info else ''), flush=True)


async def satu(p, mesin, label, opsi, kurang=False):
    b = await getattr(p, mesin).launch()
    ctx = await b.new_context(**opsi, reduced_motion='reduce' if kurang else 'no-preference')
    if mesin == 'chromium':
        await ctx.grant_permissions(['clipboard-read', 'clipboard-write'], origin=f'http://127.0.0.1:{PORT}')
    page = await ctx.new_page()
    log = []
    page.on('console', lambda m: log.append(f'{m.type}: {m.text}') if m.type in ('error', 'warning') else None)
    page.on('pageerror', lambda e: log.append(f'pageerror: {e}'))
    await page.goto(URL, wait_until='load')
    await page.wait_for_timeout(1200)
    await page.evaluate("document.getElementById('board').scrollIntoView({block: 'start'})")
    await page.wait_for_timeout(4500)
    await page.evaluate('window.scrollTo(0, 0)')
    await page.wait_for_timeout(400)
    t = f'{mesin}/{label}{"/reduced" if kurang else ""}'
    ok = await page.evaluate("document.querySelectorAll('.hidup.ok').length")
    cek(f'{t}: live pings answered', ok == 18, f'{ok}/18')
    lebar = await page.evaluate('innerWidth')
    if lebar >= 1200:
        bawah = await page.evaluate("document.querySelector('.stub .tombol.tinta').getBoundingClientRect().bottom")
        cek(f'{t}: Download CV inside first viewport', bawah <= 900, f'bottom {bawah:.0f}')
        surel = await page.evaluate("document.querySelector('.stub [data-salin]').getBoundingClientRect().bottom")
        cek(f'{t}: Copy email inside first viewport', surel <= 900, f'bottom {surel:.0f}')
    else:
        vis = await page.evaluate("getComputedStyle(document.querySelector('.mast-surel')).display")
        cek(f'{t}: email button in phone masthead', vis != 'none', vis)
        qr = await page.evaluate("getComputedStyle(document.querySelector('.pindai')).display")
        cek(f'{t}: QR hidden on phone', qr == 'none', qr)
        lebih = await page.evaluate('document.documentElement.scrollWidth - innerWidth')
        cek(f'{t}: no horizontal overflow', lebih <= 0, f'{lebih}px')
    # filter by status
    await page.click('.chip[data-f="usulan"]')
    await page.wait_for_timeout(900)
    st = await page.evaluate("[...document.querySelectorAll('.daftar > li')].map(r => r.dataset.status)")
    cek(f'{t}: Proposals first', st[:8] == ['usulan'] * 8 and 'usulan' not in st[8:], ','.join(st[:9]))
    luar = await page.evaluate("document.querySelectorAll('.daftar > li.luar').length")
    cek(f'{t}: non-matching rows dimmed', luar == 10, str(luar))
    nomor = await page.evaluate("[...document.querySelectorAll('.daftar > li')].slice(0,3).map(r => [...r.querySelectorAll('.no i')].map(i=>i.textContent).join(''))")
    cek(f'{t}: renumbered after flap', nomor == ['01', '02', '03'], ','.join(nomor))
    # technology select
    await page.select_option('[data-tekno-pilih]', 'd1')
    await page.wait_for_timeout(900)
    tk = await page.evaluate("[...document.querySelectorAll('.daftar > li')].filter(r => !r.classList.contains('luar')).map(r => r.dataset.key)")
    cek(f'{t}: Proposals + SQL leaves none', tk == [], ','.join(tk))
    await page.click('.chip[data-f="semua"]')
    await page.wait_for_timeout(900)
    tk = await page.evaluate("[...document.querySelectorAll('.daftar > li')].filter(r => !r.classList.contains('luar')).map(r => r.dataset.key)")
    cek(f'{t}: SQL hosts listed first', tk == ['arswordlab', 'pos', 'dailytask', 'chat'], ','.join(tk))
    await page.select_option('[data-tekno-pilih]', '')
    await page.wait_for_timeout(900)
    urut = await page.evaluate("[...document.querySelectorAll('.daftar > li')].map(r => +r.dataset.urut)")
    cek(f'{t}: original order restored', urut == list(range(18)))
    # details: one open at a time
    rows = page.locator('.daftar > li summary')
    await rows.nth(2).click()
    await page.wait_for_timeout(300)
    await rows.nth(5).click()
    await page.wait_for_timeout(300)
    terbuka = await page.evaluate("[...document.querySelectorAll('.daftar details')].filter(d => d.open).map(d => d.closest('li').dataset.key)")
    cek(f'{t}: exactly one row open', terbuka == ['nilamerah'], ','.join(terbuka))
    gambar_ok = await page.evaluate("(() => { const i = document.querySelector('#d-nilamerah img'); return i && i.complete && i.naturalWidth > 0; })()")
    await page.wait_for_timeout(600)
    gambar_ok = await page.evaluate("(() => { const i = document.querySelector('#d-nilamerah img'); return !!i && i.complete && i.naturalWidth > 0; })()")
    cek(f'{t}: detail capture loaded', gambar_ok)
    # matrix button filters the board
    await page.locator('[data-pilih-tekno="android"]').click()
    await page.wait_for_timeout(1600)
    pertama = await page.evaluate("document.querySelector('.daftar > li').dataset.key")
    nilai = await page.evaluate("document.querySelector('[data-tekno-pilih]').value")
    cek(f'{t}: matrix row filters board', pertama == 'pos' and nilai == 'android', f'{pertama} {nilai}')
    # copy email
    if mesin == 'chromium':
        await page.locator('.stub [data-salin]').click()
        await page.wait_for_timeout(200)
        lbl = await page.evaluate("document.querySelector('.stub [data-salin] .teks-salin').textContent")
        cek(f'{t}: copy email feedback', lbl == 'Copied', lbl)
        clip = await page.evaluate('navigator.clipboard.readText()')
        cek(f'{t}: clipboard holds the address', clip == 'swordekel@gmail.com', clip)
    # sound toggle
    tombol = page.locator('[data-bunyi]')
    await tombol.click()
    await page.wait_for_timeout(300)
    a = await tombol.get_attribute('aria-pressed')
    simpan = await page.evaluate("localStorage.getItem('sword:suara')")
    cek(f'{t}: sound toggles off and persists', a == 'false' and simpan == '0', f'{a} {simpan}')
    await tombol.click()
    await page.wait_for_timeout(200)
    a = await tombol.get_attribute('aria-pressed')
    cek(f'{t}: sound toggles back on', a == 'true', a)
    berat = [x for x in log if 'favicon' not in x]
    cek(f'{t}: no console errors', not berat, ' | '.join(berat)[:300])
    await b.close()


async def main():
    async with async_playwright() as p:
        desk = dict(viewport={'width': 1440, 'height': 900})
        hp = dict(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
        await satu(p, 'chromium', 'desktop', desk)
        await satu(p, 'chromium', 'phone', hp)
        await satu(p, 'chromium', 'desktop', desk, kurang=True)
        await satu(p, 'webkit', 'desktop', desk)
        await satu(p, 'webkit', 'phone', dict(**p.devices['iPhone 15']))
    srv.shutdown()
    gagal = [n for n, ok in hasil if not ok]
    print(f'\n{len(hasil) - len(gagal)}/{len(hasil)} passed')
    if gagal:
        print('FAILED:', *gagal, sep='\n  ')

asyncio.run(main())
