import test from 'node:test';
import assert from 'node:assert/strict';
const mem=new Map();
globalThis.localStorage={getItem:k=>mem.has(k)?mem.get(k):null,setItem:(k,v)=>mem.set(k,String(v)),removeItem:k=>mem.delete(k)};
const {DemoDB,resetDemo}=await import('../src/storage.js');

test('demo review status is projected into effective observation',()=>{
  resetDemo();
  assert.equal(DemoDB.observation('o6').verification_status,'pending');
  assert.equal(DemoDB.effectiveObservation('o6').verification_status,'verified');
});

test('multiple demo corrections remain cumulative',()=>{
  resetDemo();
  DemoDB.addCorrection('o1',{lat:-34.2,lng:22.1},'coordinate correction','Scientist Demo');
  DemoDB.addCorrection('o1',{condition:'unsure'},'condition correction','Scientist Demo');
  const effective=DemoDB.effectiveObservation('o1');
  assert.equal(effective.lat,-34.2);assert.equal(effective.lng,22.1);assert.equal(effective.condition,'unsure');
});
