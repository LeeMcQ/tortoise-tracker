import { createClient } from 'npm:@supabase/supabase-js@2';
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, apikey, content-type'};
Deno.serve(async req=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
  try{
    const url=Deno.env.get('SUPABASE_URL')!,service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const auth=req.headers.get('Authorization')||'';if(auth!==`Bearer ${service}`)return Response.json({error:'Forbidden'},{status:403,headers:cors});
    const {observation_id}=await req.json();const supabase=createClient(url,service,{auth:{persistSession:false}});
    const {data:o,error}=await supabase.from('observations_effective').select('id,public_id,observed_at,condition,quality_score').eq('id',observation_id).single();if(error)throw error;
    const to=(Deno.env.get('HEALTH_ALERT_TO')||'').split(',').map(x=>x.trim()).filter(Boolean);const apiKey=Deno.env.get('RESEND_API_KEY');const from=Deno.env.get('HEALTH_ALERT_FROM');
    if(!apiKey||!from||!to.length)return Response.json({ok:true,email:'not_configured'},{headers:cors});
    const html=`<h2>Nautilus Bay wildlife health alert</h2><p><strong>${o.public_id||'Untagged animal'}</strong> has a new <strong>${o.condition}</strong> observation.</p><p>Observed: ${o.observed_at}<br>Quality score: ${o.quality_score}/100</p><p>Open the restricted staff dashboard to review the exact location and photograph.</p>`;
    const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json','User-Agent':'nautilus-conservation-platform/2.0'},body:JSON.stringify({from,to,subject:`Wildlife health alert: ${o.public_id||'untagged'} — ${o.condition}`,html})});
    if(!r.ok)throw new Error(await r.text());return Response.json({ok:true,email:'sent'},{headers:cors});
  }catch(error){console.error(error);return Response.json({error:String(error?.message||error)},{status:500,headers:cors});}
});
