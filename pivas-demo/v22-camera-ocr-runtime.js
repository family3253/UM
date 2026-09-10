// PIVAS v2.2 Camera Manager
// Front and back cameras are both supported as scan modes.
(function(){
 const CameraManager={
  stream:null,
  video:null,
  mode:'scan',
  facingMode:localStorage.getItem('pivas-camera')||'environment',

  async start(video,options={}){
   this.video=video;
   this.mode=options.mode||'scan';
   if(options.camera){this.facingMode=options.camera;}
   if(this.stream)this.stop();

   this.stream=await navigator.mediaDevices.getUserMedia({
    video:{
     facingMode:{ideal:this.facingMode},
     width:{ideal:1280},
     height:{ideal:720}
    },
    audio:false
   });

   video.srcObject=this.stream;
   await video.play();
   localStorage.setItem('pivas-camera',this.facingMode);

   return {
    ok:true,
    mode:this.mode,
    camera:this.facingMode
   };
  },

  async switchCamera(){
   this.facingMode=this.facingMode==='environment'?'user':'environment';
   localStorage.setItem('pivas-camera',this.facingMode);
   if(this.video){
    return this.start(this.video,{mode:'scan',camera:this.facingMode});
   }
  },

  getCurrentCamera(){
   return this.facingMode==='user'?'前置摄像头':'后置摄像头';
  },

  stop(){
   if(this.stream){
    this.stream.getTracks().forEach(t=>t.stop());
   }
   this.stream=null;
  },

  async recognize(){
   return {
    text:'',
    status:'waiting-ocr',
    mode:this.mode
   };
  }
 };
 window.PIVASCameraManager=CameraManager;
 window.PIVASCameraOCR=CameraManager;
})();