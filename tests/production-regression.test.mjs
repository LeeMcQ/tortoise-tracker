import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');

test('publishable Supabase key is not sent as an anonymous Bearer JWT',()=>{
  const api=read('src/supabase-api.js');
  assert.match(api,/if\(this\.session\?\.access_token\)h\.Authorization=/);
  assert.doesNotMatch(api,/Authorization:`Bearer \$\{this\.token\(\)\}`/);
});

test('QR creator works in demo and production paths without old hand-off placeholder',()=>{
  const app=read('src/app.js'),edge=read('supabase/functions/qr-svg/index.ts');
  assert.doesNotMatch(app,/Production uses the self-hosted/);
  for(const id of ['T0047','T0128','T0387']) assert.ok(fs.existsSync(path.join(ROOT,'icons/qr',`${id}.svg`)));
  assert.match(edge,/req\.method==='OPTIONS'/);
  assert.match(edge,/Access-Control-Allow-Origin/);
  assert.match(edge,/Administrator access required/);
});

test('map layer has an offline/local spatial fallback and profile empty state',()=>{
  const map=read('src/map.js'),app=read('src/app.js');
  assert.match(map,/export function renderFallbackMap/);
  assert.match(map,/Leaflet unavailable; using local spatial fallback/);
  assert.match(app,/noVerifiedMapTitle/);
  assert.match(app,/movement-section/);
});

test('scientific correction migration applies corrected coordinates and cumulative changes',()=>{
  const sql=read('supabase/migrations/003_production_regression_repairs.sql');
  assert.match(sql,/changes \? 'lat'/);
  assert.match(sql,/changes \? 'lng'/);
  assert.match(sql,/distinct on \(e\.key\)/);
  assert.match(sql,/public\.observations_effective/);
  assert.doesNotMatch(sql,/returns table\([^;]*gps_accuracy_m numeric[^;]*\)\s*language sql stable security definer set search_path=public,extensions as \$\$\s*with cfg/s);
});

test('animal master data supports profile-photo replacement and status/data correction',()=>{
  const app=read('src/app.js'),edge=read('supabase/functions/staff-profile-photo/index.ts');
  assert.match(app,/id=\"animal-photo\"/);
  assert.match(app,/id=\"animal-status\"/);
  assert.match(app,/id=\"animal-dob\"/);
  assert.match(app,/Repo\.setProfilePhoto/);
  assert.match(edge,/photo_quality:'good'/);
  assert.match(edge,/view_type:'unknown'/);
  assert.doesNotMatch(edge,/photo_quality:'approved'/);
  assert.doesNotMatch(edge,/view_type:'profile'/);
});

test('Scientist snapshot no longer fails when admin-only audit table is denied',()=>{
  const repo=read('src/repository.js');
  assert.match(repo,/staffTable\('audit_log','occurred_at\.desc'\)\.catch\(\(\)=>\[\]\)/);
});

test('function deployment script distinguishes public and protected Edge Functions',()=>{
  const ps=read('scripts/deploy_supabase_functions.ps1');
  for(const fn of ['public-sighting','public-profile-photo','product-event']) assert.match(ps,new RegExp(`functions deploy ${fn} --no-verify-jwt`));
  for(const fn of ['qr-svg','staff-profile-photo','staff-photo']) assert.match(ps,new RegExp(`functions deploy ${fn}`));
});

test('administrator can enrol TOTP MFA instead of being locked out',()=>{
  const api=read('src/supabase-api.js');
  const app=read('src/app.js');
  assert.match(api,/enrollTotp\(/);
  assert.match(api,/factor_type:'totp'/);
  assert.match(app,/mfaEnrollView/);
  assert.match(app,/enrollTotp\('Nautilus Bay Administrator'\)/);
  assert.doesNotMatch(app,/Enrol a verified TOTP factor before using the administration console/);
});
