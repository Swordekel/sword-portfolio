"""Re-encode every project loop from its master (after changing sizes, frame rate or quality in video_ada.py).

    python -I -X utf8 alat/video_semua.py
"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import video_ada as v

for k in v.SUMBER:
    v.dari_rekaman(k)
for k in ('pos', 'dailytask'):
    v.keluaran(k, ['-i', v.ROOT / 'sumber' / 'video' / f'{k}-foto.mp4'], 'null')
for k in ('arswordlab', 'eskrim-uncle-ren', 'teassence', 'cherish', 'tsunagu'):
    v.keluaran(k, ['-i', v.ROOT / 'sumber' / 'video' / f'{k}-rekam.mp4'], 'null')
