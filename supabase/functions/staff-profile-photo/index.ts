import { createClient } from 'npm:@supabase/supabase-js@2';
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS'};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const allowed=new Set(['image/jpeg','image/png','image/webp']);
Deno.serve(async req=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
  if(req.method!=='POST')return json({error:'Method not allowed'},405);
  try{
    const url=Deno.env.get('SUPABASE_URL')!, serviceKey=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const authHeader=req.headers.get('Authorization')||'';
    if(!authHeader.startsWith('Bearer '))return json({error:'Authentication required'},401);
    const service=createClient(url,serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
    const {data:{user},error:userErr}=await service.auth.getUser(authHeader.slice(7)); if(userErr||!user)return json({error:'Invalid session'},401);
    const {data:profile}=await service.from('profiles').select('role,active').eq('user_id',user.id).maybeSingle();
    if(!profile?.active||!['scientist','admin'].includes(profile.role))return json({error:'Scientist or Administrator access required'},403);
    const fd=await req.formData(); const animalId=String(fd.get('animal_id')||''); const photo=fd.get('photo');
    if(!/^[0-9a-f-]{36}$/i.test(animalId))return json({error:'Invalid animal ID'},400);
    if(!(photo instanceof File)||!allowed.has(photo.type)||photo.size<1||photo.size>5*1024*1024)return json({error:'JPEG, PNG or WebP photograph up to 5 MB required'},400);
    const {data:animal,error:animalErr}=await service.from('animals').select('id,profile_photo_id').eq('id',animalId).maybeSingle(); if(animalErr)throw animalErr; if(!animal)return json({error:'Animal not found'},404);
    const ext=photo.type==='image/png'?'png':photo.type==='image/webp'?'webp':'jpg'; const path=`profiles/${animalId}/${crypto.randomUUID()}.${ext}`;
    const {error:uploadErr}=await service.storage.from('sighting-photos').upload(path,photo,{contentType:photo.type,upsert:false,cacheControl:'31536000'}); if(uploadErr)throw uploadErr;
    const {data:rows,error:photoErr}=await service.from('photos').insert({animal_id:animalId,storage_path:path,mime_type:photo.type,byte_size:photo.size,exif_retained:false,view_type:'unknown',photo_quality:'good'}).select('id').limit(1); if(photoErr)throw photoErr;
    const photoId=rows?.[0]?.id; if(!photoId)throw new Error('Profile photo record was not created');
    const {error:updateErr}=await service.from('animals').update({profile_photo_id:photoId,updated_at:new Date().toISOString()}).eq('id',animalId); if(updateErr)throw updateErr;
    await service.from('audit_log').insert({actor_user_id:user.id,action:'profile_photo_replaced',entity_type:'animal',entity_id:animalId,after_data:{profile_photo_id:photoId}});
    return json({ok:true,photo_id:photoId});
  }catch(error){console.error(error);return json({error:'Unable to update profile photograph',detail:String(error?.message||error)},500);}
});
