// Dependency-free Supabase REST/RPC helper for the production hand-off.
// app.js currently starts in demoMode so the prototype runs immediately.
export class SupabaseAPI {
  constructor(url, anonKey){ this.url=url.replace(/\/$/,''); this.key=anonKey; }
  headers(extra={}){ return { apikey:this.key, Authorization:`Bearer ${this.key}`, 'Content-Type':'application/json', ...extra }; }
  async rpc(name, body){ const r=await fetch(`${this.url}/rest/v1/rpc/${name}`,{method:'POST',headers:this.headers(),body:JSON.stringify(body)}); if(!r.ok)throw new Error(await r.text()); return r.json(); }
  publicTortoise(id){ return this.rpc('get_public_tortoise',{p_public_id:id}); }
  publicHistory(id){ return this.rpc('get_public_history',{p_public_id:id}); }
  async submitPublic(row){ const r=await fetch(`${this.url}/functions/v1/public-sighting`,{method:'POST',headers:this.headers(),body:JSON.stringify({client_submission_id:row.client_submission_id,public_id:row.public_id,observed_at:row.observed_at,lat:row.lat,lng:row.lng,gps_accuracy_m:row.accuracy,identification_method:row.identification_method,behaviour:row.behaviour,condition:row.condition,notes:row.notes,possible_species:row.possible_species})}); if(!r.ok)throw new Error(await r.text()); return r.json(); }
}
