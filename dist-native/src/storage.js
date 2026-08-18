import { DEMO } from './demo-data.js';

const KEY = 'nautilus-conservation-v4';
const deepClone = v => typeof structuredClone==='function' ? structuredClone(v) : JSON.parse(JSON.stringify(v));

function initial(){ return deepClone(DEMO); }
export function loadStore(){
  try { const raw = localStorage.getItem(KEY); return raw ? {...initial(), ...JSON.parse(raw)} : initial(); }
  catch { return initial(); }
}
export function saveStore(store){ localStorage.setItem(KEY, JSON.stringify(store)); }
export function resetDemo(){ localStorage.removeItem(KEY); return loadStore(); }
export function mutate(fn){ const s=loadStore(); const result=fn(s); saveStore(s); return result; }
export function uuid(){ return crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`; }

export const DemoDB = {
  all(table){ return loadStore()[table] || []; },
  taxa(){ return this.all('taxa'); },
  animals(){ return this.all('animals'); },
  activeAnimals(){ return this.animals().filter(a=>a.status==='active'); },
  animalByPublicId(publicId){ return this.animals().find(a=>a.public_id.toUpperCase()===String(publicId).toUpperCase()) || null; },
  taxon(id){ return this.taxa().find(t=>t.id===id) || null; },
  observations(){ return this.all('observations'); },
  observation(id){ return this.observations().find(o=>o.id===id) || null; },
  observationsForAnimal(animalId){ return this.observations().filter(o=>o.animal_id===animalId).sort((a,b)=>new Date(a.observed_at)-new Date(b.observed_at)); },
  latestForAnimal(animalId){ const rows=this.observationsForAnimal(animalId); return rows[rows.length-1] || null; },
  measurementsForAnimal(animalId){ return this.all('measurements').filter(m=>m.animal_id===animalId).sort((a,b)=>new Date(b.measured_at)-new Date(a.measured_at)); },
  healthForAnimal(animalId){ return this.all('health_cases').filter(c=>c.animal_id===animalId).sort((a,b)=>new Date(b.opened_at)-new Date(a.opened_at)); },
  effectiveObservation(id){
    const base=this.observation(id); if(!base) return null;
    const corrections=this.all('observation_corrections').filter(c=>c.observation_id===id).sort((a,b)=>new Date(a.created_at)-new Date(b.created_at));
    return corrections.reduce((row,c)=>({...row,...c.changes, correction_count:(row.correction_count||0)+1}), {...base, correction_count:0});
  },
  createObservation(row){
    return mutate(s=>{
      if(s.observations.some(o=>o.client_submission_id===row.client_submission_id)) return s.observations.find(o=>o.client_submission_id===row.client_submission_id);
      const saved={...row,id:row.id||uuid(),received_at:row.received_at||new Date().toISOString()};
      s.observations.push(saved);
      s.audit_log.push({id:uuid(),occurred_at:new Date().toISOString(),actor:row.observer_type||'visitor',action:'observation_created',entity_type:'observation',entity_id:saved.id,detail:'Append-only observation created.'});
      if(['possible_injury','shell_damage','unusual','dead'].includes(saved.condition)){
        s.health_cases.push({id:uuid(),animal_id:saved.animal_id||null,observation_id:saved.id,opened_at:new Date().toISOString(),severity:saved.condition==='dead'?'critical':saved.condition==='shell_damage'?'high':'moderate',status:'open',summary:`Automatically opened from ${saved.condition.replaceAll('_',' ')} observation.`,assigned_to:'Conservation Team',follow_up_date:null,outcome:null});
      }
      return saved;
    });
  },
  addReview(observationId,status,reason,reviewer){ return mutate(s=>{ const r={id:uuid(),observation_id:observationId,status,reason,reviewer,reviewed_at:new Date().toISOString()}; s.observation_reviews.push(r); s.audit_log.push({id:uuid(),occurred_at:r.reviewed_at,actor:reviewer,action:'observation_reviewed',entity_type:'observation',entity_id:observationId,detail:`Review status: ${status}`}); return r; }); },
  addCorrection(observationId,changes,reason,actor){ return mutate(s=>{ const c={id:uuid(),observation_id:observationId,changes,reason,actor,created_at:new Date().toISOString()}; s.observation_corrections.push(c); s.audit_log.push({id:uuid(),occurred_at:c.created_at,actor,action:'observation_correction_appended',entity_type:'observation',entity_id:observationId,detail:reason}); return c; }); },
  createAnimal(row,actor='Admin'){ return mutate(s=>{ if(s.animals.some(a=>a.public_id===row.public_id)) throw new Error('Public ID already exists'); const a={id:uuid(),status:'active',registration_date:new Date().toISOString().slice(0,10),...row}; s.animals.push(a); s.identifiers.push({id:uuid(),animal_id:a.id,type:'visible_id',value:a.public_id,active:true},{id:uuid(),animal_id:a.id,type:'qr',value:a.public_id,active:true}); s.audit_log.push({id:uuid(),occurred_at:new Date().toISOString(),actor,action:'animal_created',entity_type:'animal',entity_id:a.id,detail:a.public_id}); return a; }); },
  updateAnimal(id,changes,actor='Admin'){ return mutate(s=>{ const a=s.animals.find(x=>x.id===id); if(!a) throw new Error('Animal not found'); const before={...a}; Object.assign(a,changes); s.audit_log.push({id:uuid(),occurred_at:new Date().toISOString(),actor,action:'animal_updated',entity_type:'animal',entity_id:id,detail:JSON.stringify({before,after:a})}); return a; }); },
  archiveAnimal(id,actor='Admin'){ return this.updateAnimal(id,{status:'archived'},actor); },
  addMeasurement(row,actor='Researcher'){ return mutate(s=>{ const m={id:uuid(),measured_at:new Date().toISOString(),recorded_by:actor,...row}; s.measurements.push(m); s.audit_log.push({id:uuid(),occurred_at:new Date().toISOString(),actor,action:'measurement_created',entity_type:'measurement',entity_id:m.id,detail:`${m.measurement_type} ${m.value} ${m.unit}`}); return m; }); },
  createHealthCase(row,actor='Veterinarian'){ return mutate(s=>{ const c={id:uuid(),opened_at:new Date().toISOString(),status:'open',...row}; s.health_cases.push(c); s.audit_log.push({id:uuid(),occurred_at:c.opened_at,actor,action:'health_case_created',entity_type:'health_case',entity_id:c.id,detail:c.summary}); return c; }); },
  addHealthEvent(row,actor='Veterinarian'){ return mutate(s=>{ const e={id:uuid(),event_at:new Date().toISOString(),actor_user_id:null,actor,...row}; s.health_case_events.push(e); s.audit_log.push({id:uuid(),occurred_at:e.event_at,actor,action:'health_case_event_created',entity_type:'health_case',entity_id:row.health_case_id,detail:row.event_type}); return e; }); },
  updateHealthCase(id,changes,actor='Veterinarian'){ return mutate(s=>{ const c=s.health_cases.find(x=>x.id===id); if(!c) throw new Error('Health case not found'); Object.assign(c,changes); s.health_case_events.push({id:uuid(),case_id:id,event_at:new Date().toISOString(),event_type:'status_update',notes:JSON.stringify(changes),actor}); s.audit_log.push({id:uuid(),occurred_at:new Date().toISOString(),actor,action:'health_case_updated',entity_type:'health_case',entity_id:id,detail:JSON.stringify(changes)}); return c; }); }
};
