// Arah B, "Gambar Kerja": portfolio sebagai set gambar kerja. Setiap situs adalah satu lembar; garis potong
// (bilah) membelah tampilan jadi dua: di atas garis situsnya yang sudah jadi, di bawah garis strukturnya,
// diukur dari halaman aslinya (src/geo) atau, untuk aplikasi, diagram sistemnya.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const BAHASA = ['en'];

const DIR = dirname(fileURLToPath(import.meta.url));
const NAMA = JSON.parse(readFileSync(join(DIR, 'nama.json'), 'utf8'));

const TANGGAL = '9 Nov 2026';
const UNGGULAN = ['arswordlab', 'pos', 'dailytask', 'eskrim-uncle-ren', 'nilamerah'];
const r1 = (v) => Math.round(v * 10) / 10;

// ---- nama: garis luar huruf dan konstruksinya -------------------------------------------------------------------

function kotakNama(baris) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const b of baris) {
    for (const [x, y] of b.jangkar) { x0 = Math.min(x0, x); x1 = Math.max(x1, x + b.dx); y0 = Math.min(y0, y + b.dy); y1 = Math.max(y1, y + b.dy); }
    for (const t of b.tuas) { y0 = Math.min(y0, t[3] + b.dy); y1 = Math.max(y1, t[3] + b.dy); }
  }
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

// tata baris nama: satu baris (layar lebar) atau dua baris (HP), dengan pergeseran per baris
function tataNama(mode) {
  if (mode === 'satu') return [{ ...NAMA.satu, dx: 0, dy: 0 }];
  const jarak = NAMA.cap * 1.16;
  return NAMA.dua.map((b, i) => ({ ...b, dx: 0, dy: i * jarak }));
}

function svgNama(mode, lapis) {
  const baris = tataNama(mode);
  const k = kotakNama(baris);
  const pad = 40;
  const vb = `${r1(k.x - pad)} ${r1(k.y - pad)} ${r1(k.w + pad * 2)} ${r1(k.h + pad * 2)}`;
  const id = (i) => `nm-${mode}-${i}`;
  if (lapis === 'defs') {
    return baris.map((b, i) => `<path id="${id(i)}" d="${b.d}" transform="translate(${b.dx} ${b.dy})"/>`).join('');
  }
  if (lapis === 'tinta') {
    return `<svg class="nama nama-${mode}" viewBox="${vb}" aria-hidden="true" focusable="false">${baris.map((_, i) => `<use href="#${id(i)}"/>`).join('')}</svg>`;
  }
  // konstruksi: garis metrik, batas huruf, garis luar, tuas, titik
  const metrik = [];
  const kiri = k.x - pad * 0.5, kanan = k.x + k.w + pad * 0.5;
  for (const b of baris) {
    for (const y of [0, NAMA.cap - NAMA.xh, NAMA.cap]) metrik.push(`M${r1(kiri)} ${r1(y + b.dy)}H${r1(kanan)}`);
  }
  const batas = [];
  for (const b of baris) for (const h of b.huruf) if (h.g !== 'space') batas.push(`M${r1(h.x)} ${r1(b.dy - 24)}V${r1(b.dy + NAMA.cap + 24)}M${r1(h.x + h.w)} ${r1(b.dy - 24)}V${r1(b.dy + NAMA.cap + 24)}`);
  const tuas = [], titikT = [], titikJ = [];
  for (const b of baris) {
    for (const [ax, ay, hx, hy] of b.tuas) {
      tuas.push(`M${r1(ax)} ${r1(ay + b.dy)}L${r1(hx)} ${r1(hy + b.dy)}`);
      titikT.push(`M${r1(hx)} ${r1(hy + b.dy)}h0`);
    }
    for (const [x, y] of b.jangkar) titikJ.push(`M${r1(x)} ${r1(y + b.dy)}h0`);
  }
  return `<svg class="nama nama-${mode} nama-rangka" viewBox="${vb}" aria-hidden="true" focusable="false">
      <path class="k-metrik" d="${metrik.join('')}"/>
      <path class="k-batas" d="${batas.join('')}"/>
      ${baris.map((_, i) => `<use class="k-luar" href="#${id(i)}"/>`).join('')}
      <path class="k-tuas" d="${tuas.join('')}"/>
      <path class="k-titik-t" d="${titikT.join('')}"/><path class="k-titik-t2" d="${titikT.join('')}"/>
      <path class="k-titik-j" d="${titikJ.join('')}"/><path class="k-titik-j2" d="${titikJ.join('')}"/>
    </svg>`;
}

// label metrik di ujung kanan tiap baris nama (posisi dalam satuan huruf; main.js memetakannya ke layar)
function metrikNama() {
  return tataNama('dua').map((b, i) => {
    const x = Math.round(b.lebar + 40);
    const label = (y, teks, kelas = '') => `<span class="${kelas}" data-x="${x}" data-y="${Math.round(y + b.dy)}">${teks}</span>`;
    return label(0, `Cap height ${NAMA.cap}`) + label(NAMA.cap - NAMA.xh, `x-height ${NAMA.xh}`) + label(NAMA.cap, 'Baseline 0')
      + (i === 1 ? label(NAMA.cap, `${NAMA.font} · weight ${NAMA.wght} · width ${NAMA.wdth}`, 'm-font') : '');
  }).join('');
}
export const RASIO_NAMA = (() => { const k = kotakNama(tataNama('dua')); return ((k.w + 80) / (k.h + 80)).toFixed(4); })();

// ---- struktur halaman dari geometri yang diukur di situs aslinya --------------------------------------------------

function rangkaHalaman(g, esc) {
  if (!g) return '';
  const p = [];
  const kotak = [...g.box].sort((a, b) => b.w * b.h - a.w * a.h).slice(0, 40);
  for (const b of kotak) p.push(`<rect class="g-kotak${b.fx ? ' g-tetap' : ''}" x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="${Math.min(b.rad, b.h / 2)}"/>`);
  for (const m of g.media) {
    if (m.w < 40 && m.h < 40) continue;
    const x2 = r1(m.x + m.w), y2 = r1(m.y + m.h);
    p.push(`<g class="g-media${m.gl ? ' g-gl' : ''}"><rect x="${m.x}" y="${m.y}" width="${m.w}" height="${m.h}"/><path d="M${m.x} ${m.y}L${x2} ${y2}M${x2} ${m.y}L${m.x} ${y2}"/></g>`);
  }
  for (const c of g.ctl) p.push(`<rect class="g-ctl${c.fill ? ' g-isi' : ''}" x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" rx="${Math.min(c.rad, c.h / 2)}"/>`);
  for (const t of g.text) {
    const h = Math.max(2.5, Math.min(26, t.fs * 0.34));
    const y = r1(t.y + t.h / 2 - h / 2);
    p.push(`<rect class="g-teks" x="${t.x}" y="${y}" width="${t.w}" height="${r1(h)}" rx="${r1(h / 2)}" opacity="${Math.max(0.35, t.o)}"/>`);
  }
  // keterangan: huruf terbesar, kanvas WebGL atau media terbesar, kepala yang menempel
  const ket = [];
  const besar = [...g.text].sort((a, b) => b.fs - a.fs)[0];
  if (besar) ket.push({ x: besar.x, y: besar.y + besar.h, teks: `Display type · ${Math.round(besar.fs)} px` });
  const gl = g.media.find((m) => m.gl.startsWith('webgl'));
  const med = gl || [...g.media].sort((a, b) => b.w * b.h - a.w * a.h)[0];
  if (med && med.w * med.h > 60000) ket.push({ x: med.x + med.w * 0.72, y: med.y + med.h * 0.82, teks: gl ? `WebGL canvas · ${Math.round(med.w)} × ${Math.round(med.h)}` : `${med.t === 'video' ? 'Video' : 'Image'} · ${Math.round(med.w)} × ${Math.round(med.h)}` });
  const tetap = g.box.find((b) => b.fx && b.y < 40);
  if (tetap) ket.push({ x: tetap.x + tetap.w * 0.5, y: tetap.y + tetap.h, teks: 'Fixed header' });
  const label = ket.map((k) => {
    const lx = Math.min(g.w - 360, k.x + 22), ly = Math.min(g.h - 34, Math.max(40, k.y + 30));
    return `<g class="g-ket"><path d="M${r1(k.x)} ${r1(k.y)}L${r1(lx)} ${r1(ly)}"/><circle cx="${r1(k.x)}" cy="${r1(k.y)}" r="3.5"/><text x="${r1(lx + 6)}" y="${r1(ly + 4)}">${esc(k.teks)}</text></g>`;
  }).join('');
  return `<svg class="rangka" viewBox="0 0 ${g.w} ${g.h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">${p.join('')}${label}</svg>`;
}

// ---- diagram sistem untuk aplikasi (struktur yang tidak terlihat di layar) ----------------------------------------

const DIAGRAM = {
  arswordlab: {
    kotak: [
      { id: 'web', x: 90, y: 150, w: 300, h: 120, judul: 'Site & client studio', sub: ['arswordlab.com', 'packages, revisions, QRIS'] },
      { id: 'admin', x: 90, y: 390, w: 300, h: 120, judul: 'Admin app (PWA)', sub: ['finance, projects, chat', 'chat.arswordlab.com'] },
      { id: 'tpl', x: 90, y: 630, w: 300, h: 120, judul: 'Template sites', sub: ['<name>.arswordlab.com', 'published from the browser'] },
      { id: 'w', x: 560, y: 300, w: 330, h: 300, judul: 'Cloudflare Worker', sub: ['routing, auth, API', 'HTML rewriting', 'cron: backups, reminders'], utama: true },
      { id: 'd1', x: 1060, y: 110, w: 300, h: 96, judul: 'D1 · SQL', sub: ['accounts, projects, finance'] },
      { id: 'r2', x: 1060, y: 250, w: 300, h: 96, judul: 'R2 · object storage', sub: ['client photos and files'] },
      { id: 'do', x: 1060, y: 390, w: 300, h: 96, judul: 'Durable Objects', sub: ['real-time chat rooms'] },
      { id: 'pos', x: 1060, y: 530, w: 300, h: 96, judul: 'ARSWORD POS', sub: ['service binding'] },
      { id: 'luar', x: 1060, y: 670, w: 300, h: 130, judul: 'External services', sub: ['Midtrans QRIS', 'Claude API (assistant)', 'Web Push, email'] },
    ],
    garis: [['web', 'w'], ['admin', 'w'], ['tpl', 'w'], ['w', 'd1'], ['w', 'r2'], ['w', 'do'], ['w', 'pos'], ['w', 'luar', true]],
  },
  pos: {
    kotak: [
      { id: 'kasir', x: 90, y: 130, w: 330, h: 150, judul: 'Cashier app', sub: ['Android tablet (Capacitor)', 'React, Zustand', 'offline queue in IndexedDB'] },
      { id: 'dash', x: 90, y: 380, w: 330, h: 110, judul: 'Owner dashboard', sub: ['React · sales, stock, staff'] },
      { id: 'menu', x: 90, y: 590, w: 330, h: 110, judul: 'QR table menu', sub: ['React · orders from tables'] },
      { id: 'api', x: 570, y: 300, w: 300, h: 230, judul: 'API', sub: ['Hono on Cloudflare Workers', 'outlets, orders, shifts', 'sync from tablets'], utama: true },
      { id: 'd1', x: 1040, y: 180, w: 310, h: 110, judul: 'D1 · SQL', sub: ['menu, orders, stock, staff'] },
      { id: 'qris', x: 1040, y: 400, w: 310, h: 110, judul: 'Midtrans', sub: ['QRIS payments'] },
      { id: 'cetak', x: 570, y: 650, w: 300, h: 130, judul: 'ESC/POS printers', sub: ['counter receipt', 'kitchen tickets per station'] },
    ],
    garis: [['kasir', 'api'], ['dash', 'api'], ['menu', 'api'], ['api', 'd1'], ['api', 'qris', true], ['kasir', 'cetak']],
  },
  dailytask: {
    kotak: [
      { id: 'staf', x: 90, y: 170, w: 320, h: 130, judul: 'Staff phones', sub: ['installable web app', 'own tasks only', 'photo / video proof'] },
      { id: 'admin', x: 90, y: 470, w: 320, h: 130, judul: 'Admin panel', sub: ['four-week rota editor', 'balanced auto-assign', 'days off, announcements'] },
      { id: 'api', x: 560, y: 300, w: 320, h: 220, judul: 'Cloudflare Worker', sub: ['auth and sessions', 'tasks, checks, rota', 'scheduled reminders'], utama: true },
      { id: 'd1', x: 1050, y: 160, w: 300, h: 110, judul: 'D1 · SQL', sub: ['staff, tasks, checks'] },
      { id: 'r2', x: 1050, y: 360, w: 300, h: 110, judul: 'R2 · object storage', sub: ['proof photos and videos'] },
      { id: 'push', x: 1050, y: 560, w: 300, h: 110, judul: 'Web Push', sub: ['reminders to phones'] },
    ],
    garis: [['staf', 'api'], ['admin', 'api'], ['api', 'd1'], ['api', 'r2'], ['api', 'push'], ['push', 'staf', true]],
  },
};

function diagram(kunci, esc) {
  const d = DIAGRAM[kunci];
  if (!d) return '';
  const by = Object.fromEntries(d.kotak.map((k) => [k.id, k]));
  const pusat = (k) => [k.x + k.w / 2, k.y + k.h / 2];
  const garis = d.garis.map(([a, b, putus]) => {
    const A = by[a], B = by[b];
    let [x1, y1] = pusat(A), [x2, y2] = pusat(B);
    // dari tepi kotak, bukan dari tengahnya
    if (Math.abs(x2 - x1) > Math.abs(y2 - y1) * 0.6) { x1 = x2 > x1 ? A.x + A.w : A.x; x2 = x2 > x1 ? B.x : B.x + B.w; }
    else { y1 = y2 > y1 ? A.y + A.h : A.y; y2 = y2 > y1 ? B.y : B.y + B.h; }
    const mx = r1((x1 + x2) / 2);
    const jalan = Math.abs(y2 - y1) < 2 || Math.abs(x2 - x1) < 2 ? `M${x1} ${y1}L${x2} ${y2}` : `M${x1} ${y1}H${mx}V${y2}H${x2}`;
    return `<path class="d-garis${putus ? ' d-putus' : ''}" d="${jalan}"/><circle class="d-ujung" cx="${x2}" cy="${y2}" r="4"/>`;
  }).join('');
  const kotak = d.kotak.map((k) => `<g class="d-kotak${k.utama ? ' d-utama' : ''}"><rect x="${k.x}" y="${k.y}" width="${k.w}" height="${k.h}" rx="10"/>
      <text class="d-judul" x="${k.x + 22}" y="${k.y + 40}">${esc(k.judul)}</text>${k.sub.map((s, i) => `<text class="d-sub" x="${k.x + 22}" y="${k.y + 70 + i * 26}">${esc(s)}</text>`).join('')}</g>`).join('');
  return `<svg class="rangka diagram" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">${garis}${kotak}</svg>`;
}

// ---- ikon (satu ketebalan garis) --------------------------------------------------------------------------------

const IKON = `<svg class="sprite" aria-hidden="true" focusable="false">
  <symbol id="i-panah" viewBox="0 0 16 16"><path d="M4.5 11.5l7-7M6 4.5h5.5V10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-bawah" viewBox="0 0 16 16"><path d="M8 3v9M4 8.5l4 4 4-4M3.5 14h9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-suara" viewBox="0 0 16 16"><path d="M2.5 6.2h2.2L8 3.5v9L4.7 9.8H2.5z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path class="gel" d="M10.6 5.6a3.4 3.4 0 0 1 0 4.8M12.4 3.9a5.8 5.8 0 0 1 0 8.2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path class="silang" d="M10.5 6l4 4M14.5 6l-4 4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></symbol>
  <symbol id="i-salin" viewBox="0 0 16 16"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M10.5 3.5v-.5A1.5 1.5 0 0 0 9 1.5H4A1.5 1.5 0 0 0 2.5 3v5A1.5 1.5 0 0 0 4 9.5h.5" fill="none" stroke="currentColor" stroke-width="1.4"/></symbol>
  <symbol id="i-cek" viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></symbol>
</svg>`;
const ik = (id, kelas = 'ik') => `<svg class="${kelas}" aria-hidden="true"><use href="#i-${id}"/></svg>`;

// ---- halaman ------------------------------------------------------------------------------------------------------

export default function halaman(ctx) {
  const { DATA, tt, esc, aset, gambar, geo, info, PERIKSA } = ctx;
  const { PROFIL, STATUS, TEKNO, PROYEK, PENGALAMAN, PENDIDIKAN } = DATA;
  const byKunci = Object.fromEntries(PROYEK.map((p) => [p.kunci, p]));
  const nomor = (i) => String(i + 1).padStart(2, '0');
  const ukurHost = (h) => PERIKSA.hosts[h] || {};
  const cspAda = PROYEK.filter((p) => ukurHost(p.host).headers?.['content-security-policy']);
  const mb = (b) => (b / 1048576).toFixed(b > 10485760 ? 0 : 1);
  const tautan = (p) => p.tertutup ? '' : `https://${p.host}/`;
  const host = (h) => {
    const i = h.indexOf('.arswordlab.com');
    return i > 0 ? `<b>${esc(h.slice(0, i))}</b><span>.arswordlab.com</span>` : `<b>${esc(h)}</b>`;
  };

  // lembar unggulan
  const lembar = UNGGULAN.map((k, i) => {
    const p = byKunci[k];
    const inf = info(k) || {};
    const d = inf.desk || {};
    const ukur = ukurHost(p.host);
    const fakta = [];
    if (d.requests) fakta.push(`${d.requests} requests`);
    if (d.transferBytes) fakta.push(`${mb(d.transferBytes)} MB on first load`);
    const gl = (d.contexts || []).filter((c) => c.startsWith('webgl')).length;
    if (gl) fakta.push(`${gl} WebGL context${gl > 1 ? 's' : ''}`);
    if (ukur.headers?.['content-security-policy']) fakta.push('CSP header');
    if (ukur.ms) fakta.push(`${ukur.ms} ms response`);
    const struktur = DIAGRAM[k] ? diagram(k, esc) : rangkaHalaman(geo(k, 'desk'), esc);
    const jenisStruktur = DIAGRAM[k] ? 'System diagram' : 'Page structure, measured from the live site';
    const alt = tt(p.baris);
    const demo = k === 'pos' ? `<span class="demo">Demo outlet, test data</span>` : '';
    return `
    <article class="lembar" id="lembar-${k}" aria-labelledby="lj-${k}" data-lembar="${k}">
      <div class="lembar-gambar">
        <figure class="bingkai" data-bingkai>
          <div class="permukaan">${gambar(k, 'desk', alt, '(min-width: 1100px) 62vw, 100vw', 'loading="lazy"')}</div>
          <div class="struktur">${struktur}</div>
          <div class="bilah-kecil" aria-hidden="true"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><line x1="0" y1="60" x2="100" y2="40"/></svg></div>
          <button class="gagang" type="button" data-sunyi aria-label="Move the section line on ${esc(p.nama)}">${'<i></i>'.repeat(3)}</button>
          ${demo}
          <figcaption class="sr-only">${esc(alt)} Below the section line: ${esc(jenisStruktur.toLowerCase())}.</figcaption>
        </figure>
        <p class="keterangan"><span>Above the line: the live site.</span> <span>Below: ${esc(jenisStruktur.toLowerCase())}.</span></p>
      </div>
      <div class="kop">
        <dl class="kop-sel">
          <div><dt>Sheet</dt><dd>${nomor(i)} of ${String(UNGGULAN.length).padStart(2, '0')}</dd></div>
          <div><dt>Status</dt><dd>${esc(tt(STATUS[p.status].label))}</dd></div>
          <div><dt>Type</dt><dd>${esc(tt(p.jenis))}</dd></div>
          <div><dt>Year</dt><dd>${p.tahun}</dd></div>
        </dl>
        <h3 id="lj-${k}">${esc(p.nama)}</h3>
        <a class="alamat" href="${tautan(p)}" target="_blank" rel="noopener">${host(p.host)}${ik('panah')}</a>
        <p class="isi">${esc(tt(p.isi))}</p>
        <dl class="kop-daftar">
          <div><dt>Role</dt><dd>${esc(tt(p.peran))}</dd></div>
          ${p.poin.length ? `<div><dt>Built</dt><dd><ul>${p.poin.map((x) => `<li>${esc(tt(x))}</li>`).join('')}</ul></dd></div>` : ''}
          <div><dt>Stack</dt><dd class="tumpuk">${p.tekno.map((t) => `<span>${esc(TEKNO.find((x) => x.id === t).nama)}</span>`).join('')}</dd></div>
          ${fakta.length && k !== 'pos' ? `<div><dt>Measured</dt><dd class="ukur">${fakta.map((f) => `<span>${esc(f)}</span>`).join('')}</dd></div>` : ''}
        </dl>
      </div>
    </article>`;
  }).join('');

  // daftar semua host
  const baris = PROYEK.map((p, i) => {
    const s = tt(STATUS[p.status].label);
    const ada = !!ctx.MEDIA[p.kunci]?.desk;
    return `
        <li class="reg-baris" data-kunci="${p.kunci}" data-host="${p.host}" data-tekno="${p.tekno.join(' ')}" data-status="${p.status}">
          <button class="reg-buka" type="button" aria-expanded="false" aria-controls="reg-isi-${p.kunci}" data-suara="tekan">
            <span class="reg-no">${nomor(i)}</span>
            <span class="reg-nama">${esc(p.nama)}<span class="reg-host">${host(p.host)}</span></span>
            <span class="reg-jenis">${esc(tt(p.jenis))}</span>
            <span class="reg-status" data-s="${p.status}">${esc(s)}</span>
            <span class="reg-ping" aria-live="off"></span>
          </button>
          <div class="reg-isi" id="reg-isi-${p.kunci}" hidden>
            ${ada ? `<div class="reg-foto">${gambar(p.kunci, p.kunci === 'pos' ? 'desk' : 'hp', tt(p.baris), '(max-width: 1099px) 60vw, 1px', 'loading="lazy"')}</div>` : ''}
            <p>${esc(tt(p.baris))}</p>
            ${p.tertutup ? `<p class="catat">Sign-in only.</p>` : `<a class="tautan" href="${tautan(p)}" target="_blank" rel="noopener">Open ${esc(p.host)}${ik('panah')}</a>`}
          </div>
        </li>`;
  }).join('');

  // pratinjau besar (layar lebar): data gambar per baris untuk main.js
  const pratinjau = Object.fromEntries(PROYEK.filter((p) => ctx.MEDIA[p.kunci]?.desk).map((p) => [p.kunci, {
    src: ctx.media(p.kunci, 'desk', 960), set: ctx.srcset(p.kunci, 'desk'), alt: tt(p.baris), host: p.host, nama: p.nama,
    url: tautan(p), status: tt(STATUS[p.status].label), demo: p.kunci === 'pos',
  }]));

  // jadwal teknologi (matriks)
  const kolom = PROYEK.map((p, i) => `<th scope="col"><abbr title="${esc(p.nama)}">${nomor(i)}</abbr></th>`).join('');
  const jadwal = TEKNO.map((t) => {
    const pakai = PROYEK.filter((p) => p.tekno.includes(t.id));
    return `<tr data-tekno-baris="${t.id}">
          <th scope="row"><button type="button" class="jad-tombol" aria-pressed="false" data-tekno="${t.id}" data-suara="tekan">${esc(t.nama)}</button></th>
          ${PROYEK.map((p) => `<td data-baca="${esc(t.nama)} · ${esc(p.nama)}${p.tekno.includes(t.id) ? '' : ' (not used)'}">${p.tekno.includes(t.id) ? `<i class="ya" title="${esc(p.nama)}"></i>` : '<i></i>'}</td>`).join('')}
          <td class="jumlah">${pakai.length}</td>
        </tr>`;
  }).join('');
  const barisCsp = `<tr class="jad-ukur">
          <th scope="row"><span>Sends a Content-Security-Policy header</span></th>
          ${PROYEK.map((p) => `<td data-baca="Content-Security-Policy · ${esc(p.nama)}${cspAda.includes(p) ? ', sent' : ', not sent'}">${cspAda.includes(p) ? `<i class="ya" title="${esc(p.nama)}"></i>` : '<i class="tidak"></i>'}</td>`).join('')}
          <td class="jumlah">${cspAda.length}</td>
        </tr>`;

  const legenda = Object.entries(STATUS).map(([k, s]) => `<div><dt data-s="${k}">${esc(tt(s.label))}</dt><dd>${esc(tt(s.arti))}</dd></div>`).join('');
  const riwayat = [...PENGALAMAN, ...PENDIDIKAN].map((e) => `<tr><th scope="row">${esc(tt(e.waktu))}</th><td><b>${esc(tt(e.judul))}</b><span>${esc(e.tempat)}</span></td><td>${esc(tt(e.isi))}</td></tr>`).join('');

  const desc = `Sword Ekel, full-stack developer in Jakarta and cyber security student at BINUS University. 18 live websites and web apps on arswordlab.com, each labelled honestly.`;

  return `<!doctype html>
<html lang="en" data-arah="gambar">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Sword Ekel · Full-stack developer</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="noindex">
<meta name="format-detection" content="telephone=no, date=no, address=no">
<meta name="theme-color" content="#F4F5F3">
<link rel="preload" href="/font/gambar/schibsted-grotesk.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${aset('gambar/gaya.css')}">
<link rel="icon" href="${aset('gambar/ikon.svg')}" type="image/svg+xml">
</head>
<body>
${IKON}
<svg class="sprite" aria-hidden="true" focusable="false"><defs>${svgNama('dua', 'defs')}</defs></svg>
<a class="lompat" href="#karya">Skip to the work</a>

<header class="kepala" data-kepala>
  <a class="merek" href="#atas" data-suara="tekan">Sword Ekel</a>
  <nav class="nav" aria-label="Sections">
    <a href="#karya">Work</a><a href="#daftar">All sites</a><a href="#tentang">About</a><a href="#kontak">Contact</a>
  </nav>
  <div class="kepala-aksi">
    <button class="tombol-suara" type="button" aria-pressed="true" data-sunyi>${ik('suara')}<span>Sound</span></button>
    <a class="pil pil-kecil" href="${PROFIL.cv}" download data-suara="tekan">${ik('bawah')}CV</a>
  </div>
</header>

<main id="atas">
  <section class="sampul" data-sampul aria-labelledby="h-nama" style="--rasio: ${RASIO_NAMA}">
    <h1 id="h-nama" class="sr-only">Sword Ekel, full-stack developer</h1>
    <div class="lapis lapis-kertas">
      ${svgNama('dua', 'tinta')}
    </div>
    <div class="lapis lapis-malam" data-malam>
      ${svgNama('dua', 'rangka')}
      <div class="metrik" aria-hidden="true" data-metrik>
        ${metrikNama()}
      </div>
      <div class="sampul-isi">
        <p class="intro">Full-stack developer and cyber security student at BINUS University. I design, build and run websites and web apps. Eighteen of them are live on <span class="nowrap">arswordlab.com</span>.</p>
        <div class="aksi">
          <a class="pil pil-terang" href="#karya" data-suara="tekan">See the work</a>
          <a class="pil pil-garis" href="${PROFIL.cv}" download data-suara="tekan">${ik('bawah')}Download CV</a>
        </div>
        <dl class="kop-sampul">
          <div><dt>Status</dt><dd>Open to roles</dd></div>
          <div><dt>Now</dt><dd>Security analyst intern, PT Inti Siber Net</dd></div>
          <div><dt>Based in</dt><dd>${esc(tt(PROFIL.kota))}</dd></div>
          <div><dt>Email</dt><dd><a href="mailto:${PROFIL.email}">${PROFIL.email}</a></dd></div>
          <div><dt>Sheet</dt><dd>00 of ${String(UNGGULAN.length).padStart(2, '0')}</dd></div>
          <div><dt>Issued</dt><dd>${TANGGAL}</dd></div>
        </dl>
      </div>
    </div>
    <div class="bilah" data-bilah aria-hidden="true">
      <span class="bilah-garis"></span>
      <span class="penanda penanda-kiri"><b>A</b></span>
    </div>
    <div class="gagang-besar" data-gagang role="slider" tabindex="0" aria-label="Section line through the name" aria-valuemin="0" aria-valuemax="100" aria-valuenow="55" aria-valuetext="Section line at 55 percent">
      <b>A</b><span class="petunjuk">Drag</span>
    </div>
  </section>

  <section class="karya" id="karya" aria-labelledby="h-karya">
    <div class="judul-bagian">
      <h2 id="h-karya">Selected work</h2>
      <p>Five of the eighteen, cut open. Above the line is the live site; below it is how it is built. Drag the line to compare.</p>
    </div>
    ${lembar}
  </section>

  <section class="daftar" id="daftar" aria-labelledby="h-daftar">
    <div class="judul-bagian">
      <h2 id="h-daftar">All ${PROYEK.length} sites</h2>
      <p>Everything I have built on arswordlab.com, each with an honest label. Select a row for a preview.</p>
      <dl class="legenda">${legenda}</dl>
    </div>
    <div class="reg">
      <div class="reg-kepala">
        <p class="reg-filter" data-filter hidden><span data-filter-teks></span> <button type="button" class="tautan-kecil" data-filter-hapus data-suara="tekan">Show all</button></p>
        <button type="button" class="pil pil-garis pil-kecil" data-cek data-suara="tekan">Check they are live</button>
      </div>
      <ol class="reg-daftar" data-daftar>${baris}
      </ol>
      <aside class="reg-pratinjau" aria-hidden="true" data-pratinjau>
        <div class="pra-bingkai"><div class="pra-lapis" data-pra-lama></div><div class="pra-lapis" data-pra-baru></div><span class="pra-garis"></span></div>
        <p class="pra-teks" data-pra-teks></p>
      </aside>
    </div>
  </section>

  <section class="jadwal" id="tumpukan" aria-labelledby="h-jadwal">
    <div class="judul-bagian">
      <h2 id="h-jadwal">What I build with</h2>
      <p>Each mark is a site that uses it. Select a row to filter the list of sites.</p>
    </div>
    <div class="jadwal-gulir">
      <table class="jadwal-tabel">
        <caption class="sr-only">Technologies used across the ${PROYEK.length} sites, numbered as in the list above</caption>
        <thead><tr><th scope="col"><span class="sr-only">Technology</span></th>${kolom}<th scope="col">Sites</th></tr></thead>
        <tbody>${jadwal}${barisCsp}</tbody>
      </table>
    </div>
    <p class="baca" data-baca-teks aria-hidden="true">Point at a mark to see the site.</p>
    <p class="catat">Header measured on ${TANGGAL} from every host. ${PROYEK.length - cspAda.length} sites (${PROYEK.filter((p) => !cspAda.includes(p)).map((p) => esc(p.nama)).join(', ')}) do not send one yet.</p>
  </section>

  <section class="tentang" id="tentang" aria-labelledby="h-tentang">
    <div class="tentang-foto">
      <img src="/media/foto/potret-abu-720.webp" srcset="/media/foto/potret-abu-400.webp 400w, /media/foto/potret-abu-720.webp 720w" sizes="(min-width: 900px) 320px, 60vw" width="720" height="720" alt="Portrait of Sword Ekel" loading="lazy" decoding="async">
    </div>
    <div class="tentang-teks">
      <h2 id="h-tentang">About</h2>
      <p class="besar">I’m Sword Ekel, a full-stack developer from Jakarta. I study Cyber Security at BINUS University and work as a security analyst intern at PT Inti Siber Net.</p>
      <p>Since 2025 I have built websites and web apps for clients under my own studio, ARSWORD, from the first sketch to a deployed site. I also run two products of my own: the studio platform and a point-of-sale system that a real shop uses every day. Security work taught me to read a site from the attacker’s side, so I ship with strict headers and keep secrets on the server.</p>
      <table class="riwayat"><caption class="sr-only">Experience and education</caption>${riwayat}
        <tr><th scope="row">Practice</th><td><b>HackTheBox</b><span>@${PROFIL.htb}</span></td><td>Offensive security labs and challenges.</td></tr>
      </table>
    </div>
  </section>

  <section class="kontak" id="kontak" aria-labelledby="h-kontak">
    <h2 id="h-kontak">Contact</h2>
    <p class="kontak-sub">${esc(tt(PROFIL.terbuka))}</p>
    <dl class="kop-akhir">
      <div class="lebar"><dt>Email</dt><dd><a href="mailto:${PROFIL.email}" data-suara="tekan">${PROFIL.email}</a><button type="button" class="salin" data-salin="${PROFIL.email}" data-sunyi>${ik('salin')}<span>Copy</span></button></dd></div>
      <div><dt>WhatsApp</dt><dd><a href="https://wa.me/${PROFIL.wa}" target="_blank" rel="noopener" data-suara="tekan"><span>${PROFIL.waTampil}</span></a></dd></div>
      <div><dt>GitHub</dt><dd><a href="${PROFIL.github}" target="_blank" rel="noopener" data-suara="tekan">github.com/Swordekel</a></dd></div>
      <div><dt>CV</dt><dd><a href="${PROFIL.cv}" download data-suara="tekan">Download PDF</a></dd></div>
      <div><dt>Location</dt><dd>${esc(tt(PROFIL.kota))}</dd></div>
    </dl>
    <p class="cap-terbit" aria-hidden="true"><span>Issued for review</span><span>${TANGGAL}</span></p>
  </section>
</main>

<footer class="kaki">
  <span>Sword Ekel, 2026</span>
  <span>Built from scratch in HTML, CSS and JavaScript.</span>
</footer>

<script type="application/json" id="data-pratinjau">${JSON.stringify(pratinjau).replace(/</g, '\\u003c')}</script>
<script type="module" src="${aset('gambar/main.js')}"></script>
</body>
</html>
`;
}
