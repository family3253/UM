// PIVAS v2.1 Scan Runtime
(function(){
 const ScanRuntime={
  stream:null,
  running:false,
  startCamera:async function(video){
   if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){return {ok:false,error:'camera-not-supported'};}
   this.stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});
   if(video){video.srcObject=this.stream; await video.play();}
   this.running=true;
   return {ok:true,state:'camera-running'};
  },
  stopCamera:function(){
   if(this.stream){this.stream.getTracks().forEach(t=>t.stop());}
   this.running=false;
  },
  resolve:function(text){
   const db=[
    {name:'维布妥昔单抗',keys:['维布妥昔','brentuximab','安适利']},
    {name:'注射用阿昔洛韦',keys:['阿昔洛韦','aciclovir']}
   ];
   const t=(text||'').toLowerCase();
   return db.map(d=>({name:d.name,score:d.keys.some(k=>t.includes(k.toLowerCase()))?0.98:0}))
   .filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
  }
 };
 window.PIVASScanRuntime=ScanRuntime;
})();