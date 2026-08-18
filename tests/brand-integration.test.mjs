import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const root=new URL('../',import.meta.url);
const read=p=>fs.readFileSync(new URL(p,root),'utf8');

test('V7 Nautilus Bay brand and HOA imagery integration is present',()=>{
  const html=read('index.html');
  const css=read('styles.css');
  const app=read('src/app.js');
  const demo=read('src/demo-data.js');
  assert.match(html,/Roboto\+Slab/);
  assert.match(html,/img-src[^\n]*nautilusbayhoa\.co\.za/);
  assert.match(css,/--hestia-accent:#e91e63/);
  assert.match(css,/Slider_1\.jpg/);
  assert.match(css,/Gallery_10\.jpg/);
  assert.match(app,/about-reserve-hero/);
  assert.match(demo,/Gallery_3\.jpg/);
  assert.match(demo,/Gallery_7\.jpg/);
  assert.doesNotMatch(demo,/tortoise-leopard\.svg/);
  assert.doesNotMatch(demo,/tortoise-angulate\.svg/);
});

test('V7 exposes only Public, Scientist and Administrator access profiles',()=>{
  const app=read('src/app.js');
  const sql=read('supabase/migrations/001_world_class.sql');
  assert.match(app,/data-demo-role="scientist"/);
  assert.match(app,/data-demo-role="admin"/);
  assert.match(app,/data-public-access/);
  assert.doesNotMatch(app,/data-demo-role="ranger"/);
  assert.doesNotMatch(app,/data-demo-role="researcher"/);
  assert.doesNotMatch(app,/data-demo-role="veterinarian"/);
  assert.match(sql,/app_role as enum \('scientist','admin'\)/);
  assert.match(sql,/observer_type in \('visitor','scientist','admin','device_import'\)/);
});

test('About page includes source-grounded Nautilus Bay nature facts',()=>{
  const i18n=read('src/i18n.js');
  const app=read('src/app.js');
  assert.match(i18n,/600 hectares/);
  assert.match(i18n,/400 hectares/);
  assert.match(i18n,/Whales & dolphins/);
  assert.match(i18n,/Birdlife & mammals/);
  assert.match(app,/nature-grid/);
  assert.match(app,/10 min/);
});

test('No top-level assets folder is required for GitHub Pages upload',()=>{
  assert.equal(fs.existsSync(new URL('assets/',root)),false);
  assert.equal(fs.existsSync(new URL('icons/tortoise-placeholder.svg',root)),true);
  assert.equal(fs.existsSync(new URL('icons/tortoise-padloper.svg',root)),true);
});
