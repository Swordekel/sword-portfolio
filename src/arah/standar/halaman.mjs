// Arah D, "Standar Premium": portfolio developer yang lazim, dikerjakan serapi mungkin.
// Satu halaman: hero (nama, kalimat pembuka, CV, email), karya pilihan besar, indeks 18 situs dengan pratinjau,
// teknologi yang benar-benar dipakai, pengalaman dan pendidikan, kontak. Bahasa Inggris saja di putaran ini.
export const BAHASA = ['en'];

const UNGGULAN = ['pos', 'arswordlab', 'dailytask', 'eskrim-uncle-ren', 'nilamerah'];

// kelompok teknologi untuk bagian "What I build with"
const KELOMPOK = [
  { nama: 'Front end', id: ['js', 'react', 'astro', 'webgl', 'three'] },
  { nama: 'Back end and cloud', id: ['workers', 'd1', 'r2', 'rt', 'push'] },
  { nama: 'Product work', id: ['bayar', 'android', 'ai', 'i18n', 'seo'] },
];

const IKON = `<svg class="sprite" aria-hidden="true" focusable="false" width="0" height="0">
  <symbol id="i-luar" viewBox="0 0 16 16"><path d="M5.5 10.5 10.5 5.5M6.5 5.5h4v4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-unduh" viewBox="0 0 16 16"><path d="M8 3v7M5 7.5 8 10.5l3-3M3.5 13h9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-bawah" viewBox="0 0 16 16"><path d="M8 3.5v9M4.5 9 8 12.5 11.5 9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-salin" viewBox="0 0 16 16"><rect x="5.5" y="5.5" width="7" height="7" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M10.5 3.5H5A1.5 1.5 0 0 0 3.5 5v5.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></symbol>
  <symbol id="i-cek" viewBox="0 0 16 16"><path d="M3.5 8.5 6.5 11.5 12.5 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-panah" viewBox="0 0 16 16"><path d="M3 8h9.5M9 4.5 12.5 8 9 11.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-naik" viewBox="0 0 16 16"><path d="M8 12.5v-9M4.5 7 8 3.5 11.5 7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-plus" viewBox="0 0 16 16"><path d="M8 3.5v9M3.5 8h9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></symbol>
  <symbol id="i-suara" viewBox="0 0 16 16"><path d="M2.5 6.2h2.3L8 3.6v8.8L4.8 9.8H2.5z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path class="gelombang" d="M10.5 6a2.8 2.8 0 0 1 0 4M12.3 4.4a5.2 5.2 0 0 1 0 7.2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path class="silang" d="M10.6 6.2l3.4 3.6M14 6.2l-3.4 3.6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></symbol>
</svg>`;

const ik = (id, kelas = 'ik') => `<svg class="${kelas}" aria-hidden="true" focusable="false"><use href="#i-${id}"/></svg>`;

export default function halaman(ctx) {
  const { DATA, esc, tt, aset, gambar, MEDIA, PERIKSA } = ctx;
  const { PROFIL, STATUS, TEKNO, PROYEK, PENGALAMAN, PENDIDIKAN } = DATA;
  const proyek = (k) => PROYEK.find((p) => p.kunci === k);
  const label = (p) => tt(STATUS[p.status].label);
  const url = (p) => `https://${p.host}/`;
  const jumlahCsp = Object.values(PERIKSA.hosts).filter((h) => h.headers && h.headers['content-security-policy']).length;
  const jumlahHost = Object.keys(PERIKSA.hosts).length;
  const tanggalUkur = new Date(PERIKSA.measured).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' });
  const waLink = `https://wa.me/${PROFIL.wa}?text=${encodeURIComponent('Hi Sword, I found your portfolio.')}`;
  const nTotal = PROYEK.length;

  // ---- karya pilihan ------------------------------------------------------------------------------------------
  const karya = UNGGULAN.map((k, i) => {
    const p = proyek(k);
    const ada = MEDIA[k] || {};
    const pertama = i === 0;
    const muat = pertama ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';
    const sizes = '(min-width: 1296px) 1200px, calc(100vw - 2 * clamp(20px, 5vw, 48px))';
    const keterangan = k === 'pos'
      ? 'Cashier app on an Android tablet, from the demo outlet (demo data).'
      : k === 'dailytask'
        ? 'Sign-in screen. Staff schedules stay private.'
        : `${esc(p.host)}, captured live on ${tanggalUkur}.`;
    const hp = ada.hp && k !== 'pos'
      ? `<div class="hp" aria-hidden="true">${gambar(k, 'hp', '', '(min-width: 900px) 200px, 0px', 'loading="lazy"')}</div>`
      : '';
    const poin = (p.poin || []).length
      ? `<ul class="poin">${p.poin.map((x) => `<li>${esc(tt(x))}</li>`).join('')}</ul>` : '';
    const tek = p.tekno.map((id) => TEKNO.find((t) => t.id === id)).filter(Boolean)
      .map((t) => `<li>${esc(t.nama)}</li>`).join('');
    return `
      <article class="karya" id="karya-${k}" aria-labelledby="h-${k}">
        <figure class="bingkai mengendap${pertama ? ' mendarat' : ''}">
          ${gambar(k, 'desk', tt(p.baris), sizes, muat)}
          ${hp}
          <figcaption class="sr-only">${keterangan}</figcaption>
        </figure>
        <p class="tangkap" aria-hidden="true">${keterangan}</p>
        <div class="karya-teks">
          <div class="karya-judul">
            <h3 id="h-${k}">${esc(p.nama)}</h3>
            <p class="meta"><span class="lencana" data-status="${p.status}">${esc(label(p))}</span><span>${esc(tt(p.jenis))}</span><span class="mono">${p.tahun}</span></p>
          </div>
          <div class="karya-isi">
            <p class="baris">${esc(tt(p.baris))}</p>
            <p class="isi">${esc(tt(p.isi))}</p>
            ${poin}
            <dl class="rincian">
              <div><dt>Role</dt><dd>${esc(tt(p.peran))}</dd></div>
              <div><dt>Built with</dt><dd><ul class="tek">${tek}</ul></dd></div>
            </dl>
            <p class="karya-aksi"><a class="knop knop-garis" href="${url(p)}" target="_blank" rel="noopener" data-suara="tekan">Visit ${esc(p.host)}${ik('luar')}</a>${k === 'pos' ? `<a class="tautan-teks" href="https://arswordlab.com/pos/" target="_blank" rel="noopener">Product page with prices${ik('luar')}</a><span class="catatan">The address itself opens the owner sign-in.</span>` : k === 'dailytask' ? `<span class="catatan">Opens the staff sign-in.</span>` : ''}</p>
          </div>
        </div>
      </article>`;
  }).join('');

  // ---- indeks 18 situs -------------------------------------------------------------------------------------------
  const hitung = Object.fromEntries(Object.keys(STATUS).map((s) => [s, PROYEK.filter((p) => p.status === s).length]));
  const saring = [`<button type="button" class="chip" aria-pressed="true" data-saring="semua" data-suara="tekan">All <span class="mono">${nTotal}</span></button>`]
    .concat(Object.entries(STATUS).filter(([s]) => hitung[s]).map(([s, v]) =>
      `<button type="button" class="chip" aria-pressed="false" data-saring="${s}" data-suara="tekan">${esc(tt(v.label))} <span class="mono">${hitung[s]}</span></button>`))
    .join('');

  const baris = PROYEK.map((p, i) => {
    const ada = MEDIA[p.kunci] || {};
    const shotHp = ada.hp ? 'hp' : null;
    const panelGambar = p.tertutup || !ada.desk
      ? `<div class="kosong"><span class="mono">${esc(p.host)}</span><span>Sign-in only. Part of the ARSWORD platform.</span></div>`
      : shotHp
        ? `<div class="panel-hp">${gambar(p.kunci, 'hp', tt(p.baris), '(max-width: 899px) 46vw, 0px', 'loading="lazy"')}</div>`
        : `<div class="panel-desk">${gambar(p.kunci, 'desk', tt(p.baris), '(max-width: 899px) 92vw, 0px', 'loading="lazy"')}</div>`;
    const buka = p.tertutup
      ? `<span class="tertutup">Sign-in only</span>`
      : `<a class="buka" href="${url(p)}" target="_blank" rel="noopener" aria-label="Open ${esc(p.host)} in a new tab" data-suara="tekan">${ik('luar')}</a>`;
    const desk = ada.desk && !p.tertutup ? `data-desk="${esc(ctx.srcset(p.kunci, 'desk'))}" data-w="${MEDIA[p.kunci].desk.w}" data-h="${MEDIA[p.kunci].desk.h}"` : '';
    return `
        <li class="rad" data-status="${p.status}" data-host="${esc(p.host)}" data-kunci="${p.kunci}" data-nama="${esc(p.nama)}" data-baris="${esc(tt(p.baris))}" data-label="${esc(label(p))}" data-jenis="${esc(tt(p.jenis))}" ${p.tertutup ? 'data-tertutup="1"' : `data-url="${url(p)}"`} ${desk}>
          <div class="rad-baris">
            <button type="button" class="rad-tombol" aria-expanded="false" aria-controls="panel-${p.kunci}" id="rad-${p.kunci}">
              <span class="rad-nama">${esc(p.nama)}</span>
              <span class="rad-host"><span class="hidup" aria-hidden="true"></span><span class="mono">${esc(p.host)}</span></span>
              <span class="rad-jenis">${esc(tt(p.jenis))}</span>
              <span class="lencana" data-status="${p.status}">${esc(label(p))}</span>
              ${ik('plus', 'ik buka-tutup')}
            </button>
            ${buka}
          </div>
          <div class="panel" id="panel-${p.kunci}" role="region" aria-labelledby="rad-${p.kunci}">
            <div class="panel-dalam">
              ${panelGambar}
              <p>${esc(tt(p.baris))}</p>
              ${p.tertutup ? '' : `<a class="knop knop-garis knop-kecil" href="${url(p)}" target="_blank" rel="noopener" data-suara="tekan">Open ${esc(p.host)}${ik('luar')}</a>`}
            </div>
          </div>
        </li>`;
  }).join('');

  const legenda = Object.entries(STATUS).map(([s, v]) =>
    `<div><dt><span class="lencana" data-status="${s}">${esc(tt(v.label))}</span></dt><dd>${esc(tt(v.arti))}</dd></div>`).join('');

  const awal = PROYEK[0];
  const pratinjau = `
      <aside class="pratinjau" aria-label="Preview">
        <div class="pv-bingkai" data-kunci="${awal.kunci}">
          ${gambar(awal.kunci, 'desk', tt(awal.baris), '(min-width: 900px) 46vw, 0px', 'loading="lazy" class="pv-gambar"')}
        </div>
        <div class="pv-teks" aria-live="polite">
          <p class="pv-nama"><b>${esc(awal.nama)}</b> <span class="lencana" data-status="${awal.status}">${esc(label(awal))}</span></p>
          <p class="pv-baris">${esc(tt(awal.baris))}</p>
          <p class="pv-bawah"><span class="pv-hidup mono">${esc(awal.host)}</span><a class="knop knop-garis knop-kecil pv-buka" href="${url(awal)}" target="_blank" rel="noopener" data-suara="tekan">Open site${ik('luar')}</a></p>
        </div>
      </aside>`;

  // ---- teknologi --------------------------------------------------------------------------------------------------
  const tekno = KELOMPOK.map((g) => {
    const isi = g.id.map((id) => {
      const t = TEKNO.find((x) => x.id === id);
      const ps = PROYEK.filter((p) => p.tekno.includes(id));
      const nama = ps.length === nTotal ? `All ${nTotal} projects` : ps.map((p) => p.nama).join(', ');
      return `<li><span class="tk-nama">${esc(t.nama)}</span><span class="tk-n mono" aria-label="${ps.length} projects">${ps.length}</span><span class="tk-proyek">${esc(nama)}</span></li>`;
    }).join('');
    return `<div class="tk-grup"><h3>${esc(g.nama)}</h3><ul>${isi}</ul></div>`;
  }).join('');

  // ---- pengalaman --------------------------------------------------------------------------------------------------
  const linimasa = (daftar) => daftar.map((x) => `
          <li>
            <p class="lm-waktu mono">${esc(tt(x.waktu))}</p>
            <div>
              <h4>${esc(tt(x.judul))}</h4>
              <p class="lm-tempat">${esc(x.tempat)}</p>
              <p class="lm-isi">${esc(tt(x.isi))}</p>
            </div>
          </li>`).join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Sword Ekel · Full-stack developer</title>
<meta name="description" content="Sword Ekel, full-stack developer and cyber security student at BINUS University, Jakarta. ${nTotal} websites and web apps live on arswordlab.com.">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#ffffff">
<meta name="color-scheme" content="light">
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
<meta property="og:title" content="Sword Ekel · Full-stack developer">
<meta property="og:description" content="${nTotal} websites and web apps live on arswordlab.com.">
<link rel="preload" href="/font/bersama/geist-normal-0.woff2" as="font" type="font/woff2" crossorigin>
<script>document.documentElement.classList.add('js')</script>
<link rel="stylesheet" href="${aset('standar/gaya.css')}">
<script type="module" src="${aset('standar/main.js')}"></script>
</head>
<body>
${IKON}
<a class="lewati" href="#isi">Skip to content</a>
<p class="sr-only" aria-live="polite" id="kabar"></p>

<header class="nav" id="nav">
  <div class="wrap nav-dalam">
    <a class="merek" href="#atas" data-suara="tekan">Sword Ekel</a>
    <nav class="nav-tautan" aria-label="Sections">
      <a href="#work">Work</a>
      <a href="#index">All sites</a>
      <a href="#about">About</a>
      <a href="#contact">Contact</a>
    </nav>
    <div class="nav-aksi">
      <button type="button" class="suara" id="suara" aria-pressed="true" title="Sound effects">${ik('suara', 'ik ik-suara')}<span class="suara-teks">Sound</span></button>
      <a class="knop knop-utama knop-kecil" href="${PROFIL.cv}" download data-suara="tekan">CV${ik('unduh')}</a>
    </div>
  </div>
</header>

<main id="isi">
  <section class="hero wrap" id="atas" aria-labelledby="h-nama">
    <h1 id="h-nama">${esc(PROFIL.nama)}</h1>
    <p class="pembuka">Full-stack developer and cyber security student at BINUS University, with ${nTotal} websites and web apps live on arswordlab.com.</p>
    <div class="hero-aksi">
      <a class="knop knop-utama" href="#work" data-suara="tekan">See the work${ik('bawah')}</a>
      <a class="knop knop-garis" href="${PROFIL.cv}" download data-suara="tekan">Download CV${ik('unduh')}</a>
    </div>
    <p class="tersedia"><span class="titik" aria-hidden="true"></span><span>${esc(tt(PROFIL.terbuka))} <span class="abu">${esc(tt(PROFIL.kota))}.</span></span></p>
    <p class="hero-email"><a class="email-tautan" href="mailto:${PROFIL.email}">${PROFIL.email}</a><button type="button" class="salin" data-salin="${PROFIL.email}" aria-label="Copy email address">${ik('salin', 'ik ik-salin')}${ik('cek', 'ik ik-cek')}<span class="salin-teks">Copy</span></button></p>
  </section>

  <section class="kerja wrap" id="work" aria-labelledby="h-work">
    <h2 id="h-work" class="sr-only">Selected work</h2>
    ${karya}
  </section>

  <section class="indeks-bagian" id="index" aria-labelledby="h-index">
    <div class="wrap">
      <div class="kepala">
        <h2 id="h-index">All ${nTotal} sites</h2>
        <p>Every address below is live on arswordlab.com. Each one is labelled for what it is.</p>
      </div>
      <div class="saring" role="group" aria-label="Filter by label">${saring}</div>
      <div class="indeks">
        <ol class="daftar" id="daftar">${baris}
        </ol>
        ${pratinjau}
      </div>
      <dl class="legenda">${legenda}</dl>
    </div>
  </section>

  <section class="tekno wrap" id="stack" aria-labelledby="h-stack">
    <div class="kepala">
      <h2 id="h-stack">What I build with</h2>
      <p>Counted from the ${nTotal} projects above, not from a wish list.</p>
    </div>
    <div class="tk">${tekno}</div>
    <p class="keamanan"><b>${jumlahCsp} of ${jumlahHost}</b> sites send a Content-Security-Policy header, measured on ${tanggalUkur}.</p>
  </section>

  <section class="tentang wrap" id="about" aria-labelledby="h-about">
    <div class="potret">
      <img src="/media/foto/potret-abu-720.webp" srcset="/media/foto/potret-abu-400.webp 400w, /media/foto/potret-abu-720.webp 720w" sizes="(min-width: 900px) 360px, 60vw" width="720" height="720" alt="Portrait of Sword Ekel" loading="lazy" decoding="async">
    </div>
    <div class="tentang-teks">
      <h2 id="h-about">About</h2>
      <p class="bio">I study cyber security at BINUS University and work as a cyber security analyst intern at PT Inti Siber Net. I also run ARSWORD, where I design, build and deploy websites and web apps for real businesses, including a point-of-sale system that a shop uses every day.</p>
      <h3 class="lm-judul">Experience</h3>
      <ol class="linimasa">${linimasa(PENGALAMAN)}</ol>
      <h3 class="lm-judul">Education</h3>
      <ol class="linimasa">${linimasa(PENDIDIKAN)}</ol>
      <h3 class="lm-judul">Practice</h3>
      <ol class="linimasa">
          <li>
            <p class="lm-waktu mono">Ongoing</p>
            <div>
              <h4>HackTheBox</h4>
              <p class="lm-tempat mono">@${esc(PROFIL.htb)}</p>
              <p class="lm-isi">Offensive security labs and challenges.</p>
            </div>
          </li>
      </ol>
    </div>
  </section>

  <section class="kontak" id="contact" aria-labelledby="h-contact">
    <div class="wrap">
      <h2 id="h-contact">Hiring for a full-stack or web role?</h2>
      <p class="kontak-sub">Email is the fastest way to reach me. I usually reply within a day.</p>
      <p class="kontak-email"><a href="mailto:${PROFIL.email}">${PROFIL.email}</a><button type="button" class="salin salin-besar" data-salin="${PROFIL.email}" aria-label="Copy email address">${ik('salin', 'ik ik-salin')}${ik('cek', 'ik ik-cek')}<span class="salin-teks">Copy</span></button></p>
      <ul class="kontak-tautan">
        <li><a class="knop knop-utama" href="mailto:${PROFIL.email}" data-suara="tekan">Write an email${ik('panah')}</a></li>
        <li><a class="knop knop-garis" href="${PROFIL.cv}" download data-suara="tekan">Download CV${ik('unduh')}</a></li>
        <li><a class="knop knop-garis" href="${waLink}" target="_blank" rel="noopener" data-suara="tekan">WhatsApp ${esc(PROFIL.waTampil)}${ik('luar')}</a></li>
        <li><a class="knop knop-garis" href="${PROFIL.github}" target="_blank" rel="noopener" data-suara="tekan">GitHub${ik('luar')}</a></li>
      </ul>
    </div>
  </section>
</main>

<footer class="kaki wrap">
  <p>Sword Ekel, ${esc(tt(PROFIL.kota))}. 2026.</p>
  <a href="#atas" data-suara="tekan">Back to top${ik('naik')}</a>
</footer>
</body>
</html>
`;
}
