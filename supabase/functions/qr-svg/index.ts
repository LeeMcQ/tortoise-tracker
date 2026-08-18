import QRCode from 'npm:qrcode@1.5.4';
import { createClient } from 'npm:@supabase/supabase-js@2';

const cors={
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods':'GET, OPTIONS'
};
const fail=(message:string,status:number)=>new Response(message,{status,headers:{...cors,'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});

Deno.serve(async req=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
  if(req.method!=='GET')return fail('Method not allowed',405);
  try{
    const url=Deno.env.get('SUPABASE_URL')!;
    const serviceKey=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const auth=req.headers.get('Authorization')||'';
    if(!auth.startsWith('Bearer '))return fail('Unauthorized',401);
    const client=createClient(url,serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
    const {data:{user},error:userError}=await client.auth.getUser(auth.slice(7));
    if(userError||!user)return fail('Unauthorized',401);
    const {data:profile,error:profileError}=await client.from('profiles').select('role,active').eq('user_id',user.id).maybeSingle();
    if(profileError||!profile?.active)return fail('Forbidden',403);
    if(profile.role!=='admin')return fail('Administrator access required',403);

    const id=(new URL(req.url).searchParams.get('id')||'').toUpperCase();
    if(!/^T\d{3,8}$/.test(id))return fail('Invalid ID',400);
    const {data:animal,error:animalError}=await client.from('animals').select('public_id,status').eq('public_id',id).maybeSingle();
    if(animalError)throw animalError;
    if(!animal||animal.status==='archived')return fail('Animal not found',404);

    const base=Deno.env.get('PUBLIC_SITE_URL')||'https://leemcq.github.io/tortoise-tracker';
    const target=`${base.replace(/\/$/,'')}/#/t/${id}?source=qr`;
    const svg=await QRCode.toString(target,{type:'svg',errorCorrectionLevel:'H',margin:3,width:420,color:{dark:'#0c4248',light:'#fffdf8'}});
    return new Response(svg,{headers:{...cors,'Content-Type':'image/svg+xml; charset=utf-8','Cache-Control':'private, max-age=300','Content-Disposition':`inline; filename=\"${id}-qr.svg\"`,'X-Content-Type-Options':'nosniff'}});
  }catch(error){console.error(error);return fail('Unable to generate QR code',500);}
});
