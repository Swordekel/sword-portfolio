"""Measure every UI sound (shared + each variant's own) by rendering it offline in Chromium: peak and RMS dBFS,
audible length, and a rough centre frequency. Laptop speakers barely reproduce anything under ~250 Hz, so a sound
whose centre sits there is effectively silent on the owner's laptop.

    python -I -X utf8 sumber/uji-suara/ukur.py [arah ...]
"""
import asyncio, functools, http.server, json, socketserver, sys, threading, pathlib
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parents[2]
PORT = 4693
ARAH = [a for a in sys.argv[1:]] or ['personal', 'gambar', 'laporan', 'boarding', 'standar']


class Diam(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


async def main():
    socketserver.TCPServer.allow_reuse_address = True
    srv = socketserver.ThreadingTCPServer(('127.0.0.1', PORT), functools.partial(Diam, directory=str(ROOT / 'public')))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        for arah in ARAH:
            pg = await b.new_page()
            await pg.goto(f'http://127.0.0.1:{PORT}/{arah}/')
            await pg.wait_for_timeout(1500)
            hasil = await pg.evaluate("""async () => {
              const m = await import('/js/suara.js');
              const out = [];
              for (const n of m.namaBunyi()) {
                try { out.push(await m.rekamUji(n, {})); } catch (e) { out.push({ nama: n, galat: String(e) }); }
              }
              return out;
            }""")
            print(f'== {arah}')
            for r in hasil:
                if 'galat' in r:
                    print(f"  {r['nama']:<10} ERROR {r['galat'][:80]}")
                else:
                    print(f"  {r['nama']:<10} peak {r['puncakDb']:>6} dBFS  rms {r['rmsDb']:>6}  {r['lamaMs']:>4} ms  ~{r['pusatHz']:>5} Hz")
            await pg.close()
        await b.close()
    srv.shutdown()

asyncio.run(main())
