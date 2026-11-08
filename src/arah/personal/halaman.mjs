// Arah E, "Personal": berkunjung ke studionya. Orangnya di depan karya yang sudah ia kirim: foto diri dan 18 situs
// yang hidup berbagi layar pertama. Terang, lega, ramah. Rasa dari referensi pemilik (foto besar, terang), tata letak
// sendiri: tanpa intro sapaan, tanpa nama berjalan, tanpa label "Based in", tanpa testimoni contoh.

export const BAHASA = ['en'];

// data terstruktur untuk mesin pencari: orangnya dan situsnya
function jsonLd(situs, DATA, tt) {
  const { PROFIL } = DATA;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person', '@id': `${situs}/#sword`, name: PROFIL.nama, alternateName: PROFIL.namaLengkap,
        jobTitle: 'Full-stack developer', url: `${situs}/`, image: `${situs}/media/foto/potret-warna-800.webp`,
        email: `mailto:${PROFIL.email}`, address: { '@type': 'PostalAddress', addressLocality: 'Jakarta', addressCountry: 'ID' },
        affiliation: { '@type': 'CollegeOrUniversity', name: 'BINUS University' },
        sameAs: [PROFIL.github],
        worksFor: { '@type': 'Organization', name: 'ARSWORD', url: 'https://arswordlab.com/' },
        knowsAbout: DATA.TEKNO.map((t) => t.nama),
      },
      { '@type': 'WebSite', '@id': `${situs}/#web`, url: `${situs}/`, name: 'Sword Ekel', inLanguage: 'en', publisher: { '@id': `${situs}/#sword` } },
    ],
  };
}

// halaman 404 dengan gaya yang sama
export function halaman404({ aset }) {
  return `<!doctype html>
<html lang="en" data-arah="personal">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Page not found · Sword Ekel</title>
<meta name="robots" content="noindex">
<meta name="theme-color" content="#f2f3f5">
<link rel="stylesheet" href="${aset('personal/gaya.css')}">
<link rel="icon" href="${aset('personal/ikon.svg')}" type="image/svg+xml">
</head>
<body>
<main class="hilang">
  <h1>This page doesn’t exist.</h1>
  <p>The link may be old. Everything is on the main page.</p>
  <a class="pil pil-gelap" href="/">Go to the portfolio</a>
</main>
</body>
</html>
`;
}

const UNGGULAN = ['pos', 'arswordlab', 'dailytask', 'eskrim-uncle-ren', 'teassence'];

const IKON = `<svg class="sprite" aria-hidden="true" focusable="false">
  <symbol id="i-panah" viewBox="0 0 16 16"><path d="M4.5 11.5l7-7M6 4.5h5.5V10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-bawah" viewBox="0 0 16 16"><path d="M8 2.5v8.5M4.5 7.5L8 11l3.5-3.5M3 13.5h10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-suara" viewBox="0 0 16 16"><path d="M2.5 6.2h2.2L8 3.5v9L4.7 9.8H2.5z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path class="gel" d="M10.6 5.6a3.4 3.4 0 0 1 0 4.8M12.4 3.9a5.8 5.8 0 0 1 0 8.2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path class="silang" d="M10.5 6l4 4M14.5 6l-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></symbol>
  <symbol id="i-salin" viewBox="0 0 16 16"><rect x="5.5" y="5.5" width="8" height="8" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10.5 3.5A1.5 1.5 0 0 0 9 2H4a1.5 1.5 0 0 0-1.5 1.5v5A1.5 1.5 0 0 0 4 10h.5" fill="none" stroke="currentColor" stroke-width="1.5"/></symbol>
  <symbol id="i-lokasi" viewBox="0 0 16 16"><path d="M8 14s4.5-4.2 4.5-7.6A4.5 4.5 0 0 0 3.5 6.4C3.5 9.8 8 14 8 14z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="8" cy="6.5" r="1.6" fill="none" stroke="currentColor" stroke-width="1.5"/></symbol>
  <symbol id="i-kampus" viewBox="0 0 16 16"><path d="M1.5 6L8 3l6.5 3L8 9z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M4 7.3v3.2c1.2 1 2.5 1.5 4 1.5s2.8-.5 4-1.5V7.3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></symbol>
  <symbol id="i-perisai" viewBox="0 0 16 16"><path d="M8 1.8l5 2v4c0 3.1-2.1 5.4-5 6.4-2.9-1-5-3.3-5-6.4v-4z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M5.8 8.1l1.6 1.6 3-3.2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-pesan" viewBox="0 0 16 16"><path d="M2.5 12.8l1-2.9A5.5 5.5 0 1 1 6 12.4z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></symbol>
  <symbol id="i-git" viewBox="0 0 16 16"><path d="M6 13.5c-3 .9-3-1.6-4.2-1.9M10 15.5v-2.4a2.1 2.1 0 0 0-.6-1.6c2-.2 4.1-1 4.1-4.4a3.4 3.4 0 0 0-.9-2.4 3.2 3.2 0 0 0-.1-2.4s-.7-.2-2.4.9a8.2 8.2 0 0 0-4.2 0C4.2 2.1 3.5 2.3 3.5 2.3a3.2 3.2 0 0 0-.1 2.4 3.4 3.4 0 0 0-.9 2.4c0 3.4 2.1 4.2 4.1 4.4a2.1 2.1 0 0 0-.6 1.6v2.4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></symbol>
</svg>`;
const ik = (id, kelas = 'ik') => `<svg class="${kelas}" aria-hidden="true"><use href="#i-${id}"/></svg>`;

export default function halaman(ctx) {
  const { DATA, tt, esc, aset, gambar, media, info, PERIKSA, MEDIA, situs = '' } = ctx;
  const { PROFIL, STATUS, TEKNO, PROYEK, PENGALAMAN, PENDIDIKAN } = DATA;
  const byKunci = Object.fromEntries(PROYEK.map((p) => [p.kunci, p]));
  const tautan = (p) => (p.tertutup ? '' : `https://${p.host}/`);
  const host = (h) => {
    const i = h.indexOf('.arswordlab.com');
    return i > 0 ? `${esc(h.slice(0, i))}<span>.arswordlab.com</span>` : esc(h);
  };
  const adaFoto = PROYEK.filter((p) => MEDIA[p.kunci]?.desk);
  // rekaman layar yang berputar sendiri: dimuat hanya saat kartunya terlihat (main.js), gambar diam di bawahnya
  const adaVideo = (k, w) => { try { return aset(`media/video/${k}-${w}.mp4`); } catch { return ''; } };
  const video = (k, besar = false) => {
    const kecil = adaVideo(k, 640);
    if (!kecil) return '';
    const lebar = besar ? adaVideo(k, 1280) : '';
    return `<video class="vid" muted loop playsinline preload="none" disablepictureinpicture disableremoteplayback aria-hidden="true" tabindex="-1" data-kecil="${kecil}"${lebar ? ` data-besar="${lebar}"` : ''}></video>`;
  };
  const csp = PROYEK.filter((p) => PERIKSA.hosts[p.host]?.headers?.['content-security-policy']).length;

  // dua kolom tangkapan yang melayang di belakang potret (hiasan; daftar dobel supaya putarannya mulus)
  const DINDING = ['arswordlab', 'eskrim-uncle-ren', 'nilamerah', 'teassence', 'javaloom', 'tsunagu',
    'pos', 'nathaniakhow', 'cherish', 'radja', 'himawari', 'seifan'];
  const kolom = [DINDING.filter((_, i) => i % 2 === 0), DINDING.filter((_, i) => i % 2 === 1)];
  const studio = kolom.map((k, n) => {
    const isi = k.map((kunci) => `<img src="${media(kunci, 'desk', 400)}" width="400" height="250" alt="" decoding="async">`).join('');
    return `<div class="arus arus-${n + 1}"><div class="arus-isi">${isi}${isi}</div></div>`;
  }).join('');

  const kartuUnggulan = UNGGULAN.map((k, i) => {
    const p = byKunci[k];
    const ukur = PERIKSA.hosts[p.host] || {};
    const fakta = [];
    const d = (info(k) || {}).desk || {};
    if (d.requests) fakta.push(`${d.requests} requests`);
    if (d.transferBytes) fakta.push(`${(d.transferBytes / 1048576).toFixed(1)} MB first load`);
    if (ukur.headers?.['content-security-policy']) fakta.push('CSP header');
    const demo = k === 'pos' ? '<span class="lencana-demo">Demo outlet, test data</span>' : '';
    return `
      <article class="karya${i % 2 ? ' balik' : ''}" aria-labelledby="k-${k}">
        <a class="karya-foto" href="${tautan(p)}" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true">
          ${gambar(k, 'desk', '', '(min-width: 1000px) 56vw, 100vw', 'loading="lazy"')}${video(k, true)}${demo}
        </a>
        <div class="karya-teks">
          <p class="karya-meta"><span class="label" data-s="${p.status}">${esc(tt(STATUS[p.status].label))}</span><span>${esc(tt(p.jenis))}</span><span>${p.tahun}</span></p>
          <h3 id="k-${k}">${esc(p.nama)}</h3>
          <p class="karya-baris">${esc(tt(p.baris))}</p>
          <p class="karya-isi">${esc(tt(p.isi))}</p>
          <p class="karya-peran"><b>My part</b> ${esc(tt(p.peran))}</p>
          <ul class="karya-tekno">${p.tekno.map((t) => `<li>${esc(TEKNO.find((x) => x.id === t).nama)}</li>`).join('')}</ul>
          <div class="karya-aksi">
            <a class="pil pil-gelap" href="${tautan(p)}" target="_blank" rel="noopener" data-suara="tekan">Visit ${esc(p.host)}${ik('panah')}</a>
            <span class="hidup" data-hidup="${p.host}"><i></i><span>Checking…</span></span>
          </div>
          ${fakta.length && k !== 'pos' ? `<p class="karya-ukur">Measured 9 Nov 2026: ${fakta.map(esc).join(' · ')}</p>` : ''}
        </div>
      </article>`;
  }).join('');

  const kartuSemua = PROYEK.map((p) => {
    const ada = !!MEDIA[p.kunci]?.desk;
    const isi = `
          <span class="mini-foto">${ada ? gambar(p.kunci, 'desk', '', '(min-width: 1100px) 22vw, (min-width: 700px) 30vw, 46vw', 'loading="lazy"') + video(p.kunci) : '<span class="mini-kosong">Sign-in only</span>'}</span>
          <span class="mini-nama">${esc(p.nama)}</span>
          <span class="mini-jenis">${esc(tt(p.jenis))}</span>
          <span class="mini-bawah"><span class="label" data-s="${p.status}">${esc(tt(STATUS[p.status].label))}</span><span class="mini-host">${host(p.host)}</span></span>`;
    return `
        <li data-status="${p.status}" data-tekno="${p.tekno.join(' ')}">
          ${p.tertutup ? `<div class="mini">${isi}</div>` : `<a class="mini" href="${tautan(p)}" target="_blank" rel="noopener" aria-label="${esc(p.nama)}, ${esc(tt(STATUS[p.status].label))}: ${esc(tt(p.baris))}">${isi}</a>`}
        </li>`;
  }).join('');

  const hitungStatus = (s) => PROYEK.filter((p) => p.status === s).length;
  const saring = [['semua', 'All', PROYEK.length], ...Object.keys(STATUS).map((s) => [s, tt(STATUS[s].label), hitungStatus(s)])]
    .map(([id, nama, n], i) => `<button type="button" class="saring" data-saring="${id}" aria-pressed="${i === 0}" data-suara="tekan">${esc(nama)} <span>${n}</span></button>`).join('');

  // teknologi: urut dari yang paling banyak dipakai, dengan tumpukan foto kecil situs yang memakainya
  const tekno = TEKNO.map((t) => ({ ...t, pakai: PROYEK.filter((p) => p.tekno.includes(t.id)) }))
    .sort((a, b) => b.pakai.length - a.pakai.length)
    .map((t) => `
        <li>
          <span class="tek-nama">${esc(t.nama)}</span>
          <span class="tek-tumpuk" aria-hidden="true">${t.pakai.slice(0, 8).map((p) => MEDIA[p.kunci]?.desk ? `<img src="${media(p.kunci, 'desk', 160)}" alt="" width="56" height="35" loading="lazy" decoding="async">` : '<i></i>').join('')}${t.pakai.length > 8 ? `<b>+${t.pakai.length - 8}</b>` : ''}</span>
          <span class="tek-jumlah">${t.pakai.length} ${t.pakai.length === 1 ? 'site' : 'sites'}</span>
          <span class="sr-only">: ${t.pakai.map((p) => esc(p.nama)).join(', ')}</span>
        </li>`).join('');

  const riwayat = [...PENGALAMAN, ...PENDIDIKAN].map((e) => `
          <li><span class="waktu">${esc(tt(e.waktu))}</span><div><b>${esc(tt(e.judul))}</b><span class="tempat">${esc(e.tempat)}</span><p>${esc(tt(e.isi))}</p></div></li>`).join('');

  const desc = 'Sword Ekel, full-stack developer in Jakarta and cyber security student at BINUS University. 18 websites and web apps live on arswordlab.com.';

  return `<!doctype html>
<html lang="en" data-arah="personal">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Sword Ekel · Full-stack developer in Jakarta</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${situs}/">
<meta property="og:type" content="profile">
<meta property="og:url" content="${situs}/">
<meta property="og:site_name" content="Sword Ekel">
<meta property="og:title" content="Sword Ekel · Full-stack developer">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${situs}/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Portrait of Sword Ekel in front of screenshots of the websites in this portfolio">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<script type="application/ld+json">${JSON.stringify(jsonLd(situs, DATA, tt)).replace(/</g, '\\u003c')}</script>
<meta name="format-detection" content="telephone=no, date=no, address=no">
<meta name="theme-color" content="#f2f3f5">
<link rel="preload" href="/font/personal/albert-sans-normal-0.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${aset('personal/gaya.css')}">
<link rel="icon" href="${aset('personal/ikon.svg')}" type="image/svg+xml">
</head>
<body>
${IKON}
<a class="lompat" href="#karya">Skip to the work</a>

<header class="kepala" data-kepala>
  <a class="merek" href="#atas" data-suara="tekan">Sword Ekel</a>
  <nav class="nav" aria-label="Sections"><a href="#karya">Work</a><a href="#semua">All sites</a><a href="#tentang">About</a><a href="#kontak">Contact</a></nav>
  <div class="kepala-aksi">
    <button class="tombol-suara" type="button" aria-pressed="true" data-sunyi>${ik('suara')}<span>Sound</span></button>
    <a class="pil pil-gelap pil-kecil" href="${PROFIL.cv}" download data-suara="tekan">${ik('bawah')}CV</a>
  </div>
</header>

<main id="atas">
  <section class="sampul" aria-labelledby="h-nama">
    <div class="sampul-teks">
      <h1 id="h-nama"><span>Sword</span> <span>Ekel</span></h1>
      <p class="pembuka">I build websites and web apps that real businesses use. Eighteen of them are live on arswordlab.com right now.</p>
      <div class="aksi">
        <a class="pil pil-gelap" href="#karya" data-suara="tekan">See my work</a>
        <a class="pil pil-garis" href="${PROFIL.cv}" download data-suara="tekan">${ik('bawah')}Download CV</a>
      </div>
      <ul class="fakta">
        <li>${ik('lokasi')}<span>Jakarta, Indonesia</span></li>
        <li>${ik('kampus')}<span>Cyber Security, BINUS University</span></li>
        <li>${ik('perisai')}<span>Security analyst intern, PT Inti Siber Net</span></li>
        <li class="terbuka"><i></i><span>Open to full-stack and web developer roles</span></li>
      </ul>
    </div>
    <figure class="studio" data-studio>
      <div class="studio-dinding" aria-hidden="true">${studio}</div>
      <div class="studio-kabut" aria-hidden="true"></div>
      <img class="potret" src="${aset('media/foto/potret-warna-800.webp')}" srcset="${aset('media/foto/potret-warna-520.webp')} 520w, ${aset('media/foto/potret-warna-800.webp')} 800w" sizes="(min-width: 1000px) 34vw, 82vw" width="800" height="800" alt="Portrait of Sword Ekel" fetchpriority="high" decoding="async">
      <figcaption class="studio-chip" data-chip aria-live="polite"><i></i><span>Checking my sites…</span></figcaption>
    </figure>
  </section>

  <section class="bagian" id="karya" aria-labelledby="h-karya">
    <div class="judul">
      <h2 id="h-karya">Selected work</h2>
      <p>Five projects I’m proud of, from products I run to sites for clients. Every link below is live.</p>
    </div>
    <div class="daftar-karya">${kartuUnggulan}
    </div>
  </section>

  <section class="bagian" id="semua" aria-labelledby="h-semua">
    <div class="judul">
      <h2 id="h-semua">All ${PROYEK.length} sites</h2>
      <p>Everything I’ve built on arswordlab.com, each with an honest label so you know what it is.</p>
    </div>
    <div class="saring-baris" role="group" aria-label="Filter by label">${saring}</div>
    <dl class="arti">${Object.entries(STATUS).map(([k, s]) => `<div><dt><span class="label" data-s="${k}">${esc(tt(s.label))}</span></dt><dd>${esc(tt(s.arti))}</dd></div>`).join('')}</dl>
    <ul class="kisi-situs" data-kisi>${kartuSemua}
    </ul>
  </section>

  <section class="bagian" id="alat" aria-labelledby="h-alat">
    <div class="judul">
      <h2 id="h-alat">What I work with</h2>
      <p>Counted from the sites themselves, not a wish list. ${csp} of the ${PROYEK.length} sites also send a Content-Security-Policy header (checked 9 Nov 2026).</p>
    </div>
    <ul class="tekno">${tekno}
    </ul>
  </section>

  <section class="bagian tentang" id="tentang" aria-labelledby="h-tentang">
    <div class="judul">
      <h2 id="h-tentang">About me</h2>
    </div>
    <div class="tentang-isi">
      <div class="tentang-teks">
        <p class="besar">I’m Sword, a full-stack developer from Jakarta. I study Cyber Security at BINUS University and I’m interning as a security analyst at PT Inti Siber Net.</p>
        <p>Since 2025 I’ve built sites and web apps for clients under my own studio, ARSWORD, from the first sketch to the deployed site. I also run two products of my own: the studio platform and a point-of-sale system that a real shop uses every day. Working in security taught me to look at a site from the attacker’s side, so I ship with strict headers and keep secrets on the server.</p>
        <p class="kecil">Outside client work I practise on HackTheBox as @${esc(PROFIL.htb)}.</p>
      </div>
      <ol class="riwayat">${riwayat}
      </ol>
    </div>
  </section>

  <section class="kontak" id="kontak" aria-labelledby="h-kontak">
    <div class="kontak-papan">
      <img class="kontak-potret" src="${aset('media/foto/potret-warna-520.webp')}" width="520" height="520" alt="" loading="lazy" decoding="async">
      <div class="kontak-teks">
        <h2 id="h-kontak">Hiring, or have a project?</h2>
        <p>${esc(tt(PROFIL.terbuka))} The quickest way to reach me is email.</p>
        <div class="kontak-surel">
          <a href="mailto:${PROFIL.email}" data-suara="tekan">${PROFIL.email}</a>
          <button type="button" class="salin" data-salin="${PROFIL.email}" data-sunyi>${ik('salin')}<span>Copy</span></button>
        </div>
        <div class="kontak-lain">
          <a class="pil pil-gelap" href="https://wa.me/${PROFIL.wa}" target="_blank" rel="noopener" data-suara="tekan">${ik('pesan')}<span>WhatsApp ${PROFIL.waTampil}</span></a>
          <a class="pil pil-garis" href="${PROFIL.cv}" download data-suara="tekan">${ik('bawah')}Download CV</a>
          <a class="pil pil-garis" href="${PROFIL.github}" target="_blank" rel="noopener" data-suara="tekan">${ik('git')}GitHub</a>
        </div>
      </div>
    </div>
  </section>
</main>

<footer class="kaki"><span>© 2026 Sword Ekel</span><span>Jakarta, Indonesia</span></footer>
<script type="module" src="${aset('personal/main.js')}"></script>
</body>
</html>
`;
}
