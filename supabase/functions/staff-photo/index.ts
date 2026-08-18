import { createClient } from 'npm:@supabase/supabase-js@2';
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Access-Control-Allow-Methods':'GET, OPTIONS'};
const fail=(message:string,status:number)=>new Response(message,{status,headers:{...cors,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
Deno.serve(async req=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
  if(req.method!=='GET')return fail('Method not allowed',405);
  try{
    const photoId=new URL(req.url).searchParams.get('id')||'';
    if(!/^[0-9a-f-]{36}$/i.test(photoId))return fail('Invalid photo ID',400);
    const url=Deno.env.get('SUPABASE_URL')!,serviceKey=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,authHeader=req.headers.get('Authorization')||'';
    if(!authHeader.startsWith('Bearer '))return fail('Authentication required',401);
    const service=createClient(url,serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
    const {data:{user},error:userError}=await service.auth.getUser(authHeader.slice(7));
    if(userError||!user)return fail('Invalid session',401);
    const {data:profile}=await service.from('profiles').select('role,active').eq('user_id',user.id).maybeSingle();
    if(!profile?.active||!['scientist','admin'].includes(profile.role))return fail('Access denied',403);
    const {data:photo,error}=await service.from('photos').select('storage_path,mime_type').eq('id',photoId).maybeSingle();
    if(error)throw error;if(!photo)return fail('Photo not found',404);
    const {data:file,error:downloadError}=await service.storage.from('sighting-photos').download(photo.storage_path);
    if(downloadError||!file)return fail('Photo unavailable',404);
    return new Response(file,{headers:{...cors,'Content-Type':photo.mime_type||file.type||'image/jpeg','Cache-Control':'private, max-age=300','X-Content-Type-Options':'nosniff'}});
  }catch(error){console.error(error);return fail('Unable to retrieve photograph',500);}
});
