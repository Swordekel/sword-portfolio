"""Capture every *.arswordlab.com site for the portfolio: a desktop still (1440x900 at 2x), two scrolled stills,
a phone still (393x852 at 3x), the page's layout geometry (text lines, media, controls, boxes) for the
structure drawings, and measured facts (title, fonts, WebGL contexts, transfer size, requests).

    python -I -X utf8 alat/tangkap.py [key ...] [--hp] [--desk]

Writes sumber/tangkap/<key>/ (masters, not shipped). Run at low priority on the owner's PC:
    cmd //c "start /low /b /wait python -I -X utf8 alat/tangkap.py"
"""
import asyncio, json, sys, pathlib, datetime as dt
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'sumber' / 'tangkap'

WIB = dt.timezone(dt.timedelta(hours=7))
WITA = dt.timezone(dt.timedelta(hours=8))

# key: url, seconds to wait for the opening, optional fake clock (status pills that follow the shop's hours)
SITES = {
    'arswordlab':       dict(url='https://arswordlab.com/', wait=5.5),
    'nathaniakhow':     dict(url='https://nathaniakhow.arswordlab.com/', wait=7.0),
    'eskrim-uncle-ren': dict(url='https://eskrim-uncle-ren.arswordlab.com/', wait=9.0, clock=dt.datetime(2026, 11, 6, 14, 0, tzinfo=WIB)),
    'seraphine':        dict(url='https://seraphine.arswordlab.com/', wait=5.0),
    'ashfield':         dict(url='https://ashfield.arswordlab.com/', wait=6.5),
    'nilamerah':        dict(url='https://nilamerah.arswordlab.com/', wait=5.5),
    'himawari':         dict(url='https://himawari.arswordlab.com/', wait=8.0),
    'koaslink':         dict(url='https://koaslink.arswordlab.com/', wait=4.0),
    'javaloom':         dict(url='https://javaloom.arswordlab.com/', wait=6.0),
    'radja':            dict(url='https://radja.arswordlab.com/', wait=6.0),
    'bengkelnusantara': dict(url='https://bengkelnusantara.arswordlab.com/', wait=6.5, clock=dt.datetime(2026, 11, 6, 10, 0, tzinfo=WITA)),
    'cherish':          dict(url='https://cherish.arswordlab.com/', wait=6.0),
    'seifan':           dict(url='https://seifan.arswordlab.com/', wait=6.0),
    'tsunagu':          dict(url='https://tsunagu.arswordlab.com/', wait=7.0),
    'teassence':        dict(url='https://teassence.arswordlab.com/', wait=6.0),
    'dailytask':        dict(url='https://dailytask.arswordlab.com/', wait=3.0),
    'pos':              dict(url='https://pos.arswordlab.com/', wait=3.0),
}

# records which canvas contexts a page creates (the structure drawing marks WebGL surfaces)
INIT = r"""
(() => {
  const seen = window.__ctx = [];
  const orig = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
    const c = orig.call(this, type, ...rest);
    if (c && !this.__ctxType) { this.__ctxType = String(type); seen.push(String(type)); }
    return c;
  };
  if (window.OffscreenCanvas) {
    const o2 = OffscreenCanvas.prototype.getContext;
    OffscreenCanvas.prototype.getContext = function (type, ...rest) {
      const c = o2.call(this, type, ...rest); if (c) seen.push('offscreen-' + String(type)); return c;
    };
  }
})();
"""

GEO = r"""
() => {
  const W = innerWidth, H = innerHeight;
  const transparent = (c) => !c || c === 'transparent' || /rgba\(.*,\s*0\)$/.test(c);
  const effOpacity = (el) => {
    let o = 1;
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden') return 0;
      o *= parseFloat(cs.opacity);
    }
    return o;
  };
  const inView = (r) => r.width > 1 && r.height > 1 && r.right > 0 && r.bottom > 0 && r.left < W && r.top < H;
  const clip = (r) => {
    const x = Math.max(0, r.left), y = Math.max(0, r.top);
    return { x: +x.toFixed(1), y: +y.toFixed(1), w: +(Math.min(W, r.right) - x).toFixed(1), h: +(Math.min(H, r.bottom) - y).toFixed(1) };
  };
  const out = { w: W, h: H, text: [], media: [], ctl: [], box: [] };
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT });
  let n;
  while ((n = tw.nextNode())) {
    const el = n.parentElement;
    if (!el || ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'TITLE'].includes(el.tagName)) continue;
    const op = effOpacity(el);
    if (op < 0.12) continue;
    const cs = getComputedStyle(el);
    if (cs.color && /rgba\(.*,\s*0\)$/.test(cs.color)) continue;
    const range = document.createRange();
    range.selectNodeContents(n);
    for (const r of range.getClientRects()) {
      if (!inView(r) || r.width < 3 || r.height < 3) continue;
      out.text.push({ ...clip(r), fs: +parseFloat(cs.fontSize).toFixed(1), fw: parseInt(cs.fontWeight) || 400, o: +op.toFixed(2) });
    }
  }
  for (const el of document.querySelectorAll('img, video, canvas, picture, iframe, svg')) {
    const tag = el.tagName.toLowerCase();
    if (tag === 'svg' && el.parentElement && el.parentElement.closest('svg')) continue;
    if (tag === 'img' && el.parentElement && el.parentElement.tagName === 'PICTURE') continue;
    const r = el.getBoundingClientRect();
    if (!inView(r) || r.width < 20 || r.height < 20) continue;
    const op = effOpacity(el);
    if (op < 0.12) continue;
    out.media.push({ ...clip(r), t: tag, gl: el.__ctxType || '', big: r.width * r.height > W * H * 0.25 ? 1 : 0 });
  }
  for (const el of document.querySelectorAll('button, a, input, select, textarea, [role=button], summary')) {
    const r = el.getBoundingClientRect();
    if (!inView(r) || r.width < 18 || r.height < 14) continue;
    if (effOpacity(el) < 0.12) continue;
    const cs = getComputedStyle(el);
    const fill = !transparent(cs.backgroundColor);
    const border = parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== 'none' && !transparent(cs.borderTopColor);
    const field = ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName);
    if (!fill && !border && !field) continue;
    out.ctl.push({ ...clip(r), rad: +(parseFloat(cs.borderTopLeftRadius) || 0).toFixed(1), fill: fill ? 1 : 0 });
  }
  const skip = 'button, a, input, select, textarea, img, video, canvas, svg, svg *, picture, iframe, script, style';
  for (const el of document.querySelectorAll('body *')) {
    if (el.matches(skip)) continue;
    const r = el.getBoundingClientRect();
    if (!inView(r) || r.width < 56 || r.height < 32) continue;
    if (r.width >= W * 0.985 && r.height >= H * 0.95) continue;
    const cs = getComputedStyle(el);
    const border = ['Top', 'Right', 'Bottom', 'Left'].some((s) => parseFloat(cs['border' + s + 'Width']) > 0 && cs['border' + s + 'Style'] !== 'none' && !transparent(cs['border' + s + 'Color']));
    const fill = !transparent(cs.backgroundColor) || cs.backgroundImage !== 'none';
    if (!border && !fill) continue;
    if (effOpacity(el) < 0.12) continue;
    out.box.push({ ...clip(r), rad: +(parseFloat(cs.borderTopLeftRadius) || 0).toFixed(1), b: border ? 1 : 0, f: fill ? 1 : 0,
      fx: cs.position === 'fixed' || cs.position === 'sticky' ? 1 : 0 });
  }
  return out;
}
"""

FACTS = r"""
() => {
  const res = performance.getEntriesByType('resource');
  const nav = performance.getEntriesByType('navigation')[0];
  let bytes = nav ? (nav.transferSize || 0) : 0;
  for (const r of res) bytes += r.transferSize || 0;
  const fams = new Set();
  for (const f of document.fonts) if (f.status === 'loaded') fams.add(f.family.replace(/^["']|["']$/g, ''));
  const meta = (n) => (document.querySelector(`meta[name="${n}"]`) || {}).content || '';
  return {
    title: document.title, description: meta('description'), themeColor: meta('theme-color'),
    lang: document.documentElement.lang, fonts: [...fams], contexts: window.__ctx || [],
    requests: res.length + 1, transferBytes: bytes,
    canvases: document.querySelectorAll('canvas').length, videos: document.querySelectorAll('video').length,
  };
}
"""


async def jam_palsu(ctx, waktu):
    # only Date moves to the shop's opening hours; timers and animation frames stay real (Playwright's clock.install
    # fakes requestAnimationFrame too, and heavy WebGL pages then never deliver a frame for the screenshot)
    target = int(waktu.timestamp() * 1000)
    await ctx.add_init_script("""(() => {
      const target = %d, offset = target - Date.now(), Real = Date;
      class Geser extends Real {
        constructor(...a) { if (a.length === 0) super(Real.now() + offset); else super(...a); }
        static now() { return Real.now() + offset; }
      }
      window.Date = Geser;
    })();""" % target)


async def settle(page, seconds):
    # a throwaway frame first: some sites paint their decorations only after the first composited frame
    await page.wait_for_timeout(int(seconds * 1000))
    await page.screenshot(type='jpeg', quality=10)
    await page.wait_for_timeout(1200)


async def scroll_to(page, y):
    await page.evaluate(f"""() => {{
      const y = {y};
      if (window.lenis && window.lenis.scrollTo) window.lenis.scrollTo(y, {{ immediate: true }});
      if (window.arsword && window.arsword.lenis) window.arsword.lenis.scrollTo(y, {{ immediate: true }});
      document.scrollingElement.scrollTop = y; window.scrollTo(0, y);
    }}""")
    await page.wait_for_timeout(2200)


async def capture(browser, key, cfg, do_desk, do_hp):
    d = OUT / key
    d.mkdir(parents=True, exist_ok=True)
    info = {'key': key, 'url': cfg['url'], 'captured': dt.datetime.now(WIB).isoformat(timespec='seconds')}
    if do_desk:
        ctx = await browser.new_context(viewport={'width': 1440, 'height': 900}, device_scale_factor=1.5,
                                        locale='id-ID', timezone_id='Asia/Jakarta', color_scheme='light')
        await ctx.add_init_script(INIT)
        page = await ctx.new_page()
        page.set_default_timeout(150000)
        if cfg.get('clock'):
            await jam_palsu(ctx, cfg['clock'])
        await page.goto(cfg['url'], wait_until='load', timeout=90000)
        await settle(page, cfg['wait'])
        await page.screenshot(path=str(d / 'desk.png'))
        (d / 'desk-geo.json').write_text(json.dumps(await page.evaluate(GEO), ensure_ascii=False), encoding='utf-8')
        info['desk'] = await page.evaluate(FACTS)
        info['desk']['height'] = await page.evaluate('document.documentElement.scrollHeight')
        for i, f in enumerate((0.95, 2.1), 1):
            await scroll_to(page, int(900 * f))
            await page.screenshot(path=str(d / f'desk-{i}.png'))
            (d / f'desk-{i}-geo.json').write_text(json.dumps(await page.evaluate(GEO), ensure_ascii=False), encoding='utf-8')
        await ctx.close()
    if do_hp:
        ctx = await browser.new_context(viewport={'width': 393, 'height': 852}, device_scale_factor=2, is_mobile=True,
                                        has_touch=True, locale='id-ID', timezone_id='Asia/Jakarta',
                                        user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1')
        await ctx.add_init_script(INIT)
        page = await ctx.new_page()
        page.set_default_timeout(150000)
        if cfg.get('clock'):
            await jam_palsu(ctx, cfg['clock'])
        await page.goto(cfg['url'], wait_until='load', timeout=90000)
        await settle(page, cfg['wait'])
        await page.screenshot(path=str(d / 'hp.png'))
        (d / 'hp-geo.json').write_text(json.dumps(await page.evaluate(GEO), ensure_ascii=False), encoding='utf-8')
        info['hp'] = await page.evaluate(FACTS)
        await ctx.close()
    old = d / 'info.json'
    if old.exists():
        prev = json.loads(old.read_text(encoding='utf-8'))
        prev.update(info)
        info = prev
    old.write_text(json.dumps(info, ensure_ascii=False, indent=1), encoding='utf-8')
    print(key, 'ok', flush=True)


async def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    do_desk = '--hp' not in sys.argv
    do_hp = '--desk' not in sys.argv
    keys = args or list(SITES)
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True, args=[
            '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-gpu-rasterization',
            '--autoplay-policy=no-user-gesture-required', '--hide-scrollbars', '--mute-audio'])
        for k in keys:
            try:
                await capture(browser, k, SITES[k], do_desk, do_hp)
            except Exception as e:  # keep going: one slow site must not stop the rest
                print(k, 'FAILED', repr(e)[:300], flush=True)
        await browser.close()

asyncio.run(main())
