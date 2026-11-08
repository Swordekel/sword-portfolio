// Halaman pembanding sementara di / : empat arah desain portfolio, masing-masing dibuka di halamannya sendiri.
// Hanya untuk pemilik selama memilih; setelah satu arah dipilih, halaman ini diganti arah itu.
const ARAH = [
  { id: 'laporan', nama: 'Laporan Asesmen', baris: 'Portfolio sebagai laporan asesmen resmi: ringkasan eksekutif untuk HR, bukti teknis untuk engineer, cek live 18 situs.' },
  { id: 'gambar', nama: 'Gambar Kerja', baris: 'Setiap situs sebagai lembar gambar kerja; garis potong membelah tampilan dan memperlihatkan kerangka aslinya.' },
  { id: 'boarding', nama: 'Boarding Pass + Papan Gate', baris: 'Anda adalah boarding pass-nya; 18 situs jadi papan keberangkatan live yang bisa disusun ulang.' },
  { id: 'standar', nama: 'Standar Premium', baris: 'Portfolio developer yang lazim, dieksekusi serapi Apple atau Linear.' },
];

export default function pilih({ esc, semua }) {
  const ada = ARAH.filter((a) => semua.includes(a.id));
  const kartu = ada.map((a, i) => `
      <li>
        <a href="/${a.id}/">
          <span class="n">${String.fromCharCode(65 + i)}</span>
          <span class="t"><b>${esc(a.nama)}</b><span>${esc(a.baris)}</span></span>
          <span class="go" aria-hidden="true">Buka</span>
        </a>
      </li>`).join('');
  return `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Pilih arah · Portfolio Sword Ekel</title>
<style>
  :root { color-scheme: light; --ink: #111; --paper: #f4f4f2; --mid: #6b6b6b; --rule: #d9d9d6; }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--paper); color: var(--ink); font: 16px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
  main { max-width: 760px; margin: 0 auto; padding: 72px 20px 96px; }
  h1 { font-size: clamp(28px, 5vw, 40px); line-height: 1.1; letter-spacing: -0.02em; margin: 0 0 12px; }
  p { color: var(--mid); margin: 0 0 40px; max-width: 60ch; }
  ul { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--rule); }
  li a { display: grid; grid-template-columns: 40px 1fr auto; gap: 16px; align-items: center; padding: 22px 4px;
    border-bottom: 1px solid var(--rule); color: inherit; text-decoration: none; }
  li a:hover { background: #ebebe8; }
  .n { font-weight: 600; color: var(--mid); }
  .t b { display: block; font-size: 19px; }
  .t span { color: var(--mid); font-size: 15px; }
  .go { font-size: 14px; border: 1px solid var(--ink); border-radius: 99px; padding: 6px 14px; }
</style>
</head>
<body>
<main>
  <h1>Empat arah, satu isi.</h1>
  <p>Semua versi memakai data, foto situs, dan suara yang sama. Buka satu per satu (sebaiknya juga di iPhone), lalu pilih yang akan disempurnakan.</p>
  <ul>${kartu}
  </ul>
</main>
</body>
</html>
`;
}
