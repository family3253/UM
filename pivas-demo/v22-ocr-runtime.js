// PIVAS v2.2 OCR Runtime
// Web demo recognition pipeline: camera frame -> OCR -> drug resolver
(function(root){
 const OCRRuntime={
  status:'ready',
  engine:'adapter',
  frameBuffer:[],
  candidates:[],
  normalize(text){
   return (text||'').replace(/\\s+/g,'').toLowerCase();
  },
  processOCR(text){
   const normalized=this.normalize(text);
   this.frameBuffer.push(normalized);
   if(this.frameBuffer.length>5)this.frameBuffer.shift();
   return this.resolve(normalized);
  },
  resolve(text){
   const db=window.PIVASDrugDB||[];
   const result=db.map(d=>({
    drug:d.name,
    score:this.score(text,d)
   })).sort((a,b)=>b.score-a.score);
   this.candidates=result;
   return result[0]||null;
  },
  score(text,drug){
   const keys=[drug.name].concat(drug.keywords||[]).map(x=>this.normalize(x));
   return Math.max(...keys.map(k=>text.includes(k)?1:0));
  }
 };
 root.PIVASOCRRuntime=OCRRuntime;
})(window);