// Arah D, "Standar Premium": navigasi kaca, tombol suara, salin email, bingkai karya yang mengendap saat masuk layar,
// dan indeks 18 situs: di layar lebar baris yang disorot mengganti pratinjau besar di sampingnya, di HP baris
// membuka di tempat. Status live setiap situs dicek dari browser pengunjung saat indeks pertama kali terlihat.
import { bunyi, aturSuara, suaraNyala, pasangOtomatis, panDari } from '/js/suara.js';

const gerakKurang = matchMedia('(prefers-reduced-motion: reduce)');
const kabar = document.getElementById('kabar');
const umumkan = (teks) => { kabar.textContent = ''; requestAnimationFrame(() => { kabar.textContent = teks; }); };

// ---- suara -------------------------------------------------------------------------------------------------------
pasangOtomatis(document);
const tombolSuara = document.getElementById('suara');
const segarSuara = () => tombolSuara.setAttribute('aria-pressed', String(suaraNyala()));
segarSuara();
tombolSuara.addEventListener('click', () => {
  if (suaraNyala()) {
    bunyi('padam');
    tombolSuara.setAttribute('aria-pressed', 'false');
    setTimeout(() => aturSuara(false), 180);
    umumkan('Sound off');
  } else {
    aturSuara(true);
    segarSuara();
    setTimeout(() => bunyi('hidup'), 80);
    umumkan('Sound on');
  }
});

// ---- navigasi kaca setelah halaman bergulir ------------------------------------------------------------------------
const nav = document.getElementById('nav');
let navTunggu = false;
const segarNav = () => { navTunggu = false; nav.classList.toggle('kaca', scrollY > 8); };
addEventListener('scroll', () => { if (!navTunggu) { navTunggu = true; requestAnimationFrame(segarNav); } }, { passive: true });
segarNav();

// ---- salin email -------------------------------------------------------------------------------------------------------
function salinLama(teks) {
  const t = document.createElement('textarea');
  t.value = teks; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
  document.body.appendChild(t); t.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch {}
  t.remove();
  return ok;
}
for (const b of document.querySelectorAll('[data-salin]')) {
  b.addEventListener('click', async () => {
    const teks = b.dataset.salin;
    let ok = false;
    try { await navigator.clipboard.writeText(teks); ok = true; } catch { ok = salinLama(teks); }
    const label = b.querySelector('.salin-teks');
    if (!ok) { umumkan('Could not copy. The address is ' + teks); return; }
    b.classList.add('disalin');
    if (label) label.textContent = 'Copied';
    bunyi('salin', { pan: panDari(b) });
    umumkan('Email address copied');
    clearTimeout(b._t);
    b._t = setTimeout(() => { b.classList.remove('disalin'); if (label) label.textContent = 'Copy'; }, 2400);
  });
}

// ---- bingkai karya mengendap ---------------------------------------------------------------------------------------------
const endap = document.querySelectorAll('.mengendap:not(.mendarat)');
if ('IntersectionObserver' in window && !gerakKurang.matches) {
  const io = new IntersectionObserver((daftar) => {
    for (const e of daftar) if (e.isIntersecting) { e.target.classList.add('mendarat'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
  endap.forEach((el) => io.observe(el));
} else {
  endap.forEach((el) => el.classList.add('mendarat'));
}

// ---- indeks 18 situs -----------------------------------------------------------------------------------------------------
const daftar = document.getElementById('daftar');
const baris = [...daftar.querySelectorAll('.rad')];
const lebar = matchMedia('(min-width: 900px)');
const pv = document.querySelector('.pv-bingkai');
const pvNama = document.querySelector('.pv-nama');
const pvBaris = document.querySelector('.pv-baris');
const pvHidup = document.querySelector('.pv-hidup');
const pvBuka = document.querySelector('.pv-buka');
let aktif = null;
let giliran = 0;
let sapuTerakhir = 0;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const tombolDari = (r) => r.querySelector('.rad-tombol');

function teksHidup(r) {
  const host = r.dataset.host;
  if (r.classList.contains('ok')) return `${host} · answered in ${r.dataset.ms} ms from your browser`;
  if (r.classList.contains('gagal')) return `${host} · no answer from your network right now`;
  if (r.dataset.diperiksa) return `${host} · checking…`;
  return host;
}

function gantiGambar(r) {
  pv.dataset.diganti = '1';
  const nomor = ++giliran;
  const lama = [...pv.children];
  const selesai = (baru) => {
    if (nomor !== giliran) return;
    pv.appendChild(baru);
    const jalan = () => baru.classList.add('jalan');
    if (gerakKurang.matches) jalan(); else requestAnimationFrame(() => requestAnimationFrame(jalan));
    setTimeout(() => { if (nomor === giliran) lama.forEach((x) => x.remove()); }, gerakKurang.matches ? 0 : 720);
  };
  if (r.dataset.tertutup || !r.dataset.desk) {
    const kosong = document.createElement('div');
    kosong.className = 'pv-kosong masuk';
    kosong.innerHTML = `<span class="mono">${esc(r.dataset.host)}</span><span>Sign-in only. Part of the ARSWORD platform.</span>`;
    selesai(kosong);
    return;
  }
  const img = new Image();
  img.decoding = 'async';
  img.className = 'masuk';
  img.alt = r.dataset.baris;
  img.sizes = '(min-width: 900px) 46vw, 0px';
  img.srcset = r.dataset.desk;
  img.width = 960;
  img.height = 600;
  if (img.complete) selesai(img); else { img.onload = () => selesai(img); img.onerror = () => selesai(img); }
}

function tampilkan(r, { suara = true, gambar = true } = {}) {
  if (!r || r === aktif) return;
  if (aktif) { aktif.classList.remove('aktif'); tombolDari(aktif).removeAttribute('aria-current'); }
  aktif = r;
  r.classList.add('aktif');
  tombolDari(r).setAttribute('aria-current', 'true');
  pvNama.innerHTML = `<b>${esc(r.dataset.nama)}</b> <span class="lencana" data-status="${r.dataset.status}">${esc(r.dataset.label)}</span>`;
  pvBaris.textContent = r.dataset.baris;
  pvHidup.textContent = teksHidup(r);
  if (r.dataset.tertutup) { pvBuka.hidden = true; } else { pvBuka.hidden = false; pvBuka.href = r.dataset.url; pvBuka.setAttribute('aria-label', `Open ${r.dataset.host} in a new tab`); }
  if (gambar) gantiGambar(r);
  const kini = performance.now();
  if (suara && kini - sapuTerakhir > 130) { sapuTerakhir = kini; bunyi('sapu', { pan: 0.35 }); }
}

// saat berpindah ukuran layar: di layar lebar tombol baris memilih pratinjau, di HP tombol membuka panel
function aturMode() {
  for (const r of baris) {
    const b = tombolDari(r);
    if (lebar.matches) {
      b.removeAttribute('aria-expanded');
      r.classList.remove('buka-panel');
    } else {
      b.setAttribute('aria-expanded', String(r.classList.contains('buka-panel')));
      b.removeAttribute('aria-current');
    }
  }
  if (lebar.matches) {
    const pertama = aktif && !aktif.hidden ? aktif : baris.find((r) => !r.hidden);
    // pratinjau di HTML sudah menampilkan baris pertama: cukup tandai, jangan muat ulang gambarnya
    const sama = pertama && pv.dataset.kunci === pertama.dataset.kunci && !pv.dataset.diganti;
    aktif = null;
    tampilkan(pertama, { suara: false, gambar: !sama });
  }
}

for (const r of baris) {
  const b = tombolDari(r);
  b.addEventListener('pointerenter', (e) => { if (lebar.matches && e.pointerType === 'mouse') tampilkan(r); });
  b.addEventListener('focus', () => { if (lebar.matches) tampilkan(r); });
  b.addEventListener('click', () => {
    if (lebar.matches) { tampilkan(r); return; }
    const buka = !r.classList.contains('buka-panel');
    r.classList.toggle('buka-panel', buka);
    b.setAttribute('aria-expanded', String(buka));
    bunyi(buka ? 'sapu' : 'tekan', { pan: panDari(b), naik: buka });
  });
}
lebar.addEventListener('change', aturMode);
aturMode();

// saring menurut label
const chip = [...document.querySelectorAll('[data-saring]')];
for (const c of chip) {
  c.addEventListener('click', () => {
    for (const x of chip) x.setAttribute('aria-pressed', String(x === c));
    const s = c.dataset.saring;
    let n = 0;
    for (const r of baris) { r.hidden = !(s === 'semua' || r.dataset.status === s); if (!r.hidden) n++; }
    if (lebar.matches && (!aktif || aktif.hidden)) { const p = baris.find((r) => !r.hidden); aktif = null; tampilkan(p, { suara: false }); }
    umumkan(`Showing ${n} of ${baris.length} sites`);
  });
}

// cek live: HEAD ke halaman depan setiap situs (selalu 200; /favicon.ico tidak ada di beberapa situs dan membuat
// error 404 di console). Ketukan pertama membuka koneksi, ketukan kedua yang diukur.
async function ketuk(host) {
  const ctrl = new AbortController();
  const batas = setTimeout(() => ctrl.abort(), 8000);
  const opsi = { method: 'HEAD', mode: 'no-cors', cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer', signal: ctrl.signal };
  try {
    await fetch(`https://${host}/?cek=${Date.now().toString(36)}`, opsi);
    const mulai = performance.now();
    await fetch(`https://${host}/?cek=${(Date.now() + 1).toString(36)}`, opsi);
    return { ok: true, ms: Math.round(performance.now() - mulai) };
  } catch {
    return { ok: false };
  } finally {
    clearTimeout(batas);
  }
}
async function cekSemua(hosts, saatHasil, { serentak = 3 } = {}) {
  const antre = hosts.map((h, i) => ({ h, i }));
  const kerja = async () => { while (antre.length) { const { h, i } = antre.shift(); saatHasil(h, await ketuk(h), i); } };
  await Promise.all(Array.from({ length: Math.min(serentak, hosts.length) }, kerja));
}

// cek live sekali, saat indeks mulai terlihat
const bagian = document.getElementById('index');
let sudahCek = false;
function cekLive() {
  if (sudahCek) return;
  sudahCek = true;
  const periksa = baris.filter((r) => r.dataset.host);
  periksa.forEach((r) => { r.dataset.diperiksa = '1'; });
  if (aktif) pvHidup.textContent = teksHidup(aktif);
  cekSemua(periksa.map((r) => r.dataset.host), (host, hasil, i) => {
    const r = periksa[i];
    r.classList.add(hasil.ok ? 'ok' : 'gagal');
    if (hasil.ok) r.dataset.ms = hasil.ms;
    const titik = r.querySelector('.hidup');
    if (titik) titik.setAttribute('title', hasil.ok ? `Answered in ${hasil.ms} ms` : 'No answer right now');
    if (r === aktif) pvHidup.textContent = teksHidup(r);
  }, { serentak: 3 });
}
if ('IntersectionObserver' in window) {
  const io2 = new IntersectionObserver((e) => { if (e.some((x) => x.isIntersecting)) { cekLive(); io2.disconnect(); } }, { rootMargin: '200px 0px' });
  io2.observe(bagian);
} else {
  cekLive();
}
