import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { platformInfo, installState } from '../src/platform.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');

test('platform adapter degrades safely outside a browser/native wrapper',()=>{
  const p=platformInfo();
  assert.equal(p.native,false);
  assert.equal(installState().installed,false);
});

test('manifest is standalone-installable and contains app shortcuts',()=>{
  const m=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));
  assert.equal(m.display,'standalone');
  assert.ok(m.display_override.includes('standalone'));
  assert.equal(m.scope,'./');
  assert.equal(m.start_url,'./#/');
  assert.ok(m.shortcuts.length>=3);
  assert.equal(m.launch_handler.client_mode,'navigate-existing');
});

test('native packaging preparation is present without changing the web backend',()=>{
  const c=JSON.parse(fs.readFileSync(path.join(root,'capacitor.config.json'),'utf8'));
  assert.equal(c.appId,'za.co.nautilusbay.tortoisetracker');
  assert.equal(c.webDir,'dist-native');
  assert.ok(fs.existsSync(path.join(root,'.well-known','assetlinks.json.example')));
  assert.ok(fs.existsSync(path.join(root,'scripts','build_native_stage.py')));
});
