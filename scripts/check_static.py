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

# V3 regression guards
sw = (root / 'service-worker.js').read_text(encoding='utf-8')
assert "CACHE_PREFIX = 'nautilus-tortoise-tracker-'" in sw, 'Service-worker cache prefix missing'
assert "k.startsWith(CACHE_PREFIX)" in sw, 'Service worker must not delete unrelated origin caches'
app = (root / 'src/app.js').read_text(encoding='utf-8')
assert app.count('data-nav="/directory"') == 2, 'Directory navigation should appear once in desktop and once in mobile nav'
print('V3 regression guards: OK')

# V4 spatial analytics regression guards
assert "./src/analysis.js" in sw and "./src/charts.js" in sw, 'V4 analysis modules must be cached for offline app shell'
assert 'data-nav="/insights"' in app, 'Public Insights navigation missing'
assert "section==='spatial'" in app, 'Staff Map Lab route missing'
exp=(root/'src/export.js').read_text(encoding='utf-8')
assert 'observationsKML' in exp and 'application/vnd.google-earth.kml+xml' in app, 'KML export integration missing'
print('V4 spatial analytics guards: OK')

# V5 adaptive app/native-readiness guards
assert "./src/platform.js" in sw, 'Platform adapter must be cached for offline app shell'
assert 'app-tabbar' in app and 'app-more-button' in app, 'Adaptive mobile app navigation missing'
assert 'getCurrentPosition' in app and 'getCameraStream' in app, 'Device capabilities must route through platform adapter'
assert (root/'capacitor.config.json').exists(), 'Capacitor configuration missing'
assert (root/'docs/MOBILE_NATIVE_STRATEGY.md').exists(), 'Mobile/native strategy missing'
css=(root/'styles.css').read_text(encoding='utf-8')
assert '@media (max-width:1024px)' in css and '@media (min-width:1025px)' in css, 'Dual app/web breakpoints missing'
print('V5 adaptive app/native-readiness guards: OK')

# V6/V7 Nautilus Bay visual integration + access-profile guards
assert './icons/tortoise-placeholder.svg' in sw and './icons/tortoise-padloper.svg' in sw, 'Local tortoise fallback illustrations must be cached'
assert 'Slider_1.jpg' in css, 'Nautilus Bay scenic hero integration missing'
assert 'Gallery_10.jpg' in css, 'Nautilus Bay reserve-story image integration missing'
assert '--hestia-accent:#e91e63' in css and 'Roboto Slab' in css, 'Hestia visual-language integration missing'
demo=(root/'src/demo-data.js').read_text(encoding='utf-8')
assert 'Gallery_3.jpg' in demo and 'Gallery_7.jpg' in demo, 'Requested Nautilus Bay gallery images missing from demo animal profiles'
assert 'data-demo-role="scientist"' in app and 'data-demo-role="admin"' in app and 'data-public-access' in app, 'Three-profile access model missing'
assert 'data-demo-role="ranger"' not in app and 'data-demo-role="researcher"' not in app and 'data-demo-role="veterinarian"' not in app, 'Legacy staff profiles still exposed'
assert not (root/'assets').exists(), 'V7 should not require a top-level assets folder for GitHub Pages upload'
print('V7 Nautilus Bay brand/access integration guards: OK')
