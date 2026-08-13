import { createClient } from 'npm:@supabase/supabase-js@2';

const cors={
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods':'POST, OPTIONS'
};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json'}});
const injuryConditions=new Set(['possible_injury','shell_damage','unusual','dead']);

async function validateTurnstile(token:string|undefined,ip:string|null){
  const secret=Deno.env.get('TURNSTILE_SECRET_KEY');
  const required=Deno.env.get('TURNSTILE_REQUIRED')==='true';
  if(!secret) return !required;
  if(!token) return !required;
  const form=new FormData();form.set('secret',secret);form.set('response',token);if(ip)form.set('remoteip',ip);
  const r=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:form});
  if(!r.ok)return false;const result=await r.json();return Boolean(result.success);
}
function validPhoto(file:File){ return ['image/jpeg','image/png','image/webp'].includes(file.type)&&file.size>0&&file.size<=5*1024*1024; }
function safeText(v:unknown,max=500){ return String(v??'').trim().slice(0,max); }

Deno.serve(async req=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
  if(req.method!=='POST')return json({error:'Method not allowed'},405);
  try{
    const fd=await req.formData();const payload=JSON.parse(String(fd.get('payload')||'{}'));
    const photos=fd.getAll('photo').filter((x):x is File=>x instanceof File);
    if(photos.length<1||photos.length>3)return json({error:'1 to 3 photographs are required'},400);
    if(photos.some(p=>!validPhoto(p)))return json({error:'Unsupported or oversized photograph'},400);
    const lat=Number(payload.lat),lng=Number(payload.lng),accuracy=Number(payload.accuracy_m),score=Number(payload.quality_score);
    if(!Number.isFinite(lat)||lat < -90||lat > 90||!Number.isFinite(lng)||lng < -180||lng > 180)return json({error:'Invalid coordinates'},400);
    if(!Number.isFinite(accuracy)||accuracy<0||accuracy>10000)return json({error:'Invalid GPS accuracy'},400);
    if(!Number.isFinite(score)||score<0||score>100)return json({error:'Invalid quality score'},400);
    if(!['qr','manual','untagged','natural','rfid','device'].includes(payload.identification_method))return json({error:'Invalid identification method'},400);
    if(!['certain','probable','uncertain'].includes(payload.identification_confidence))return json({error:'Invalid identification confidence'},400);
    const ip=req.headers.get('CF-Connecting-IP')||req.headers.get('x-forwarded-for');
    if(!await validateTurnstile(payload.turnstile_token,ip))return json({error:'Bot verification failed'},403);

    const url=Deno.env.get('SUPABASE_URL')!;const service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
    const {data:observationId,error:ingestError}=await supabase.rpc('service_ingest_public_sighting',{
      p_client_submission_id:payload.client_submission_id,
      p_public_id:payload.public_id||null,
      p_observed_at:payload.observed_at,
      p_lat:lat,p_lng:lng,p_gps_accuracy_m:accuracy,
      p_identification_method:payload.identification_method,
      p_identification_confidence:payload.identification_confidence,
      p_possible_species:safeText(payload.possible_species,100)||null,
      p_behaviour:safeText(payload.behaviour,100)||null,
      p_condition:safeText(payload.condition,100)||null,
      p_notes:safeText(payload.notes,500)||null,
      p_quality_score:score
    });
    if(ingestError)throw ingestError;

    const photoRows=[];
    for(const photo of photos){
      const ext=photo.type==='image/png'?'png':photo.type==='image/webp'?'webp':'jpg';
      const path=`${observationId}/${crypto.randomUUID()}.${ext}`;
      const {error:upErr}=await supabase.storage.from('sighting-photos').upload(path,photo,{contentType:photo.type,upsert:false,cacheControl:'31536000'});if(upErr)throw upErr;
      photoRows.push({observation_id:observationId,storage_path:path,mime_type:photo.type,byte_size:photo.size,exif_retained:false});
    }
    const {error:photoErr}=await supabase.from('photos').insert(photoRows);if(photoErr)throw photoErr;

    if(injuryConditions.has(payload.condition)){
      const alertUrl=`${url}/functions/v1/health-alert`;
      fetch(alertUrl,{method:'POST',headers:{Authorization:`Bearer ${service}`,'Content-Type':'application/json'},body:JSON.stringify({observation_id:observationId})}).catch(()=>{});
    }
    return json({ok:true,observation_id:observationId,verification_status:'pending'});
  }catch(error){console.error(error);return json({error:'Unable to accept sighting',detail:String(error?.message||error)},500);}
});
