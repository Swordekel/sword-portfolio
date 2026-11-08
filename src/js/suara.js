// Suara antarmuka, disintesis langsung dengan Web Audio (tanpa berkas audio).
// Bunyi hanya pelengkap: tidak pernah membawa informasi sendirian, selalu bisa dimatikan lewat tombol Suara,
// pilihan disimpan di perangkat. Browser baru mengizinkan audio setelah gerakan pertama (klik, ketuk, tombol),
// jadi konteks audio dibuat dan dilanjutkan di gerakan pertama itu.

const KUNCI = 'sword:suara';
const baca = () => { try { return localStorage.getItem(KUNCI); } catch { return null; } };
const tulis = (v) => { try { localStorage.setItem(KUNCI, v); } catch {} };

let nyala = baca() !== '0';
let ctx = null, utama = null, derau = null, siapDipakai = false;
const pendengar = new Set();

function buat() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  try { ctx = new AC({ latencyHint: 'interactive' }); } catch { return null; }
  const kompresor = ctx.createDynamicsCompressor();
  kompresor.threshold.value = -20; kompresor.knee.value = 12; kompresor.ratio.value = 3;
  kompresor.attack.value = 0.002; kompresor.release.value = 0.18;
  utama = ctx.createGain();
  utama.gain.value = 0.62;
  utama.connect(kompresor).connect(ctx.destination);
  // satu detik derau putih, dipakai ulang oleh semua bunyi berbasis derau
  derau = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const d = derau.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return ctx;
}

function bangunkan() {
  if (!nyala) return;
  const c = buat();
  if (!c) return;
  if (c.state === 'suspended') c.resume().then(() => { siapDipakai = true; }).catch(() => {});
  else siapDipakai = true;
}
for (const ev of ['pointerdown', 'keydown', 'touchend']) addEventListener(ev, bangunkan, { capture: true, passive: true });

// ---- bahan dasar -------------------------------------------------------------------------------------------------

const t0 = () => ctx.currentTime + 0.004;

function selubung(g, waktu, puncak, serang, luruh) {
  g.gain.setValueAtTime(0.0001, waktu);
  g.gain.linearRampToValueAtTime(puncak, waktu + serang);
  g.gain.exponentialRampToValueAtTime(0.0001, waktu + serang + luruh);
}

function geser(pan) {
  if (!pan || !ctx.createStereoPanner) return utama;
  const p = ctx.createStereoPanner();
  p.pan.value = Math.max(-1, Math.min(1, pan));
  p.connect(utama);
  return p;
}

// semburan derau tersaring: klik, desis, sapuan
function semburan({ waktu = t0(), lama = 0.02, puncak = 0.1, serang = 0.001, jenis = 'bandpass', f = 3000, f2 = null, q = 1,
  laju = 1, pan = 0 } = {}) {
  const s = ctx.createBufferSource();
  s.buffer = derau; s.playbackRate.value = laju;
  const saring = ctx.createBiquadFilter();
  saring.type = jenis; saring.frequency.setValueAtTime(f, waktu); saring.Q.value = q;
  if (f2) saring.frequency.exponentialRampToValueAtTime(f2, waktu + lama);
  const g = ctx.createGain();
  selubung(g, waktu, puncak, serang, Math.max(0.005, lama - serang));
  s.connect(saring).connect(g).connect(geser(pan));
  const awal = Math.random() * 0.5;
  s.start(waktu, awal, lama + 0.05);
}

// nada dengan turunan pitch: dentum, ketuk
function nada({ waktu = t0(), f = 200, f2 = null, lama = 0.1, puncak = 0.2, serang = 0.002, bentuk = 'sine', pan = 0 } = {}) {
  const o = ctx.createOscillator();
  o.type = bentuk; o.frequency.setValueAtTime(f, waktu);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, waktu + lama);
  const g = ctx.createGain();
  selubung(g, waktu, puncak, serang, lama);
  o.connect(g).connect(geser(pan));
  o.start(waktu); o.stop(waktu + serang + lama + 0.05);
}

// logam: parsial tak harmonis seperti bilah yang dipukul atau diasah
function logam({ waktu = t0(), f = 1900, puncak = 0.06, lama = 0.7, pan = 0 } = {}) {
  const parsial = [[1, 1, 1], [1.414, 0.55, 0.72], [2.13, 0.42, 0.55], [2.97, 0.28, 0.4], [4.21, 0.18, 0.28], [5.87, 0.1, 0.2]];
  for (const [r, a, l] of parsial) {
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(f * r * (1 + (Math.random() - 0.5) * 0.004), waktu);
    const g = ctx.createGain();
    selubung(g, waktu, puncak * a, 0.002, lama * l);
    o.connect(g).connect(geser(pan));
    o.start(waktu); o.stop(waktu + lama * l + 0.06);
  }
}

// ---- kosakata bunyi ----------------------------------------------------------------------------------------------
// Setiap bunyi: nama -> fungsi(opsi). Arah desain menambah atau mengganti lewat daftarkan().

const BUNYI = {
  // sentuhan halus saat kursor masuk ke tombol atau baris
  sentuh: ({ pan = 0 } = {}) => semburan({ lama: 0.014, puncak: 0.05, f: 4200 + Math.random() * 900, q: 1.4, pan }),
  // tekan: ketuk kayu kecil
  tekan: ({ pan = 0 } = {}) => {
    const w = t0();
    nada({ waktu: w, f: 210, f2: 120, lama: 0.07, puncak: 0.16, pan });
    semburan({ waktu: w, lama: 0.008, puncak: 0.07, jenis: 'highpass', f: 2200, pan });
  },
  // sapuan: perpindahan panel atau gambar
  sapu: ({ pan = 0, naik = true } = {}) => semburan({ lama: 0.24, puncak: 0.07, serang: 0.05, f: naik ? 600 : 2600, f2: naik ? 2600 : 600, q: 0.7, pan }),
  // nyala / mati
  hidup: () => { const w = t0(); semburan({ waktu: w, lama: 0.01, puncak: 0.06, f: 3200 }); semburan({ waktu: w + 0.06, lama: 0.012, puncak: 0.07, f: 4600 }); },
  padam: () => { const w = t0(); semburan({ waktu: w, lama: 0.012, puncak: 0.06, f: 4600 }); semburan({ waktu: w + 0.06, lama: 0.01, puncak: 0.05, f: 2800 }); },
  // salin ke papan klip
  salin: () => { const w = t0(); nada({ waktu: w, f: 1320, lama: 0.05, puncak: 0.045 }); nada({ waktu: w + 0.055, f: 1760, lama: 0.08, puncak: 0.04 }); },
  // bilah: desis lalu dering logam
  bilah: ({ pan = 0, kuat = 1 } = {}) => {
    const w = t0();
    semburan({ waktu: w, lama: 0.16, puncak: 0.07 * kuat, serang: 0.03, jenis: 'highpass', f: 2500, f2: 6500, q: 0.6, pan });
    logam({ waktu: w + 0.05, f: 1850 + Math.random() * 120, puncak: 0.035 * kuat, lama: 0.75, pan });
  },
  // cap stempel: dentum rendah dan suara kertas
  cap: () => {
    const w = t0();
    nada({ waktu: w, f: 95, f2: 55, lama: 0.14, puncak: 0.32 });
    semburan({ waktu: w, lama: 0.05, puncak: 0.12, jenis: 'lowpass', f: 900 });
    semburan({ waktu: w + 0.01, lama: 0.06, puncak: 0.05, jenis: 'highpass', f: 3000 });
  },
  // pindai: kedip pendek yang sangat pelan, per baris
  pindai: ({ i = 0 } = {}) => nada({ f: 1650 + (i % 6) * 70, lama: 0.035, puncak: 0.03, serang: 0.003, bentuk: 'triangle' }),
  // kertas: lembar bergeser
  kertas: () => semburan({ lama: 0.32, puncak: 0.05, serang: 0.08, jenis: 'bandpass', f: 1400, f2: 700, q: 0.5 }),
};

export function daftarkan(nama, fungsi) { BUNYI[nama] = fungsi; }

// bunyi terus-menerus yang dikendalikan langsung (gesekan bilah saat diseret, desis papan flap):
// const g = suaraTerus({ jenis: 'bandpass', f: 2600, q: 1.2 }); g.atur(kuat 0..1, frekuensi?); g.henti();
// mengembalikan objek kosong yang aman dipanggil bila suara mati atau browser belum mengizinkan audio.
export function suaraTerus({ jenis = 'bandpass', f = 2600, q = 1.1, maks = 0.12, pan = 0 } = {}) {
  const diam = { atur() {}, henti() {} };
  if (!nyala || !siapDipakai || !ctx || ctx.state !== 'running') return diam;
  try {
    const s = ctx.createBufferSource();
    s.buffer = derau; s.loop = true;
    const saring = ctx.createBiquadFilter();
    saring.type = jenis; saring.frequency.value = f; saring.Q.value = q;
    const g = ctx.createGain();
    g.gain.value = 0.0001;
    s.connect(saring).connect(g).connect(geser(pan));
    s.start();
    let habis = false;
    return {
      atur(kuat, frek) {
        if (habis) return;
        const w = ctx.currentTime;
        g.gain.setTargetAtTime(Math.max(0.0001, Math.min(1, kuat)) * maks, w, 0.03);
        if (frek) saring.frequency.setTargetAtTime(frek, w, 0.05);
      },
      henti() {
        if (habis) return;
        habis = true;
        const w = ctx.currentTime;
        g.gain.setTargetAtTime(0.0001, w, 0.04);
        s.stop(w + 0.3);
      },
    };
  } catch { return diam; }
}

export function bunyi(nama, opsi) {
  if (!nyala || !siapDipakai || !ctx || ctx.state !== 'running') return;
  const f = BUNYI[nama];
  if (!f) return;
  try { f(opsi || {}); } catch {}
}

export function suaraNyala() { return nyala; }

export function aturSuara(v) {
  nyala = !!v;
  tulis(nyala ? '1' : '0');
  if (nyala) { bangunkan(); } else if (ctx && ctx.state === 'running') { ctx.suspend().catch(() => {}); siapDipakai = false; }
  for (const f of pendengar) f(nyala);
}

export function saatBerubah(f) { pendengar.add(f); return () => pendengar.delete(f); }

// pan dari posisi elemen di layar: kiri terdengar di kiri, kanan di kanan
export function panDari(el) {
  if (!el || !el.getBoundingClientRect) return 0;
  const r = el.getBoundingClientRect();
  return Math.max(-0.7, Math.min(0.7, ((r.left + r.width / 2) / innerWidth) * 2 - 1)) * 0.8;
}

// pasang bunyi ke elemen bertanda: data-suara="tekan" (klik) dan sentuhan halus saat kursor masuk (mouse saja)
export function pasangOtomatis(akar = document) {
  akar.addEventListener('pointerover', (e) => {
    if (e.pointerType !== 'mouse') return;
    const el = e.target.closest('a, button, [data-suara-sentuh]');
    if (!el || el.contains(e.relatedTarget) || el.hasAttribute('data-sunyi')) return;
    bunyi('sentuh', { pan: panDari(el) });
  });
  akar.addEventListener('click', (e) => {
    const el = e.target.closest('[data-suara]');
    if (!el) return;
    bunyi(el.dataset.suara || 'tekan', { pan: panDari(el) });
  });
}
