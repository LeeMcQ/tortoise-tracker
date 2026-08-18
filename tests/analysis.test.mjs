import test from 'node:test';
import assert from 'node:assert/strict';
import { monthlyCounts, gridAggregate, movementMetrics, applyObservationFilters } from '../src/analysis.js';
const rows=[
 {id:'1',animal_id:'a',public_id:'T1',observed_at:'2026-01-01T08:00:00Z',lat:-34.1,lng:22.1,condition:'healthy',quality_score:95},
 {id:'2',animal_id:'a',public_id:'T1',observed_at:'2026-03-01T08:00:00Z',lat:-34.101,lng:22.101,condition:'healthy',quality_score:80},
 {id:'3',animal_id:'b',public_id:'T2',observed_at:'2026-03-03T12:00:00Z',lat:-34.2,lng:22.2,condition:'unsure',quality_score:60}
];
test('monthly counts retain zero months inside the observed range',()=>{const s=monthlyCounts(rows);assert.equal(s.length,3);assert.deepEqual(s.map(x=>x.value),[1,0,2]);});
test('spatial grid aggregates observations',()=>{const cells=gridAggregate(rows,500);assert.ok(cells.length>=2);assert.equal(cells.reduce((s,c)=>s+c.count,0),3);});
test('movement metrics use straight-line observed positions',()=>{const m=movementMetrics([{id:'a',public_id:'T1',name:'A'}],rows)[0];assert.equal(m.sightings,2);assert.ok(m.connection_sum_m>0);});
test('filters combine animal and date',()=>{const f=applyObservationFilters(rows,{animal:'T1',from:'2026-03-01'});assert.equal(f.length,1);assert.equal(f[0].id,'2');});
