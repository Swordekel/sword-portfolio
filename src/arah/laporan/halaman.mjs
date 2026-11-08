// Arah A, "Laporan Asesmen": portfolio sebagai laporan asesmen atas pekerjaan Sword Ekel.
// Sampul (ringkasan eksekutif untuk HR) -> 1 Lingkup (18 host) -> 2 Temuan (bukti per proyek) -> Plat A
// (semua tangkapan) -> 3 Bukti teknologi -> 4 Latar belakang -> 5 Kesimpulan dan kontak.
// Semua fakta dari src/data.mjs, tangkapan (src/info, src/media.json) dan header terukur (src/periksa.json).
export const BAHASA = ['en'];

const URUT_STATUS = ['produk', 'klien', 'usulan', 'konsep', 'kuliah'];
const UTAMA = ['pos', 'dailytask', 'arswordlab', 'eskrim-uncle-ren'];
const HEADER = [
  ['content-security-policy', 'Content-Security-Policy', 'CSP'],
  ['strict-transport-security', 'Strict-Transport-Security', 'HSTS'],
  ['x-content-type-options', 'X-Content-Type-Options', 'X-Content-Type'],
  ['referrer-policy', 'Referrer-Policy', 'Referrer-Policy'],
  ['permissions-policy', 'Permissions-Policy', 'Permissions-Policy'],
  ['x-frame-options', 'X-Frame-Options', 'X-Frame-Options'],
];
// lapisan yang disentuh tiap proyek, diturunkan dari daftar teknologinya (2 = dibangun, 1 = sebagian, 0 = tidak)
const LAPIS = [
  ['Interface', () => 2],
  ['Graphics', (p) => (p.tekno.includes('webgl') || p.tekno.includes('three') ? 2 : 0)],
  ['Server', (p) => (['d1', 'r2', 'rt', 'bayar', 'ai'].some((x) => p.tekno.includes(x)) || p.kunci === 'seraphine' ? 2 : 1)],
  ['Data', (p) => (p.tekno.includes('d1') || p.tekno.includes('r2') ? 2 : 0)],
  ['Devices', (p) => (p.tekno.includes('android') || p.tekno.includes('push') ? 2 : 0)],
];
const ARTI_LAPIS = ['not part of this project', 'served from the edge, no app logic', 'built'];
const HALAMAN = [
  ['sampul', 'Summary'],
  ['lingkup', '1. Scope'],
  ['temuan', '2. Findings'],
  ['plat', 'Plate A'],
  ['teknologi', '3. Technology'],
  ['latar', '4. Background'],
  ['kontak', '5. Contact'],
];
const NOMOR_HAL = { sampul: 1, lingkup: 2, temuan: 3, teknologi: 4, latar: 5, kontak: 6 };
const TOTAL_HAL = 6;

const SPRITE = `<svg class="sprite" aria-hidden="true" focusable="false">
  <symbol id="i-unduh" viewBox="0 0 20 20"><path d="M10 3.5v9M6 9l4 4 4-4M4 16h12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-surat" viewBox="0 0 20 20"><rect x="3" y="5" width="14" height="10.5" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M3.5 6l6.5 5 6.5-5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></symbol>
  <symbol id="i-salin" viewBox="0 0 20 20"><rect x="7" y="7" width="9.5" height="9.5" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M13 4.5v-.5A1 1 0 0 0 12 3H4.5A1.5 1.5 0 0 0 3 4.5V12a1 1 0 0 0 1 1h.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></symbol>
  <symbol id="i-keluar" viewBox="0 0 20 20"><path d="M7 13l7-7M8 6h6v6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-atas" viewBox="0 0 20 20"><path d="M5.5 12.5L10 8l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-bawah" viewBox="0 0 20 20"><path d="M5.5 7.5L10 12l4.5-4.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-isi" viewBox="0 0 20 20"><path d="M4 5.5h12M4 10h12M4 14.5h8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></symbol>
  <symbol id="i-cek" viewBox="0 0 20 20"><path d="M4.5 10.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-pindai" viewBox="0 0 20 20"><circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10 6.5V10l2.5 1.6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></symbol>
</svg>`;

const ikon = (id) => `<svg class="ik" aria-hidden="true"><use href="#i-${id}"/></svg>`;
const kotak = (n, judul = '') => `<i class="sq sq-${['o', 'h', 'f'][n]}"${judul ? ` title="${judul}"` : ''}></i>`;

export default function laporan(ctx) {
  const { DATA, esc, tt, aset, gambar, info, PERIKSA, MEDIA } = ctx;
  const { PROFIL, STATUS, TEKNO, PROYEK, PENGALAMAN, PENDIDIKAN } = DATA;
  const byKey = Object.fromEntries(PROYEK.map((p) => [p.kunci, p]));
  const lingkup = [...PROYEK].sort((a, b) => URUT_STATUS.indexOf(a.status) - URUT_STATUS.indexOf(b.status));
  const hitung = (s) => PROYEK.filter((p) => p.status === s).length;
  const periksa = (host) => PERIKSA.hosts[host] || {};
  const nCsp = PROYEK.filter((p) => periksa(p.host).headers?.['content-security-policy']).length;
  const tanpaCsp = PROYEK.filter((p) => !periksa(p.host).headers?.['content-security-policy']).map((p) => p.host.split('.')[0]);
  const tglUkur = new Date(PERIKSA.measured);
  const tgl = tglUkur.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' });
  const statusLabel = (p) => tt(STATUS[p.status].label);
  const tautan = (p) => `https://${p.host}/`;
  const mb = (b) => (b / 1e6).toFixed(2).replace(/0$/, '') + ' MB';
  const fonts = (f) => (f || []).filter((x) => !/fallback/i.test(x)).map((x) => x.replace(/ Variable$/, ''));
  const nGl = (c) => (c || []).filter((x) => /^webgl/.test(x)).length;
  const tek = Object.fromEntries(TEKNO.map((x) => [x.id, x.nama]));
  const folio = (id) => `<footer class="folio"><span>${esc(PROFIL.nama)} · Assessment of work · Public</span><span>Page ${NOMOR_HAL[id]} of ${TOTAL_HAL}</span></footer>`;

  // ---- sampul ----------------------------------------------------------------------------------------------------
  const ringkas = [
    { judul: 'Ships and runs production sites.', isi: `All ${PROYEK.length} hosts answered on ${tgl}: ${hitung('produk')} products, ${hitung('klien')} client builds, ${hitung('usulan')} design proposals, ${hitung('konsep')} concepts and ${hitung('kuliah')} course project.`, nilai: [2, 2, 2], arti: 'verified' },
    { judul: 'Works across the whole stack.', isi: 'Interfaces and WebGL, APIs on Cloudflare Workers, SQL and file storage, push notifications and an Android cashier app. The cashier app and a staff scheduling app are in daily use at two shops.', nilai: [2, 2, 2], arti: 'verified' },
    { judul: 'Security headers by default.', isi: `${nCsp} of ${PROYEK.length} hosts send a Content-Security-Policy. Not yet: ${tanpaCsp.join(' and ')}.`, nilai: [2, 2, 1], arti: 'partly verified' },
  ];
  const strip = lingkup.map((p) => `<i class="sq sq-o" data-host="${p.host}" title="${p.host}"></i>`).join('');
  const sampul = `
  <section class="lembar sampul" id="sampul" data-hal="sampul" aria-labelledby="h-nama">
    <div class="klasifikasi">
      <span class="kls">Public</span>
      <span>Assessment of work</span>
      <span class="kls-r">Prepared for hiring teams</span>
    </div>
    <div class="sampul-grid">
      <div class="sampul-kiri">
        <h1 class="nama" id="h-nama"><span>Sword</span> <span>Ekel</span></h1>
        <p class="peran">${esc(tt(PROFIL.peran))}</p>
        <p class="lead">Cyber security student at BINUS University. I design, build and run websites and web apps, from the first sketch to production.</p>
        <div class="aksi">
          <a class="tombol utama" href="${PROFIL.cv}" download data-suara="tekan">${ikon('unduh')}<span>Download CV</span></a>
          <a class="tombol" href="mailto:${PROFIL.email}" data-suara="tekan">${ikon('surat')}<span>${esc(PROFIL.email)}</span></a>
        </div>
      </div>
      <aside class="ringkasan" aria-labelledby="h-ringkasan">
        <h2 id="h-ringkasan">Executive summary</h2>
        <ol>
          ${ringkas.map((r, i) => `<li>
            <div class="temuan-kepala"><span class="no">${i + 1}</span><h3>${r.judul}</h3><span class="nilai" role="img" aria-label="Evidence: ${r.arti}">${r.nilai.map((n) => kotak(n)).join('')}</span></div>
            <p>${r.isi}</p>
          </li>`).join('')}
        </ol>
        <p class="legenda">${kotak(2)} verified ${kotak(1)} partial ${kotak(0)} none</p>
      </aside>
      <table class="kontrol">
        <caption class="sr-only">Document control</caption>
        <tbody>
          <tr><th scope="row">Subject</th><td>${esc(PROFIL.nama)}, full-stack developer, ${esc(tt(PROFIL.kota))}</td></tr>
          <tr><th scope="row">Scope</th><td><div class="lingkup-baris"><span>${PROYEK.length} live hosts on arswordlab.com</span><button class="tombol kecil" type="button" data-cek>${ikon('pindai')}<span data-cek-label>Run live check</span></button></div><div class="strip" aria-hidden="true">${strip}</div><p class="cek-status" data-cek-status aria-live="polite">Not checked from your browser yet.</p></td></tr>
          <tr><th scope="row">Method</th><td>Each host opened, captured and measured on ${tgl}</td></tr>
          <tr><th scope="row">Prepared by</th><td>${esc(PROFIL.nama)}. A self-assessment: every item can be checked.</td></tr>
          <tr><th scope="row">Classification</th><td>Public · version 1.0</td></tr>
        </tbody>
      </table>
      <div class="verif" data-verif>
        <span class="verif-label">Verification</span>
        <p class="verif-teks" data-verif-teks>Not stamped yet. <button class="tautan-tombol" type="button" data-cek>Run the live check</button> to test all ${PROYEK.length} hosts from your own browser.</p>
        <div class="cap" data-cap hidden aria-hidden="true"></div>
      </div>
    </div>
    ${folio('sampul')}
  </section>`;

  // ---- 1 lingkup -------------------------------------------------------------------------------------------------
  const barisLingkup = lingkup.map((p) => {
    const c = periksa(p.host);
    const ke = UTAMA.includes(p.kunci) ? `#f-${p.kunci}` : `#h-${p.kunci}`;
    return `<tr data-host="${p.host}">
      <td class="host"><a href="${ke}" data-suara="tekan">${esc(p.host)}</a></td>
      <td class="apa"><b>${esc(p.nama)}</b><span>${esc(tt(p.jenis))}</span></td>
      <td class="st st-${p.status}">${esc(statusLabel(p))}</td>
      <td class="num">${p.tahun}</td>
      <td class="num resp"><span class="ms" data-ms="${c.ms ?? ''}">${c.ms ?? '–'}</span><span class="u"> ms</span><span class="kapan" data-kapan>${c.status === 200 ? 'measured' : 'no answer'}</span></td>
      <td class="csp">${kotak(c.headers?.['content-security-policy'] ? 2 : 0, c.headers?.['content-security-policy'] ? 'sends CSP' : 'no CSP')}<span class="sr-only">${c.headers?.['content-security-policy'] ? 'Sends' : 'Does not send'} a Content-Security-Policy</span></td>
      <td class="buka">${p.tertutup ? '<span class="tutup">sign-in only</span>' : `<a href="${tautan(p)}" target="_blank" rel="noopener" aria-label="Open ${esc(p.host)}" data-suara="tekan">Open${ikon('keluar')}</a>`}</td>
    </tr>`;
  }).join('');
  const lingkupSec = `
  <section class="lembar" id="lingkup" data-hal="lingkup" aria-labelledby="h-lingkup">
    <h2 class="judul-bab" id="h-lingkup"><span class="nb">1.</span> Scope</h2>
    <p class="lead-bab">Every host below is a site or app I built, deployed on Cloudflare and still run. The status says what each one is, so nothing is presented as more than it is.</p>
    <div class="tabel-wadah">
      <table class="tabel lingkup">
        <caption class="sr-only">All ${PROYEK.length} hosts in scope, with status, year, response time and Content-Security-Policy</caption>
        <thead><tr><th scope="col">Host</th><th scope="col">What it is</th><th scope="col">Status</th><th scope="col" class="num">Year</th><th scope="col" class="num">Response</th><th scope="col">CSP</th><th scope="col"><span class="sr-only">Link</span></th></tr></thead>
        <tbody>${barisLingkup}</tbody>
      </table>
    </div>
    <div class="bawah-tabel">
      <p class="catatan">Response: time to first answer, measured from Jakarta on ${tgl}. <button class="tautan-tombol" type="button" data-cek>Run the check again from your browser</button>.</p>
      <dl class="legenda-status">
        ${URUT_STATUS.map((s) => `<div><dt>${esc(tt(STATUS[s].label))}</dt><dd>${esc(tt(STATUS[s].arti))}.</dd></div>`).join('')}
      </dl>
    </div>
    ${folio('lingkup')}
  </section>`;

  // ---- 2 temuan --------------------------------------------------------------------------------------------------
  const ukur = (p) => {
    const c = periksa(p.host);
    const d = info(p.kunci)?.desk;
    const baris = [];
    baris.push(['Response', c.ms ? `${c.ms} ms, HTTP ${c.status}` : 'no answer']);
    if (d) {
      baris.push(['First load', `${mb(d.transferBytes)}, ${d.requests} requests`]);
      const gl = nGl(d.contexts);
      baris.push(['Canvas', gl ? `${gl} WebGL context${gl > 1 ? 's' : ''}` : 'no WebGL']);
      const f = fonts(d.fonts);
      if (f.length) baris.push(['Typefaces', f.join(', ')]);
    }
    return `<table class="ukur"><caption class="sr-only">Measured facts for ${esc(p.host)}</caption><tbody>
      ${baris.map(([a, b]) => `<tr><th scope="row">${a}</th><td>${esc(b)}</td></tr>`).join('')}
      <tr><th scope="row">Headers</th><td><ul class="header">${HEADER.map(([k, n, pendek]) => `<li class="${c.headers?.[k] ? 'ya' : 'tidak'}" title="${n}">${kotak(c.headers?.[k] ? 2 : 0)}<span aria-hidden="true">${pendek}</span><span class="sr-only">${n}: ${c.headers?.[k] ? 'sent' : 'not sent'}</span></li>`).join('')}</ul></td></tr>
    </tbody></table>`;
  };
  const lapis = (p) => `<ul class="lapis" aria-label="Layers built">${LAPIS.map(([n, f]) => { const v = f(p); return `<li>${kotak(v)}<span>${n}</span><span class="sr-only">: ${ARTI_LAPIS[v]}</span></li>`; }).join('')}</ul>`;
  const stack = (p) => `<ul class="stack">${p.tekno.map((t) => `<li>${esc(tek[t])}</li>`).join('')}</ul>`;
  const fig = (p, shot, no, cap, alt, sizes, cls = '') => {
    if (!MEDIA[p.kunci]?.[shot]) return '';
    return `<figure class="fig ${cls}">${gambar(p.kunci, shot, alt, sizes, 'loading="lazy"')}<figcaption>${no ? `<b>Fig. ${no}</b> ` : ''}${cap}</figcaption></figure>`;
  };
  const altRumah = (p) => `Home page of ${p.host}${info(p.kunci)?.desk?.title ? `, “${info(p.kunci).desk.title}”` : ''}, captured ${tgl}`;
  const figUtama = {
    pos: (p, n) => fig(p, 'desk', `${n}a`, 'Cashier app on a tablet. Demo outlet with test data, September 2026.', 'ARSWORD POS cashier screen: menu of ice-cream, fried banana and rujak with prices and stock counts, an empty new-order panel on the right. Demo outlet data.', '(max-width: 900px) 100vw, 60vw')
      + fig(p, 'desk-1', `${n}b`, 'Owner dashboard: daily summary. Demo data.', 'ARSWORD POS owner dashboard: revenue, transactions, average per transaction, hourly sales chart and payment methods, with demo figures.', '(max-width: 900px) 100vw, 30vw', 'kecil'),
    dailytask: (p, n) => fig(p, 'desk', `${n}a`, 'Sign-in page. Staff tasks stay private, so only the public page is shown.', 'Daily Task sign-in page: headline "Tugas hari ini, jelas untuk semua." beside a username and password form.', '(max-width: 900px) 100vw, 60vw')
      + fig(p, 'hp', `${n}b`, 'The same page on a phone.', 'Daily Task sign-in page on a phone.', '(max-width: 900px) 50vw, 16vw', 'hp'),
    arswordlab: (p, n) => fig(p, 'desk', `${n}a`, `arswordlab.com home, captured ${tgl}.`, altRumah(p), '(max-width: 900px) 100vw, 60vw')
      + fig(p, 'desk-1', `${n}b`, 'Further down the home page.', 'arswordlab.com home page, a section further down.', '(max-width: 900px) 100vw, 30vw', 'kecil'),
    'eskrim-uncle-ren': (p, n) => fig(p, 'desk', `${n}a`, `Home page, captured at 14:00 WIB so the badge reads open.`, altRumah(p), '(max-width: 900px) 100vw, 60vw')
      + fig(p, 'hp', `${n}b`, 'On a phone.', 'Es Krim Uncle Ren home page on a phone.', '(max-width: 900px) 50vw, 16vw', 'hp'),
  };
  const temuan = UTAMA.map((k, i) => {
    const p = byKey[k];
    const n = `2.${i + 1}`;
    return `<article class="temuan" id="f-${k}" aria-labelledby="t-${k}">
      <header class="temuan-judul">
        <span class="no">${n}</span>
        <h3 id="t-${k}">${esc(p.nama)}</h3>
        <dl class="meta"><div><dt>Host</dt><dd><a href="${tautan(p)}" target="_blank" rel="noopener" data-suara="tekan">${esc(p.host)}${ikon('keluar')}</a></dd></div><div><dt>Status</dt><dd>${esc(statusLabel(p))}</dd></div><div><dt>Type</dt><dd>${esc(tt(p.jenis))}</dd></div><div><dt>Year</dt><dd class="num">${p.tahun}</dd></div></dl>
      </header>
      <div class="temuan-isi">
        <div class="figs">${figUtama[k](p, n)}</div>
        <div class="teks">
          <p class="isi">${esc(tt(p.isi))}</p>
          <h4>My role</h4><p>${esc(tt(p.peran))}</p>
          ${p.poin.length ? `<h4>Observations</h4><ul class="poin">${p.poin.map((x) => `<li>${esc(tt(x))}</li>`).join('')}</ul>` : ''}
          <h4>Layers</h4>${lapis(p)}
          <h4>Stack</h4>${stack(p)}
          <h4>Measured</h4>${ukur(p)}
        </div>
      </div>
    </article>`;
  }).join('');
  const lain = lingkup.filter((p) => !UTAMA.includes(p.kunci));
  const barisLain = lain.map((p) => {
    const ada = MEDIA[p.kunci];
    return `<details class="host-lain" id="h-${p.kunci}">
      <summary data-suara-sentuh>
        <span class="host">${esc(p.host)}</span>
        <span class="apa"><b>${esc(p.nama)}</b><span>${esc(tt(p.baris))}</span></span>
        <span class="st">${esc(statusLabel(p))}</span>
        <span class="num">${p.tahun}</span>
        <span class="buka-tanda" aria-hidden="true">${ikon('bawah')}</span>
      </summary>
      <div class="lain-isi">
        ${ada ? `<div class="figs">${fig(p, 'desk', '', `Home page, captured ${tgl}.`, altRumah(p), '(max-width: 900px) 100vw, 46vw')}${fig(p, 'hp', '', 'On a phone.', `${p.nama} home page on a phone.`, '(max-width: 900px) 40vw, 12vw', 'hp')}</div>` : '<p class="tanpa-gambar">Sign-in only. No public screens to show.</p>'}
        <div class="teks">
          <p class="isi">${esc(tt(p.isi))}</p>
          <h4>My role</h4><p>${esc(tt(p.peran))}</p>
          <h4>Layers</h4>${lapis(p)}
          <h4>Stack</h4>${stack(p)}
          <h4>Measured</h4>${ukur(p)}
          ${p.tertutup ? '' : `<p><a class="tombol kecil" href="${tautan(p)}" target="_blank" rel="noopener" data-suara="tekan">Open ${esc(p.host)}${ikon('keluar')}</a></p>`}
        </div>
      </div>
    </details>`;
  }).join('');
  const temuanSec = `
  <section class="lembar" id="temuan" data-hal="temuan" aria-labelledby="h-temuan">
    <h2 class="judul-bab" id="h-temuan"><span class="nb">2.</span> Findings</h2>
    <p class="lead-bab">Four hosts carry most of the evidence: two products of my own, a staff app used every day, and a client site released to Google. The other fourteen follow in 2.5.</p>
    ${temuan}
    <section class="lain" aria-labelledby="h-lain">
      <h3 class="sub-bab" id="h-lain"><span class="no">2.5</span> Other hosts in scope</h3>
      <p class="catatan">Open a row for its capture, role, stack and measurements.</p>
      <div class="lain-daftar">${barisLain}</div>
    </section>
    ${folio('temuan')}
  </section>`;

  // ---- plat A (satu-satunya bentang penuh) --------------------------------------------------------------------------
  const adaGambar = lingkup.filter((p) => MEDIA[p.kunci]?.desk);
  const plat = `
  <section class="plat" id="plat" data-hal="plat" aria-labelledby="h-plat">
    <div class="plat-grid">
      ${adaGambar.map((p) => `<a class="plat-sel" href="${tautan(p)}" target="_blank" rel="noopener" data-suara="tekan" aria-label="Open ${esc(p.host)}">
        ${gambar(p.kunci, 'desk', '', '(max-width: 600px) 46vw, (max-width: 1100px) 24vw, 16vw', 'loading="lazy"')}
        <span>${esc(p.host.replace('.arswordlab.com', ''))}</span>
      </a>`).join('')}
      <div class="plat-cap">
        <h2 id="h-plat">Plate A</h2>
        <p>The ${adaGambar.length} public hosts as captured in Chrome on ${tgl}, desktop 1440 × 900. The studio's chat inbox is sign-in only and not shown.</p>
      </div>
    </div>
  </section>`;

  // ---- 3 teknologi -----------------------------------------------------------------------------------------------
  const pakai = TEKNO.map((t) => ({ ...t, host: lingkup.filter((p) => p.tekno.includes(t.id)) })).sort((a, b) => b.host.length - a.host.length);
  const stripDari = (cocok) => lingkup.map((p) => `<i class="sq ${cocok(p) ? 'sq-f' : 'sq-o'}" title="${p.host}"></i>`).join('');
  const barisTek = pakai.map((t) => `<details class="tek">
      <summary data-suara-sentuh><span class="tek-nama">${esc(t.nama)}</span><span class="num tek-n">${t.host.length}<span> / ${PROYEK.length}</span></span><span class="strip" aria-hidden="true">${stripDari((p) => t.host.includes(p))}</span><span class="buka-tanda" aria-hidden="true">${ikon('bawah')}</span></summary>
      <p class="tek-host">${t.host.map((p) => `<span>${esc(p.host)}</span>`).join('')}</p>
    </details>`).join('');
  const cspHost = lingkup.filter((p) => periksa(p.host).headers?.['content-security-policy']);
  const teknologi = `
  <section class="lembar" id="teknologi" data-hal="teknologi" aria-labelledby="h-teknologi">
    <h2 class="judul-bab" id="h-teknologi"><span class="nb">3.</span> Technology evidence</h2>
    <p class="lead-bab">Counted from the ${PROYEK.length} hosts in scope, not from a list of tools I have tried. Each square is one host, in the order of the scope table. Open a row to see which hosts.</p>
    <div class="tek-daftar">
      <div class="tek-kepala" aria-hidden="true"><span>Technology</span><span class="num">Hosts</span><span>Where it is used</span></div>
      ${barisTek}
      <details class="tek ukur-tek">
        <summary data-suara-sentuh><span class="tek-nama">Content-Security-Policy header <em>measured</em></span><span class="num tek-n">${cspHost.length}<span> / ${PROYEK.length}</span></span><span class="strip" aria-hidden="true">${stripDari((p) => cspHost.includes(p))}</span><span class="buka-tanda" aria-hidden="true">${ikon('bawah')}</span></summary>
        <p class="tek-host">${cspHost.map((p) => `<span>${esc(p.host)}</span>`).join('')}</p>
      </details>
    </div>
    ${folio('teknologi')}
  </section>`;

  // ---- 4 latar belakang ------------------------------------------------------------------------------------------
  const riwayat = [
    ...PENGALAMAN.map((x) => ({ ...x, jenis: 'Experience' })),
    ...PENDIDIKAN.map((x) => ({ ...x, jenis: 'Education' })),
    { waktu: ['Ongoing', 'Berjalan'], judul: ['Offensive security practice', 'Latihan offensive security'], tempat: `HackTheBox, @${PROFIL.htb}`, isi: ['Labs and challenges, alongside the internship.', 'Lab dan tantangan, berjalan bersama magang.'], jenis: 'Practice' },
  ];
  const latar = `
  <section class="lembar" id="latar" data-hal="latar" aria-labelledby="h-latar">
    <h2 class="judul-bab" id="h-latar"><span class="nb">4.</span> Background</h2>
    <div class="latar-grid">
      <figure class="potret">
        <img src="/media/foto/potret-abu-720.webp" srcset="/media/foto/potret-abu-400.webp 400w, /media/foto/potret-abu-720.webp 720w" sizes="(max-width: 700px) 50vw, 240px" width="720" height="720" alt="Portrait of Sword Ekel in a dark blazer and white shirt." loading="lazy" decoding="async">
        <figcaption>${esc(PROFIL.nama)} · ${esc(tt(PROFIL.kota))}</figcaption>
      </figure>
      <table class="tabel riwayat">
        <caption class="sr-only">Experience, education and practice</caption>
        <thead><tr><th scope="col">Period</th><th scope="col">Role</th><th scope="col">Notes</th></tr></thead>
        <tbody>${riwayat.map((r) => `<tr><td class="waktu">${esc(tt(r.waktu))}</td><td><b>${esc(tt(r.judul))}</b><span>${esc(r.tempat)}</span><em>${r.jenis}</em></td><td>${esc(tt(r.isi))}</td></tr>`).join('')}</tbody>
      </table>
    </div>
    ${folio('latar')}
  </section>`;

  // ---- 5 kesimpulan dan kontak ---------------------------------------------------------------------------------------
  const kontak = `
  <section class="lembar" id="kontak" data-hal="kontak" aria-labelledby="h-kontak">
    <h2 class="judul-bab" id="h-kontak"><span class="nb">5.</span> Conclusion and contact</h2>
    <div class="kontak-grid">
      <div class="simpul">
        <p class="simpul-teks">The evidence shows a developer who takes a site from the first sketch to a running product, and keeps it running: ${PROYEK.length} hosts live, two of them used by real staff every day.</p>
        <p>${esc(tt(PROFIL.terbuka))}</p>
        <div class="aksi">
          <a class="tombol utama" href="${PROFIL.cv}" download data-suara="tekan">${ikon('unduh')}<span>Download CV</span></a>
          <a class="tombol" href="mailto:${PROFIL.email}" data-suara="tekan">${ikon('surat')}<span>Email me</span></a>
        </div>
      </div>
      <table class="tabel kanal">
        <caption class="sr-only">Contact channels</caption>
        <tbody>
          <tr><th scope="row">Email</th><td><a href="mailto:${PROFIL.email}" data-suara="tekan">${esc(PROFIL.email)}</a> <button class="ikon-tombol" type="button" data-salin="${PROFIL.email}" aria-label="Copy email address" data-sunyi>${ikon('salin')}<span class="salin-ok" aria-hidden="true">Copied</span></button></td></tr>
          <tr><th scope="row">WhatsApp</th><td><a href="https://wa.me/${PROFIL.wa}" target="_blank" rel="noopener" data-suara="tekan"><span>${esc(PROFIL.waTampil)}</span></a></td></tr>
          <tr><th scope="row">GitHub</th><td><a href="${PROFIL.github}" target="_blank" rel="noopener" data-suara="tekan">github.com/Swordekel</a></td></tr>
          <tr><th scope="row">HackTheBox</th><td>@${esc(PROFIL.htb)}</td></tr>
          <tr><th scope="row">CV</th><td><a href="${PROFIL.cv}" download data-suara="tekan">CV_Sword_Christ_Imanuel_Ekel.pdf</a></td></tr>
        </tbody>
      </table>
    </div>
    <div class="ttd">
      <div><span class="ttd-label">Prepared by</span><span class="ttd-nama">${esc(PROFIL.namaLengkap)}</span><span>${esc(tt(PROFIL.kota))} · ${tgl}</span></div>
      <div><span class="ttd-label">Verification</span><span data-verifikasi>Not run from your browser yet. <button class="tautan-tombol" type="button" data-cek>Run live check</button></span></div>
    </div>
    <p class="salin-status sr-only" aria-live="polite" data-salin-status></p>
    ${folio('kontak')}
  </section>`;

  const isiMenu = HALAMAN.map(([id, n]) => `<li><a href="#${id}" data-suara="tekan">${n}</a></li>`).join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Sword Ekel · Assessment of work · Full-stack developer</title>
<meta name="description" content="Sword Ekel, full-stack developer and cyber security student at BINUS University. ${PROYEK.length} live sites and apps on arswordlab.com, with evidence you can check yourself.">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#e1e4e6">
<meta name="color-scheme" content="light">
<meta name="format-detection" content="telephone=no, date=no, address=no">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self'; connect-src 'self' https://arswordlab.com https://*.arswordlab.com; base-uri 'self'; form-action 'none'; object-src 'none'">
<link rel="preload" href="/font/laporan/public-sans-normal-0.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${aset('laporan/gaya.css')}">
<script type="module" src="${aset('laporan/main.js')}"></script>
</head>
<body>
${SPRITE}
<a class="lewati" href="#sampul">Skip to the report</a>
<header class="alat" data-alat>
  <div class="alat-kiri"><span class="dok-nama">${esc(PROFIL.nama)}</span><span class="dok-judul">Assessment of work</span></div>
  <div class="alat-tengah">
    <button class="ikon-tombol" type="button" data-hal-naik aria-label="Previous page">${ikon('atas')}</button>
    <span class="hal" aria-live="off"><span data-hal-teks>Page 1 of ${TOTAL_HAL}</span></span>
    <button class="ikon-tombol" type="button" data-hal-turun aria-label="Next page">${ikon('bawah')}</button>
    <div class="isi-menu">
      <button class="tombol kecil datar" type="button" data-menu-tombol aria-expanded="false" aria-controls="daftar-isi">${ikon('isi')}<span>Contents</span></button>
      <nav id="daftar-isi" class="daftar-isi" aria-label="Contents" hidden><ol>${isiMenu}</ol></nav>
    </div>
  </div>
  <div class="alat-kanan">
    <button class="tombol kecil datar suara" type="button" data-suara-tombol aria-pressed="true"><svg class="ik" viewBox="0 0 20 20" aria-hidden="true"><path d="M3.5 7.5h3l4-3.5v12l-4-3.5h-3z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path class="gel" d="M13.5 7.2a4 4 0 0 1 0 5.6M15.6 5.2a7 7 0 0 1 0 9.6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path class="mati" d="M13.5 7.5l5 5M18.5 7.5l-5 5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><span>Sound</span><span class="sr-only" data-suara-st> on</span></button>
    <a class="tombol kecil utama" href="${PROFIL.cv}" download data-suara="tekan">${ikon('unduh')}<span>CV</span></a>
  </div>
</header>
<main class="meja">
${sampul}
${lingkupSec}
${temuanSec}
${plat}
${teknologi}
${latar}
${kontak}
</main>
<footer class="kaki"><p>${esc(PROFIL.nama)} · Assessment of work · version 1.0 · every site in this report is live on arswordlab.com</p></footer>
</body>
</html>
`;
}
