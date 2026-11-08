"""After the first click the audio state must become 'jalan' and the greeting sound plays; toggling off and on works."""
import asyncio, functools, http.server, socketserver, threading, pathlib
from playwright.async_api import async_playwright
ROOT = pathlib.Path(__file__).resolve().parents[2]
PORT = 4695
class Diam(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
async def main():
    socketserver.TCPServer.allow_reuse_address = True
    srv = socketserver.ThreadingTCPServer(('127.0.0.1', PORT), functools.partial(Diam, directory=str(ROOT / 'public')))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    async with async_playwright() as p:
        b = await p.chromium.launch(channel='chrome', headless=True)
        for arah in ('personal', 'gambar', 'laporan', 'boarding', 'standar'):
            pg = await b.new_page()
            await pg.goto(f'http://127.0.0.1:{PORT}/{arah}/')
            await pg.wait_for_timeout(1200)
            sebelum = await pg.evaluate("document.documentElement.dataset.suara")
            await pg.mouse.click(5, 450)
            await pg.wait_for_timeout(400)
            sesudah = await pg.evaluate("document.documentElement.dataset.suara")
            ok = await pg.evaluate("(async () => { const m = await import('/js/suara.js'); const r = await m.rekamUji('tekan'); return r.puncakDb; })()")
            print(f'{arah:9} before={sebelum} after-click={sesudah} tekan-peak={ok} dBFS')
            await pg.close()
        await b.close()
    srv.shutdown()
asyncio.run(main())
