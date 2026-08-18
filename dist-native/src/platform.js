// Platform capability adapter.
// Browser/PWA behaviour is the default; native wrappers can provide compatible Capacitor plugins later.

const media = q => globalThis.matchMedia?.(q)?.matches ?? false;

export function platformInfo(){
  const nav=globalThis.navigator||{};
  const standalone=media('(display-mode: standalone)') || nav.standalone===true;
  const windowControls=media('(display-mode: window-controls-overlay)');
  const coarse=media('(pointer: coarse)') || (nav.maxTouchPoints||0)>0;
  const compact=standalone || (coarse && media('(max-width: 1024px)'));
  const native=Boolean(globalThis.Capacitor?.isNativePlatform?.() || globalThis.Capacitor?.getPlatform?.() && globalThis.Capacitor?.getPlatform?.()!=='web');
  return {standalone,windowControls,coarse,compact,native,platform:globalThis.Capacitor?.getPlatform?.()||'web'};
}

export function applyPlatformMode(){
  if(!globalThis.document)return platformInfo();
  const info=platformInfo(),root=document.documentElement;
  root.dataset.displayMode=info.native?'native':info.standalone?'standalone':info.windowControls?'window-controls-overlay':'browser';
  root.classList.toggle('app-presentation',info.compact||info.native);
  root.classList.toggle('native-wrapper',info.native);
  return info;
}

export function watchPlatformMode(callback=()=>{}){
  const queries=['(display-mode: standalone)','(display-mode: window-controls-overlay)','(pointer: coarse)','(max-width: 1024px)'];
  const listeners=[];
  for(const q of queries){const m=globalThis.matchMedia?.(q);if(!m)continue;const fn=()=>callback(applyPlatformMode());m.addEventListener?.('change',fn);listeners.push(()=>m.removeEventListener?.('change',fn));}
  return ()=>listeners.forEach(fn=>fn());
}

export async function getCurrentPosition(options={enableHighAccuracy:true,timeout:15000,maximumAge:0}){
  const nativeGeo=globalThis.Capacitor?.Plugins?.Geolocation;
  if(nativeGeo?.getCurrentPosition){
    const p=await nativeGeo.getCurrentPosition(options);
    return {coords:{latitude:p.coords.latitude,longitude:p.coords.longitude,accuracy:p.coords.accuracy},timestamp:p.timestamp||Date.now()};
  }
  if(!globalThis.navigator?.geolocation)throw Object.assign(new Error('Geolocation unavailable'),{code:0,name:'NotSupportedError'});
  return new Promise((resolve,reject)=>navigator.geolocation.getCurrentPosition(resolve,reject,options));
}

export async function getCameraStream(constraints={video:{facingMode:{ideal:'environment'}}}){
  if(!globalThis.navigator?.mediaDevices?.getUserMedia)throw Object.assign(new Error('Camera unavailable'),{name:'NotSupportedError'});
  return navigator.mediaDevices.getUserMedia(constraints);
}

export function stopMediaStream(stream){ stream?.getTracks?.().forEach(t=>t.stop()); }

export async function haptic(style='light'){
  try{
    const h=globalThis.Capacitor?.Plugins?.Haptics;
    if(h?.impact){await h.impact({style});return true;}
    if(globalThis.navigator?.vibrate){navigator.vibrate(style==='heavy'?28:style==='medium'?18:10);return true;}
  }catch{}
  return false;
}

export async function share({title,text,url}){
  try{
    const nativeShare=globalThis.Capacitor?.Plugins?.Share;
    if(nativeShare?.share){await nativeShare.share({title,text,url});return true;}
    if(globalThis.navigator?.share){await navigator.share({title,text,url});return true;}
  }catch(err){if(err?.name!=='AbortError')throw err;return false;}
  return false;
}

export function setupNativeBack({canGoBack=()=>history.length>1,onBack=()=>history.back(),onExit=()=>globalThis.Capacitor?.Plugins?.App?.exitApp?.()}={}){
  const app=globalThis.Capacitor?.Plugins?.App;
  if(!app?.addListener)return ()=>{};
  let handle;
  app.addListener('backButton',()=>{if(canGoBack())onBack();else onExit();}).then?.(h=>handle=h);
  return ()=>handle?.remove?.();
}

export function installState(){
  const info=platformInfo();
  return {installed:info.standalone||info.native,mode:info.native?'native':info.standalone?'standalone':'browser'};
}
