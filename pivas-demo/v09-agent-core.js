/* PIVAS v0.9 Agent core contract tests target these pure functions. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PivasAgentCore=api})(this,function(){
  function normalizeEvidenceItem(x){ throw new Error('NOT_IMPLEMENTED'); }
  function validateAgentDraft(draft){ throw new Error('NOT_IMPLEMENTED'); }
  function nextAgentStep(state){ throw new Error('NOT_IMPLEMENTED'); }
  return {normalizeEvidenceItem,validateAgentDraft,nextAgentStep};
});