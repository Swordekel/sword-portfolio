// Arah B, Gambar Kerja: garis potong (bilah) yang bisa diseret, lembar karya yang terbelah saat di-scroll,
// daftar 18 situs dengan pratinjau yang terpotong saat berganti, jadwal teknologi sebagai penyaring, dan suara.
import { bunyi, suaraTerus, aturSuara, suaraNyala, saatBerubah, pasangOtomatis } from '/js/suara.js';
import { cekSemua } from '/js/ping.js';

const $ = (s, a = document) => a.querySelector(s);
const $$ = (s, a = document) => [...a.querySelectorAll(s)];
const klem = (v, a, b) => Math.min(b, Math.max(a, v));
const gerakKurang = matchMedia('(prefers-reduced-motion: reduce)');
const kursorHalus = matchMedia('(hover: hover) and (pointer: fine)');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const easeKeluar = (k) => (k >= 1 ? 1 : 1 - Math.pow(2, -10 * k));

// ---- suara ---------------------------------------------------------------------------------------------------------
pasangOtomatis();
const tombolSuara = $('.tombol-suara');
const sinkronSuara = (on) => tombolSuara.setAttribute('aria-pressed', on ? 'true' : 'false');
sinkronSuara(suaraNyala());
saatBerubah(sinkronSuara);
tombolSuara.addEventListener('click', () => {
  if (suaraNyala()) { bunyi('padam'); setTimeout(() => aturSuara(false), 140); }
  else { aturSuara(true); setTimeout(() => bunyi('hidup'), 90); }
});

// ---- kepala: kaca setelah digulir, gelap di atas bagian kontak ------------------------------------------------------
const kepala = $('[data-kepala]');
const metaWarna = $('meta[name="theme-color"]');
const kontak = $('#kontak');
function cekKepala() {
  kepala.classList.toggle('gulir', scrollY > 8);
  const atasKontak = kontak.getBoundingClientRect().top;
  const gelap = atasKontak <= 32;
  kepala.classList.toggle('gelap', gelap);
  document.documentElement.classList.toggle('gelap', atasKontak <= 0);
  metaWarna.content = gelap ? '#0f1012' : '#f4f5f3';
}

// ---- sampul: garis potong lewat nama ---------------------------------------------------------------------------------
const sampul = $('[data-sampul]');
const gagangBesar = $('[data-gagang]');
const garisBesar = $('.bilah-garis', sampul);
const penandaKiri = $('.penanda-kiri', sampul);
const metrik = $('[data-metrik]', sampul);
const isiSampul = $('.sampul-isi', sampul);
let pPengguna = 0.5; // 0 = garis di atas nama (semua jadi gambar konstruksi), 1 = di bawah nama (semua tinta)
let pMasuk = null;    // posisi selama animasi pembuka
let U = null;         // ukuran sampul, dihitung ulang saat ukuran layar berubah

function namaTampak(lapis) {
  return $$(`${lapis} .nama`, sampul).find((s) => s.getBoundingClientRect().width > 0);
}

function ukurSampul() {
  const r = sampul.getBoundingClientRect();
  const n = namaTampak('.lapis-kertas').getBoundingClientRect();
  const isi = isiSampul.getBoundingClientRect();
  const W = r.width;
  const miring = klem(W * 0.16, 60, 250);
  const kepalaBawah = 72;
  // rentang titik tengah garis: dari atas nama sampai bawah nama, tapi ujung kanan tidak naik ke kepala dan ujung kiri
  // tidak turun ke teks pembuka
  const atas = Math.max(n.top - r.top - n.height * 0.06, kepalaBawah + miring / 2);
  const bawah = Math.min(n.bottom - r.top + n.height * 0.04, isi.top - r.top - 24 - miring / 2);
  U = { W, H: r.height, miring, atas, bawah: Math.max(bawah, atas + 40), kiri: Math.max(16, n.left - r.left) };
  garisBesar.style.setProperty('--panjang', `${Math.hypot(W, miring)}px`);
  letakMetrik(r);
}

function letakMetrik(r) {
  if (getComputedStyle(metrik).display === 'none') return;
  const svg = namaTampak('.lapis-malam');
  const vb = svg.viewBox.baseVal;
  const s = svg.getBoundingClientRect();
  const skala = s.height / vb.height;
  for (const el of $$('span', metrik)) {
    el.style.top = `${s.top - r.top + (Number(el.dataset.y) - vb.y) * skala}px`;
    el.style.left = `${s.left - r.left + (Number(el.dataset.x) - vb.x) * skala + 10}px`;
  }
}

function terapkanSampul(p) {
  if (!U) return;
  const { W, miring, atas, bawah } = U;
  const tengah = atas + (bawah - atas) * p;
  const yKiri = tengah + miring / 2, yKanan = tengah - miring / 2;
  sampul.style.setProperty('--ki', `${yKiri}px`);
  sampul.style.setProperty('--ka', `${yKanan}px`);
  garisBesar.style.setProperty('--ki-px', `${yKiri}px`);
  garisBesar.style.setProperty('--sudut', `${Math.atan2(yKanan - yKiri, W)}rad`);
  const yPada = (x) => yKiri + (yKanan - yKiri) * (x / W);
  const xKiri = Math.max(18, U.kiri / 2), xKanan = W - Math.max(18, U.kiri / 2) - (W > 700 ? 14 : 4);
  penandaKiri.style.setProperty('--px', `${xKiri}px`);
  penandaKiri.style.setProperty('--py', `${yPada(xKiri)}px`);
  gagangBesar.style.setProperty('--hx', `${xKanan}px`);
  gagangBesar.style.setProperty('--hy', `${yPada(xKanan)}px`);
}

function posisiSampul() {
  if (pMasuk !== null) return pMasuk;
  if (gerakKurang.matches || !U) return pPengguna;
  const kemajuan = klem(scrollY / (U.H * 0.9), 0, 1);
  return klem(pPengguna - kemajuan * 0.6, 0, 1);
}

function ariaGagang() {
  const n = Math.round(pPengguna * 100);
  gagangBesar.setAttribute('aria-valuenow', String(n));
  gagangBesar.setAttribute('aria-valuetext', `Section line at ${n} percent: ${n < 35 ? 'mostly construction' : n > 70 ? 'mostly ink' : 'half ink, half construction'}`);
}

// seret: gagang di ujung kanan, atau garisnya sendiri dengan mouse
let seret = null;
function mulaiSeret(e, target) {
  e.preventDefault();
  target.setPointerCapture?.(e.pointerId);
  seret = { target, y0: e.clientY, p0: pPengguna, yLalu: e.clientY, tLalu: performance.now(), v: 0, gesek: suaraTerus({ f: 3000, q: 0.9, maks: 0.08, pan: 0.55 }) };
  gagangBesar.classList.add('seret');
  sampul.classList.add('sudah-seret');
}
function geserSeret(e) {
  if (!seret) return;
  const rentang = Math.max(40, U.bawah - U.atas);
  pPengguna = klem(seret.p0 + (e.clientY - seret.y0) / rentang, 0, 1);
  const t = performance.now();
  const v = Math.abs(e.clientY - seret.yLalu) / Math.max(8, t - seret.tLalu);
  seret.v = seret.v * 0.6 + v * 0.4;
  seret.yLalu = e.clientY; seret.tLalu = t;
  seret.gesek.atur(klem(seret.v * 1.5, 0, 1), 2200 + klem(seret.v, 0, 1.5) * 2600);
  ariaGagang();
  jadwalkan();
}
function akhiriSeret() {
  if (!seret) return;
  seret.gesek.henti();
  bunyi('bilah', { pan: 0.55, kuat: klem(0.35 + seret.v * 0.8, 0.35, 1) });
  seret = null;
  gagangBesar.classList.remove('seret');
}
gagangBesar.addEventListener('pointerdown', (e) => mulaiSeret(e, gagangBesar));
gagangBesar.addEventListener('pointermove', geserSeret);
for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture']) gagangBesar.addEventListener(ev, akhiriSeret);

// garisnya sendiri bisa ditarik dengan mouse (sentuhan tetap untuk menggulir halaman)
function dekatGaris(e) {
  if (!U) return false;
  const r = sampul.getBoundingClientRect();
  const x = e.clientX - r.left, y = e.clientY - r.top;
  const p = posisiSampul();
  const tengah = U.atas + (U.bawah - U.atas) * p;
  const yGaris = tengah + U.miring / 2 - U.miring * (x / U.W);
  return Math.abs(y - yGaris) < 14;
}
sampul.addEventListener('pointermove', (e) => {
  if (e.pointerType !== 'mouse' || seret) return;
  sampul.style.cursor = dekatGaris(e) ? 'ns-resize' : '';
});
sampul.addEventListener('pointerdown', (e) => {
  if (e.pointerType !== 'mouse' || e.target.closest('a, button, [data-gagang]') || !dekatGaris(e)) return;
  mulaiSeret(e, sampul);
});
sampul.addEventListener('pointermove', geserSeret);
for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture']) sampul.addEventListener(ev, akhiriSeret);

gagangBesar.addEventListener('keydown', (e) => {
  const langkah = { ArrowUp: -0.05, ArrowLeft: -0.05, ArrowDown: 0.05, ArrowRight: 0.05, PageUp: -0.2, PageDown: 0.2 }[e.key];
  if (langkah !== undefined) pPengguna = klem(pPengguna + langkah, 0, 1);
  else if (e.key === 'Home') pPengguna = 0;
  else if (e.key === 'End') pPengguna = 1;
  else return;
  e.preventDefault();
  sampul.classList.add('sudah-seret');
  bunyi('sentuh', { pan: 0.55 });
  ariaGagang();
  jadwalkan();
});

// pembuka: garis menebas dari kanan ke kiri, lalu bidang gelap naik memotong nama
function pembuka() {
  if (gerakKurang.matches) return;
  const awal = 1, akhir = pPengguna, t0 = performance.now(), lama = 1250;
  pMasuk = awal;
  garisBesar.style.setProperty('--tebas', '0');
  garisBesar.style.clipPath = 'inset(0 0 0 100%)';
  bunyi('bilah', { pan: 0.3, kuat: 0.8 });
  const langkah = (t) => {
    const k = klem((t - t0) / lama, 0, 1);
    const tebas = easeKeluar(klem(k / 0.34, 0, 1));
    garisBesar.style.clipPath = `inset(0 0 0 ${(1 - tebas) * 100}%)`;
    garisBesar.style.setProperty('--kilau', `${-160 + (1 - tebas) * 0 + k * (U ? U.W + 320 : 1600)}px`);
    garisBesar.style.setProperty('--tebas', '1');
    const turun = easeKeluar(klem((k - 0.18) / 0.82, 0, 1));
    pMasuk = awal + (akhir - awal) * turun;
    terapkanSampul(pMasuk);
    if (k < 1) requestAnimationFrame(langkah);
    else { pMasuk = null; garisBesar.style.clipPath = ''; garisBesar.style.setProperty('--kilau', '-200px'); jadwalkan(); }
  };
  requestAnimationFrame(langkah);
}

// ---- lembar karya: garis potong mengikuti gulir dan bisa diseret -------------------------------------------------------
const LEMBAR = $$('[data-bingkai]').map((el) => ({ el, garis: $('line', el), gagang: $('.gagang', el), geser: 0, tampak: false }));
const pengamat = new IntersectionObserver((daftar) => {
  for (const e of daftar) { const L = LEMBAR.find((x) => x.el === e.target); if (L) L.tampak = e.isIntersecting; }
  jadwalkan();
}, { rootMargin: '15% 0px' });
LEMBAR.forEach((L) => pengamat.observe(L.el));

function pasangLembar(L, p) {
  const kiri = p * 100 + 7, kanan = p * 100 - 7;
  L.el.style.setProperty('--ki', `${kiri}%`);
  L.el.style.setProperty('--ka', `${kanan}%`);
  L.garis.setAttribute('y1', kiri.toFixed(2));
  L.garis.setAttribute('y2', kanan.toFixed(2));
}
function hitungLembar() {
  const vh = innerHeight;
  for (const L of LEMBAR) {
    if (!L.tampak) continue;
    const r = L.el.getBoundingClientRect();
    const t = klem((r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2), -1, 1);
    const dasar = gerakKurang.matches ? 0.55 : 0.6 + t * 0.34;
    pasangLembar(L, klem(dasar + L.geser, 0.05, 0.95));
  }
}
for (const L of LEMBAR) {
  let s = null;
  L.gagang.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    L.gagang.setPointerCapture(e.pointerId);
    s = { y0: e.clientY, g0: L.geser, yLalu: e.clientY, tLalu: performance.now(), v: 0, gesek: suaraTerus({ f: 3400, q: 1, maks: 0.07, pan: 0.4 }) };
    L.gagang.classList.add('seret');
  });
  L.gagang.addEventListener('pointermove', (e) => {
    if (!s) return;
    L.geser = klem(s.g0 + (e.clientY - s.y0) / L.el.getBoundingClientRect().height, -0.95, 0.95);
    const t = performance.now();
    s.v = s.v * 0.6 + (Math.abs(e.clientY - s.yLalu) / Math.max(8, t - s.tLalu)) * 0.4;
    s.yLalu = e.clientY; s.tLalu = t;
    s.gesek.atur(klem(s.v * 1.6, 0, 1), 2400 + klem(s.v, 0, 1.5) * 2400);
    jadwalkan();
  });
  const lepas = () => {
    if (!s) return;
    s.gesek.henti();
    bunyi('bilah', { pan: 0.4, kuat: klem(0.3 + s.v * 0.7, 0.3, 0.9) });
    s = null;
    L.gagang.classList.remove('seret');
  };
  for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture']) L.gagang.addEventListener(ev, lepas);
  L.gagang.addEventListener('keydown', (e) => {
    const d = { ArrowUp: -0.06, ArrowDown: 0.06 }[e.key];
    if (d === undefined) return;
    e.preventDefault();
    L.geser = klem(L.geser + d, -0.95, 0.95);
    bunyi('sentuh', { pan: 0.4 });
    jadwalkan();
  });
}

// ---- daftar semua situs ------------------------------------------------------------------------------------------------
const DATA = JSON.parse($('#data-pratinjau').textContent);
const BARIS = $$('.reg-baris');
const praLama = $('[data-pra-lama]');
const praBaru = $('[data-pra-baru]');
const praTeks = $('[data-pra-teks]');
const praGaris = $('.pra-garis');
const lebar = matchMedia('(min-width: 1100px)');
let kunciPra = null;

function gambarPra(d) {
  const img = new Image();
  img.decoding = 'async';
  img.alt = '';
  img.sizes = '(min-width: 1100px) 40vw, 1px';
  img.srcset = d.set;
  img.src = d.src;
  return img;
}
function tampilkan(kunci, bersuara = true) {
  if (!lebar.matches || kunciPra === kunci) return;
  const d = DATA[kunci];
  BARIS.forEach((b) => b.classList.toggle('aktif', b.dataset.kunci === kunci));
  const lama = praBaru.firstElementChild;
  if (!d) {
    praBaru.replaceChildren();
    praTeks.innerHTML = `<b>${esc(BARIS.find((b) => b.dataset.kunci === kunci)?.querySelector('.reg-nama')?.textContent || '')}</b><br>Sign-in only, so there is no public preview.`;
    kunciPra = kunci;
    return;
  }
  praBaru.replaceChildren(gambarPra(d));
  praTeks.innerHTML = `<b>${esc(d.nama)}</b> · ${esc(d.status)}${d.demo ? ' · demo data' : ''}<br>${esc(d.alt)}`;
  if (lama && !gerakKurang.matches) {
    const potong = (poligon) => { const p = document.createElement('div'); p.className = 'pra-potong'; p.style.clipPath = poligon; p.append(lama.cloneNode()); return p; };
    const atas = potong('polygon(0 0, 100% 0, 100% 42%, 0 58%)');
    const bawah = potong('polygon(0 58%, 100% 42%, 100% 100%, 0 100%)');
    praLama.replaceChildren(atas, bawah);
    const opsi = { duration: 620, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' };
    atas.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: 'translate(-4%,-7%)', opacity: 0 }], opsi);
    bawah.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: 'translate(4%,7%)', opacity: 0 }], opsi).finished.then(() => praLama.replaceChildren()).catch(() => {});
    praGaris.animate([
      { transform: 'rotate(-5.71deg) scaleX(0)', opacity: 1 },
      { transform: 'rotate(-5.71deg) scaleX(1)', opacity: 1, offset: 0.4 },
      { transform: 'rotate(-5.71deg) scaleX(1)', opacity: 0 },
    ], { duration: 620, easing: 'ease-out' });
    if (bersuara) bunyi('sapu', { pan: 0.5 });
  }
  kunciPra = kunci;
}
for (const b of BARIS) {
  const tombol = $('.reg-buka', b);
  tombol.addEventListener('mouseenter', () => tampilkan(b.dataset.kunci));
  tombol.addEventListener('focus', () => tampilkan(b.dataset.kunci));
  tombol.addEventListener('click', () => {
    const buka = tombol.getAttribute('aria-expanded') !== 'true';
    tombol.setAttribute('aria-expanded', String(buka));
    $('.reg-isi', b).hidden = !buka;
  });
}
const pertama = () => BARIS.find((b) => !b.hidden);
if (lebar.matches) tampilkan(pertama().dataset.kunci, false);
lebar.addEventListener('change', () => { kunciPra = null; if (lebar.matches) tampilkan(pertama().dataset.kunci, false); });

// cek live dari browser pengunjung
const tombolCek = $('[data-cek]');
function hitungNaik(el, ms) {
  if (gerakKurang.matches) { el.textContent = `${ms} ms`; return; }
  const t0 = performance.now(), lama = 520;
  const f = (t) => {
    const k = klem((t - t0) / lama, 0, 1);
    // jarum berbobot: naik cepat, sedikit lewat, lalu tenang di nilainya
    const e = k < 1 ? 1 - Math.pow(1 - k, 3) * Math.cos(k * 5.2) : 1;
    el.textContent = `${Math.max(0, Math.round(ms * e))} ms`;
    if (k < 1) requestAnimationFrame(f);
  };
  requestAnimationFrame(f);
}
tombolCek.addEventListener('click', async () => {
  tombolCek.disabled = true;
  tombolCek.textContent = 'Checking…';
  const target = BARIS.filter((b) => b.dataset.host);
  for (const b of target) { const s = $('.reg-ping', b); s.textContent = '…'; s.className = 'reg-ping'; }
  let jawab = 0;
  await cekSemua(target.map((b) => b.dataset.host), (h, r, i) => {
    const sel = $('.reg-ping', target[i]);
    if (r.ok) { jawab++; sel.classList.add('ok'); hitungNaik(sel, r.ms); }
    else { sel.classList.add('gagal'); sel.textContent = 'no reply'; }
    bunyi('pindai', { i });
  });
  tombolCek.textContent = `${jawab} of ${target.length} answered`;
  tombolCek.disabled = false;
});

// ---- jadwal teknologi menyaring daftar --------------------------------------------------------------------------------
const kotakSaring = $('[data-filter]');
const teksSaring = $('[data-filter-teks]');
function saring(id, nama) {
  $$('.jad-tombol').forEach((t) => t.setAttribute('aria-pressed', t.dataset.tekno === id ? 'true' : 'false'));
  let n = 0;
  for (const b of BARIS) {
    const ya = !id || b.dataset.tekno.split(' ').includes(id);
    b.hidden = !ya;
    if (ya) n++;
  }
  kotakSaring.hidden = !id;
  if (id) teksSaring.textContent = `Showing ${n} of ${BARIS.length} sites that use ${nama}.`;
  kunciPra = null;
  if (lebar.matches) tampilkan(pertama().dataset.kunci, false);
}
$$('.jad-tombol').forEach((t) => t.addEventListener('click', () => {
  const aktif = t.getAttribute('aria-pressed') === 'true';
  saring(aktif ? null : t.dataset.tekno, t.textContent.trim());
  if (!aktif) $('#daftar').scrollIntoView({ behavior: gerakKurang.matches ? 'auto' : 'smooth', block: 'start' });
}));
$('[data-filter-hapus]').addEventListener('click', () => saring(null));

// papan baca matriks: arahkan ke satu tanda untuk melihat situsnya
const papanBaca = $('[data-baca-teks]');
const tabelJadwal = $('.jadwal-tabel');
if (papanBaca && tabelJadwal) {
  tabelJadwal.addEventListener('pointerover', (e) => {
    const td = e.target.closest('td[data-baca]');
    if (td) papanBaca.textContent = td.dataset.baca;
  });
  tabelJadwal.addEventListener('pointerleave', () => { papanBaca.textContent = 'Point at a mark to see the site.'; });
}

// ---- salin email ----------------------------------------------------------------------------------------------------------
for (const b of $$('[data-salin]')) {
  b.addEventListener('click', async () => {
    let ok = false;
    try { await navigator.clipboard.writeText(b.dataset.salin); ok = true; } catch {}
    const label = $('span', b);
    b.classList.add('oke');
    label.textContent = ok ? 'Copied' : 'Press Ctrl+C';
    if (!ok) { const r = document.createRange(); r.selectNodeContents(b.previousElementSibling); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); }
    bunyi('salin');
    setTimeout(() => { b.classList.remove('oke'); label.textContent = 'Copy'; }, 2400);
  });
}

// ---- satu putaran gambar untuk semua yang bergerak bersama gulir ------------------------------------------------------------
let antre = false;
function jadwalkan() {
  if (antre) return;
  antre = true;
  requestAnimationFrame(() => {
    antre = false;
    cekKepala();
    if (U && scrollY < U.H * 1.1) terapkanSampul(posisiSampul());
    hitungLembar();
  });
}
addEventListener('scroll', jadwalkan, { passive: true });
let tungguUkur = 0;
addEventListener('resize', () => {
  clearTimeout(tungguUkur);
  tungguUkur = setTimeout(() => { ukurSampul(); jadwalkan(); }, 120);
});
gerakKurang.addEventListener('change', jadwalkan);

function mulai() {
  ukurSampul();
  ariaGagang();
  terapkanSampul(posisiSampul());
  jadwalkan();
  pembuka();
}
if (document.fonts && document.fonts.status !== 'loaded') document.fonts.ready.then(mulai); else mulai();
// pemilik tidak mencari kursor kejar-kejaran: sentuhan pada layar besar tetap bebas, petunjuk "Drag" hanya untuk mouse
if (!kursorHalus.matches) $('.petunjuk', gagangBesar)?.remove();
