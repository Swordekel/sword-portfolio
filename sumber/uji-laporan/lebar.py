import asyncio, threading, functools, http.server, socketserver, pathlib, json
from playwright.async_api import async_playwright
ROOT = pathlib.Path(__file__).resolve().parents[2]
class Diam(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
h = functools.partial(Diam, directory=str(ROOT / 'public'))
socketserver.TCPServer.allow_reuse_address = True
s = socketserver.ThreadingTCPServer(('127.0.0.1', 4684), h)
threading.Thread(target=s.serve_forever, daemon=True).start()
JS = """() => {
  const W = document.documentElement.clientWidth;
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.right > W + 0.5 && r.width > 0) out.push([el.tagName + '.' + (el.className && el.className.baseVal === undefined ? el.className : ''), Math.round(r.left), Math.round(r.right)]);
  }
  return { W, sw: document.documentElement.scrollWidth, n: out.length, first: out.slice(0, 12) };
}"""
async def main():
    async with async_playwright() as p:
        for eng in ('chromium', 'webkit'):
            b = await getattr(p, eng).launch()
            c = await b.new_context(**p.devices['iPhone 15']) if eng == 'webkit' else await b.new_context(viewport={'width':390,'height':844}, is_mobile=True, has_touch=True, device_scale_factor=2)
            pg = await c.new_page()
            await pg.goto('http://127.0.0.1:4684/laporan/')
            await pg.wait_for_timeout(1500)
            print(eng, json.dumps(await pg.evaluate(JS)))
            await b.close()
    s.shutdown()
asyncio.run(main())
