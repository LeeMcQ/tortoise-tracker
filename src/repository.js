import { DemoDB } from './storage.js';
import { publicObservation, isPubliclyReleased } from './privacy.js';
import { SupabaseAPI } from './supabase-api.js';
import { qualityScore } from './quality.js';

const api=new SupabaseAPI();
const cfg=window.NAUTILUS_CONFIG;
export function isDemo(){ return cfg.demoMode || !api.configured(); }
export function authApi(){ return api; }

function demoPublicAnimal(a){ if(!a) return null; const tax=DemoDB.taxon(a.taxon_id); const obs=DemoDB.observationsForAnimal(a.id).map(o=>DemoDB.effectiveObservation(o.id)).filter(isPubliclyReleased); const last=obs[obs.length-1]||null; return {...a,scientific_name:tax?.scientific_name,common_name_en:tax?.common_name_en,common_name_af:tax?.common_name_af,conservation_status:tax?.conservation_status,last_observed_at:last?.observed_at||null}; }
export const Repo={
  async publicAnimals(){ return isDemo()?DemoDB.activeAnimals().map(demoPublicAnimal):api.publicAnimals(); },
  async publicAnimal(publicId){ return isDemo()?demoPublicAnimal(DemoDB.animalByPublicId(publicId)):api.publicAnimal(publicId); },
  async publicHistory(publicId){
    if(!isDemo()) return api.publicHistory(publicId);
    const a=DemoDB.animalByPublicId(publicId); if(!a)return[]; const rows=DemoDB.observationsForAnimal(a.id).map(o=>DemoDB.effectiveObservation(o.id)).filter(isPubliclyReleased); return rows.map((o,i)=>publicObservation(o,{latest:i===rows.length-1}));
  },
  async publicMap(){
    if(!isDemo()) return api.publicMap();
    const result=[]; for(const a of DemoDB.activeAnimals()){ const rows=DemoDB.observationsForAnimal(a.id).map(o=>DemoDB.effectiveObservation(o.id)).filter(isPubliclyReleased); rows.forEach((o,i)=>result.push({...publicObservation(o,{latest:i===rows.length-1}),name:a.name,public_id:a.public_id})); } return result;
  },
  async submitPublicSighting(row){
    row.quality_score=qualityScore(row); row.verification_status='pending'; row.observer_type='visitor';
    if(isDemo()) return DemoDB.createObservation({...row,photos:undefined,photo_count:(row.photos||[]).length});
    return api.submitPublicSighting(row);
  },
  async staffSnapshot(){
    if(isDemo()) return {animals:DemoDB.animals(),observations:DemoDB.observations().map(o=>DemoDB.effectiveObservation(o.id)),health_cases:DemoDB.all('health_cases'),measurements:DemoDB.all('measurements'),devices:DemoDB.all('devices'),deployments:DemoDB.all('deployments'),telemetry:DemoDB.all('telemetry_events'),audit:DemoDB.all('audit_log'),taxa:DemoDB.taxa()};
    const [animals,observations,health_cases,measurements,devices,deployments,telemetry,audit,taxa]=await Promise.all([api.staffAnimals(),api.staffObservations(),api.staffHealthCases(),api.staffTable('measurements','measured_at.desc'),api.staffTable('devices','created_at.desc'),api.staffTable('deployments','deployed_at.desc'),api.staffTable('telemetry_events','recorded_at.desc'),api.staffTable('audit_log','occurred_at.desc').catch(()=>[]),api.staffTable('taxa','scientific_name.asc')]); return {animals,observations,health_cases,measurements,devices,deployments,telemetry,audit,taxa};
  },
  async createAnimal(row,actor){ if(isDemo()) return DemoDB.createAnimal(row,actor); return (await api.createAnimal(row))[0]; },
  async updateAnimal(id,changes,actor){ if(isDemo()) return DemoDB.updateAnimal(id,changes,actor); return (await api.updateAnimal(id,changes))[0]; },
  async setProfilePhoto(id,photo,actor){ if(isDemo()){ const blob=photo.blob||photo; const dataUrl=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.readAsDataURL(blob);}); return DemoDB.setProfilePhoto(id,dataUrl,actor); } return api.setProfilePhoto(id,photo); },
  async clearProfilePhoto(id,actor){ if(isDemo()) return DemoDB.clearProfilePhoto(id,actor); return (await api.clearProfilePhoto(id))[0]; },
  async observationPhotos(id){ if(isDemo()) return []; const rows=await api.staffObservationPhotos(id); return Promise.all((rows||[]).map(async p=>({...p,url:await api.staffPhotoDataUrl(p.id)}))); },
  async reviewObservation(id,status,reason,reviewer){ if(isDemo()) return DemoDB.addReview(id,status,reason,reviewer); return api.createReview({observation_id:id,status,reason}); },
  async correctObservation(id,changes,reason,actor){ if(isDemo()) return DemoDB.addCorrection(id,changes,reason,actor); return api.createCorrection({observation_id:id,changes,reason}); },
  async addMeasurement(row,actor){ if(isDemo()) return DemoDB.addMeasurement(row,actor); return (await api.createMeasurement({...row,measured_at:new Date().toISOString()}))[0]; },
  async createHealthCase(row,actor){ if(isDemo()) return DemoDB.createHealthCase(row,actor); const assigned=row.assigned_to||null; const isUuid=typeof assigned==='string'&&/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(assigned); return (await api.createHealthCase({...row,assigned_to:isUuid?assigned:null,assigned_team:isUuid?null:assigned}))[0]; },
  async addHealthEvent(row,actor){ if(isDemo()) return DemoDB.addHealthEvent(row,actor); return (await api.createHealthEvent(row))[0]; },
  async updateHealthCase(id,changes,actor){ if(isDemo()) return DemoDB.updateHealthCase(id,changes,actor); return (await api.updateHealthCase(id,changes))[0]; }
};
