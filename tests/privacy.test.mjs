import test from 'node:test';import assert from 'node:assert/strict';import {generalisePoint} from '../src/privacy.js';
test('public generalisation changes precise coordinates',()=>{const p=generalisePoint(-34.1814123,22.0227123,250);assert.notEqual(p.lat,-34.1814123);assert.notEqual(p.lng,22.0227123);assert.ok(Math.abs(p.lat+34.1814123)<.01);});
