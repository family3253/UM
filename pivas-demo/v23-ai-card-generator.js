/*
 PIVAS v23 AI Card Generator
 Restore v0.8 AI card workflow into current architecture.
 Flow:
 Document -> Draft -> Review -> Publish -> Drug Card
*/

window.PIVASAI = window.PIVASAI || {};

PIVASAI.generateCardDraft = function(input){
  const draft = {
    id: 'draft_' + Date.now(),
    name: input.name || '',
    source: input.source || 'uploaded-document',
    fields: input.fields || {},
    status: 'draft',
    createdAt: new Date().toISOString()
  };

  if(window.PIVASKnowledgeManager){
    PIVASKnowledgeManager.createDraft(draft);
  }

  return draft;
};

PIVASAI.publishCard = function(draftId){
  if(window.PIVASKnowledgeManager){
    return PIVASKnowledgeManager.publish(draftId);
  }
  return null;
};
