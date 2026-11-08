// Arah A · Laporan Asesmen: viewer dokumen (penunjuk halaman, daftar isi), cek live 18 host dari browser pembaca
// dengan angka balistik dan cap tinta, salin email, dan suara.
import { bunyi, aturSuara, suaraNyala, pasangOtomatis } from '/js/suara.js';
import { cekSemua } from '/js/ping.js';

const kurang = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, a = document) => a.querySelector(s);
const $$ = (s, a = document) => [...a.querySelectorAll(s)];

pasangOtomatis();

// ---- tombol suara ---------------------------------------------------------------------------------------------------
const tSuara = $('[data-suara-tombol]');
const tampilSuara = (v) => {
  tSuara.setAttribute('aria-pressed', String(v));
  $('[data-suara-st]', tSuara).textContent = v ? ' on' : ' off';
};
tampilSuara(suaraNyala());
tSuara.addEventListener('click', () => {
  const v = !suaraNyala();
  if (!v) bunyi('padam');
  aturSuara(v);
  tampilSuara(v);
  if (v) setTimeout(() => bunyi('hidup'), 90);
});

// ---- penunjuk halaman ------------------------------------------------------------------------------------------------
const halTeks = $('[data-hal-teks]');
const lembar = $$('[data-hal]');
const NAMA = { sampul: 1, lingkup: 2, temuan: 3, teknologi: 4, latar: 5, kontak: 6 };
let kini = 0;
const tulisHal = (i) => {
  kini = i;
  const id = lembar[i].dataset.hal;
  const pendek = innerWidth < 560;
  halTeks.textContent = id === 'plat' ? 'Plate A' : pendek ? `${NAMA[id]} / 6` : `Page ${NAMA[id]} of 6`;
};
const pengamat = new IntersectionObserver((ent) => {
  for (const e of ent) if (e.isIntersecting) tulisHal(lembar.indexOf(e.target));
}, { rootMargin: '-40% 0px -55% 0px' });
lembar.forEach((l) => pengamat.observe(l));
tulisHal(0);
const lompat = (d) => {
  const i = Math.max(0, Math.min(lembar.length - 1, kini + d));
  lembar[i].scrollIntoView({ behavior: kurang ? 'auto' : 'smooth', block: 'start' });
  bunyi('kertas');
};
$('[data-hal-naik]').addEventListener('click', () => lompat(-1));
$('[data-hal-turun]').addEventListener('click', () => lompat(1));

// ---- daftar isi --------------------------------------------------------------------------------------------------------
const tMenu = $('[data-menu-tombol]');
const menu = $('#daftar-isi');
const bukaMenu = (v) => {
  menu.hidden = !v;
  tMenu.setAttribute('aria-expanded', String(v));
  if (v) $('a', menu).focus({ preventScroll: true });
};
tMenu.addEventListener('click', (e) => { e.stopPropagation(); bukaMenu(menu.hidden); bunyi('tekan'); });
menu.addEventListener('click', (e) => { if (e.target.closest('a')) bukaMenu(false); });
document.addEventListener('click', (e) => { if (!menu.hidden && !e.target.closest('.isi-menu')) bukaMenu(false); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !menu.hidden) { bukaMenu(false); tMenu.focus(); }
});

// ---- baris host lain: buka saat dituju dari tabel lingkup ----------------------------------------------------------------
const bukaDetail = (hash) => {
  if (!hash || !hash.startsWith('#h-')) return;
  const d = document.getElementById(hash.slice(1));
  if (d && d.tagName === 'DETAILS') d.open = true;
};
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#h-"]');
  if (a) bukaDetail(a.getAttribute('href'));
});
addEventListener('hashchange', () => bukaDetail(location.hash));
bukaDetail(location.hash);
for (const d of $$('details')) d.addEventListener('toggle', () => { if (d.open) bunyi('kertas'); });

// ---- salin email -------------------------------------------------------------------------------------------------------
const salinStatus = $('[data-salin-status]');
for (const b of $$('[data-salin]')) {
  b.addEventListener('click', async () => {
    const teks = b.dataset.salin;
    let ok = false;
    try { await navigator.clipboard.writeText(teks); ok = true; } catch {
      const t = document.createElement('textarea');
      t.value = teks; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.append(t); t.select();
      try { ok = document.execCommand('copy'); } catch {}
      t.remove();
    }
    if (!ok) return;
    bunyi('salin');
    b.classList.add('ok');
    salinStatus.textContent = 'Email address copied.';
    clearTimeout(b._t);
    b._t = setTimeout(() => { b.classList.remove('ok'); salinStatus.textContent = ''; }, 1700);
  });
}

// ---- angka balistik: naik dengan massa dan redaman, sedikit melewati lalu diam -------------------------------------------
function balistik(el, target) {
  if (kurang) { el.textContent = String(target); return; }
  const k = 210, c = 2 * Math.sqrt(k) * 0.78;
  let v = 0, u = 0, lalu = performance.now();
  const langkah = (kini) => {
    const dt = Math.min(0.034, (kini - lalu) / 1000);
    lalu = kini;
    u += (k * (target - v) - c * u) * dt;
    v += u * dt;
    el.textContent = String(Math.max(0, Math.round(v)));
    if (Math.abs(target - v) < 0.5 && Math.abs(u) < 3) { el.textContent = String(target); return; }
    requestAnimationFrame(langkah);
  };
  requestAnimationFrame(langkah);
}

// ---- cap tinta -----------------------------------------------------------------------------------------------------------
function svgCap(judul, baris1, baris2) {
  return `<svg viewBox="0 0 330 150" aria-hidden="true">
  <defs>
    <filter id="tinta" x="-4%" y="-6%" width="108%" height="112%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="9" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G" result="d"/>
      <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="4" result="n2"/>
      <feColorMatrix in="n2" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  6 0 0 0 -1.75" result="bercak"/>
      <feComposite in="d" in2="bercak" operator="in"/>
    </filter>
  </defs>
  <g filter="url(#tinta)">
    <rect x="5" y="5" width="320" height="140" rx="11" fill="none" stroke="currentColor" stroke-width="5.5"/>
    <rect x="14" y="14" width="302" height="122" rx="6" fill="none" stroke="currentColor" stroke-width="1.6"/>
    <text x="165" y="64" text-anchor="middle" fill="currentColor" font-size="35" font-weight="850" letter-spacing="2.5">${judul}</text>
    <line x1="32" x2="298" y1="80" y2="80" stroke="currentColor" stroke-width="1.6"/>
    <text x="165" y="104" text-anchor="middle" fill="currentColor" font-size="15.5" font-weight="760" letter-spacing="1.6">${baris1}</text>
    <text x="165" y="126" text-anchor="middle" fill="currentColor" font-size="12" font-weight="650" letter-spacing="1.3">${baris2}</text>
  </g>
</svg>`;
}

function capkan(ok, total, waktu) {
  const el = $('[data-cap]');
  const tgl = waktu.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();
  const jam = waktu.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  el.innerHTML = svgCap(ok === total ? 'VERIFIED LIVE' : 'CHECKED LIVE', `${ok} OF ${total} HOSTS ANSWERED`, `${tgl} · ${jam} · FROM YOUR BROWSER`);
  el.hidden = false;
  el.closest('.verif')?.classList.add('dicap');
  el.classList.remove('mendarat');
  void el.offsetWidth;
  if (!kurang) el.classList.add('mendarat');
  setTimeout(() => bunyi('cap'), kurang ? 0 : 230);
  // tunjukkan capnya bila kotak verifikasi belum terlihat setengahnya (hasil dari tindakan pembaca sendiri)
  const kotakV = el.closest('.verif');
  const r = kotakV.getBoundingClientRect();
  const terlihat = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
  if (terlihat < r.height * 0.6) kotakV.scrollIntoView({ behavior: kurang ? 'auto' : 'smooth', block: 'nearest' });
}

// ---- cek live -------------------------------------------------------------------------------------------------------------
const tombolCek = $$('[data-cek]');
const statusCek = $('[data-cek-status]');
const labelCek = $('[data-cek-label]');
const verifikasi = $('[data-verifikasi]');
let berjalan = false;

async function jalankanCek(asal) {
  if (berjalan) return;
  berjalan = true;
  const baris = $$('.lingkup tbody tr[data-host]');
  const hosts = baris.map((r) => r.dataset.host);
  const strip = $$('.sampul .strip .sq');
  for (const s of strip) s.className = 'sq sq-o tunggu';
  for (const b of tombolCek) b.disabled = true;
  if (labelCek) labelCek.textContent = `Checking 0 of ${hosts.length}`;
  statusCek.textContent = `Checking ${hosts.length} hosts from your browser…`;
  if (asal) bunyi('tekan');
  let n = 0, ok = 0;
  await cekSemua(hosts, (h, r, i) => {
    n++;
    if (r.ok) ok++;
    const row = baris[i];
    const ms = $('.ms', row);
    const kapan = $('[data-kapan]', row);
    if (r.ok) balistik(ms, r.ms); else ms.textContent = '–';
    kapan.textContent = r.ok ? 'now' : 'no answer';
    row.classList.remove('baru');
    void row.offsetWidth;
    row.classList.add('baru');
    const sq = strip.find((s) => s.dataset.host === h);
    if (sq) sq.className = `sq ${r.ok ? 'sq-f' : 'sq-h'}`;
    bunyi('pindai', { i: n });
    if (labelCek) labelCek.textContent = `Checking ${n} of ${hosts.length}`;
  }, { serentak: 3 });
  const waktu = new Date();
  const jam = waktu.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  statusCek.textContent = ok === hosts.length
    ? `All ${hosts.length} hosts answered your browser at ${jam}.`
    : `${ok} of ${hosts.length} hosts answered your browser at ${jam}. The rest may be blocked on this network.`;
  if (verifikasi) verifikasi.textContent = `Checked from your browser at ${jam}: ${ok} of ${hosts.length} hosts answered.`;
  if (labelCek) labelCek.textContent = 'Run again';
  for (const b of tombolCek) b.disabled = false;
  capkan(ok, hosts.length, waktu);
  berjalan = false;
}
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-cek]');
  if (b) jalankanCek(b);
});
