import { track } from './analytics.js';
let lcp=0,cls=0,inp=0;
function observe(type,cb,opts={}){try{const po=new PerformanceObserver(list=>cb(list.getEntries()));po.observe({type,buffered:true,...opts});return po;}catch{return null;}}
observe('largest-contentful-paint',entries=>{const e=entries.at(-1);if(e)lcp=Math.round(e.startTime);});
observe('layout-shift',entries=>{for(const e of entries)if(!e.hadRecentInput)cls+=e.value;});
observe('event',entries=>{for(const e of entries)if(e.duration>inp)inp=Math.round(e.duration);},{durationThreshold:40});
function report(){track('web_vital',{lcp_ms:lcp,cls_milli:Math.round(cls*1000),inp_ms:inp,route:(location.hash||'#/').split('?')[0].slice(0,80)});}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')report();});
window.addEventListener('pagehide',report,{once:true});
window.addEventListener('error',e=>track('client_error',{source:String(e.filename||'').split('/').pop()||'inline',line:Number(e.lineno)||0,route:(location.hash||'#/').split('?')[0].slice(0,80)}));
window.addEventListener('unhandledrejection',()=>track('client_error',{source:'promise',route:(location.hash||'#/').split('?')[0].slice(0,80)}));
