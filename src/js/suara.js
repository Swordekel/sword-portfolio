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

// rantai keluaran: penguat utama -> kompresor (menjinakkan puncak) -> speaker; dipakai juga oleh rekamUji()
const GAIN_UTAMA = 1;
function rantai(c) {
  const kompresor = c.createDynamicsCompressor();
  kompresor.threshold.value = -9; kompresor.knee.value = 4; kompresor.ratio.value = 12;
  kompresor.attack.value = 0.001; kompresor.release.value = 0.12;
  const g = c.createGain();
  g.gain.value = GAIN_UTAMA;
  g.connect(kompresor).connect(c.destination);
  // satu detik derau putih, dipakai ulang oleh semua bunyi berbasis derau
  const n = c.createBuffer(1, c.sampleRate, c.sampleRate);
  const d = n.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return { g, n };
}

function buat() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  try { ctx = new AC({ latencyHint: 'interactive' }); } catch { return null; }
  const r = rantai(ctx);
  utama = r.g; derau = r.n;
  return ctx;
}

let sudahSapa = false;
function tandai() { try { document.documentElement.dataset.suara = statusSuara(); } catch {} for (const f of pendengar) f(nyala); }
function siap() {
  siapDipakai = true;
  tandai();
  if (!sudahSapa) { sudahSapa = true; setTimeout(() => bunyi('hidup'), 30); }
}
function bangunkan() {
  if (!nyala) return;
  const c = buat();
  if (!c) return;
  if (c.state === 'suspended') c.resume().then(siap).catch(() => {});
  else if (!siapDipakai) siap();
}
for (const ev of ['pointerdown', 'keydown', 'touchend']) addEventListener(ev, bangunkan, { capture: true, passive: true });
queueMicrotask(tandai);

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

// penguat penyeimbang untuk derau yang disaring: lebar pita yang lolos dibanding seluruh pita (derau putih kehilangan
// energinya sebanding dengan pita yang dibuang filter)
function imbang(jenis, f, q) {
  const ny = ctx.sampleRate / 2;
  const lebar = jenis === 'bandpass' ? f / Math.max(q, 0.3) : jenis === 'highpass' ? ny - f : jenis === 'lowpass' ? f : ny;
  return Math.min(5, Math.sqrt(ny / Math.max(200, lebar)));
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
  selubung(g, waktu, puncak * imbang(jenis, Math.sqrt(f * (f2 || f)), q), serang, Math.max(0.005, lama - serang));
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
  // sentuhan halus saat kursor masuk ke tombol atau baris: kedip kecil yang jernih
  sentuh: ({ pan = 0 } = {}) => {
    const w = t0();
    nada({ waktu: w, f: 2650 + Math.random() * 300, lama: 0.03, puncak: 0.34, serang: 0.0015, pan });
    semburan({ waktu: w, lama: 0.007, puncak: 0.1, jenis: 'highpass', f: 3500, pan });
  },
  // tekan: ketuk kayu kecil yang terdengar di speaker laptop
  tekan: ({ pan = 0 } = {}) => {
    const w = t0();
    nada({ waktu: w, f: 1180, f2: 690, lama: 0.07, puncak: 0.95, pan });
    nada({ waktu: w, f: 2360, lama: 0.03, puncak: 0.26, bentuk: 'triangle', pan });
    semburan({ waktu: w, lama: 0.008, puncak: 0.45, jenis: 'highpass', f: 2600, pan });
  },
  // sapuan: perpindahan panel atau gambar
  sapu: ({ pan = 0, naik = true } = {}) => semburan({ lama: 0.27, puncak: 0.13, serang: 0.06, f: naik ? 900 : 4200, f2: naik ? 4200 : 900, q: 0.9, pan }),
  // nyala / mati: dua nada naik atau turun
  hidup: () => { const w = t0(); nada({ waktu: w, f: 880, lama: 0.07, puncak: 0.2 }); nada({ waktu: w + 0.075, f: 1318.5, lama: 0.11, puncak: 0.2 }); },
  padam: () => { const w = t0(); nada({ waktu: w, f: 1318.5, lama: 0.07, puncak: 0.18 }); nada({ waktu: w + 0.075, f: 880, lama: 0.11, puncak: 0.16 }); },
  // salin ke papan klip
  salin: () => { const w = t0(); nada({ waktu: w, f: 1568, lama: 0.06, puncak: 0.18 }); nada({ waktu: w + 0.065, f: 2093, lama: 0.14, puncak: 0.17 }); },
  // bilah: desis lalu dering logam
  bilah: ({ pan = 0, kuat = 1 } = {}) => {
    const w = t0();
    semburan({ waktu: w, lama: 0.18, puncak: 0.26 * kuat, serang: 0.03, jenis: 'highpass', f: 2800, f2: 8000, q: 0.7, pan });
    logam({ waktu: w + 0.05, f: 2150 + Math.random() * 140, puncak: 0.12 * kuat, lama: 0.95, pan });
  },
  // cap stempel: ketuk tumpul di nada tengah, hentakan, dan suara kertas
  cap: () => {
    const w = t0();
    nada({ waktu: w, f: 430, f2: 170, lama: 0.12, puncak: 0.95 });
    semburan({ waktu: w, lama: 0.05, puncak: 0.6, jenis: 'lowpass', f: 2400 });
    semburan({ waktu: w + 0.008, lama: 0.07, puncak: 0.16, jenis: 'highpass', f: 3200 });
  },
  // pindai: kedip pendek per baris yang dicek
  pindai: ({ i = 0 } = {}) => nada({ f: 2300 + (i % 6) * 90, lama: 0.045, puncak: 0.4, serang: 0.002 }),
  // kertas: lembar bergeser
  kertas: () => semburan({ lama: 0.3, puncak: 0.1, serang: 0.08, jenis: 'bandpass', f: 2600, f2: 1200, q: 0.6 }),
};

// Bahan dasar untuk bunyi buatan sendiri. Panggil HANYA di dalam fungsi yang didaftarkan lewat daftarkan(),
// karena bunyi() yang memastikan konteks audio sudah berjalan sebelum fungsi itu dipanggil. Contoh:
//   daftarkan('flap', () => { const w = t0(); for (let i = 0; i < 6; i++) semburan({ waktu: w + i * 0.018, lama: 0.006, puncak: 0.06, f: 2400 }); });
//   bunyi('flap');
export { semburan, nada, logam, t0 };

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
    const kali = imbang(jenis, f, q);
    return {
      atur(kuat, frek) {
        if (habis) return;
        const w = ctx.currentTime;
        g.gain.setTargetAtTime(Math.max(0.0001, Math.min(1, kuat)) * maks * kali, w, 0.03);
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

// keadaan audio untuk tombol Suara: 'mati' (dimatikan pengguna), 'tunggu' (menunggu klik pertama), 'jalan'
export function statusSuara() {
  if (!nyala) return 'mati';
  return siapDipakai && ctx && ctx.state === 'running' ? 'jalan' : 'tunggu';
}

// rekam satu bunyi tanpa memutarnya (untuk uji level): puncak dan RMS dalam dBFS, lama bagian yang terdengar,
// dan perkiraan pusat frekuensinya
export async function rekamUji(nama, opsi = {}, detik = 1.4) {
  const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const off = new OAC(1, Math.ceil(44100 * detik), 44100);
  const simpan = [ctx, utama, derau];
  ctx = off;
  const r = rantai(off);
  utama = r.g; derau = r.n;
  try { BUNYI[nama](opsi); } finally { [ctx, utama, derau] = simpan; }
  const buf = await off.startRendering();
  const x = buf.getChannelData(0);
  let puncak = 0, jumlah = 0, n = 0, awal = -1, akhir = 0, silang = 0;
  for (let i = 0; i < x.length; i++) {
    const a = Math.abs(x[i]);
    if (a > puncak) puncak = a;
    if (a > 0.003) { if (awal < 0) awal = i; akhir = i; }
  }
  for (let i = Math.max(1, awal); i <= akhir; i++) { jumlah += x[i] * x[i]; n++; if ((x[i] >= 0) !== (x[i - 1] >= 0)) silang++; }
  const db = (v) => (v > 0 ? Math.round(20 * Math.log10(v) * 10) / 10 : -Infinity);
  const lama = n / 44100;
  return { nama, puncakDb: db(puncak), rmsDb: db(Math.sqrt(jumlah / Math.max(1, n))), lamaMs: Math.round(lama * 1000), pusatHz: Math.round(silang / 2 / Math.max(lama, 1e-6)) };
}

export function namaBunyi() { return Object.keys(BUNYI); }

export function aturSuara(v) {
  nyala = !!v;
  tulis(nyala ? '1' : '0');
  sudahSapa = true; // tombol Suara punya bunyinya sendiri
  if (nyala) { bangunkan(); } else if (ctx && ctx.state === 'running') { ctx.suspend().catch(() => {}); siapDipakai = false; }
  tandai();
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
