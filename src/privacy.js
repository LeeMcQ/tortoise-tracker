const EARTH_M_PER_DEG_LAT=111320;
export function generalisePoint(lat,lng,metres=250){
  if(!Number.isFinite(lat)||!Number.isFinite(lng)) return null;
  const latStep=metres/EARTH_M_PER_DEG_LAT;
  const lngStep=metres/(EARTH_M_PER_DEG_LAT*Math.max(.2,Math.cos(lat*Math.PI/180)));
  return {
    lat:(Math.floor(lat/latStep)+0.5)*latStep,
    lng:(Math.floor(lng/lngStep)+0.5)*lngStep
  };
}
export function publicObservation(o,{latest=false}={}){
  const cfg=window.NAUTILUS_CONFIG;
  const metres=latest?cfg.publicLatestGeneralisationMetres:cfg.publicHistoryGeneralisationMetres;
  const p=generalisePoint(Number(o.lat),Number(o.lng),metres);
  return {...o,lat:p?.lat??null,lng:p?.lng??null,accuracy_m:undefined,gps_accuracy_m:undefined,notes:undefined,observer_user_id:undefined,observer_email:undefined,location_generalised:true,generalisation_metres:metres};
}
export function isPubliclyReleased(o){
  const delay=(window.NAUTILUS_CONFIG.publicLatestDelayHours||0)*3600000;
  return o.verification_status==='verified' && Date.now()-new Date(o.observed_at).getTime()>=delay;
}
