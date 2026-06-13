# Audio Track

Letakkan file musik Anda di sini dengan nama **`cafe-jazz.mp3`** supaya otomatis ke-load oleh MusicPlayer.

Path final: `public/audio/cafe-jazz.mp3`

## Format yang Didukung

- **MP3** (recommended — kompatibilitas terbaik di semua browser)
- OGG, WAV, AAC juga bisa, tapi MP3 paling aman

## Sumber Musik Gratis & Legal

Pilih track lo-fi jazz / cafe ambience / acoustic chill yang cocok dengan tema brown coffee:

### 1. Pixabay Music (Recommended — CC0, no attribution required)
- https://pixabay.com/music/search/lofi%20jazz/
- https://pixabay.com/music/search/cafe/
- https://pixabay.com/music/search/jazz%20chill/

### 2. YouTube Audio Library (Free, no attribution)
- https://studio.youtube.com → Audio Library → Filter genre "Jazz" / "Hip Hop & Rap" (untuk lo-fi)

### 3. Free Music Archive
- https://freemusicarchive.org/genre/Jazz/
- Cek lisensi per track (CC BY biasanya butuh credit)

### 4. Bensound (Free with attribution)
- https://www.bensound.com/royalty-free-music/jazz

## Saran Suasana

Untuk portfolio brown coffee shop vibe Anda, cari track dengan keyword:
- `lofi cafe`
- `jazz coffee shop`
- `bossa nova chill`
- `acoustic guitar lounge`
- `vintage piano jazz`

Durasi 2-5 menit sudah cukup karena player diset `loop`.

## Ganti Nama File / Judul Track

Kalau mau pakai nama file berbeda atau ganti judul yang tampil di player, edit:

`src/app/components/MusicPlayer.tsx` baris atas:

```ts
const AUDIO_SRC = "/audio/cafe-jazz.mp3";  // ← path file
const TRACK_TITLE = "Café Lo-Fi Jazz";     // ← judul tampil
const TRACK_SUBTITLE = "Ambient · Loop";   // ← subtitle tampil
```

## Ukuran File

Idealnya **< 5 MB** supaya cepat loading. Compress ke 128 kbps MP3 sudah cukup untuk background music — quality tidak perlu hi-fi.

Kompres online gratis: https://www.freeconvert.com/mp3-converter
