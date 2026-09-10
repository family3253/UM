/* PIVAS v1.1 Card Generator Rules */
(function(root){
 function markImportant(text){
  const rules=['不得振摇','不得冷冻','不得静脉推注','避光','输注时间','终浓度'];
  return rules.reduce((x,r)=>x.replaceAll(r,'<strong class="danger">'+r+'</strong>'),text||'');
 }
 function generateCard(drug){
  return {title:drug.name,image:drug.image||'',sections:['调配方法','稀释','稳定性','输注要求','关键提醒'],important:markImportant(drug.warning||'')}
 }
 root.PivasCardGenerator={generateCard};
})(window);
