// Worker kecil untuk swordekel.arswordlab.com. Semua berkas dilayani langsung oleh Workers Static Assets (dengan header
// dari public/_headers); Worker ini hanya berjalan untuk /media/video/* (run_worker_first di wrangler.jsonc). Alasannya:
// aset statis menjawab permintaan Range dengan seluruh berkas (200), padahal Safari di iPhone dan Mac hanya memutar video
// yang dijawab 206 Partial Content. Videonya kecil (di bawah 2 MB), jadi cukup diiris dari isi berkas.

const HEADER_VIDEO = {
  'Cache-Control': 'public, max-age=31536000, immutable', // alamatnya memuat penanda versi (?v=)
  'X-Content-Type-Options': 'nosniff',
  'Accept-Ranges': 'bytes',
};

export default {
  async fetch(req, env) {
    const { pathname } = new URL(req.url);
    if (pathname.startsWith('/media/video/') && (req.method === 'GET' || req.method === 'HEAD')) return video(req, env);
    return env.ASSETS.fetch(req);
  },
};

async function video(req, env) {
  const minta = new Headers(req.headers);
  const range = minta.get('Range');
  const ifRange = minta.get('If-Range');
  minta.delete('Range');
  minta.delete('If-Range');
  const asal = await env.ASSETS.fetch(new Request(req.url, { method: 'GET', headers: minta }));
  if (asal.status !== 200) return asal; // 206 (platform sudah menanganinya), 304, 404: apa adanya

  const h = new Headers(asal.headers);
  for (const [k, v] of Object.entries(HEADER_VIDEO)) h.set(k, v);
  const kepala = req.method === 'HEAD';
  // If-Range: hanya diiris bila versi berkasnya masih sama (perbandingan kuat, ETag lemah tidak dihitung)
  const etag = asal.headers.get('ETag');
  const iris = range && (!ifRange || (etag && !etag.startsWith('W/') && ifRange === etag));
  if (!iris) return new Response(kepala ? null : asal.body, { status: 200, headers: h });

  const isi = await asal.arrayBuffer();
  const total = isi.byteLength;
  const r = bacaRange(range, total);
  if (r === 'utuh') return new Response(kepala ? null : isi, { status: 200, headers: h });
  if (!r) {
    h.delete('Content-Length');
    h.set('Content-Range', `bytes */${total}`);
    return new Response(null, { status: 416, headers: h });
  }
  const [awal, akhir] = r;
  h.set('Content-Range', `bytes ${awal}-${akhir}/${total}`);
  h.set('Content-Length', String(akhir - awal + 1));
  return new Response(kepala ? null : isi.slice(awal, akhir + 1), { status: 206, headers: h });
}

// "bytes=a-b", "bytes=a-", "bytes=-n" menjadi [awal, akhir]; null = tidak bisa dipenuhi (416); 'utuh' = bentuk lain
// (misalnya beberapa rentang sekaligus), dijawab dengan seluruh berkas seperti yang diizinkan RFC 9110
export function bacaRange(nilai, total) {
  const m = /^bytes=(\d*)-(\d*)$/.exec(String(nilai).trim());
  if (!m || (m[1] === '' && m[2] === '')) return 'utuh';
  let awal, akhir;
  if (m[1] === '') {
    const n = Number(m[2]);
    if (n === 0) return null;
    awal = Math.max(0, total - n);
    akhir = total - 1;
  } else {
    awal = Number(m[1]);
    akhir = m[2] === '' ? total - 1 : Math.min(Number(m[2]), total - 1);
  }
  if (awal >= total || awal > akhir) return null;
  return [awal, akhir];
}
