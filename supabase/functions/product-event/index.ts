import { createClient } from 'npm:@supabase/supabase-js@2';
const allowed=new Set(['app_opened','qr_scan_started','qr_scan_succeeded','manual_id_selected','gps_permission_prompted','gps_captured','gps_failed','photo_added','sighting_started','sighting_completed','sighting_queued','sync_succeeded','sync_failed','web_vital','client_error']);
const blocked=['lat','lng','latitude','longitude','email','name','notes'];
Deno.serve(async req=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'content-type, apikey, authorization'}});
  try{const p=await req.json();if(!allowed.has(p.event_name))return Response.json({error:'Event not allowed'},{status:400});for(const k of blocked)if(p.properties?.[k]!=null)return Response.json({error:'Sensitive property rejected'},{status:400});
    const supabase=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false}});const {error}=await supabase.from('product_events').insert({event_name:p.event_name,anonymous_session_hash:p.anonymous_session_hash||null,properties:p.properties||{}});if(error)throw error;return Response.json({ok:true});
  }catch(e){return Response.json({error:String(e?.message||e)},{status:500});}
});
