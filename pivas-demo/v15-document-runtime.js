/* PIVAS v1.5 Document Runtime */
(function(root){
 const FIELDS=['drugName','strength','preparation','diluent','stability','storage','infusion','warnings'];
 function chunkText(text,size=1200){const out=[];for(let i=0;i<text.length;i+=size)out.push({text:text.slice(i,i+size),index:out.length+1});return out;}
 function buildPrompt(chunks){return {role:'system',task:'Extract PIVAS drug card fields only from evidence. Do not invent.',chunks,fields:FIELDS};}
 function validateEvidence(card){const missing=FIELDS.filter(k=>card[k]&&(!card[k].evidence||card[k].evidence.length===0));return {ok:missing.length===0,missing};}
 root.PivasDocumentRuntime={chunkText,buildPrompt,validateEvidence};
})(this);
