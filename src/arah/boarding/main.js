// Arah C, Boarding Pass + Papan Gate: papan hidup (cek host dari browser pengunjung), susun ulang ala flap
// (baris berpindah tempat dengan identitasnya, ubin nomor berputar, baris yang berpindah kuning sampai dilihat),
// jam Jakarta, salin email, suara. Modul bersama diimpor dengan alamat polos supaya satu instans saja.
import { bunyi, daftarkan, aturSuara, suaraNyala, pasangOtomatis, panDari, semburan, nada, t0 } from '/js/suara.js';
import { cekSemua } from '/js/ping.js';

const akar = document.documentElement;
akar.classList.remove('no-js');
akar.classList.add('js');
const kurang = matchMedia('(prefers-reduced-motion: reduce)');
const umum = document.querySelector('[data-umum]');
function ucap(teks) {
  if (!umum) return;
  umum.textContent = '';
  setTimeout(() => { umum.textContent = teks; }, 40);
}

// ---- bunyi khusus papan ------------------------------------------------------------------------------------------
// derak flap: rentetan klik pendek tersaring, sesekali ketukan rendah dari poros
daftarkan('flap', ({ n = 10, pan = 0 } = {}) => {
  const w = t0();
  let t = 0;
  for (let i = 0; i < n; i++) {
    t += 0.015 + Math.random() * 0.011;
    semburan({ waktu: w + t, lama: 0.005, puncak: 0.04 + Math.random() * 0.025, f: 2000 + Math.random() * 1500, q: 1.8, pan });
    if (i % 4 === 0) nada({ waktu: w + t, f: 150, f2: 95, lama: 0.018, puncak: 0.022, pan });
  }
});
// panggilan: dua nada lembut seperti pengumuman terminal, hanya setelah pemeriksaan selesai
daftarkan('panggil', () => {
  const w = t0();
  nada({ waktu: w, f: 659.25, lama: 0.55, puncak: 0.03, serang: 0.012 });
  nada({ waktu: w + 0.34, f: 523.25, lama: 0.8, puncak: 0.026, serang: 0.012 });
});

// ---- tombol suara -------------------------------------------------------------------------------------------------
const tSuara = document.querySelector('[data-bunyi]');
const tampilSuara = () => tSuara && tSuara.setAttribute('aria-pressed', String(suaraNyala()));
tampilSuara();
tSuara?.addEventListener('click', () => {
  if (suaraNyala()) {
    bunyi('padam');
    tSuara.setAttribute('aria-pressed', 'false');
    setTimeout(() => { aturSuara(false); tampilSuara(); }, 150);
    ucap('Sound off');
  } else {
    aturSuara(true);
    tampilSuara();
    setTimeout(() => bunyi('hidup'), 90);
    ucap('Sound on');
  }
});
pasangOtomatis();

// ---- ubin flap ------------------------------------------------------------------------------------------------------
// setiap ubin menyimpan tujuannya dan nomor putaran: putaran lama berhenti begitu ada tujuan baru,
// jadi dua penyusunan beruntun tidak pernah meninggalkan angka yang salah
function setUbin(t, ch, animasi, langkah = 0) {
  if (!t) return;
  const token = (t._token || 0) + 1;
  t._token = token;
  if (t.textContent === ch) return;
  if (!animasi || kurang.matches) { t.textContent = ch; return; }
  const angka = /\d/.test(ch) && /\d/.test(t.textContent);
  let sisa = langkah || 2 + Math.floor(Math.random() * 3);
  const putar = () => {
    if (t._token !== token) return;
    t.classList.remove('balik');
    void t.offsetWidth;
    t.classList.add('balik');
    if (sisa-- > 0) {
      if (angka) t.textContent = String((Number(t.textContent) + 1) % 10);
      setTimeout(putar, 72);
    } else {
      t.textContent = ch;
    }
  };
  putar();
}

// ---- jam Jakarta -------------------------------------------------------------------------------------------------
const jam = document.querySelector('.jam');
const ubinJam = jam ? [...jam.querySelectorAll('.jam-angka i')] : [];
const fmtJam = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', hour12: false });
function tikJam(animasi) {
  if (!jam) return;
  const teks = fmtJam.format(new Date());
  teks.replace(/\D/g, '').split('').forEach((ch, i) => setUbin(ubinJam[i], ch, animasi));
  jam.setAttribute('aria-label', `Time in Jakarta: ${teks}`);
  const kini = new Date();
  setTimeout(() => tikJam(true), 60000 - (kini.getSeconds() * 1000 + kini.getMilliseconds()) + 40);
}
tikJam(false);

// ---- papan: saring dan susun ulang -------------------------------------------------------------------------------
const papan = document.getElementById('board');
const daftar = papan.querySelector('.daftar');
const baris = [...daftar.children];
const chips = [...papan.querySelectorAll('.chip')];
const pilih = papan.querySelector('[data-tekno-pilih]');
const ringkas = papan.querySelector('.ringkas');
const tombolUlang = papan.querySelector('[data-cek-ulang]');
let fStatus = 'semua';
let fTekno = '';

for (const r of baris) r.querySelector('summary').setAttribute('data-suara-sentuh', '');

const cocok = (r) => (fStatus === 'semua' || r.dataset.status === fStatus)
  && (!fTekno || r.dataset.tekno.split(' ').includes(fTekno));

function nomor(r, n, animasi) {
  const s = String(n).padStart(2, '0');
  const [a, b] = r.querySelectorAll('.no i');
  setUbin(a, s[0], animasi);
  setUbin(b, s[1], animasi, 2 + Math.floor(Math.random() * 3));
}

// huruf host berputar acak lalu mendarat dari kiri ke kanan, seperti papan yang menulis ulang barisnya
function acak(el, akhir, ms = 320) {
  if (kurang.matches) { el.textContent = akhir; return; }
  const huruf = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const mulai = performance.now();
  const langkah = (kini) => {
    const p = Math.min(1, (kini - mulai) / ms);
    const tetap = Math.floor(p * akhir.length);
    let s = akhir.slice(0, tetap);
    for (let i = tetap; i < akhir.length; i++) s += akhir[i] === '-' ? '-' : huruf[(Math.random() * huruf.length) | 0];
    el.textContent = s;
    if (p < 1) requestAnimationFrame(langkah);
  };
  requestAnimationFrame(langkah);
}

// baris yang baru berpindah tetap kuning sampai dilihat (kursor masuk, fokus) atau 6 detik
function tandai(r) {
  r.classList.add('baru');
  clearTimeout(r._tanda);
  const lepas = () => {
    r.classList.remove('baru');
    clearTimeout(r._tanda);
    r.removeEventListener('pointerenter', lepas);
    r.removeEventListener('focusin', lepas);
  };
  r.addEventListener('pointerenter', lepas);
  r.addEventListener('focusin', lepas);
  r._tanda = setTimeout(lepas, 6000);
}

function susun(animasi = true) {
  const gerak = animasi && !kurang.matches;
  const awal = new Map(baris.map((r) => [r, r.getBoundingClientRect().top]));
  const lama = [...daftar.children];
  const urut = [...baris].sort((a, b) => (Number(cocok(b)) - Number(cocok(a))) || (a.dataset.urut - b.dataset.urut));
  for (const r of urut) daftar.appendChild(r);
  let pindah = 0;
  urut.forEach((r, i) => {
    r.classList.toggle('luar', !cocok(r));
    if (lama.indexOf(r) === i) return;
    pindah++;
    nomor(r, i + 1, gerak);
    if (!animasi) return;
    tandai(r);
    if (gerak) {
      const h = r.querySelector('.host b');
      h.dataset.asli ||= h.textContent;
      acak(h, h.dataset.asli);
    }
  });
  if (gerak) {
    for (const r of urut) {
      const dy = awal.get(r) - r.getBoundingClientRect().top;
      if (Math.abs(dy) < 1) continue;
      r.animate([{ transform: `translateY(${dy}px)` }, { transform: 'translateY(0)' }],
        { duration: 560 + Math.min(260, Math.abs(dy) * 0.22), easing: 'cubic-bezier(.16,1,.3,1)' });
    }
  }
  if (animasi && pindah) bunyi('flap', { n: Math.min(30, 6 + pindah * 2), pan: 0.25 });
  return pindah;
}

function umumkan() {
  const n = baris.filter(cocok).length;
  const label = [fStatus !== 'semua' ? chips.find((c) => c.dataset.f === fStatus)?.firstChild.textContent.trim() : '',
    fTekno ? pilih.selectedOptions[0].textContent : ''].filter(Boolean).join(', ');
  ucap(label ? `${n} of ${baris.length} hosts match ${label}. They are listed first.` : `All ${baris.length} hosts, in the original order.`);
}

for (const c of chips) {
  c.addEventListener('click', () => {
    fStatus = c.dataset.f;
    for (const x of chips) x.setAttribute('aria-pressed', String(x === c));
    bunyi('tekan', { pan: panDari(c) });
    susun(true);
    umumkan();
  });
}
pilih.addEventListener('change', () => {
  fTekno = pilih.value;
  pilih.classList.toggle('aktif', Boolean(fTekno));
  bunyi('tekan', { pan: panDari(pilih) });
  susun(true);
  umumkan();
});

// matriks teknologi: pilih satu baris -> papan disaring dengan teknologi itu
for (const b of document.querySelectorAll('[data-pilih-tekno]')) {
  b.addEventListener('click', () => {
    fTekno = b.dataset.pilihTekno;
    fStatus = 'semua';
    for (const x of chips) x.setAttribute('aria-pressed', String(x.dataset.f === 'semua'));
    pilih.value = fTekno;
    pilih.classList.add('aktif');
    let sudah = false;
    const jalan = () => { if (sudah) return; sudah = true; susun(true); umumkan(); };
    if (kurang.matches) { papan.scrollIntoView({ block: 'start' }); jalan(); return; }
    addEventListener('scrollend', jalan, { once: true });
    setTimeout(jalan, 1100);
    papan.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

// rincian: satu terbuka pada satu waktu (cadangan untuk browser tanpa details[name]), bunyi kertas saat dibuka
for (const r of baris) {
  const d = r.querySelector('details');
  d.addEventListener('toggle', () => {
    if (!d.open) return;
    bunyi('kertas');
    r.classList.remove('baru');
    for (const o of baris) {
      const od = o.querySelector('details');
      if (od !== d && od.open) od.open = false;
    }
  });
}

// ---- papan hidup: cek setiap host dari browser pengunjung ---------------------------------------------------------
const sel = new Map([...papan.querySelectorAll('.hidup[data-host]')].map((c) => [c.dataset.host, c]));
const hosts = [...sel.keys()];
let menyapu = false;

// angka milidetik mendekati nilainya dengan pegas teredam, tidak meloncat
function hitungMs(el, ke) {
  if (kurang.matches) { el.textContent = `${ke} ms`; return; }
  let x = parseInt(el.textContent, 10);
  if (!Number.isFinite(x)) x = 0;
  let v = 0;
  const langkah = () => {
    v = v * 0.68 + (ke - x) * 0.11;
    x += v;
    if (Math.abs(ke - x) < 0.6 && Math.abs(v) < 0.6) { el.textContent = `${ke} ms`; return; }
    el.textContent = `${Math.max(0, Math.round(x))} ms`;
    requestAnimationFrame(langkah);
  };
  requestAnimationFrame(langkah);
}

async function sapu() {
  if (menyapu) return;
  menyapu = true;
  tombolUlang.disabled = true;
  ringkas.textContent = `Checking ${hosts.length} hosts from your browser…`;
  for (const c of sel.values()) {
    c.classList.remove('ok', 'gagal');
    c.querySelector('.ms').textContent = '···';
  }
  let ok = 0;
  let i = 0;
  await cekSemua(hosts, (h, r) => {
    const c = sel.get(h);
    const ms = c.querySelector('.ms');
    if (r.ok) { ok++; c.classList.add('ok'); hitungMs(ms, r.ms); } else { c.classList.add('gagal'); ms.textContent = 'no answer'; }
    c.classList.add('kilat');
    setTimeout(() => c.classList.remove('kilat'), 700);
    bunyi('pindai', { i: i++ });
  });
  ringkas.textContent = `${ok} of ${hosts.length} answered just now. Timed from your browser, so the numbers include your own connection.`;
  if (ok) setTimeout(() => bunyi('panggil'), 280);
  tombolUlang.disabled = false;
  menyapu = false;
}
tombolUlang.addEventListener('click', () => sapu());

// papan menyala saat pertama terlihat: ubin nomor berputar ke tempatnya, lalu status diisi
function nyalakan() {
  if (!kurang.matches) {
    [...daftar.children].forEach((r, i) => {
      const ubin = r.querySelectorAll('.no i');
      ubin[0].textContent = '0';
      ubin[1].textContent = '0';
      setTimeout(() => {
        // posisi dibaca saat ubin berputar: penyaringan yang terjadi di tengah tetap dihormati
        const s = String([...daftar.children].indexOf(r) + 1).padStart(2, '0');
        setUbin(ubin[0], s[0], true, 1);
        setUbin(ubin[1], s[1], true, 2 + (i % 3));
      }, 80 + i * 36);
    });
    setTimeout(() => bunyi('flap', { n: 22 }), 80);
  }
  setTimeout(sapu, kurang.matches ? 0 : 420);
}
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((isi) => {
    if (!isi.some((x) => x.isIntersecting)) return;
    io.disconnect();
    nyalakan();
  }, { threshold: 0.15 });
  io.observe(papan);
} else {
  nyalakan();
}

// ---- salin email ------------------------------------------------------------------------------------------------
document.addEventListener('click', async (e) => {
  const b = e.target.closest('[data-salin]');
  if (!b) return;
  const teks = b.dataset.salin;
  let ok = false;
  try {
    await navigator.clipboard.writeText(teks);
    ok = true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = teks;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { ok = document.execCommand('copy'); } catch {}
    ta.remove();
  }
  const label = b.querySelector('.teks-salin');
  label.dataset.asli ||= label.textContent;
  const pakai = b.querySelector('use');
  label.textContent = ok ? 'Copied' : 'Copy failed';
  pakai?.setAttribute('href', ok ? '#i-cek' : '#i-salin');
  b.classList.toggle('tersalin', ok);
  if (ok) bunyi('salin', { pan: panDari(b) });
  ucap(ok ? `Email address copied: ${teks}` : `Could not copy. The address is ${teks}`);
  clearTimeout(b._kembali);
  b._kembali = setTimeout(() => {
    label.textContent = label.dataset.asli;
    pakai?.setAttribute('href', '#i-salin');
    b.classList.remove('tersalin');
  }, 2200);
});
