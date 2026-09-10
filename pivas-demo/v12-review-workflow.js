// PIVAS Agent review workflow model
const ReviewWorkflow = {
  states: [
    'DRAFT_GENERATED',
    'EVIDENCE_CHECK',
    'PHARMACIST_REVIEW',
    'REVISION_REQUIRED',
    'PUBLISHED'
  ],
  transitions: {
    DRAFT_GENERATED: ['EVIDENCE_CHECK'],
    EVIDENCE_CHECK: ['PHARMACIST_REVIEW','REVISION_REQUIRED'],
    PHARMACIST_REVIEW: ['PUBLISHED','REVISION_REQUIRED'],
    REVISION_REQUIRED: ['DRAFT_GENERATED'],
    PUBLISHED: []
  },
  canPublish(card){
    return !!card.reviewApproved &&
      (card.evidence || []).every(e=>e.role==='primary'||e.confirmed===true) &&
      !card.hasConflict;
  }
};

if(typeof module!=='undefined') module.exports=ReviewWorkflow;
