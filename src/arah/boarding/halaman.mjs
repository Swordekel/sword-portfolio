// Arah C, "Boarding Pass + Papan Gate": Sword Ekel adalah boarding pass-nya, 18 situs di arswordlab.com adalah papan
// keberangkatan yang hidup (status dicek dari browser pengunjung) dan bisa disusun ulang di tempat.
// Semua angka di pass dan papan adalah fakta: kota, studi, magang, host, tahun, waktu respons, header terukur.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const BAHASA = ['en'];

const DIR = dirname(fileURLToPath(import.meta.url));
const QR = readFileSync(join(DIR, 'qr-cv.svg'), 'utf8');

// ikon digambar sendiri, satu bobot garis (1.6) di kisi 16
const IKON = `<svg class="sprite" aria-hidden="true" focusable="false">
  <symbol id="i-luar" viewBox="0 0 16 16"><path d="M5.5 10.5l5-5M6.5 5.5h4v4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-unduh" viewBox="0 0 16 16"><path d="M8 2.75v7.5M4.75 7.25 8 10.5l3.25-3.25M3 13.25h10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-salin" viewBox="0 0 16 16"><rect x="5.25" y="5.25" width="7.5" height="7.5" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3.25 10.25v-6a1 1 0 0 1 1-1h6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></symbol>
  <symbol id="i-cek" viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-bunyi" viewBox="0 0 16 16"><path d="M2.75 6.25h2.5L8.5 3.5v9l-3.25-2.75h-2.5z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path class="gelombang" d="M10.75 6a2.75 2.75 0 0 1 0 4M12.5 4.25a5.25 5.25 0 0 1 0 7.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path class="silang" d="M11 6.25l3.5 3.5M14.5 6.25 11 9.75" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></symbol>
  <symbol id="i-bawah" viewBox="0 0 16 16"><path d="M4.5 6.25 8 9.75l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-ulang" viewBox="0 0 16 16"><path d="M12.75 8a4.75 4.75 0 1 1-1.4-3.36M12.9 2.75v2.5h-2.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-surat" viewBox="0 0 16 16"><rect x="2.25" y="3.75" width="11.5" height="8.5" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M2.75 4.75 8 8.75l5.25-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></symbol>
</svg>`;
const ik = (id, kelas = 'ik') => `<svg class="${kelas}" aria-hidden="true"><use href="#i-${id}"/></svg>`;

const JAMAK = { produk: 'Products', klien: 'Clients', usulan: 'Proposals', konsep: 'Concepts', kuliah: 'Course projects' };
const SINGKAT = { produk: 'Product', klien: 'Client', usulan: 'Proposal', konsep: 'Concept', kuliah: 'Course' };

const pendek = (host) => (host === 'arswordlab.com' ? 'arswordlab' : host.replace(/\.arswordlab\.com$/, ''));
const mb = (b) => (b >= 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.round(b / 1e3)} KB`);

export default function halaman(ctx) {
  const { DATA, esc, tt, aset, gambar, info, PERIKSA } = ctx;
  const { PROFIL, STATUS, TEKNO, PROYEK, PENGALAMAN, PENDIDIKAN } = DATA;
  const namaTekno = Object.fromEntries(TEKNO.map((x) => [x.id, x.nama]));
  const hitung = Object.fromEntries(Object.keys(STATUS).map((s) => [s, PROYEK.filter((p) => p.status === s).length]));
  const tanggalUkur = new Date(PERIKSA.measured);
  const tglUkur = tanggalUkur.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' });
  const adaCsp = PROYEK.filter((p) => PERIKSA.hosts[p.host]?.headers?.['content-security-policy']);
  const hidup = PROYEK.filter((p) => PERIKSA.hosts[p.host]?.status === 200).length;
  const unggulan = PROYEK.filter((p) => p.unggulan);

  // fakta terukur satu proyek (tangkapan 9 Nov): permintaan, ukuran, konteks WebGL, CSP
  function terukur(p) {
    const f = info(p.kunci)?.desk;
    const bagian = [];
    if (f) {
      bagian.push(`${f.requests} requests`, mb(f.transferBytes));
      const gl = (f.contexts || []).filter((c) => c.startsWith('webgl')).length;
      if (gl) bagian.push(`${gl} WebGL ${gl === 1 ? 'canvas' : 'canvases'}`);
    }
    bagian.push(PERIKSA.hosts[p.host]?.headers?.['content-security-policy'] ? 'CSP header sent' : 'no CSP header');
    return bagian.join(' · ');
  }

  // ---- pass -----------------------------------------------------------------------------------------------------
  const pass = `
    <article class="pass" aria-labelledby="nama">
      <div class="pass-atas">
        <span class="lbl">Boarding pass</span>
        <span class="lbl">Jakarta · 2026</span>
      </div>
      <div class="seg seg-nama">
        <span class="lbl">Passenger</span>
        <h1 id="nama" class="nama">${esc(PROFIL.nama)}</h1>
        <p class="peran">${esc(tt(PROFIL.peran))}</p>
      </div>
      <div class="seg seg-rute">
        <div class="ujung">
          <span class="lbl">From</span>
          <b class="kode">JKT</b>
          <span class="kota">Jakarta, Indonesia</span>
        </div>
        <svg class="garis-rute" viewBox="0 0 120 12" preserveAspectRatio="none" aria-hidden="true"><path d="M2 6H112" stroke-dasharray="3 5"/><path d="M106 1.5 115 6l-9 4.5"/></svg>
        <div class="ujung ujung-ke">
          <span class="lbl">To</span>
          <b class="kode">Full-stack</b>
          <span class="kota">Developer roles</span>
        </div>
      </div>
      <p class="seg intro">I design, build and run websites and web apps. Eighteen are live on arswordlab.com, from client sites to a point-of-sale system a shop uses every day.</p>
      <dl class="seg kisi">
        <div><dt class="lbl">Study</dt><dd>BINUS University<span>B.Sc. Cyber Security, expected 2027</span></dd></div>
        <div><dt class="lbl">Now</dt><dd>Security analyst intern<span>PT Inti Siber Net, until Feb 2027</span></dd></div>
        <div><dt class="lbl">Live</dt><dd><b class="angka">${hidup}</b><span>hosts on arswordlab.com</span></dd></div>
        <div><dt class="lbl">Status</dt><dd>Open to roles<span>Full-stack, web, freelance</span></dd></div>
      </dl>
      <div class="seg pindai">
        <a class="qr-tautan" href="${esc(PROFIL.cv)}" aria-label="Open the CV (PDF)">${QR}</a>
        <p><b>Scan for my CV</b><span>PDF, 2 pages. Opens on your phone.</span></p>
      </div>
      <div class="perforasi" aria-hidden="true"></div>
      <div class="stub">
        <a class="tombol tinta" href="${esc(PROFIL.cv)}" download data-suara="tekan">${ik('unduh')}<span>Download CV</span></a>
        <button class="tombol garis" type="button" data-salin="${esc(PROFIL.email)}" data-suara-sentuh>${ik('salin')}<span class="teks-salin">Copy email</span></button>
        <a class="surel" href="mailto:${esc(PROFIL.email)}"><span>${esc(PROFIL.email)}</span></a>
      </div>
    </article>`;

  // ---- papan ----------------------------------------------------------------------------------------------------
  const chip = (f, label, n, aktif = false) =>
    `<button class="chip" type="button" data-f="${f}" aria-pressed="${aktif}">${esc(label)} <b>${n}</b></button>`;
  const filter = [chip('semua', 'All', PROYEK.length, true), ...Object.keys(STATUS).map((s) => chip(s, JAMAK[s], hitung[s]))].join('');
  const opsiTekno = TEKNO.map((x) => `<option value="${x.id}">${esc(x.nama)}</option>`).join('');

  function detail(p) {
    const st = STATUS[p.status];
    const daftarTekno = p.tekno.map((id) => `<li>${esc(namaTekno[id])}</li>`).join('');
    const poin = p.poin.length ? `<ul class="poin">${p.poin.map((x) => `<li>${esc(tt(x))}</li>`).join('')}</ul>` : '';
    let foto = '';
    if (p.kunci === 'pos') {
      foto = `<figure class="d-foto">
          <div class="bingkai">${gambar('pos', 'desk', 'ARSWORD POS cashier app: menu grid with stock badges and an empty order panel', '(min-width: 1080px) 34vw, 92vw', 'loading="lazy"')}</div>
          <figcaption>Cashier app. Demo data from a test outlet.</figcaption>
        </figure>`;
    } else if (!p.tertutup) {
      foto = `<figure class="d-foto">
          <div class="bingkai">${gambar(p.kunci, 'desk', `${p.nama} home page, captured from the live site`, '(min-width: 1080px) 34vw, 92vw', 'loading="lazy"')}</div>
          <figcaption>Live site, captured ${esc(tglUkur)}.</figcaption>
        </figure>`;
    } else {
      foto = `<div class="d-tertutup"><p>Sign-in only. There is no public screen to show.</p></div>`;
    }
    const kunjungi = p.tertutup
      ? `<p class="d-catatan">${esc(p.host)} is sign-in only.</p>`
      : `<a class="tombol terang" href="https://${p.host}/" target="_blank" rel="noopener">Visit ${esc(p.host)}${ik('luar')}</a>`;
    return `
        <div class="d-isi" id="d-${p.kunci}">
          ${foto}
          <div class="d-teks">
            <p class="d-jenis"><span class="lbl">${esc(tt(p.jenis))}</span><span class="lbl">${esc(tt(st.label))}: ${esc(tt(st.arti))}</span></p>
            <p class="d-baris">${esc(tt(p.isi))}</p>
            <p class="d-peran"><span class="lbl">My part</span>${esc(tt(p.peran))}</p>
            ${poin}
            <ul class="tekno">${daftarTekno}</ul>
            <p class="d-ukur"><span class="lbl">Measured ${esc(tglUkur)}</span>${esc(terukur(p))}</p>
            ${kunjungi}
          </div>
        </div>`;
  }

  const baris = PROYEK.map((p, i) => {
    const n = String(i + 1).padStart(2, '0');
    const st = STATUS[p.status];
    const label = `${p.host}, ${p.nama}, ${tt(p.jenis)}, ${tt(st.label)}`;
    return `
      <li class="baris" data-key="${p.kunci}" data-status="${p.status}" data-tekno="${p.tekno.join(' ')}" data-urut="${i}">
        <details name="papan">
          <summary aria-label="${esc(label)}">
            <span class="b-grid">
              <span class="no" aria-hidden="true"><i>${n[0]}</i><i>${n[1]}</i></span>
              <span class="host"><b>${esc(pendek(p.host))}</b><span>${p.host === 'arswordlab.com' ? '.com' : '.arswordlab.com'}</span></span>
              <span class="proj">${esc(p.nama)}<span class="proj-st">${esc(tt(st.label))}</span></span>
              <span class="jenis">${esc(tt(p.jenis))}</span>
              <span class="st">${esc(SINGKAT[p.status])}</span>
              <span class="hidup" data-host="${p.host}" aria-hidden="true"><i class="titik"></i><span class="ms">${PERIKSA.hosts[p.host]?.status === 200 ? 'Live' : '···'}</span></span>
              <span class="buka" aria-hidden="true">${ik('bawah')}</span>
            </span>
          </summary>
          ${detail(p)}
        </details>
      </li>`;
  }).join('');

  const legenda = Object.entries(STATUS).map(([s, x]) =>
    `<div><dt>${esc(tt(x.label))}</dt><dd>${esc(tt(x.arti))}</dd></div>`).join('');

  const papan = `
    <section class="papan" id="board" aria-labelledby="papan-h">
      <header class="p-kepala">
        <h2 id="papan-h">Live board <span>*.arswordlab.com</span></h2>
        <p class="jam" aria-label="Time in Jakarta"><span class="lbl">Jakarta</span><span class="jam-angka" aria-hidden="true"><i>0</i><i>0</i><b>:</b><i>0</i><i>0</i></span></p>
      </header>
      <div class="p-filter">
        <div class="chips" role="group" aria-label="Filter by status">${filter}</div>
        <label class="pilih-tekno"><span class="lbl">Technology</span>
          <select data-tekno-pilih aria-label="Filter by technology"><option value="">Any</option>${opsiTekno}</select>
          ${ik('bawah', 'ik panah-pilih')}
        </label>
      </div>
      <div class="p-kolom" aria-hidden="true">
        <span class="lbl">No.</span><span class="lbl">Host</span><span class="lbl k-proj">Project</span><span class="lbl k-jenis">Type</span><span class="lbl k-st">Status</span><span class="lbl k-hidup">Live</span><span></span>
      </div>
      <ol class="daftar">${baris}
      </ol>
      <footer class="p-kaki">
        <p class="ringkas" aria-live="polite">${hidup} of ${PROYEK.length} answered on ${esc(tglUkur)}. Your browser checks them again when the board is in view.</p>
        <button class="tombol kecil terang" type="button" data-cek-ulang data-suara="tekan">${ik('ulang')}<span>Check again</span></button>
      </footer>
    </section>`;

  // ---- karya unggulan --------------------------------------------------------------------------------------------
  const tiket = unggulan.map((p, i) => {
    const st = STATUS[p.status];
    const poin = p.poin.length ? `<ul class="poin">${p.poin.map((x) => `<li>${esc(tt(x))}</li>`).join('')}</ul>` : '';
    let foto;
    if (p.kunci === 'pos') {
      foto = `<div class="t-panggung ada-kedua">
          <div class="t-layar">${gambar('pos', 'desk', 'ARSWORD POS cashier app on a tablet: menu grid with photos, prices and stock', '(min-width: 1080px) 46vw, 92vw', 'loading="lazy"')}</div>
          <div class="t-layar t-kedua">${gambar('pos', 'desk-1', 'ARSWORD POS owner dashboard: daily summary with sales by hour and payment methods', '(min-width: 1080px) 22vw, 46vw', 'loading="lazy"')}</div>
        </div>
        <figcaption>Cashier app and owner dashboard. Demo data from a test outlet.</figcaption>`;
    } else {
      foto = `<div class="t-panggung ada-hp">
          <div class="t-layar">${gambar(p.kunci, 'desk', `${p.nama} home page on a laptop screen, captured from the live site`, '(min-width: 1080px) 46vw, 92vw', 'loading="lazy"')}</div>
          <div class="t-hp">${gambar(p.kunci, 'hp', `${p.nama} on a phone, captured from the live site`, '(min-width: 1080px) 11vw, 28vw', 'loading="lazy"')}</div>
        </div>
        <figcaption>Live site on desktop and phone, captured ${esc(tglUkur)}.</figcaption>`;
    }
    return `
      <article class="tiket${i % 2 ? ' balik' : ''}" aria-labelledby="t-${p.kunci}">
        <figure class="t-foto">${foto}</figure>
        <div class="t-perforasi" aria-hidden="true"></div>
        <div class="t-teks">
          <dl class="t-medan">
            <div><dt class="lbl">Host</dt><dd>${esc(p.host)}</dd></div>
            <div><dt class="lbl">Type</dt><dd>${esc(tt(p.jenis))}</dd></div>
            <div><dt class="lbl">Status</dt><dd>${esc(tt(st.label))}</dd></div>
            <div><dt class="lbl">Year</dt><dd>${p.tahun}</dd></div>
          </dl>
          <h3 id="t-${p.kunci}">${esc(p.nama)}</h3>
          <p class="t-isi">${esc(tt(p.isi))}</p>
          <p class="t-peran"><span class="lbl">My part</span>${esc(tt(p.peran))}</p>
          ${poin}
          <ul class="tekno tekno-terang">${p.tekno.map((id) => `<li>${esc(namaTekno[id])}</li>`).join('')}</ul>
          <p class="t-ukur"><span class="lbl">Measured ${esc(tglUkur)}</span>${esc(terukur(p))}</p>
          <a class="tombol garis" href="https://${p.host}/" target="_blank" rel="noopener">Visit ${esc(p.host)}${ik('luar')}</a>
        </div>
      </article>`;
  }).join('');

  // ---- matriks teknologi -----------------------------------------------------------------------------------------
  const kepalaHost = PROYEK.map((p) => `<th scope="col"><span>${esc(pendek(p.host))}</span></th>`).join('');
  const sel = (ya, host) => `<td${ya ? ' class="ya"' : ''}><i></i><span class="sr">${ya ? `${esc(host)}: yes` : ''}</span></td>`;
  const barisTekno = TEKNO.map((x) => {
    const n = PROYEK.filter((p) => p.tekno.includes(x.id)).length;
    return `<tr data-tekno="${x.id}">
        <th scope="row"><button type="button" class="t-pilih" data-pilih-tekno="${x.id}" data-suara="tekan">${esc(x.nama)}</button></th>
        <td class="jumlah">${n}</td>
        ${PROYEK.map((p) => sel(p.tekno.includes(x.id), p.host)).join('')}
      </tr>`;
  }).join('');
  const barisCsp = `<tr class="ukur">
        <th scope="row"><span>CSP header sent<small>measured ${esc(tglUkur)}</small></span></th>
        <td class="jumlah">${adaCsp.length}</td>
        ${PROYEK.map((p) => sel(!!PERIKSA.hosts[p.host]?.headers?.['content-security-policy'], p.host)).join('')}
      </tr>`;

  const matriks = `
    <section class="bagian matriks" id="stack" aria-labelledby="matriks-h">
      <div class="lebar">
        <div class="judul-bagian">
          <h2 id="matriks-h">What runs where.</h2>
          <p>Fifteen technologies, each in production on at least one of the 18 hosts. Pick one to filter the board. The last row is measured, not claimed: ${adaCsp.length} of ${PROYEK.length} hosts send a Content-Security-Policy header.</p>
        </div>
        <div class="tabel-bungkus">
          <table>
            <caption class="sr">Technologies used per host on arswordlab.com</caption>
            <thead><tr><th scope="col" class="sudut"><span class="lbl">Technology</span></th><th scope="col" class="jumlah"><span class="lbl">Hosts</span></th>${kepalaHost}</tr></thead>
            <tbody>${barisTekno}${barisCsp}</tbody>
          </table>
        </div>
      </div>
    </section>`;

  // ---- pengalaman ------------------------------------------------------------------------------------------------
  const riwayat = [...PENGALAMAN, ...PENDIDIKAN].map((x) => `
        <li>
          <span class="r-waktu">${esc(tt(x.waktu))}</span>
          <div class="r-judul"><b>${esc(tt(x.judul))}</b><span>${esc(x.tempat)}</span></div>
          <p>${esc(tt(x.isi))}</p>
        </li>`).join('') + `
        <li>
          <span class="r-waktu">Ongoing</span>
          <div class="r-judul"><b>Offensive security practice</b><span>HackTheBox, @${esc(PROFIL.htb)}</span></div>
          <p>Labs and challenges outside class and the internship.</p>
        </li>`;

  // ---- kontak ----------------------------------------------------------------------------------------------------
  const kontak = `
    <section class="panggilan" id="contact" aria-labelledby="kontak-h">
      <div class="lebar k-isi">
        <div class="k-judul">
          <h2 id="kontak-h">Hiring for a <span class="utuh">full-stack</span> role?</h2>
          <p>${esc(tt(PROFIL.terbuka))} Based in ${esc(tt(PROFIL.kota))}.</p>
        </div>
        <ul class="k-papan">
          <li><span class="lbl">Email</span><span class="k-nilai">${esc(PROFIL.email)}</span>
            <span class="k-aksi"><button class="tombol kecil terang" type="button" data-salin="${esc(PROFIL.email)}" data-suara-sentuh>${ik('salin')}<span class="teks-salin">Copy</span></button><a class="tombol kecil gelap" href="mailto:${esc(PROFIL.email)}">${ik('surat')}<span>Write</span></a></span></li>
          <li><span class="lbl">WhatsApp</span><span class="k-nilai"><span>${esc(PROFIL.waTampil)}</span></span>
            <span class="k-aksi"><a class="tombol kecil gelap" href="https://wa.me/${PROFIL.wa}" target="_blank" rel="noopener"><span>Chat</span>${ik('luar')}</a></span></li>
          <li><span class="lbl">GitHub</span><span class="k-nilai">github.com/Swordekel</span>
            <span class="k-aksi"><a class="tombol kecil gelap" href="${esc(PROFIL.github)}" target="_blank" rel="noopener"><span>Open</span>${ik('luar')}</a></span></li>
          <li><span class="lbl">CV</span><span class="k-nilai">PDF, 2 pages</span>
            <span class="k-aksi"><a class="tombol kecil terang" href="${esc(PROFIL.cv)}" download data-suara="tekan">${ik('unduh')}<span>Download</span></a></span></li>
        </ul>
      </div>
    </section>`;

  return `<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Sword Ekel · Full-stack developer</title>
<meta name="description" content="Full-stack developer and cyber security student at BINUS University. 18 live websites and web apps on arswordlab.com, from client sites to a point-of-sale system.">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#E8E9EB">
<meta name="color-scheme" content="light">
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:; font-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self' https://arswordlab.com https://*.arswordlab.com; object-src 'none'; base-uri 'none'; form-action 'none'">
<meta name="referrer" content="strict-origin-when-cross-origin">
<link rel="icon" href="${aset('boarding/ikon.svg')}" type="image/svg+xml">
<link rel="preload" href="/font/boarding/sofia-sans-condensed-850.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/font/boarding/sofia-sans-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/font/boarding/b612-mono-normal-1.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${aset('boarding/gaya.css')}">
<script type="module" src="${aset('boarding/main.js')}"></script>
</head>
<body>
${IKON}
<a class="lompat" href="#board">Skip to the live board</a>
<header class="mast">
  <div class="lebar mast-isi">
    <a class="mast-nama" href="#top" aria-label="Sword Ekel, back to top">Sword Ekel</a>
    <nav class="mast-nav" aria-label="Sections">
      <a href="#board">Board</a><a href="#work">Work</a><a href="#stack">Stack</a><a href="#experience">Experience</a><a href="#contact">Contact</a>
    </nav>
    <div class="mast-aksi">
      <a class="mast-surel" href="mailto:${esc(PROFIL.email)}" aria-label="Email ${esc(PROFIL.nama)}">${ik('surat')}</a>
      <button class="bunyi" type="button" aria-pressed="true" data-bunyi>${ik('bunyi', 'ik ik-bunyi')}<span>Sound</span></button>
      <a class="tombol tinta kecil" href="${esc(PROFIL.cv)}" download data-suara="tekan">${ik('unduh')}<span>CV</span></a>
    </div>
  </div>
</header>
<main id="top">
  <section class="gerbang lebar" aria-label="Sword Ekel, pass and live board">
    ${pass}
    ${papan}
  </section>
  <section class="legenda lebar" aria-label="What the status labels mean">
    <dl>${legenda}</dl>
  </section>
  <section class="bagian karya" id="work" aria-labelledby="karya-h">
    <div class="lebar">
      <div class="judul-bagian">
        <h2 id="karya-h">Start with these four.</h2>
        <p>Two products I run and two client projects, all live today. The other fourteen open from the board above.</p>
      </div>
      ${tiket}
    </div>
  </section>
  ${matriks}
  <section class="bagian riwayat" id="experience" aria-labelledby="riwayat-h">
    <div class="lebar">
      <div class="judul-bagian">
        <h2 id="riwayat-h">Experience and education.</h2>
      </div>
      <ol class="r-daftar">${riwayat}
      </ol>
    </div>
  </section>
  ${kontak}
</main>
<footer class="kaki">
  <div class="lebar kaki-isi">
    <p>© 2026 ${esc(PROFIL.nama)}. Every project on this page is live on arswordlab.com.</p>
    <p class="lbl">Measured ${esc(tglUkur)}</p>
  </div>
</footer>
<p class="sr" aria-live="polite" data-umum></p>
</body>
</html>
`;
}
