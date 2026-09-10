// PIVAS v2.0 Workbench Layer
(function(){
 const PIVASWorkbench={
  mode:'tablet',
  modules:{
   scan:{status:'ready',sources:['camera','barcode','ocr','visual-match']},
   voice:{status:'ready',contexts:['drug-search','drug-qa']},
   knowledge:{status:'ready',local:true,versioning:true},
   agent:{status:'ready',workflow:['parse','extract','evidence','card','review','publish']}
  },
  setMode(){
   const w=window.innerWidth;
   this.mode=w<600?'mobile':w<900?'tablet':'desktop';
   document.documentElement.dataset.pivasMode=this.mode;
   return this.mode;
  },
  startScan(){return {state:'continuous',sources:this.modules.scan.sources};},
  startVoice(){return {state:'listening',target:'drug-resolver'};},
  exportKnowledge(){return {type:'pivas-knowledge-package',local:true};}
 };
 window.PIVASWorkbench=PIVASWorkbench;
 PIVASWorkbench.setMode();
 window.addEventListener('resize',()=>PIVASWorkbench.setMode());
})();