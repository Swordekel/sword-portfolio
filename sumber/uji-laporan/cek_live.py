import asyncio, threading, functools, http.server, socketserver, pathlib, json
from playwright.async_api import async_playwright
ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / '.impeccable' / 'review' / 'laporan'
class Diam(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
h = functools.partial(Diam, directory=str(ROOT / 'public'))
socketserver.TCPServer.allow_reuse_address = True
s = socketserver.ThreadingTCPServer(('127.0.0.1', 4684), h)
threading.Thread(target=s.serve_forever, daemon=True).start()
async def main():
    log = []
    async with async_playwright() as p:
        for eng, opts in (('chromium', dict(viewport={'width':1440,'height':900})), ('webkit', dict(**p.devices['iPhone 15']))):
            b = await getattr(p, eng).launch()
            c = await b.new_context(**opts)
            pg = await c.new_page()
            pg.on('console', lambda m, e=eng: log.append(f'[{e}] {m.type}: {m.text}') if m.type in ('error','warning') else None)
            pg.on('pageerror', lambda x, e=eng: log.append(f'[{e}] pageerror: {x}'))
            await pg.goto('http://127.0.0.1:4684/laporan/')
            await pg.wait_for_timeout(1200)
            # sound toggle state and icon parts
            st = await pg.evaluate("""() => { const b = document.querySelector('[data-suara-tombol]'); const g = getComputedStyle(b.querySelector('.gel')).display, m = getComputedStyle(b.querySelector('.mati')).display; return [b.getAttribute('aria-pressed'), g, m]; }""")
            await pg.click('.kontrol [data-cek]')
            await pg.wait_for_function("() => !document.querySelector('[data-cap]').hidden", timeout=20000)
            await pg.wait_for_timeout(900)
            res = await pg.evaluate("""() => ({ status: document.querySelector('[data-cek-status]').textContent, now: [...document.querySelectorAll('.lingkup [data-kapan]')].map(k => k.textContent), ms: [...document.querySelectorAll('.lingkup .ms')].map(k => k.textContent), strip: [...document.querySelectorAll('.sampul .strip .sq')].map(q => q.className.replace('sq ','')), verif: document.querySelector('[data-verifikasi]').textContent })""")
            print(eng, 'sound', st)
            print(eng, json.dumps(res)[:900])
            await pg.evaluate('window.scrollTo(0,0)')
            await pg.wait_for_timeout(500)
            await pg.screenshot(path=str(OUT / f'cek-live-{eng}.png'))
            # open a details row by following the link from the scope table
            await pg.evaluate("document.querySelector('a[href=\"#h-javaloom\"]').click()")
            await pg.wait_for_timeout(1200)
            op = await pg.evaluate("document.getElementById('h-javaloom').open")
            print(eng, 'details opened via scope link:', op)
            # contents menu
            if eng == 'chromium':
                await pg.click('[data-menu-tombol]')
                await pg.wait_for_timeout(300)
                vis = await pg.evaluate("!document.getElementById('daftar-isi').hidden")
                await pg.keyboard.press('Escape')
                vis2 = await pg.evaluate("!document.getElementById('daftar-isi').hidden")
                print('menu open', vis, 'after escape', vis2)
            await b.close()
    s.shutdown()
    print('\n'.join(log) or 'no console errors')
asyncio.run(main())
