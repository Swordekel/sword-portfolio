// Arah E, Personal: panel studio (tangkapan karya di belakang potret, mekar berwarna saat disentuh), cek live,
// penyaring daftar situs, salin email, dan suara.
import { bunyi, aturSuara, suaraNyala, saatBerubah, pasangOtomatis } from '/js/suara.js';
import { cekSemua } from '/js/ping.js';

const $ = (s, a = document) => a.querySelector(s);
const $$ = (s, a = document) => [...a.querySelectorAll(s)];
const gerakKurang = matchMedia('(prefers-reduced-motion: reduce)');

// suara
pasangOtomatis();
const tombolSuara = $('.tombol-suara');
const sinkron = (on) => tombolSuara.setAttribute('aria-pressed', on ? 'true' : 'false');
sinkron(suaraNyala());
saatBerubah(sinkron);
tombolSuara.addEventListener('click', () => {
  if (suaraNyala()) { bunyi('padam'); setTimeout(() => aturSuara(false), 140); }
  else { aturSuara(true); setTimeout(() => bunyi('hidup'), 90); }
});

// kepala menjadi kaca setelah halaman digulir
const kepala = $('[data-kepala]');
const cekKepala = () => kepala.classList.toggle('gulir', scrollY > 8);
addEventListener('scroll', cekKepala, { passive: true });
cekKepala();

// panel studio: arahkan kursor (atau ketuk di HP) supaya karya di belakang berhenti dan tampil berwarna
const studio = $('[data-studio]');
function mekar(nyala) {
  if (studio.classList.contains('mekar') === nyala) return;
  studio.classList.toggle('mekar', nyala);
  if (nyala) bunyi('sapu', { pan: 0.4 });
}
studio.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') mekar(true); });
studio.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') mekar(false); });
studio.addEventListener('click', () => mekar(!studio.classList.contains('mekar')));
// gerakan berhenti saat panel tidak terlihat (hemat baterai di HP)
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([e]) => {
    for (const a of $$('.arus-isi', studio)) a.style.animationPlayState = e.isIntersecting ? '' : 'paused';
  }).observe(studio);
}

// cek live: setiap situs dihubungi dari browser pengunjung, hasilnya mengisi panel dan kartu karya
const chip = $('[data-chip]');
const chipTeks = $('span', chip);
const hostKarya = new Map($$('[data-hidup]').map((el) => [el.dataset.hidup, el]));
const semuaHost = [...new Set([...$$('.kisi-situs li a.mini').map((a) => new URL(a.href).host), ...hostKarya.keys(), 'chat.arswordlab.com'])];

function hitung(el, akhir, susun) {
  if (gerakKurang.matches) { el.textContent = susun(akhir); return; }
  const t0 = performance.now(), lama = 520;
  const f = (t) => {
    const k = Math.min(1, (t - t0) / lama);
    el.textContent = susun(Math.round(akhir * (1 - Math.pow(1 - k, 3))));
    if (k < 1) requestAnimationFrame(f);
  };
  requestAnimationFrame(f);
}

async function cekLive() {
  chip.classList.add('tunggu');
  for (const el of hostKarya.values()) el.classList.add('tunggu');
  let jawab = 0;
  await cekSemua(semuaHost, (h, r) => {
    if (r.ok) jawab++;
    chipTeks.textContent = `${jawab} of ${semuaHost.length} sites answered…`;
    const el = hostKarya.get(h);
    if (el) {
      el.classList.remove('tunggu');
      const teks = $('span', el);
      if (r.ok) hitung(teks, r.ms, (v) => `Live · ${v} ms from you`);
      else { el.classList.add('gagal'); teks.textContent = 'No reply right now'; }
    }
    bunyi('pindai', { i: jawab });
  });
  chip.classList.remove('tunggu');
  chipTeks.textContent = jawab === semuaHost.length ? `All ${jawab} sites live right now` : `${jawab} of ${semuaHost.length} sites live right now`;
}
const mulaiCek = () => cekLive().catch(() => { chipTeks.textContent = '18 sites on arswordlab.com'; chip.classList.remove('tunggu'); });
if ('requestIdleCallback' in window) requestIdleCallback(mulaiCek, { timeout: 2500 }); else setTimeout(mulaiCek, 1200);

// rekaman layar: setiap video baru diunduh saat kartunya terlihat, berputar selama terlihat, berhenti saat lewat.
// Tidak diputar otomatis bila pengunjung memilih gerak dikurangi atau mode hemat data.
const hemat = !!(navigator.connection && navigator.connection.saveData);
const lebarLayar = matchMedia('(min-width: 701px)');
function putar(v) {
  if (gerakKurang.matches || hemat) return;
  if (!v.src) {
    v.src = (lebarLayar.matches && v.dataset.besar) || v.dataset.kecil;
    v.addEventListener('playing', () => v.classList.add('main'), { once: true });
  }
  const p = v.play();
  if (p && p.catch) p.catch(() => {});
}
const rasio = new Map();
const batasPutar = () => (matchMedia('(pointer: coarse)').matches || innerWidth < 760 ? 2 : 6);
let antreAtur = 0;
function aturPutar() {
  antreAtur = 0;
  const tengah = innerHeight / 2;
  const calon = [...rasio].filter(([, r]) => r >= 0.3).map(([v, r]) => {
    const b = v.getBoundingClientRect();
    return { v, skor: r * 2 - Math.abs(b.top + b.height / 2 - tengah) / innerHeight };
  }).sort((a, b) => b.skor - a.skor);
  const pilih = new Set(calon.slice(0, batasPutar()).map((c) => c.v));
  for (const v of $$('video.vid')) {
    if (pilih.has(v)) putar(v);
    else if (!v.paused) v.pause();
  }
}
const jadwalAtur = () => { if (!antreAtur) antreAtur = setTimeout(aturPutar, 120); };
if ('IntersectionObserver' in window) {
  const pengamat = new IntersectionObserver((daftar) => {
    for (const e of daftar) {
      if (e.isIntersecting) rasio.set(e.target, e.intersectionRatio);
      else rasio.delete(e.target);
    }
    jadwalAtur();
  }, { threshold: [0, 0.3, 0.6, 0.9] });
  for (const v of $$('video.vid')) pengamat.observe(v);
  addEventListener('scroll', jadwalAtur, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) for (const v of $$('video.vid')) v.pause(); else jadwalAtur();
  });
}
// iPhone dalam mode hemat daya menolak autoplay: ketukan pertama di halaman mencoba lagi
addEventListener('touchend', () => { if ('IntersectionObserver' in window) aturPutar(); }, { once: true, passive: true });

// penyaring daftar semua situs
const kisi = $('[data-kisi]');
for (const t of $$('[data-saring]')) {
  t.addEventListener('click', () => {
    $$('[data-saring]').forEach((x) => x.setAttribute('aria-pressed', String(x === t)));
    const s = t.dataset.saring;
    for (const li of $$('li', kisi)) li.hidden = !(s === 'semua' || li.dataset.status === s);
  });
}

// salin email
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
