"""Make short looping project videos (16:9) from recordings that already exist, plus moving stills for the two
apps that have no public screen to record (POS: demo-outlet guide screenshots; Daily Task: its sign-in page).

    python -I -X utf8 alat/video_ada.py [key ...]

Writes public/media/video/<key>-640.mp4 (every key), <key>-1280.mp4 (featured keys), <key>.webp (poster).
Sources:
  racik-paket-pos/media-source/video/karya/<key>.mp4  (ARSWORD portfolio recordings, 960x472, 24 fps)
  sumber/video/<key>-asli.mp4                          (same kind, downloaded from ARSWORD's Cloudinary)
  video-arsword/hasil/<Name>-rekam-layar-desktop.mp4   (1920x1080, 60 fps site tours)
"""
import subprocess, sys, pathlib, json

ROOT = pathlib.Path(__file__).resolve().parent.parent
LAB = ROOT.parent
OUT = ROOT / 'public' / 'media' / 'video'
OUT.mkdir(parents=True, exist_ok=True)
UNGGULAN = {'pos', 'arswordlab', 'dailytask', 'eskrim-uncle-ren', 'teassence'}
LAMA = 14  # seconds per loop

# key: (source, start second, kind)
SUMBER = {
    'nathaniakhow': (LAB / 'racik-paket-pos/media-source/video/karya/natha.mp4', 7.2, 'lebar'),
    'seraphine': (LAB / 'racik-paket-pos/media-source/video/karya/seraphine.mp4', 3.0, 'lebar'),
    'ashfield': (LAB / 'racik-paket-pos/media-source/video/karya/ashfield.mp4', 4.0, 'lebar'),
    'himawari': (LAB / 'racik-paket-pos/media-source/video/karya/himawari.mp4', 5.7, 'lebar'),
    'nilamerah': (ROOT / 'sumber/video/nila-merah-asli.mp4', 2.5, 'lebar'),
    'koaslink': (ROOT / 'sumber/video/koaslink-asli.mp4', 1.8, 'lebar'),
    'javaloom': (LAB / 'video-arsword/hasil/Javaloom-rekam-layar-desktop.mp4', 2.6, 'hd'),
    'radja': (LAB / 'video-arsword/hasil/RAN-rekam-layar-desktop.mp4', 2.8, 'hd'),
    'bengkelnusantara': (LAB / 'video-arsword/hasil/BengkelNusantara-rekam-layar-desktop.mp4', 3.2, 'hd'),
    'seifan': (LAB / 'video-arsword/hasil/Seifan-rekam-layar-desktop.mp4', 3.6, 'hd', 10.5),
}
WARNA = ['-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv']


def ff(*args):
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', *map(str, args)], check=True)


def keluaran(key, masuk_args, vf_dasar):
    """Encode one source (given as ffmpeg input args + a filter that yields 16:9 frames) into the shipped sizes."""
    lebar = [(640, 360, 29)] + ([(1280, 720, 25)] if key in UNGGULAN else [])
    for w, h, crf in lebar:
        ff(*masuk_args, '-vf', f'{vf_dasar},scale={w}:{h}:flags=lanczos,fps=30,format=yuv420p', '-an',
           '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', crf, '-movflags', '+faststart', *WARNA,
           OUT / f'{key}-{w}.mp4')
    besar = OUT / f'{key}-{lebar[-1][0]}.mp4'
    ff('-i', besar, '-frames:v', '1', '-vf', 'scale=1280:720:flags=lanczos', '-c:v', 'libwebp', '-quality', '80', OUT / f'{key}.webp')
    print(key, ', '.join(f'{p.name} {p.stat().st_size // 1024} KB' for p in sorted(OUT.glob(f'{key}-*.mp4'))))


def dari_rekaman(key):
    src, mulai, jenis, *lama = SUMBER[key]
    if jenis == 'lebar':
        # 960x472 (about 2:1): cut the middle 16:9 (839x472)
        vf = 'crop=839:472:(in_w-839)/2:0'
    else:
        vf = 'null'
    keluaran(key, ['-ss', mulai, '-t', lama[0] if lama else LAMA, '-i', src], vf)


def dari_foto(key, berkas, lama_per=4.6):
    """Moving stills: each picture slowly zooms (Ken Burns) and cross-fades into the next; 16:9 crop."""
    n = len(berkas)
    masuk, rantai = [], []
    for i, b in enumerate(berkas):
        masuk += ['-loop', '1', '-t', str(lama_per), '-i', str(b)]
        # zoom from 1.0 to 1.06 around a point that drifts a little, 30 fps, output 1600x900
        rantai.append(f'[{i}:v]scale=1920:-2,crop=1920:1080,zoompan=z=\'1+0.06*on/({lama_per}*30)\':x=\'iw/2-(iw/zoom/2)+{(-1) ** i * 18}*on/({lama_per}*30)\':'
                      f'y=\'ih/2-(ih/zoom/2)\':d=1:s=1600x900:fps=30,setsar=1,format=yuv420p[v{i}]')
    sambung = '[v0]'
    t = lama_per - 0.6
    for i in range(1, n):
        rantai.append(f'{sambung}[v{i}]xfade=transition=fade:duration=0.6:offset={t:.2f}[x{i}]')
        sambung = f'[x{i}]'
        t += lama_per - 0.6
    tmp = ROOT / 'sumber' / 'video' / f'{key}-foto.mp4'
    ff(*masuk, '-filter_complex', ';'.join(rantai), '-map', sambung, '-c:v', 'libx264', '-crf', '16', '-preset', 'fast', tmp)
    keluaran(key, ['-i', tmp], 'null')


def utama():
    keys = sys.argv[1:] or list(SUMBER) + ['pos', 'dailytask']
    for k in keys:
        kerjakan(k)


def kerjakan(k):
    if k == 'pos':
        img = LAB / 'Dokumen' / 'sumber' / 'panduan' / 'img'
        dari_foto('pos', [img / 'kasir-05-layar-jual.jpg', ROOT / 'public' / 'media' / 'karya' / 'pos-desk-1-1600.webp', img / 'kasir-08-bayar.jpg'])
    elif k == 'dailytask':
        dari_foto('dailytask', [ROOT / 'sumber' / 'tangkap' / 'dailytask' / 'desk.png', ROOT / 'sumber' / 'tangkap' / 'dailytask' / 'desk-1.png'], lama_per=6.5)
    else:
        dari_rekaman(k)


if __name__ == '__main__':
    utama()
