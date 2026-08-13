from pathlib import Path
import json,re,sys
root=Path(__file__).resolve().parents[1]
errors=[]
try: json.loads((root/'manifest.webmanifest').read_text())
except Exception as e: errors.append(f'manifest: {e}')
html=(root/'index.html').read_text()
for ref in re.findall(r'(?:src|href)="(\./[^"?#]+)',html):
    p=root/ref[2:]
    if not p.exists(): errors.append(f'missing HTML asset: {ref}')
sw=(root/'service-worker.js').read_text()
for ref in re.findall(r"'\./([^']+)'",sw):
    p=root/ref
    if not p.exists(): errors.append(f'missing SW asset: {ref}')
if errors:
    print('\n'.join(errors));sys.exit(1)
print('Static asset integrity: OK')
