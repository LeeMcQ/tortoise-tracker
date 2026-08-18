from pathlib import Path
import shutil

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'dist-native'
if OUT.exists(): shutil.rmtree(OUT)
OUT.mkdir()
for name in ['index.html','config.js','styles.css','manifest.webmanifest','service-worker.js','robots.txt','_headers']:
    src=ROOT/name
    if src.exists(): shutil.copy2(src,OUT/name)
for name in ['src','icons','assets']:
    src=ROOT/name
    if src.exists(): shutil.copytree(src,OUT/name)
print(f'Native web bundle staged at {OUT}')
