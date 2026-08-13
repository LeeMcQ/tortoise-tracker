import test from 'node:test';import assert from 'node:assert/strict';import {movebankEventCSV,observationsGeoJSON} from '../src/export.js';
const obs=[{id:'o1',animal_id:'a1',public_id:'T0001',observed_at:'2026-01-01T00:00:00Z',lat:-34,lng:22,accuracy_m:5,behaviour:'walking',condition:'healthy',verification_status:'verified',quality_score:95}];const animals=[{id:'a1',public_id:'T0001'}];
test('Movebank-style export has event fields',()=>{const csv=movebankEventCSV(obs,animals);assert.match(csv,/event-id/);assert.match(csv,/individual-local-identifier/);assert.match(csv,/T0001/);});
test('GeoJSON export is valid FeatureCollection',()=>{const g=JSON.parse(observationsGeoJSON(obs));assert.equal(g.type,'FeatureCollection');assert.deepEqual(g.features[0].geometry.coordinates,[22,-34]);});
