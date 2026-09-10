// PIVAS v2.1 Scan UI
(function(){
 const ScanUI={
  open:function(){
   const box=document.createElement('div');
   box.id='pivas-scan-panel';
   box.innerHTML=`<div style="position:fixed;inset:0;background:#081b2e;color:white;z-index:9999;padding:20px;text-align:center"><h2>📷 自动识别药品</h2><video id="pivas-camera" autoplay playsinline style="width:80%;max-height:60vh;border-radius:16px;background:#000"></video><p id="pivas-scan-result">正在启动摄像头...</p><button id="pivas-close">关闭</button></div>`;
   document.body.appendChild(box);
   const video=box.querySelector('#pivas-camera');
   if(window.PIVASScanRuntime){window.PIVASScanRuntime.startCamera(video).then(()=>{
    box.querySelector('#pivas-scan-result').innerText='摄像头已开启，等待OCR识别';
   });}
   box.querySelector('#pivas-close').onclick=()=>{if(window.PIVASScanRuntime)window.PIVASScanRuntime.stopCamera();box.remove();};
  }
 };
 window.PIVASScanUI=ScanUI;
})();