import test from 'node:test';
import assert from 'node:assert/strict';
import { observationsKML, observationCSV } from '../src/export.js';
const rows=[{id:'o1',public_id:'T0047',observed_at:'2026-08-01T08:00:00Z',lat:-34.1,lng:22.2,accuracy_m:8,behaviour:'feeding',condition:'healthy'}];
test('KML export contains OGC KML namespace, timestamp and coordinate',()=>{const k=observationsKML(rows);assert.match(k,/http:\/\/www\.opengis\.net\/kml\/2\.2/);assert.match(k,/<TimeStamp>/);assert.match(k,/22\.2000000,-34\.1000000,0/);});
test('observation CSV contains spatial fields',()=>{const c=observationCSV(rows);assert.match(c,/latitude,longitude/);assert.match(c,/-34\.1,22\.2/);});
