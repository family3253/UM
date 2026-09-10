/* PIVAS v1.4 Pharmacist Review Workflow */
(function(root){
 const ReviewWorkflow={
  states:['DRAFT','EVIDENCE_CHECK','PHARMACIST_REVIEW','PUBLISHED','REJECTED'],
  canPublish(card){
   return !!(card&&card.pharmacistApproved&&card.evidenceComplete&&!card.hasConflict);
  },
  actions:['approve','edit','reject','requestEvidence']
 };
 root.PivasReviewWorkflow=ReviewWorkflow;
})(window);
