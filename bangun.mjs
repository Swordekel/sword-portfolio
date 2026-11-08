// Merakit portfolio Sword Ekel dari src/ ke public/ tanpa paket tambahan:
//   node bangun.mjs            semua arah desain + halaman pembanding di /
//   node bangun.mjs gambar     hanya satu arah (nama folder di src/arah/)
// Setiap arah: src/arah/<arah>/halaman.mjs (export default (ctx) => dokumen HTML lengkap, opsional
// export const BAHASA = ['en','id']), ditambah berkas lain di folder itu (css, js, svg) yang disalin apa adanya
// ke public/<arah>/. Bahasa Inggris tayang di /<arah>/, bahasa Indonesia di /<arah>/id/.
// Hasil public/** ikut di-commit: hosting tidak menjalankan langkah build.
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as DATA from './src/data.mjs';

const AKAR = dirname(fileURLToPath(import.meta.url));
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
const daftar = diminta.length ? diminta : semua;

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

// halaman pembanding di / (selama masa memilih arah)
if (!diminta.length && existsSync(join(SRC, 'pilih.mjs'))) {
  const mod = await import(pathToFileURL(join(SRC, 'pilih.mjs')).href + `?t=${Date.now()}`);
  writeFileSync(join(PUB, 'index.html'), mod.default({ esc, aset, media, DATA, semua }));
  console.log('index.html (pembanding)');
}
