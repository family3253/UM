/* PIVAS v1.7 AI Card Workflow */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PivasAICardWorkflow=api})(this,function(){
function createTask(file){return {id:'TASK-'+Date.now(),source:file?.name||'unknown',status:'UPLOADED',steps:[{name:'DOCUMENT_PARSE',status:'PENDING'},{name:'FIELD_EXTRACTION',status:'PENDING'},{name:'EVIDENCE_BINDING',status:'PENDING'},{name:'CARD_GENERATION',status:'PENDING'},{name:'PHARMACIST_REVIEW',status:'PENDING'}]}}
function canPublish(card){return !!card && card.pharmacistApproved===true && !card.conflicts?.length && (card.fields||[]).every(f=>f.text===''||f.evidence?.length>0)}
function buildPrompt(text){return `你是PIVAS药品知识维护智能体。仅依据资料生成结构化药品卡。每个字段必须提供来源页码和原文证据。禁止推测。\n资料:\n${text}`}
return {createTask,canPublish,buildPrompt};
});