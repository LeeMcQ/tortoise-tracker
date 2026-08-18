function b64urlDecode(segment){ try{ return JSON.parse(atob(segment.replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(segment.length/4)*4,'='))); }catch{return{};} }
export class SupabaseAPI {
  constructor(){ const c=window.NAUTILUS_CONFIG; this.url=(c.supabaseUrl||'').replace(/\/$/,''); this.key=c.supabasePublishableKey||''; this.session=JSON.parse(sessionStorage.getItem('nautilus-supabase-session')||'null'); this._refreshing=null; }
  configured(){ return Boolean(this.url&&this.key); }
  token(){ return this.session?.access_token || this.key; }
  headers(extra={}){ return {apikey:this.key,Authorization:`Bearer ${this.token()}`,...extra}; }
  async request(path,{method='GET',body,headers={},retry=true}={}){ const r=await fetch(`${this.url}${path}`,{method,headers:this.headers(body instanceof FormData?headers:{'Content-Type':'application/json',...headers}),body:body instanceof FormData?body:body==null?undefined:JSON.stringify(body)}); if(r.status===401&&retry&&this.session?.refresh_token&&!path.startsWith('/auth/v1/token')){try{if(!this._refreshing)this._refreshing=this.refresh().finally(()=>this._refreshing=null);await this._refreshing;return this.request(path,{method,body,headers,retry:false});}catch{this.logout();}} if(!r.ok) throw new Error(await r.text()); const ct=r.headers.get('content-type')||''; return ct.includes('json')?r.json():r.text(); }
  async rpc(name,params={}){ return this.request(`/rest/v1/rpc/${name}`,{method:'POST',body:params}); }
  publicProfilePhotoUrl(animal){ return animal?.profile_photo_id ? `${this.url}/functions/v1/public-profile-photo?id=${encodeURIComponent(animal.public_id)}&v=${encodeURIComponent(animal.profile_photo_id)}` : null; }
  async publicAnimals(){ const rows=await this.rpc('list_public_animals',{}); return (rows||[]).map(a=>({...a,profile_photo_url:this.publicProfilePhotoUrl(a)})); }
  async publicAnimal(publicId){ const rows=await this.rpc('get_public_animal',{p_public_id:publicId}); const a=Array.isArray(rows)?rows[0]||null:rows; return a?{...a,profile_photo_url:this.publicProfilePhotoUrl(a)}:null; }
  async publicHistory(publicId){ return this.rpc('get_public_history',{p_public_id:publicId}); }
  async publicMap(){ return this.rpc('get_public_map',{}); }
  async submitPublicSighting(row){ const fd=new FormData(); const copy={...row}; const photos=copy.photos||[]; delete copy.photos; fd.set('payload',JSON.stringify(copy)); photos.forEach((p,i)=>fd.append('photo',p.blob||p,`sighting-${i+1}.${(p.type||p.blob?.type||'image/jpeg').split('/')[1]||'jpg'}`)); return this.request('/functions/v1/public-sighting',{method:'POST',body:fd}); }
  async login(email,password){ const data=await this.request('/auth/v1/token?grant_type=password',{method:'POST',body:{email,password}}); this.session=data; sessionStorage.setItem('nautilus-supabase-session',JSON.stringify(data)); return data; }
  async refresh(){ if(!this.session?.refresh_token) throw new Error('No refresh token'); const data=await this.request('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:{refresh_token:this.session.refresh_token}}); this.session=data; sessionStorage.setItem('nautilus-supabase-session',JSON.stringify(data)); return data; }
  logout(){ this.session=null; sessionStorage.removeItem('nautilus-supabase-session'); }
  jwt(){ return this.session?.access_token ? b64urlDecode(this.session.access_token.split('.')[1]||'') : {}; }
  aal(){ return this.jwt().aal || 'aal1'; }
  async profile(){ const rows=await this.request('/rest/v1/profiles?select=user_id,display_name,role,active&user_id=eq.'+encodeURIComponent(this.jwt().sub||'')); return rows?.[0]||null; }
  async listFactors(){ return this.request('/auth/v1/factors'); }
  async challengeFactor(factorId){ return this.request(`/auth/v1/factors/${factorId}/challenge`,{method:'POST',body:{}}); }
  async verifyFactor(factorId,challengeId,code){ const data=await this.request(`/auth/v1/factors/${factorId}/verify`,{method:'POST',body:{challenge_id:challengeId,code}}); if(data?.access_token){ this.session={...this.session,...data}; sessionStorage.setItem('nautilus-supabase-session',JSON.stringify(this.session)); } return data; }
  async staffAnimals(){ return this.request('/rest/v1/animals?select=*&order=public_id.asc'); }
  async staffObservations(){ return this.request('/rest/v1/observations_effective?select=*&order=observed_at.desc'); }
  async staffHealthCases(){ return this.request('/rest/v1/health_cases?select=*&order=opened_at.desc'); }
  async staffTable(table,order='created_at.desc'){ return this.request(`/rest/v1/${table}?select=*&order=${encodeURIComponent(order)}`); }
  async createAnimal(row){ const rows=await this.request('/rest/v1/animals',{method:'POST',headers:{Prefer:'return=representation'},body:row}); const animal=rows[0]; if(animal){ await this.request('/rest/v1/animal_identifiers',{method:'POST',body:[{animal_id:animal.id,identifier_type:'visible_id',value:animal.public_id,active:true},{animal_id:animal.id,identifier_type:'qr',value:animal.public_id,active:true}]}); } return rows; }
  async updateAnimal(id,row){ row={...row,updated_at:new Date().toISOString()}; return this.request(`/rest/v1/animals?id=eq.${encodeURIComponent(id)}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:row}); }
  async createMeasurement(row){ return this.request('/rest/v1/measurements',{method:'POST',headers:{Prefer:'return=representation'},body:row}); }
  async createHealthCase(row){ return this.request('/rest/v1/health_cases',{method:'POST',headers:{Prefer:'return=representation'},body:row}); }
  async createHealthEvent(row){ return this.request('/rest/v1/health_case_events',{method:'POST',headers:{Prefer:'return=representation'},body:row}); }
  async updateHealthCase(id,row){ row={...row,updated_at:new Date().toISOString()}; return this.request(`/rest/v1/health_cases?id=eq.${encodeURIComponent(id)}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:row}); }
  async createReview(row){ return this.request('/rest/v1/observation_reviews',{method:'POST',headers:{Prefer:'return=representation'},body:row}); }
  async createCorrection(row){ return this.request('/rest/v1/observation_corrections',{method:'POST',headers:{Prefer:'return=representation'},body:row}); }
  async qrSvg(publicId){ const r=await fetch(`${this.url}/functions/v1/qr-svg?id=${encodeURIComponent(publicId)}`,{headers:this.headers()}); if(!r.ok) throw new Error(await r.text()); return r.text(); }
}
