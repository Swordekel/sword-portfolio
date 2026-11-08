// Merakit portfolio Sword Ekel dari src/ ke public/ tanpa paket tambahan:
//   node bangun.mjs            situs yang tayang: arah pilihan (UTAMA) di /, plus _headers, robots, sitemap, 404;
//                              arah lain dan media yang tidak dirujuk halaman dibuang dari public/
//   node bangun.mjs gambar     satu arah lain ke public/<arah>/ untuk dibandingkan di lokal (jangan di-commit; hurufnya
//                              ada di riwayat git, lihat README)
// Setiap arah: src/arah/<arah>/halaman.mjs (export default (ctx) => dokumen HTML lengkap, opsional
// export const BAHASA = ['en','id']), ditambah berkas lain di folder itu (css, js, svg) yang disalin apa adanya
// ke public/<arah>/. Arah utama tayang di / (Indonesia di /id/ bila BAHASA memuatnya); arah lain di /<arah>/.
// Hasil public/** ikut di-commit: hosting tidak menjalankan langkah build.
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as DATA from './src/data.mjs';

const AKAR = dirname(fileURLToPath(import.meta.url));
// arah yang tayang (pilihan pemilik 2026-11-09: versi E) dan alamatnya
export const UTAMA = 'personal';
export const SITUS = 'https://swordekel.arswordlab.com';
const PUB = join(AKAR, 'public');
const SRC = join(AKAR, 'src');
const bacaJson = (p, cadangan = null) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : cadangan);

export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// penanda versi dari isi berkas, supaya cache browser selalu mengambil versi baru setelah berkas berubah
const VERSI = new Map();
function aset(rel) {
  const bersih = rel.replace(/^\/+/, '');
  const abs = join(PUB, ...bersih.split('/'));
  if (!existsSync(abs)) throw new Error(`aset tidak ada: ${bersih}`);
  if (!VERSI.has(abs)) VERSI.set(abs, createHash('sha1').update(readFileSync(abs)).digest('hex').slice(0, 8));
  return `/${bersih}?v=${VERSI.get(abs)}`;
}

// data tangkapan: ukuran gambar, geometri tata letak, fakta terukur, header keamanan
const MEDIA = bacaJson(join(SRC, 'media.json'), {});
const PERIKSA = bacaJson(join(SRC, 'periksa.json'), { hosts: {} });
const geo = (kunci, shot = 'desk') => bacaJson(join(SRC, 'geo', `${kunci}-${shot}.json`));
const info = (kunci) => bacaJson(join(SRC, 'info', `${kunci}.json`));
const ukuran = (kunci, shot = 'desk') => { const m = MEDIA[kunci]?.[shot]; return m ? [m.w, m.h] : null; };
function media(kunci, shot = 'desk', lebar = null) {
  const m = MEDIA[kunci]?.[shot];
  if (!m) return null;
  const w = lebar && m.lebar.includes(lebar) ? lebar : m.lebar[0];
  return aset(`media/karya/${kunci}-${shot}-${w}.webp`);
}
function srcset(kunci, shot = 'desk') {
  const m = MEDIA[kunci]?.[shot];
  if (!m) return '';
  return m.lebar.map((w) => `${aset(`media/karya/${kunci}-${shot}-${w}.webp`)} ${w}w`).join(', ');
}
// <img> lengkap untuk satu tangkapan; atribut tambahan sebagai string
function gambar(kunci, shot, alt, sizes, tambahan = '') {
  const m = MEDIA[kunci]?.[shot];
  if (!m) return '';
  const w = m.lebar[m.lebar.length > 1 ? 1 : 0];
  const h = Math.round(m.h * w / m.w);
  return `<img src="${media(kunci, shot, w)}" srcset="${srcset(kunci, shot)}" sizes="${esc(sizes)}" width="${w}" height="${h}" alt="${esc(alt)}" decoding="async" ${tambahan}>`;
}

function salinBerkas(dari, ke) {
  for (const nama of readdirSync(dari)) {
    const a = join(dari, nama), b = join(ke, nama);
    if (statSync(a).isDirectory()) { mkdirSync(b, { recursive: true }); salinBerkas(a, b); continue; }
    if (nama.endsWith('.mjs')) continue;
    mkdirSync(ke, { recursive: true });
    cpSync(a, b);
  }
}

// berkas bersama: suara, cek live, dll.
mkdirSync(join(PUB, 'js'), { recursive: true });
salinBerkas(join(SRC, 'js'), join(PUB, 'js'));

const semua = readdirSync(join(SRC, 'arah')).filter((n) => existsSync(join(SRC, 'arah', n, 'halaman.mjs')));
const diminta = process.argv.slice(2);
const daftar = diminta.length ? diminta : [];

async function rakit(arah, lang, akar) {
  const mod = await import(pathToFileURL(join(SRC, 'arah', arah, 'halaman.mjs')).href + `?t=${Date.now()}`);
  const i = lang === 'id' ? 1 : 0;
  const ctx = {
    arah, lang, bahasa: mod.BAHASA || ['en'], esc, aset, media, srcset, ukuran, gambar, geo, info, MEDIA, PERIKSA, DATA,
    situs: SITUS, t: (en, id) => (i ? id : en), tt: (pasangan) => (Array.isArray(pasangan) ? pasangan[i] : pasangan),
    akar, alamatBahasa: (l) => (l === 'en' ? akar : `${akar}${l}/`),
  };
  return { mod, ctx, html: mod.default(ctx) };
}

if (!diminta.length) {
  // situs yang tayang: arah pilihan di /, aset arahnya di /<arah>/, arah lain dan halaman pembanding dibuang
  for (const n of semua) if (n !== UTAMA) rmSync(join(PUB, n), { recursive: true, force: true });
  for (const n of readdirSync(join(PUB, 'font'))) if (n !== UTAMA) rmSync(join(PUB, 'font', n), { recursive: true, force: true });
  rmSync(join(PUB, 'media', 'pilih'), { recursive: true, force: true });
  salinBerkas(join(SRC, 'arah', UTAMA), join(PUB, UTAMA));
  rmSync(join(PUB, UTAMA, 'index.html'), { force: true });
  const { mod, ctx, html } = await rakit(UTAMA, 'en', '/');
  writeFileSync(join(PUB, 'index.html'), html);
  console.log('index.html', (html.length / 1024).toFixed(1), 'KB');
  for (const lang of ctx.bahasa.filter((l) => l !== 'en')) {
    const r = await rakit(UTAMA, lang, '/');
    mkdirSync(join(PUB, lang), { recursive: true });
    writeFileSync(join(PUB, lang, 'index.html'), r.html);
    console.log(`${lang}/index.html`);
  }
  if (mod.halaman404) writeFileSync(join(PUB, '404.html'), mod.halaman404(ctx));
  cpSync(join(SRC, '_headers'), join(PUB, '_headers'));
  writeFileSync(join(PUB, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITUS}/sitemap.xml\n`);
  const hari = new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10); // tanggal WIB
  const halamanUrl = ['/', ...ctx.bahasa.filter((l) => l !== 'en').map((l) => `/${l}/`)];
  writeFileSync(join(PUB, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${halamanUrl.map((u) => `  <url><loc>${SITUS}${u}</loc><lastmod>${hari}</lastmod></url>`).join('\n')}\n</urlset>\n`);
  console.log('_headers, robots.txt, sitemap.xml, 404.html');

  // media yang tidak dirujuk halaman yang tayang (tangkapan HP, detail, potret abu-abu milik arah lain) tidak ikut terbit;
  // alat/media.py membuatnya lagi bila suatu saat dipakai
  const halamanTayang = [join(PUB, 'index.html'), join(PUB, '404.html'), ...ctx.bahasa.filter((l) => l !== 'en').map((l) => join(PUB, l, 'index.html')),
    ...readdirSync(join(PUB, UTAMA)).map((n) => join(PUB, UTAMA, n)), ...readdirSync(join(PUB, 'js')).map((n) => join(PUB, 'js', n))];
  const dirujuk = halamanTayang.filter((p) => existsSync(p) && statSync(p).isFile()).map((p) => readFileSync(p, 'utf8')).join('\n');
  let dibuang = 0, bita = 0;
  const sapu = (dir) => {
    for (const n of readdirSync(dir)) {
      const p = join(dir, n);
      if (statSync(p).isDirectory()) { sapu(p); continue; }
      if (dirujuk.includes('/' + relative(PUB, p).split(sep).join('/'))) continue;
      bita += statSync(p).size; rmSync(p); dibuang++;
    }
  };
  sapu(join(PUB, 'media'));
  if (dibuang) console.log(`media tak dirujuk dibuang: ${dibuang} berkas, ${(bita / 1048576).toFixed(1)} MB`);
}

for (const arah of daftar) {
  const dir = join(SRC, 'arah', arah);
  if (!existsSync(join(dir, 'halaman.mjs'))) { console.error(`lewati ${arah}: tidak ada halaman.mjs`); continue; }
  salinBerkas(dir, join(PUB, arah));
  const mod = await import(pathToFileURL(join(dir, 'halaman.mjs')).href + `?t=${Date.now()}`);
  const bahasa = mod.BAHASA || ['en'];
  for (const lang of bahasa) {
    const i = lang === 'id' ? 1 : 0;
    const ctx = {
      arah, lang, bahasa, esc, aset, media, srcset, ukuran, gambar, geo, info, MEDIA, PERIKSA, DATA,
      t: (en, id) => (i ? id : en),
      tt: (pasangan) => (Array.isArray(pasangan) ? pasangan[i] : pasangan),
      akar: lang === 'en' ? `/${arah}/` : `/${arah}/${lang}/`,
      alamatBahasa: (l) => (l === 'en' ? `/${arah}/` : `/${arah}/${l}/`),
    };
    const html = mod.default(ctx);
    const keluar = lang === 'en' ? join(PUB, arah) : join(PUB, arah, lang);
    mkdirSync(keluar, { recursive: true });
    writeFileSync(join(keluar, 'index.html'), html);
    console.log(`${arah}/${lang === 'en' ? '' : lang + '/'}index.html`, (html.length / 1024).toFixed(1), 'KB');
  }
}

