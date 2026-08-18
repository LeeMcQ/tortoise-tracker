import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('V6 Nautilus Bay brand integration is present',()=>{
  const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
  const css=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');
  const app=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
  const demo=fs.readFileSync(new URL('../src/demo-data.js',import.meta.url),'utf8');
  assert.match(html,/Roboto\+Slab/);
  assert.match(html,/nautilusbayhoa\.co\.za/);
  assert.match(css,/--hestia-accent:#e91e63/);
  assert.match(css,/Slider_1\.jpg/);
  assert.match(css,/Gallery_10\.jpg/);
  assert.match(app,/reserve-story/);
  assert.match(demo,/tortoise-leopard\.svg/);
  assert.match(demo,/tortoise-angulate\.svg/);
  assert.match(demo,/tortoise-padloper\.svg/);
});
