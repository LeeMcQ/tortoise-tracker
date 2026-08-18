const KEY='nautilus-product-events';
const ALLOWED=new Set(['app_opened','qr_scan_started','qr_scan_succeeded','manual_id_selected','gps_permission_prompted','gps_captured','gps_failed','photo_added','sighting_started','sighting_completed','sighting_queued','sync_succeeded','sync_failed','staff_login','export_created','web_vital','client_error']);
const BLOCKED=new Set(['lat','lng','latitude','longitude','email','name','notes','public_id','animal_id']);
function sanitise(properties={}){ const safe={}; for(const [k,v] of Object.entries(properties)){ if(BLOCKED.has(k))continue; if(['string','number','boolean'].includes(typeof v)||v==null)safe[k]=v; } return safe; }
async function sendServer(event){
  const c=window.NAUTILUS_CONFIG||{}; if(c.demoMode||!c.supabaseUrl||!c.supabasePublishableKey||!navigator.onLine)return;
  try{await fetch(`${c.supabaseUrl.replace(/\/$/,'')}/functions/v1/product-event`,{method:'POST',headers:{apikey:c.supabasePublishableKey,'Content-Type':'application/json'},body:JSON.stringify({event_name:event.name,properties:event.properties})});}catch{}
}
export function track(name,properties={}){
  if(!window.NAUTILUS_CONFIG.publicAnalyticsEnabled||!ALLOWED.has(name)) return;
  const event={name,at:new Date().toISOString(),properties:sanitise(properties)};
  const rows=JSON.parse(localStorage.getItem(KEY)||'[]'); rows.push(event); localStorage.setItem(KEY,JSON.stringify(rows.slice(-1000))); void sendServer(event);
}
export function productEvents(){ return JSON.parse(localStorage.getItem(KEY)||'[]'); }
