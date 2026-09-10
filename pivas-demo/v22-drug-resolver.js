// PIVAS v2.2 Drug Resolver
// OCR text -> structured drug candidate -> confidence score
(function(){
 const KB=[
  {
   id:'BRENTUX_50',
   name:'注射用维布妥昔单抗',
   brand:'安适利',
   aliases:['维布妥昔','维布妥昔单抗','brentuximab','adcetris'],
   strength:'50 mg/瓶'
  }
 ];
 function normalize(t){
  return (t||'').toLowerCase().replace(/\s+/g,'');
 }
 function resolve(text){
  const t=normalize(text);
  return KB.map(d=>{
   let score=0;
   d.aliases.forEach(k=>{if(t.includes(normalize(k)))score=Math.max(score,0.95);});
   return {...d,score};
  }).filter(d=>d.score>0).sort((a,b)=>b.score-a.score);
 }
 window.PIVASDrugResolver={resolve,KB};
})();
