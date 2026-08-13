let loading;
async function ensureLeaflet(){
  if(window.L) return window.L;
  if(!navigator.onLine) throw new Error('offline');
  if(!loading) loading=new Promise((resolve,reject)=>{
    if(!document.querySelector('link[data-leaflet]')){ const css=document.createElement('link'); css.rel='stylesheet'; css.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; css.dataset.leaflet='1'; document.head.append(css); }
    const s=document.createElement('script'); s.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; s.crossOrigin=''; s.onload=()=>resolve(window.L); s.onerror=reject; document.head.append(s);
  });
  return loading;
}
export async function renderMap(element,rows,{centre,zoom,attribution,tileUrl,onSelect}={}){
  const L=await ensureLeaflet();
  const map=L.map(element,{scrollWheelZoom:false}).setView(centre||window.NAUTILUS_CONFIG.map.centre,zoom||window.NAUTILUS_CONFIG.map.zoom);
  L.tileLayer(tileUrl||window.NAUTILUS_CONFIG.map.tileUrl,{maxZoom:19,attribution:attribution||window.NAUTILUS_CONFIG.map.attribution}).addTo(map);
  const grouped={}; rows.filter(r=>Number.isFinite(Number(r.lat))&&Number.isFinite(Number(r.lng))).forEach(r=>(grouped[r.public_id||r.animal_id||'unassigned']??=[]).push(r));
  Object.values(grouped).forEach(group=>{
    group.sort((a,b)=>new Date(a.observed_at)-new Date(b.observed_at));
    const pts=group.map(r=>[Number(r.lat),Number(r.lng)]);
    group.forEach(r=>L.circleMarker([Number(r.lat),Number(r.lng)],{radius:7,weight:2,fillOpacity:.75}).addTo(map).bindPopup(`<strong>${escapeHtml(r.name||r.public_id||'Observation')}</strong><br>${new Date(r.observed_at).toLocaleString()}<br>Public position generalised`).on('click',()=>onSelect?.(r)));
    if(pts.length>1) L.polyline(pts,{dashArray:'5,8',weight:2,opacity:.6}).addTo(map);
  });
  if(rows.length){ const bounds=L.latLngBounds(rows.filter(r=>Number.isFinite(Number(r.lat))).map(r=>[Number(r.lat),Number(r.lng)])); if(bounds.isValid()) map.fitBounds(bounds.pad(.18),{maxZoom:15}); }
  setTimeout(()=>map.invalidateSize(),50); return map;
}
function escapeHtml(s=''){ return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
