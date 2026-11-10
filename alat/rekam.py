"""Record short looping tours of live sites (16:9, 1600x900) for the portfolio: the hero with its interaction,
a slow scroll down and back to the top so the loop closes where it began.

    python -I -X utf8 alat/rekam.py [key ...]

Chrome headless on the real GPU (d3d11), CDP screencast JPEG frames with timestamps -> ffmpeg concat -> 30 fps.
Writes sumber/video/<key>-rekam.mp4 (master), then alat/video_ada.keluaran makes the shipped sizes.
Run at below-normal priority:  cmd //c "start /belownormal /b /wait python -I -X utf8 alat/rekam.py"
"""
import asyncio, base64, datetime as dt, math, pathlib, shutil, subprocess, sys
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'alat'))
TMP = ROOT / 'sumber' / 'video' / 'bingkai'
WIB = dt.timezone(dt.timedelta(hours=7))

# key: url, wait for the opening, interaction kind, fake shop time (status pills)
SITUS = {
    'arswordlab': dict(url='https://arswordlab.com/', tunggu=5.5, gerak='titik'),
    'eskrim-uncle-ren': dict(url='https://eskrim-uncle-ren.arswordlab.com/', tunggu=9.0, gerak='seret', jam=dt.datetime(2026, 11, 6, 14, 0, tzinfo=WIB)),
    'teassence': dict(url='https://teassence.arswordlab.com/', tunggu=6.0, gerak='aduk'),
    'cherish': dict(url='https://cherish.arswordlab.com/', tunggu=6.0, gerak='lampu'),
    'tsunagu': dict(url='https://tsunagu.arswordlab.com/', tunggu=7.0, gerak='lampu'),
    'silibet': dict(url='https://silibet.arswordlab.com/', tunggu=7.0, gerak='ondel'),
}
W, H = 1600, 900


async def jam_palsu(ctx, waktu):
    target = int(waktu.timestamp() * 1000)
    await ctx.add_init_script("""(() => { const target = %d, offset = target - Date.now(), Real = Date;
      class Geser extends Real { constructor(...a) { if (a.length === 0) super(Real.now() + offset); else super(...a); }
        static now() { return Real.now() + offset; } } window.Date = Geser; })();""" % target)


async def pusat_kanvas(page):
    # the largest visible canvas in the first screen (the hero's WebGL object), else the right half's middle
    p = await page.evaluate("""() => {
      let best = null, area = 0;
      for (const c of document.querySelectorAll('canvas')) {
        const r = c.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight || r.width < 100) continue;
        const a = r.width * r.height;
        if (a > area && a < innerWidth * innerHeight * 0.9) { area = a; best = r; }
      }
      return best ? [best.left + best.width / 2, best.top + best.height / 2, best.width, best.height] : null;
    }""")
    return p or [W * 0.7, H * 0.52, W * 0.4, H * 0.6]


async def gulir(page, jumlah, lama):
    # wheel steps so the site's own smooth scrolling (Lenis or its own) carries the motion
    n = max(1, int(lama / 0.045))
    for i in range(n):
        await page.mouse.wheel(0, jumlah / n)
        await page.wait_for_timeout(45)


async def tur(page, gerak):
    cx, cy, cw, ch = await pusat_kanvas(page)
    await page.mouse.move(W * 0.5, H * 0.5)
    if gerak == 'titik':  # arswordlab: dots light up under the pointer
        for i in range(60):
            a = i / 60 * math.tau
            await page.mouse.move(W * 0.5 + math.cos(a) * W * 0.28, H * 0.55 + math.sin(a * 2) * H * 0.12)
            await page.wait_for_timeout(40)
    elif gerak == 'seret':  # uncle ren: turn the 3D coconut
        await page.mouse.move(cx - cw * 0.1, cy)
        await page.mouse.down()
        for i in range(40):
            await page.mouse.move(cx - cw * 0.1 + math.sin(i / 40 * math.pi) * cw * 0.35, cy + math.sin(i / 13) * 8)
            await page.wait_for_timeout(40)
        await page.mouse.up()
        await page.wait_for_timeout(700)
    elif gerak == 'aduk':  # teassence: stir the tea in circles, then one drop
        for i in range(64):
            a = i / 32 * math.tau
            await page.mouse.move(cx + math.cos(a) * cw * 0.16, cy + math.sin(a) * ch * 0.16)
            await page.wait_for_timeout(38)
        await page.mouse.click(cx, cy)
        await page.wait_for_timeout(600)
    elif gerak == 'ondel':  # silibet: the ondel-ondel's eyes follow the pointer across the hero, one tap = jolt + petasan
        for i in range(60):
            t = i / 59
            await page.mouse.move(W * (0.14 + 0.72 * t), H * (0.36 + 0.08 * math.sin(t * math.pi)))
            await page.wait_for_timeout(40)
        await page.mouse.click(W * 0.885, H * 0.62)
        await page.wait_for_timeout(1100)
    else:  # lampu: sweep the pointer across the hero object (key light / cursor lamp)
        for i in range(56):
            t = i / 55
            await page.mouse.move(cx - cw * 0.35 + t * cw * 0.7, cy - ch * 0.15 + math.sin(t * math.pi) * ch * 0.3)
            await page.wait_for_timeout(40)
    await page.wait_for_timeout(500)
    await gulir(page, H * 1.25, 2.6)
    await page.wait_for_timeout(1300)
    await gulir(page, -H * 1.6, 2.6)
    await page.wait_for_timeout(1400)


async def rekam(browser, key, cfg):
    ctx = await browser.new_context(viewport={'width': W, 'height': H}, device_scale_factor=1, locale='id-ID', timezone_id='Asia/Jakarta')
    if cfg.get('jam'):
        await jam_palsu(ctx, cfg['jam'])
    page = await ctx.new_page()
    page.set_default_timeout(120000)
    await page.goto(cfg['url'], wait_until='load', timeout=90000)
    await page.wait_for_timeout(int(cfg['tunggu'] * 1000))
    d = TMP / key
    shutil.rmtree(d, ignore_errors=True)
    d.mkdir(parents=True)
    cdp = await ctx.new_cdp_session(page)
    frames = []

    def on_frame(p):
        frames.append((p['metadata']['timestamp'], p['data']))
        asyncio.ensure_future(cdp.send('Page.screencastFrameAck', {'sessionId': p['sessionId']}))
    cdp.on('Page.screencastFrame', on_frame)
    await cdp.send('Page.startScreencast', {'format': 'jpeg', 'quality': 90, 'maxWidth': W, 'maxHeight': H, 'everyNthFrame': 1})
    t_mulai = dt.datetime.now().timestamp()
    await tur(page, cfg['gerak'])
    t_akhir = dt.datetime.now().timestamp()
    await cdp.send('Page.stopScreencast')
    await ctx.close()
    frames.sort(key=lambda f: f[0])
    daftar = []
    for i, (t, data) in enumerate(frames):
        f = d / f'{i:05d}.jpg'
        f.write_bytes(base64.b64decode(data))
        nxt = frames[i + 1][0] if i + 1 < len(frames) else max(t + 0.04, t_akhir)
        daftar.append(f"file '{f.as_posix()}'\nduration {max(0.001, nxt - t):.4f}")
    daftar.append(f"file '{(d / f'{len(frames) - 1:05d}.jpg').as_posix()}'")
    (d / 'daftar.txt').write_text('\n'.join(daftar), encoding='utf-8')
    master = ROOT / 'sumber' / 'video' / f'{key}-rekam.mp4'
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(d / 'daftar.txt'),
                    '-vf', f'fps=30,scale={W}:{H}:in_range=pc:out_range=tv,format=yuv420p', '-c:v', 'libx264', '-crf', '14', '-preset', 'fast',
                    str(master)], check=True)
    shutil.rmtree(d, ignore_errors=True)
    print(key, len(frames), 'frames', round(t_akhir - t_mulai, 1), 's', flush=True)
    return master


async def main():
    keys = sys.argv[1:] or list(SITUS)
    import video_ada
    async with async_playwright() as p:
        b = await p.chromium.launch(channel='chrome', headless=True, args=[
            '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--hide-scrollbars', '--mute-audio',
            '--autoplay-policy=no-user-gesture-required'])
        for k in keys:
            try:
                m = await rekam(b, k, SITUS[k])
                video_ada.keluaran(k, ['-i', m], 'null')
            except Exception as e:
                print(k, 'FAILED', repr(e)[:300], flush=True)
        await b.close()

asyncio.run(main())
