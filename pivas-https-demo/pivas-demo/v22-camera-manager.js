// PIVAS v2.2 Camera Manager
(function(){
 const CameraManager={
  stream:null,
  mode:'environment',
  async start(video,mode){
   this.mode=mode||this.mode;
   this.stop();
   if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){
    return {ok:false,error:'camera-not-supported'};
   }
   try{
    this.stream=await navigator.mediaDevices.getUserMedia({
     video:{facingMode:{ideal:this.mode}},
     audio:false
    });
    if(video){
     video.srcObject=this.stream;
     await video.play();
    }
    return {ok:true,mode:this.mode};
   }catch(e){
    return {ok:false,error:String(e)};
   }
  },
  async switch(video){
   const next=this.mode==='environment'?'user':'environment';
   return this.start(video,next);
  },
  stop(){
   if(this.stream){this.stream.getTracks().forEach(t=>t.stop());}
   this.stream=null;
  }
 };
 window.PIVASCameraManager=CameraManager;
})();