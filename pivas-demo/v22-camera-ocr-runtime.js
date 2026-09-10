// PIVAS v22 Camera + OCR Runtime
(function(){
 const Runtime={
  stream:null,
  facingMode:'environment',
  video:null,
  async start(video,mode){
   this.video=video;
   this.facingMode=mode||this.facingMode;
   if(this.stream)this.stop();
   this.stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:this.facingMode}},audio:false});
   video.srcObject=this.stream;
   await video.play();
   return {ok:true,facing:this.facingMode};
  },
  async switchCamera(){
   this.facingMode=this.facingMode==='environment'?'user':'environment';
   if(this.video)return this.start(this.video,this.facingMode);
  },
  stop(){
   if(this.stream)this.stream.getTracks().forEach(t=>t.stop());
   this.stream=null;
  },
  async recognize(){
   // OCR adapter reserved. Future: Tesseract/API/local OCR.
   return {text:'',status:'waiting-ocr'};
  }
 };
 window.PIVASCameraOCR=Runtime;
})();