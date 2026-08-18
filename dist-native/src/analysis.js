const EARTH_RADIUS_M=6371008.8;
const rad=v=>v*Math.PI/180;
export function distanceMetres(a,b){
  const lat1=Number(a.lat),lon1=Number(a.lng),lat2=Number(b.lat),lon2=Number(b.lng);
  if(![lat1,lon1,lat2,lon2].every(Number.isFinite))return 0;
  const dLat=rad(lat2-lat1),dLon=rad(lon2-lon1);
  const x=Math.sin(dLat/2)**2+Math.cos(rad(lat1))*Math.cos(rad(lat2))*Math.sin(dLon/2)**2;
  return 2*EARTH_RADIUS_M*Math.asin(Math.min(1,Math.sqrt(x)));
}
export function applyObservationFilters(rows,{from='',to='',animal='all',species='',condition='',verification=''}={}){
  const fromMs=from?new Date(`${from}T00:00:00`).getTime():-Infinity;
  const toMs=to?new Date(`${to}T23:59:59.999`).getTime():Infinity;
  return (rows||[]).filter(r=>{
    const t=new Date(r.observed_at).getTime();
    return t>=fromMs&&t<=toMs&&(!animal||animal==='all'||r.public_id===animal)&&(!species||r.species_name===species||r.common_name===species)&&(!condition||r.condition===condition)&&(!verification||r.verification_status===verification);
  });
}
export function categoryCounts(rows,key,{unknown='Unknown'}={}){
  const m=new Map();for(const r of rows||[]){const k=r?.[key]||unknown;m.set(k,(m.get(k)||0)+1);}return [...m].map(([label,value])=>({label,value})).sort((a,b)=>b.value-a.value||String(a.label).localeCompare(String(b.label)));
}
export function monthlyCounts(rows,locale='en-ZA'){
  if(!(rows||[]).length)return[];
  const dates=rows.map(r=>new Date(r.observed_at)).filter(d=>!Number.isNaN(d.getTime())).sort((a,b)=>a-b);
  if(!dates.length)return[];
  let y=dates[0].getFullYear(),m=dates[0].getMonth();const endY=dates.at(-1).getFullYear(),endM=dates.at(-1).getMonth();const out=[];
  while(y<endY||(y===endY&&m<=endM)){const key=`${y}-${String(m+1).padStart(2,'0')}`;out.push({key,label:new Intl.DateTimeFormat(locale,{month:'short',year:'2-digit'}).format(new Date(y,m,1)),value:0});m++;if(m===12){m=0;y++;}}
  const map=new Map(out.map(x=>[x.key,x]));for(const r of rows){const d=new Date(r.observed_at);const k=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;if(map.has(k))map.get(k).value++;}
  return out;
}
export function hourBands(rows){
  const labels=['00–03','04–07','08–11','12–15','16–19','20–23'];const out=labels.map(label=>({label,value:0}));
  for(const r of rows||[]){const h=new Date(r.observed_at).getHours();if(Number.isFinite(h))out[Math.floor(h/4)].value++;}return out;
}
export function qualityBands(rows){const out={High:0,Good:0,'Needs review':0};for(const r of rows||[]){const q=Number(r.quality_score||0);if(q>=90)out.High++;else if(q>=70)out.Good++;else out['Needs review']++;}return Object.entries(out).map(([label,value])=>({label,value}));}
export function lastSeenRows(animals,observations){
  return (animals||[]).map(a=>{const obs=(observations||[]).filter(o=>o.animal_id===a.id||o.public_id===a.public_id).sort((x,y)=>new Date(y.observed_at)-new Date(x.observed_at));const d=obs[0]?.observed_at||null;return{public_id:a.public_id,name:a.name||'',last_seen:d,days:d?Math.max(0,Math.floor((Date.now()-new Date(d).getTime())/86400000)):null,sightings:obs.length};}).sort((a,b)=>(b.days??1e9)-(a.days??1e9));
}
export function movementMetrics(animals,observations){
  return (animals||[]).map(a=>{const rows=(observations||[]).filter(o=>o.animal_id===a.id||o.public_id===a.public_id).filter(o=>Number.isFinite(Number(o.lat))&&Number.isFinite(Number(o.lng))).sort((x,y)=>new Date(x.observed_at)-new Date(y.observed_at));let connectionSum=0,maxFromFirst=0;for(let i=1;i<rows.length;i++){connectionSum+=distanceMetres(rows[i-1],rows[i]);maxFromFirst=Math.max(maxFromFirst,distanceMetres(rows[0],rows[i]));}return{public_id:a.public_id,name:a.name||'',sightings:rows.length,connection_sum_m:Math.round(connectionSum),max_displacement_m:Math.round(maxFromFirst),first_seen:rows[0]?.observed_at||null,last_seen:rows.at(-1)?.observed_at||null};}).sort((a,b)=>b.sightings-a.sightings);
}
export function observationMatrix(rows,locale='en-ZA'){
  const days=Array.from({length:7},(_,i)=>new Intl.DateTimeFormat(locale,{weekday:'short'}).format(new Date(2023,0,1+i))),bands=['00–05','06–11','12–17','18–23'];const matrix=days.map(day=>({day,values:[0,0,0,0]}));
  for(const r of rows||[]){const d=new Date(r.observed_at);matrix[d.getDay()].values[Math.floor(d.getHours()/6)]++;}return{bands,matrix,max:Math.max(1,...matrix.flatMap(x=>x.values))};
}
export function gridAggregate(rows,cellMetres=250){
  const valid=(rows||[]).filter(r=>Number.isFinite(Number(r.lat))&&Number.isFinite(Number(r.lng)));if(!valid.length)return[];
  const meanLat=valid.reduce((s,r)=>s+Number(r.lat),0)/valid.length,latStep=cellMetres/111320,lngStep=cellMetres/(111320*Math.max(.2,Math.cos(rad(meanLat))));const cells=new Map();
  for(const r of valid){const iy=Math.floor(Number(r.lat)/latStep),ix=Math.floor(Number(r.lng)/lngStep),key=`${iy}:${ix}`;let c=cells.get(key);if(!c){c={key,count:0,latMin:iy*latStep,latMax:(iy+1)*latStep,lngMin:ix*lngStep,lngMax:(ix+1)*lngStep,rows:[]};cells.set(key,c);}c.count++;c.rows.push(r);}
  return [...cells.values()].sort((a,b)=>b.count-a.count);
}
export function median(values){const a=(values||[]).map(Number).filter(Number.isFinite).sort((x,y)=>x-y);if(!a.length)return null;const m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2;}
