// Halaman pembanding sementara di / : empat arah desain portfolio, masing-masing dibuka di halamannya sendiri.
// Hanya untuk pemilik selama memilih; setelah satu arah dipilih, halaman ini diganti arah itu.
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PUB = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

const ARAH = [
  { id: 'laporan', nama: 'Laporan Asesmen', baris: 'Portfolio sebagai laporan asesmen resmi: ringkasan eksekutif untuk HR, bukti teknis untuk engineer, cek live 18 situs.' },
  { id: 'gambar', nama: 'Gambar Kerja', baris: 'Nama dan setiap situs dibelah garis potong yang bisa diseret: di atas tampilan jadinya, di bawah kerangka aslinya.' },
  { id: 'boarding', nama: 'Boarding Pass + Papan Gate', baris: 'Anda adalah boarding pass-nya; 18 situs jadi papan keberangkatan live yang bisa disusun ulang.' },
  { id: 'standar', nama: 'Standar Premium', baris: 'Portfolio developer yang lazim, dieksekusi serapi Apple atau Linear.' },
  { id: 'personal', nama: 'Personal (dari referensi Anda)', baris: 'Foto Anda di depan karya-karya Anda: terang, lega, ramah. Rasa dari referensi, tata letak sendiri.' },
];

export default function pilih({ esc, aset, semua }) {
  const ada = ARAH.filter((a) => semua.includes(a.id));
  const gambar = (id, jenis) => (existsSync(join(PUB, 'media', 'pilih', `${id}-${jenis}.webp`)) ? aset(`media/pilih/${id}-${jenis}.webp`) : '');
  const kartu = ada.map((a, i) => {
    const d = gambar(a.id, 'desktop'), m = gambar(a.id, 'hp');
    return `
      <li>
        <a href="/${a.id}/">
          <span class="layar">${d ? `<img class="d" src="${d}" alt="" width="1440" height="900" loading="${i < 2 ? 'eager' : 'lazy'}">` : ''}${m ? `<img class="m" src="${m}" alt="" width="390" height="844">` : ''}</span>
          <span class="t"><span class="n">${String.fromCharCode(65 + i)}</span><b>${esc(a.nama)}</b><span class="b">${esc(a.baris)}</span></span>
          <span class="go">Buka versi ${String.fromCharCode(65 + i)}</span>
        </a>
      </li>`;
  }).join('');
  return `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Pilih arah · Portfolio Sword Ekel</title>
<style>
  :root { color-scheme: light; --ink: #111; --paper: #f4f4f2; --mid: #5f6266; --rule: #d9d9d6; }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--paper); color: var(--ink); font: 16px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
  main { max-width: 1240px; margin: 0 auto; padding: 64px 20px 96px; }
  h1 { font-size: clamp(30px, 5vw, 48px); line-height: 1.05; letter-spacing: -0.025em; margin: 0 0 12px; }
  main > p { color: var(--mid); margin: 0 0 40px; max-width: 64ch; }
  ul { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 560px), 1fr)); gap: 28px; }
  li a { display: grid; gap: 14px; color: inherit; text-decoration: none; }
  .layar { position: relative; display: block; aspect-ratio: 16 / 10; border-radius: 10px; overflow: hidden; background: #ddd;
    box-shadow: 0 1px 2px rgba(0,0,0,.06), 0 20px 40px -24px rgba(0,0,0,.35); }
  .layar .d { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; transition: transform .6s cubic-bezier(.16,1,.3,1); }
  .layar .m { position: absolute; right: 14px; bottom: 14px; width: 21%; height: auto; border-radius: 10px; border: 3px solid #111; background: #111; box-shadow: 0 10px 24px -10px rgba(0,0,0,.5); }
  li a:hover .d { transform: scale(1.02); }
  .t { display: grid; grid-template-columns: auto 1fr; column-gap: 12px; }
  .n { grid-row: span 2; font-weight: 700; color: var(--mid); }
  .t b { font-size: 20px; letter-spacing: -0.01em; }
  .b { color: var(--mid); font-size: 15px; }
  .go { justify-self: start; font-size: 14px; border: 1px solid var(--ink); border-radius: 99px; padding: 7px 14px; }
  li a:hover .go { background: var(--ink); color: var(--paper); }
</style>
</head>
<body>
<main>
  <h1>Lima versi, satu isi.</h1>
  <p>Semua versi memakai data, foto situs, dan suara yang sama. Buka satu per satu, coba seret, klik, dan nyalakan suaranya, lalu pilih yang akan disempurnakan (bahasa Indonesia, uji akhir, dan rilis menyusul untuk versi terpilih).</p>
  <ul>${kartu}
  </ul>
</main>
</body>
</html>
`;
}
