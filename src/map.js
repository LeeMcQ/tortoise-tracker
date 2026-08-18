import { gridAggregate, distanceMetres } from './analysis.js';
let loading;
async function ensureLeaflet(){
  if(window.L) return window.L;
  if(!navigator.onLine) throw new Error('offline');
  if(!loading) loading=new Promise((resolve,reject)=>{
    if(!document.querySelector('link[data-leaflet]')){ const css=document.createElement('link'); css.rel='stylesheet'; css.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; css.integrity='sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='; css.crossOrigin='anonymous'; css.dataset.leaflet='1'; document.head.append(css); }
    const s=document.createElement('script'); s.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; s.integrity='sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='; s.crossOrigin='anonymous'; s.onload=()=>resolve(window.L); s.onerror=reject; document.head.append(s);
  });
  return loading;
}
const esc=(s='')=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const PALETTE=['#245d51','#a97538','#536d88','#8c5668','#6d713e','#7a5a93','#3f7c86','#965548'];
const FIXED={
  healthy:'#2f7a58',possible_injury:'#c48621',shell_damage:'#b65c2b',unusual:'#8a5aa8',dead:'#6d2635',unsure:'#68737a',unknown:'#68737a',
  verified:'#2f7a58',pending:'#c48621',questionable:'#b65c2b',rejected:'#6d2635',
  high:'#2f7a58',medium:'#c48621',low:'#b65c2b'
};
function categoricalStyle(rows,key){const vals=[...new Set(rows.map(r=>r[key]||'Unknown'))];const colors=new Map(vals.map((v,i)=>[v,FIXED[v]||PALETTE[i%PALETTE.length]]));return {color:r=>colors.get(r[key]||'Unknown'),legend:vals.map(v=>({label:human(v),color:colors.get(v)}))};}
function human(v=''){return String(v).replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase());}
function recencyStyle(rows){const now=Date.now();const defs=[{days:7,label:'≤ 7 days',color:'#2f7a58'},{days:30,label:'8–30 days',color:'#7a8c3a'},{days:90,label:'31–90 days',color:'#c48621'},{days:Infinity,label:'> 90 days',color:'#8b5c58'}];return{color:r=>{const d=Math.max(0,(now-new Date(r.observed_at))/86400000);return defs.find(x=>d<=x.days).color;},legend:defs.map(x=>({label:x.label,color:x.color}))};}
function qualityStyle(){return{color:r=>{const q=Number(r.quality_score||0);return q>=90?'#2f7a58':q>=70?'#c48621':'#b65c2b';},legend:[{label:'High (90–100)',color:'#2f7a58'},{label:'Good (70–89)',color:'#c48621'},{label:'Needs review (<70)',color:'#b65c2b'}]};}
function themeStyle(rows,theme){if(theme==='species')return categoricalStyle(rows,'species_name');if(theme==='condition')return categoricalStyle(rows,'condition');if(theme==='verification')return categoricalStyle(rows,'verification_status');if(theme==='quality')return qualityStyle();if(theme==='recency')return recencyStyle(rows);return{color:()=>PALETTE[0],legend:[{label:'Observation',color:PALETTE[0]}]};}
function legendControl(L,items,title='Legend'){
  const C=L.Control.extend({onAdd(){const d=L.DomUtil.create('div','map-legend');d.innerHTML=`<strong>${esc(title)}</strong>${items.map(i=>`<span><i style="--legend:${esc(i.color)}"></i>${esc(i.label)}</span>`).join('')}`;L.DomEvent.disableClickPropagation(d);return d;}});return new C({position:'bottomright'});
}
function popup(row,{showAccuracy=false,publicMode=false}={}){const af=document.documentElement.lang.startsWith('af');const bits=[`<strong>${esc(row.name||row.public_id||(af?'Waarneming':'Observation'))}</strong>`,esc(new Date(row.observed_at).toLocaleString(af?'af-ZA':'en-ZA'))];if(row.species_name)bits.push(esc(row.species_name));if(row.behaviour)bits.push(`${af?'Gedrag':'Behaviour'}: ${esc(human(row.behaviour))}`);if(row.condition)bits.push(`${af?'Toestand':'Condition'}: ${esc(human(row.condition))}`);if(showAccuracy&&(row.accuracy_m??row.gps_accuracy_m)!=null)bits.push(`GPS ±${Math.round(row.accuracy_m??row.gps_accuracy_m)} m`);if(publicMode)bits.push(af?'Openbare ligging veralgemeen':'Public position generalised');return bits.join('<br>');}

function fallbackBounds(rows){
  const valid=rows.filter(r=>Number.isFinite(Number(r.lat))&&Number.isFinite(Number(r.lng)));
  if(!valid.length)return null;const lats=valid.map(r=>Number(r.lat)),lngs=valid.map(r=>Number(r.lng));let minLat=Math.min(...lats),maxLat=Math.max(...lats),minLng=Math.min(...lngs),maxLng=Math.max(...lngs);if(minLat===maxLat){minLat-=.001;maxLat+=.001;}if(minLng===maxLng){minLng-=.001;maxLng+=.001;}return{valid,minLat,maxLat,minLng,maxLng};
}
export function renderFallbackMap(element,rows,{theme='points',publicMode=false,legendTitle='Observations'}={}){
  const b=fallbackBounds(rows);if(!b){element.innerHTML='<div class="map-empty"><strong>No mapped observations</strong><span>No released location records are available for this selection.</span></div>';return null;}
  const W=900,H=520,pad=46,style=themeStyle(b.valid,theme);const xy=r=>{const x=pad+(Number(r.lng)-b.minLng)/(b.maxLng-b.minLng)*(W-pad*2),y=H-pad-(Number(r.lat)-b.minLat)/(b.maxLat-b.minLat)*(H-pad*2);return[x,y]};
  const grid=[.25,.5,.75].map(f=>`<line x1="${pad}" y1="${pad+(H-pad*2)*f}" x2="${W-pad}" y2="${pad+(H-pad*2)*f}"/><line x1="${pad+(W-pad*2)*f}" y1="${pad}" x2="${pad+(W-pad*2)*f}" y2="${H-pad}"/>`).join('');
  const pts=b.valid.map(r=>{const[x,y]=xy(r),c=style.color(r);return`<g><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="8" fill="${esc(c)}" fill-opacity=".78" stroke="${esc(c)}" stroke-width="2"><title>${esc((r.name||r.public_id||'Observation')+' · '+new Date(r.observed_at).toLocaleString())}</title></circle></g>`}).join('');
  const legend=style.legend.map((i,k)=>`<span><i style="--legend:${esc(i.color)}"></i>${esc(i.label)}</span>`).join('');
  element.innerHTML=`<div class="offline-map" role="img" aria-label="${publicMode?'Generalised observation diagram':'Observation coordinate diagram'}"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet"><rect x="${pad}" y="${pad}" width="${W-pad*2}" height="${H-pad*2}" rx="8" fill="currentColor" opacity=".025"/><g class="fallback-grid">${grid}</g>${pts}<text x="${W-52}" y="34" text-anchor="middle" class="north-label">N ↑</text></svg><div class="map-legend fallback-legend"><strong>${esc(legendTitle)}</strong>${legend}</div><p class="map-fallback-note">Interactive basemap unavailable; observation positions are shown in their correct relative geographic arrangement.</p></div>`;return element;
}
export async function renderMap(element,rows,{centre,zoom,attribution,tileUrl,onSelect,connectPoints=false}={}){return renderThematicMap(element,rows,{centre,zoom,attribution,tileUrl,onSelect,connectPoints,theme:'points',publicMode:true});}
export async function renderThematicMap(element,rows,{centre,zoom,attribution,tileUrl,onSelect,connectPoints=false,theme='points',publicMode=false,showAccuracy=false,densityCellMetres=250,enableMeasure=false,legendTitle='Legend'}={}){
  let L;try{L=await ensureLeaflet();}catch(error){console.warn('Leaflet unavailable; using local spatial fallback',error);return renderFallbackMap(element,rows,{theme,publicMode,legendTitle});}
  if(element._leaflet_map){try{element._leaflet_map.remove();}catch{} element._leaflet_map=null;element.removeAttribute('_leaflet_id');}
  const map=L.map(element,{scrollWheelZoom:false,preferCanvas:true}).setView(centre||window.NAUTILUS_CONFIG.map.centre,zoom||window.NAUTILUS_CONFIG.map.zoom);element._leaflet_map=map;
  L.tileLayer(tileUrl||window.NAUTILUS_CONFIG.map.tileUrl,{maxZoom:19,attribution:attribution||window.NAUTILUS_CONFIG.map.attribution}).addTo(map);L.control.scale({imperial:false}).addTo(map);
  const valid=(rows||[]).filter(r=>Number.isFinite(Number(r.lat))&&Number.isFinite(Number(r.lng)));const bounds=[];
  if(theme==='density'){
    const cells=gridAggregate(valid,densityCellMetres),max=Math.max(1,...cells.map(c=>c.count));
    for(const c of cells){const opacity=.15+.7*(c.count/max);L.rectangle([[c.latMin,c.lngMin],[c.latMax,c.lngMax]],{weight:1,color:'#245d51',fillColor:'#245d51',fillOpacity:opacity}).addTo(map).bindPopup(`<strong>${c.count} observation${c.count===1?'':'s'}</strong><br>Approx. ${densityCellMetres} m grid cell`);bounds.push([c.latMin,c.lngMin],[c.latMax,c.lngMax]);}
    legendControl(L,[{label:'Lower density',color:'#a9c8be'},{label:'Higher density',color:'#245d51'}],`Density · ${densityCellMetres} m cells`).addTo(map);
  }else{
    const style=themeStyle(valid,theme);legendControl(L,style.legend,legendTitle).addTo(map);
    const grouped={};for(const r of valid)(grouped[r.public_id||r.animal_id||'unassigned']??=[]).push(r);
    for(const group of Object.values(grouped)){
      group.sort((a,b)=>new Date(a.observed_at)-new Date(b.observed_at));
      const pts=[];for(const r of group){const p=[Number(r.lat),Number(r.lng)],color=style.color(r);pts.push(p);bounds.push(p);if(showAccuracy&&(r.accuracy_m??r.gps_accuracy_m)>0)L.circle(p,{radius:Number(r.accuracy_m??r.gps_accuracy_m),weight:1,color,fillOpacity:.04,interactive:false}).addTo(map);L.circleMarker(p,{radius:7,weight:2,color,fillColor:color,fillOpacity:.78}).addTo(map).bindPopup(popup(r,{showAccuracy,publicMode})).on('click',()=>onSelect?.(r));}
      if(connectPoints&&pts.length>1)L.polyline(pts,{dashArray:'5,8',weight:2,opacity:.65,color:'#364f57'}).addTo(map);
    }
  }
  if(bounds.length){const b=L.latLngBounds(bounds);if(b.isValid())map.fitBounds(b.pad(.15),{maxZoom:16});}
  if(enableMeasure)addMeasureControl(L,map);
  setTimeout(()=>map.invalidateSize(),50);return map;
}
function addMeasureControl(L,map){
  let active=false,start=null,line=null,markers=[];
  const C=L.Control.extend({onAdd(){const wrap=L.DomUtil.create('div','leaflet-bar measure-control');const b=L.DomUtil.create('button','',wrap);b.type='button';b.textContent='↔';b.title='Measure straight-line distance';b.setAttribute('aria-label','Measure straight-line distance');L.DomEvent.disableClickPropagation(wrap);b.addEventListener('click',()=>{active=!active;b.classList.toggle('active',active);if(!active){start=null;} });return wrap;}});new C({position:'topleft'}).addTo(map);
  map.on('click',e=>{if(!active)return;if(!start){start=e.latlng;markers.push(L.circleMarker(start,{radius:5}).addTo(map).bindTooltip('Start',{permanent:false}));return;}const end=e.latlng,d=distanceMetres({lat:start.lat,lng:start.lng},{lat:end.lat,lng:end.lng});if(line)line.remove();line=L.polyline([start,end],{dashArray:'4,6',weight:2}).addTo(map).bindPopup(`${d>=1000?(d/1000).toFixed(2)+' km':Math.round(d)+' m'} straight-line distance`).openPopup();markers.push(L.circleMarker(end,{radius:5}).addTo(map));start=null;});
}
