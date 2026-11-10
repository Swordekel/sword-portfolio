"""Measure every host shown in the portfolio: status, response time, and which security headers it sends.

    python -I -X utf8 alat/periksa.py

Writes src/periksa.json (committed; the pages quote it as "measured on <date>").
"""
import json, sys, time, pathlib, datetime as dt, urllib.request, ssl

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'alat'))

HOSTS = ['arswordlab.com', 'pos.arswordlab.com', 'chat.arswordlab.com', 'dailytask.arswordlab.com',
         'eskrim-uncle-ren.arswordlab.com', 'nathaniakhow.arswordlab.com', 'nilamerah.arswordlab.com',
         'himawari.arswordlab.com', 'javaloom.arswordlab.com', 'radja.arswordlab.com', 'bengkelnusantara.arswordlab.com',
         'cherish.arswordlab.com', 'seifan.arswordlab.com', 'tsunagu.arswordlab.com', 'teassence.arswordlab.com',
         'seraphine.arswordlab.com', 'ashfield.arswordlab.com', 'koaslink.arswordlab.com', 'silibet.arswordlab.com']
HEADERS = ['content-security-policy', 'strict-transport-security', 'x-content-type-options', 'referrer-policy',
           'permissions-policy', 'x-frame-options']

ctx = ssl.create_default_context()
res = {}
for h in HOSTS:
    req = urllib.request.Request(f'https://{h}/', headers={'User-Agent': 'sword-portfolio-check/1.0'})
    t = time.perf_counter()
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=30) as r:
            r.read(2048)
            ms = round((time.perf_counter() - t) * 1000)
            hd = {k.lower(): v for k, v in r.headers.items()}
            res[h] = {'status': r.status, 'ms': ms, 'headers': {k: (k in hd) for k in HEADERS},
                      'server': hd.get('server', ''), 'noindex': 'noindex' in hd.get('x-robots-tag', '')}
    except Exception as e:
        res[h] = {'status': 0, 'error': repr(e)[:200]}
    print(h, res[h].get('status'), res[h].get('ms'), flush=True)

out = {'measured': dt.datetime.now(dt.timezone(dt.timedelta(hours=7))).isoformat(timespec='minutes'), 'hosts': res}
(ROOT / 'src' / 'periksa.json').write_text(json.dumps(out, indent=1), encoding='utf-8')
print('csp', sum(1 for v in res.values() if v.get('headers', {}).get('content-security-policy')), 'of', len(res))
