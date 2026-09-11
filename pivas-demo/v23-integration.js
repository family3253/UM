/* PIVAS v2.3 Integration Bridge
   Reuses v0.5/v0.6/v0.8 UI and connects v2.2/v2.3 modules without replacing them.
*/
(function(global){
  function getDrug(id){
    try{
      if(typeof drugs!=='undefined' && Array.isArray(drugs)) return drugs.find(d=>d.id===id)||null;
    }catch(e){}
    if(Array.isArray(global.drugs)) return global.drugs.find(d=>d.id===id)||null;
    return null;
  }
  function setContext(candidate){
    if(!global.PIVASAgentRouter) return null;
    const drug=(candidate&&candidate.id&&getDrug(candidate.id))||candidate||null;
    global.PIVASAgentRouter.setDrug(drug);
    return drug;
  }
  function openFound(candidate){
    if(!candidate||!candidate.id) return false;
    setContext(candidate);
    if(typeof global.openDrug==='function'){
      global.openDrug(candidate.id);
      return true;
    }
    return false;
  }
  function patchOpenDrug(){
    const original=global.openDrug;
    if(typeof original!=='function'||original.__pivasV23Integrated) return;
    function integratedOpenDrug(id){
      setContext(getDrug(id)||{id});
      return original.apply(this,arguments);
    }
    integratedOpenDrug.__pivasV23Integrated=true;
    global.openDrug=integratedOpenDrug;
  }
  global.addEventListener('pivas-drug-found',e=>openFound(e.detail));
  if(global.document&&document.readyState==='loading') document.addEventListener('DOMContentLoaded',patchOpenDrug);
  else patchOpenDrug();
  global.PIVASIntegration={getDrug,setContext,openFound,patchOpenDrug};
})(window);
