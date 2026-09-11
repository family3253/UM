// PIVAS v2.3 Voice Module
// Restored v0.8 capability: voice search -> drug resolver -> drug card
(function(){
 const VoiceModule={
  recognition:null,
  supported:!!(window.SpeechRecognition||window.webkitSpeechRecognition),

  start(){
   const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
   if(!SR){
    return {ok:false,error:'speech-not-supported'};
   }
   this.recognition=new SR();
   this.recognition.lang='zh-CN';
   this.recognition.continuous=false;

   this.recognition.onresult=(e)=>{
    const text=e.results[0][0].transcript;
    this.handleResult(text);
   };

   this.recognition.start();
   return {ok:true,state:'listening'};
  },

  handleResult(text){
   const result={text:text,source:'voice'};
   window.dispatchEvent(new CustomEvent('pivas-voice-result',{detail:result}));

   if(window.PIVASDrugResolver){
    const candidates=window.PIVASDrugResolver.resolve(text);
    if(candidates&&candidates.length){
      window.dispatchEvent(new CustomEvent('pivas-drug-found',{detail:candidates[0]}));
    }
   }
   return result;
  }
 };
 window.PIVASVoiceModule=VoiceModule;
})();
