/* PIVAS v23 AI Card Generator - workflow adapter */
window.PIVASAI=window.PIVASAI||{};
PIVASAI.generateCardDraft=function(input={}){
  const draft={id:'draft_'+Date.now(),name:input.name||'',source:input.source||'uploaded-document',fields:input.fields||{},status:'draft',createdAt:new Date().toISOString()};
  if(window.PIVASKnowledgeManager){
    return PIVASKnowledgeManager.createDraft({id:draft.id,createdAt:draft.createdAt,drug:draft});
  }
  return draft;
};
PIVASAI.reviewCard=function(draftId,approved,reviewer='pharmacist'){
  return window.PIVASKnowledgeManager?PIVASKnowledgeManager.review(draftId,approved,reviewer):null;
};
PIVASAI.publishCard=function(draftId){
  return window.PIVASKnowledgeManager?PIVASKnowledgeManager.publish(draftId):null;
};
