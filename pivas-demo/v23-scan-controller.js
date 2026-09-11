// PIVAS v2.3 Scan Controller
// Connect Camera Manager -> OCR -> Drug Resolver -> Drug Card
(function(){
 const ScanController={
  running:false,
  timer:null,
  interval:1200,
  lastResult:null,

  start(options={}){
   this.running=true;
   this.interval=options.interval||1200;
   return {ok:true,status:'scan-controller-running'};
  },

  stop(){
   this.running=false;
   if(this.timer)clearInterval(this.timer);
   this.timer=null;
  },

  processText(text){
   const resolver=window.PIVASDrugResolver;
   if(!resolver||!resolver.resolve){
    return {matched:false,error:'resolver-unavailable'};
   }

   const candidates=resolver.resolve(text||'');
   if(!candidates.length){
    return {matched:false,candidates:[]};
   }

   const best=candidates[0];
   this.lastResult=best;

   if(best.score>=0.9){
    this.openCard(best);
   }

   return {
    matched:true,
    drug:best,
    confidence:best.score
   };
  },

  openCard(drug){
   window.dispatchEvent(new CustomEvent('pivas-drug-found',{
    detail:drug
   }));

   if(window.PIVASDrugCard&&window.PIVASDrugCard.open){
    window.PIVASDrugCard.open(drug.id);
   }
  },

  onOCRResult(text){
   return this.processText(text);
  }
 };

 window.PIVASScanController=ScanController;
})();
