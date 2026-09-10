/* PIVAS v1.3 Card Agent runtime
 Converts validated evidence objects into one-page card payloads.
 */
(function(root){
 function emphasize(text){
  const keys=['不得振摇','不得冷冻','不得静脉推注','避光','输注时间','终浓度','滤器'];
  let out=text||'';
  keys.forEach(k=>{out=out.replaceAll(k,'<strong class="danger">'+k+'</strong>')});
  return out;
 }
 function generateCard(draft){
  return {
   title:draft.drugName||'',
   strength:draft.strength||'',
   sections:[
    {title:'调配方法',content:emphasize(draft.preparation)},
    {title:'稀释',content:emphasize(draft.diluent)},
    {title:'贮藏',content:emphasize(draft.storage)},
    {title:'输注要求',content:emphasize(draft.infusion)}
   ],
   warnings:(draft.warnings||[]).map(emphasize)
  };
 }
 root.PivasCardAgent={generateCard};
})(window);
