import QRCode from 'npm:qrcode@1.5.4';
import { createClient } from 'npm:@supabase/supabase-js@2';
Deno.serve(async req=>{
  try{
    const url=Deno.env.get('SUPABASE_URL')!,anon=Deno.env.get('SUPABASE_ANON_KEY')!;
    const auth=req.headers.get('Authorization')||'';const client=createClient(url,anon,{global:{headers:{Authorization:auth}}});
    const {data:{user}}=await client.auth.getUser();if(!user)return new Response('Unauthorized',{status:401});
    const {data:profile}=await client.from('profiles').select('role,active').eq('user_id',user.id).single();if(!profile?.active)return new Response('Forbidden',{status:403});
    const id=new URL(req.url).searchParams.get('id')?.toUpperCase();if(!id||!/^T\d{3,8}$/.test(id))return new Response('Invalid ID',{status:400});
    const base=Deno.env.get('PUBLIC_SITE_URL')||'https://tortoise.nautilusbayhoa.co.za';const target=`${base.replace(/\/$/,'')}/#/t/${id}?source=qr`;
    const svg=await QRCode.toString(target,{type:'svg',errorCorrectionLevel:'H',margin:3,width:420,color:{dark:'#0c4248',light:'#fffdf8'}});
    return new Response(svg,{headers:{'Content-Type':'image/svg+xml; charset=utf-8','Cache-Control':'private, max-age=300','X-Content-Type-Options':'nosniff'}});
  }catch(error){return new Response(String(error?.message||error),{status:500});}
});
