"""Smoothness and load check for a page: scrolls the whole page at a steady speed while counting animation frames,
on a desktop (real GPU) and on a slow phone (CPU 4x slower, 390x844). Google Chrome so H.264 videos really play.

    python -I -X utf8 sumber/uji-personal/kinerja.py [url-path] [--port N] [--base URL]

Prints per run: frames per second while scrolling, share of frames slower than 25 ms (visible stutter),
the worst frame, long tasks, LCP, bytes and requests at load, videos playing at once.
"""
import asyncio, functools, http.server, socketserver, sys, threading, pathlib
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parents[2]
args = [a for a in sys.argv[1:] if not a.startswith('--')]
PATH = args[0] if args else '/personal/'
PORT = int(sys.argv[sys.argv.index('--port') + 1]) if '--port' in sys.argv else 4697
BASE = sys.argv[sys.argv.index('--base') + 1] if '--base' in sys.argv else None


class Diam(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass

AMATI = r"""
window.__lt = []; window.__lcp = 0;
new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push(e.duration); }).observe({ type: 'longtask', buffered: true });
new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
"""

GULIR = r"""async (detik) => {
  const tinggi = document.documentElement.scrollHeight - innerHeight;
  const d = []; let t0 = performance.now(), lalu = t0, maks = 0;
  return await new Promise((ok) => {
    const f = (t) => {
      d.push(t - lalu); lalu = t;
      const k = Math.min(1, (t - t0) / (detik * 1000));
      scrollTo(0, tinggi * k);
      const main = [...document.querySelectorAll('video')].filter((v) => !v.paused).length;
      if (main > maks) maks = main;
      if (k < 1) requestAnimationFrame(f); else ok({ d: d.slice(2), maks });
    };
    requestAnimationFrame(f);
  });
}"""


async def jalan(p, nama, opsi, lambat):
    b = await p.chromium.launch(channel='chrome', headless=True, args=['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'])
    ctx = await b.new_context(**opsi)
    await ctx.add_init_script(AMATI)
    pg = await ctx.new_page()
    cdp = await ctx.new_cdp_session(pg)
    if lambat:
        await cdp.send('Emulation.setCPUThrottlingRate', {'rate': 4})
    url = (BASE or f'http://127.0.0.1:{PORT}') + PATH
    await pg.goto(url, wait_until='load')
    await pg.wait_for_timeout(2500)
    muat = await pg.evaluate("""() => { const r = performance.getEntriesByType('resource'); const n = performance.getEntriesByType('navigation')[0];
      return { kb: Math.round(((n ? n.transferSize : 0) + r.reduce((a, x) => a + (x.transferSize || 0), 0)) / 1024), req: r.length + 1, lcp: Math.round(window.__lcp) }; }""")
    hasil = await pg.evaluate(GULIR, 12)
    d = sorted(hasil['d'])
    n = len(d)
    lt = await pg.evaluate('window.__lt')
    fps = 1000 / (sum(d) / n) if n else 0
    patah = sum(1 for x in d if x > 25) / n * 100 if n else 0
    print(f"{nama:<14} {fps:5.1f} fps  stutter {patah:4.1f}%  p95 {d[int(n * .95)]:5.1f} ms  worst {d[-1]:6.1f} ms  long tasks {len(lt):2d} ({sum(lt):5.0f} ms)  "
          f"LCP {muat['lcp']} ms  {muat['kb']} KB/{muat['req']} req at load  videos playing max {hasil['maks']}")
    await b.close()


async def main():
    srv = None
    if not BASE:
        socketserver.TCPServer.allow_reuse_address = True
        srv = socketserver.ThreadingTCPServer(('127.0.0.1', PORT), functools.partial(Diam, directory=str(ROOT / 'public')))
        threading.Thread(target=srv.serve_forever, daemon=True).start()
    async with async_playwright() as p:
        await jalan(p, 'desktop', dict(viewport={'width': 1440, 'height': 900}), False)
        await jalan(p, 'phone (4x CPU)', dict(viewport={'width': 390, 'height': 844}, device_scale_factor=3, is_mobile=True, has_touch=True), True)
    if srv:
        srv.shutdown()

asyncio.run(main())
