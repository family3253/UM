/* PIVAS v2.0 Demo Upgrade
   Frontend capability layer: Pad workbench, voice entry, local knowledge package,
   auto recognition states. This is a browser PoC adapter; native Android APIs can replace adapters later.
*/
(function(root){
 const PIVAS_V20={
  version:'2.0',
  deviceProfile(){
   const w=window.innerWidth;
   return w>=900?'pad-landscape':w>=600?'tablet':'mobile';
  },
  recognition:{
   mode:'continuous',
   sources:['barcode','ocr','visual-match'],
   resolve(candidates){return candidates.sort((a,b)=>b.confidence-a.confidence)[0]||null;}
  },
  voice:{
   enabled:!!(window.SpeechRecognition||window.webkitSpeechRecognition),
   start(onText){
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR)return {ok:false,message:'browser speech unavailable'};
    const r=new SR();r.lang='zh-CN';r.onresult=e=>onText(e.results[0][0].transcript);r.start();return {ok:true};
   }
  },
  knowledge:{
   schema:'local-drug-package-v1',
   export(){return localStorage.getItem('pivas_knowledge')||'{}'},
   import(data){localStorage.setItem('pivas_knowledge',data);return true;}
  }
 };
 root.PIVAS_V20=PIVAS_V20;
})(window);