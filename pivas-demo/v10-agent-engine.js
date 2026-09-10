/* PIVAS Knowledge Agent v1.0
 * Evidence-first workflow engine
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PivasAgentEngine=api})(this,function(){
function normalizeEvidenceItem(item={}){
 return {sourceType:item.sourceType||'unknown',role:item.sourceType==='external'?'supplemental':'primary',quote:item.quote||'',page:item.page||null,publishableAlone:item.sourceType!=='external'};
}
function validateDraft(draft={}){
 const blockers=[];
 Object.entries(draft.fields||{}).forEach(([k,v])=>{
  if(v.text && (!v.evidence||v.evidence.length===0)) blockers.push(`${k}:缺少证据`);
  if(v.conflict) blockers.push(`${k}:存在来源冲突`);
 });
 return {canPublish:blockers.length===0,blockers};
}
function runAgent(state={}){
 if(!state.documentUploaded)return {step:'UPLOAD_DOCUMENT',message:'等待说明书或院内资料'};
 if(!state.parsed)return {step:'PARSE_DOCUMENT',message:'解析PDF/OCR文本'};
 if(state.missingFields?.length && !state.supplementSearched)return {step:'SEARCH_SUPPLEMENT',message:'寻找外部补充证据'};
 if(state.conflicts?.length)return {step:'PHARMACIST_REVIEW',message:'发现冲突，等待药师裁决'};
 if(!state.reviewed)return {step:'GENERATE_CARD',message:'生成一页速览卡'};
 return {step:'PUBLISHED',message:'已发布知识卡'};
}
return {normalizeEvidenceItem,validateDraft,runAgent};
});