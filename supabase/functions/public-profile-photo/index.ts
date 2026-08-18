import { createClient } from 'npm:@supabase/supabase-js@2';

const cors={
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods':'GET, OPTIONS'
};
const fail=(message:string,status:number)=>new Response(message,{status,headers:{...cors,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});

Deno.serve(async req=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
  if(req.method!=='GET')return fail('Method not allowed',405);
  try{
    const publicId=(new URL(req.url).searchParams.get('id')||'').toUpperCase();
    if(!/^T\d{3,8}$/.test(publicId))return fail('Invalid animal ID',400);
    const url=Deno.env.get('SUPABASE_URL')!;
    const service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
    const {data:animal,error:animalError}=await supabase.from('animals').select('id,profile_photo_id,status').eq('public_id',publicId).eq('status','active').maybeSingle();
    if(animalError)throw animalError;
    if(!animal?.profile_photo_id)return fail('Profile photograph not found',404);
    const {data:photo,error:photoError}=await supabase.from('photos').select('storage_path,mime_type').eq('id',animal.profile_photo_id).eq('animal_id',animal.id).maybeSingle();
    if(photoError)throw photoError;
    if(!photo?.storage_path)return fail('Profile photograph not found',404);
    const {data:file,error:downloadError}=await supabase.storage.from('sighting-photos').download(photo.storage_path);
    if(downloadError||!file)return fail('Profile photograph unavailable',404);
    return new Response(file,{status:200,headers:{...cors,'Content-Type':photo.mime_type||file.type||'image/jpeg','Cache-Control':'public, max-age=3600, stale-while-revalidate=86400','X-Content-Type-Options':'nosniff','Cross-Origin-Resource-Policy':'cross-origin'}});
  }catch(error){console.error(error);return fail('Unable to retrieve profile photograph',500);}
});
