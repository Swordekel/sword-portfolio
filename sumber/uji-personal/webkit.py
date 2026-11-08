"""Safari engine check (Playwright WebKit): no page errors, live check and sound unlock work under the real CSP, and the
project videos load through byte ranges (206) and play.

    python -I -X utf8 sumber/uji-personal/webkit.py [base-url]      default http://127.0.0.1:8846 (wrangler dev)

Playwright's WebKit on Windows may lack H.264; then the script says so instead of reporting a playback failure.
"""
import asyncio, sys
from playwright.async_api import async_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:8846'


async def main():
    async with async_playwright() as p:
        b = await p.webkit.launch()
        for nama, opsi in (('desktop', dict(viewport={'width': 1440, 'height': 900})),
                           ('iphone', dict(viewport={'width': 393, 'height': 852}, device_scale_factor=3, is_mobile=True, has_touch=True))):
            ctx = await b.new_context(**opsi)
            if BASE.startswith('http://'):
                # local http only: WebKit applies upgrade-insecure-requests to 127.0.0.1 too (Chrome exempts it), so the
                # page's own files would be asked over https and hang. The rest of the CSP stays in force.
                async def tanpa_upgrade(route):
                    r = await route.fetch()
                    h = {k: (v.replace('; upgrade-insecure-requests', '') if k.lower() == 'content-security-policy' else v) for k, v in r.headers.items()}
                    await route.fulfill(response=r, headers=h)
                await ctx.route(BASE + '/', tanpa_upgrade)
            pg = await ctx.new_page()
            galat, video = [], []
            pg.on('pageerror', lambda e: galat.append(str(e)))
            pg.on('console', lambda m: galat.append(m.text) if m.type == 'error' else None)
            pg.on('response', lambda r: video.append((r.status, r.url.split('/')[-1])) if '/media/video/' in r.url else None)
            await pg.goto(BASE + '/', wait_until='load')
            await pg.wait_for_timeout(3000)
            chip = await pg.text_content('[data-chip]')
            await pg.mouse.click(200, 500)
            await pg.wait_for_timeout(300)
            suara = await pg.evaluate('document.documentElement.dataset.suara')
            await pg.evaluate("document.querySelector('#karya').scrollIntoView()")
            await pg.wait_for_timeout(4000)
            putar = await pg.evaluate("""() => [...document.querySelectorAll('video.vid')].filter((v) => v.currentSrc)
              .map((v) => ({ src: v.currentSrc.split('/').pop(), t: +v.currentTime.toFixed(1), rs: v.readyState, err: v.error && v.error.code,
                             h264: v.canPlayType('video/mp4; codecs="avc1.640028"') }))""")
            print(f'{nama}: chip "{chip}", sound {suara}, errors {galat or "none"}')
            print('  video responses:', video[:6])
            print('  videos with a source:', putar)
            await ctx.close()
        await b.close()

asyncio.run(main())
