export function qualityScore(o){
  let score=100;
  const acc=Number(o.accuracy_m ?? o.accuracy ?? 999);
  if(acc>250) score-=35; else if(acc>100) score-=22; else if(acc>50) score-=12; else if(acc>25) score-=5;
  const photos=(o.photos||[]).length || o.photo_count || 0;
  if(photos===0) score-=25; else if(photos>=2) score+=2;
  if(o.identification_confidence==='uncertain') score-=20; else if(o.identification_confidence==='probable') score-=8;
  if(o.identification_method==='untagged') score-=10;
  const when=new Date(o.observed_at); if(Number.isNaN(+when) || +when > Date.now()+5*60*1000) score-=25;
  if(o.condition==='unsure') score-=3;
  return Math.max(0,Math.min(100,Math.round(score)));
}
export function qualityBand(score){ return score>=90?'high':score>=70?'medium':'low'; }
