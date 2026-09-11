/* PIVAS v2.4 AI Builder
   Upgrades the v0.8 builder: PDF/TXT/MD -> extracted text -> configured LLM -> strict card JSON.
   Output remains DRAFT and requires pharmacist source review before publish.
*/
(function(global){
  function parseCardJson(raw){
    let s=String(raw||'').trim();
    s=s.replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'').trim();
    const a=s.indexOf('{'), b=s.lastIndexOf('}');
    if(a<0||b<a) throw new Error('模型未返回JSON对象');
    const obj=JSON.parse(s.slice(a,b+1));
    if(!obj||Array.isArray(obj)||typeof obj!=='object') throw new Error('模型输出不是药品卡对象');
    obj.warnings=Array.isArray(obj.warnings)?obj.warnings:obj.warnings?[String(obj.warnings)]:[];
    obj.evidence=Array.isArray(obj.evidence)?obj.evidence:[];
    return obj;
  }
  function getApi(){
    try{return JSON.parse(localStorage.getItem('pivas_api')||'{}')}catch{return {}}
  }
  function loadScript(src){
    return new Promise((resolve,reject)=>{
      const existing=[...document.scripts].find(s=>s.src===src);
      if(existing){if(global.pdfjsLib)return resolve();existing.addEventListener('load',resolve,{once:true});existing.addEventListener('error',reject,{once:true});return;}
      const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=()=>reject(new Error('PDF解析库加载失败'));document.head.appendChild(s);
    });
  }
  async function ensurePdfJs(){
    if(global.pdfjsLib)return global.pdfjsLib;
    const src='https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js';
    await loadScript(src);
    if(!global.pdfjsLib)throw new Error('PDF.js不可用');
    global.pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
    return global.pdfjsLib;
  }
  async function ocrPdfPage(page){
    if(!global.Tesseract)return '';
    const viewport=page.getViewport({scale:1.6});
    const canvas=document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
    await page.render({canvasContext:canvas.getContext('2d'),viewport}).promise;
    const ret=await global.Tesseract.recognize(canvas,'chi_sim+eng');
    return String(ret?.data?.text||'').trim();
  }
  async function extractPdfText(file,onProgress){
    const pdfjs=await ensurePdfJs();
    const data=await file.arrayBuffer();
    const pdf=await pdfjs.getDocument({data}).promise;
    const max=Math.min(pdf.numPages,30); const out=[];
    for(let i=1;i<=max;i++){
      onProgress?.(`正在解析说明书第 ${i}/${max} 页…`);
      const page=await pdf.getPage(i); const tc=await page.getTextContent();
      let text=tc.items.map(x=>x.str).join(' ').trim();
      if(text.length<40 && global.Tesseract){
        onProgress?.(`第 ${i} 页文字较少，正在OCR…`);
        text=await ocrPdfPage(page);
      }
      out.push(`[PAGE ${i}]\n${text}`);
    }
    return out.join('\n\n');
  }
  async function extractDocument(file,onProgress){
    if(!file)throw new Error('请先选择说明书文件');
    const name=(file.name||'').toLowerCase();
    if(name.endsWith('.txt')||name.endsWith('.md'))return await file.text();
    if(name.endsWith('.pdf')||file.type==='application/pdf')return await extractPdfText(file,onProgress);
    throw new Error('当前建卡支持 PDF / TXT / MD');
  }
  function promptFor(text,nameHint,strengthHint,source){
    const clipped=String(text||'').slice(0,70000);
    return `你是PIVAS药品知识维护智能体。只能依据下方说明书文本生成药品卡DRAFT，不得补充无来源事实。\n药名提示：${nameHint||'无'}\n规格提示：${strengthHint||'无'}\n来源：${source||'上传说明书'}\n\n仅返回一个JSON对象，不要Markdown。字段必须为：\n{"name":"","strength":"","prep":"","storage":"","infusion":"","warnings":[],"evidence":[{"field":"prep|storage|infusion|warnings","page":1,"quote":"原文短句"}]}\n要求：prep包含复溶、稀释液、体积和终浓度中有来源的内容；storage包含原瓶及复溶/稀释后稳定性；infusion包含输注时间、滤器/管路；warnings仅保留PIVAS操作高优先级警示。缺失内容写“未在所给资料中确认”，不要猜测。证据quote必须来自原文且尽量短。\n\n说明书文本：\n${clipped}`;
  }
  async function callModel(text,meta={}){
    const api=getApi();
    if(api.enabled===false||!api.base||!api.key||!api.model)throw new Error('请先在“AI / API 设置”中配置并启用外部AI');
    const ctrl=new AbortController(); const timeout=Math.max(5,Number(api.timeout||30))*1000; const timer=setTimeout(()=>ctrl.abort(),timeout);
    try{
      const r=await fetch(String(api.base).replace(/\/$/,'')+'/chat/completions',{method:'POST',signal:ctrl.signal,headers:{'Content-Type':'application/json','Authorization':'Bearer '+api.key},body:JSON.stringify({model:api.model,temperature:Number(api.temperature??0.1),messages:[{role:'system',content:'你是医院PIVAS知识维护智能体。严格基于提供资料，输出结构化JSON草稿。'},{role:'user',content:promptFor(text,meta.name,meta.strength,meta.source)}]})});
      if(!r.ok)throw new Error('AI接口 HTTP '+r.status);
      const j=await r.json(); return parseCardJson(j.choices?.[0]?.message?.content||'');
    }finally{clearTimeout(timer)}
  }
  function fillBuilder(card,source){
    const byId=id=>document.getElementById(id);
    if(byId('draftName'))byId('draftName').value=card.name||'';
    if(byId('draftStrength'))byId('draftStrength').value=card.strength||'';
    if(byId('draftSource'))byId('draftSource').value=source||'上传说明书';
    if(byId('draftPrep'))byId('draftPrep').value=card.prep||'';
    if(byId('draftStorage'))byId('draftStorage').value=card.storage||'';
    if(byId('draftInfusion'))byId('draftInfusion').value=card.infusion||'';
    if(byId('draftWarnings'))byId('draftWarnings').value=(card.warnings||[]).join('\n');
    if(byId('sourceChecked'))byId('sourceChecked').checked=false;
    try{localStorage.setItem('pivas_last_card_evidence',JSON.stringify(card.evidence||[]))}catch(e){}
  }
  function installBuilderOverride(){
    const legacy=global.generateDraft;
    global.generateDraft=async function(){
      const status=document.getElementById('draftStatus');
      const file=document.getElementById('leafletFile')?.files?.[0];
      if(!file){ if(typeof legacy==='function')return legacy(); return; }
      const name=document.getElementById('draftName')?.value?.trim()||'';
      const strength=document.getElementById('draftStrength')?.value?.trim()||'';
      const source=document.getElementById('draftSource')?.value?.trim()||file.name;
      try{
        if(status)status.textContent='智能体：正在读取说明书…';
        const text=await extractDocument(file,msg=>{if(status)status.textContent='智能体：'+msg});
        if(!text.trim())throw new Error('未从文件提取到可用文字');
        if(status)status.textContent='智能体：正在抽取PIVAS配置字段与证据…';
        const card=await callModel(text,{name,strength,source});
        fillBuilder(card,source);
        if(status)status.textContent='DRAFT 已生成 · 尚未发布 · 请逐字段核对原始来源后勾选审核';
        if(global.PIVASAI)global.PIVASAI.lastCard={...card,source};
        return card;
      }catch(e){
        if(status)status.textContent='AI建卡未完成：'+(e?.message||String(e));
        if(global.toast)global.toast(e?.message||String(e));
        return null;
      }
    };
  }
  global.PIVASAIBuild={parseCardJson,extractDocument,callModel,fillBuilder,installBuilderOverride};
  if(global.document){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installBuilderOverride);
    else installBuilderOverride();
  }
})(window);
