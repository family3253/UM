// PIVAS v2.2 Scan UI
(function(){
 const ScanUI={
  open:function(){
   const box=document.createElement('div');
   box.id='pivas-scan-panel';
   box.innerHTML=`<div style="position:fixed;inset:0;background:#081b2e;color:white;z-index:9999;padding:18px;text-align:center">
   <h2>📷 药品扫描</h2>
   <video id="pivas-camera" autoplay playsinline style="width:86%;max-height:55vh;border-radius:16px;background:#000"></video>
   <p id="pivas-camera-state">正在启动扫描摄像头...</p>
   <p id="pivas-scan-result">等待OCR识别</p>
   <button id="pivas-switch-camera">🔄 切换前/后摄像头</button>
   <button id="pivas-close">关闭</button>
   </div>`;
   document.body.appendChild(box);
   const video=box.querySelector('#pivas-camera');
   const state=box.querySelector('#pivas-camera-state');
   const start=async()=>{
    const cam=window.PIVASCameraOCR;
    if(cam){
      const saved=localStorage.getItem('pivas-camera')||'environment';
      await cam.start(video,saved);
      state.innerText='当前扫描摄像头：'+(saved==='user'?'前置':'后置');
    } else if(window.PIVASScanRuntime){
      await window.PIVASScanRuntime.startCamera(video);
      state.innerText='后置扫描摄像头';
    }
   };
   start();
   box.querySelector('#pivas-switch-camera').onclick=async()=>{
    if(window.PIVASCameraOCR){
      await window.PIVASCameraOCR.switchCamera();
      const mode=window.PIVASCameraOCR.facingMode;
      localStorage.setItem('pivas-camera',mode);
      state.innerText='当前扫描摄像头：'+(mode==='user'?'前置':'后置');
    }
   };
   box.querySelector('#pivas-close').onclick=()=>{
    if(window.PIVASCameraOCR)window.PIVASCameraOCR.stop();
    if(window.PIVASScanRuntime)window.PIVASScanRuntime.stopCamera();
    box.remove();
   };
  }
 };
 window.PIVASScanUI=ScanUI;
})();