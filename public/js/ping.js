// Cek live dari browser pengunjung: setiap host dihubungi sekali (mode no-cors, tanpa cache) dan waktunya diukur.
// Jawaban no-cors tidak bisa dibaca isinya, tapi kalau datang berarti servernya menjawab; gagal jaringan = tidak menjawab.
// Dipakai: const hasil = await cekHost('pos.arswordlab.com') -> { ok: true, ms: 84 } atau { ok: false }

export async function cekHost(host, { batas = 8000 } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), batas);
  const mulai = performance.now();
  try {
    await fetch(`https://${host}/favicon.ico?cek=${Date.now().toString(36)}`, {
      mode: 'no-cors', cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer', signal: ctrl.signal,
    });
    return { ok: true, ms: Math.round(performance.now() - mulai) };
  } catch {
    return { ok: false, ms: null };
  } finally {
    clearTimeout(timer);
  }
}

// cek banyak host, beberapa sekaligus, dan laporkan setiap hasil begitu datang
export async function cekSemua(hosts, saatHasil, { serentak = 4 } = {}) {
  const antre = hosts.map((h, i) => ({ h, i }));
  const hasil = new Array(hosts.length);
  async function pekerja() {
    while (antre.length) {
      const { h, i } = antre.shift();
      const r = await cekHost(h);
      hasil[i] = r;
      if (saatHasil) saatHasil(h, r, i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(serentak, hosts.length) }, pekerja));
  return hasil;
}
